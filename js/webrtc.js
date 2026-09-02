/**
 * myip - WebRTC Leak Detector Module (Privacy & VPN Test)
 */

const WebRTCModule = {
  isRunning: false,
  detectedLocalIPs: new Set(),
  detectedPublicIPs: new Set(),

  init() {
    this.bindEvents();
  },

  bindEvents() {
    const btnTest = document.getElementById('btn-test-webrtc');
    if (btnTest) {
      btnTest.addEventListener('click', () => {
        if (!this.isRunning) {
          this.runLeakTest();
        }
      });
    }
  },

  /**
   * Scan WebRTC ICE Candidates for IP leaks
   */
  async runLeakTest() {
    this.isRunning = true;
    this.detectedLocalIPs.clear();
    this.detectedPublicIPs.clear();

    const btnTest = document.getElementById('btn-test-webrtc');
    const statusBadge = document.getElementById('webrtc-status-badge');
    const localList = document.getElementById('webrtc-local-ips');
    const publicList = document.getElementById('webrtc-public-ips');
    const explanationBox = document.getElementById('webrtc-explanation');

    btnTest.disabled = true;
    btnTest.innerHTML = `<span class="btn-spinner"></span> Analisando WebRTC...`;
    statusBadge.className = 'status-pill testing';
    statusBadge.textContent = 'Verificando...';
    localList.innerHTML = '<li class="loading-item">Escaneando candidatos locais...</li>';
    publicList.innerHTML = '<li class="loading-item">Escaneando candidatos públicos STUN...</li>';

    const pc = new (window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection)({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ]
    });

    // Create a dummy data channel to trigger ICE candidate gathering
    pc.createDataChannel('myip-webrtc-test');

    const handleCandidate = (candidateStr) => {
      if (!candidateStr) return;

      // Extract IPv4 & IPv6 from candidate SDP string
      const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/gi;
      const matches = candidateStr.match(ipRegex);

      if (matches) {
        matches.forEach(ip => {
          if (this.isLocalIP(ip)) {
            this.detectedLocalIPs.add(ip);
          } else {
            this.detectedPublicIPs.add(ip);
          }
        });
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && event.candidate.candidate) {
        handleCandidate(event.candidate.candidate);
      }
    };

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Wait 3.5 seconds for gathering to complete
      await new Promise(r => setTimeout(r, 3500));
    } catch (err) {
      console.warn('WebRTC bloqueado ou restrito no navegador:', err);
    } finally {
      pc.close();
      this.isRunning = false;
      btnTest.disabled = false;
      btnTest.innerHTML = `Testar Novamente`;
      this.renderResults();
    }
  },

  isLocalIP(ip) {
    return (
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip.startsWith('172.16.') ||
      ip.startsWith('172.17.') ||
      ip.startsWith('172.18.') ||
      ip.startsWith('172.19.') ||
      ip.startsWith('172.2') ||
      ip.startsWith('172.30.') ||
      ip.startsWith('172.31.') ||
      ip.startsWith('127.') ||
      ip.startsWith('169.254.') ||
      ip.endsWith('.local')
    );
  },

  renderResults() {
    const statusBadge = document.getElementById('webrtc-status-badge');
    const localList = document.getElementById('webrtc-local-ips');
    const publicList = document.getElementById('webrtc-public-ips');
    const explanationBox = document.getElementById('webrtc-explanation');

    const localArr = Array.from(this.detectedLocalIPs);
    const publicArr = Array.from(this.detectedPublicIPs);
    const mainIpEl = document.getElementById('main-ip-address');
    const mainHttpIP = mainIpEl ? mainIpEl.innerText.trim() : '';

    // Render Local IPs
    if (localArr.length > 0) {
      localList.innerHTML = localArr.map(ip => `
        <li class="ip-item"><span class="badge badge-secondary">LAN</span> <span class="mono-text">${ip}</span></li>
      `).join('');
    } else {
      localList.innerHTML = `<li class="secure-item">Nenhum IP local exposto pelo WebRTC (Protegido / mDNS ativo)</li>`;
    }

    // Render Public WebRTC IPs
    if (publicArr.length > 0) {
      publicList.innerHTML = publicArr.map(ip => `
        <li class="ip-item"><span class="badge badge-info">WebRTC</span> <span class="mono-text">${ip}</span></li>
      `).join('');
    } else {
      publicList.innerHTML = `<li class="secure-item">Nenhum IP público adicional vazando via WebRTC</li>`;
    }

    // Check if there is a privacy leak (e.g. WebRTC exposed an IP different from VPN / proxy)
    let isLeaking = false;
    if (publicArr.length > 1) {
      isLeaking = true;
    } else if (publicArr.length === 1 && mainHttpIP && !mainHttpIP.includes('...') && publicArr[0] !== mainHttpIP) {
      isLeaking = true;
    }

    if (isLeaking) {
      statusBadge.className = 'status-pill warning';
      statusBadge.textContent = 'Possível Vazamento de IP!';
      explanationBox.innerHTML = `
        <div class="alert alert-warning">
          <strong>Atenção:</strong> O protocolo WebRTC revelou um endereço IP diferente do seu IP HTTP padrão. Se você estiver usando uma VPN ou Proxy, isso significa que sua localização real pode estar exposta.
        </div>
      `;
    } else {
      statusBadge.className = 'status-pill success';
      statusBadge.textContent = 'Conexão Protegida';
      explanationBox.innerHTML = `
        <div class="alert alert-success">
          <strong>Tudo Seguro:</strong> Não foram detectados vazamentos de IP pelo protocolo WebRTC. Seu navegador está protegendo adequadamente seus endereços de rede.
        </div>
      `;
    }
  }
};

window.WebRTCModule = WebRTCModule;
