/**
 * site_settings.js — Biosphere Roast Works
 * Membaca pengaturan tampilan dari Supabase dan menerapkannya ke halaman.
 * Include file ini di semua halaman SETELAH supabase CDN.
 */
(async function applySiteSettings() {
    const SUPABASE_URL = 'https://gvuzsbrplmgqjuchjcpk.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dXpzYnJwbG1ncWp1Y2hqY3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MTE5NDMsImV4cCI6MjA5MTI4Nzk0M30.PowRUwVvHnEKvfBC3jvK5gHUsCACT2ecTJxOAat8qXU';

    try {
        // Wait for supabase library to load
        if (typeof supabase === 'undefined') return;
        const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        const { data, error } = await _sb.from('site_settings').select('key,value,type');
        if (error || !data) return;

        // Convert to key→value map
        const settings = {};
        data.forEach(row => { settings[row.key] = { value: row.value, type: row.type }; });

        const get = (key, fallback = '') => (settings[key]?.value ?? fallback);

        /* ── ANNOUNCEMENT BAR ─────────────────────────────────── */
        if (get('announcement_enabled') === 'true') {
            const text  = get('announcement_text');
            const color = get('announcement_color', '#0F5B58');
            if (text && !document.getElementById('announcementBar')) {
                const bar = document.createElement('div');
                bar.id = 'announcementBar';
                bar.style.cssText = `
                    background:${color};color:#fff;text-align:center;
                    padding:9px 40px;font-size:.88rem;font-weight:600;
                    position:relative;z-index:1001;letter-spacing:.3px;
                `;
                bar.innerHTML = `${text} <button onclick="this.parentElement.remove()" style="position:absolute;right:14px;top:50%;transform:translateY(-50%);background:transparent;border:none;color:rgba(255,255,255,.7);font-size:1.1rem;cursor:pointer;">✕</button>`;
                document.body.insertBefore(bar, document.body.firstChild);
                // Push header down
                const header = document.querySelector('header');
                if (header) header.style.top = bar.offsetHeight + 'px';
            }
        }

        /* ── HERO SLIDES ──────────────────────────────────────── */
        const slides = document.querySelectorAll('.hero .slide, .hero .slide-content');
        const heroSlides = document.querySelectorAll('#heroSlider .slide');
        heroSlides.forEach((slide, i) => {
            const n = i + 1;
            const imgUrl   = get(`hero_slide${n}_image`);
            const title    = get(`hero_slide${n}_title`);
            const subtitle = get(`hero_slide${n}_subtitle`);
            const cta      = get(`hero_slide${n}_cta`);

            // Background image
            if (imgUrl) {
                slide.style.backgroundImage = `url('${imgUrl}')`;
                slide.style.backgroundSize  = 'cover';
                slide.style.backgroundPosition = 'center';
            }

            // Text content
            const content = slide.querySelector('.slide-content');
            if (content) {
                const h2 = content.querySelector('h2');
                const p  = content.querySelector('p');
                const a  = content.querySelector('a');
                if (h2 && title)    h2.textContent = title;
                if (p  && subtitle) p.textContent  = subtitle;
                if (a  && cta)      a.textContent  = cta;
            }
        });

        /* ── ABOUT SECTION ────────────────────────────────────── */
        const aboutTitle = get('about_title');
        const aboutBody  = get('about_body');
        const aboutImg   = get('about_image');

        if (aboutTitle) {
            const el = document.querySelector('#tentang h2, section#tentang h2');
            if (el) el.textContent = aboutTitle;
        }
        if (aboutBody) {
            const el = document.querySelector('#tentang .about-grid > div > p:first-of-type');
            if (el) el.textContent = aboutBody;
        }
        if (aboutImg) {
            const el = document.querySelector('#tentang .img-placeholder');
            if (el) {
                el.style.backgroundImage = `url('${aboutImg}')`;
                el.style.backgroundSize  = 'cover';
                el.style.backgroundPosition = 'center';
                el.innerHTML = '';
            }
        }

        /* ── CONTACT ──────────────────────────────────────────── */
        const phone   = get('contact_phone');
        const address = get('contact_address');
        const mapsEmbed = get('contact_maps_embed');

        if (phone) {
            document.querySelectorAll('[data-setting="contact_phone"]').forEach(el => el.textContent = phone);
            // Also update WA links
            document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
                const digits = phone.replace(/\D/g, '');
                a.href = a.href.replace(/wa\.me\/\d+/, `wa.me/${digits}`);
            });
        }
        if (address) {
            document.querySelectorAll('[data-setting="contact_address"]').forEach(el => el.textContent = address);
        }
        if (mapsEmbed) {
            const iframe = document.querySelector('iframe[src*="maps.google"]');
            if (iframe) iframe.src = mapsEmbed;
        }

        /* ── FOOTER TAGLINE ───────────────────────────────────── */
        const tagline = get('footer_tagline');
        if (tagline) {
            document.querySelectorAll('[data-setting="footer_tagline"]').forEach(el => el.textContent = tagline);
        }

    } catch (e) {
        // Silently fail — don't break page if settings can't load
        console.warn('[site_settings] Could not load settings:', e.message);
    }
})();
