/**
 * myip - DNS Lookup & WHOIS Records Module (DoH Engine)
 */

const DNSLookupModule = {
  recordTypes: ['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS', 'SOA'],
  currentType: 'ALL',

  init() {
    this.bindEvents();
  },

  bindEvents() {
    const btnLookup = document.getElementById('btn-query-dns');
    const inputDomain = document.getElementById('dns-domain-input');
    const typeButtons = document.querySelectorAll('.btn-dns-type');

    if (btnLookup && inputDomain) {
      const handleQuery = () => {
        const domain = inputDomain.value.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
        if (domain) {
          this.queryDNS(domain);
        } else {
          Utils.showToast('Digite um domínio válido (ex: google.com)', 'info');
        }
      };

      btnLookup.addEventListener('click', handleQuery);
      inputDomain.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleQuery();
      });
    }

    typeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        typeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentType = btn.dataset.type;
        const domain = inputDomain.value.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
        if (domain) {
          this.queryDNS(domain);
        }
      });
    });
  },

  /**
   * Query DNS records using Cloudflare DoH API
   */
  async queryDNS(domain) {
    const tableBody = document.getElementById('dns-results-tbody');
    const loadingState = document.getElementById('dns-loading');
    const resultsCard = document.getElementById('dns-results-card');

    if (!tableBody || !resultsCard) return;

    resultsCard.classList.remove('hidden');
    tableBody.innerHTML = '';
    loadingState.classList.remove('hidden');

    const typesToQuery = this.currentType === 'ALL' ? this.recordTypes : [this.currentType];
    const allRecords = [];

    try {
      const fetchPromises = typesToQuery.map(async (type) => {
        try {
          const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`, {
            headers: { 'Accept': 'application/dns-json' }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.Answer && Array.isArray(data.Answer)) {
              data.Answer.forEach(ans => {
                allRecords.push({
                  name: ans.name,
                  type: this.getTypeName(ans.type) || type,
                  ttl: ans.TTL,
                  data: ans.data
                });
              });
            }
          }
        } catch (e) {
          console.warn(`Erro ao consultar registro ${type}:`, e);
        }
      });

      await Promise.all(fetchPromises);

      loadingState.classList.add('hidden');

      if (allRecords.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="no-records-cell">Nenhum registro DNS encontrado para <strong>${domain}</strong></td></tr>`;
      } else {
        tableBody.innerHTML = allRecords.map(rec => `
          <tr>
            <td><span class="badge badge-dns badge-${rec.type}">${rec.type}</span></td>
            <td class="mono-text">${rec.name}</td>
            <td class="mono-text data-cell">${this.formatDNSData(rec.type, rec.data)}</td>
            <td class="mono-text text-muted">${rec.ttl}s</td>
          </tr>
        `).join('');
      }

      Utils.showToast(`Registros DNS de ${domain} carregados!`, 'success');
    } catch (err) {
      console.error('Erro na consulta DNS:', err);
      loadingState.classList.add('hidden');
      tableBody.innerHTML = `<tr><td colspan="4" class="no-records-cell text-danger">Falha ao consultar servidores DNS.</td></tr>`;
      Utils.showToast('Erro ao consultar DNS.', 'error');
    }
  },

  getTypeName(typeNumber) {
    const map = {
      1: 'A',
      28: 'AAAA',
      15: 'MX',
      16: 'TXT',
      5: 'CNAME',
      2: 'NS',
      6: 'SOA',
      12: 'PTR'
    };
    return map[typeNumber] || `TYPE-${typeNumber}`;
  },

  formatDNSData(type, data) {
    if (type === 'TXT') {
      return data.replace(/^"|"$/g, '');
    }
    return data;
  }
};

window.DNSLookupModule = DNSLookupModule;
