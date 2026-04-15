const db = require('./core/engine');

class Collection {
    constructor(collectionName) {
        this.basePath = `db/${collectionName}`;
    }

    /**
     * Insert or update a document
     * @param {string} id 
     * @param {object} data 
     */
    async save(id, data) {
        const path = `${this.basePath}/${id}.json`;
        console.log(`Saving document to ${path}...`);
        return await db.writeFile(path, JSON.stringify(data, null, 2), `Update document ${id} in ${this.basePath}`);
    }

    /**
     * Get a document by ID
     * @param {string} id 
     */
    async get(id) {
        const path = `${this.basePath}/${id}.json`;
        try {
            const file = await db.readFile(path);
            return JSON.parse(file.content);
        } catch (error) {
            if (error.message.includes('404')) return null;
            throw error;
        }
    }

    /**
     * List all documents in the collection
     */
    async list() {
        try {
            const items = await db.listFiles(this.basePath);
            return items
                .filter(item => item.name.endsWith('.json'))
                .map(item => item.name.replace('.json', ''));
        } catch (error) {
            if (error.message.includes('404')) return [];
            throw error;
        }
    }

    /**
     * Delete a document
     * @param {string} id 
     */
    async remove(id) {
        const path = `${this.basePath}/${id}.json`;
        return await db.deleteFile(path, `Delete document ${id} from ${this.basePath}`);
    }
}

/**
 * Example Usage
 */
async function runExample() {
    const users = new Collection('users');

    try {
        // 1. Create a user
        console.log('--- Step 1: Saving User ---');
        await users.save('user_1', { name: 'Pradeep', role: 'Developer', timestamp: new Date().toISOString() });

        // 2. List users
        console.log('\n--- Step 2: Listing Collection ---');
        const ids = await users.list();
        console.log('User IDs:', ids);

        // 3. Get user
        console.log(`\n--- Step 3: Fetching user_1 ---`);
        const user = await users.get('user_1');
        console.log('User Data:', user);

    } catch (error) {
        console.error('Collection Operation Failed:', error.message);
    }
}

if (require.main === module) {
    runExample();
}

module.exports = Collection;
