import chalk from 'chalk';
import { applyScanlines, wrapWithCrtBorder } from './crtEffects.js';

const orange = '#ff8c42';
const white = '#ffffff';
const cyan = '#00ffcc';

export function renderMenuScreen(options) {
  // Header with arcade style
  const title = chalk.hex(orange)('═ MASTER NERD OPERATIONS ═');
  const lives = chalk.hex(orange)('♥ ♥ ♥');
  
  const header = [
    `┌─────────────────────────────────────────────┐`,
    `│ ${title.padEnd(43)} │`,
    `│ ${lives.padEnd(43)} │`,
    `└─────────────────────────────────────────────┘`
  ].map(line => chalk.hex('#8c52ff')(line)).join('\n');

  // Menu options with pixel-style slots (P1, P2, P3, etc.)
  const menuItems = options
    .map((opt, idx) => {
      const slot = chalk.hex(orange)(`P${idx + 1}`);
      const label = chalk.hex(cyan)(opt.label);
      return `  ${slot} ►  ${label}`;
    })
    .join('\n');

  // Game screen background
  const screenBg = [];
  for (let i = 0; i < 8; i++) {
    const glyph = i % 2 === 0 ? '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░' : '▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒';
    screenBg.push(chalk.hex('#541c94')(glyph));
  }

  // Footer
  const footer = chalk.hex('#7d6bfa')('  CRT CURVATURE // HOLD ON');

  const content = [
    header,
    '',
    menuItems,
    '',
    ...screenBg,
    '',
    footer
  ].join('\n');

  return applyScanlines(wrapWithCrtBorder(content));
}
