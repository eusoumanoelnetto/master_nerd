const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { execFile } = require('child_process');

let mainWindow;
let splashWindow;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  splashWindow.loadFile(path.join(__dirname, 'src', 'splash.html'));
  splashWindow.center();

  // Após 6 segundos, cria a janela principal e fecha o splash
  setTimeout(() => {
    createWindow();
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
      splashWindow = null;
    }
  }, 6000);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 900,
    show: false, // Não mostrar até estar pronto
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
  
  // Mostrar janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Abra o DevTools apenas em ambiente de desenvolvimento ou quando solicitado
  const shouldOpenDevTools = process.env.NODE_ENV === 'development' || process.argv.includes('--devtools');
  if (shouldOpenDevTools) {
    mainWindow.webContents.openDevTools();
  }

  // Log renderer console messages to main process for debugging
  mainWindow.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    console.log(`[renderer:${level}] ${message} (${sourceId}:${line})`);
  });
}

app.on('ready', createSplashWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('launch-script', async (_event, scriptName, payload = {}) => {
  if (process.platform !== 'win32') {
    throw new Error('Somente Windows para diskpart');
  }

  const runCommand = (cmd, args) => new Promise((resolve, reject) => {
    execFile(cmd, args, { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        const err = new Error((stderr || error.message || 'Falha ao executar comando').trim());
        err.stdout = stdout;
        err.stderr = stderr;
        return reject(err);
      }
      resolve({ stdout, stderr });
    });
  });

  switch (scriptName) {
    case 'format-pendrive': {
      // payload.action: 'list' | 'select'
      // payload.disk: number (required for select)
      const action = payload.action || 'list';
      if (action === 'init') {
        return runCommand('powershell.exe', ['-NoProfile', '-Command', '@("list disk","exit") | diskpart']);
      }
      if (action === 'list') {
        return runCommand('powershell.exe', ['-NoProfile', '-Command', '@("list disk","exit") | diskpart']);
      }
      if (action === 'select') {
        if (typeof payload.disk !== 'number') {
          throw new Error('Número de disco não informado');
        }
        const psCmd = `$cmd = @('select disk ${payload.disk}','clean','create partition primary'); $cmd | diskpart`;
        return runCommand('powershell.exe', ['-NoProfile', '-Command', psCmd]);
      }
      if (action === 'format') {
        if (typeof payload.disk !== 'number' || !payload.fs) {
          throw new Error('Disco ou sistema de arquivos não informado');
        }
        const fs = String(payload.fs).toLowerCase();
        const allowed = ['ntfs', 'fat32', 'exfat'];
        if (!allowed.includes(fs)) {
          throw new Error(`Sistema de arquivos inválido: ${payload.fs}`);
        }
        const psCmd = `$cmd = @('select disk ${payload.disk}','select partition 1','format fs=${fs} quick'); $cmd | diskpart`;
        return runCommand('powershell.exe', ['-NoProfile', '-Command', psCmd]);
      }
      if (action === 'volume-info') {
        if (typeof payload.disk !== 'number') {
          throw new Error('Número de disco não informado');
        }
        const psCmd = `
          $diskNumber = ${payload.disk};
          $partition = Get-Partition -DiskNumber $diskNumber -ErrorAction SilentlyContinue |
            Where-Object { $_.Type -ne 'Reserved' } |
            Sort-Object -Property Size -Descending |
            Select-Object -First 1;
          if (-not $partition) { return }
          $volume = $partition | Get-Volume -ErrorAction SilentlyContinue;
          if (-not $volume) { return }
          $info = [PSCustomObject]@{
            DriveLetter = $volume.DriveLetter
            FileSystem = $volume.FileSystem
            SizeGB = [Math]::Round($volume.Size / 1GB, 2)
            FreeGB = [Math]::Round($volume.SizeRemaining / 1GB, 2)
          };
          $info | ConvertTo-Json -Compress
        `;
        return runCommand('powershell.exe', ['-NoProfile', '-Command', psCmd]);
      }
      if (action === 'rename-volume') {
        if (typeof payload.disk !== 'number' || !payload.label) {
          throw new Error('Disco ou novo nome não informado');
        }

        const sanitizedLabel = String(payload.label)
          .replace(/"/g, '')
          .trim();

        if (!sanitizedLabel) {
          throw new Error('Nome inválido para o volume');
        }

        const psCmd = `
          $diskNumber = ${payload.disk};
          $label = "${sanitizedLabel}";
          $partition = Get-Partition -DiskNumber $diskNumber -ErrorAction SilentlyContinue |
            Where-Object { $_.Type -ne 'Reserved' } |
            Sort-Object -Property Size -Descending |
            Select-Object -First 1;
          if (-not $partition) {
            throw "Partição não encontrada para o disco $diskNumber";
          }
          $volume = $partition | Get-Volume -ErrorAction SilentlyContinue;
          if (-not $volume -or -not $volume.DriveLetter) {
            throw "Volume não possui letra atribuída";
          }
          Set-Volume -DriveLetter $volume.DriveLetter -NewFileSystemLabel $label | Out-Null
        `;

        return runCommand('powershell.exe', ['-NoProfile', '-Command', psCmd]);
      }
      throw new Error(`Ação desconhecida: ${action}`);
    }
    case 'microsoft-activation': {
      const cmd = 'irm https://get.activated.win | iex';
      return runCommand('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', cmd]);
    }
    default:
      throw new Error(`Script desconhecido: ${scriptName}`);
  }
});

ipcMain.handle('check-admin', async () => {
  if (process.platform !== 'win32') {
    return false;
  }

  return new Promise((resolve) => {
    const script = '([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)';
    execFile('powershell.exe', ['-NoProfile', '-Command', script], { windowsHide: true }, (error, stdout) => {
      if (error) {
        resolve(false);
        return;
      }
      resolve(/True/i.test((stdout || '').trim()));
    });
  });
});

ipcMain.handle('elevate-app', async () => {
  if (process.platform !== 'win32') {
    throw new Error('A elevação automática está disponível apenas no Windows');
  }

  const escapeQuotes = (value) => String(value || '').replace(/"/g, '""');
  const exePath = escapeQuotes(process.execPath);
  const args = process.argv.slice(1).map(escapeQuotes);
  const argList = args.length ? `@("${args.join('","')}")` : '@()';
  const script = `
    $argsList = ${argList};
    Start-Process -FilePath "${exePath}" -ArgumentList $argsList -Verb RunAs
  `;

  await new Promise((resolve, reject) => {
    execFile('powershell.exe', ['-NoProfile', '-Command', script], { windowsHide: true }, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });

  app.quit();
});
