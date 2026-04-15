const db = require('./core/engine');

/**
 * DELETE FILE EXAMPLE
 * Usage: node delete_db.js <path>
 */
async function main() {
    const filePath = process.argv[2];

    if (!filePath) {
        console.log('Usage: node delete_db.js <path>');
        return;
    }

    try {
        console.log(`Deleting ${filePath}...`);
        await db.deleteFile(filePath, `Delete ${filePath} via GitHubDB`);
        console.log('Successfully deleted!');
    } catch (error) {
        // Error already logged by library
    }
}

main();
