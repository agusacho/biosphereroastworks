/**
 * lang-init.js
 * Must be loaded FIRST, before any other script.
 * Sets the lang attribute on <html> so CSS/JS can read it immediately.
 * Also exposes getLang() / setLang() / t() globally before main.js loads.
 */
(function() {
    // Read language: localStorage -> cookie -> default 'id'
    function _readLang() {
        try {
            var l = localStorage.getItem('lang');
            if (l === 'id' || l === 'en') return l;
        } catch(e) {}
        var m = document.cookie.match(/(^|; )lang=([^;]+)/);
        if (m && (m[2] === 'id' || m[2] === 'en')) return m[2];
        return 'id';
    }
    function _writeLang(l) {
        try { localStorage.setItem('lang', l); } catch(e) {}
        document.cookie = 'lang=' + l + '; path=/; max-age=31536000; SameSite=Lax';
    }

    var currentLang = _readLang();

    // Mark <html> with lang attribute immediately (before DOM renders)
    document.documentElement.lang = currentLang;
    document.documentElement.setAttribute('data-lang', currentLang);

    // Expose helpers globally so main.js can use them
    window.getLang = function() { return _readLang(); };
    window.setLang  = function(l) { _writeLang(l); currentLang = l; };

    window.t = function(key, fallback) {
        var lang = _readLang();
        if (window.i18n && window.i18n[lang] && window.i18n[lang][key] !== undefined) {
            return window.i18n[lang][key];
        }
        if (fallback !== undefined) return fallback;
        if (window.i18n && window.i18n['id'] && window.i18n['id'][key] !== undefined) {
            return window.i18n['id'][key];
        }
        return '';
    };

    window.toggleLanguage = function() {
        var lang = _readLang();
        lang = lang === 'id' ? 'en' : 'id';
        _writeLang(lang);
        document.body.style.opacity = '0.4';
        setTimeout(function() { window.location.reload(); }, 120);
    };

    window.applyTranslations = function() {
        var lang = _readLang();
        if (!window.i18n || !window.i18n[lang]) return;

        var D = document;

        function setText(sel, key) {
            var val = window.t(key);
            if (!val) return;
            D.querySelectorAll(sel).forEach(function(el) { el.textContent = val; });
        }
        function setPlaceholder(sel, key) {
            var val = window.t(key);
            if (!val) return;
            D.querySelectorAll(sel).forEach(function(el) { el.placeholder = val; });
        }

        // data-i18n attributes
        D.querySelectorAll('[data-i18n]').forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            var val = window.t(key);
            if (!val) return;
            var tag = el.tagName;
            if ((tag === 'INPUT' || tag === 'TEXTAREA') && 'placeholder' in el) {
                el.placeholder = val;
            } else {
                el.textContent = val;
            }
        });

        // Navigation
        setText('.nav-links a[href="tracking.html"]:not([data-i18n])', 'nav_track');
        setText('.nav-links a[href="index.html"]:not([data-i18n])', 'nav_home');

        // Cart
        setText('#cartOffcanvas h3', 'cart_title');
        setText('.cart-empty-msg', 'cart_empty');
        setText('#checkoutBtn', 'cart_checkout');

        // Payment Modal
        setText('#paymentModal h3', 'payment_title');

        // Auth Modal
        setPlaceholder('#authEmail', 'auth_email_placeholder');
        setPlaceholder('#authPassword', 'auth_password_placeholder');
        setPlaceholder('#authName', 'auth_name_placeholder');

        // Product page
        setText('.produk-hero-title', 'produk_hero_title');
        setText('.produk-hero-subtitle, .produk-hero-sub', 'produk_hero_sub');
        setPlaceholder('#searchInput', 'produk_search_placeholder');
        setText('[data-filter-all]', 'produk_filter_all');

        // Blog
        setText('.blog-title', 'blog_title');
        setText('.blog-sub', 'blog_sub');
        setText('.blog-toc h4, .toc-title', 'blog_toc_title');

        // Tracking
        setText('.track-title', 'track_title');
        setText('.track-sub', 'track_sub');
        setPlaceholder('#trackingOrderId', 'track_placeholder');
        setText('#trackBtn, #btnTrack', 'track_btn');

        // Shared sections
        setText('.testimoni-title', 'testimoni_title');
        setText('.filosofi-title', 'roasting_title');
        setText('.kontak-title', 'kontak_title');
        setText('.kontak-sub', 'kontak_sub');
        setPlaceholder('#kontakName', 'kontak_name_placeholder');
        setPlaceholder('#kontakEmail', 'kontak_email_placeholder');
        setPlaceholder('#kontakMessage', 'kontak_message_placeholder');
        setText('#kontakSendBtn', 'kontak_send_btn');

        // Footer
        setText('.footer-products-title', 'footer_products');
        setText('.footer-info-title', 'footer_info');
        setText('.footer-follow-title', 'footer_follow');
        setText('.footer-copyright', 'footer_copyright');

        // AI Chat
        setPlaceholder('#aiChatInput', 'ai_chat_placeholder');

        // Update switcher UI
        var idEl = D.getElementById('langId');
        var enEl = D.getElementById('langEn');
        if (idEl && enEl) {
            if (lang === 'en') {
                idEl.style.opacity = '0.4'; idEl.style.fontWeight = '400';
                enEl.style.opacity = '1';   enEl.style.fontWeight = '800';
            } else {
                idEl.style.opacity = '1';   idEl.style.fontWeight = '800';
                enEl.style.opacity = '0.4'; enEl.style.fontWeight = '400';
            }
        }

        // Blog lang blocks
        D.querySelectorAll('[data-lang]').forEach(function(el) {
            el.style.display = el.getAttribute('data-lang') === lang ? '' : 'none';
        });
    };
})();
