#  Master Nerd

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/master-nerd/master-nerd?style=flat-square)](https://github.com/master-nerd/master-nerd)
[![Electron](https://img.shields.io/badge/Electron-v27-9feaf9?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

Aplica��o desktop com est�tica retr� arcade. Uma experi�ncia nost�lgica de computa��o dos anos 80/90.

##  Caracter�sticas

-  **Interface Retr�**: Design aut�ntico em estilo arcade com efeitos CRT e neon
-  **Constru�do em Electron**: Aplica��o desktop multiplataforma
-  **Temas Customizados**: Efeitos visuais imersivos e anima��es fluidas
-  **Port�vel**: Execut�vel standalone sem depend�ncias externas
-  **Code Open Source**: C�digo fonte completo e documentado

##  Como Usar

### Usu�rios Finais

1. **Download da Vers�o Execut�vel**
   - Acesse [GitHub Releases](https://github.com/master-nerd/master-nerd/releases)
   - Baixe o arquivo \Master-Nerd-Setup.exe\ ou \Master-Nerd.exe\ (vers�o port�vel)
   - Execute o instalador ou abra o execut�vel port�vel diretamente

2. **Configura��o R�pida**
   - N�o requer instala��o adicional
   - Compat�vel com Windows 7 e superior
   - Todas as depend�ncias inclu�das no execut�vel

### Desenvolvedores

#### Pr�-requisitos

- Node.js 18+ ([Download](https://nodejs.org/))
- npm ou yarn

#### Instala��o e Execu��o

\\\ash
# Clone o reposit�rio
git clone https://github.com/master-nerd/master-nerd.git
cd master-nerd/master

# Instale as depend�ncias
npm install

# Execute em modo desenvolvimento
npm start

# Build da aplica��o para release
npm run build
\\\

#### Estrutura do Projeto

\\\	ext
master-nerd/
 master/
    main.js              # Processo principal do Electron
    preload.js           # Script de pr�-carregamento de seguran�a
    package.json         # Configura��o e depend�ncias
    src/
       app.js           # L�gica da aplica��o
       index.html       # Interface principal
       styles.css       # Estilos globais
    ui/
       crtEffects.js    # Efeitos de monitor CRT
       menuScreen.js    # Tela de menu
       startScreen.js   # Tela inicial
    scripts/
        bootable_pendrive.ps1
        format_pendrive.ps1
        mas_activation.ps1
 src/
    powershell/
        MasterNerd.Bootstrap.ps1
        usb-toolkit/
            Format-UsbDrive.ps1
 docs/                    # GitHub Pages landing page
     index.html
     style.css
     script.js
\\\

##  Stack de Tecnologias

| Tecnologia | Vers�o | Prop�sito |
|-----------|--------|----------|
| Electron | ^27.0.0 | Framework desktop |
| Node.js | 18+ | Runtime JavaScript |
| electron-builder | ^24.6.4 | Build e packaging |
| HTML5 | - | Interface |
| CSS3 | - | Estilos e anima��es |
| JavaScript | ES6+ | L�gica da aplica��o |

##  Recursos Visuais

- **Efeitos CRT**: Reproduz a apar�ncia aut�ntica de monitores de tubo de raios cat�dicos
- **Neon Glow**: Efeitos de ilumina��o neon nos elementos da interface
- **Glitch Effects**: Anima��es de distor��o retr�
- **Scanlines**: Linhas de varredura t�picas de displays antigos
- **Star Field**: Campo de estrelas em paralaxe como screensaver

##  Requisitos do Sistema

- **SO**: Windows 7 ou superior / macOS 10.11+ / Linux (AppImage)
- **Processador**: Pentium IV 2.0 GHz ou superior
- **RAM**: 512 MB m�nimo (1 GB recomendado)
- **Espa�o em Disco**: 150 MB dispon�vel
- **Resolu��o**: 1024x768 ou superior

##  Configura��o para Desenvolvimento

### Setup Visual Studio Code

1. Instale as extens�es recomendadas:
   - ESLint
   - Prettier
   - Electron DevTools

2. Configure o lan�ador (\.vscode/launch.json\):

\\\json
{
  " version\: \0.2.0\,
 \configurations\: [
 {
 \name\: \Electron\,
 \type\: \node\,
 \request\: \launch\,
 \program\: \\/master/main.js\,
 \restart\: true,
 \console\: \integratedTerminal\
 }
 ]
}
\\\

### Comandos �teis

\\\ash
# Desenvolvimento com hot reload
npm start

# Build execut�vel Windows
npm run build

# Build port�vel
npm run build -- --win portable

# Build installer
npm run build -- --win nsis

# Lint do c�digo
npm run lint

# Testes
npm test
\\\

## Troubleshooting

### Aplica��o n�o inicia

- Verifique se Node.js est� instalado: \
ode --version\
- Reinstale depend�ncias: \
m -r node_modules && npm install\
- Verifique portas em uso: a aplica��o pode usar porta 3000

### Problemas de compatibilidade

- Atualize para a vers�o mais recente do Electron
- Verifique se voc� atende aos requisitos m�nimos do sistema
- Tente desabilitar acelera��o de hardware: \--no-gpu\

### Build falhando

- Limpe cache: \
pm cache clean --force\
- Remova node_modules: \
m -r node_modules\
- Reinstale tudo: \
pm install && npm run build\

## Licen�a

Este projeto est� licenciado sob a MIT License. Veja [LICENSE](LICENSE) para mais detalhes.

## Contribuindo

Contribui��es s�o bem-vindas! Por favor:

1. Fa�a um Fork do projeto
2. Crie uma branch para sua feature (\git checkout -b feature/AmazingFeature\)
3. Commit suas mudan�as (\git commit -m \Add some AmazingFeature\\)
4. Push para a branch (\git push origin feature/AmazingFeature\)
5. Abra um Pull Request

## Contato & Suporte

- **Issues**: [GitHub Issues](https://github.com/master-nerd/master-nerd/issues)
- **Discuss�es**: [GitHub Discussions](https://github.com/master-nerd/master-nerd/discussions)

## Agradecimentos

- Comunidade Electron
- Inspira��o em interfaces retr� cl�ssicas
- Todos os contribuidores

---

Desenvolvido com para entusiastas de tecnologia retr�
