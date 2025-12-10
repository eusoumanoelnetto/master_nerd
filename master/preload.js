const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  launchScript: (scriptName, payload) => ipcRenderer.invoke('launch-script', scriptName, payload),
  getPlatform: () => process.platform,
  isAdmin: () => ipcRenderer.invoke('check-admin'),
  elevateApp: () => ipcRenderer.invoke('elevate-app')
});
