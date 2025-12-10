import chalk from 'chalk';

const borderTop = (width) => `▛${'▀'.repeat(width)}▜`;
const borderBottom = (width) => `▙${'▄'.repeat(width)}▟`;

export function wrapWithCrtBorder(block) {
  const lines = block.trimEnd().split('\n');
  const contentWidth = Math.max(...lines.map((line) => line.length));
  const padded = lines.map((line) => {
    const gap = contentWidth - line.length;
    return `▌${line}${' '.repeat(gap)}▐`;
  });

  return [
    chalk.hex('#8c52ff')(borderTop(contentWidth)),
    ...padded.map((line) => chalk.hex('#b086ff')(line)),
    chalk.hex('#8c52ff')(borderBottom(contentWidth))
  ].join('\n');
}

export function applyScanlines(block) {
  return block
    .split('\n')
    .map((line, index) => {
      if (line.trim() === '') {
        return line;
      }
      if (index % 2 === 0) {
        return chalk.hex('#f5f1ff')(line);
      }
      const shaded = line.replace(/ /g, '·');
      return chalk.hex('#6f3fd6')(shaded);
    })
    .join('\n');
}

export function renderGridBackdrop(width = 64, height = 8) {
  const rows = [];
  for (let y = 0; y < height; y += 1) {
    const even = y % 2 === 0;
    const glyph = even ? '░' : '▒';
    rows.push(chalk.hex('#541c94')(glyph.repeat(width)));
  }
  return rows.join('\n');
}

export function vignette(text) {
  const lines = text.split('\n');
  return lines
    .map((line) => {
      const left = chalk.hex('#2d0a4d')('▌');
      const right = chalk.hex('#2d0a4d')('▐');
      return `${left}${line}${right}`;
    })
    .join('\n');
}
