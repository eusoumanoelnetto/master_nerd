# Master Nerd

Terminal nerd-cyberpunk com scripts PowerShell portáteis para automação de Windows, criação de pendrives bootáveis e UI estilo CRT. Este repositório é o ponto central para experimentos, utilitários e pipelines do projeto Master Nerd.

## Componentes

- **Bootstrap (`src/powershell/MasterNerd.Bootstrap.ps1`)**: inicializa a estética CRT, cria estrutura de pastas, executa diagnósticos do sistema e prepara o caminho para rotinas de mídia bootável.
- **Modules (`src/powershell/modules`)**: lugar para cmdlets reutilizáveis (diagnóstico, inventário, tweaks de registro, etc.).
- **USB Toolkit (`src/powershell/usb-toolkit`)**: scripts focados em manipulação segura de mídias removíveis, geração de ISOs e integrações com DISM/diskpart.
- **Assets (`assets/ui`)**: fontes bitmap, presets de Windows Terminal e arte retro-futurista.
- **Docs (`docs`)**: referências rápidas, guias de campo, checklists de preparação.

## Download / Como usar

### Método 1 – PowerShell (Windows 10+ / Windows 11) ⚡

1. Abra **PowerShell/Terminal** como Administrador (Win+X → Terminal/Powershell).
1. Copie e cole o comando abaixo e pressione Enter:

```powershell
irm https://raw.githubusercontent.com/MasterNerdProject/Master_Nerd/main/src/powershell/MasterNerd.Bootstrap.ps1 | iex
```

Alternativa legada (caso `irm` esteja bloqueado):

```powershell
iwr https://raw.githubusercontent.com/MasterNerdProject/Master_Nerd/main/src/powershell/MasterNerd.Bootstrap.ps1 -UseBasicParsing | iex
```

1. O terminal CRT abrirá com o menu:
	- `[1] Formatar Pendrive` (placeholder seguro – exige admin)
	- `[2] Microsoft-Activation-Scripts` (abre repositório oficial)
	- `[3] Criar Pendrive Bootavel` (dry-run guiado)

### Método 1b – PowerShell 7 (Linux/macOS/WSL) 🐧

```bash
pwsh -NoLogo -Command "irm https://raw.githubusercontent.com/<OWNER>/Master_Nerd/main/src/powershell/MasterNerd.Bootstrap.ps1 | iex"
```

### Método 2 – Download tradicional (Windows)

1. Baixe o ZIP: `https://github.com/MasterNerdProject/Master_Nerd/archive/refs/heads/main.zip`.
1. Extraia e abra PowerShell na pasta extraída (`cd Master_Nerd-main`).
1. Execute:

```powershell
Set-ExecutionPolicy -Scope Process RemoteSigned -Force
./src/powershell/MasterNerd.Bootstrap.ps1
```

1. Para ações específicas (ex.: apenas dry-run), use `-Action UsbDryRun` ou `-Action MenuPreview`.

### Notas rápidas

- `irm|iex` baixa e executa o script direto do GitHub. Só use URLs oficiais do projeto.
- Sem privilégios de administrador, o menu limita operações destrutivas.
- O modo `MenuPreview` mostra a interface sem interagir (bom para demos e CI).

## Roadmap imediato

1. Povoar `modules` com funções para coleta de hardware/software.
2. Adicionar toolkit de pendrive com etapas guiadas e dry-run por padrão.
3. Distribuir tema CRT para Windows Terminal e host de console (`assets/ui`).
4. Automatizar testes (PSScriptAnalyzer + lint) via GitHub Actions em `.github/workflows`.

## Licença

Defina a licença desejada (MIT / Apache-2.0 / GPL) antes de publicar.
