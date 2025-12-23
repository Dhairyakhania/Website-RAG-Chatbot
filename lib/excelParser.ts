import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

export function loadKnowledge() {
  const filePath = path.resolve(process.cwd(), "data", "knowledge.xlsx");

  const buffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(buffer, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<any>(sheet);

  return rows.map((row) => ({
    category: String(row.Category || "").toLowerCase(),
    question: String(row.Question || "").toLowerCase(),
    answer: String(row.Answer || ""),
  }));
}
