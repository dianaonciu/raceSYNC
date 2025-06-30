
import fs from 'fs';
import Papa from 'papaparse';
import { initializeDatabase, userExists } from './db.js';

// CSV importieren
export function importCSV(filePath) {
    const db = initializeDatabase();
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = Papa.parse(csvContent, { header: true });

    // Prepare statement für Insert
    const insertStmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');

    const validRows = parsed.data.filter(row => row.name?.trim() && row.email?.trim());
    let newRecords = 0;
    let skippedRecords = 0;

    // Transaktion für bessere Performance
    const transaction = db.transaction((rows) => {
        rows.forEach(row => {
            const email = row.email.trim();
            const exists = userExists(email);

            if (!exists) {
                insertStmt.run(row.name.trim(), email);
                newRecords++;
            } else {
                skippedRecords++;
            }
        });
    });

    // Transaktion ausführen
    transaction(validRows);

    console.log(`✅ Import completed:`);
    console.log(`   - ${newRecords} new records imported`);
    console.log(`   - ${skippedRecords} records skipped (already exist)`);
    console.log(`   - ${validRows.length} total valid records processed`);
}