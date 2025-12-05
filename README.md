# Master Nerd

Terminal nerd-cyberpunk com scripts PowerShell portáteis para automação de Windows, criação de pendrives bootáveis e UI estilo CRT. Este repositório é o ponto central para experimentos, utilitários e pipelines do projeto Master Nerd.

## Componentes

- **Bootstrap (`src/powershell/MasterNerd.Bootstrap.ps1`)**: inicializa a estética CRT, cria estrutura de pastas, executa diagnósticos do sistema e prepara o caminho para rotinas de mídia bootável.
- **Modules (`src/powershell/modules`)**: lugar para cmdlets reutilizáveis (diagnóstico, inventário, tweaks de registro, etc.).
- **USB Toolkit (`src/powershell/usb-toolkit`)**: scripts focados em manipulação segura de mídias removíveis, geração de ISOs e integrações com DISM/diskpart.
- **Assets (`assets/ui`)**: fontes bitmap, presets de Windows Terminal e arte retro-futurista.
- **Docs (`docs`)**: referências rápidas, guias de campo, checklists de preparação.

## Download / Como usar?

### 🚀 CLIQUE ÚNICO - Master Nerd App (Windows EXE)

[![Download Master Nerd](https://img.shields.io/badge/Download-MasterNerd.exe-ff8c42?style=for-the-badge&logo=windows)](https://github.com/eusoumanoelnetto/master_nerd/releases/latest/download/MasterNerd.exe)

1. Clique no botão acima para baixar `MasterNerd.exe`.
2. Execute o arquivo.
3. Pronto! O menu CRT arcade aparecerá automaticamente.

**Nota:** O primeiro carregamento é rápido. O app traz tudo que precisa embutido.

---

### Método PowerShell ❤️

1. Abra PowerShell (não CMD). Clique com botão direito no menu Iniciar e selecione PowerShell ou Terminal.
1. Copie e cole o comando abaixo e pressione Enter:

```powershell
irm https://raw.githubusercontent.com/eusoumanoelnetto/master_nerd/master/get.ps1 | iex
```

1. Pronto! O menu CRT aparecerá com as opções disponíveis.

---

### Alternativa – Download Manual (Repositório)

1. Baixe: `https://github.com/eusoumanoelnetto/master_nerd/archive/refs/heads/master.zip`
1. Extraia o ZIP
1. Localize `src/powershell/MasterNerd.Bootstrap.ps1` e execute
1. Pronto

---

> [!NOTE]
> O comando IRM no PowerShell baixa um script de uma URL especificada, e o comando IEX o executa.
> Sempre verifique a URL antes de executar e confirme a fonte ao baixar manualmente os arquivos.

## Roadmap imediato

1. Povoar `modules` com funções para coleta de hardware/software.
2. Adicionar toolkit de pendrive com etapas guiadas e dry-run por padrão.
3. Distribuir tema CRT para Windows Terminal e host de console (`assets/ui`).
4. Automatizar testes (PSScriptAnalyzer + lint) via GitHub Actions em `.github/workflows`.

## Licença

Defina a licença desejada (MIT / Apache-2.0 / GPL) antes de publicar.
