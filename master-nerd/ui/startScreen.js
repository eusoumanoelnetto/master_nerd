import chalk from 'chalk';
import figlet from 'figlet';
import { applyScanlines, wrapWithCrtBorder, renderGridBackdrop } from './crtEffects.js';

const orange = '#ff8c42';
const hiScoreColor = '#ffd966';

function renderTitle() {
  const ascii = figlet.textSync('Master Nerd', { font: 'DOS Rebel' });
  return chalk.hex(orange)(ascii);
}

function renderStatusBar() {
  const hiScore = chalk.hex(hiScoreColor)('HI-SCORE 1986');
  const credit = chalk.hex('#ff5fa2')('♥  CREDIT 03');
  return `${hiScore.padEnd(40)}${credit}`;
}

function renderSelector() {
  const yes = chalk.hex('#00ffcc')('YES');
  const no = chalk.hex('#ff3f81')('NO');
  const arrow = chalk.hex('#ffd966')('⟵');
  return `${yes}   ${arrow}   ${no}`;
}

export function renderStartScreen() {
  const grid = renderGridBackdrop();
  const title = renderTitle();
  const status = renderStatusBar();
  const startLabel = chalk.hex('#ffcf22')('PRESS START');
  const selector = renderSelector();
  const hint = chalk.hex('#b8a0ff')('Use setas ou ENTER para decidir.');

  const block = [
    status,
    '',
    title,
    '',
    chalk.hex('#f8f7ff')('ANALOG SCAN MODE // CRT-8B'),
    '',
    startLabel,
    selector,
    hint
  ].join('\n');

  const framed = wrapWithCrtBorder(`${grid}\n${block}`);
  return applyScanlines(framed);
}
