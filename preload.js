// preload.js
console.log('🚀 preload läuft');
import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('api', {
    getUsers: () => ipcRenderer.invoke('get-users'),
});
