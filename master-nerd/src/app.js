class MasterNerdApp {
  constructor() {
    this.currentScreen = 'start';
    this.selectedMenuIndex = 0;
    this.missions = [
      { label: 'Formatar Pendrive CMD' },
      { label: 'Microsoft Activation' },
      { label: 'Extras' }
    ];
    this.isElevated = false;
  }

  init() {
    this.renderStartScreen();
  }

  renderStartScreen() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="screen-content">
        <h1 class="title">MASTER NERD</h1>
        <div class="subtitle" style="font-size: 0.8rem; margin-bottom: 5px; color: #aaa;">By Manoel Coelho</div>
        <div class="subtitle">HI-SCORE: 000089</div>

        <div class="pacman-wrapper">
          <div class="pacman"></div>
          <div class="ghost"></div>
        </div>

        <div class="pixel-wave">~ ~ ~ ~ ~</div>

        <div class="prompt-text">ARE YOU READY?</div>

        <div class="controls">
          <button id="btn-yes" class="btn btn-yes">YES</button>
          <button id="btn-no" class="btn btn-no">NO</button>
        </div>

        <div style="margin-top: 30px; font-size: 0.8rem; color: #888;">
          <button id="btn-exit" class="btn" style="color: var(--neon-red); border-color: var(--neon-red); box-shadow: 0 0 10px var(--neon-red); padding: 8px 15px; font-size: 0.7rem;">EXIT</button>
        </div>
      </div>
    `;

    document.getElementById('btn-yes').addEventListener('click', () => {
      document.getElementById('btn-yes').classList.remove('anim-flash');
      void document.getElementById('btn-yes').offsetWidth;
      document.getElementById('btn-yes').classList.add('anim-flash');
      setTimeout(() => this.renderMenuScreen(), 300);
    });

    document.getElementById('btn-no').addEventListener('click', () => {
      document.getElementById('btn-no').classList.add('anim-error');
      setTimeout(() => {
        document.getElementById('btn-no').classList.remove('anim-error');
      }, 500);
    });

    document.getElementById('btn-exit').addEventListener('click', () => {
      window.close();
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('btn-yes').click();
      } else if (e.key === 'Escape') {
        document.getElementById('btn-exit').click();
      }
    });

  }

  renderMenuScreen() {
    const app = document.getElementById('app');
    const missions = [...this.missions, { label: 'Voltar' }];
    const menuItemsHtml = missions
      .map((m, i) => `
        <button class="menu-item ${i === this.selectedMenuIndex ? 'selected' : ''}" data-index="${i}">
          ${m.label}
        </button>
      `)
      .join('');

    app.innerHTML = `
      <div class="screen-content">
        <h1 class="title">MASTER NERD</h1>
        <div class="subtitle" style="font-size: 0.8rem; margin-bottom: 5px; color: #aaa;">By Manoel Coelho</div>
        <div class="subtitle">OPERATIONS MENU</div>

        <div class="pixel-wave">~ ~ ~ ~ ~</div>

        <div class="menu-items">
          ${menuItemsHtml}
        </div>

        <div class="prompt-text">SELECT YOUR OPTION</div>

        <div style="margin-top: 30px; font-size: 0.8rem; color: #888;">
          <button id="btn-exit-menu" class="btn" style="color: var(--neon-red); border-color: var(--neon-red); box-shadow: 0 0 10px var(--neon-red); padding: 8px 15px; font-size: 0.7rem;">EXIT</button>
        </div>
      </div>
    `;

    // Add click handlers for menu items
    document.querySelectorAll('.menu-item').forEach((item, i) => {
      item.addEventListener('click', () => {
        this.selectedMenuIndex = i;
        this.renderMenuScreen();
        
        // Check if it's the "Voltar" option
        if (i === this.missions.length) {
          this.renderStartScreen();
        } else {
          this.runMission(i);
        }
      });
    });

    // Add click handler for exit button
    document.getElementById('btn-exit-menu').addEventListener('click', () => {
      window.close();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        this.selectedMenuIndex = (this.selectedMenuIndex - 1 + missions.length) % missions.length;
        this.renderMenuScreen();
      } else if (e.key === 'ArrowDown') {
        this.selectedMenuIndex = (this.selectedMenuIndex + 1) % missions.length;
        this.renderMenuScreen();
      } else if (e.key === 'Enter') {
        // Check if it's the "Voltar" option
        if (this.selectedMenuIndex === this.missions.length) {
          this.renderStartScreen();
        } else {
          this.runMission(this.selectedMenuIndex);
        }
      } else if (e.key === 'Escape') {
        this.renderStartScreen();
      }
    });
  }

  async runMission(index) {
    if (index === 0) {
      this.renderFormatPendriveScreen();
      return;
    }

    alert(`Launching: ${this.missions[index]?.label || 'Em breve'}`);
  }

  renderFormatPendriveScreen() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="screen-content format-screen">
        <h1 class="title">MASTER NERD</h1>
        <div class="subtitle" style="font-size: 0.8rem; margin-bottom: 5px; color: #aaa;">By Manoel Coelho</div>
        <div class="subtitle">FORMATAR PENDRIVE CMD</div>

        <div class="format-panel">
          <div class="format-header">
            <button id="show-instructions" class="btn format-btn info">Ver instruções</button>
            <div class="admin-status-panel">
              <div id="admin-status-text">Verificando permissões...</div>
              <button id="btn-elevate" class="btn format-btn danger small">Ativar modo Admin</button>
            </div>
          </div>

          <pre id="disk-output" class="disk-output">Listando discos...</pre>

          <div class="format-actions">
            <button id="refresh-disks" class="btn format-btn" data-requires-admin="true">Atualizar lista</button>

            <div class="format-select">
              <label for="disk-input">Selecione o número do disco para formatar:</label>
              <div class="format-select-row">
                <input id="disk-input" type="number" min="0" class="format-input" placeholder="Ex: 1" />
                <button id="clean-disk" class="btn format-btn success" data-requires-admin="true">Selecionar disco</button>
                <button id="back-to-menu" class="btn format-btn danger">Voltar</button>
              </div>
              <div id="format-status" class="format-status"></div>
              <div id="fs-choice" class="fs-choice" style="display:none;">
                <div class="fs-label">Escolha qual vai ser o formato:</div>
                <div class="fs-buttons">
                  <button data-fs="ntfs" class="btn format-btn">NTFS</button>
                  <button data-fs="fat32" class="btn format-btn">FAT32</button>
                  <button data-fs="exfat" class="btn format-btn">exFAT</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="format-modal" id="instructions-modal">
          <div class="format-modal-content">
            <h2>Como formatar</h2>
            <ol>
              <li>Garanta que o aplicativo esteja em modo Administrador.</li>
              <li>Clique em "Atualizar lista" para exibir os discos detectados.</li>
              <li>Informe o número do disco USB e clique em "Selecionar disco" para limpar.</li>
            </ol>
            <button id="close-instructions" class="btn format-btn success small">Okay</button>
          </div>
        </div>

        <div class="format-modal" id="admin-modal">
          <div class="format-modal-content">
            <h2>Permissão necessária</h2>
            <p>Para listar discos, ative o modo Administrador.</p>
            <div class="modal-actions">
              <button id="admin-modal-elevate" class="btn format-btn danger small">Ativar modo Admin</button>
              <button id="admin-modal-close" class="btn format-btn small">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const instructionsModal = document.getElementById('instructions-modal');
    const showInstructionsBtn = document.getElementById('show-instructions');
    const closeInstructionsBtn = document.getElementById('close-instructions');
    const adminModal = document.getElementById('admin-modal');
    const adminModalElevateBtn = document.getElementById('admin-modal-elevate');
    const adminModalCloseBtn = document.getElementById('admin-modal-close');
    const fsChoice = document.getElementById('fs-choice');
    const fsButtons = fsChoice ? fsChoice.querySelectorAll('[data-fs]') : [];

    this.adminModal = adminModal;

    const startDiskpartAfterAcknowledgement = async () => {
      if (instructionsModal) {
        instructionsModal.classList.remove('open');
      }

      const hasAdmin = await this.updateAdminStatus();

      if (!hasAdmin) {
        this.showAdminModal();
        return;
      }

      await this.fetchDiskList();
    };

    if (showInstructionsBtn && instructionsModal) {
      showInstructionsBtn.addEventListener('click', () => instructionsModal.classList.add('open'));
    }
    if (closeInstructionsBtn) {
      closeInstructionsBtn.addEventListener('click', startDiskpartAfterAcknowledgement);
    }
    if (instructionsModal) {
      instructionsModal.classList.add('open');
      if (closeInstructionsBtn) {
        closeInstructionsBtn.focus();
      }
    }

    if (adminModalCloseBtn && adminModal) {
      adminModalCloseBtn.addEventListener('click', () => adminModal.classList.remove('open'));
    }
    if (adminModalElevateBtn && adminModal) {
      adminModalElevateBtn.addEventListener('click', () => {
        adminModal.classList.remove('open');
        this.requestElevation();
      });
    }

    document.getElementById('refresh-disks').addEventListener('click', () => {
      this.updateAdminStatus().then(() => this.fetchDiskList());
    });
    document.getElementById('clean-disk').addEventListener('click', () => this.cleanSelectedDisk());
    document.getElementById('back-to-menu').addEventListener('click', () => this.renderMenuScreen());
    if (fsButtons && fsButtons.length) {
      fsButtons.forEach((btn) => {
        btn.addEventListener('click', () => this.formatWithFs(btn.getAttribute('data-fs')));
      });
    }
    const elevateBtn = document.getElementById('btn-elevate');
    if (elevateBtn) {
      elevateBtn.addEventListener('click', () => this.requestElevation());
    }
  }

  async fetchDiskList() {
    const outputEl = document.getElementById('disk-output');
    if (!outputEl) {
      return;
    }

    if (!this.electronAPI?.launchScript) {
      outputEl.textContent = 'API indisponível. Reinicie o aplicativo.';
      return;
    }

    if (!this.isElevated) {
      outputEl.textContent = 'Permissões elevadas necessárias. Clique em "Ativar modo Admin" para continuar.';
      this.showAdminModal();
      return;
    }

    outputEl.textContent = 'Executando diskpart...';

    try {
      await this.electronAPI.launchScript('format-pendrive', { action: 'init' });
      outputEl.textContent = 'Executando list disk...';
    } catch (err) {
      console.error('Falha ao iniciar diskpart', err);
      const msg = err?.error || err?.stderr || err?.message || JSON.stringify(err);
      let finalMsg = `Erro ao executar diskpart.\n${msg}`;
      if (!this.isElevated) {
        finalMsg += '\nExecute o app como Administrador.';
        this.showAdminModal();
      }
      outputEl.textContent = finalMsg;
      return;
    }

    try {
      const res = await this.electronAPI.launchScript('format-pendrive', { action: 'list' });
        let text = [res?.stdout, res?.stderr].filter(Boolean).join('\n').trim();
      
        // Highlight removable drives (pendrives) by adding HTML markup
        if (text) {
          const lines = text.split('\n');
          const highlightedLines = lines.map(line => {
            // Check if line contains a disk entry
            if (/Disco\s+\d+/.test(line)) {
              // Parse size to identify likely pendrives (typically <= 128GB)
              const sizeMatch = line.match(/(\d+)\s+(MB|GB)/);
              if (sizeMatch) {
                const size = parseInt(sizeMatch[1]);
                const unit = sizeMatch[2];
                // Highlight drives under 128GB as likely pendrives
                if ((unit === 'MB') || (unit === 'GB' && size <= 128)) {
                  return `<span class="pendrive-highlight">${line}</span>`;
                }
              }
            }
            return line;
          });
          text = highlightedLines.join('\n');
        }
      
        outputEl.innerHTML = text || 'Diskpart não retornou dados. Execute o app como Administrador.';

      // Após carregar a lista, esconda header para liberar espaço
      const instructionsBtn = document.getElementById('show-instructions');
      const adminPanel = document.querySelector('.admin-status-panel');
      if (instructionsBtn) instructionsBtn.style.display = 'none';
      if (adminPanel) adminPanel.style.display = 'none';
    } catch (err) {
      console.error('Falha ao listar discos', err);
      const msg = err?.error || err?.stderr || err?.message || JSON.stringify(err);
      let finalMsg = `Erro ao listar discos.\n${msg}`;
      if (!this.isElevated) {
        finalMsg += '\nExecute o app como Administrador.';
        this.showAdminModal();
      }
      outputEl.textContent = finalMsg;
    }
  }

  showAdminModal() {
    if (this.adminModal) {
      this.adminModal.classList.add('open');
    }
  }

  async formatWithFs(fs) {
    const statusEl = document.getElementById('format-status');
    const diskOutput = document.getElementById('disk-output');
    if (!statusEl) return;

    const diskNumber = this.lastSelectedDisk;
    if (diskNumber === undefined || diskNumber === null) {
      statusEl.textContent = 'Selecione um disco antes de formatar.';
      statusEl.classList.add('error');
      return;
    }

    if (!this.isElevated) {
      statusEl.textContent = 'Ative o modo Admin para formatar a partição.';
      statusEl.classList.add('error');
      this.showAdminModal();
      return;
    }

    try {
      statusEl.textContent = `Formatando disco ${diskNumber} em ${fs.toUpperCase()}...`;
      statusEl.classList.remove('error');
        if (diskOutput) diskOutput.style.display = 'none'; // Hide disk output during formatting
      await this.electronAPI.launchScript('format-pendrive', { action: 'format', disk: diskNumber, fs });
      statusEl.textContent = `Disco ${diskNumber} formatado como ${fs.toUpperCase()}.`;
      // Não atualiza a lista aqui para não mexer na tela antes da escolha de formato
        if (diskOutput) diskOutput.style.display = 'none'; // Keep disk output hidden after formatting
    } catch (err) {
      console.error('Falha ao formatar', err);
      const msg = err?.error || err?.stderr || err?.message || JSON.stringify(err);
      statusEl.textContent = `Erro ao formatar o disco ${diskNumber}.\n${msg}`;
      statusEl.classList.add('error');
      if (diskOutput) diskOutput.style.display = 'block';
    }
  }

  async cleanSelectedDisk() {
    const inputEl = document.getElementById('disk-input');
    const statusEl = document.getElementById('format-status');
    const refreshBtn = document.getElementById('refresh-disks');
    const cleanBtn = document.getElementById('clean-disk');
    const backBtn = document.getElementById('back-to-menu');
    const selectRow = document.querySelector('.format-select-row');
    const diskOutput = document.getElementById('disk-output');
    if (!inputEl || !statusEl) {
      return;
    }

    const setStatus = (message, isError = false) => {
      statusEl.textContent = message;
      statusEl.classList.toggle('error', isError);
    };

    const diskNumber = Number(inputEl.value);
    if (!Number.isInteger(diskNumber) || diskNumber < 0) {
      setStatus('Informe um número de disco válido.', true);
      return;
    }

    if (!this.electronAPI?.launchScript) {
      setStatus('API indisponível. Reinicie o aplicativo.', true);
      return;
    }

    if (!this.isElevated) {
      setStatus('Ative o modo Admin antes de limpar discos.', true);
      return;
    }

    setStatus(`Executando diskpart clean no disco ${diskNumber}...`);
    if (diskOutput) diskOutput.style.display = 'none';

    try {
      const res = await this.electronAPI.launchScript('format-pendrive', { action: 'select', disk: diskNumber });
      const text = [res?.stdout, res?.stderr].filter(Boolean).join('\n').trim();
      setStatus(text || `Disco ${diskNumber} limpo com sucesso.`);

      // Após limpar/criar partição, habilite escolha de formato e esconda controles de seleção
      if (refreshBtn) refreshBtn.style.display = 'none';
      if (cleanBtn) cleanBtn.style.display = 'none';
      if (backBtn) backBtn.style.display = 'none';
      if (selectRow) selectRow.style.display = 'none';

      const fsChoice = document.getElementById('fs-choice');
      if (fsChoice) {
        fsChoice.style.display = 'flex';
      }

      // Guardar o disco selecionado para formatação
      this.lastSelectedDisk = diskNumber;

      await this.fetchDiskList();
        if (diskOutput) diskOutput.style.display = 'none'; // Keep disk output hidden after cleaning
    } catch (err) {
      console.error('Falha ao limpar disco', err);
      const msg = err?.error || err?.stderr || err?.message || JSON.stringify(err);
      setStatus(`Erro ao limpar o disco ${diskNumber}.\n${msg}\nExecute o app como Administrador.`, true);
      if (diskOutput) diskOutput.style.display = 'block';
    }
  }

  get electronAPI() {
    return window.electronAPI;
  }

  async updateAdminStatus() {
    if (!this.electronAPI?.isAdmin) {
      this.isElevated = false;
      this.applyAdminStateToUI();
      return this.isElevated;
    }

    try {
      this.isElevated = await this.electronAPI.isAdmin();
    } catch (err) {
      console.error('Falha ao verificar modo administrador', err);
      this.isElevated = false;
    }

    this.applyAdminStateToUI();
    return this.isElevated;
  }

  applyAdminStateToUI() {
    const statusText = document.getElementById('admin-status-text');
    const elevateBtn = document.getElementById('btn-elevate');
    const needsAdmin = !this.isElevated;

    if (statusText) {
      statusText.textContent = needsAdmin
        ? 'Permissões elevadas necessárias para listar e limpar discos.'
        : 'Modo Administrador ativo. Você pode usar as ferramentas de disco.';
      statusText.classList.toggle('warning', needsAdmin);
    }

    if (elevateBtn) {
      elevateBtn.style.display = needsAdmin ? 'inline-flex' : 'none';
    }

    document.querySelectorAll('[data-requires-admin="true"]').forEach((btn) => {
      btn.disabled = needsAdmin;
    });
  }

  async requestElevation() {
    if (!this.electronAPI?.elevateApp) {
      alert('Elevação automática não suportada neste ambiente. Execute manualmente como Administrador.');
      return;
    }

    const statusText = document.getElementById('admin-status-text');
    if (statusText) {
      statusText.textContent = 'Solicitando modo Administrador... o app será reiniciado se autorizado.';
    }

    try {
      await this.electronAPI.elevateApp();
    } catch (err) {
      console.error('Falha ao elevar aplicativo', err);
      if (statusText) {
        statusText.textContent = 'Não foi possível ativar o modo Admin automaticamente. Execute o app manualmente como Administrador.';
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new MasterNerdApp();
  app.init();
});
