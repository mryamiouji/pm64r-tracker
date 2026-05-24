const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// electron-serve hosts the bundled Vue app at app://- so /images/, /assets/, etc. resolve correctly
const isDev = !app.isPackaged;
let loadAppContent;

if (!isDev) {
	// Lazy-require so dev mode doesn't need this loaded
	const serve = require('electron-serve');
	loadAppContent = serve({ directory: path.join(__dirname, '..', 'dist') });
}

const createWindow = async () => {
	const win = new BrowserWindow({
		width: 1500,
		height: 950,
		minWidth: 800,
		minHeight: 600,
		title: 'PM64 Randomizer Tracker',
		autoHideMenuBar: true,
		backgroundColor: '#0c4a6e',
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false
		}
	});

	// External links open in the user's default browser
	win.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url);
		return { action: 'deny' };
	});

	if (isDev) {
		await win.loadURL('http://localhost:5173');
		win.webContents.openDevTools({ mode: 'detach' });
	} else {
		await loadAppContent(win);
	}
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
