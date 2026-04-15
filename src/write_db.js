const db = require('./core/engine');

/**
 * WRITE/UPSERT FILE EXAMPLE
 * Usage: node write_db.js <path> <content>
 */
async function main() {
    const filePath = process.argv[2];
    const content = process.argv[3];

    if (!filePath || !content) {
        console.log('Usage: node write_db.js <path> <content>');
        console.log('Example: node write_db.js data/user.json \'{"name": "Pradeep"}\'');
        return;
    }

    try {
        console.log(`Writing to ${filePath}...`);
        const result = await db.writeFile(filePath, content, `Update ${filePath} via GitHubDB`);
        console.log('Success!');
        console.log(`New SHA: ${result.content.sha}`);
    } catch (error) {
        // Error already logged by library
    }
}

main();
