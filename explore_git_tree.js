const axios = require("axios");

// === CONFIG ===
const GITHUB_TOKEN = "PLACEHOLDER_TOKEN"; // placeholder
const OWNER = "pradeepkmaran";
const REPO = "fyp";
const BRANCH = "main";

async function getRepoTree() {
  try {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`;

    const start = process.hrtime.bigint();

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const end = process.hrtime.bigint();
    const requestTimeMs = Number(end - start) / 1e6;

    const buildStart = process.hrtime.bigint();

    const tree = response.data.tree;
    const structure = {};

    for (const item of tree) {
      const parts = item.path.split("/");
      let current = structure;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    }

    const buildEnd = process.hrtime.bigint();
    const buildTimeMs = Number(buildEnd - buildStart) / 1e6;

    const printStart = process.hrtime.bigint();

    function printTree(obj, indent = "") {
      for (const key in obj) {
        const isFile = Object.keys(obj[key]).length === 0;
        console.log(`${indent}${isFile ? "📄" : "📁"} ${key}`);
        printTree(obj[key], indent + "  ");
      }
    }

    printTree(structure);

    const printEnd = process.hrtime.bigint();
    const printTimeMs = Number(printEnd - printStart) / 1e6;

    console.log("\n--- Timing ---");
    console.log(`API request: ${requestTimeMs.toFixed(2)} ms`);
    console.log(`Build tree: ${buildTimeMs.toFixed(2)} ms`);
    console.log(`Print tree: ${printTimeMs.toFixed(2)} ms`);

  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

getRepoTree();