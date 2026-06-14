#!/usr/bin/env node
/* genimg.mjs — generate one image via Gemini 3 Pro Image.
 * Usage:
 *   node tools/genimg.mjs --out PATH --prompt "..." [--ref a.png,b.png]
 *        [--aspect 3:2] [--size 2K] [--model gemini-3-pro-image-preview] [--retries 4]
 * Prints a JSON line: {"ok":true,"out":"...","w":2528,"h":1696,"model":"..."}
 * Exits non-zero on failure.
 */
import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai';
import mime from 'mime';
import sharp from 'sharp';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname as pdir } from 'path';

const __dir = pdir(fileURLToPath(import.meta.url));
dotenv.config({ path: `${__dir}/.env` });

function arg(name, def = null) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
}
const OUT = arg('--out');
const PROMPT = arg('--prompt');
const REFS = (arg('--ref', '') || '').split(',').map(s => s.trim()).filter(Boolean);
const ASPECT = arg('--aspect', '3:2');
const SIZE = (arg('--size', '2K') || '2K').toUpperCase();
const MODEL = arg('--model', process.env.GEMINI_MODEL || 'gemini-3-pro-image-preview');
const RETRIES = parseInt(arg('--retries', '4'), 10);
const KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

function die(msg) { console.error('[genimg] ' + msg); process.exit(1); }
if (!OUT) die('missing --out');
if (!PROMPT) die('missing --prompt');
if (!KEY) die('no GEMINI_API_KEY / GOOGLE_GENERATIVE_AI_API_KEY');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  const ai = new GoogleGenAI({ apiKey: KEY });
  const dir = dirname(OUT);
  if (dir && !existsSync(dir)) mkdirSync(dir, { recursive: true });

  let lastErr;
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    const uploaded = [];
    try {
      for (const r of REFS) {
        if (!existsSync(r)) die('ref not found: ' + r);
        const up = await ai.files.upload({ file: r, config: { mimeType: mime.getType(r) || 'image/png' } });
        uploaded.push({ name: up.name, uri: up.uri, mimeType: up.mimeType || 'image/png' });
      }
      const parts = [];
      for (const u of uploaded) parts.push(createPartFromUri(u.uri, u.mimeType));
      if (uploaded.length) parts.push('Use the provided reference image(s) exactly as the prompt specifies.');
      parts.push(PROMPT);

      const config = {
        responseModalities: ['IMAGE', 'TEXT'],
        imageConfig: { aspectRatio: ASPECT, imageSize: SIZE },
      };

      const resp = await ai.models.generateContentStream({
        model: MODEL, config, contents: createUserContent(parts),
      });

      let got = null;
      for await (const chunk of resp) {
        const p = chunk?.candidates?.[0]?.content?.parts;
        if (!p) continue;
        for (const part of p) {
          if (part.inlineData?.data) { got = Buffer.from(part.inlineData.data, 'base64'); break; }
        }
        if (got) break;
      }
      // cleanup uploads
      for (const u of uploaded) { try { await ai.files.delete({ name: u.name }); } catch {} }

      if (!got) throw new Error('no image bytes in response');
      writeFileSync(OUT, got);
      const meta = await sharp(OUT).metadata();
      console.log(JSON.stringify({ ok: true, out: OUT, w: meta.width, h: meta.height, model: MODEL, attempt }));
      return;
    } catch (e) {
      for (const u of uploaded) { try { await ai.files.delete({ name: u.name }); } catch {} }
      lastErr = e;
      const msg = String(e?.message || e);
      const retriable = /429|rate|quota|RESOURCE_EXHAUSTED|500|502|503|UNAVAILABLE|deadline|ETIMEDOUT|ECONNRESET|fetch failed/i.test(msg);
      console.error(`[genimg] attempt ${attempt}/${RETRIES} failed: ${msg.slice(0, 200)}`);
      if (attempt < RETRIES && retriable) { await sleep(2000 * attempt * attempt); continue; }
      if (attempt < RETRIES) { await sleep(1500 * attempt); continue; }
    }
  }
  die('all attempts failed: ' + String(lastErr?.message || lastErr));
}
main();
