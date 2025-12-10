import chalk from 'chalk';
import { applyScanlines, wrapWithCrtBorder } from './crtEffects.js';

const orange = '#ff8c42';
const white = '#ffffff';
const hiScoreColor = '#ffd966';
const hearts = '♥♥♥♥♥';

// Pixelated 8-bit START text (using Unicode block elements)
function renderStartText() {
  return `
███████ ████████   █████  ██████  ████████ 
██         ██      ██   ██ ██   ██    ██    
███████    ██      ███████ ██████     ██    
     ██    ██      ██   ██ ██   ██    ██    
███████    ██      ██   ██ ██   ██    ██    
  `.trim().split('\n').map(line => chalk.hex(orange)(line)).join('\n');
}

// Purple/dark grid backdrop
function renderGameScreen() {
  const lines = [];
  for (let i = 0; i < 12; i++) {
    const glyph = i % 2 === 0 ? '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░' : '▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒';
    lines.push(chalk.hex('#541c94')(glyph));
  }
  return lines.join('\n');
}

export function renderStartScreen() {
  // Header: HI-SCORE on left, HEARTS on right
  const hiScore = chalk.hex(hiScoreColor)('HI-SCORE');
  const scoreNum = chalk.hex(hiScoreColor)('1230000');
  const heartsDisplay = chalk.hex(orange)(hearts);
  
  const header = `${hiScore.padEnd(20)}${scoreNum.padEnd(15)}${heartsDisplay}`;

  // START title (pixelated ASCII)
  const startTitle = renderStartText();

  // Game screen background with scanlines
  const gameScreen = renderGameScreen();

  // Prompt
  const prompt = chalk.hex(white)('ARE YOU READY?');
  const promptPad = prompt.padStart(25).padEnd(50);

  // YES / NO selector with arrow
  const yes = chalk.hex(white)('YES');
  const no = chalk.hex(white)('NO');
  const arrow = chalk.hex(orange)('⟵');
  const selector = `${yes.padEnd(15)}${arrow.padEnd(10)}${no}`;
  const selectorPad = selector.padStart(25).padEnd(50);

  // Build the screen content
  const content = [
    header,
    '',
    startTitle,
    '',
    gameScreen,
    '',
    promptPad,
    selectorPad
  ].join('\n');

  // Frame with CRT border and apply scanlines
  const framed = wrapWithCrtBorder(content);
  return applyScanlines(framed);
}
