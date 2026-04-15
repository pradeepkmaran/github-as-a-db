const db = require('./core/engine');

/**
 * READ FILE EXAMPLE
 * Usage: node read_db.js <path>
 */
async function main() {
    const filePath = process.argv[2] || 'README.md';
    try {
        console.log(`Reading: ${filePath}...`);
        const file = await db.readFile(filePath);
        console.log(`\n--- Content (SHA: ${file.sha}) ---\n`);
        console.log(file.content);
    } catch (error) {
        // Error already logged by library
    }
}

main();
