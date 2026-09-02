/**
 * MeuIP Ultra - Password Generator & Entropy Module
 */

const PasswordModule = {
  history: [],
  mode: 'chars', // 'chars' | 'passphrase'

  // Curated Portuguese word list for memorable passphrases
  wordList: [
    'aguia', 'alegria', 'amigo', 'anjo', 'astro', 'audaz', 'azul', 'bambu', 'barco', 'belo',
    'brisa', 'cabana', 'cacau', 'cactus', 'campo', 'castelo', 'cavalo', 'cedro', 'cereja', 'chave',
    'clima', 'colina', 'coral', 'coragem', 'cristal', 'diamante', 'dourado', 'dragao', 'ducha', 'eco',
    'elmo', 'energia', 'enigma', 'espada', 'estrela', 'falcao', 'farol', 'fauna', 'felino', 'ferro',
    'flama', 'floresta', 'fonte', 'forte', 'fresco', 'futuro', 'galaxia', 'gaviao', 'geada', 'gelo',
    'gigante', 'globo', 'grifo', 'guarda', 'harmonia', 'heroi', 'horizonte', 'ilha', 'impacto', 'impulso',
    'jardim', 'jazida', 'lago', 'lenda', 'leopardo', 'limpo', 'lobo', 'lontra', 'lunar', 'magia',
    'manto', 'marte', 'matriz', 'melodia', 'meteoro', 'minuto', 'miragem', 'montanha', 'muralha', 'navio',
    'nebula', 'ninja', 'nobre', 'nuvem', 'oasis', 'oceano', 'oliva', 'orvalho', 'palacio', 'pantera',
    'passo', 'patria', 'pedra', 'perola', 'phoenix', 'piloto', 'planeta', 'plasma', 'prisma', 'pureza',
    'quasar', 'radar', 'raio', 'raposa', 'reino', 'rio', 'rocha', 'sabio', 'sagrado', 'safira',
    'salto', 'selva', 'serena', 'silencio', 'solar', 'sonho', 'sombra', 'tempo', 'tempestade', 'terra',
    'tigre', 'trovao', 'tunel', 'turquesa', 'urano', 'valente', 'vapor', 'veleiro', 'vento', 'verao',
    'vertice', 'vigia', 'violeta', 'vital', 'vulcao', 'zenite', 'zero'
  ],

  init() {
    this.bindEvents();
    this.generate(); // Initial generation
  },

  bindEvents() {
    // Mode switcher buttons
    const btnModeChars = document.getElementById('mode-random-chars');
    const btnModePassphrase = document.getElementById('mode-passphrase');
    const panelChars = document.getElementById('settings-characters-mode');
    const panelPassphrase = document.getElementById('settings-passphrase-mode');

    if (btnModeChars && btnModePassphrase) {
      btnModeChars.addEventListener('click', () => {
        this.mode = 'chars';
        btnModeChars.classList.add('active');
        btnModePassphrase.classList.remove('active');
        panelChars.classList.remove('hidden');
        panelPassphrase.classList.add('hidden');
        this.generate();
      });

      btnModePassphrase.addEventListener('click', () => {
        this.mode = 'passphrase';
        btnModePassphrase.classList.add('active');
        btnModeChars.classList.remove('active');
        panelPassphrase.classList.remove('hidden');
        panelChars.classList.add('hidden');
        this.generate();
      });
    }

    // Sliders
    const lenSlider = document.getElementById('pwd-length-slider');
    const lenDisplay = document.getElementById('pwd-length-display');
    if (lenSlider && lenDisplay) {
      lenSlider.addEventListener('input', () => {
        lenDisplay.textContent = `${lenSlider.value} caracteres`;
        this.generate();
      });
    }

    const wordsSlider = document.getElementById('passphrase-words-slider');
    const wordsDisplay = document.getElementById('passphrase-words-display');
    if (wordsSlider && wordsDisplay) {
      wordsSlider.addEventListener('input', () => {
        wordsDisplay.textContent = `${wordsSlider.value} palavras`;
        this.generate();
      });
    }

    // Checkboxes & Selects
    const checkboxes = document.querySelectorAll('#pane-password input[type="checkbox"], #passphrase-separator');
    checkboxes.forEach(input => {
      input.addEventListener('change', () => this.generate());
    });

    // Generate Button
    const btnGen = document.getElementById('btn-generate-pwd');
    if (btnGen) {
      btnGen.addEventListener('click', () => this.generate());
    }

    // Copy Button
    const btnCopy = document.getElementById('btn-copy-pwd');
    const output = document.getElementById('generated-password-output');
    if (btnCopy && output) {
      btnCopy.addEventListener('click', () => {
        if (output.value) {
          Utils.copyToClipboard(output.value, 'Senha copiada com sucesso!');
        }
      });
    }

    // Visibility Toggle
    const btnToggleVis = document.getElementById('btn-toggle-pwd-visibility');
    const eyeShow = document.getElementById('eye-icon-show');
    const eyeHide = document.getElementById('eye-icon-hide');
    if (btnToggleVis && output) {
      btnToggleVis.addEventListener('click', () => {
        if (output.type === 'text') {
          output.type = 'password';
          eyeShow.classList.add('hidden');
          eyeHide.classList.remove('hidden');
        } else {
          output.type = 'text';
          eyeShow.classList.remove('hidden');
          eyeHide.classList.add('hidden');
        }
      });
    }

    // Clear History
    const btnClearHist = document.getElementById('btn-clear-pwd-history');
    if (btnClearHist) {
      btnClearHist.addEventListener('click', () => {
        this.history = [];
        this.renderHistory();
        Utils.showToast('Histórico limpo!', 'info');
      });
    }
  },

  /**
   * Cryptographically secure random integer in [0, max - 1]
   */
  getSecureRandomInt(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  },

  /**
   * Main generation dispatcher
   */
  generate() {
    let password = '';
    let poolSize = 0;

    if (this.mode === 'chars') {
      const length = parseInt(document.getElementById('pwd-length-slider').value, 10);
      const useUpper = document.getElementById('chk-uppercase').checked;
      const useLower = document.getElementById('chk-lowercase').checked;
      const useNumbers = document.getElementById('chk-numbers').checked;
      const useSymbols = document.getElementById('chk-symbols').checked;
      const avoidAmbiguous = document.getElementById('chk-avoid-ambiguous').checked;

      let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let lower = 'abcdefghijklmnopqrstuvwxyz';
      let numbers = '0123456789';
      let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (avoidAmbiguous) {
        upper = upper.replace(/[IO]/g, '');
        lower = lower.replace(/[ilo]/g, '');
        numbers = numbers.replace(/[01]/g, '');
      }

      let charPool = '';
      const guaranteedChars = [];

      if (useUpper && upper.length > 0) {
        charPool += upper;
        guaranteedChars.push(upper[this.getSecureRandomInt(upper.length)]);
      }
      if (useLower && lower.length > 0) {
        charPool += lower;
        guaranteedChars.push(lower[this.getSecureRandomInt(lower.length)]);
      }
      if (useNumbers && numbers.length > 0) {
        charPool += numbers;
        guaranteedChars.push(numbers[this.getSecureRandomInt(numbers.length)]);
      }
      if (useSymbols && symbols.length > 0) {
        charPool += symbols;
        guaranteedChars.push(symbols[this.getSecureRandomInt(symbols.length)]);
      }

      if (charPool.length === 0) {
        Utils.showToast('Selecione pelo menos um conjunto de caracteres!', 'error');
        return;
      }

      poolSize = charPool.length;
      const passwordChars = [...guaranteedChars];

      for (let i = passwordChars.length; i < length; i++) {
        passwordChars.push(charPool[this.getSecureRandomInt(charPool.length)]);
      }

      // Shuffle using Fisher-Yates
      for (let i = passwordChars.length - 1; i > 0; i--) {
        const j = this.getSecureRandomInt(i + 1);
        [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
      }

      password = passwordChars.join('');
    } else {
      // Passphrase mode
      const numWords = parseInt(document.getElementById('passphrase-words-slider').value, 10);
      const separator = document.getElementById('passphrase-separator').value;
      const capitalize = document.getElementById('chk-passphrase-capitalize').checked;
      const addNumber = document.getElementById('chk-passphrase-number').checked;

      const selectedWords = [];
      for (let i = 0; i < numWords; i++) {
        let word = this.wordList[this.getSecureRandomInt(this.wordList.length)];
        if (capitalize) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        selectedWords.push(word);
      }

      password = selectedWords.join(separator);
      if (addNumber) {
        const randomNum = this.getSecureRandomInt(90) + 10; // 10 to 99
        password += `${separator}${randomNum}`;
      }

      poolSize = this.wordList.length;
    }

    // Set UI Output
    const output = document.getElementById('generated-password-output');
    if (output) {
      output.value = password;
    }

    // Calculate Entropy & Crack Time
    this.evaluateSecurity(password, poolSize);

    // Save to history (avoid duplicates at the top)
    if (this.history[0] !== password) {
      this.history.unshift(password);
      if (this.history.length > 10) this.history.pop();
      this.renderHistory();
    }
  },

  /**
   * Calculate bits of entropy and brute-force time
   */
  evaluateSecurity(password, poolSize) {
    let entropy = 0;
    if (this.mode === 'chars') {
      entropy = Math.round(password.length * Math.log2(Math.max(2, poolSize)));
    } else {
      const numWords = parseInt(document.getElementById('passphrase-words-slider').value, 10);
      entropy = Math.round(numWords * Math.log2(this.wordList.length) + (document.getElementById('chk-passphrase-number').checked ? 7 : 0));
    }

    const entropyEl = document.getElementById('entropy-bits');
    const labelEl = document.getElementById('strength-label-text');
    const barFill = document.getElementById('strength-bar-fill');
    const crackTimeEl = document.getElementById('crack-time-val');

    entropyEl.textContent = `~${entropy} bits de entropia`;

    // Evaluation thresholds
    let strengthLevel = '';
    let barColor = '';
    let barWidth = '25%';
    let crackTime = '';

    if (entropy < 35) {
      strengthLevel = 'Muito Fraca';
      barColor = 'var(--accent-rose)';
      barWidth = '20%';
      crackTime = 'Poucos segundos';
    } else if (entropy < 55) {
      strengthLevel = 'Razoável';
      barColor = 'var(--accent-amber)';
      barWidth = '45%';
      crackTime = 'Alguns dias a meses';
    } else if (entropy < 75) {
      strengthLevel = 'Forte';
      barColor = 'var(--accent-cyan)';
      barWidth = '75%';
      crackTime = 'Centenas de anos';
    } else if (entropy < 100) {
      strengthLevel = 'Muito Forte';
      barColor = 'var(--accent-emerald)';
      barWidth = '90%';
      crackTime = 'Milhões de anos';
    } else {
      strengthLevel = 'Ultra Segura (Inquebrável)';
      barColor = 'var(--accent-purple)';
      barWidth = '100%';
      crackTime = 'Trilhões de séculos';
    }

    labelEl.textContent = strengthLevel;
    labelEl.style.color = barColor;
    barFill.style.width = barWidth;
    barFill.style.backgroundColor = barColor;
    crackTimeEl.textContent = crackTime;
  },

  /**
   * Render session history with copy button
   */
  renderHistory() {
    const list = document.getElementById('pwd-history-list');
    if (!list) return;

    if (this.history.length === 0) {
      list.innerHTML = '<div class="empty-history-text">As senhas geradas nesta sessão aparecerão aqui.</div>';
      return;
    }

    list.innerHTML = this.history.map((pwd) => `
      <div class="history-item">
        <span class="mono-text" title="${pwd}">${pwd}</span>
        <button class="btn-sm btn-ghost" onclick="Utils.copyToClipboard('${pwd.replace(/'/g, "\\'")}', 'Senha copiada!')">Copiar</button>
      </div>
    `).join('');
  }
};

window.PasswordModule = PasswordModule;
