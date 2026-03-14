import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function packAnswerValues(values: number[]): Buffer {
  let buffer = 0;
  let bitsInBuffer = 0;
  const output: number[] = [];

  for (const value of values) {
    buffer = (buffer << 3) | (value & 7);
    bitsInBuffer += 3;

    while (bitsInBuffer >= 8) {
      bitsInBuffer -= 8;
      output.push((buffer >> bitsInBuffer) & 0xff);
      buffer &= (1 << bitsInBuffer) - 1;
    }
  }

  if (bitsInBuffer > 0) {
    output.push((buffer << (8 - bitsInBuffer)) & 0xff);
  }

  return Buffer.from(output);
}

export function buildResultsUrl(answerIndex: number): string {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  const raw = JSON.parse(
    readFileSync(path.resolve(dir, "../src/data/questions.json"), "utf8")
  ) as { questions: { id: string }[] };

  const ids = raw.questions.map((q) => q.id);
  const encoded = packAnswerValues(ids.map(() => answerIndex)).toString(
    "base64url"
  );
  return `/results?r=${encoded}&m=metro&q=${ids.join(",")}`;
}
