export const runtime = "nodejs";
function wav(bytes: Uint8Array, sampleRate=44100, numChannels=1) {
  const blockAlign = numChannels * 2; // 16-bit
  const byteRate = sampleRate * blockAlign;
  const dataSize = bytes.length;
  const buffer = new Uint8Array(44 + dataSize);
  const dv = new DataView(buffer.buffer);
  let p=0;
  function w4(s){ buffer.set(new TextEncoder().encode(s), p); p+=4; }
  function u32(v){ dv.setUint32(p, v, true); p+=4; }
  function u16(v){ dv.setUint16(p, v, true); p+=2; }
  // RIFF header
  w4("RIFF"); u32(36 + dataSize); w4("WAVE");
  // fmt
  w4("fmt "); u32(16); u16(1); u16(numChannels); u32(sampleRate); u32(byteRate); u16(blockAlign); u16(16);
  // data
  w4("data"); u32(dataSize); buffer.set(bytes, 44);
  return buffer;
}
export async function POST(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  const body = await req.json().catch(()=>({}));
  const text = String(body?.text ?? "beep");
  const dur = 0.6, sr=44100, hz=440;
  const samples = Math.floor(dur*sr);
  const pcm = new Int16Array(samples);
  for (let i=0;i<samples;i++) {
    const v = Math.sin(2*Math.PI*hz*(i/sr)) * 0.3;
    pcm[i] = Math.max(-1, Math.min(1, v)) * 32767;
  }
  const bytes = new Uint8Array(pcm.buffer);
  const wavBuf = wav(bytes, sr, 1);
  return new Response(wavBuf, { headers:{ "Content-Type":"audio/wav", "Content-Disposition": `inline; filename="tts.wav"`, "X-Text": encodeURIComponent(text) }});
}

export {};
