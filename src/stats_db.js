const db = require('./core/engine');

/**
 * REPO STATS EXAMPLE
 */
async function main() {
    try {
        console.log('Fetching database (repository) statistics...');
        const stats = await db.getStats();
        
        console.log('\n--- Database Stats ---');
        console.log(`Repository:  ${stats.name}`);
        console.log(`Size:        ${stats.size} KB`);
        console.log(`Stars:       ${stats.stars}`);
        console.log(`Last Update: ${stats.updated}`);
        console.log('----------------------\n');
    } catch (error) {
        // Error logged by engine
    }
}

main();
