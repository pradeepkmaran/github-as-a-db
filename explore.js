const axios = require("axios");

// === CONFIG ===
const GITHUB_TOKEN = "PLACEHOLDER_TOKEN"; // placeholder
const OWNER = "pradeepkmaran";
const REPO = "fyp";
const BRANCH = "main";

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

// Recursive function
async function fetchDir(path = "", indent = "") {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;

  const response = await axios.get(url, { headers });
  const items = response.data;

  for (const item of items) {
    if (item.type === "dir") {
      console.log(`${indent}📁 ${item.name}`);
      await fetchDir(item.path, indent + "  ");
    } else if (item.type === "file") {
      console.log(`${indent}📄 ${item.name}`);
    }
  }
}

async function main() {
  try {
    console.log(`\nRepository: ${OWNER}/${REPO}\n`);
    await fetchDir();
  } catch (error) {
    console.error("Error:");
    console.error(error.response?.data || error.message);
  }
}

main();