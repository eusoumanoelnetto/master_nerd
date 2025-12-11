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
    this.lastFormatInfo = null;
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

    if (index === 1) {
      await this.runMicrosoftActivation();
      return;
    }

    alert(`Launching: ${this.missions[index]?.label || 'Em breve'}`);
  }

  async runMicrosoftActivation() {
    if (!this.electronAPI?.launchScript) {
      alert('API indisponível. Reinicie o aplicativo.');
      return;
    }

    this.renderActivationScreen();
    
    try {
      const result = await this.electronAPI.launchScript('microsoft-activation');
      const output = (result?.stdout || '') + (result?.stderr || '');
      this.showActivationResult(output || 'Comando executado com sucesso.');
    } catch (err) {
      const details = [err?.message, err?.stderr, err?.stdout]
        .filter(Boolean)
        .map((part) => String(part).trim())
        .filter(Boolean)
        .join('\n');
      this.showActivationResult(`ERRO:\n${details || 'Falha ao executar o comando.'}`);
      console.error('Erro Microsoft Activation:', err);
    }
  }

  renderActivationScreen() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="screen-content">
        <h1 class="title">MASTER NERD</h1>
        <div class="subtitle" style="font-size: 0.8rem; margin-bottom: 5px; color: #aaa;">By Manoel Coelho</div>
        <div class="subtitle">MICROSOFT ACTIVATION</div>
        <div class="pixel-wave">~ ~ ~ ~ ~</div>
        <div id="activation-output" style="flex: 1; overflow-y: auto; margin: 20px 0; padding: 15px; border: 2px solid var(--neon-cyan); background: rgba(0,0,0,0.5); font-size: 0.7rem; line-height: 1.4; white-space: pre-wrap; word-break: break-word; color: var(--neon-cyan);">Executando comando...</div>
        <div style="margin-top: 20px;">
          <button id="btn-back-activation" class="btn" style="color: var(--neon-red); border-color: var(--neon-red); box-shadow: 0 0 10px var(--neon-red); padding: 8px 15px; font-size: 0.7rem;">Voltar</button>
        </div>
      </div>
    `;
    
    document.getElementById('btn-back-activation').addEventListener('click', () => {
      this.renderMenuScreen();
    });
  }

  showActivationResult(output) {
    const outputEl = document.getElementById('activation-output');
    if (outputEl) {
      outputEl.textContent = output;
      outputEl.scrollTop = outputEl.scrollHeight;
    }
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
              <div class="fs-buttons" id="fs-buttons-container">
                <button id="btn-ntfs" class="btn format-btn" type="button">NTFS</button>
                <button id="btn-fat32" class="btn format-btn" type="button">FAT32</button>
                <button id="btn-exfat" class="btn format-btn" type="button">exFAT</button>
              </div>
            </div>
            <div style="margin-top:30px;">
              <button id="btn-voltar-fs" class="btn format-btn danger" type="button">Voltar</button>
            </div>
          </div>
        </div>
      `;
      
      // Usar event delegation no container
      const container = document.getElementById('fs-buttons-container');
      if (container) {
        container.addEventListener('click', (e) => {
          if (e.target.id === 'btn-ntfs') {
            console.log('NTFS clicado');
            self.formatWithFs('NTFS');
          } else if (e.target.id === 'btn-fat32') {
            console.log('FAT32 clicado');
            self.formatWithFs('FAT32');
          } else if (e.target.id === 'btn-exfat') {
            console.log('exFAT clicado');
            self.formatWithFs('exfat');
          }
        });
      }
      
      // Botão voltar
      const voltarBtn = document.getElementById('btn-voltar-fs');
      if (voltarBtn) {
        voltarBtn.addEventListener('click', () => {
          console.log('Voltar clicado');
          self.renderMenuScreen();
        });
      }
      
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
    const statusEl = document.getElementById('format-status');

    if (!outputEl) {
      return;
    }

    if (!this.electronAPI?.launchScript) {
      outputEl.textContent = 'API indisponível. Reinicie o aplicativo.';
      if (statusEl) {
        statusEl.textContent = 'API indisponível. Reinicie o aplicativo.';
        statusEl.classList.add('error');
      }
      return;
    }

    outputEl.textContent = 'Listando discos...';

    try {
      const res = await this.electronAPI.launchScript('format-pendrive', { action: 'list' });
      let text = (res?.stdout || '').trim();

      if (!text) {
        text = (res?.stderr || '').trim();
      }

      if (!text) {
        text = 'Diskpart não retornou dados. Execute o app como Administrador.';
      }

      const lines = text.split(/\r?\n/);
      const highlightedLines = lines.map((line) => {
        const sanitized = line
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        const match = sanitized.match(/Disco\s+(\d+)/i);
        if (!match) {
          return sanitized;
        }

        const diskNumber = match[1];
        const isSelected = String(this.lastSelectedDisk ?? '') === String(diskNumber);
        const highlighted = sanitized.replace(
          match[0],
          `<span class="pendrive-highlight">${match[0]}</span>`
        );

        if (isSelected) {
          return `${highlighted} <span class="pendrive-highlight">[SELECIONADO]</span>`;
        }

        return highlighted;
      });

      outputEl.innerHTML = highlightedLines.join('\n');

      if (statusEl) {
        statusEl.textContent = '';
        statusEl.classList.remove('error');
      }

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

      if (statusEl) {
        statusEl.textContent = finalMsg;
        statusEl.classList.add('error');
      }
    }
  }

  async getVolumeInfo(diskNumber) {
    if (!this.electronAPI?.launchScript) {
      return null;
    }

    try {
      const res = await this.electronAPI.launchScript('format-pendrive', {
        action: 'volume-info',
        disk: Number(diskNumber)
      });

      const raw = res?.stdout?.trim();
      if (!raw) {
        return null;
      }

      return JSON.parse(raw);
    } catch (err) {
      console.error('Falha ao obter informações de volume', err);
      return null;
    }
  }

  buildFormatSuccessMessage(diskNumber, fs, volumeInfo) {
    const lines = [
      `Disco ${diskNumber} foi formatado com sucesso`,
      `em ${fs.toUpperCase()}`
    ];

    if (volumeInfo) {
      const driveLetter = volumeInfo.DriveLetter ? ` (${volumeInfo.DriveLetter}:)` : '';
      const freeValue = volumeInfo.FreeGB ?? 'N/D';
      const totalValue = volumeInfo.SizeGB ?? 'N/D';
      lines.push(`Espaço disponível: ${freeValue} GB de ${totalValue} GB${driveLetter}`);
    }

    return lines.join('\n');
  }

  async promptRenameVolume() {
    if (!this.lastFormatInfo?.diskNumber) {
      return;
    }

    const currentResultModal = document.querySelector('.result-modal');
    if (currentResultModal) {
      currentResultModal.remove();
    }

    const currentLetter = this.lastFormatInfo?.volumeInfo?.DriveLetter;
    const defaultName = currentLetter ? `USB_${currentLetter}` : 'MASTER_NERD';
    const userInput = await this.showRenamePromptModal(defaultName);

    if (userInput === null) {
      const successMessage = this.buildFormatSuccessMessage(
        this.lastFormatInfo.diskNumber,
        this.lastFormatInfo.fs,
        this.lastFormatInfo.volumeInfo
      );

      this.showResultModal(
        'SUCESSO!',
        successMessage,
        true,
        () => this.renderFormatPendriveScreen({ skipInstructions: true }),
        {
          actions: [
            {
              label: 'RENOMEAR PENDRIVE',
              variant: 'info',
              handler: () => this.promptRenameVolume()
            }
          ]
        }
      );
      return;
    }

    const trimmedLabel = userInput.trim().slice(0, 32);
    if (!trimmedLabel) {
      alert('Nome inválido. Operação cancelada.');
      return;
    }

    this.renderLoadingScreen('RENOMEANDO', `Aplicando nome "${trimmedLabel}"`);

    try {
      await this.electronAPI.launchScript('format-pendrive', {
        action: 'rename-volume',
        disk: this.lastFormatInfo.diskNumber,
        label: trimmedLabel
      });

      const volumeInfo = await this.getVolumeInfo(this.lastFormatInfo.diskNumber);
      this.lastFormatInfo = {
        ...this.lastFormatInfo,
        volumeInfo: volumeInfo || this.lastFormatInfo.volumeInfo
      };

      const message = volumeInfo?.DriveLetter
        ? `Pendrive renomeado para "${trimmedLabel}" (${volumeInfo.DriveLetter}:).`
        : `Pendrive renomeado para "${trimmedLabel}".`;

      this.showResultModal('Nome atualizado!', message, true, () => {
        this.renderMenuScreen();
      });
    } catch (err) {
      console.error('Falha ao renomear', err);
      const msg = err?.error || err?.stderr || err?.message || JSON.stringify(err);
      this.showResultModal('Erro ao renomear', msg, false, () => {
        this.renderFormatPendriveScreen({ skipInstructions: true, onlyFsChoice: true });
      });
    }
  }

  showRenamePromptModal(defaultValue = '') {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'rename-overlay open';
      overlay.innerHTML = `
        <div class="rename-modal">
          <h2>RENOMEAR PENDRIVE</h2>
          <p>Digite o novo nome para o pendrive:</p>
          <input id="rename-input" class="rename-input" maxlength="32" value="${defaultValue || ''}">
          <div class="rename-actions">
            <button id="rename-cancel" class="btn format-btn danger">Cancelar</button>
            <button id="rename-confirm" class="btn format-btn success">Confirmar</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      const input = overlay.querySelector('#rename-input');
      const confirmBtn = overlay.querySelector('#rename-confirm');
      const cancelBtn = overlay.querySelector('#rename-cancel');

      const cleanup = () => {
        overlay.classList.remove('open');
        setTimeout(() => overlay.remove(), 200);
      };

      const resolveWith = (value) => {
        cleanup();
        resolve(value);
      };

      if (input) {
        setTimeout(() => {
          input.focus();
          input.select();
        }, 50);

        input.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            resolveWith(input.value);
          } else if (event.key === 'Escape') {
            event.preventDefault();
            resolveWith(null);
          }
        });
      }

      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => resolveWith(input?.value ?? ''));
      }

      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => resolveWith(null));
      }

      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
          resolveWith(null);
        }
      });
    });
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

  showResultModal(title, message, isSuccess = true, callback = null, options = {}) {
    const app = document.getElementById('app');
    const icon = isSuccess ? '✓' : '✗';
    const extraActions = Array.isArray(options.actions) ? options.actions : [];
    
    app.innerHTML = `
      <div class="result-modal open">
        <div class="result-modal-content ${isSuccess ? 'success' : 'error'}">
          <div class="result-icon ${isSuccess ? 'success' : 'error'}">
            ${icon}
          </div>
          <h2 class="result-title">${title}</h2>
          <p class="result-message">${message}</p>
          <div class="result-actions">
            ${extraActions
              .map((action, index) => `
                <button id="extra-action-${index}" class="btn format-btn ${action.variant || ''}">${action.label}</button>
              `)
              .join('')}
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

    // Anexar handlers aos botões extras usando IDs
    extraActions.forEach((action, index) => {
      const btnId = `extra-action-${index}`;
      const btn = document.getElementById(btnId);
      console.log(`[DEBUG] Botão ${btnId} encontrado:`, !!btn, btn);
      console.log(`[DEBUG] Handler tipo:`, typeof action.handler);
      if (btn && typeof action.handler === 'function') {
        btn.addEventListener('click', (e) => {
          console.log(`[DEBUG] Botão ${btnId} clicado`, e);
          console.log(`[DEBUG] Executando handler...`);
          try {
            action.handler();
            console.log(`[DEBUG] Handler executado com sucesso`);
          } catch (err) {
            console.error(`[DEBUG] Erro ao executar handler:`, err);
          }
        });
        console.log(`[DEBUG] Event listener anexado com sucesso`);
      } else {
        console.error(`[DEBUG] Falha ao anexar handler - btn:`, !!btn, 'handler:', typeof action.handler);
      }
    });
  }

  async formatWithFs(fs) {
    console.log('formatWithFs chamado com:', fs);
    const statusEl = document.getElementById('format-status');
    const diskOutput = document.getElementById('disk-output');
    
    const diskNumber = this.lastSelectedDisk;
    console.log('Disco selecionado:', diskNumber);
    
    if (diskNumber === undefined || diskNumber === null) {
      console.error('Nenhum disco selecionado');
      if (statusEl) {
        statusEl.textContent = 'Selecione um disco antes de formatar.';
        statusEl.classList.add('error');
      }
      alert('Nenhum disco foi selecionado para formatação.');
      return;
    }

    // Verificar status de admin antes de continuar
    await this.updateAdminStatus();
    
    if (!this.isElevated) {
      console.error('Sem permissões de admin');
      if (statusEl) {
        statusEl.textContent = 'Ative o modo Admin para formatar a partição.';
        statusEl.classList.add('error');
      }
      alert('É necessário executar como Administrador para formatar.');
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

      const volumeInfo = await this.getVolumeInfo(diskNumber);
      const successMessage = this.buildFormatSuccessMessage(diskNumber, fs, volumeInfo);
      this.lastFormatInfo = { diskNumber, fs, volumeInfo };
      const extraActions = volumeInfo?.DriveLetter ? [{
        label: 'RENOMEAR PENDRIVE',
        variant: 'info',
        handler: () => this.promptRenameVolume()
      }] : [];
      
      clearInterval(progressInterval);
      this.updateLoadingProgress(100, `Disco ${diskNumber} formatado com sucesso!`);
      
      setTimeout(() => {
        this.showResultModal(
          'SUCESSO!',
          successMessage,
          true,
          () => this.renderFormatPendriveScreen({ skipInstructions: true }),
          { actions: extraActions }
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
            console.log('Callback do modal executado, disco:', diskNumber);
            // Renderiza tela só com escolha de formato, sem lista de discos
            this.lastSelectedDisk = diskNumber;
            console.log('lastSelectedDisk definido como:', this.lastSelectedDisk);
            this.renderFormatPendriveScreen({ skipInstructions: true, onlyFsChoice: true });
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
