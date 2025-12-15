# Master Nerd v2.0.0

## 🎮 Novidades

### Menu Extras
- ✅ **Submenu Windows** com download direto de ISOs:
  - Windows 11, 10, 10/11 LTSC, ARM64
  - Windows 8.1, 8, 7, Vista, XP
  - Windows Server
  - Seleção de arquitetura (x64/x86) para versões compatíveis
  
- ✅ **Submenu Office** (em breve):
  - Microsoft 365 / Sub
  - Office 2024, 2021, 2019, 2016, 2013

### Melhorias de Interface
- ✅ **Modal customizado** com estética retrô/neon
  - Substituído alert() nativo por modal personalizado
  - Design consistente com tema CRT/arcade
  - Animações suaves de entrada
  - Suporte a teclado (Enter/Escape)

- ✅ **Responsividade melhorada**
  - Tela de carregamento totalmente responsiva
  - Textos com `clamp()` para escalar automaticamente
  - Quebra de linha inteligente em textos longos
  - Eliminado scroll horizontal indesejado

### Microsoft Activation Scripts
- ✅ Fluxo de elevação melhorado
  - Pergunta antes de elevar privilégios
  - Relança aplicativo como admin quando necessário
  - Execução no mesmo console (quando já elevado)

### Correções
- 🐛 Removido efeito de scale em hover que causava scroll horizontal
- 🐛 Botão "Voltar" sempre visível em menus longos
- 🐛 Encoding correto no README.md (caracteres portugueses)
- 🐛 Modal OK mais visível (verde neon destacado)

## 🔧 Requisitos

- Windows 10 ou superior (64-bit)
- Conexão com internet para downloads

## 📥 Instalação

Baixe `Master Nerd.exe` e execute diretamente - não requer instalação.

## 🔐 Verificação de Integridade

**SHA256 esperado:**
```
BC8CDD1AD3DE35DA3CA16173B4FA7073A34DF57016E10A8160E717322B8D78B5
```

**Verificar localmente:**
```powershell
Get-FileHash -Algorithm SHA256 "C:\caminho\para\Master Nerd.exe" | Format-List
```

## 📝 Mudanças Técnicas

- Refatoração completa do sistema de modais
- Implementação de download direto via links ISO oficiais
- Melhorias CSS com clamp() e overflow management
- Arquitetura de menus expandível para futuras features

## 🙏 Agradecimentos

Obrigado a todos que testaram e deram feedback sobre a v1.0.0!

---

**Download**: [Master Nerd v2.0.0](https://github.com/eusoumanoelnetto/master_nerd/releases/tag/v2.0.0)
