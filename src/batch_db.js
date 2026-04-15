const db = require('./core/engine');

/**
 * BATCH WRITE EXAMPLE
 * Writes multiple files in a single commit.
 */
async function main() {
    const files = [
        { path: 'db/batch/file1.txt', content: 'Content of file 1' },
        { path: 'db/batch/file2.txt', content: 'Content of file 2' },
        { path: 'db/batch/metadata.json', content: JSON.stringify({ batch: true, timestamp: new Date() }, null, 2) }
    ];

    try {
        console.log(`Performing batch write for ${files.length} files...`);
        const result = await db.batchWrite(files, 'New batch atomic update');
        console.log('Success!');
        console.log(`Commit SHA: ${result.commit}`);
    } catch (error) {
        // Error logged by engine
    }
}

main();
