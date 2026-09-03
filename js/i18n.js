/**
 * myip - Internationalization (i18n) Module
 * Supports: Portuguese (pt), English (en), Spanish (es), French (fr), Italian (it), Chinese (zh)
 * Automatic detection via IP Geolocation / Browser Locale with LocalStorage persistence.
 */

const I18n = {
  currentLang: 'pt',
  defaultLang: 'pt',
  supportedLangs: ['pt', 'en', 'es', 'fr', 'it', 'zh'],

  // Flag representations (Image + Emoji fallback)
  flags: {
    pt: { img: 'https://flagcdn.com/w40/br.png', emoji: '🇧🇷', name: 'Português', country: 'Brasil', code: 'PT' },
    en: { img: 'https://flagcdn.com/w40/us.png', emoji: '🇺🇸', name: 'English', country: 'United States', code: 'EN' },
    es: { img: 'https://flagcdn.com/w40/es.png', emoji: '🇪🇸', name: 'Español', country: 'España', code: 'ES' },
    fr: { img: 'https://flagcdn.com/w40/fr.png', emoji: '🇫🇷', name: 'Français', country: 'France', code: 'FR' },
    it: { img: 'https://flagcdn.com/w40/it.png', emoji: '🇮🇹', name: 'Italiano', country: 'Italia', code: 'IT' },
    zh: { img: 'https://flagcdn.com/w40/cn.png', emoji: '🇨🇳', name: '中文', country: '中国', code: 'ZH' }
  },

  // Dictionary containing all UI texts across the 6 languages
  translations: {
    // -------------------------------------------------------------
    // PORTUGUÊS (BR)
    // -------------------------------------------------------------
    pt: {
      // Navbar Tabs
      nav_myip: "Meu IP",
      nav_calculator: "Calculadora IP",
      nav_speedtest: "Velocímetro",
      nav_password: "Senhas",
      nav_webrtc: "WebRTC",
      nav_dnslookup: "DNS",
      nav_portcheck: "Portas",
      nav_wifiqr: "Wi-Fi QR",
      nav_sslcheck: "SSL",
      nav_ipconvert: "Conversor IP",
      
      // Theme & Lang
      theme_toggle_title: "Alternar tema claro/escuro",
      select_language: "Selecionar Idioma",

      // TAB 1: Meu IP
      tab1_title: "Qual é o Meu Endereço IP Público?",
      tab1_desc: "Descubra instantaneamente seu IP público IPv4/IPv6, localização geográfica em mapa, provedor de internet (ISP) e histórico.",
      ip_public_label: "SEU ENDEREÇO IP PÚBLICO",
      btn_copy_ip: "Copiar IP",
      btn_refresh_ip: "Atualizar Detecção",
      search_custom_title: "Consultar Outro IP ou Domínio",
      search_custom_placeholder: "Digite um IP (ex: 8.8.8.8) ou domínio (ex: google.com)...",
      btn_search: "Consultar",
      details_title: "Detalhes de Geolocalização & Conexão",
      detail_country: "País:",
      detail_region: "Estado / Região:",
      detail_city: "Cidade:",
      detail_isp: "Provedor (ISP):",
      detail_asn: "Código ASN:",
      detail_hostname: "Hostname Reverso:",
      detail_timezone: "Fuso Horário:",
      detail_coords: "Coordenadas:",
      detail_ipv6: "Endereço IPv6:",
      map_title: "Localização Aproximada no Mapa",
      history_title: "Seu Histórico de IPs e Provedores",
      btn_clear_history: "Limpar Histórico",
      th_datetime: "Dia - Hora",
      th_ip: "seu IP",
      th_provider: "Provedor",
      no_history: "Nenhum histórico registrado ainda. Conforme seu IP for detectado, o histórico aparecerá aqui.",

      // TAB 2: Calculadora IP
      tab2_title: "Calculadora de IP & Sub-rede (CIDR)",
      tab2_desc: "Calcule ranges utilizáveis, máscara de rede, broadcast, representação binária e classes para qualquer bloco CIDR IPv4.",
      calc_form_title: "Parâmetros da Sub-rede",
      calc_ip_label: "Endereço IP:",
      calc_cidr_label: "Máscara de Rede (CIDR):",
      btn_use_my_ip: "Usar Meu IP",
      btn_calculate: "Calcular Sub-rede",
      calc_results_title: "Resultados do Cálculo de Rede",
      res_net_address: "Endereço de Rede (Network):",
      res_bcast_address: "Endereço de Broadcast:",
      res_usable_range: "Faixa de Hosts Utilizáveis:",
      res_first_host: "Primeiro Host Utilizável:",
      res_last_host: "Último Host Utilizável:",
      res_total_hosts: "Total de Endereços IP:",
      res_usable_hosts: "Hosts Utilizáveis:",
      res_subnet_mask: "Máscara de Sub-rede:",
      res_wildcard: "Máscara Inversa (Wildcard):",
      res_ip_type: "Tipo de Endereço:",
      res_ip_class: "Classe do IP:",
      binary_title: "Decomposição Binária (32 Bits)",
      binary_legend_net: "Bits de Rede",
      binary_legend_host: "Bits de Host",

      // TAB 3: Velocímetro
      tab3_title: "Medidor de Velocidade de Conexão",
      tab3_desc: "Teste em tempo real a latência (Ping), estabilidade (Jitter), velocidade de Download e Upload da sua internet.",
      speed_ready: "PRONTO PARA TESTAR",
      btn_speed_start: "INICIAR TESTE",
      btn_speed_testing: "TESTANDO...",
      btn_speed_again: "TESTAR NOVAMENTE",
      metric_ping_name: "Ping (Latência)",
      metric_jitter_name: "Jitter (Oscilação)",
      metric_download_name: "Download",
      metric_upload_name: "Upload",
      diag_title: "Diagnóstico de Qualidade da Conexão",
      speed_history_title: "Seu Histórico de Velocidade de Internet",
      th_download: "Download",
      th_upload: "Upload",
      th_ping: "Ping",
      th_jitter: "Jitter",
      no_speed_history: "Nenhum teste de velocidade realizado ainda. Seus resultados aparecerão aqui.",

      // TAB 4: Gerador de Senha
      tab4_title: "Gerador de Senhas Seguras & Frases-Passe",
      tab4_desc: "Crie senhas criptograficamente seguras com entropia calculada ou frases mnemônicas fáceis de lembrar.",
      pwd_mode_random: "Senha Aleatória",
      pwd_mode_passphrase: "Frase-Passe (Mnemônica)",
      pwd_length_label: "Tamanho da Senha:",
      opt_uppercase: "Letras Maiúsculas (A-Z)",
      opt_lowercase: "Letras Minúsculas (a-z)",
      opt_numbers: "Números (0-9)",
      opt_symbols: "Símbolos Especiais (!@#$%...)",
      opt_exclude_similar: "Evitar caracteres ambíguos (l, 1, I, O, 0)",
      words_count_label: "Quantidade de Palavras:",
      words_sep_label: "Separador:",
      btn_generate_pwd: "Gerar Nova Senha",
      btn_copy_pwd: "Copiar Senha",
      pwd_entropy_label: "Força da Senha & Entropia:",
      crack_time_label: "Tempo estimado para quebra:",
      pwd_history_title: "Histórico desta Sessão",

      // TAB 5: WebRTC
      tab5_title: "Detector de Vazamento WebRTC (VPN Leak)",
      tab5_desc: "Verifique se o seu navegador está expondo seu IP real através de canais STUN/WebRTC mesmo com VPN conectada.",
      btn_scan_webrtc: "Iniciar Teste de Vazamento",
      webrtc_status_scanning: "Analisando conexões WebRTC...",
      webrtc_safe_title: "Nenhum Vazamento WebRTC Detectado",
      webrtc_safe_desc: "Seu IP real está protegido.",
      webrtc_leak_title: "Atenção: Vazamento Detectado!",
      webrtc_public_ip: "IP Público WebRTC:",
      webrtc_local_ip: "IPs Locais (Rede Interna):",

      // TAB 6: DNS
      tab6_title: "Consulta de Registros DNS (DNS Lookup)",
      tab6_desc: "Consulte registros A, AAAA, MX, TXT, CNAME, NS e SOA em tempo real diretamente via DNS over HTTPS.",
      dns_input_label: "Domínio ou Host:",
      dns_input_placeholder: "ex: google.com, cloudflare.com",
      dns_type_label: "Tipo de Registro:",
      btn_query_dns: "Consultar DNS",
      dns_records_found: "Registros Encontrados",

      // TAB 7: Portas
      tab7_title: "Scanner de Portas de Rede",
      tab7_desc: "Verifique o status de portas comuns de internet ou teste uma porta TCP específica.",
      port_host_label: "Host ou IP Alvo:",
      port_custom_label: "Porta Customizada (1-65535):",
      btn_scan_common: "Escanear Portas Comuns",
      btn_test_custom_port: "Testar Porta",

      // TAB 8: Wi-Fi QR
      tab8_title: "Gerador de QR Code para Conectar no Wi-Fi",
      tab8_desc: "Crie um QR Code para convidados conectarem à sua rede Wi-Fi apontando a câmera do celular.",
      wifi_ssid_label: "Nome da Rede (SSID):",
      wifi_pass_label: "Senha do Wi-Fi:",
      wifi_auth_label: "Tipo de Segurança:",
      wifi_hidden_label: "Rede Oculta",
      btn_gen_wifi_qr: "Gerar QR Code",
      btn_download_qr: "Baixar Imagem PNG",
      btn_print_qr: "Imprimir Cartão Wi-Fi",

      // TAB 9: SSL
      tab9_title: "Verificador de Certificado SSL / HTTPS",
      tab9_desc: "Inspecione a validade, autoridade emissora (CA) e segurança criptográfica de certificados SSL/TLS.",
      ssl_input_label: "Domínio para Inspecionar:",
      ssl_input_placeholder: "ex: github.com ou seudominio.com.br",
      btn_check_ssl: "Verificar SSL",
      ssl_status_valid: "Certificado SSL Válido e Seguro",
      ssl_issuer: "Autoridade Emissora (CA):",
      ssl_expires: "Expira em:",
      ssl_days_left: "Dias Restantes:",

      // TAB 10: Conversor
      tab10_title: "Conversor de Formatos de Endereço IP",
      tab10_desc: "Converta endereços IPv4 em tempo real entre Decimal com Pontos, Inteiro de 32 bits, Hexadecimal, Binário, Octal e IPv6 Mapeado.",
      ip_dotted_label: "Decimal com Pontos (Padrão):",
      ip_integer_label: "Inteiro Decimal de 32 bits:",
      ip_hex_label: "Hexadecimal:",
      ip_binary_label: "Binário (32 bits):",
      ip_octal_label: "Octal:",
      ip_ipv6_mapped: "IPv6 Mapeado (IPv4-Mapped):",

      // Footer
      footer_rights: "myip — Todas as ferramentas de rede essenciais em uma única plataforma rápida, segura e privada.",
      footer_privacy: "Privacidade 100% garantida: nenhum dado ou senha é armazenado em nossos servidores."
    },

    // -------------------------------------------------------------
    // ENGLISH (US)
    // -------------------------------------------------------------
    en: {
      nav_myip: "My IP",
      nav_calculator: "IP Calculator",
      nav_speedtest: "Speed Test",
      nav_password: "Passwords",
      nav_webrtc: "WebRTC",
      nav_dnslookup: "DNS",
      nav_portcheck: "Ports",
      nav_wifiqr: "Wi-Fi QR",
      nav_sslcheck: "SSL",
      nav_ipconvert: "IP Converter",

      theme_toggle_title: "Toggle light/dark theme",
      select_language: "Select Language",

      tab1_title: "What is My Public IP Address?",
      tab1_desc: "Instantly discover your public IPv4/IPv6 address, geographic map location, Internet Service Provider (ISP), and IP history.",
      ip_public_label: "YOUR PUBLIC IP ADDRESS",
      btn_copy_ip: "Copy IP",
      btn_refresh_ip: "Refresh Detection",
      search_custom_title: "Lookup Another IP or Domain",
      search_custom_placeholder: "Enter an IP (e.g., 8.8.8.8) or domain (e.g., google.com)...",
      btn_search: "Lookup",
      details_title: "Geolocation & Connection Details",
      detail_country: "Country:",
      detail_region: "State / Region:",
      detail_city: "City:",
      detail_isp: "Provider (ISP):",
      detail_asn: "ASN Code:",
      detail_hostname: "Reverse Hostname:",
      detail_timezone: "Timezone:",
      detail_coords: "Coordinates:",
      detail_ipv6: "IPv6 Address:",
      map_title: "Approximate Location on Map",
      history_title: "Your IP and Provider History",
      btn_clear_history: "Clear History",
      th_datetime: "Date - Time",
      th_ip: "your IP",
      th_provider: "Provider",
      no_history: "No history recorded yet. As your IP is detected, it will appear here.",

      tab2_title: "IP & Subnet Calculator (CIDR)",
      tab2_desc: "Calculate usable ranges, subnet mask, broadcast, 32-bit binary layout, and IP classes for any IPv4 CIDR block.",
      calc_form_title: "Subnet Parameters",
      calc_ip_label: "IP Address:",
      calc_cidr_label: "Subnet Mask (CIDR):",
      btn_use_my_ip: "Use My IP",
      btn_calculate: "Calculate Subnet",
      calc_results_title: "Network Calculation Results",
      res_net_address: "Network Address:",
      res_bcast_address: "Broadcast Address:",
      res_usable_range: "Usable Host Range:",
      res_first_host: "First Usable Host:",
      res_last_host: "Last Usable Host:",
      res_total_hosts: "Total IP Addresses:",
      res_usable_hosts: "Usable Hosts:",
      res_subnet_mask: "Subnet Mask:",
      res_wildcard: "Wildcard Mask:",
      res_ip_type: "Address Type:",
      res_ip_class: "IP Class:",
      binary_title: "32-Bit Binary Breakdown",
      binary_legend_net: "Network Bits",
      binary_legend_host: "Host Bits",

      tab3_title: "Internet Connection Speed Test",
      tab3_desc: "Real-time benchmark for latency (Ping), stability (Jitter), Download, and Upload speeds.",
      speed_ready: "READY TO TEST",
      btn_speed_start: "START TEST",
      btn_speed_testing: "TESTING...",
      btn_speed_again: "TEST AGAIN",
      metric_ping_name: "Ping (Latency)",
      metric_jitter_name: "Jitter (Variance)",
      metric_download_name: "Download",
      metric_upload_name: "Upload",
      diag_title: "Connection Quality Diagnosis",
      speed_history_title: "Your Internet Speed History",
      th_download: "Download",
      th_upload: "Upload",
      th_ping: "Ping",
      th_jitter: "Jitter",
      no_speed_history: "No speed tests recorded yet. Your results will appear here.",

      tab4_title: "Secure Password & Passphrase Generator",
      tab4_desc: "Generate cryptographically secure passwords with entropy calculation or memorable multi-word passphrases.",
      pwd_mode_random: "Random Password",
      pwd_mode_passphrase: "Passphrase (Mnemonic)",
      pwd_length_label: "Password Length:",
      opt_uppercase: "Uppercase Letters (A-Z)",
      opt_lowercase: "Lowercase Letters (a-z)",
      opt_numbers: "Numbers (0-9)",
      opt_symbols: "Special Symbols (!@#$%...)",
      opt_exclude_similar: "Avoid ambiguous characters (l, 1, I, O, 0)",
      words_count_label: "Word Count:",
      words_sep_label: "Separator:",
      btn_generate_pwd: "Generate Password",
      btn_copy_pwd: "Copy Password",
      pwd_entropy_label: "Password Strength & Entropy:",
      crack_time_label: "Estimated crack time:",
      pwd_history_title: "Session History",

      tab5_title: "WebRTC Leak Detector (VPN Leak)",
      tab5_desc: "Check if your browser is leaking your actual IP address through STUN/WebRTC channels while using a VPN.",
      btn_scan_webrtc: "Start Leak Scan",
      webrtc_status_scanning: "Analyzing WebRTC connections...",
      webrtc_safe_title: "No WebRTC Leak Detected",
      webrtc_safe_desc: "Your real IP address is protected.",
      webrtc_leak_title: "Warning: WebRTC Leak Detected!",
      webrtc_public_ip: "WebRTC Public IP:",
      webrtc_local_ip: "Local IPs (Internal Network):",

      tab6_title: "DNS Records Lookup (DNS Lookup)",
      tab6_desc: "Query live A, AAAA, MX, TXT, CNAME, NS, and SOA records via DNS over HTTPS.",
      dns_input_label: "Domain or Hostname:",
      dns_input_placeholder: "e.g., google.com, cloudflare.com",
      dns_type_label: "Record Type:",
      btn_query_dns: "Query DNS",
      dns_records_found: "Records Found",

      tab7_title: "Network Port Scanner",
      tab7_desc: "Check common internet ports status or test a specific TCP port for open/closed state.",
      port_host_label: "Target Host or IP:",
      port_custom_label: "Custom Port (1-65535):",
      btn_scan_common: "Scan Common Ports",
      btn_test_custom_port: "Test Port",

      tab8_title: "Wi-Fi QR Code Generator",
      tab8_desc: "Create a scannable QR Code for guests to instantly connect to your Wi-Fi network without typing passwords.",
      wifi_ssid_label: "Network Name (SSID):",
      wifi_pass_label: "Wi-Fi Password:",
      wifi_auth_label: "Security Type:",
      wifi_hidden_label: "Hidden Network",
      btn_gen_wifi_qr: "Generate QR Code",
      btn_download_qr: "Download PNG",
      btn_print_qr: "Print Wi-Fi Card",

      tab9_title: "SSL / HTTPS Certificate Inspector",
      tab9_desc: "Inspect validity, Certificate Authority (CA), expiration date, and encryption security.",
      ssl_input_label: "Domain to Inspect:",
      ssl_input_placeholder: "e.g., github.com or yourdomain.com",
      btn_check_ssl: "Check SSL",
      ssl_status_valid: "Valid and Secure SSL Certificate",
      ssl_issuer: "Issuing Authority (CA):",
      ssl_expires: "Expires On:",
      ssl_days_left: "Days Remaining:",

      tab10_title: "IP Address Format Converter",
      tab10_desc: "Real-time converter between Dotted Decimal, 32-bit Integer, Hexadecimal, Binary, Octal, and IPv6 Mapped.",
      ip_dotted_label: "Dotted Decimal (Standard):",
      ip_integer_label: "32-bit Decimal Integer:",
      ip_hex_label: "Hexadecimal:",
      ip_binary_label: "Binary (32 bits):",
      ip_octal_label: "Octal:",
      ip_ipv6_mapped: "IPv6 Mapped (IPv4-Mapped):",

      footer_rights: "myip — All essential network tools in a fast, secure, and private suite.",
      footer_privacy: "100% Privacy Guaranteed: No personal data or passwords are ever stored on our servers."
    },

    // -------------------------------------------------------------
    // ESPAÑOL (ES)
    // -------------------------------------------------------------
    es: {
      nav_myip: "Mi IP",
      nav_calculator: "Calculadora IP",
      nav_speedtest: "Velocímetro",
      nav_password: "Contraseñas",
      nav_webrtc: "WebRTC",
      nav_dnslookup: "DNS",
      nav_portcheck: "Puertos",
      nav_wifiqr: "Wi-Fi QR",
      nav_sslcheck: "SSL",
      nav_ipconvert: "Conversor IP",

      theme_toggle_title: "Alternar tema claro/oscuro",
      select_language: "Seleccionar Idioma",

      tab1_title: "¿Cuál es mi Dirección IP Pública?",
      tab1_desc: "Descubra al instante su IP pública IPv4/IPv6, ubicación geográfica en mapa, proveedor (ISP) e historial.",
      ip_public_label: "SU DIRECCIÓN IP PÚBLICA",
      btn_copy_ip: "Copiar IP",
      btn_refresh_ip: "Actualizar Detección",
      search_custom_title: "Consultar Otra IP o Dominio",
      search_custom_placeholder: "Ingrese una IP (ej: 8.8.8.8) o dominio (ej: google.com)...",
      btn_search: "Consultar",
      details_title: "Detalles de Geolocalización y Conexión",
      detail_country: "País:",
      detail_region: "Estado / Región:",
      detail_city: "Ciudad:",
      detail_isp: "Proveedor (ISP):",
      detail_asn: "Código ASN:",
      detail_hostname: "Hostname Inverso:",
      detail_timezone: "Zona Horaria:",
      detail_coords: "Coordenadas:",
      detail_ipv6: "Dirección IPv6:",
      map_title: "Ubicación Aproximada en el Mapa",
      history_title: "Su Historial de IPs y Proveedores",
      btn_clear_history: "Borrar Historial",
      th_datetime: "Día - Hora",
      th_ip: "su IP",
      th_provider: "Proveedor",
      no_history: "Ningún historial registrado todavía. Aparecerá aquí a medida que se detecte su IP.",

      tab2_title: "Calculadora de IP y Subredes (CIDR)",
      tab2_desc: "Calcule rangos útiles, máscara de subred, broadcast, descomposición binaria y clases IPv4.",
      calc_form_title: "Parámetros de la Subred",
      calc_ip_label: "Dirección IP:",
      calc_cidr_label: "Máscara de Red (CIDR):",
      btn_use_my_ip: "Usar Mi IP",
      btn_calculate: "Calcular Subred",
      calc_results_title: "Resultados del Cálculo",
      res_net_address: "Dirección de Red:",
      res_bcast_address: "Dirección de Broadcast:",
      res_usable_range: "Rango de Hosts Utilizables:",
      res_first_host: "Primer Host Utilizable:",
      res_last_host: "Último Host Utilizable:",
      res_total_hosts: "Total de Direcciones IP:",
      res_usable_hosts: "Hosts Utilizables:",
      res_subnet_mask: "Máscara de Subred:",
      res_wildcard: "Máscara Inversa (Wildcard):",
      res_ip_type: "Tipo de Dirección:",
      res_ip_class: "Clase de IP:",
      binary_title: "Descomposición Binaria (32 Bits)",
      binary_legend_net: "Bits de Red",
      binary_legend_host: "Bits de Host",

      tab3_title: "Medidor de Velocidad de Conexión",
      tab3_desc: "Pruebe en tiempo real la latencia (Ping), estabilidad (Jitter), velocidad de Descarga y Subida.",
      speed_ready: "LISTO PARA PROBAR",
      btn_speed_start: "INICIAR TEST",
      btn_speed_testing: "PROBANDO...",
      btn_speed_again: "PROBAR DE NUEVO",
      metric_ping_name: "Ping (Latencia)",
      metric_jitter_name: "Jitter (Oscilación)",
      metric_download_name: "Descarga",
      metric_upload_name: "Subida",
      diag_title: "Diagnóstico de Calidad de Conexión",
      speed_history_title: "Su Historial de Velocidad",
      th_download: "Descarga",
      th_upload: "Subida",
      th_ping: "Ping",
      th_jitter: "Jitter",
      no_speed_history: "No hay pruebas de velocidad registradas aún.",

      tab4_title: "Generador de Contraseñas Seguras",
      tab4_desc: "Cree contraseñas criptográficamente robustas con cálculo de entropía o frases mnemónicas.",
      pwd_mode_random: "Contraseña Aleatoria",
      pwd_mode_passphrase: "Frase de Paso",
      pwd_length_label: "Longitud de Contraseña:",
      opt_uppercase: "Mayúsculas (A-Z)",
      opt_lowercase: "Minúsculas (a-z)",
      opt_numbers: "Números (0-9)",
      opt_symbols: "Símbolos Especiales (!@#$%...)",
      opt_exclude_similar: "Evitar caracteres ambiguos (l, 1, I, O, 0)",
      words_count_label: "Cantidad de Palabras:",
      words_sep_label: "Separador:",
      btn_generate_pwd: "Generar Contraseña",
      btn_copy_pwd: "Copiar Contraseña",
      pwd_entropy_label: "Fuerza y Entropía:",
      crack_time_label: "Tiempo estimado para descifrar:",
      pwd_history_title: "Historial de la Sesión",

      tab5_title: "Detector de Fugas WebRTC (VPN Leak)",
      tab5_desc: "Compruebe si su navegador expone su IP real a través de canales STUN/WebRTC incluso con VPN.",
      btn_scan_webrtc: "Iniciar Análisis WebRTC",
      webrtc_status_scanning: "Analizando conexiones WebRTC...",
      webrtc_safe_title: "Sin Fugas WebRTC",
      webrtc_safe_desc: "Su dirección IP real está protegida.",
      webrtc_leak_title: "¡Alerta: Fuga WebRTC Detectada!",
      webrtc_public_ip: "IP Pública WebRTC:",
      webrtc_local_ip: "IPs Locales (Red Interna):",

      tab6_title: "Consulta de Registros DNS",
      tab6_desc: "Consulte registros A, AAAA, MX, TXT, CNAME, NS y SOA en tiempo real mediante DNS over HTTPS.",
      dns_input_label: "Dominio o Host:",
      dns_input_placeholder: "ej: google.com, cloudflare.com",
      dns_type_label: "Tipo de Registro:",
      btn_query_dns: "Consultar DNS",
      dns_records_found: "Registros Encontrados",

      tab7_title: "Escáner de Puertos de Red",
      tab7_desc: "Compruebe puertos comunes o pruebe un puerto TCP específico.",
      port_host_label: "Host o IP Objetivo:",
      port_custom_label: "Puerto Personalizado (1-65535):",
      btn_scan_common: "Escanear Puertos Comunes",
      btn_test_custom_port: "Probar Puerto",

      tab8_title: "Generador de QR Code para Wi-Fi",
      tab8_desc: "Genere un código QR para que sus invitados se conecten escaneando con el móvil.",
      wifi_ssid_label: "Nombre de Red (SSID):",
      wifi_pass_label: "Contraseña del Wi-Fi:",
      wifi_auth_label: "Tipo de Seguridad:",
      wifi_hidden_label: "Red Oculta",
      btn_gen_wifi_qr: "Generar QR Code",
      btn_download_qr: "Descargar PNG",
      btn_print_qr: "Imprimir Tarjeta Wi-Fi",

      tab9_title: "Verificador de Certificado SSL / HTTPS",
      tab9_desc: "Inspeccione validez, autoridad emisora (CA), vencimiento y seguridad criptográfica.",
      ssl_input_label: "Dominio a Inspeccionar:",
      ssl_input_placeholder: "ej: github.com o sudominio.com",
      btn_check_ssl: "Verificar SSL",
      ssl_status_valid: "Certificado SSL Válido y Seguro",
      ssl_issuer: "Autoridad Emisora (CA):",
      ssl_expires: "Expira el:",
      ssl_days_left: "Días Restantes:",

      tab10_title: "Conversor de Formatos de Dirección IP",
      tab10_desc: "Convierta en tiempo real entre Decimal, Entero de 32 bits, Hexadecimal, Binario, Octal e IPv6.",
      ip_dotted_label: "Decimal con Puntos:",
      ip_integer_label: "Entero Decimal (32 bits):",
      ip_hex_label: "Hexadecimal:",
      ip_binary_label: "Binario (32 bits):",
      ip_octal_label: "Octal:",
      ip_ipv6_mapped: "IPv6 Mapeado:",

      footer_rights: "myip — Todas las herramientas de red esenciales en una suite rápida, segura y privada.",
      footer_privacy: "100% Privacidad Garantizada: ningún dato es almacenado en nuestros servidores."
    },

    // -------------------------------------------------------------
    // FRANÇAIS (FR)
    // -------------------------------------------------------------
    fr: {
      nav_myip: "Mon IP",
      nav_calculator: "Calculateur IP",
      nav_speedtest: "Test Débit",
      nav_password: "Mots de Passe",
      nav_webrtc: "WebRTC",
      nav_dnslookup: "DNS",
      nav_portcheck: "Ports",
      nav_wifiqr: "Wi-Fi QR",
      nav_sslcheck: "SSL",
      nav_ipconvert: "Convertisseur IP",

      theme_toggle_title: "Basculer thème clair/sombre",
      select_language: "Sélectionner la Langue",

      tab1_title: "Quelle est mon adresse IP publique ?",
      tab1_desc: "Découvrez instantanément votre adresse IP publique IPv4/IPv6, localisation sur carte, fournisseur (FAI) et historique.",
      ip_public_label: "VOTRE ADRESSE IP PUBLIQUE",
      btn_copy_ip: "Copier l'IP",
      btn_refresh_ip: "Actualiser la Détection",
      search_custom_title: "Rechercher une autre IP ou un Domaine",
      search_custom_placeholder: "Entrez une IP (ex: 8.8.8.8) ou un domaine (ex: google.com)...",
      btn_search: "Rechercher",
      details_title: "Détails de Géolocalisation & Connexion",
      detail_country: "Pays :",
      detail_region: "Région :",
      detail_city: "Ville :",
      detail_isp: "Fournisseur (FAI) :",
      detail_asn: "Code ASN :",
      detail_hostname: "Nom d'hôte inverse :",
      detail_timezone: "Fuseau horaire :",
      detail_coords: "Coordonnées :",
      detail_ipv6: "Adresse IPv6 :",
      map_title: "Localisation approximative sur la carte",
      history_title: "Historique de vos adresses IP et FAI",
      btn_clear_history: "Effacer l'historique",
      th_datetime: "Jour - Heure",
      th_ip: "votre IP",
      th_provider: "Fournisseur",
      no_history: "Aucun historique enregistré pour l'instant.",

      tab2_title: "Calculateur IP & Sous-réseaux (CIDR)",
      tab2_desc: "Calculez les plages utiles, masque de sous-réseau, diffusion, décomposition binaire et classes IPv4.",
      calc_form_title: "Paramètres du sous-réseau",
      calc_ip_label: "Adresse IP :",
      calc_cidr_label: "Masque de sous-réseau (CIDR) :",
      btn_use_my_ip: "Utiliser mon IP",
      btn_calculate: "Calculer le sous-réseau",
      calc_results_title: "Résultats du calcul réseau",
      res_net_address: "Adresse réseau :",
      res_bcast_address: "Adresse de broadcast :",
      res_usable_range: "Plage d'hôtes utilisables :",
      res_first_host: "Premier hôte utilisable :",
      res_last_host: "Dernier hôte utilisable :",
      res_total_hosts: "Total d'adresses IP :",
      res_usable_hosts: "Hôtes utilisables :",
      res_subnet_mask: "Masque de sous-réseau :",
      res_wildcard: "Masque générique (Wildcard) :",
      res_ip_type: "Type d'adresse :",
      res_ip_class: "Classe IP :",
      binary_title: "Décomposition Binaire (32 Bits)",
      binary_legend_net: "Bits Réseau",
      binary_legend_host: "Bits Hôte",

      tab3_title: "Test de Vitesse de Connexion Internet",
      tab3_desc: "Mesurez en temps réel la latence (Ping), la gigue (Jitter), le débit Descendant et Montant.",
      speed_ready: "PRÊT À TESTER",
      btn_speed_start: "LANCER LE TEST",
      btn_speed_testing: "TEST EN COURS...",
      btn_speed_again: "RETESTER",
      metric_ping_name: "Ping (Latence)",
      metric_jitter_name: "Gigue (Jitter)",
      metric_download_name: "Téléchargement",
      metric_upload_name: "Envoi",
      diag_title: "Diagnostic de Qualité de Connexion",
      speed_history_title: "Historique de Vitesse Internet",
      th_download: "Téléchargement",
      th_upload: "Envoi",
      th_ping: "Ping",
      th_jitter: "Gigue",
      no_speed_history: "Aucun test de vitesse enregistré pour l'instant.",

      tab4_title: "Générateur de Mots de Passe Sécurisés",
      tab4_desc: "Générez des mots de passe robustes avec calcul d'entropie ou des phrases secrètes mnémoniques.",
      pwd_mode_random: "Mot de passe aléatoire",
      pwd_mode_passphrase: "Phrase secrète",
      pwd_length_label: "Longueur du mot de passe :",
      opt_uppercase: "Lettres majuscules (A-Z)",
      opt_lowercase: "Lettres minuscules (a-z)",
      opt_numbers: "Chiffres (0-9)",
      opt_symbols: "Symboles spéciaux (!@#$%...)",
      opt_exclude_similar: "Éviter caractères ambigus (l, 1, I, O, 0)",
      words_count_label: "Nombre de mots :",
      words_sep_label: "Séparateur :",
      btn_generate_pwd: "Générer le mot de passe",
      btn_copy_pwd: "Copier le mot de passe",
      pwd_entropy_label: "Force du mot de passe & Entropie :",
      crack_time_label: "Temps estimé pour déchiffrer :",
      pwd_history_title: "Historique de la session",

      tab5_title: "Détecteur de Fuite WebRTC (VPN Leak)",
      tab5_desc: "Vérifiez si votre navigateur expose votre IP réelle via WebRTC/STUN même sous VPN.",
      btn_scan_webrtc: "Lancer le test de fuite",
      webrtc_status_scanning: "Analyse WebRTC en cours...",
      webrtc_safe_title: "Aucune fuite WebRTC détectée",
      webrtc_safe_desc: "Votre véritable adresse IP est protégée.",
      webrtc_leak_title: "Attention : Fuite WebRTC Détectée !",
      webrtc_public_ip: "IP publique WebRTC :",
      webrtc_local_ip: "IPs locales (Réseau interne) :",

      tab6_title: "Consultation des Enregistrements DNS",
      tab6_desc: "Interrogez les enregistrements A, AAAA, MX, TXT, CNAME, NS et SOA via DNS over HTTPS.",
      dns_input_label: "Domaine ou Hôte :",
      dns_input_placeholder: "ex: google.com, cloudflare.com",
      dns_type_label: "Type d'enregistrement :",
      btn_query_dns: "Consulter le DNS",
      dns_records_found: "Enregistrements trouvés",

      tab7_title: "Scanner de Ports Réseau",
      tab7_desc: "Vérifiez les ports usuels ou testez un port TCP spécifique.",
      port_host_label: "Hôte ou IP Cible :",
      port_custom_label: "Port Personnalisé (1-65535) :",
      btn_scan_common: "Scanner les ports courants",
      btn_test_custom_port: "Tester le port",

      tab8_title: "Générateur de QR Code pour Wi-Fi",
      tab8_desc: "Créez un QR Code permettant à vos invités de se connecter en scannant avec leur smartphone.",
      wifi_ssid_label: "Nom du réseau (SSID) :",
      wifi_pass_label: "Mot de passe Wi-Fi :",
      wifi_auth_label: "Sécurité :",
      wifi_hidden_label: "Réseau masqué",
      btn_gen_wifi_qr: "Générer le QR Code",
      btn_download_qr: "Télécharger PNG",
      btn_print_qr: "Imprimer la fiche Wi-Fi",

      tab9_title: "Vérificateur de Certificat SSL / HTTPS",
      tab9_desc: "Inspectez la validité, l'autorité de certification (CA), la date d'expiration et la sécurité.",
      ssl_input_label: "Domaine à inspecter :",
      ssl_input_placeholder: "ex: github.com ou votredomaine.fr",
      btn_check_ssl: "Vérifier le SSL",
      ssl_status_valid: "Certificat SSL Valide et Sécurisé",
      ssl_issuer: "Autorité de certification (CA) :",
      ssl_expires: "Expire le :",
      ssl_days_left: "Jours restants :",

      tab10_title: "Convertisseur de Formats d'Adresse IP",
      tab10_desc: "Convertissez en temps réel entre Décimal à points, Entier 32 bits, Hexadécimal, Binaire, Octal et IPv6.",
      ip_dotted_label: "Décimal à points (Standard) :",
      ip_integer_label: "Entier 32 bits :",
      ip_hex_label: "Hexadécimal :",
      ip_binary_label: "Binaire (32 bits) :",
      ip_octal_label: "Octal :",
      ip_ipv6_mapped: "IPv6 mappé :",

      footer_rights: "myip — Tous vos outils réseau essentiels réunis sur une plateforme rapide et privée.",
      footer_privacy: "Confidentialité 100% garantie : aucune donnée n'est stockée sur nos serveurs."
    },

    // -------------------------------------------------------------
    // ITALIANO (IT)
    // -------------------------------------------------------------
    it: {
      nav_myip: "Il Mio IP",
      nav_calculator: "Calcolatrice IP",
      nav_speedtest: "Speed Test",
      nav_password: "Password",
      nav_webrtc: "WebRTC",
      nav_dnslookup: "DNS",
      nav_portcheck: "Porte",
      nav_wifiqr: "Wi-Fi QR",
      nav_sslcheck: "SSL",
      nav_ipconvert: "Convertitore IP",

      theme_toggle_title: "Attiva tema chiaro/scuro",
      select_language: "Seleziona Lingua",

      tab1_title: "Qual è il mio indirizzo IP pubblico?",
      tab1_desc: "Scopri all'istante il tuo IP pubblico IPv4/IPv6, posizione su mappa, fornitore (ISP) e cronologia.",
      ip_public_label: "IL TUO INDIRIZZO IP PUBBLICO",
      btn_copy_ip: "Copia IP",
      btn_refresh_ip: "Aggiorna Rilevamento",
      search_custom_title: "Verifica un altro IP o Dominio",
      search_custom_placeholder: "Inserisci un IP (es: 8.8.8.8) o dominio (es: google.com)...",
      btn_search: "Cerca",
      details_title: "Dettagli di Geolocalizzazione e Connessione",
      detail_country: "Paese:",
      detail_region: "Regione / Provincia:",
      detail_city: "Città:",
      detail_isp: "Provider (ISP):",
      detail_asn: "Codice ASN:",
      detail_hostname: "Hostname inverso:",
      detail_timezone: "Fuso orario:",
      detail_coords: "Coordinate:",
      detail_ipv6: "Indirizzo IPv6:",
      map_title: "Posizione Approssimativa sulla Mappa",
      history_title: "La tua Cronologia di IP e Provider",
      btn_clear_history: "Cancella Cronologia",
      th_datetime: "Giorno - Ora",
      th_ip: "il tuo IP",
      th_provider: "Provider",
      no_history: "Nessuna cronologia registrata finora.",

      tab2_title: "Calcolatrice IP e Subnet (CIDR)",
      tab2_desc: "Calcola intervalli utilizzabili, subnet mask, broadcast, scomposizione binaria e classi IPv4.",
      calc_form_title: "Parametri della Subnet",
      calc_ip_label: "Indirizzo IP:",
      calc_cidr_label: "Subnet Mask (CIDR):",
      btn_use_my_ip: "Usa il Mio IP",
      btn_calculate: "Calcola Subnet",
      calc_results_title: "Risultati del Calcolo",
      res_net_address: "Indirizzo di Rete:",
      res_bcast_address: "Indirizzo di Broadcast:",
      res_usable_range: "Intervallo Host Utilizzabili:",
      res_first_host: "Primo Host Utilizzabile:",
      res_last_host: "Ultimo Host Utilizzabile:",
      res_total_hosts: "Totale Indirizzi IP:",
      res_usable_hosts: "Host Utilizzabili:",
      res_subnet_mask: "Subnet Mask:",
      res_wildcard: "Wildcard Mask:",
      res_ip_type: "Tipo di Indirizzo:",
      res_ip_class: "Classe IP:",
      binary_title: "Scomposizione Binaria (32 Bit)",
      binary_legend_net: "Bit di Rete",
      binary_legend_host: "Bit di Host",

      tab3_title: "Test di Velocità della Connessione",
      tab3_desc: "Misura in tempo reale latenza (Ping), stabilità (Jitter), velocità di Download e Upload.",
      speed_ready: "PRONTO PER IL TEST",
      btn_speed_start: "AVVIA TEST",
      btn_speed_testing: "TEST IN CORSO...",
      btn_speed_again: "RIPETI TEST",
      metric_ping_name: "Ping (Latenza)",
      metric_jitter_name: "Jitter (Variazione)",
      metric_download_name: "Download",
      metric_upload_name: "Upload",
      diag_title: "Diagnosi della Connessione",
      speed_history_title: "Cronologia dei Test di Velocità",
      th_download: "Download",
      th_upload: "Upload",
      th_ping: "Ping",
      th_jitter: "Jitter",
      no_speed_history: "Nessun test registrato finora.",

      tab4_title: "Generatore di Password Sicure",
      tab4_desc: "Genera password crittograficamente sicure con calcolo di entropia o passphrase mnemonici.",
      pwd_mode_random: "Password Casuale",
      pwd_mode_passphrase: "Passphrase",
      pwd_length_label: "Lunghezza Password:",
      opt_uppercase: "Lettere maiuscole (A-Z)",
      opt_lowercase: "Lettere minuscole (a-z)",
      opt_numbers: "Numeri (0-9)",
      opt_symbols: "Simboli speciali (!@#$%...)",
      opt_exclude_similar: "Evita caratteri ambigui (l, 1, I, O, 0)",
      words_count_label: "Numero di parole:",
      words_sep_label: "Separatore:",
      btn_generate_pwd: "Genera Password",
      btn_copy_pwd: "Copia Password",
      pwd_entropy_label: "Sicurezza ed Entropia:",
      crack_time_label: "Tempo stimato di decifrazione:",
      pwd_history_title: "Cronologia della Sessione",

      tab5_title: "Rilevatore di Perdite WebRTC (VPN Leak)",
      tab5_desc: "Verifica se il browser espone il tuo IP reale tramite STUN/WebRTC anche sotto VPN.",
      btn_scan_webrtc: "Avvia Scansione WebRTC",
      webrtc_status_scanning: "Analisi WebRTC in corso...",
      webrtc_safe_title: "Nessuna Perdita WebRTC Rilevata",
      webrtc_safe_desc: "Il tuo vero indirizzo IP è protetto.",
      webrtc_leak_title: "Attenzione: Perdita WebRTC Rilevata!",
      webrtc_public_ip: "IP Pubblico WebRTC:",
      webrtc_local_ip: "IP Locali (Rete Interna):",

      tab6_title: "Ricerca Record DNS",
      tab6_desc: "Interroga record A, AAAA, MX, TXT, CNAME, NS e SOA in tempo reale tramite DNS over HTTPS.",
      dns_input_label: "Dominio o Host:",
      dns_input_placeholder: "es: google.com, cloudflare.com",
      dns_type_label: "Tipo di Record:",
      btn_query_dns: "Cerca DNS",
      dns_records_found: "Record Trovati",

      tab7_title: "Scanner delle Porte di Rete",
      tab7_desc: "Controlla le porte comuni o testa una porta TCP personalizzata.",
      port_host_label: "Host o IP Obiettivo:",
      port_custom_label: "Porta Personalizzata (1-65535):",
      btn_scan_common: "Scansiona Porte Comuni",
      btn_test_custom_port: "Testa Porta",

      tab8_title: "Generatore QR Code per Connessione Wi-Fi",
      tab8_desc: "Crea un QR Code per consentire agli ospiti di connettersi scansionando con la fotocamera.",
      wifi_ssid_label: "Nome Rete (SSID):",
      wifi_pass_label: "Password Wi-Fi:",
      wifi_auth_label: "Tipo di Sicurezza:",
      wifi_hidden_label: "Rete Nascosta",
      btn_gen_wifi_qr: "Genera QR Code",
      btn_download_qr: "Scarica PNG",
      btn_print_qr: "Stampa Scheda Wi-Fi",

      tab9_title: "Verificatore Certificato SSL / HTTPS",
      tab9_desc: "Ispeziona validità, autorità di emissione (CA), scadenza e crittografia.",
      ssl_input_label: "Dominio da Ispezionare:",
      ssl_input_placeholder: "es: github.com o tuodominio.it",
      btn_check_ssl: "Verifica SSL",
      ssl_status_valid: "Certificato SSL Valido e Sicuro",
      ssl_issuer: "Autorità di Emissione (CA):",
      ssl_expires: "Scade il:",
      ssl_days_left: "Giorni Rimanenti:",

      tab10_title: "Convertitore Formati Indirizzo IP",
      tab10_desc: "Converti in tempo reale tra Decimale con punti, Intero 32 bit, Esadecimale, Binario, Ottale e IPv6.",
      ip_dotted_label: "Decimale con punti (Standard):",
      ip_integer_label: "Intero Decimale (32 bit):",
      ip_hex_label: "Esadecimale:",
      ip_binary_label: "Binario (32 bit):",
      ip_octal_label: "Ottale:",
      ip_ipv6_mapped: "IPv6 Mappato:",

      footer_rights: "myip — Tutti gli strumenti di rete essenziali in una suite rapida, sicura e privata.",
      footer_privacy: "Privacy 100% Garantita: nessun dato viene salvato sui nostri server."
    },

    // -------------------------------------------------------------
    // 中文 (ZH)
    // -------------------------------------------------------------
    zh: {
      nav_myip: "我的IP",
      nav_calculator: "IP计算器",
      nav_speedtest: "网速测试",
      nav_password: "密码生成",
      nav_webrtc: "WebRTC",
      nav_dnslookup: "DNS查询",
      nav_portcheck: "端口扫描",
      nav_wifiqr: "Wi-Fi二维码",
      nav_sslcheck: "SSL检查",
      nav_ipconvert: "IP转换器",

      theme_toggle_title: "切换浅色/深色主题",
      select_language: "选择语言",

      tab1_title: "我的公网 IP 地址是什么？",
      tab1_desc: "即时检测您的 IPv4/IPv6 公网 IP 地址、地理位置地图、网络运营商 (ISP) 及历史记录。",
      ip_public_label: "您的公网 IP 地址",
      btn_copy_ip: "复制 IP",
      btn_refresh_ip: "重新检测",
      search_custom_title: "查询其他 IP 或域名",
      search_custom_placeholder: "输入 IP (例如: 8.8.8.8) 或域名 (例如: google.com)...",
      btn_search: "查询",
      details_title: "地理位置与连接详情",
      detail_country: "国家/地区:",
      detail_region: "省份 / 地区:",
      detail_city: "城市:",
      detail_isp: "网络运营商 (ISP):",
      detail_asn: "ASN 编号:",
      detail_hostname: "反向主机名:",
      detail_timezone: "时区:",
      detail_coords: "地理坐标:",
      detail_ipv6: "IPv6 地址:",
      map_title: "地图大致位置",
      history_title: "您的 IP 与运营商历史记录",
      btn_clear_history: "清空历史",
      th_datetime: "日期 - 时间",
      th_ip: "您的 IP",
      th_provider: "运营商",
      no_history: "暂无历史记录。当检测到您的 IP 时将显示在此处。",

      tab2_title: "IP 与子网计算器 (CIDR)",
      tab2_desc: "计算任何 IPv4 CIDR 块的可用范围、子网掩码、广播地址、二进制结构和 IP 类别。",
      calc_form_title: "子网参数",
      calc_ip_label: "IP 地址:",
      calc_cidr_label: "子网掩码 (CIDR):",
      btn_use_my_ip: "使用我的 IP",
      btn_calculate: "计算子网",
      calc_results_title: "网络计算结果",
      res_net_address: "网络地址 (Network):",
      res_bcast_address: "广播地址 (Broadcast):",
      res_usable_range: "可用主机范围:",
      res_first_host: "首个可用主机:",
      res_last_host: "末个可用主机:",
      res_total_hosts: "IP 地址总数:",
      res_usable_hosts: "可用主机数:",
      res_subnet_mask: "子网掩码:",
      res_wildcard: "反掩码 (Wildcard):",
      res_ip_type: "地址类型:",
      res_ip_class: "IP 类别:",
      binary_title: "32 位二进制结构分解",
      binary_legend_net: "网络位",
      binary_legend_host: "主机位",

      tab3_title: "网络连接速度测试 (测速)",
      tab3_desc: "实时测定网络延迟 (Ping)、抖动 (Jitter)、下载与上传带宽速度。",
      speed_ready: "准备就绪",
      btn_speed_start: "开始测速",
      btn_speed_testing: "正在测速...",
      btn_speed_again: "重新测速",
      metric_ping_name: "Ping (延迟)",
      metric_jitter_name: "Jitter (抖动)",
      metric_download_name: "下载速度",
      metric_upload_name: "上传速度",
      diag_title: "网络质量综合诊断",
      speed_history_title: "您的网速测试历史",
      th_download: "下载",
      th_upload: "上传",
      th_ping: "延迟",
      th_jitter: "抖动",
      no_speed_history: "暂无测速记录。测试完成后将显示在此处。",

      tab4_title: "安全密码与口令生成器",
      tab4_desc: "生成具有高熵值的加密安全强密码或易于记忆的助记短语。",
      pwd_mode_random: "随机强密码",
      pwd_mode_passphrase: "助记短语 (Passphrase)",
      pwd_length_label: "密码长度:",
      opt_uppercase: "大写字母 (A-Z)",
      opt_lowercase: "小写字母 (a-z)",
      opt_numbers: "数字 (0-9)",
      opt_symbols: "特殊符号 (!@#$%...)",
      opt_exclude_similar: "排除易混淆字符 (l, 1, I, O, 0)",
      words_count_label: "单词数量:",
      words_sep_label: "分隔符:",
      btn_generate_pwd: "生成新密码",
      btn_copy_pwd: "复制密码",
      pwd_entropy_label: "密码强度与信息熵:",
      crack_time_label: "暴力破解估计耗时:",
      pwd_history_title: "本次会话历史",

      tab5_title: "WebRTC 隐私泄露检测 (VPN Leak)",
      tab5_desc: "检测您的浏览器是否在使用 VPN 时通过 STUN/WebRTC 泄露真实 IP 地址。",
      btn_scan_webrtc: "开始检测",
      webrtc_status_scanning: "正在分析 WebRTC 连接...",
      webrtc_safe_title: "未发现 WebRTC 泄露",
      webrtc_safe_desc: "您的真实 IP 地址受到安全保护。",
      webrtc_leak_title: "警告：检测到 WebRTC 泄露！",
      webrtc_public_ip: "WebRTC 公网 IP:",
      webrtc_local_ip: "局域网内部 IP:",

      tab6_title: "DNS 记录实时查询",
      tab6_desc: "通过 DNS over HTTPS 实时查询 A, AAAA, MX, TXT, CNAME, NS, SOA 记录。",
      dns_input_label: "域名或主机名:",
      dns_input_placeholder: "例如: google.com, cloudflare.com",
      dns_type_label: "记录类型:",
      btn_query_dns: "查询 DNS",
      dns_records_found: "查询到的记录",

      tab7_title: "网络端口扫描器",
      tab7_desc: "检测常见网络端口开放状态或指定任意 TCP 端口测试。",
      port_host_label: "目标主机或 IP:",
      port_custom_label: "自定义端口 (1-65535):",
      btn_scan_common: "扫描常见端口",
      btn_test_custom_port: "测试端口",

      tab8_title: "Wi-Fi 连接二维码生成器",
      tab8_desc: "生成 Wi-Fi 二维码，访客使用手机相机扫描即可免输密码直接联网。",
      wifi_ssid_label: "网络名称 (SSID):",
      wifi_pass_label: "Wi-Fi 密码:",
      wifi_auth_label: "加密方式:",
      wifi_hidden_label: "隐藏网络",
      btn_gen_wifi_qr: "生成二维码",
      btn_download_qr: "下载 PNG 图片",
      btn_print_qr: "打印 Wi-Fi 卡片",

      tab9_title: "SSL / HTTPS 证书安全检查",
      tab9_desc: "检测域名 SSL 证书有效性、颁发机构 (CA)、到期时间及安全协议。",
      ssl_input_label: "检测域名:",
      ssl_input_placeholder: "例如: github.com 或您的域名",
      btn_check_ssl: "检查 SSL",
      ssl_status_valid: "SSL 证书有效且安全",
      ssl_issuer: "证书颁发机构 (CA):",
      ssl_expires: "到期时间:",
      ssl_days_left: "剩余有效天数:",

      tab10_title: "IP 地址格式转换器",
      tab10_desc: "在点分十进制、32 位整数、十六进制、二进制、八进制及 IPv6 映射之间实时转换。",
      ip_dotted_label: "点分十进制 (标准):",
      ip_integer_label: "32 位十进制整数:",
      ip_hex_label: "十六进制:",
      ip_binary_label: "二进制 (32位):",
      ip_octal_label: "八进制:",
      ip_ipv6_mapped: "IPv6 映射地址:",

      footer_rights: "myip — 集成所有必备网络工具的快速、安全、隐私平台。",
      footer_privacy: "100% 隐私保护：所有数据均在本地处理，绝不上传保存密码或个人数据。"
    }
  },

  /**
   * Initialize i18n
   */
  init() {
    this.bindEvents();

    // Check if user previously chose a language manually
    const saved = localStorage.getItem('myip_language');
    if (saved && this.supportedLangs.includes(saved)) {
      this.setLanguage(saved, false);
    } else {
      // Auto-detect based on browser language initially
      const browserLang = (navigator.language || navigator.userLanguage || '').slice(0, 2).toLowerCase();
      const initialLang = this.mapLocaleToSupported(browserLang);
      this.setLanguage(initialLang, false);
    }
  },

  bindEvents() {
    // Custom Combobox Trigger (Toggle Menu)
    const trigger = document.getElementById('combo-trigger');
    const menu = document.getElementById('combo-menu');
    const comboWrapper = document.getElementById('custom-lang-combobox');

    if (trigger && menu) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !menu.classList.contains('hidden');
        if (isOpen) {
          menu.classList.add('hidden');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          menu.classList.remove('hidden');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (comboWrapper && !comboWrapper.contains(e.target)) {
          menu.classList.add('hidden');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Custom Combobox Options Click
    document.querySelectorAll('.combo-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const lang = item.getAttribute('data-lang');
        if (lang) {
          this.setLanguage(lang, true);
          if (menu) {
            menu.classList.add('hidden');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
          }
          this.notifyLanguageChanged(lang);
        }
      });
    });

    // Mobile Drawer Language Buttons Click
    document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.getAttribute('data-lang');
        if (lang) {
          this.setLanguage(lang, true);
          this.notifyLanguageChanged(lang);
        }
      });
    });

    // Legacy fallback buttons (if any)
    document.querySelectorAll('.flag-btn, .lang-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.getAttribute('data-lang');
        if (lang) {
          this.setLanguage(lang, true);
          this.notifyLanguageChanged(lang);
        }
      });
    });
  },

  notifyLanguageChanged(lang) {
    const langNames = {
      pt: 'Português ativado 🇧🇷',
      en: 'English activated 🇺🇸',
      es: 'Español activado 🇪🇸',
      fr: 'Français activé 🇫🇷',
      it: 'Italiano attivato 🇮🇹',
      zh: '中文已激活 🇨🇳'
    };
    Utils.showToast(langNames[lang] || 'Idioma alterado', 'success', 1500);
  },

  /**
   * Map country code (from IP detection) or browser locale to supported language
   * @param {string} code 2-letter Country code or language code
   */
  mapLocaleToSupported(code) {
    if (!code) return 'pt';
    const c = code.toUpperCase();

    // Country mappings
    if (['US', 'GB', 'CA', 'AU', 'NZ', 'IE', 'ZA', 'EN'].includes(c)) return 'en';
    if (['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY'].includes(c)) return 'es';
    if (['FR', 'BE', 'CH', 'CA', 'LU', 'MC', 'SN', 'CI'].includes(c)) return 'fr';
    if (['IT', 'SM', 'VA'].includes(c)) return 'it';
    if (['CN', 'TW', 'HK', 'MO', 'SG', 'ZH'].includes(c)) return 'zh';
    if (['BR', 'PT', 'AO', 'MZ', 'CV', 'GW', 'ST', 'TL'].includes(c)) return 'pt';

    // Default to Portuguese
    return 'pt';
  },

  /**
   * Auto-detect from IP Country Code if user hasn't chosen manually
   */
  autoDetectFromCountry(countryCode) {
    const manualSaved = localStorage.getItem('myip_language_manual');
    if (manualSaved) return; // User made manual choice, preserve it

    const lang = this.mapLocaleToSupported(countryCode);
    if (lang !== this.currentLang) {
      this.setLanguage(lang, false);
      console.log(`[i18n] Auto-detected language '${lang}' from country '${countryCode}'`);
    }
  },

  /**
   * Change current language
   */
  setLanguage(lang, isManual = true) {
    if (!this.supportedLangs.includes(lang)) lang = this.defaultLang;
    this.currentLang = lang;

    if (isManual) {
      localStorage.setItem('myip_language', lang);
      localStorage.setItem('myip_language_manual', 'true');
    }

    document.documentElement.setAttribute('lang', lang);

    // Update Flag Image & Label in Custom Combobox Header
    const flagInfo = this.flags[lang] || this.flags.pt;
    const activeFlagIcon = document.getElementById('active-flag-icon');
    const activeLangText = document.getElementById('active-lang-text');

    if (activeFlagIcon) {
      activeFlagIcon.innerHTML = `<img src="${flagInfo.img}" width="22" height="15" alt="${flagInfo.name}" class="flag-img" />`;
    }
    if (activeLangText) {
      activeLangText.textContent = flagInfo.name;
    }

    // Highlight active option in Combobox menu
    document.querySelectorAll('.combo-item').forEach(item => {
      if (item.getAttribute('data-lang') === lang) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Highlight active option in Mobile drawer
    document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update all text nodes with data-i18n
    this.updatePageText();

    // Trigger custom event for modules to refresh dynamic texts
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  },

  /**
   * Get translation for a key
   */
  t(key) {
    const dict = this.translations[this.currentLang] || this.translations[this.defaultLang];
    return dict[key] || this.translations[this.defaultLang][key] || key;
  },

  /**
   * Update all DOM elements with data-i18n attributes
   */
  updatePageText() {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      if (val) {
        el.textContent = val;
      }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = this.t(key);
      if (val) {
        el.setAttribute('placeholder', val);
      }
    });

    // Titles / tooltips
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = this.t(key);
      if (val) {
        el.setAttribute('title', val);
      }
    });
  }
};

window.I18n = I18n;
