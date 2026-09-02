/**
 * MeuIP Ultra - IP Subnet & CIDR Calculator Module
 */

const IPCalcModule = {
  init() {
    this.populateMaskDropdown();
    this.bindEvents();
    this.calculate(); // Calculate initial defaults
  },

  populateMaskDropdown() {
    const select = document.getElementById('calc-mask-select');
    if (!select) return;

    select.innerHTML = '';
    for (let cidr = 32; cidr >= 1; cidr--) {
      const maskInt = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
      const maskStr = this.intToIP(maskInt);
      const hosts = cidr === 32 ? 1 : (cidr === 31 ? 2 : Math.max(0, Math.pow(2, 32 - cidr) - 2));
      
      const option = document.createElement('option');
      option.value = cidr;
      option.textContent = `/${cidr} — ${maskStr} (${Utils.formatNumber(hosts)} hosts válidos)`;
      if (cidr === 24) option.selected = true;
      select.appendChild(option);
    }
  },

  bindEvents() {
    const ipInput = document.getElementById('calc-ip-input');
    const maskSelect = document.getElementById('calc-mask-select');
    const btnUseMyIP = document.getElementById('btn-use-myip-calc');

    if (ipInput) {
      ipInput.addEventListener('input', () => this.calculate());
    }

    if (maskSelect) {
      maskSelect.addEventListener('change', () => this.calculate());
    }

    if (btnUseMyIP) {
      btnUseMyIP.addEventListener('click', () => {
        const quickIp = window.MyIPModule ? window.MyIPModule.getIP() : (document.getElementById('main-ip-address')?.innerText.trim() || '');
        if (quickIp && !quickIp.includes('...')) {
          // If IPv4, use it
          if (!quickIp.includes(':')) {
            ipInput.value = quickIp;
            this.calculate();
            Utils.showToast(`IP ${quickIp} preenchido na calculadora!`, 'success');
          } else {
            Utils.showToast('Seu IP atual é IPv6. A calculadora utiliza formato IPv4.', 'info');
          }
        } else {
          Utils.showToast('Aguarde a detecção do seu IP...', 'info');
        }
      });
    }

    // Preset buttons
    const presetButtons = document.querySelectorAll('.btn-preset');
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const cidr = btn.dataset.cidr;
        if (maskSelect && cidr) {
          maskSelect.value = cidr;
          this.calculate();
        }
      });
    });
  },

  /**
   * Main calculation handler
   */
  calculate() {
    const ipInput = document.getElementById('calc-ip-input');
    const maskSelect = document.getElementById('calc-mask-select');
    if (!ipInput || !maskSelect) return;

    let ipStr = ipInput.value.trim();
    const cidr = parseInt(maskSelect.value, 10);

    // Validate IP
    if (!this.isValidIPv4(ipStr)) {
      this.displayInvalidState();
      return;
    }

    const ipInt = this.ipToInt(ipStr);
    const maskInt = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
    const wildcardInt = (~maskInt) >>> 0;
    
    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | wildcardInt) >>> 0;

    const networkIP = this.intToIP(networkInt);
    const broadcastIP = this.intToIP(broadcastInt);
    const maskIP = this.intToIP(maskInt);
    const wildcardIP = this.intToIP(wildcardInt);

    let firstHostInt, lastHostInt, totalHosts, usableHosts;
    totalHosts = Math.pow(2, 32 - cidr);

    if (cidr === 32) {
      firstHostInt = ipInt;
      lastHostInt = ipInt;
      usableHosts = 1;
    } else if (cidr === 31) {
      firstHostInt = networkInt;
      lastHostInt = broadcastInt;
      usableHosts = 2;
    } else {
      firstHostInt = networkInt + 1;
      lastHostInt = broadcastInt - 1;
      usableHosts = totalHosts - 2;
    }

    const firstHostIP = this.intToIP(firstHostInt);
    const lastHostIP = this.intToIP(lastHostInt);
    const usableRangeStr = cidr >= 31 ? `${firstHostIP} - ${lastHostIP}` : `${firstHostIP} até ${lastHostIP}`;

    const ipClass = this.getIPClass(ipStr);
    const ipType = this.getIPType(ipInt);

    // Update Results Table (null-safe)
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    
    setEl('res-network-ip', `${networkIP} /${cidr}`);
    setEl('res-broadcast-ip', broadcastIP);
    setEl('res-usable-range', usableRangeStr);
    setEl('res-first-host', firstHostIP);
    setEl('res-last-host', lastHostIP);
    setEl('res-usable-hosts', `${Utils.formatNumber(usableHosts)} hosts`);
    setEl('res-total-hosts', `${Utils.formatNumber(totalHosts)} endereços`);
    setEl('res-subnet-mask', maskIP);
    setEl('res-wildcard-mask', wildcardIP);

    const badgeClass = document.getElementById('badge-ip-class');
    const badgeType = document.getElementById('badge-ip-type');
    if (badgeClass && badgeType) {
      badgeClass.textContent = `Classe ${ipClass}`;
      badgeType.textContent = ipType;
    }

    // Binary Visualization
    this.renderBinaryBreakdown(ipInt, maskInt, networkInt, broadcastInt, cidr);
  },

  /**
   * Render color-coded binary representation
   */
  renderBinaryBreakdown(ipInt, maskInt, netInt, bcastInt, cidr) {
    const renderBits = (intVal) => {
      const bin32 = intVal.toString(2).padStart(32, '0');
      let html = '';
      for (let i = 0; i < 32; i++) {
        if (i > 0 && i % 8 === 0) {
          html += '<span class="bit-dot">.</span>';
        }
        const bit = bin32[i];
        const isNetBit = i < cidr;
        html += `<span class="${isNetBit ? 'bit-net' : 'bit-host'}">${bit}</span>`;
      }
      return html;
    };

    const setHtml = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
    setHtml('binary-ip', renderBits(ipInt));
    setHtml('binary-mask', renderBits(maskInt));
    setHtml('binary-net', renderBits(netInt));
    setHtml('binary-bcast', renderBits(bcastInt));
  },

  displayInvalidState() {
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('res-network-ip', 'IP Inválido');
    setEl('res-broadcast-ip', '--');
    setEl('res-usable-range', '--');
    setEl('res-first-host', '--');
    setEl('res-last-host', '--');
    setEl('res-usable-hosts', '--');
    setEl('res-total-hosts', '--');
    setEl('res-subnet-mask', '--');
    setEl('res-wildcard-mask', '--');
  },

  isValidIPv4(ip) {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every(part => {
      if (!/^\d+$/.test(part)) return false;
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  },

  ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
  },

  intToIP(intVal) {
    return [
      (intVal >>> 24) & 255,
      (intVal >>> 16) & 255,
      (intVal >>> 8) & 255,
      intVal & 255
    ].join('.');
  },

  getIPClass(ip) {
    const firstOctet = parseInt(ip.split('.')[0], 10);
    if (firstOctet >= 1 && firstOctet <= 126) return 'A';
    if (firstOctet === 127) return 'A (Loopback)';
    if (firstOctet >= 128 && firstOctet <= 191) return 'B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
    return 'E (Experimental)';
  },

  getIPType(ipInt) {
    const ipStr = this.intToIP(ipInt);
    const octets = ipStr.split('.').map(Number);

    // Private RFC 1918
    if (octets[0] === 10) return 'Privado (RFC 1918)';
    if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return 'Privado (RFC 1918)';
    if (octets[0] === 192 && octets[1] === 168) return 'Privado (RFC 1918)';

    // Loopback
    if (octets[0] === 127) return 'Loopback';

    // APIPA / Link-local
    if (octets[0] === 169 && octets[1] === 254) return 'APIPA (Link-Local)';

    // CGNAT RFC 6598
    if (octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127) return 'CGNAT (Provedor)';

    return 'Público (Internet)';
  }
};

window.IPCalcModule = IPCalcModule;
