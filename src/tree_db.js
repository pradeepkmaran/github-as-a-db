const db = require('./core/engine');

/**
 * RECURSIVE TREE EXAMPLE
 * Usage: node tree_db.js
 */
async function main() {
    try {
        console.log(`Fetching full repository tree...`);
        const tree = await db.getTree();
        
        console.log(`\nRepository Structure (${tree.length} objects):\n`);
        
        // Simple tree visualization
        const structure = {};
        for (const item of tree) {
            const parts = item.path.split('/');
            let current = structure;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                if (!current[part]) current[part] = { _type: item.type };
                current = current[part];
            }
        }

        function printTree(obj, indent = '') {
            for (const key in obj) {
                if (key === '_type') continue;
                const isFile = obj[key]._type === 'blob';
                console.log(`${indent}${isFile ? '📄' : '📁'} ${key}`);
                printTree(obj[key], indent + '  ');
            }
        }

        printTree(structure);
    } catch (error) {
        // Error already logged by library
    }
}

main();
