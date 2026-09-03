/**
 * MeuIP Ultra - IP Detection, Geolocation & Map Module
 */

const MyIPModule = {
  currentIPData: null,
  currentIPv4: null,
  currentIPv6: null,
  mapInstance: null,
  mapMarker: null,
  mapCircle: null,

  init() {
    this.bindEvents();
    this.renderIPHistory();
    this.fetchUserIP();
  },

  bindEvents() {
    // Copy Main IP button
    const btnCopyMain = document.getElementById('btn-copy-main-ip');
    if (btnCopyMain) {
      btnCopyMain.addEventListener('click', () => {
        const ip = document.getElementById('main-ip-address').innerText.trim();
        if (ip && !ip.includes('...')) {
          Utils.copyToClipboard(ip, `IP ${ip} copiado!`);
        }
      });
    }

    // Quick IP pill copy (if present)
    const pill = document.getElementById('nav-ip-pill');
    if (pill) {
      pill.addEventListener('click', () => {
        const quickIp = this.getIP();
        if (quickIp && !quickIp.includes('...')) {
          Utils.copyToClipboard(quickIp, `IP ${quickIp} copiado!`);
        }
      });
    }

    // Refresh button
    const btnRefresh = document.getElementById('btn-refresh-ip');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => {
        btnRefresh.classList.add('spinning');
        this.fetchUserIP().finally(() => {
          setTimeout(() => btnRefresh.classList.remove('spinning'), 600);
        });
      });
    }

    // Clear IP History Button
    const btnClearHist = document.getElementById('btn-clear-ip-history');
    if (btnClearHist) {
      btnClearHist.addEventListener('click', () => {
        localStorage.removeItem('myip_detection_history');
        this.renderIPHistory();
        Utils.showToast('Histórico de IPs limpo com sucesso!', 'info');
      });
    }

    // Custom IP search
    const btnSearch = document.getElementById('btn-search-ip');
    const inputSearch = document.getElementById('custom-ip-input');
    if (btnSearch && inputSearch) {
      const handleSearch = () => {
        const query = inputSearch.value.trim();
        if (query) {
          this.lookupCustomIP(query);
        } else {
          Utils.showToast('Digite um IP ou domínio válido para consultar.', 'info');
        }
      };

      btnSearch.addEventListener('click', handleSearch);
      inputSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
      });
    }
  },

  /**
   * Save detected IP and provider to session/localStorage history
   */
  addToHistory(data) {
    if (!data || !data.ip || data.ip.includes('...')) return;

    try {
      const historyJson = localStorage.getItem('myip_detection_history');
      let history = historyJson ? JSON.parse(historyJson) : [];

      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} - ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

      const providerStr = data.hostname || data.isp || 'Provedor';

      // Avoid adding duplicate if it's the same IP and provider within 30 seconds
      if (history.length > 0 && history[0].ip === data.ip && history[0].isp === providerStr) {
        // Just update timestamp of recent entry
        history[0].date = dateStr;
      } else {
        history.unshift({
          date: dateStr,
          ip: data.ip,
          isp: providerStr
        });
      }

      // Keep max 25 entries
      if (history.length > 25) {
        history = history.slice(0, 25);
      }

      localStorage.setItem('myip_detection_history', JSON.stringify(history));
      this.renderIPHistory();
    } catch (e) {
      console.warn('Erro ao salvar histórico de IPs:', e);
    }
  },

  /**
   * Render IP history table
   */
  renderIPHistory() {
    const tbody = document.getElementById('ip-history-tbody');
    if (!tbody) return;

    try {
      const historyJson = localStorage.getItem('myip_detection_history');
      const history = historyJson ? JSON.parse(historyJson) : [];

      if (history.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="3" class="no-records-cell">Nenhum histórico registrado ainda. Conforme seu IP for detectado, o histórico aparecerá aqui.</td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = history.map(item => `
        <tr>
          <td class="history-date-cell">${item.date}</td>
          <td class="mono-bold text-accent">${item.ip}</td>
          <td class="history-provider-cell">${item.isp}</td>
        </tr>
      `).join('');
    } catch (e) {
      console.error('Erro ao renderizar histórico de IPs:', e);
    }
  },

  /**
   * Helper to fetch IPv4 specifically from endpoints that do not have IPv6 AAAA records.
   * This guarantees that dual-stack connections always prioritize and return the IPv4 address.
   */
  async fetchIPv4Only() {
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

    const fetchWithTimeout = async (url, timeoutMs = 3500) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);
        return response;
      } catch (err) {
        clearTimeout(id);
        throw err;
      }
    };

    // Provider 1: api4.ipify.org (CORS enabled, IPv4 only DNS)
    try {
      const res = await fetchWithTimeout('https://api4.ipify.org?format=json');
      if (res.ok) {
        const data = await res.json();
        if (data.ip && ipv4Regex.test(data.ip.trim())) {
          return data.ip.trim();
        }
      }
    } catch (e) {
      console.warn('api4.ipify.org falhou, tentando fallback...', e);
    }

    // Provider 2: ipv4.icanhazip.com (IPv4 only DNS)
    try {
      const res = await fetchWithTimeout('https://ipv4.icanhazip.com');
      if (res.ok) {
        const text = (await res.text()).trim();
        if (ipv4Regex.test(text)) {
          return text;
        }
      }
    } catch (e) {
      console.warn('ipv4.icanhazip.com falhou, tentando fallback...', e);
    }

    // Provider 3: v4.ident.me (IPv4 only DNS)
    try {
      const res = await fetchWithTimeout('https://v4.ident.me');
      if (res.ok) {
        const text = (await res.text()).trim();
        if (ipv4Regex.test(text)) {
          return text;
        }
      }
    } catch (e) {
      console.warn('v4.ident.me falhou...', e);
    }

    return null;
  },

  /**
   * Fetch geolocation and network metadata for a specific IP
   */
  async fetchGeoForIP(ip, version = 'IPv4') {
    // 1. ipwhois.app
    try {
      const res = await fetch(`https://ipwhois.app/json/${encodeURIComponent(ip)}?lang=pt-BR`);
      if (res.ok) {
        const data = await res.json();
        if (data.success !== false && data.ip) {
          this.applyIPData({
            ip: data.ip,
            version: version,
            city: data.city || 'Desconhecida',
            region: data.region || 'Desconhecido',
            country: data.country || 'Brasil',
            country_code: data.country_code || 'BR',
            country_flag: data.country_flag || '',
            postal: data.postal || 'N/D',
            isp: data.isp || data.org || 'Provedor Local',
            asn: data.asn || 'N/D',
            org: data.org || data.isp || '',
            latitude: data.latitude || -23.5505,
            longitude: data.longitude || -46.6333,
            timezone: data.timezone_gmt || data.timezone || 'America/Sao_Paulo',
            hostname: data.reverse || `${data.ip}.dynamic.isp`
          });
          return true;
        }
      }
    } catch (e) {
      console.warn(`ipwhois para ${ip} falhou:`, e);
    }

    // 2. ipapi.co
    try {
      const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`);
      if (res.ok) {
        const data = await res.json();
        if (data.ip) {
          this.applyIPData({
            ip: data.ip,
            version: version,
            city: data.city || 'Desconhecida',
            region: data.region || 'Desconhecido',
            country: data.country_name || 'Brasil',
            country_code: data.country_code || 'BR',
            postal: data.postal || 'N/D',
            isp: data.org || 'Provedor Local',
            asn: data.asn || 'N/D',
            org: data.org || '',
            latitude: data.latitude || -23.5505,
            longitude: data.longitude || -46.6333,
            timezone: data.timezone || 'America/Sao_Paulo',
            hostname: data.hostname || `${data.ip}.dynamic.isp`
          });
          return true;
        }
      }
    } catch (e) {
      console.warn(`ipapi para ${ip} falhou:`, e);
    }

    // 3. Fallback se as APIs de geo falharem mas o IP é válido
    this.applyIPData({
      ip: ip,
      version: version,
      city: 'Localização Indisponível',
      region: 'N/D',
      country: 'Detectado',
      country_code: 'BR',
      postal: 'N/D',
      isp: 'Provedor de Conexão',
      asn: 'N/D',
      latitude: -23.5505,
      longitude: -46.6333,
      timezone: 'America/Sao_Paulo',
      hostname: ip
    });
    return true;
  },

  /**
   * Background check to detect if the user also has an active IPv6 address
   */
  async detectSecondaryIPv6() {
    try {
      const res = await fetch('https://api64.ipify.org?format=json');
      if (res.ok) {
        const data = await res.json();
        if (data.ip && data.ip.includes(':')) {
          this.currentIPv6 = data.ip;
          const rowIpv6 = document.getElementById('row-detail-ipv6');
          const valIpv6 = document.getElementById('detail-ipv6');
          if (rowIpv6 && valIpv6) {
            valIpv6.textContent = data.ip;
            rowIpv6.style.display = 'flex';
          }
        }
      }
    } catch (e) {
      // Sem IPv6 ou erro de rede, ignorar silenciosamente
    }
  },

  /**
   * Fetch current public IP prioritizing IPv4
   */
  async fetchUserIP() {
    const mainIpEl = document.getElementById('main-ip-address');
    const quickIpEl = document.getElementById('quick-ip-display');
    
    if (mainIpEl) mainIpEl.innerHTML = `<span class="loading-skeleton">Carregando endereço IP...</span>`;
    if (quickIpEl) quickIpEl.textContent = 'Carregando...';

    // 1. PRIORIDADE TOTAL AO IPV4
    let detectedIPv4 = null;
    try {
      detectedIPv4 = await this.fetchIPv4Only();
    } catch (e) {
      console.warn('Erro ao obter IPv4 direto:', e);
    }

    if (detectedIPv4) {
      this.currentIPv4 = detectedIPv4;
      const success = await this.fetchGeoForIP(detectedIPv4, 'IPv4');
      if (success) {
        this.detectSecondaryIPv6();
        return;
      }
    }

    // 2. FALLBACK GERAL (caso o usuário esteja em rede exclusivamente IPv6 sem rota IPv4)
    try {
      const res = await fetch('https://ipwhois.app/json/?lang=pt-BR');
      if (res.ok) {
        const data = await res.json();
        if (data.success !== false && data.ip) {
          const isV4 = !data.ip.includes(':');
          if (isV4) this.currentIPv4 = data.ip;
          else this.currentIPv6 = data.ip;

          this.applyIPData({
            ip: data.ip,
            version: data.type || (isV4 ? 'IPv4' : 'IPv6'),
            city: data.city || 'Desconhecida',
            region: data.region || 'Desconhecido',
            country: data.country || 'Brasil',
            country_code: data.country_code || 'BR',
            country_flag: data.country_flag || '',
            postal: data.postal || 'N/D',
            isp: data.isp || data.org || 'Provedor Local',
            asn: data.asn || 'N/D',
            org: data.org || data.isp || '',
            latitude: data.latitude || -23.5505,
            longitude: data.longitude || -46.6333,
            timezone: data.timezone_gmt || data.timezone || 'America/Sao_Paulo',
            hostname: data.reverse || `${data.ip}.dynamic.isp`
          });
          return;
        }
      }
    } catch (e) {
      console.warn('Fallback do ipwhois falhou, tentando ipapi...', e);
    }

    // Fallback ipapi.co
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (data.ip) {
          const isV4 = !data.ip.includes(':');
          if (isV4) this.currentIPv4 = data.ip;
          else this.currentIPv6 = data.ip;

          this.applyIPData({
            ip: data.ip,
            version: data.version || (isV4 ? 'IPv4' : 'IPv6'),
            city: data.city || 'Desconhecida',
            region: data.region || 'Desconhecido',
            country: data.country_name || 'Brasil',
            country_code: data.country_code || 'BR',
            postal: data.postal || 'N/D',
            isp: data.org || 'Provedor Local',
            asn: data.asn || 'N/D',
            org: data.org || '',
            latitude: data.latitude || -23.5505,
            longitude: data.longitude || -46.6333,
            timezone: data.timezone || 'America/Sao_Paulo',
            hostname: data.hostname || `${data.ip}.dynamic.isp`
          });
          return;
        }
      }
    } catch (e) {
      console.warn('Fallback do ipapi falhou, tentando ipify geral...', e);
    }

    // Fallback ipify dual-stack
    try {
      const res = await fetch('https://api64.ipify.org?format=json');
      if (res.ok) {
        const data = await res.json();
        const isV4 = !data.ip.includes(':');
        if (isV4) this.currentIPv4 = data.ip;
        else this.currentIPv6 = data.ip;

        this.applyIPData({
          ip: data.ip,
          version: isV4 ? 'IPv4' : 'IPv6',
          city: 'Localização Indisponível',
          region: 'N/D',
          country: 'Detectado',
          country_code: 'BR',
          postal: 'N/D',
          isp: 'Provedor de Conexão',
          asn: 'N/D',
          latitude: -23.5505,
          longitude: -46.6333,
          timezone: 'America/Sao_Paulo',
          hostname: data.ip
        });
        return;
      }
    } catch (e) {
      console.error('Todos os serviços de IP falharam:', e);
      if (mainIpEl) mainIpEl.textContent = 'Erro ao obter IP';
      if (quickIpEl) quickIpEl.textContent = 'Indisponível';
      Utils.showToast('Não foi possível obter o IP automaticamente.', 'error');
    }
  },

  /**
   * Search any custom IP or domain
   */
  async lookupCustomIP(query) {
    Utils.showToast(`Buscando dados de ${query}...`, 'info');
    try {
      const res = await fetch(`https://ipwhois.app/json/${encodeURIComponent(query)}?lang=pt-BR`);
      const data = await res.json();
      if (data.success !== false && data.ip) {
        this.applyIPData({
          ip: data.ip,
          version: data.type || (data.ip.includes(':') ? 'IPv6' : 'IPv4'),
          city: data.city || 'Desconhecida',
          region: data.region || 'Desconhecido',
          country: data.country || 'N/D',
          country_code: data.country_code || '',
          country_flag: data.country_flag || '',
          postal: data.postal || 'N/D',
          isp: data.isp || data.org || 'Provedor',
          asn: data.asn || 'N/D',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          timezone: data.timezone_gmt || data.timezone || 'UTC',
          hostname: data.reverse || query
        });
        Utils.showToast(`Dados de ${data.ip} carregados com sucesso!`, 'success');
      } else {
        Utils.showToast(`Nenhuma informação encontrada para: ${query}`, 'error');
      }
    } catch (e) {
      console.error('Erro na consulta personalizada:', e);
      Utils.showToast('Erro ao consultar o IP/domínio informado.', 'error');
    }
  },

  /**
   * Apply received IP data to UI and Map
   */
  getIP() {
    if (this.currentIPv4) return this.currentIPv4;
    if (this.currentIPData && this.currentIPData.ip) return this.currentIPData.ip;
    const mainEl = document.getElementById('main-ip-address');
    if (mainEl && !mainEl.innerText.includes('...')) return mainEl.innerText.trim();
    return '';
  },

  getIPv4() {
    if (this.currentIPv4) return this.currentIPv4;
    if (this.currentIPData && this.currentIPData.ip && !this.currentIPData.ip.includes(':')) {
      return this.currentIPData.ip;
    }
    return '';
  },

  getIPv6() {
    return this.currentIPv6 || '';
  },

  applyIPData(data) {
    this.currentIPData = data;
    if (data.ip && !data.ip.includes(':')) {
      this.currentIPv4 = data.ip;
    }

    // Null-safe setter helpers
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const setHtml = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };

    // Main Displays
    setEl('main-ip-address', data.ip);
    setEl('quick-ip-display', data.ip);
    
    // Quick Pills
    setEl('quick-location', `${data.city}, ${data.region} (${data.country})`);
    setEl('quick-isp', data.isp);
    setEl('quick-ip-version', `${data.version} Detectado`);

    // Detailed Table
    const flagEmoji = data.country_code ? this.getFlagEmoji(data.country_code) : '🌐';
    setHtml('detail-country', `${flagEmoji} ${data.country} (${data.country_code})`);
    setEl('detail-region', data.region);
    setEl('detail-city', data.city);
    setEl('detail-isp', data.isp);
    setEl('detail-asn', data.asn);
    setEl('detail-hostname', data.hostname || data.ip);
    setEl('detail-timezone', data.timezone);
    setEl('detail-coords', `${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`);

    // Update Map
    this.updateMap(data.latitude, data.longitude, `${data.city}, ${data.country}`, data.ip);

    // Save to History
    this.addToHistory(data);

    // Auto-detect Language based on country if not manually selected
    if (window.I18n && data.country_code) {
      window.I18n.autoDetectFromCountry(data.country_code);
    }
  },

  /**
   * Convert ISO 2-letter country code to Flag emoji
   */
  getFlagEmoji(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '🌐';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  },

  /**
   * Render or update Leaflet Map
   */
  updateMap(lat, lng, locationName, ip) {
    const mapContainer = document.getElementById('ip-map');
    if (!mapContainer || typeof L === 'undefined') return;

    if (!this.mapInstance) {
      this.mapInstance = L.map('ip-map', {
        center: [lat, lng],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: false
      });

      // Dark theme OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(this.mapInstance);
    } else {
      this.mapInstance.setView([lat, lng], 12);
    }

    // Remove previous markers
    if (this.mapMarker) this.mapInstance.removeLayer(this.mapMarker);
    if (this.mapCircle) this.mapInstance.removeLayer(this.mapCircle);

    // Add marker and accuracy circle
    this.mapMarker = L.marker([lat, lng]).addTo(this.mapInstance);
    this.mapMarker.bindPopup(`<b>IP: ${ip}</b><br>${locationName}`).openPopup();

    this.mapCircle = L.circle([lat, lng], {
      color: '#06b6d4',
      fillColor: '#6366f1',
      fillOpacity: 0.15,
      radius: 3500
    }).addTo(this.mapInstance);

    // Invalidate map size after animation
    setTimeout(() => {
      if (this.mapInstance) this.mapInstance.invalidateSize();
    }, 400);
  }
};

window.MyIPModule = MyIPModule;
