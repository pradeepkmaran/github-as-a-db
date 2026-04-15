const db = require('./core/engine');

/**
 * SEARCH EXAMPLE
 * Usage: node search_db.js <query>
 */
async function main() {
    const query = process.argv[2];

    if (!query) {
        console.log('Usage: node search_db.js <query>');
        return;
    }

    try {
        console.log(`Searching for "${query}" in the repository...`);
        const results = await db.search(query);
        
        console.log(`\nFound ${results.length} results:\n`);
        results.forEach(item => {
            console.log(`- ${item.path} (Score: ${item.score})`);
            console.log(`  URL: ${item.html_url}\n`);
        });
    } catch (error) {
        // Error already logged by library
    }
}

main();
