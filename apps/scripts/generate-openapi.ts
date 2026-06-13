import fs from "fs";
import { generateOpenApiDocument } from "../api/src/common/openapi/generator";

import path from "path";

const openApiDocument = generateOpenApiDocument();

const docsDir = path.resolve(process.cwd(), 'docs');

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const outputPath = path.join(
  docsDir,
  'openapi.json',
);

fs.writeFileSync(
  outputPath,
  JSON.stringify(openApiDocument, null, 2),
  'utf-8',
);

console.log(
  `OpenAPI document generated: ${outputPath}`,
);

export { openApiDocument };