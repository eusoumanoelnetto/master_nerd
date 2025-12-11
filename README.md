# Master Nerd

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/eusoumanoelnetto/master_nerd?style=flat-square)](https://github.com/eusoumanoelnetto/master_nerd)
[![Electron](https://img.shields.io/badge/Electron-v27-9feaf9?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

Aplicação desktop com estética retrô arcade. Uma experiência nostálgica de computação dos anos 80/90.

## Características

- **Interface Retrô**: Design autêntico em estilo arcade com efeitos CRT e neon
- **Construído em Electron**: Aplicação desktop multiplataforma
- **Temas Customizados**: Efeitos visuais imersivos e animações fluidas
- **Portável**: Executável standalone sem dependências externas
- **Código Open Source**: Código completo e documentado

## Como Usar

### Usuários finais

1. **Download da versão executável**
   - Acesse os [Releases no GitHub](https://github.com/eusoumanoelnetto/master_nerd/releases)
   - Baixe `Master Nerd.exe` (versão portátil)
   - Execute diretamente (não requer instalação)

2. **Configuração rápida**
   - Não requer instalação adicional
   - Compatível com Windows 10+ (64-bit)
   - Todas as dependências incluídas no executável

### Desenvolvedores

#### Pré-requisitos

Desenvolvido para entusiastas de tecnologia retrô.
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
