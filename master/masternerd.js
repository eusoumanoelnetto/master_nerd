#!/usr/bin/env node
import chalk from 'chalk';
import inquirer from 'inquirer';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { renderStartScreen } from './ui/startScreen.js';
import { renderMenuScreen } from './ui/menuScreen.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptsDir = path.join(__dirname, 'scripts');

const missions = [
  {
    label: 'Format Pen Drive (CMD)',
    script: 'format_pendrive.ps1',
    detail: 'Limpa e formata pendrives automaticamente.'
  },
  {
    label: 'Create Bootable Pendrive',
    script: 'bootable_pendrive.ps1',
    detail: 'Transforma a unidade em mídia bootável.'
  },
  {
    label: 'Install Linux on Windows',
    script: 'install_linux.ps1',
    detail: 'Dispara automação para WSL / dual boot assistido.'
  },
  {
    label: 'Microsoft Activation Scripts',
    script: 'mas_activation.ps1',
    detail: 'Executa o conjunto MAS diretamente.'
  }
];

function clearAndPrint(block) {
  process.stdout.write('\x1b[2J');
  process.stdout.write('\x1b[0f');
  console.log(block);
}

async function showStartScreen() {
  clearAndPrint(renderStartScreen());

  const { startChoice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'startChoice',
      message: chalk.hex('#ffcf22')('Press START?  YES ⟵ NO'),
      choices: ['YES', 'NO'],
      default: 'YES'
    }
  ]);

  if (startChoice === 'NO') {
    console.log(chalk.hex('#ff5fa2')('\nSEE YOU NEXT CREDIT.')); 
    process.exit(0);
  }
}

async function launchScript(scriptFile) {
  const scriptPath = path.join(scriptsDir, scriptFile);
  if (!fs.existsSync(scriptPath)) {
    console.log(chalk.red(`Script not found: ${scriptPath}`));
    return;
  }

  console.log(chalk.hex('#00ffcc')(`\n[CRT] Executing ${scriptFile}...`));
  await new Promise((resolve, reject) => {
    const child = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', scriptPath], {
      stdio: 'inherit'
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.hex('#7dffaf')('\n[OK] Mission complete.'));
        resolve();
      } else {
        console.log(chalk.hex('#ff4d6d')(`\n[ERR] Mission failed with code ${code}.`));
        reject(new Error(`Script exited with code ${code}`));
      }
    });
  }).catch((err) => {
    console.error(chalk.red(err.message));
  });
}

async function showMenu() {
  let active = true;
  while (active) {
    clearAndPrint(renderMenuScreen(missions));
    const { mission } = await inquirer.prompt([
      {
        type: 'list',
        name: 'mission',
        message: chalk.hex('#ffd966')('Select an operation'),
        choices: [
          ...missions.map((m) => ({ name: `${m.label} — ${m.detail}`, value: m.script })),
          new inquirer.Separator(),
          { name: 'Shutdown Arcade', value: 'exit' }
        ]
      }
    ]);

    if (mission === 'exit') {
      active = false;
      break;
    }

    await launchScript(mission);
    await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: chalk.hex('#b8a0ff')('Return to console?'),
        default: true
      }
    ]);
  }

  console.log(chalk.hex('#ff8c42')('\nTHANK YOU FOR PLAYING MASTER NERD!'));
}

(async function run() {
  await showStartScreen();
  await showMenu();
})();
