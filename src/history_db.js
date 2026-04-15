const db = require('./core/engine');

/**
 * HISTORY EXAMPLE
 * Usage: node history_db.js <path>
 */
async function main() {
    const filePath = process.argv[2] || 'README.md';

    try {
        console.log(`Fetching history for: ${filePath}...`);
        const history = await db.getHistory(filePath);
        
        console.log(`\nFound ${history.length} commits affecting this file:\n`);
        history.forEach(commit => {
            console.log(`- [${commit.date}] ${commit.author}: ${commit.message}`);
            console.log(`  SHA: ${commit.id}\n`);
        });
    } catch (error) {
        // Error logged by engine
    }
}

main();
