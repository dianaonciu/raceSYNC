import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { importCSV } from './src/features/csv-import/csv-import.js';
import { getAllUsers } from './src/features/csv-import/db.js';

// Configuration and constants
const isDev = !app.isPackaged;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
    window: {
        width: isDev ? 1200 : 800, // wider window in dev mode
        height: 600,
        webPreferences: {
            preload: path.resolve(__dirname, './src/features/csv-import/preload.js'), // preload-script to use db-content
            contextIsolation: true,
            nodeIntegration: false,
        }
    },
    paths: {
        startUrl: 'http://localhost:5173',
        preload: path.resolve(__dirname, './src/features/csv-import/preload.js'),
        csv: path.join(__dirname, 'public/seed/beispiel.csv')
    }
};

// Create main window
function createWindow() {
    const win = new BrowserWindow(CONFIG.window);

    if (isDev) {
        win.webContents.openDevTools();
    }
    
    win.loadURL(CONFIG.paths.startUrl);
    return win;
}

// Handler - communication between main-process and render-process
function setupIpcHandlers() {
    ipcMain.handle('get-users', async () => {
        try {
            const users = await getAllUsers();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    });
}

// App lifecycle handlers
function setupAppHandlers() {
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
}

// Initialize app
async function initialize() {
    await app.whenReady();
    
    // Create main window
    const mainWindow = createWindow();
    
    // Setup handlers
    setupIpcHandlers();
    setupAppHandlers();

    // Import CSV data
    try {
        await importCSV(CONFIG.paths.csv);
        console.log('CSV import completed');
    } catch (error) {
        console.error('CSV import failed:', error);
    }

    return mainWindow;
}

// Start the application
initialize().catch(error => {
    console.error('Failed to initialize app:', error);
    app.quit();
});