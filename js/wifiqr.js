/**
 * myip - Wi-Fi QR Code Generator Module
 */

const WiFiQRModule = {
  init() {
    this.bindEvents();
    this.generate(); // Generate initial preview
  },

  bindEvents() {
    const inputs = ['wifi-ssid', 'wifi-password', 'wifi-auth', 'wifi-hidden'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.generate());
        el.addEventListener('change', () => this.generate());
      }
    });

    const btnDownload = document.getElementById('btn-download-wifi-qr');
    if (btnDownload) {
      btnDownload.addEventListener('click', () => this.downloadQR());
    }

    const btnPrint = document.getElementById('btn-print-wifi-card');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => this.printCard());
    }
  },

  /**
   * Format standard Wi-Fi payload
   */
  getPayload() {
    const ssid = (document.getElementById('wifi-ssid').value || 'MinhaRede').trim();
    const pass = (document.getElementById('wifi-password').value || '').trim();
    const auth = document.getElementById('wifi-auth').value || 'WPA';
    const hidden = document.getElementById('wifi-hidden').checked;

    // Standard Wi-Fi URI format
    // WIFI:T:WPA;S:MySSID;P:MyPassword;H:false;;
    const escapeStr = (str) => str.replace(/([\\;,:"])/g, '\\$1');
    return `WIFI:T:${auth};S:${escapeStr(ssid)};P:${escapeStr(pass)};H:${hidden};;`;
  },

  /**
   * Generate and render QR Code onto Canvas
   */
  generate() {
    const payload = this.getPayload();
    const canvas = document.getElementById('wifi-qr-canvas');
    const previewSSID = document.getElementById('preview-wifi-ssid');
    const previewPass = document.getElementById('preview-wifi-password');

    if (previewSSID) previewSSID.textContent = document.getElementById('wifi-ssid').value || 'MinhaRede';
    if (previewPass) previewPass.textContent = document.getElementById('wifi-password').value || 'Sem senha';

    if (!canvas) return;

    // Use QuickChart / Google Chart QR API or Canvas fallback
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(payload)}`;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx.drawImage(img, 0, 0, 300, 300);
    };
    img.onerror = () => {
      // Offline fallback: draw stylized placeholder
      canvas.width = 300;
      canvas.height = 300;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 300, 300);
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('QR Code Wi-Fi', 150, 140);
      ctx.font = '12px monospace';
      ctx.fillText(payload.substring(0, 28) + '...', 150, 165);
    };
    img.src = qrUrl;
  },

  downloadQR() {
    const canvas = document.getElementById('wifi-qr-canvas');
    const ssid = (document.getElementById('wifi-ssid').value || 'wifi').replace(/\s+/g, '_');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `wifi-qrcode-${ssid}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    Utils.showToast('QR Code do Wi-Fi baixado!', 'success');
  },

  printCard() {
    const ssid = document.getElementById('wifi-ssid').value || 'MinhaRede';
    const pass = document.getElementById('wifi-password').value || '(Sem senha)';
    const canvas = document.getElementById('wifi-qr-canvas');
    if (!canvas) return;

    const qrDataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Conectar ao Wi-Fi - ${ssid}</title>
        <style>
          body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 90vh; background: #f3f4f6; }
          .card { background: white; padding: 32px; border-radius: 16px; border: 2px solid #e5e7eb; text-align: center; max-width: 360px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          h2 { margin: 0 0 8px 0; color: #111827; font-size: 1.5rem; }
          p { margin: 4px 0; color: #4b5563; font-size: 0.95rem; }
          .qr-img { width: 220px; height: 220px; margin: 16px 0; border: 1px solid #e5e7eb; border-radius: 8px; }
          .info-box { background: #f9fafb; padding: 10px; border-radius: 8px; margin-top: 12px; font-family: monospace; font-size: 0.95rem; text-align: left; }
          .footer-note { font-size: 0.75rem; color: #9ca3af; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Conecte-se ao Wi-Fi</h2>
          <p>Aponte a câmera do seu celular para conectar</p>
          <img class="qr-img" src="${qrDataUrl}" alt="QR Code Wi-Fi" />
          <div class="info-box">
            <div><strong>Rede:</strong> ${ssid}</div>
            <div><strong>Senha:</strong> ${pass}</div>
          </div>
          <div class="footer-note">Gerado por myip</div>
        </div>
        <script>
          window.onload = () => { window.print(); };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
};

window.WiFiQRModule = WiFiQRModule;
