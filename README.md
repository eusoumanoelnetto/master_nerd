#  Master Nerd

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/master-nerd/master-nerd?style=flat-square)](https://github.com/master-nerd/master-nerd)
[![Electron](https://img.shields.io/badge/Electron-v27-9feaf9?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

Aplicação desktop com estética retrô arcade. Uma experiência nostálgica de computação dos anos 80/90.

##  Características

-  **Interface Retrô**: Design autêntico em estilo arcade com efeitos CRT e neon
-  **Construído em Electron**: Aplicação desktop multiplataforma
-  **Temas Customizados**: Efeitos visuais imersivos e animações fluidas
-  **Portável**: Executável standalone sem dependências externas
-  **Code Open Source**: Código fonte completo e documentado

##  Como Usar

### Usuários Finais

1. **Download da Versão Executável**
   - Acesse [GitHub Releases](https://github.com/master-nerd/master-nerd/releases)
   - Baixe o arquivo \Master-Nerd-Setup.exe\ ou \Master-Nerd.exe\ (versão portável)
   - Execute o instalador ou abra o executável portável diretamente

2. **Configuração Rápida**
   - Não requer instalação adicional
   - Compatível com Windows 7 e superior
   - Todas as dependências incluídas no executável

### Desenvolvedores

#### Pré-requisitos

- Node.js 18+ ([Download](https://nodejs.org/))
- npm ou yarn

#### Instalação e Execução

\\\ash
# Clone o repositório
git clone https://github.com/master-nerd/master-nerd.git
cd master-nerd/master

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm start

# Build da aplicação para release
npm run build
\\\

#### Estrutura do Projeto

\\\	ext
master-nerd/
 master/
    main.js              # Processo principal do Electron
    preload.js           # Script de pré-carregamento de segurança
    package.json         # Configuração e dependências
    src/
       app.js           # Lógica da aplicação
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

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| Electron | ^27.0.0 | Framework desktop |
| Node.js | 18+ | Runtime JavaScript |
| electron-builder | ^24.6.4 | Build e packaging |
| HTML5 | - | Interface |
| CSS3 | - | Estilos e animações |
| JavaScript | ES6+ | Lógica da aplicação |

##  Recursos Visuais

- **Efeitos CRT**: Reproduz a aparência autêntica de monitores de tubo de raios catódicos
- **Neon Glow**: Efeitos de iluminação neon nos elementos da interface
- **Glitch Effects**: Animações de distorção retrô
- **Scanlines**: Linhas de varredura típicas de displays antigos
- **Star Field**: Campo de estrelas em paralaxe como screensaver

##  Requisitos do Sistema

- **SO**: Windows 7 ou superior / macOS 10.11+ / Linux (AppImage)
- **Processador**: Pentium IV 2.0 GHz ou superior
- **RAM**: 512 MB mínimo (1 GB recomendado)
- **Espaço em Disco**: 150 MB disponível
- **Resolução**: 1024x768 ou superior

##  Configuração para Desenvolvimento

### Setup Visual Studio Code

1. Instale as extensões recomendadas:
   - ESLint
   - Prettier
   - Electron DevTools

2. Configure o lançador (\.vscode/launch.json\):

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

### Comandos Úteis

\\\ash
# Desenvolvimento com hot reload
npm start

# Build executável Windows
npm run build

# Build portável
npm run build -- --win portable

# Build installer
npm run build -- --win nsis

# Lint do código
npm run lint

# Testes
npm test
\\\

## Troubleshooting

### Aplicação não inicia

- Verifique se Node.js está instalado: \
ode --version\
- Reinstale dependências: \m -r node_modules && npm install\
- Verifique portas em uso: a aplicação pode usar porta 3000

### Problemas de compatibilidade

- Atualize para a versão mais recente do Electron
- Verifique se você atende aos requisitos mínimos do sistema
- Tente desabilitar aceleração de hardware: \--no-gpu\

### Build falhando

- Limpe cache: \
pm cache clean --force\
- Remova node_modules: \m -r node_modules\
- Reinstale tudo: \
pm install && npm run build\

## Licença

Este projeto está licenciado sob a MIT License. Veja [LICENSE](LICENSE) para mais detalhes.

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (\git checkout -b feature/AmazingFeature\)
3. Commit suas mudanças (\git commit -m \Add some AmazingFeature\\)
4. Push para a branch (\git push origin feature/AmazingFeature\)
5. Abra um Pull Request

## Contato & Suporte

- **Issues**: [GitHub Issues](https://github.com/master-nerd/master-nerd/issues)
- **Discussões**: [GitHub Discussions](https://github.com/master-nerd/master-nerd/discussions)

## Agradecimentos

- Comunidade Electron
- Inspiração em interfaces retrô clássicas
- Todos os contribuidores

---

Desenvolvido com para entusiastas de tecnologia retrô
