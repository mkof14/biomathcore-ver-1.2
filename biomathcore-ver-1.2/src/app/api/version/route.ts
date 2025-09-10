import { NextResponse } from 'next/server';
import { execSync } from 'node:child_process';
export async function GET() {
  let rev = 'unknown';
  try { rev = execSync('git rev-parse --short HEAD').toString().trim(); } catch {}
  return NextResponse.json({ rev, cwd: process.cwd(), time: new Date().toISOString() });
}
