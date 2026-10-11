import db from '../data/database.js';

const globalForDb = globalThis;

if (!globalForDb.__yatrimapDb) {
  globalForDb.__yatrimapDb = db;
}

export default globalForDb.__yatrimapDb;
