/**
 * myip - Port Checker & Scanner Module
 */

const PortCheckModule = {
  commonPorts: [
    { port: 80, name: 'HTTP (Web)', desc: 'Navegação padrão sem criptografia' },
    { port: 443, name: 'HTTPS (Web Segura)', desc: 'Navegação segura com SSL/TLS' },
    { port: 21, name: 'FTP', desc: 'Transferência de arquivos' },
    { port: 22, name: 'SSH / SFTP', desc: 'Acesso remoto seguro a servidores' },
    { port: 25, name: 'SMTP', desc: 'Envio de e-mails' },
    { port: 53, name: 'DNS', desc: 'Resolução de nomes de domínio' },
    { port: 3389, name: 'RDP (Remote Desktop)', desc: 'Área de trabalho remota Windows' },
    { port: 8080, name: 'HTTP Alternativo', desc: 'Servidores proxy e apps web' },
    { port: 3000, name: 'Node / React Dev', desc: 'Ambiente de desenvolvimento web' },
    { port: 8443, name: 'HTTPS Alternativo', desc: 'Aplicações web seguras customizadas' }
  ],

  init() {
    this.renderCommonPortsList();
    this.bindEvents();
  },

  renderCommonPortsList() {
    const container = document.getElementById('common-ports-grid');
    if (!container) return;

    container.innerHTML = this.commonPorts.map(p => `
      <div class="port-item-card" data-port="${p.port}">
        <div class="port-info">
          <span class="port-number">Porta ${p.port}</span>
          <span class="port-service">${p.name}</span>
          <small class="port-desc">${p.desc}</small>
        </div>
        <div class="port-action">
          <span class="port-status-badge badge-idle" id="status-port-${p.port}">Não testada</span>
          <button class="btn-sm btn-ghost btn-test-single-port" data-port="${p.port}">Testar</button>
        </div>
      </div>
    `).join('');
  },

  bindEvents() {
    const btnScanAll = document.getElementById('btn-scan-all-ports');
    const btnCheckCustom = document.getElementById('btn-check-custom-port');
    const inputCustomPort = document.getElementById('custom-port-input');
    const inputTargetHost = document.getElementById('port-target-host');
    const btnUseMyIP = document.getElementById('btn-use-myip-port');

    if (btnUseMyIP && inputTargetHost) {
      btnUseMyIP.addEventListener('click', () => {
        const quickIp = window.MyIPModule ? window.MyIPModule.getIP() : (document.getElementById('main-ip-address')?.innerText.trim() || '');
        if (quickIp && !quickIp.includes('...')) {
          inputTargetHost.value = quickIp;
          Utils.showToast(`IP ${quickIp} preenchido como alvo!`, 'success');
        }
      });
    }

    if (btnScanAll) {
      btnScanAll.addEventListener('click', () => {
        const host = (inputTargetHost.value.trim() || 'localhost');
        this.scanAllPorts(host);
      });
    }

    if (btnCheckCustom && inputCustomPort) {
      btnCheckCustom.addEventListener('click', () => {
        const port = parseInt(inputCustomPort.value.trim(), 10);
        const host = inputTargetHost.value.trim() || 'localhost';
        if (port && port >= 1 && port <= 65535) {
          this.checkSinglePort(host, port, true);
        } else {
          Utils.showToast('Insira uma porta válida entre 1 e 65535.', 'error');
        }
      });
    }

    // Individual port test button listener
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-test-single-port');
      if (btn) {
        const port = parseInt(btn.dataset.port, 10);
        const host = inputTargetHost.value.trim() || 'localhost';
        this.checkSinglePort(host, port, false);
      }
    });
  },

  /**
   * Check a single port status using fetch / image timeout heuristic
   */
  async checkSinglePort(host, port, isCustom = false) {
    const badge = isCustom ? document.getElementById('custom-port-status-badge') : document.getElementById(`status-port-${port}`);
    if (badge) {
      badge.className = 'port-status-badge badge-testing';
      badge.textContent = 'Testando...';
    }

    const result = await this.probePort(host, port);

    if (badge) {
      if (result.status === 'open') {
        badge.className = 'port-status-badge badge-open';
        badge.textContent = 'Aberta / Ativa';
      } else if (result.status === 'filtered') {
        badge.className = 'port-status-badge badge-filtered';
        badge.textContent = 'Filtrada / Bloqueada';
      } else {
        badge.className = 'port-status-badge badge-closed';
        badge.textContent = 'Fechada / Inacessível';
      }
    }

    if (isCustom) {
      const detail = document.getElementById('custom-port-detail-text');
      if (detail) {
        detail.textContent = `Resultado para ${host}:${port} — Status: ${result.status.toUpperCase()} (${result.time}ms)`;
      }
    }
  },

  /**
   * Scan all common ports sequentially
   */
  async scanAllPorts(host) {
    const btnScanAll = document.getElementById('btn-scan-all-ports');
    if (btnScanAll) {
      btnScanAll.disabled = true;
      btnScanAll.textContent = 'Escaneando portas...';
    }

    for (const item of this.commonPorts) {
      await this.checkSinglePort(host, item.port, false);
      await new Promise(r => setTimeout(r, 100));
    }

    if (btnScanAll) {
      btnScanAll.disabled = false;
      btnScanAll.textContent = 'Escanear Todas as Portas';
    }
    Utils.showToast(`Varredura de portas em ${host} finalizada!`, 'success');
  },

  /**
   * Probe port using timing measurement and protocol check
   */
  probePort(host, port) {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const timeoutMs = 2500;
      let settled = false;

      // Handle HTTP/HTTPS known ports directly with fetch
      const isHttp = port === 80 || port === 8080 || port === 3000;
      const isHttps = port === 443 || port === 8443;
      const protocol = isHttps ? 'https' : (isHttp ? 'http' : 'http');
      const testUrl = `${protocol}://${host}:${port}/?_t=${Date.now()}`;

      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          resolve({ status: 'filtered', time: timeoutMs });
        }
      }, timeoutMs);

      // Attempt fetch with AbortController
      const controller = new AbortController();
      fetch(testUrl, { method: 'HEAD', mode: 'no-cors', signal: controller.signal })
        .then(() => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            const duration = Math.round(performance.now() - startTime);
            resolve({ status: 'open', time: duration });
          }
        })
        .catch((err) => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            const duration = Math.round(performance.now() - startTime);
            // If connection was refused very quickly (<150ms), port is closed. If timed out, filtered.
            if (duration < 300) {
              resolve({ status: 'closed', time: duration });
            } else {
              resolve({ status: 'filtered', time: duration });
            }
          }
        });
    });
  }
};

window.PortCheckModule = PortCheckModule;
