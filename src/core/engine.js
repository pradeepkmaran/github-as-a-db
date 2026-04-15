require('dotenv').config();
const axios = require('axios');

class GitHubDBEngine {
    constructor() {
        this.token = process.env.GITHUB_TOKEN;
        this.owner = process.env.OWNER;
        this.repo = process.env.REPO;
        this.branch = process.env.BRANCH || 'main';
        
        if (!this.token) {
            throw new Error('GITHUB_TOKEN is not defined in .env');
        }

        this.client = axios.create({
            baseURL: 'https://api.github.com',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
    }

    /**
     * Read a file from the repository
     */
    async readFile(path) {
        try {
            const response = await this.client.get(`/repos/${this.owner}/${this.repo}/contents/${path}?ref=${this.branch}`);
            const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
            return {
                content,
                sha: response.data.sha,
                size: response.data.size
            };
        } catch (error) {
            this.handleError(error, `reading file ${path}`);
        }
    }

    /**
     * Write (create or update) a file
     */
    async writeFile(path, content, message = 'Update from GitHubDB') {
        let sha;
        try {
            const existing = await this.client.get(`/repos/${this.owner}/${this.repo}/contents/${path}?ref=${this.branch}`);
            sha = existing.data.sha;
        } catch (error) {
            if (error.response?.status !== 404) throw error;
        }

        try {
            const response = await this.client.put(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
                message,
                content: Buffer.from(content).toString('base64'),
                branch: this.branch,
                sha
            });
            return response.data;
        } catch (error) {
            this.handleError(error, `writing file ${path}`);
        }
    }

    /**
     * Delete a file
     */
    async deleteFile(path, message = 'Delete from GitHubDB') {
        try {
            const existing = await this.client.get(`/repos/${this.owner}/${this.repo}/contents/${path}?ref=${this.branch}`);
            const sha = existing.data.sha;

            const response = await this.client.delete(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
                data: {
                    message,
                    sha,
                    branch: this.branch
                }
            });
            return response.data;
        } catch (error) {
            this.handleError(error, `deleting file ${path}`);
        }
    }

    /**
     * List files in a directory
     */
    async listFiles(path = '') {
        try {
            const response = await this.client.get(`/repos/${this.owner}/${this.repo}/contents/${path}?ref=${this.branch}`);
            return response.data;
        } catch (error) {
            this.handleError(error, `listing directory ${path}`);
        }
    }

    /**
     * Get the full repository tree recursively
     */
    async getTree() {
        try {
            const response = await this.client.get(`/repos/${this.owner}/${this.repo}/git/trees/${this.branch}?recursive=1`);
            return response.data.tree;
        } catch (error) {
            this.handleError(error, 'fetching tree');
        }
    }

    /**
     * Search for code/content
     */
    async search(query) {
        try {
            const response = await this.client.get(`/search/code?q=${encodeURIComponent(query)}+repo:${this.owner}/${this.repo}`);
            return response.data.items;
        } catch (error) {
            this.handleError(error, `searching for ${query}`);
        }
    }

    /**
     * Fetch file history (Commits)
     */
    async getHistory(path) {
        try {
            const response = await this.client.get(`/repos/${this.owner}/${this.repo}/commits`, {
                params: { path, sha: this.branch }
            });
            return response.data.map(commit => ({
                id: commit.sha,
                author: commit.commit.author.name,
                date: commit.commit.author.date,
                message: commit.commit.message
            }));
        } catch (error) {
            this.handleError(error, `fetching history for ${path}`);
        }
    }

    /**
     * Batch write multiple files in ONE COMMIT
     */
    async batchWrite(files, message = 'Batch update') {
        try {
            const branchRef = await this.client.get(`/repos/${this.owner}/${this.repo}/git/ref/heads/${this.branch}`);
            const latestCommitSha = branchRef.data.object.sha;

            const latestCommit = await this.client.get(`/repos/${this.owner}/${this.repo}/git/commits/${latestCommitSha}`);
            const baseTreeSha = latestCommit.data.tree.sha;

            const treeItems = files.map(file => ({
                path: file.path,
                mode: '100644',
                type: 'blob',
                content: file.content
            }));

            const newTree = await this.client.post(`/repos/${this.owner}/${this.repo}/git/trees`, {
                base_tree: baseTreeSha,
                tree: treeItems
            });

            const newCommit = await this.client.post(`/repos/${this.owner}/${this.repo}/git/commits`, {
                message,
                tree: newTree.data.sha,
                parents: [latestCommitSha]
            });

            await this.client.patch(`/repos/${this.owner}/${this.repo}/git/refs/heads/${this.branch}`, {
                sha: newCommit.data.sha
            });

            return { commit: newCommit.data.sha, files: files.length };
        } catch (error) {
            this.handleError(error, 'batch write operation');
        }
    }

    /**
     * Repository metadata
     */
    async getStats() {
        try {
            const response = await this.client.get(`/repos/${this.owner}/${this.repo}`);
            return {
                name: response.data.full_name,
                size: response.data.size,
                stars: response.data.stargazers_count,
                updated: response.data.updated_at
            };
        } catch (error) {
            this.handleError(error, 'fetching stats');
        }
    }

    handleError(error, action) {
        const message = error.response?.data?.message || error.message;
        console.error(`Error during ${action}:`, message);
        throw new Error(`GitHubDB Error (${action}): ${message}`);
    }
}

module.exports = new GitHubDBEngine();
