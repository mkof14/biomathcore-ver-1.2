import JSZip from "jszip";
import { Parser as Json2Csv } from "@json2csv/plainjs";

export function toCsv<T extends Record<string, any>>(rows: T[], fields?: string[]) {
  const parser = new Json2Csv({ fields: fields ?? Object.keys(rows[0] ?? {}) });
  return parser.parse(rows);
}

export async function toZip<T extends Record<string, any>>(name: string, rows: T[], fields?: string[]) {
  const zip = new JSZip();
  const json = JSON.stringify(rows, null, 2);
  zip.file(`${name}.json`, json);
  const csv = rows.length ? toCsv(rows, fields) : "";
  zip.file(`${name}.csv`, csv);
  return zip.generateAsync({ type: "nodebuffer" });
}
