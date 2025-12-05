import chalk from 'chalk';
import { applyScanlines, wrapWithCrtBorder } from './crtEffects.js';

const labelColor = '#ff8c42';

export function renderMenuScreen(options) {
  const title = chalk.hex(labelColor)('╔═ MASTER NERD OPERATIONS ═╗');
  const life = chalk.hex('#ff4d6d')('♥ ♥ ♥');
  const sub = chalk.hex('#b8a0ff')('SELECT YOUR MISSION');

  const list = options
    .map((opt, idx) => {
      const slot = chalk.hex('#ffd966')(`P${idx + 1}`);
      return `${slot} ► ${chalk.hex('#00ffcc')(opt.label)}`;
    })
    .join('\n');

  const footer = chalk.hex('#7d6bfa')('CRT CURVATURE // HOLD ON');

  const block = [title, life, '', sub, '', list, '', footer].join('\n');
  return applyScanlines(wrapWithCrtBorder(block));
}
