/**
 * myip - IP Format Converter Module
 */

const IPConvertModule = {
  isUpdating: false,

  init() {
    this.bindEvents();
    this.convertFromDotted('192.168.1.1');
  },

  bindEvents() {
    const inputDotted = document.getElementById('conv-dotted');
    const inputInteger = document.getElementById('conv-integer');
    const inputHex = document.getElementById('conv-hex');
    const inputBinary = document.getElementById('conv-binary');
    const btnUseMyIP = document.getElementById('btn-use-myip-convert');

    if (inputDotted) {
      inputDotted.addEventListener('input', () => {
        if (!this.isUpdating) this.convertFromDotted(inputDotted.value.trim());
      });
    }

    if (inputInteger) {
      inputInteger.addEventListener('input', () => {
        if (!this.isUpdating) this.convertFromInteger(inputInteger.value.trim());
      });
    }

    if (inputHex) {
      inputHex.addEventListener('input', () => {
        if (!this.isUpdating) this.convertFromHex(inputHex.value.trim());
      });
    }

    if (inputBinary) {
      inputBinary.addEventListener('input', () => {
        if (!this.isUpdating) this.convertFromBinary(inputBinary.value.trim());
      });
    }

    if (btnUseMyIP) {
      btnUseMyIP.addEventListener('click', () => {
        const quickIp = window.MyIPModule ? window.MyIPModule.getIP() : (document.getElementById('main-ip-address')?.innerText.trim() || '');
        if (quickIp && !quickIp.includes('...') && !quickIp.includes(':')) {
          inputDotted.value = quickIp;
          this.convertFromDotted(quickIp);
          Utils.showToast(`IP ${quickIp} preenchido no conversor!`, 'success');
        } else {
          Utils.showToast('Insira um IPv4 válido para conversão.', 'info');
        }
      });
    }

    // Copy buttons
    document.querySelectorAll('.btn-copy-conv').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const targetInput = document.getElementById(targetId);
        if (targetInput && targetInput.value) {
          Utils.copyToClipboard(targetInput.value, 'Valor copiado!');
        }
      });
    });
  },

  isValidDotted(ip) {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every(p => /^\d+$/.test(p) && parseInt(p, 10) >= 0 && parseInt(p, 10) <= 255);
  },

  convertFromDotted(dottedStr) {
    if (!this.isValidDotted(dottedStr)) return;
    const octets = dottedStr.split('.').map(Number);
    const intVal = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
    this.updateAllFields(intVal, 'dotted');
  },

  convertFromInteger(intStr) {
    const num = parseInt(intStr, 10);
    if (isNaN(num) || num < 0 || num > 4294967295) return;
    this.updateAllFields(num, 'integer');
  },

  convertFromHex(hexStr) {
    let cleanHex = hexStr.replace(/^0x/i, '').replace(/[^0-9a-fA-F]/g, '');
    if (cleanHex.length > 8) return;
    const num = parseInt(cleanHex, 16);
    if (!isNaN(num)) {
      this.updateAllFields(num >>> 0, 'hex');
    }
  },

  convertFromBinary(binStr) {
    const cleanBin = binStr.replace(/[^01]/g, '');
    if (cleanBin.length !== 32) return;
    const num = parseInt(cleanBin, 2);
    if (!isNaN(num)) {
      this.updateAllFields(num >>> 0, 'binary');
    }
  },

  updateAllFields(intVal, source) {
    this.isUpdating = true;

    const octets = [
      (intVal >>> 24) & 255,
      (intVal >>> 16) & 255,
      (intVal >>> 8) & 255,
      intVal & 255
    ];

    const dotted = octets.join('.');
    const integer = intVal.toString(10);
    const hex = '0x' + octets.map(o => o.toString(16).padStart(2, '0')).join('').toUpperCase();
    const hexDotted = octets.map(o => '0x' + o.toString(16).padStart(2, '0').toUpperCase()).join('.');
    const binary = octets.map(o => o.toString(2).padStart(8, '0')).join('.');
    const octal = octets.map(o => '0' + o.toString(8).padStart(3, '0')).join('.');
    const ipv6Mapped = `::ffff:${dotted}`;
    const reverseDns = `${octets[3]}.${octets[2]}.${octets[1]}.${octets[0]}.in-addr.arpa`;

    if (source !== 'dotted') document.getElementById('conv-dotted').value = dotted;
    if (source !== 'integer') document.getElementById('conv-integer').value = integer;
    if (source !== 'hex') document.getElementById('conv-hex').value = hex;
    if (source !== 'binary') document.getElementById('conv-binary').value = binary;

    document.getElementById('conv-hex-dotted').value = hexDotted;
    document.getElementById('conv-octal').value = octal;
    document.getElementById('conv-ipv6-mapped').value = ipv6Mapped;
    document.getElementById('conv-reverse-dns').value = reverseDns;

    this.isUpdating = false;
  }
};

window.IPConvertModule = IPConvertModule;
