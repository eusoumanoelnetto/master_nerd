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

  renderFormatPendriveScreen(options = {}) {
    const { skipInstructions = false, onlyFsChoice = false } = options;
    const app = document.getElementById('app');
    const self = this;
    
    if (onlyFsChoice) {
      app.innerHTML = `
        <div class="screen-content format-screen">
          <h1 class="title">MASTER NERD</h1>
          <div class="subtitle" style="font-size: 0.8rem; margin-bottom: 5px; color: #aaa;">By Manoel Coelho</div>
          <div class="subtitle">FORMATAR PENDRIVE CMD</div>
          <div class="format-panel">
            <div class="fs-choice" style="display:flex; flex-direction:column; gap:12px; align-items:center; margin-top:40px;">
              <div class="fs-label">Escolha qual vai ser o formato:</div>
              <div class="fs-buttons">
                <button class="fs-btn-ntfs btn format-btn" data-fs="ntfs">NTFS</button>
                <button class="fs-btn-fat32 btn format-btn" data-fs="fat32">FAT32</button>
                <button class="fs-btn-exfat btn format-btn" data-fs="exfat">exFAT</button>
              </div>
            </div>
            <div style="margin-top:30px;">
              <button class="btn-voltar-fs btn format-btn danger">Voltar</button>
            </div>
          </div>
        </div>
      `;
      // Adiciona eventos com delay para garantir que o DOM está pronto
      setTimeout(() => {
        document.querySelectorAll('[data-fs]').forEach(btn => {
          btn.addEventListener('click', function(e) {
            const fs = this.getAttribute('data-fs');
            self.formatWithFs(fs);
          });
        });
        const voltarBtn = document.querySelector('.btn-voltar-fs');
        if (voltarBtn) {
          voltarBtn.addEventListener('click', function() {
            self.renderMenuScreen();
          });
        }
      }, 50);
      return;
    }
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
      if (!skipInstructions) {
        instructionsModal.classList.add('open');
        if (closeInstructionsBtn) {
          closeInstructionsBtn.focus();
        }
      } else {
        instructionsModal.classList.remove('open');
        instructionsModal.style.display = 'none';
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
    
    // Adiciona eventos aos botões de formato (quando estão visíveis)
    const fsButtonsOnFullScreen = document.querySelectorAll('#fs-choice button[data-fs]');
    fsButtonsOnFullScreen.forEach(btn => {
      btn.addEventListener('click', () => {
        const fs = btn.getAttribute('data-fs');
        this.formatWithFs(fs);
      });
    });
    
    // Evento do botão voltar na tela completa
    const backBtnOnFullScreen = document.querySelector('.format-select-row #back-to-menu');
    if (backBtnOnFullScreen) {
      backBtnOnFullScreen.addEventListener('click', () => this.renderMenuScreen());
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

      if (text) {
        const lines = text.split('\n');
        const highlightedLines = lines.map(line => {
          if (/Disco\s+\d+/.test(line)) {
            const sizeMatch = line.match(/(\d+)\s+(MB|GB)/);
            if (sizeMatch) {
              const size = parseInt(sizeMatch[1]);
              const unit = sizeMatch[2];
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

  renderLoadingScreen(title = 'CARREGANDO', message = 'Processando...') {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="screen-content loading-screen">
        <h1 class="loading-title">${title}</h1>
        
        <div class="loading-status" id="loading-message">${message}</div>

        <div class="progress-container">
          <div class="progress-label">Processamento em Andamento</div>
          <div class="progress-bar" id="progress-bar">
            <div class="progress-fill" id="progress-fill" style="width: 0%;">
              <div class="progress-percentage" id="progress-percentage">0%</div>
            </div>
          </div>
        </div>

        <div class="loading-dots" id="loading-dots">.</div>
      </div>
    `;
  }

  updateLoadingProgress(percentage, message = null) {
    const fillEl = document.getElementById('progress-fill');
    const percentageEl = document.getElementById('progress-percentage');
    const messageEl = document.getElementById('loading-message');
    const dotsEl = document.getElementById('loading-dots');

    if (fillEl && percentageEl) {
      const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
      fillEl.style.width = clampedPercentage + '%';
      percentageEl.textContent = clampedPercentage + '%';
    }

    if (message && messageEl) {
      messageEl.textContent = message;
    }

    // Animate dots
    if (dotsEl) {
      const dotCount = (Math.floor(Date.now() / 300) % 4) + 1;
      dotsEl.textContent = '.'.repeat(dotCount);
    }
  }

  showResultModal(title, message, isSuccess = true, callback = null) {
    const app = document.getElementById('app');
    const icon = isSuccess ? '✓' : '✗';
    
    app.innerHTML = `
      <div class="result-modal open">
        <div class="result-modal-content ${isSuccess ? 'success' : 'error'}">
          <div class="result-icon ${isSuccess ? 'success' : 'error'}">
            ${icon}
          </div>
          <h2 class="result-title">${title}</h2>
          <p class="result-message">${message}</p>
          <div class="result-actions">
            <button id="result-confirm" class="btn format-btn success">OK</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('result-confirm').addEventListener('click', () => {
      if (callback) {
        callback();
      } else {
        this.renderFormatPendriveScreen({ skipInstructions: true });
      }
    });
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

    // Show loading screen
    this.renderLoadingScreen('FORMATANDO', `Disco ${diskNumber} com ${fs.toUpperCase()}`);
    
    // Simulate progress updates
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 15, 90);
      this.updateLoadingProgress(Math.floor(progress));
    }, 300);

    try {
      await this.electronAPI.launchScript('format-pendrive', { action: 'format', disk: diskNumber, fs });
      
      clearInterval(progressInterval);
      this.updateLoadingProgress(100, `Disco ${diskNumber} formatado com sucesso!`);
      
      setTimeout(() => {
        this.showResultModal(
          'SUCESSO!',
          `Disco ${diskNumber} foi formatado com sucesso\nem ${fs.toUpperCase()}`,
          true
        );
      }, 1000);

    } catch (err) {
      clearInterval(progressInterval);
      console.error('Falha ao formatar', err);
      const msg = err?.error || err?.stderr || err?.message || JSON.stringify(err);
      
      this.updateLoadingProgress(0, `Erro ao formatar disco ${diskNumber}`);
      
      setTimeout(() => {
        this.showResultModal(
          'ERRO!',
          `Falha ao formatar disco ${diskNumber}.\n${msg}`,
          false
        );
      }, 1000);
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

    const diskNumber = Number(inputEl.value);
    if (!Number.isInteger(diskNumber) || diskNumber < 0) {
      statusEl.textContent = 'Informe um número de disco válido.';
      statusEl.classList.add('error');
      return;
    }

    if (!this.electronAPI?.launchScript) {
      statusEl.textContent = 'API indisponível. Reinicie o aplicativo.';
      statusEl.classList.add('error');
      return;
    }

    if (!this.isElevated) {
      statusEl.textContent = 'Ative o modo Admin antes de limpar discos.';
      statusEl.classList.add('error');
      return;
    }

    // Show loading screen
    this.renderLoadingScreen('LIMPANDO DISCO', `Disco ${diskNumber}`);
    
    // Simulate progress updates
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 20, 85);
      this.updateLoadingProgress(Math.floor(progress));
    }, 250);

    try {
      const res = await this.electronAPI.launchScript('format-pendrive', { action: 'select', disk: diskNumber });
      
      clearInterval(progressInterval);
      this.updateLoadingProgress(100, `Disco ${diskNumber} limpo com sucesso!`);
      
      // Guardar o disco selecionado para formatação
      this.lastSelectedDisk = diskNumber;
      
      setTimeout(() => {
        this.showResultModal(
          'DISCO LIMPO!',
          `Disco ${diskNumber} foi limpo com sucesso.\nAgora escolha o formato de arquivo`,
          true,
          () => {
            // Renderiza tela só com escolha de formato, sem lista de discos
            this.renderFormatPendriveScreen({ skipInstructions: true, onlyFsChoice: true });
            this.lastSelectedDisk = diskNumber;
          }
        );
      }, 1000);

    } catch (err) {
      clearInterval(progressInterval);
      console.error('Falha ao limpar disco', err);
      const msg = err?.error || err?.stderr || err?.message || JSON.stringify(err);
      
      this.updateLoadingProgress(0, `Erro ao limpar disco ${diskNumber}`);
      
      setTimeout(() => {
        this.showResultModal(
          'ERRO!',
          `Falha ao limpar disco ${diskNumber}.\n${msg}`,
          false
        );
      }, 1000);
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
