// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  console.log('Preload loaded');
});


contextBridge.exposeInMainWorld('electronAPI', {
  getCategories: () => ipcRenderer.invoke('get-categories'),
  getProduits: () => ipcRenderer.invoke('get-produits'),
  
  setUserId: (id) => ipcRenderer.send('set-user-id', id),
  getUserId: () => ipcRenderer.invoke('get-user-id'),
  
  // Connexion
  login: (username, password) => ipcRenderer.invoke('login', { username, password }),

  // Récupérer un produit par code
  getProductByCode: (code) => ipcRenderer.invoke('getProductByCode', code),

  // Vérifier le code manager
  checkManagerCode: (code) => ipcRenderer.invoke('checkManagerCode', code),

  // Ajouter un ticket dans la BDD
  saveTicket: (cart, user_id) => ipcRenderer.invoke('saveTicket', { cart, user_id }),

});
