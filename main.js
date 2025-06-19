import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('Hello from Electron 👋');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'), // optional
        },
    });

    const devUrl = process.env.VITE_DEV_SERVER_URL;
    const prodIndex = `file://${path.join(__dirname, 'dist/index.html')}`;

    win.loadURL(devUrl || prodIndex);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
