# Correção dos Downloads do Office

## Problema Identificado
Os botões de download do Office no app empacotado (.exe) não estavam disparando os downloads corretamente porque usavam apenas `<a>` tag com `click()`, o que pode falhar em contexto Electron empacotado.

## Solução Implementada

### Alterações nos Arquivos

1. **[main.js](master/main.js)** - Adicionado handler IPC `open-external`:
   - Usa `shell.openExternal()` do Electron para abrir URLs no navegador padrão
   - Validação de esquema http/https para segurança
   - Funciona tanto em dev quanto em build empacotado

2. **[preload.js](master/preload.js)** - Exposto método `openExternal`:
   - Permite renderer chamar o handler via IPC de forma segura
   - Mantém contexto isolado (contextBridge)

3. **[app.js](master/src/app.js)** - Atualizada função `startDownload()`:
   - Prioriza `electronAPI.openExternal()` quando disponível (mais confiável)
   - Fallback para método `<a>` tag em ambiente dev/browser
   - Tratamento de erros com feedback ao usuário

## Como Testar

### Teste em Modo Dev:
```powershell
cd master
npm install
npm start
```

Navegue: **Start > Extras > Office > Escolha versão > Clique em opção de download**

### Build do Executável:
```powershell
cd master
npm run build
```

O arquivo `Master Nerd.exe` será gerado em `master/dist/`.

## Versões do Office Disponíveis

- **Microsoft 365 / Sub** - Online x64/x32
- **Office 2024** - Online x64/x32, Offline x32-x64
- **Office 2021** - Online x64/x32, Offline x32-x64
- **Office 2019** - Online x64/x32, Offline x32-x64
- **Office 2016** - Online x64/x32, Offline x32-x64
- **Office 2013** - Online x64/x32, Offline x32-x64

## Notas Técnicas

- URLs são oficiais da Microsoft (c2rsetup.officeapps.live.com e officecdn.microsoft.com)
- Downloads Online iniciam instalador que baixa componentes sob demanda
- Downloads Offline são arquivos .img completos (requerem montagem ou extração)
- Todas URLs usam locale pt-br
