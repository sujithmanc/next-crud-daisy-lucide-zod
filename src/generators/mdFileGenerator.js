const fs = require("fs");
const path = require("path");

// -------- CLI CONFIG --------
// Usage:
// node generate-md.js <dir> --sep="\" --title=true

const args = process.argv.slice(2);

    const ROOT_DIR = "F:\\GIT HUB ORIGINALS\\next-crud-daisy-lucide-zod\\src\\app\\(prac)\\practice\\planets";

const OUTPUT_FILE = "output.md";

// flags
const separatorArg = args.find(a => a.startsWith("--sep="));
const includeTitleArg = args.find(a => a.startsWith("--title="));

const TITLE_SEPARATOR = separatorArg ? separatorArg.split("=")[1] : "/";
const INCLUDE_TITLE = includeTitleArg ? includeTitleArg.split("=")[1] === "true" : true;

// root folder name
const ROOT_FOLDER_NAME = path.basename(ROOT_DIR);

let mdContent = "";

/**
 * Normalize path with custom separator
 */
function formatPath(relativePath) {
  return `${ROOT_FOLDER_NAME}${TITLE_SEPARATOR}${relativePath.split(path.sep).join(TITLE_SEPARATOR)}`;
}

/**
 * Recursively read directory
 */
function readDirRecursive(dir) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      readDirRecursive(fullPath);
    } else {
      try {
        const relativePath = path.relative(ROOT_DIR, fullPath);
        const finalTitle = formatPath(relativePath);

        const fileContent = fs.readFileSync(fullPath, "utf-8");

        // 👉 Title flag
        if (INCLUDE_TITLE) {
          mdContent += `# ${finalTitle}\n\n`;
        }

        mdContent += "```text\n";
        mdContent += fileContent + "\n";
        mdContent += "```\n\n";
        mdContent += "---\n\n";

      } catch (err) {
        console.warn(`Skipping file: ${fullPath}`);
      }
    }
  });
}

// Run
readDirRecursive(ROOT_DIR);

// Write output
fs.writeFileSync(OUTPUT_FILE, mdContent, "utf-8");

console.log(`✅ Markdown generated: ${OUTPUT_FILE}`);