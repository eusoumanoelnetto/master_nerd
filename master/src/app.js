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

  showModal(message, title = 'MASTER NERD') {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">${title}</div>
        <div class="modal-body">${message}</div>
        <button class="modal-btn" id="modal-ok">OK</button>
      </div>
    `;
    document.body.appendChild(modal);

    const okBtn = document.getElementById('modal-ok');
    okBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    okBtn.focus();

    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Enter' || e.key === 'Escape') {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
        document.removeEventListener('keydown', escHandler);
      }
    });
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
        // Não re-renderiza antes de executar a missão para evitar conflitos
        this.selectedMenuIndex = Number(i);

        // "Voltar" é o último item (índice igual ao tamanho de this.missions)
        if (this.selectedMenuIndex === this.missions.length) {
          this.renderStartScreen();
        } else {
          this.runMission(this.selectedMenuIndex);
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
    const idx = Number(index);

    if (idx === 0) {
      this.renderFormatPendriveScreen();
      return;
    }

    if (idx === 1) {
      await this.runMicrosoftActivation();
      return;
    }

    if (idx === 2) {
      this.renderExtrasMenu();
      return;
    }

    // Apenas mostra modal se for realmente uma opção desconhecida
    if (idx < 0 || idx >= this.missions.length) {
      this.showModal('Opção desconhecida.');
    }
  }

  async runMicrosoftActivation() {
    if (!this.electronAPI?.launchScript) {
      this.showModal('API indisponível. Reinicie o aplicativo.');
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

  renderExtrasMenu() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="screen-content">
        <h1 class="title">MASTER NERD</h1>
        <div class="subtitle" style="font-size: 0.8rem; margin-bottom: 5px; color: #aaa;">By Manoel Coelho</div>
        <div class="subtitle">EXTRAS MENU</div>

        <div class="pixel-wave">~ ~ ~ ~ ~</div>

        <div class="menu-items">
          <button class="menu-item" id="btn-windows">Windows</button>
          <button class="menu-item" id="btn-office">Office</button>
          <button class="menu-item" id="btn-voltar-extras">Voltar</button>
        </div>

        <div class="prompt-text">SELECT YOUR OPTION</div>

        <div style="margin-top: 30px; font-size: 0.8rem; color: #888;">
          <button id="btn-exit-extras" class="btn" style="color: var(--neon-red); border-color: var(--neon-red); box-shadow: 0 0 10px var(--neon-red); padding: 8px 15px; font-size: 0.7rem;">EXIT</button>
        </div>
      </div>
    `;

    document.getElementById('btn-windows').addEventListener('click', () => {
      this.renderWindowsMenu();
    });

    document.getElementById('btn-office').addEventListener('click', () => {
      this.renderOfficeMenu();
    });

    document.getElementById('btn-voltar-extras').addEventListener('click', () => {
      this.renderMenuScreen();
    });

    document.getElementById('btn-exit-extras').addEventListener('click', () => {
      window.close();
    });
  }

  renderWindowsMenu() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="screen-content">
        <h1 class="title">MASTER NERD</h1>
        <div class="subtitle" style="font-size: 0.8rem; margin-bottom: 5px; color: #aaa;">By Manoel Coelho</div>
        <div class="subtitle">WINDOWS OPTIONS</div>

        <div class="pixel-wave">~ ~ ~ ~ ~</div>

        <div class="menu-items" style="max-height: 50vh; overflow-y: auto; padding-bottom: 10px;">
          <button class="menu-item" data-windows="11">Windows 11</button>
          <button class="menu-item" data-windows="10">Windows 10</button>
          <button class="menu-item" data-windows="10-11-ltsc">Windows 10 / 11 Enterprise LTSC</button>
          <button class="menu-item" data-windows="arm64">Windows ARM64</button>
          <button class="menu-item" data-windows="8.1">Windows 8.1</button>
          <button class="menu-item" data-windows="8">Windows 8</button>
          <button class="menu-item" data-windows="7">Windows 7</button>
          <button class="menu-item" data-windows="vista">Windows Vista</button>
          <button class="menu-item" data-windows="xp">Windows XP</button>
          <button class="menu-item" data-windows="server">Windows Server</button>
          <button class="menu-item" id="btn-voltar-windows">Voltar</button>
        </div>

        <div class="prompt-text" style="margin-top: 15px;">SELECT YOUR OPTION</div>
      </div>
    `;

    document.querySelectorAll('[data-windows]').forEach(btn => {
      btn.addEventListener('click', () => {
        const version = btn.getAttribute('data-windows');
        this.handleWindowsDownload(version);
      });
    });

    document.getElementById('btn-voltar-windows').addEventListener('click', () => {
      this.renderExtrasMenu();
    });
  }

  handleWindowsDownload(version) {
    const downloads = {
      '11': 'https://software-static.download.prss.microsoft.com/dbazure/888969d5-f34g-4e03-ac9d-1f9786c66749/26200.6584.250915-1905.25h2_ge_release_svc_refresh_CLIENT_CONSUMER_x64FRE_pt-br.iso',
      '10-11-ltsc': 'https://delivery.activated.win/dbmassgrave/pt-br_windows_11_enterprise_ltsc_2024_x64_dvd_2bb6b75b.iso?t=vzrKMpcsvKJYyEAdmiELbkOcKqdKy5dR&P1=1765856811&P2=601&P3=2&P4=d7FovTkd%2F2PWSMh49Fs5prg1gtmlkyQo97mDjNw%2FOgM%3D',
      'arm64': 'https://software-static.download.prss.microsoft.com/dbazure/888969d5-f34g-4e03-ac9d-1f9786c66749/26200.6584.250915-1905.25h2_ge_release_svc_refresh_CLIENT_CONSUMER_A64FRE_pt-br.iso',
      'xp': 'https://archive.isdn.network/windows/pt-br_windows_xp_professional_with_service_pack_3_x86_cd_vl_x14-74137.iso',
      'server': 'https://delivery.massgrave.dev/dbmassgrave/pt-br_windows_server_2025_updated_nov_2025_x64_dvd_2cfcca22.iso?t=vzrKMpcsvKJYyEAdzkdMuZuHkHCbO7HO&P1=1765857289&P2=601&P3=2&P4=YHmFTid1w7HeXztJ2BQeji5H22%2FrA1fmeNaB4Iudo20%3D'
    };

    const multiArch = {
      '10': {
        x64: 'https://delivery.activated.win/dbmassgrave/pt-br_windows_10_consumer_editions_version_22h2_updated_oct_2025_x64_dvd_38efd00d.iso?t=vzrKMpcsvKJYyEAdKmUgHcwajc3NP3nZ&P1=1765856712&P2=601&P3=2&P4=Zl12LlLy%2F2v3PS3tXcR7KFAqUiNw5jNWmZcbwL0AFI0%3D',
        x86: 'https://delivery.activated.win/dbmassgrave/pt-br_windows_10_consumer_editions_version_22h2_updated_oct_2025_x86_dvd_38efd00d.iso?t=vzrKMpcsvKJYyEAdDCFsw6ZbqxT7XOl2&P1=1765856753&P2=601&P3=2&P4=HAKQNkHRYd9mV9G%2BIbAbEz0h4o00crwKIHdcN4TwQiI%3D'
      },
      '8.1': {
        x64: 'https://archive.isdn.network/windows/pt_windows_8.1_with_update_x64_dvd_6051496.iso',
        x86: 'https://archive.isdn.network/windows/pt_windows_8.1_with_update_x86_dvd_6051647.iso'
      },
      '8': {
        x64: 'https://archive.isdn.network/windows/pt_windows_8_x64_dvd_915416.iso',
        x86: 'https://archive.isdn.network/windows/pt_windows_8_x86_dvd_915467.iso'
      },
      '7': {
        x64: 'https://archive.isdn.network/windows/pt_windows_7_ultimate_with_sp1_x64_dvd_u_677358.iso',
        x86: 'https://archive.isdn.network/windows/pt_windows_7_ultimate_with_sp1_x86_dvd_u_677457.iso'
      },
      'vista': {
        x64: 'https://archive.isdn.network/windows/pt_windows_vista_with_sp2_x64_dvd_x15-36319.iso',
        x86: 'https://archive.isdn.network/windows/pt_windows_vista_with_sp2_x86_dvd_x15-36283.iso'
      }
    };

    // Versões com múltiplas arquiteturas - mostrar submenu
    if (multiArch[version]) {
      this.renderArchitectureMenu(version, multiArch[version]);
    }
    // Versões com download direto
    else if (downloads[version]) {
      this.startDownload(downloads[version]);
    }
    else {
      this.showModal('Versão não encontrada');
    }
  }

  renderArchitectureMenu(windowsVersion, urls) {
    const app = document.getElementById('app');
    const versionNames = {
      '10': 'Windows 10',
      '8.1': 'Windows 8.1',
      '8': 'Windows 8',
      '7': 'Windows 7',
      'vista': 'Windows Vista'
    };

    app.innerHTML = `
      <div class="screen-content">
        <h1 class="title">MASTER NERD</h1>
        <div class="subtitle" style="font-size: 0.8rem; margin-bottom: 5px; color: #aaa;">By Manoel Coelho</div>
        <div class="subtitle">${versionNames[windowsVersion] || windowsVersion}</div>

        <div class="pixel-wave">~ ~ ~ ~ ~</div>

        <div class="menu-items">
          <button class="menu-item" data-url="${urls.x64}">x64 (64-bit)</button>
          <button class="menu-item" data-url="${urls.x86}">x86 (32-bit)</button>
          <button class="menu-item" id="btn-voltar-arch">Voltar</button>
        </div>

        <div class="prompt-text">SELECT YOUR OPTION</div>
      </div>
    `;

    document.querySelectorAll('[data-url]').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-url');
        this.startDownload(url);
      });
    });

    document.getElementById('btn-voltar-arch').addEventListener('click', () => {
      this.renderWindowsMenu();
    });
  }

  startDownload(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.showModal('Download iniciado! Verifique a pasta de Downloads do seu navegador.');
  }

  renderOfficeMenu() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="screen-content">
        <h1 class="title">MASTER NERD</h1>
        <div class="subtitle" style="font-size: 0.8rem; margin-bottom: 5px; color: #aaa;">By Manoel Coelho</div>
        <div class="subtitle">OFFICE OPTIONS</div>

        <div class="pixel-wave">~ ~ ~ ~ ~</div>

        <div class="menu-items" style="max-height: 50vh; overflow-y: auto; padding-bottom: 10px;">
          <button class="menu-item" data-office="365">Microsoft 365 / Sub</button>
          <button class="menu-item" data-office="2024">Office 2024</button>
          <button class="menu-item" data-office="2021">Office 2021</button>
          <button class="menu-item" data-office="2019">Office 2019</button>
          <button class="menu-item" data-office="2016">Office 2016</button>
          <button class="menu-item" data-office="2013">Office 2013</button>
          <button class="menu-item" id="btn-voltar-office">Voltar</button>
        </div>

        <div class="prompt-text" style="margin-top: 15px;">SELECT YOUR OPTION</div>
      </div>
    `;

    document.querySelectorAll('[data-office]').forEach(btn => {
      btn.addEventListener('click', () => {
        const version = btn.getAttribute('data-office');
        const label = btn.textContent.trim();
        this.handleOfficeSelection(version, label);
      });
    });

    document.getElementById('btn-voltar-office').addEventListener('click', () => {
      this.renderExtrasMenu();
    });
  }

  handleOfficeSelection(version, labelText = 'Office') {
    const officeDownloads = {
      '365': [
        { label: 'Online x64', url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=O365EduCloudRetail&platform=x64&language=pt-br&version=O16GA' },
        { label: 'Online x32', url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=O365EduCloudRetail&platform=x86&language=pt-br&version=O16GA' }
      ],
      '2024': [
        { label: 'Online x64', url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=Home2024Retail&platform=x64&language=pt-br&version=O16GA' },
        { label: 'Online x32', url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=Home2024Retail&platform=x86&language=pt-br&version=O16GA' },
        { label: 'Offline x32-x64', url: 'https://officecdn.microsoft.com/db/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/pt-br/ProPlus2024Retail.img' }
      ],
      '2021': [
        { label: 'Online x64', url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=HomeStudent2021Retail&platform=x64&language=pt-br&version=O16GA' },
        { label: 'Online x32', url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=HomeStudent2021Retail&platform=x86&language=pt-br&version=O16GA' },
        { label: 'Offline x32-x64', url: 'https://officecdn.microsoft.com/db/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/pt-br/Professional2021Retail.img' }
      ],
      '2019': [
        { label: 'Online x64', url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=HomeStudent2019Retail&platform=x64&language=pt-br&version=O16GA' },
        { label: 'Online x32', url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=HomeStudent2019Retail&platform=x86&language=pt-br&version=O16GA' },
        { label: 'Offline x32-x64', url: 'https://officecdn.microsoft.com/db/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/pt-br/ProPlus2019Retail.img' }
      ],
      '2016': [
        { label: 'Online x64', url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=HomeStudentRetail&platform=x64&language=pt-br&version=O16GA' },
        { label: 'Online x32', url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=HomeStudentRetail&platform=x86&language=pt-br&version=O16GA' },
        { label: 'Offline x32-x64', url: 'https://officecdn.microsoft.com/db/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/pt-br/ProPlusRetail.img' }
      ],
      '2013': [
        { label: 'Online x64', url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=HomeStudentRetail&platform=x64&language=pt-br&version=O15GA' },
        { label: 'Online x32', url: 'https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=HomeStudentRetail&platform=x86&language=pt-br&version=O15GA' },
        { label: 'Offline x32-x64', url: 'https://officecdn.microsoft.com/db/39168d7e-077b-48e7-872c-b232c3e72675/media/pt-br/ProfessionalRetail.img' }
      ]
    };

    const selectedOptions = officeDownloads[version];
    if (!selectedOptions) {
      this.showModal('Versão de Office não encontrada.');
      return;
    }

    this.renderOfficeVariantMenu(labelText, selectedOptions);
  }

  renderOfficeVariantMenu(versionLabel, options) {
    const app = document.getElementById('app');
    const optionsHtml = options
      .map(option => `<button class="menu-item" data-office-url="${option.url}">${option.label}</button>`)
      .join('');

    app.innerHTML = `
      <div class="screen-content">
        <h1 class="title">MASTER NERD</h1>
        <div class="subtitle" style="font-size: 0.8rem; margin-bottom: 5px; color: #aaa;">By Manoel Coelho</div>
        <div class="subtitle">${versionLabel}</div>

        <div class="pixel-wave">~ ~ ~ ~ ~</div>

        <div class="menu-items">
          ${optionsHtml}
          <button class="menu-item" id="btn-voltar-office-versions">Voltar</button>
        </div>

        <div class="prompt-text">SELECT YOUR OPTION</div>
      </div>
    `;

    document.querySelectorAll('[data-office-url]').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-office-url');
        this.startDownload(url);
      });
    });

    document.getElementById('btn-voltar-office-versions').addEventListener('click', () => {
      this.renderOfficeMenu();
    });
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

      // Adiciona evento ao botão "Ativar modo Admin" na interface principal
      const mainElevateBtn = document.getElementById('btn-elevate');
      if (mainElevateBtn) {
        mainElevateBtn.addEventListener('click', () => {
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
      this.showModal('Nome inválido. Operação cancelada.');
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
      this.showModal('Nenhum disco foi selecionado para formatação.');
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
      this.showModal('É necessário executar como Administrador para formatar.');
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
      // Verifica se já está elevado
      if (this.isElevated) {
        this.showModal('O aplicativo já está em modo Administrador.');
        return;
      }
    
    if (!this.electronAPI?.elevateApp) {
      this.showModal('Elevação automática não suportada neste ambiente. Execute manualmente como Administrador.');
      return;
    }

    const statusText = document.getElementById('admin-status-text');
      const formatStatus = document.getElementById('format-status');
    
      // Mostra mensagem de feedback
    if (statusText) {
        statusText.textContent = 'Solicitando modo Administrador...';
        statusText.classList.add('warning');
      }
      if (formatStatus) {
        formatStatus.textContent = 'Aguarde... O aplicativo será reiniciado com privilégios de Administrador.';
        formatStatus.classList.remove('error', 'success');
        formatStatus.classList.add('warning');
    }

      console.log('Iniciando elevação do aplicativo...');
    
    try {
      await this.electronAPI.elevateApp();
        console.log('Elevação solicitada com sucesso. O app deve fechar e reabrir.');
    } catch (err) {
      console.error('Falha ao elevar aplicativo', err);
      if (statusText) {
          statusText.textContent = 'Erro: Não foi possível ativar o modo Admin.';
          statusText.classList.add('error');
        }
        if (formatStatus) {
          formatStatus.textContent = 'ERRO: Não foi possível elevar privilégios. Execute o Master.Nerd.exe como Administrador (clique direito > Executar como Administrador).';
          formatStatus.classList.add('error');
      }
      
        this.showModal('Erro ao solicitar privilégios de Administrador. Por favor, feche o aplicativo e execute-o manualmente como Administrador (clique direito > Executar como Administrador).');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new MasterNerdApp();
  app.init();
});
