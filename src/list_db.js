const db = require('./core/engine');

/**
 * LIST DIRECTORY EXAMPLE
 * Usage: node list_db.js <path>
 */
async function main() {
    const dirPath = process.argv[2] || '';

    try {
        console.log(`Listing directory: ${dirPath || 'root'}...`);
        const items = await db.listFiles(dirPath);
        
        console.log(`\nFound ${items.length} items:\n`);
        items.forEach(item => {
            const icon = item.type === 'dir' ? '📁' : '📄';
            console.log(`${icon} ${item.name} (${item.size} bytes)`);
        });
    } catch (error) {
        // Error already logged by library
    }
}

main();
