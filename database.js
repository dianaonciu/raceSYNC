import Database from 'better-sqlite3';
import fs from 'fs';
import Papa from 'papaparse';

const DB_FILE = 'data.db';
const TABLE_NAME = 'users';

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT
  )
`;

const INSERT_SQL = `INSERT INTO ${TABLE_NAME} (name, email) VALUES (?, ?)`;

// DB initialisieren
function initializeDatabase() {
    const db = new Database(DB_FILE);
    db.prepare(CREATE_TABLE_SQL).run();
    return db;
}

// CSV importieren
export function importCSV(filePath) {
    const db = initializeDatabase();
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = Papa.parse(csvContent, { header: true });
    const stmt = db.prepare(INSERT_SQL);

    const validRows = parsed.data.filter(row => row.name?.trim() && row.email?.trim());

    validRows.forEach(row => {
        stmt.run(row.name.trim(), row.email.trim());
    });

    console.log(`✅ ${validRows.length} Datensätze importiert.`);
}
export function getAllUsers() {
    const db = new Database('data.db');
    const stmt = db.prepare('SELECT * FROM users');
    return stmt.all(); // gibt Array von User-Objekten zurück
}