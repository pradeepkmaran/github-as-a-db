const axios = require("axios");

// === CONFIG ===
const GITHUB_TOKEN = "PLACEHOLDER_TOKEN"; // placeholder
const OWNER = "pradeepkmaran";
const REPO = "fyp";
const FILE_PATH = "app/signer-client/src/App.jsx";
const BRANCH = "main";

async function getFileFromGitHub() {
  try {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;

    const start = process.hrtime.bigint();

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;

    const decodeStart = process.hrtime.bigint();

    const decodedContent = Buffer.from(
      response.data.content,
      "base64"
    ).toString("utf-8");

    const decodeEnd = process.hrtime.bigint();
    const decodeMs = Number(decodeEnd - decodeStart) / 1e6;

    console.log(`HTTP request time: ${durationMs.toFixed(2)} ms`);
    console.log(`Decode time: ${decodeMs.toFixed(2)} ms\n`);

    console.log("File content:\n");
    console.log(decodedContent);

  } catch (error) {
    console.error("Error fetching file:");
    console.error(error.response?.data || error.message);
  }
}

getFileFromGitHub();