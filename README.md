# GitHub as a Database (Pro)

This project transforms a GitHub repository into a fully-featured, version-controlled database. All logic is now organized within the `src/` directory for better maintainability.

## 🏗️ Architecture

-   **`src/core/engine.js`**: The core database engine (replaces `github_db.js`). It handles authentication, communication, and complex Git Data operations.
-   **`src/collections.js`**: High-level NoSQL abstraction (Collections/Documents).
-   **`src/api-scripts`**: Standalone tools for database management.

## 🚀 Getting Started

1.  **Configure `.env`**:
    ```env
    GITHUB_TOKEN=your_pat
    OWNER=your_username
    REPO=github-as-a-db
    BRANCH=main
    ```
2.  **Install**: `npm install`
3.  **Run**: `node src/read_db.js`

## 🛠️ Extended Functionalities

All tools are located in the `src/` folder:

| Tool | Description | Usage |
| :--- | :--- | :--- |
| `read_db.js` | Read file/record content | `node src/read_db.js <path>` |
| `write_db.js` | Create/Update a record | `node src/write_db.js <path> <content>` |
| `delete_db.js` | Delete a record | `node src/delete_db.js <path>` |
| `list_db.js` | List records in a path | `node src/list_db.js <path>` |
| `tree_db.js` | View database structure | `node src/tree_db.js` |
| `search_db.js` | Search across the DB | `node src/search_db.js <query>` |
| `batch_db.js` | **[New]** Atomic multi-file write | `node src/batch_db.js` |
| `history_db.js` | **[New]** Record audit trail | `node src/history_db.js <path>` |
| `stats_db.js` | **[New]** Database/Repo stats | `node src/stats_db.js` |
| `collections.js`| NoSQL-style API | See internal docs |

## 💎 Advanced: Atomic Batch Writes

Use `batchWrite` in the engine to update multiple records in a single commit (transaction-like):

```javascript
const db = require('./core/engine');
await db.batchWrite([
    { path: 'users/1.json', content: '...' },
    { path: 'logs/1.txt', content: '...' }
], 'Updating multiple records');
```

## 📜 Audit Trail

Every database change is a commit. Use `history_db.js` to see who changed a record and when.

---
Created with ❤️ by Antigravity
