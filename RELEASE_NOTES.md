# Master Nerd v1.0.0

Lançamento inicial do executável portable para Windows 10+ (64-bit).

## Destaques

- Interface retrô com efeitos CRT e splash screen
- Executável portable (~50MB), sem instalação
- USB Toolkit e automações via PowerShell
- Código aberto (Electron + Node.js)

## Requisitos

- Windows 10 ou superior (64-bit)

## Instalação

- Baixe o arquivo `Master Nerd.exe` e execute diretamente.

## Checksums (integridade)

Gere e publique o SHA256 do executável para transparência:

```powershell
# Substitua o caminho pelo local do seu .exe
Get-FileHash -Algorithm SHA256 "C:\caminho\para\Master Nerd.exe" | Format-List
```

Cole o valor `Hash` na seção de release.

## Mudanças técnicas

- Estrutura da UI em `master/src`
- Efeitos CRT e telas em `master/ui`
- Scripts auxiliares em `scripts/` e `src/powershell/`

## Download direto

O botão do GitHub Pages aponta para:
[Baixar executável](https://github.com/eusoumanoelnetto/master_nerd/releases/latest/download/Master%20Nerd.exe)

Certifique-se de que o asset no release tem exatamente o nome `Master Nerd.exe`.
