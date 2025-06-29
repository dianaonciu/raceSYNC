import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { importCSV, getAllUsers } from './database.js';

const isDev = !app.isPackaged; // erkennt Dev-Modus
const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

ipcMain.handle('get-users', () => {
    return getAllUsers();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    win.loadURL(startUrl);
}

app.whenReady().then(() => {
    createWindow();

    // Optional: CSV beim Start importieren
    const csvPath = path.join(__dirname, 'beispiel.csv');
    importCSV(csvPath);
});
