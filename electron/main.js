import { app, BrowserWindow } from 'electron';
import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let serverProcess;

function startServer() {
  const serverPath = path.join(__dirname, '../server/index.js');
  serverProcess = fork(serverPath, [], {
    env: { ...process.env, PORT: '3101' },
  });
  console.log('Express backend server spawned on port 3101');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'PT Bahana Security Sistem - Operational Automation',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const distPath = path.join(__dirname, '../dist/index.html');
  mainWindow.loadFile(distPath).catch(() => {
    mainWindow.loadURL('http://localhost:3000');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
