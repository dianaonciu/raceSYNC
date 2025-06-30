import Database from 'better-sqlite3';

const DB_FILE = 'data.db';
const TABLE_NAME = 'users';

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT
  )
`;

// DB initialisieren
export function initializeDatabase() {
    const db = new Database(DB_FILE);
    db.prepare(CREATE_TABLE_SQL).run();
    return db;
}

// Nutzer abrufen
export function getAllUsers() {
    const db = initializeDatabase();
    const stmt = db.prepare('SELECT * FROM users');
    return stmt.all();
}

// Einzelnen Nutzer einfügen
export function insertUser(name, email) {
    const db = initializeDatabase();
    const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
    return stmt.run(name, email);
}

// Prüfen ob Nutzer existiert
export function userExists(email) {
    const db = initializeDatabase();
    const stmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?');
    return stmt.get(email).count > 0;
}