# Master Nerd Arcade CLI

Retro arcade-inspired CRT console that launches Master Nerd automation scripts through a Node.js interface.

## Features
- Fullscreen CRT layout with scanlines, purple grid backdrop, orange START title, Hi-Score banner, hearts and YES ⟵ NO selector.
- Animated-style menu that launches PowerShell automation pipelines.
- Modular UI components (`ui/`) for start screen, menu, and CRT effects.
- Script launcher that shells out to `powershell.exe -ExecutionPolicy Bypass -File scripts/*.ps1`.
- Ready to compile into a standalone Windows executable using `pkg`.

## Project Layout
```
master-nerd/
├─ masternerd.js           # CLI entry point
├─ package.json            # Dependencies (chalk, inquirer, figlet)
├─ ui/
│  ├─ startScreen.js       # START screen ASCII + CRT chrome
│  ├─ menuScreen.js        # Arcade menu frame
│  └─ crtEffects.js        # Scanlines, grid, borders
├─ scripts/
│  ├─ format_pendrive.ps1
│  ├─ bootable_pendrive.ps1
│  ├─ install_linux.ps1
│  └─ mas_activation.ps1
└─ README.md
```

## Requirements
- Node.js 18+
- Windows PowerShell available in `PATH`

## Install & Run
```powershell
cd master-nerd
npm install
npm start
```
The CLI clears the terminal, renders the CRT START screen, and asks if you want to begin. Selecting **YES** reveals the main arcade menu; each menu item runs its respective PowerShell automation in the `scripts` folder.

### One-line Installer
```powershell
irm https://raw.githubusercontent.com/eusoumanoelnetto/master_nerd/master/get.ps1 | iex
```
(Adjust the URL if you fork the project.)

## Building MasterNerd.exe with pkg

1. Install [`pkg`](https://github.com/vercel/pkg):
   ```powershell
   npm install -g pkg
   ```

2. From the `master-nerd` folder, run:
   ```powershell
   pkg masternerd.js `
     --targets node18-win-x64 `
     --output MasterNerd.exe `
     --compress Brotli
   ```

3. Ship `MasterNerd.exe` together with the `scripts` directory so that the PowerShell missions remain available.

### Automated Builds via GitHub Actions

When you tag a release (e.g., `git tag v1.0.0 && git push --tags`), the `.github/workflows/build-release.yml` workflow automatically:

- Builds the EXE
- Creates a GitHub Release
- Uploads `MasterNerd.exe` for download

Users can then download the pre-built EXE directly from the Releases page without needing to compile it themselves.

## PowerShell Missions

Each menu option calls one of the scripts below:

- `scripts/format_pendrive.ps1`
- `scripts/bootable_pendrive.ps1`
- `scripts/install_linux.ps1`
- `scripts/mas_activation.ps1`

Replace the placeholder commands with your production-ready automation logic. The Node launcher surfaces the script output directly in the CRT console.

## Ideas for Future UI Enhancements

1. Add a subtle green phosphor fade by re-rendering frames with decreasing brightness.
2. Implement sprite-style transitions between menu states using incremental ASCII wipes.
3. Embed envelope-cracked sound bytes via `node-speaker` for coin insert and confirm actions.
4. Introduce an achievements ticker (“HI-SCORE UPDATED!”) that animates across the bottom border.
5. Persist configuration (favorite missions, recent scripts) to a JSON save slot to mimic arcade DIP switches.

Enjoy the nostalgia-fueled Master Nerd experience!
