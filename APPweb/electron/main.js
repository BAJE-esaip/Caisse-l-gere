// electron/main.js
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connexion BDD SQLite
let db;
let globalState = {
  user_id: null
};
try {
  db = new Database(path.join(__dirname, "../database/BDDleger.db"), { verbose: console.log });
  db.pragma("foreign_keys = ON");
  console.log("Connexion SQLite OK !");
} catch (err) {
  console.error("Erreur SQLite :", err);
}


ipcMain.on('set-user-id', (event, id) => {
  globalState.user_id = id;
  console.log("globalState.user_id mis à jour :", globalState.user_id);
});

ipcMain.handle('get-user-id', () => {
  return globalState.user_id;
});

// requête pour la page de connextion
ipcMain.handle("login", (event, { username, password }) => {
  const stmt = db.prepare(
    `SELECT id_employer, pseudonyme, role
     FROM employer
     WHERE identifiant = ? AND password = ?`
  );
  const user = stmt.get(username, password);

  if (user) {
    return { success: true, user };
  } else {
    return { success: false, message: "Identifiant ou mot de passe incorrect" };
  }

});

// --- IPC : rechercher un produit par code ---
ipcMain.handle("getProductByCode", (event, code) => {
  try {
    const stmt = db.prepare("SELECT * FROM produit WHERE barcode = ?");
    const product = stmt.get(code);
    return product || null;
  } catch (err) {
    console.error("Erreur getProductByCode :", err);
    return null;
  }
});

// requête qui vérifier code d'un manager
ipcMain.handle("checkManagerCode", (event, code) => {
  try {
    const stmt = db.prepare("SELECT * FROM employer WHERE role = 'Manager' AND code = ?");
    const manager = stmt.get(code);
    return manager ? { success: true } : { success: false };
  } catch (err) {
    console.error("Erreur checkManagerCode :", err);
    return { success: false };
  }
});

// --- IPC : enregistrer un ticket ---
ipcMain.handle("saveTicket", (event, { cart, user_id }) => {
  try {
    if (!user_id) throw new Error("Utilisateur non connecté !");
    
    const uuid = uuidv4();

    const insertTicket = db.prepare(
      "INSERT INTO ticket (date, uuid, id_employer) VALUES (datetime('now'), ?, ?)"
    );
    const result = insertTicket.run(uuid, user_id);
    const ticketId = result.lastInsertRowid;

    const insertProduit = db.prepare(
      "INSERT INTO posseder (id_ticket, id_produit, quantite) VALUES (?, ?, ?)"
    );

    const insertMany = db.transaction((cartItems) => {
      for (const item of cartItems) {
        insertProduit.run(ticketId, item.id_produit, item.quantity);
      }
    });

    insertMany(cart);

    return { success: true };
  } catch (err) {
    console.error("Erreur saveTicket :", err);
    return { success: false, message: err.message };
  }
});


// --- Création de la fenêtre principale ---
function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (!app.isPackaged) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
