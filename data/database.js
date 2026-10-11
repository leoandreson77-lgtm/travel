import fs from 'fs';
import path from 'path';
import { generate } from './seed-data.js';

const getDbPath = () => {
  const p1 = path.join(process.cwd(), 'data', 'yatrimap.json');
  return p1;
};

const DB_PATH = getDbPath();
const BACKUP_PATH = path.join(path.dirname(DB_PATH), 'yatrimap.backup.json');

class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    if (fs.existsSync(DB_PATH)) {
      try {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        this.data = JSON.parse(raw);
        console.log('[DB] Loaded existing Yatrimap database successfully.');
      } catch (err) {
        console.error('[DB] Failed parsing database, rebuilding from seed...', err);
        this.resetToSeed();
      }
    } else {
      console.log('[DB] No existing database found. Generating comprehensive seed data...');
      this.resetToSeed();
    }
  }

  resetToSeed() {
    try {
      this.data = generate();
      this.save();
      console.log('[DB] Seed data generated and saved to disk.');
    } catch (err) {
      console.error('[DB] Error resetting to seed:', err);
      this.data = {};
    }
  }

  save() {
    try {
      const serialized = JSON.stringify(this.data, null, 2);
      // Atomic write to prevent file corruption
      const tempPath = `${DB_PATH}.tmp`;
      fs.writeFileSync(tempPath, serialized, 'utf-8');
      fs.renameSync(tempPath, DB_PATH);
    } catch (err) {
      console.error('[DB] Error saving database:', err);
    }
  }

  get(collection) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    return this.data[collection];
  }

  find(collection, filterFn) {
    const col = this.get(collection);
    return filterFn ? col.filter(filterFn) : col;
  }

  findOne(collection, filterFn) {
    const col = this.get(collection);
    return col.find(filterFn) || null;
  }

  findById(collection, id) {
    return this.findOne(collection, item => String(item.id) === String(id));
  }

  insert(collection, item) {
    const col = this.get(collection);
    if (!item.id) {
      item.id = `${collection.slice(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    item.createdAt = item.createdAt || new Date().toISOString();
    item.updatedAt = new Date().toISOString();
    col.push(item);
    this.save();
    return item;
  }

  update(collection, id, updates) {
    const col = this.get(collection);
    const index = col.findIndex(item => String(item.id) === String(id));
    if (index === -1) return null;
    col[index] = {
      ...col[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return col[index];
  }

  delete(collection, id) {
    const col = this.get(collection);
    const index = col.findIndex(item => String(item.id) === String(id));
    if (index === -1) return false;
    col.splice(index, 1);
    this.save();
    return true;
  }

  count(collection, filterFn) {
    const items = this.find(collection, filterFn);
    return items.length;
  }
}

const db = new Database();
export default db;
export { Database, db };
