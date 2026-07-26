/**
 * site_settings.js — Biosphere Roast Works
 * Membaca pengaturan tampilan dari Supabase dan menerapkan ke semua halaman.
 * Include setelah supabase CDN di setiap halaman HTML.
 */
(async function applySiteSettings() {
    if (typeof supabase === 'undefined') return;

    const SUPABASE_URL = 'https://gvuzsbrplmgqjuchjcpk.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dXpzYnJwbG1ncWp1Y2hqY3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MTE5NDMsImV4cCI6MjA5MTI4Nzk0M30.PowRUwVvHnEKvfBC3jvK5gHUsCACT2ecTJxOAat8qXU';

    try {
        const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        const { data, error } = await _sb.from('site_settings').select('key,value,type');
        if (error || !data) return;

        // Build key→value map
        const cfg = {};
        data.forEach(r => { cfg[r.key] = r.value || ''; });

        const get = (k, fb = '') => cfg[k] !== undefined ? cfg[k] : fb;
        const page = document.body.dataset.page || '';

        /* ── ANNOUNCEMENT BAR (semua halaman) ─────────────────────── */
        if (get('announcement_enabled') === 'true') {
            const text  = get('announcement_text');
            const color = get('announcement_color', '#0F5B58');
            if (text && !document.getElementById('announcementBar')) {
                const bar = document.createElement('div');
                bar.id = 'announcementBar';
                bar.style.cssText = `background:${color};color:#fff;text-align:center;padding:9px 48px;font-size:.88rem;font-weight:600;position:relative;z-index:1100;letter-spacing:.3px;`;
                bar.innerHTML = `${text}<button onclick="this.parentElement.remove();document.querySelector('header').style.top='0'" style="position:absolute;right:14px;top:50%;transform:translateY(-50%);background:transparent;border:none;color:rgba(255,255,255,.7);font-size:1.1rem;cursor:pointer;line-height:1;">&times;</button>`;
                document.body.insertBefore(bar, document.body.firstChild);
                const header = document.querySelector('header');
                if (header) header.style.top = bar.offsetHeight + 'px';
            }
        }

        /* ── GLOBAL — WhatsApp & Social links ─────────────────────── */
        const waNum = get('nav_whatsapp').replace(/\D/g, '');
        if (waNum) {
            document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
                a.href = a.href.replace(/wa\.me\/\d+/, `wa.me/${waNum}`);
            });
        }
        const igLink = get('social_instagram');
        if (igLink) document.querySelectorAll('a[href*="instagram.com"]').forEach(a => a.href = igLink);
        const ttLink = get('social_tiktok');
        if (ttLink) document.querySelectorAll('a[href*="tiktok.com"]').forEach(a => a.href = ttLink);

        /* ── HERO SLIDER (index.html) ──────────────────────────────── */
        const heroSlides = document.querySelectorAll('#heroSlider .slide');
        heroSlides.forEach((slide, i) => {
            const n = i + 1;
            const img   = get(`hero_slide${n}_image`);
            const title = get(`hero_slide${n}_title`);
            const sub   = get(`hero_slide${n}_subtitle`);
            const cta   = get(`hero_slide${n}_cta`);
            if (img)   { slide.style.backgroundImage = `url('${img}')`; slide.style.backgroundSize = 'cover'; slide.style.backgroundPosition = 'center'; }
            const h2 = slide.querySelector('.slide-content h2'); if (h2 && title) h2.textContent = title;
            const p  = slide.querySelector('.slide-content p');  if (p  && sub)   p.textContent  = sub;
            const a  = slide.querySelector('.slide-content a');  if (a  && cta)   a.textContent  = cta;
        });

        /* ── HALAMAN PRODUK ────────────────────────────────────────── */
        setText('.produk-hero-title',    get('produk_hero_title'));
        setText('.produk-hero-subtitle', get('produk_hero_subtitle'));
        const cat1 = document.querySelectorAll('.category-section-title');
        const cat1sub = document.querySelectorAll('.category-section-sub');
        if (cat1[0] && get('produk_cat1_title')) cat1[0].textContent = get('produk_cat1_title');
        if (cat1[1] && get('produk_cat2_title')) cat1[1].textContent = get('produk_cat2_title');
        if (cat1sub[0] && get('produk_cat1_sub')) cat1sub[0].textContent = get('produk_cat1_sub');
        if (cat1sub[1] && get('produk_cat2_sub')) cat1sub[1].textContent = get('produk_cat2_sub');

        /* ── HALAMAN TENTANG ───────────────────────────────────────── */
        if (document.querySelector('#tentang-page') || document.querySelector('section.about-hero')) {
            setText('#tentang-hero-title, .about-hero h2', get('tentang_hero_title'));
        }
        // Generic about section (di index & tentang)
        const aboutH2 = [...document.querySelectorAll('h2')].find(el => el.textContent.includes('Science Meets') || el.textContent.includes('Tentang'));
        if (aboutH2 && get('tentang_hero_title')) aboutH2.textContent = get('tentang_hero_title');

        // Tentang paragraphs
        const tentangParas = document.querySelectorAll('#tentang .about-grid p, section .about-text p');
        if (tentangParas[0] && get('tentang_para1')) tentangParas[0].textContent = get('tentang_para1');
        if (tentangParas[1] && get('tentang_para2')) tentangParas[1].textContent = get('tentang_para2');

        // Team members
        const teamNames  = document.querySelectorAll('.team-card h4, .team-name');
        const teamRoles  = document.querySelectorAll('.team-card p, .team-role');
        const teamImages = document.querySelectorAll('.team-card img, .team-photo');
        for (let i = 0; i < 3; i++) {
            const n = i + 1;
            if (teamNames[i]  && get(`team${n}_name`))  teamNames[i].textContent = get(`team${n}_name`);
            if (teamRoles[i]  && get(`team${n}_role`))  teamRoles[i].textContent = get(`team${n}_role`);
            if (teamImages[i] && get(`team${n}_image`)) { teamImages[i].src = get(`team${n}_image`); teamImages[i].style.display = ''; }
        }

        /* ── HALAMAN ROASTING ──────────────────────────────────────── */
        const roastTitle = document.querySelector('section .roast-hero h2, section h2.roast-title');
        if (roastTitle && get('roasting_hero_title')) roastTitle.textContent = get('roasting_hero_title');
        const steps = document.querySelectorAll('.roast-step, .process-step');
        steps.forEach((step, i) => {
            const n = i + 1;
            const h = step.querySelector('h3, h4'); if (h && get(`roasting_step${n}_title`)) h.textContent = get(`roasting_step${n}_title`);
            const p = step.querySelector('p');       if (p && get(`roasting_step${n}_desc`))  p.textContent = get(`roasting_step${n}_desc`);
        });

        /* ── TESTIMONI (semua halaman yang punya) ──────────────────── */
        const testiCards = document.querySelectorAll('.testimonial-card');
        testiCards.forEach((card, i) => {
            const n = i + 1;
            const txt  = card.querySelector('p[style*="italic"]');
            const name = card.querySelector('strong');
            const stars = card.querySelector('span[style*="accent"]');
            if (txt  && get(`testi${n}_text`))  txt.textContent  = get(`testi${n}_text`);
            if (name && get(`testi${n}_name`))  name.textContent = get(`testi${n}_name`);
            if (stars && get(`testi${n}_stars`)) {
                const count = parseInt(get(`testi${n}_stars`)) || 5;
                stars.innerHTML = '<i class="fa-solid fa-star"></i>'.repeat(count);
            }
        });

        /* ── BLOG CARDS ────────────────────────────────────────────── */
        const blogCards = document.querySelectorAll('.blog-card, .post-card');
        blogCards.forEach((card, i) => {
            const n = i + 1;
            const h   = card.querySelector('h3, h4');
            const p   = card.querySelector('p.excerpt, p.desc, .card-excerpt');
            const img = card.querySelector('img');
            const aut = card.querySelector('.author, .post-author');
            if (h   && get(`blog_post${n}_title`))   h.textContent   = get(`blog_post${n}_title`);
            if (p   && get(`blog_post${n}_excerpt`))  p.textContent   = get(`blog_post${n}_excerpt`);
            if (aut && get(`blog_post${n}_author`))   aut.textContent = get(`blog_post${n}_author`);
            if (img && get(`blog_post${n}_image`))  { img.src = get(`blog_post${n}_image`); img.onerror = () => img.style.display='none'; }
        });

        /* ── HALAMAN KONTAK ────────────────────────────────────────── */
        // Judul
        const kontakH2 = document.querySelector('#kontak h2.mb-4, section#kontak h2');
        if (kontakH2 && get('kontak_title')) kontakH2.textContent = get('kontak_title');
        const kontakSub = document.querySelector('#kontak p.mb-4');
        if (kontakSub && get('kontak_subtitle')) kontakSub.textContent = get('kontak_subtitle');

        // Telepon
        const phoneEl = document.querySelector('.info-item .fa-phone')?.parentElement?.querySelector('div');
        if (phoneEl && get('contact_phone')) {
            phoneEl.innerHTML = `<strong>Telepon / WhatsApp</strong><br>${get('contact_phone')}`;
        }

        // Alamat
        const addrEl = document.querySelector('.info-item .fa-location-dot')?.parentElement?.querySelector('div');
        if (addrEl && get('contact_address')) {
            addrEl.innerHTML = `<strong>Home Roastery & Coffee</strong><br>${get('contact_address').replace(/\n/g,'<br>')}`;
        }

        // Maps
        const mapsEmbed = get('contact_maps_embed');
        if (mapsEmbed) {
            document.querySelectorAll('iframe[src*="maps.google"]').forEach(f => f.src = mapsEmbed);
        }
        const mapsUrl = get('contact_maps_url');
        if (mapsUrl) {
            document.querySelectorAll('a[href*="share.google"], a[href*="maps.google"]').forEach(a => {
                if (a.textContent.includes('Maps') || a.textContent.includes('Google')) a.href = mapsUrl;
            });
        }

        /* ── FOOTER ────────────────────────────────────────────────── */
        document.querySelectorAll('[data-setting]').forEach(el => {
            const val = get(el.dataset.setting);
            if (val) el.textContent = val;
        });
        const footerTagline = document.querySelector('.footer-tagline, footer .tagline');
        if (footerTagline && get('footer_tagline')) footerTagline.textContent = get('footer_tagline');
        const footerAbout = document.querySelector('.footer-about, footer .about-text p');
        if (footerAbout && get('footer_about')) footerAbout.textContent = get('footer_about');

    } catch (e) {
        console.warn('[site_settings] Could not load settings:', e.message);
    }

    function setText(selector, value) {
        if (!value) return;
        document.querySelectorAll(selector).forEach(el => el.textContent = value);
    }
})();
