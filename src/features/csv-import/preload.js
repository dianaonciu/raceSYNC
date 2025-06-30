// preload.js
console.log('🚀 preload läuft');
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
    getUsers: () => ipcRenderer.invoke('get-users'),
});