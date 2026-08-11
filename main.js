/* --- I18N SUPPORT --- */

function getLang() {
    try {
        let l = localStorage.getItem('lang');
        if (l) return l;
    } catch(e) {}
    let match = document.cookie.match(new RegExp('(^| )lang=([^;]+)'));
    if (match) return match[2];
    return 'id';
}
function setLang(l) {
    try { localStorage.setItem('lang', l); } catch(e) {}
    document.cookie = 'lang=' + l + '; path=/; max-age=31536000';
}

function applyTranslations() {
    const lang = getLang() || 'id';
    if (!window.i18n) return;

    // --- Apply data-i18n attributes ---
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = t(key);
        if (!val || val === key) return;
        const tag = el.tagName;
        if ((tag === 'INPUT' || tag === 'TEXTAREA') && el.placeholder !== undefined) {
            el.placeholder = val;
        } else {
            el.innerText = val;
        }
    });

    // --- Apply translations by selector (no data-i18n needed) ---
    const setTxt = (sel, key) => {
        document.querySelectorAll(sel).forEach(el => { if(t(key) !== key) el.innerText = t(key); });
    };
    const setPlaceholder = (sel, key) => {
        document.querySelectorAll(sel).forEach(el => { if(t(key) !== key) el.placeholder = t(key); });
    };

    // Shared Navigation
    setTxt('a[href="tracking.html"]:not([data-i18n])', 'nav_track');

    // Shared Cart Offcanvas
    setTxt('#cartPanel h3, #cartOffcanvas h3', 'cart_title');
    setTxt('#emptyCartMsg, .cart-empty-msg', 'cart_empty');
    setTxt('#cartCheckoutBtn, .btn-checkout', 'cart_checkout');
    setTxt('.cart-total-label', 'cart_total');

    // Shared Payment Modal
    setTxt('#paymentModal h3, #paymentModalTitle', 'payment_title');
    setTxt('#totalBillingLabel, .total-billing-label', 'payment_amount_due');
    setTxt('#selectMethodLabel, .select-method-label', 'payment_select_method');
    document.querySelectorAll('.auto-verify-badge, .badge-auto').forEach(el => { el.innerText = t('payment_auto_verify'); });
    setTxt('.gopay-desc', 'payment_gopay_desc');
    setTxt('#payBtn, .pay-now-btn', 'payment_pay_btn');

    // Shared Auth Modal
    setTxt('#authModal h3:first-of-type, #authModalTitle', 'auth_signin_title');
    setPlaceholder('#authName, input[name="name"]', 'auth_name_placeholder');
    setPlaceholder('#authEmail, input[name="email"]', 'auth_email_placeholder');
    setPlaceholder('#authPassword, input[name="password"]', 'auth_password_placeholder');
    setTxt('#authSubmitBtn', 'auth_signin_btn');
    setTxt('#authToggleText', 'auth_no_account');
    setTxt('#authToggleLink', 'auth_register_link');
    setTxt('#authLogoutBtn, .auth-logout', 'auth_logout_btn');

    // Shared Testimoni
    setTxt('.testimoni-title, section h2.testimoni', 'testimoni_title');

    // Shared About
    setTxt('.about-title, .tentang-title', 'about_title');

    // Shared Roasting Section
    setTxt('.roasting-title, .filosofi-title', 'roasting_title');
    setTxt('.roasting-sub, .filosofi-sub', 'roasting_sub');

    // Shared Kontak Section
    setTxt('.kontak-title, .contact-title', 'kontak_title');
    setTxt('.kontak-sub, .contact-sub', 'kontak_sub');
    setPlaceholder('input[name="kontakName"], #kontakName', 'kontak_name_placeholder');
    setPlaceholder('input[name="kontakEmail"], #kontakEmail', 'kontak_email_placeholder');
    setPlaceholder('textarea[name="kontakMessage"], #kontakMessage', 'kontak_message_placeholder');
    setTxt('#kontakSendBtn, .kontak-send-btn', 'kontak_send_btn');

    // Quiz Modal
    document.querySelectorAll('.quiz-recommendation-title').forEach(el => el.innerText = t('quiz_recommendation_title'));

    // Blog page
    setTxt('.blog-header h2, .blog-title', 'blog_title');
    setTxt('.blog-header p, .blog-sub', 'blog_sub');
    setTxt('.toc-title, .blog-toc h4', 'blog_toc_title');

    // Tracking page
    setTxt('.track-title', 'track_title');
    setTxt('.track-sub', 'track_sub');
    setPlaceholder('#trackingOrderId', 'track_placeholder');
    setTxt('#trackBtn', 'track_btn');

    // Product page hero
    setTxt('.produk-hero-title', 'produk_hero_title');
    setTxt('.produk-hero-subtitle, .produk-hero-sub', 'produk_hero_sub');
    setPlaceholder('#searchInput, .product-search', 'produk_search_placeholder');

    // Footer
    setTxt('.footer-col-products h4, .footer-products-title', 'footer_products');
    setTxt('.footer-col-info h4, .footer-info-title', 'footer_info');
    setTxt('.footer-col-social h4, .footer-follow-title', 'footer_follow');
    setTxt('.footer-copyright, .footer-copy', 'footer_copyright');

    // AI Chat
    setPlaceholder('#aiChatInput, .ai-chat-input', 'ai_chat_placeholder');

    // Language switcher highlight
    const idEl = document.getElementById('langId');
    const enEl = document.getElementById('langEn');
    if (idEl && enEl) {
        if (lang === 'en') {
            idEl.style.opacity = '0.45'; enEl.style.opacity = '1';
            enEl.style.fontWeight = '800'; idEl.style.fontWeight = '400';
        } else {
            idEl.style.opacity = '1'; enEl.style.opacity = '0.45';
            idEl.style.fontWeight = '800'; enEl.style.fontWeight = '400';
        }
    }

    // Blog language toggle: show/hide lang-specific blocks
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.style.display = (el.dataset.lang === lang) ? '' : 'none';
    });
}

function toggleLanguage() {
    if (typeof window.i18n === 'undefined') {
        alert(t('lang_error_not_loaded', 'Please refresh.'));
        return;
    }
    try {
        let lang = getLang() || 'id';
        lang = lang === 'id' ? 'en' : 'id';
        setLang(lang);
        
        document.body.style.opacity = '0.5';
        setTimeout(() => {
            window.location.reload();
        }, 150);
    } catch(e) {
        alert('Gagal mengganti bahasa. Pastikan LocalStorage browser Anda aktif.');
        console.error(e);
    }
}


        /* --- 1. SETUP SUPABASE --- */
        const SUPABASE_URL = 'https://gvuzsbrplmgqjuchjcpk.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dXpzYnJwbG1ncWp1Y2hqY3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MTE5NDMsImV4cCI6MjA5MTI4Nzk0M30.PowRUwVvHnEKvfBC3jvK5gHUsCACT2ecTJxOAat8qXU';
        
        let _supabase;
        let isSupabaseConfigured = true;

        if(isSupabaseConfigured) {
            try {
                if (typeof supabase !== 'undefined') {
                    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                } else {
                    console.error("Supabase is not defined.");
                }
            } catch(e) {
                console.error("Supabase init error:", e);
            }
        } else {
            console.warn("⚠️ Supabase belum dikonfigurasi. Berjalan dalam mode simulasi offline.");
        }

        /* --- 2. DATA PRODUK (Fallback jika Database Kosong) --- */
        let productsDB = [
            { id: '1', name: 'Ciwidey Arabica Bio-Natural', category: 'green', origin: 'Ciwidey', process: 'Natural', price: 95000, rating: 4.8, notes: 'Fruity, Jackfruit hints', imageStyle: 'var(--metallic-white)' },
            { id: '2', name: 'Kamojang Vinoso', category: 'roasted', origin: 'Kamojang', process: 'Anaerob', type: 'Experimental', notes: 'Grape, Wine', rating: 5.0, imageStyle: 'var(--metallic-gold)',
              variants: [ { name: '100 gram', price: 59900 }, { name: '200 gram', price: 114500 } ] }
        ];        /* --- 3. STATE MANAGEMENT --- */
        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem('biosphere_cart')) || [];
        } catch(e) {
            console.error("LocalStorage error:", e);
        }
        let allProductsData = [];
        let currentFilteredProducts = [...productsDB];
        let activeCategoryFilter = 'all';
        let selectedPaymentMethod = ''; 

        /* --- 4. UTILITY FUNCTIONS --- */
        const showLoader = () => {
            const loader = document.getElementById('loader');
            if(loader) loader.classList.add('active');
        };
        const hideLoader = () => {
            const loader = document.getElementById('loader');
            if(loader) loader.classList.remove('active');
        };

        const formatRupiah = (number) => {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
        };

        const showToast = (message) => {
            const container = document.getElementById('toastContainer');
            if(!container) return;
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> <span>${message}</span>`;
            container.appendChild(toast);
            
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        };        /* --- 5. INITIALIZE DATA --- */
       function renderProducts(products) {
    const dynamicSections = document.getElementById('dynamic-product-sections');
    const productGrid = document.getElementById('productGrid');

    if (!dynamicSections && !productGrid) return;
    
    if (productGrid) productGrid.innerHTML = '';
    if (dynamicSections) dynamicSections.innerHTML = '';

    if (products.length === 0) {
        const empty = `<div class="empty-state"><i class="fa-solid fa-mug-saucer"></i><p>${t('produk_empty') || 'Belum ada produk'}</p></div>`;
        if (productGrid) productGrid.innerHTML = empty;
        if (dynamicSections) dynamicSections.innerHTML = empty;
        return;
    }

    if (dynamicSections) {
        const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
        categories.forEach(cat => {
            let icon = "fa-tag"; 
            if (cat.toLowerCase().includes("minuman")) icon = "fa-bottle-water";
            else if (cat.toLowerCase().includes("roasted") || cat.toLowerCase().includes("bean")) icon = "fa-fire-flame-curved";
            else if (cat.toLowerCase().includes("alat") || cat.toLowerCase().includes("brew")) icon = "fa-filter";
            else if (cat.toLowerCase().includes("merch")) icon = "fa-shirt";
            
            const catId = cat.replace(/\s+/g, '-').toLowerCase();
            const section = document.createElement('div');
            section.className = 'produk-category-section';
            section.id = 'section-' + catId;
            
            if (typeof activeCategoryFilter !== 'undefined' && activeCategoryFilter !== 'all' && activeCategoryFilter !== cat) {
                section.style.display = 'none';
            }
            
            let i18nAttr = "";
            let catTitle = cat;
            if (cat === "Minuman Kopi") i18nAttr = `data-i18n="produk_cat1_title"`;
            
            section.innerHTML = `
                <div class="category-section-header">
                    <div class="category-icon-wrap" style="background: rgba(212, 175, 55, 0.1); color: var(--accent); width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div>
                        <h2 class="category-section-title" ${i18nAttr} style="font-size: 1.8rem; color: var(--primary); margin-bottom: 5px;">${catTitle}</h2>
                    </div>
                </div>
                <div class="product-grid" id="grid-${catId}"></div>
            `;
            dynamicSections.appendChild(section);
        });
    }

    products.forEach(product => {
        const badgeClass = (product.category && product.category.includes('Roasted')) ? 'badge-roasted' : 'badge-green';
        const badgeLabel = (product.category && product.category.includes('Roasted')) ? (t('produk_badge_roasted') || 'Roasted Bean') : product.category;
        const pNotes = (typeof getLang === 'function' && getLang() === 'en' && product.notes_en) ? product.notes_en : product.notes;

        let defaultPriceStr = (typeof formatRupiah === 'function') ? formatRupiah(product.price) : `Rp ${product.price}`;
        const hasVariants = product.variants && Array.isArray(product.variants) && product.variants.length > 0;
        if(hasVariants) defaultPriceStr = (typeof formatRupiah === 'function') ? formatRupiah(product.variants[0].price) : `Rp ${product.variants[0].price}`;

        const variantTagsHtml = hasVariants
            ? product.variants.slice(0, 3).map(v => `<span class="variant-tag">${v.name}</span>`).join('')
            : '';

        const stars = (product.rating || 0) >= 4.5
            ? '<i class="fa-solid fa-star"></i>'.repeat(5)
            : '<i class="fa-solid fa-star"></i>'.repeat(4) + '<i class="fa-regular fa-star"></i>';

        const detailAction = `openProductDetail('${product.id}')`;
        const addAction = hasVariants ? detailAction : `quickAddToCart('${product.id}')`;

        let card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrapper" style="cursor:pointer;" onclick="${addAction}">
                <span class="category-badge ${badgeClass}">${badgeLabel}</span>
                <div class="img-placeholder">${product.name.split(' ').slice(0, 2).join(' ')}</div>
                <div class="quick-add-overlay">
                    <button class="btn-quick btn-quick-outline" onclick="event.stopPropagation(); ${detailAction}">
                        <i class="fa-solid fa-eye"></i> ${t('produk_btn_detail') || 'Detail'}
                    </button>
                    <button class="btn-quick btn-quick-primary" onclick="event.stopPropagation(); ${addAction}">
                        <i class="fa-solid fa-cart-plus"></i> ${hasVariants ? (t('produk_btn_select') || 'Pilih') : (t('produk_btn_add') || 'Tambah')}
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-notes">${pNotes || '&nbsp;'}</p>
                ${variantTagsHtml ? `<div class="product-variants-tags">${variantTagsHtml}</div>` : ''}
                <div class="product-card-footer">
                    <div>
                        <div class="product-price">${hasVariants ? `<span style="font-size:0.75rem;color:var(--text-muted);font-weight:400;">Mulai dari</span><br>` : ''}${defaultPriceStr}</div>
                    </div>
                    <div class="product-rating">${stars}</div>
                </div>
            </div>
        `;

        if (product.image_url) {
            const imgEl = document.createElement('img');
            imgEl.src = product.image_url;
            imgEl.alt = product.name;
            imgEl.className = 'product-img';
            imgEl.loading = 'lazy';
            imgEl.onerror = function() {
                this.style.display = 'none';
                this.nextElementSibling.style.display = 'flex';
            };
            card.querySelector('.product-img-wrapper').prepend(imgEl);
        }

        if (productGrid) {
            productGrid.appendChild(card);
        } else if (dynamicSections) {
            const catId = 'grid-' + product.category.replace(/\s+/g, '-').toLowerCase();
            const grid = document.getElementById(catId);
            if (grid) grid.appendChild(card);
        }
    });

    const countElement = document.getElementById('productCount');
    if (countElement) countElement.innerText = products.length;
    
    // Apply translations for the newly rendered sections
    if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
    }
};


/* --- RENDER CATEGORY PILLS DYNAMICALLY --- */
function renderCategoryPills(products) {
    const pillsContainer = document.getElementById('categoryPills');
    if (!pillsContainer) return;
    
    // Get unique categories
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    
    // Always start with "All"
    let html = `<button class="pill active" onclick="filterCategory('all')" data-cat="all">
        <i class="fa-solid fa-border-all"></i> <span data-i18n="produk_filter_all">Semua Produk</span>
    </button>`;
    
    categories.forEach(cat => {
        let icon = "fa-tag"; // default icon
        if (cat.toLowerCase().includes("minuman")) icon = "fa-bottle-water";
        else if (cat.toLowerCase().includes("roasted") || cat.toLowerCase().includes("bean")) icon = "fa-fire-flame-curved";
        else if (cat.toLowerCase().includes("alat") || cat.toLowerCase().includes("brew")) icon = "fa-filter";
        else if (cat.toLowerCase().includes("merch")) icon = "fa-shirt";
        
        let i18nAttr = "";
        if (cat === "Minuman Kopi") i18nAttr = `data-i18n="produk_filter_drinks"`;
        else if (cat === "Roasted Bean") i18nAttr = `data-i18n="produk_filter_beans"`;
        
        html += `<button class="pill" onclick="filterCategory('${cat}')" data-cat="${cat}">
            <i class="fa-solid ${icon}"></i> <span ${i18nAttr}>${cat}</span>
        </button>`;
    });
    
    pillsContainer.innerHTML = html;
    
    // Apply translations to the newly generated pills
    if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
    }
}

/* --- FUNGSI FETCH PRODUK DARI SUPABASE --- */
async function fetchProducts() {
    // Jika tidak terkonfigurasi, batalkan penarikan data
    if (!isSupabaseConfigured) {
        console.warn("Supabase belum terkonfigurasi. Menampilkan produk kosong/simulasi.");
        allProductsData = [...productsDB];
        currentFilteredProducts = [...allProductsData];
        return; 
    }

    try {
        // Tampilkan animasi loading jika ada
        if (typeof showLoader === "function") showLoader();

        // Mengambil seluruh baris data dari tabel 'products'
        const { data: products, error } = await _supabase
            .from('products')
            .select('*');

        // Jika Supabase melempar error, hentikan dan masuk ke blok catch
        if (error) throw error;

        // Render produk ke antarmuka HTML
        if (products && products.length > 0) {
            allProductsData = products;
            currentFilteredProducts = [...products];
            renderCategoryPills(products); // Generate dynamic categories
            renderProducts(products); // Render products
        } else {
            console.log("Koneksi berhasil, tetapi tidak ada data di dalam tabel 'products'.");
            const g1 = document.getElementById('grid-minuman');
            const g2 = document.getElementById('grid-roasted');
            if(g1) g1.innerHTML = "<p>Belum ada produk.</p>";
            if(g2) g2.innerHTML = "<p>Belum ada produk.</p>";
        }

    } catch (err) {
        console.error("Error Fetch Products:", err);
        alert(`Gagal memuat produk!nAlasan: ${err.message}`);
    } finally {
        // Matikan animasi loading
        if (typeof hideLoader === "function") hideLoader();
    }
}        /* --- 6. UI INTERACTION --- */
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 50) header.style.boxShadow = 'var(--shadow-md)';
            else header.style.boxShadow = 'var(--shadow-sm)';

            let current = '';
            document.querySelectorAll('section').forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - 100) current = section.getAttribute('id');
            });
            document.querySelectorAll('.nav-links a').forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
            });
        });

        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('navLinks').classList.toggle('active');
        });
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => document.getElementById('navLinks').classList.remove('active'));
        });

        let slideIndex = 0;
        const slides = document.querySelectorAll('.slide');
        const moveSlide = (n) => {
            slides[slideIndex].classList.remove('active');
            slideIndex = (slideIndex + n + slides.length) % slides.length;
            slides[slideIndex].classList.add('active');
        };

        const toggleSidebar = () => {
            document.getElementById('filterSidebar').classList.toggle('active');
            document.getElementById('overlay').classList.toggle('active');
            const closeBtn = document.getElementById('closeSidebarBtn');
            if(window.innerWidth <= 1024) {
                closeBtn.style.display = document.getElementById('filterSidebar').classList.contains('active') ? 'block' : 'none';
            }
        };

        const toggleCart = () => {
            document.getElementById('cartOffcanvas').classList.toggle('active');
            document.getElementById('overlay').classList.toggle('active');
            renderCart();
        };

        const closeModal = (id) => {
            document.getElementById(id).classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
        };

        document.getElementById('overlay').addEventListener('click', () => {
            document.getElementById('filterSidebar').classList.remove('active');
            document.getElementById('cartOffcanvas').classList.remove('active');
            document.getElementById('productModal').classList.remove('active');
            document.getElementById('paymentModal').classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
        });

        /* --- 7. SHOP LOGIC --- */
        const getBasePrice = (product) => {
            return product.variants && Array.isArray(product.variants) && product.variants.length > 0 
                ? Number(product.variants[0].price) 
                : Number(product.price);
        };



        const applyFilters = () => {
            let filtered = allProductsData.length > 0 ? allProductsData : productsDB;

            if(activeCategoryFilter !== 'all') {
                filtered = filtered.filter(p => p.category === activeCategoryFilter);
            }

            const searchText = document.getElementById('searchInput').value.toLowerCase();
            if(searchText) {
                filtered = filtered.filter(p => p.name.toLowerCase().includes(searchText) || (p.notes && p.notes.toLowerCase().includes(searchText)));
            }

            const originChecks = Array.from(document.querySelectorAll('.filter-origin:checked')).map(cb => cb.value);
            const processChecks = Array.from(document.querySelectorAll('.filter-process:checked')).map(cb => cb.value);

            if(originChecks.length > 0) filtered = filtered.filter(p => p.origin && originChecks.includes(p.origin));
            if(processChecks.length > 0) filtered = filtered.filter(p => p.process && processChecks.includes(p.process));

            const sortVal = document.getElementById('sortSelect').value;
            if(sortVal === 'price-asc') filtered.sort((a, b) => getBasePrice(a) - getBasePrice(b));
            if(sortVal === 'price-desc') filtered.sort((a, b) => getBasePrice(b) - getBasePrice(a));
            if(sortVal === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

            currentFilteredProducts = filtered;
            renderProducts(currentFilteredProducts);
        };

        const searchEl = document.getElementById('searchInput');
        if (searchEl) searchEl.addEventListener('input', applyFilters);

        const filterByCategory = (cat) => {
            activeCategoryFilter = cat;
            applyFilters();
        };

        const resetFilters = () => {
            activeCategoryFilter = 'all';
            const searchEl2 = document.getElementById('searchInput');
            if (searchEl2) searchEl2.value = '';
            applyFilters();
        };

        /* --- 8. PRODUCT DETAIL MODAL --- */
        let currentModalProduct = null;
        
        const openProductDetail = (id) => {
            const p = allProductsData.find(prod => String(prod.id) === String(id));
            if(!p) return;
            currentModalProduct = p;

            let variantHTML = '';
            let defaultPriceStr = '';
            const hasVariants = p.variants && Array.isArray(p.variants) && p.variants.length > 0;
            const lang = getLang() || 'id';
            const pNotes = (lang === 'en' && p.notes_en) ? p.notes_en : p.notes;
            const pDesc = (lang === 'en' && p.description_en) ? p.description_en : p.description;

            if (hasVariants) {
                defaultPriceStr = formatRupiah(p.variants[0].price);
                variantHTML = `
                    <div class="variant-selector mb-4">
                        <label style="display:block; margin-bottom:8px; font-weight:700;">${t('produk_select_variant')}</label>
                        <select class="form-control" id="modalVariantSelect" onchange="updateModalPrice()">
                            ${p.variants.map((v, index) => `<option value="${index}">${v.name}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else {
                defaultPriceStr = formatRupiah(p.price || 0);
                variantHTML = `<div class="mb-4 text-muted">${t('produk_default_variant')}</div>`;
            }

            const modalBody = document.getElementById('productModalBody');
            modalBody.innerHTML = `
                <div class="product-detail-layout">
                    <div class="product-detail-img img-placeholder" style="background: ${p.imageStyle || 'var(--metallic-white)'}; font-size: 2rem;">
                        ${p.name ? p.name.split(' ')[0] : 'Coffee'}
                    </div>
                    <div class="product-detail-info">
                        <span class="category-badge ${p.category === 'drink' ? 'Minuman Kopi' : (p.category === 'roasted' ? 'badge-roasted' : 'badge-green')}" style="position:relative; top:0; left:0; display:inline-block; margin-bottom:10px;">${(p.category || 'PRODUK').toUpperCase()}</span>
                        <h2 style="margin-bottom: 5px;">${p.name}</h2>
                        <div class="product-rating mb-4"><i class="fa-solid fa-star"></i> ${p.rating || 0}</div>
                        
                        <div style="font-size: 1.5rem; font-weight: 700; color: #B38728; margin-bottom: 20px;" id="modalPriceDisplay">${defaultPriceStr}</div>
                        
                        <p class="mb-4"><strong>Notes:</strong> ${pNotes || '-'}</p>
                        ${pDesc ? `<p class="mb-4 text-muted" style="font-size:0.95rem; line-height:1.5;">${pDesc.replace(/\n/g, '<br>')}</p>` : ''}
                        ${p.origin ? `<p class="mb-2"><strong>Origin:</strong> ${p.origin}</p>` : ''}
                        ${p.process ? `<p class="mb-4"><strong>${t('produk_process_label')}</strong> ${p.process}</p>` : ''}
                        
                        ${variantHTML}

                        <div style="display: flex; gap: 15px; margin-top: 20px;">
                            <div class="qty-controls" style="border: 1px solid var(--border); border-radius: var(--radius); padding: 5px;">
                                <button class="qty-btn" onclick="adjustModalQty(-1)">-</button>
                                <span id="modalQty" style="width: 30px; text-align: center; font-weight: 700;">1</span>
                                <button class="qty-btn" onclick="adjustModalQty(1)">+</button>
                            </div>
                            <button class="btn btn-primary" style="flex-grow: 1;" onclick="addToCartFromModal()">${t('produk_add_to_cart')}</button>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('productModal').classList.add('active');
            document.getElementById('overlay').classList.add('active');
        };

        const updateModalPrice = () => {
            if(!currentModalProduct.variants || currentModalProduct.variants.length === 0) return;
            const select = document.getElementById('modalVariantSelect');
            const selectedVariant = currentModalProduct.variants[select.value];
            document.getElementById('modalPriceDisplay').innerText = formatRupiah(selectedVariant.price);
        };

        const adjustModalQty = (change) => {
            const qtySpan = document.getElementById('modalQty');
            let qty = parseInt(qtySpan.innerText) + change;
            if(qty < 1) qty = 1;
            qtySpan.innerText = qty;
        };

        /* --- 9. CART LOGIC --- */
        const updateCartBadge = () => {
            const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
            document.getElementById('cartBadge').innerText = totalItems;
        };

        const saveCart = () => {
            localStorage.setItem('biosphere_cart', JSON.stringify(cart));
            updateCartBadge();
        };

        const quickAddToCart = (id) => {
            const p = allProductsData.find(prod => String(prod.id) === String(id));
            if(!p) return;
            
            const hasVariants = p.variants && Array.isArray(p.variants) && p.variants.length > 0;
            const lang = getLang() || 'id';
            const pNotes = (lang === 'en' && p.notes_en) ? p.notes_en : p.notes;
            const pDesc = (lang === 'en' && p.description_en) ? p.description_en : p.description;
            if(hasVariants) {
                openProductDetail(id); 
                return;
            }

            addItemToCartObject({
                id: String(p.id),
                name: p.name,
                variantName: 'Default',
                price: Number(p.price || 0),
                qty: 1,
                imageStyle: p.imageStyle || 'var(--metallic-white)'
            });
        };

        const addToCartFromModal = () => {
            const qty = parseInt(document.getElementById('modalQty').innerText);
            let variantName = 'Default';
            let price = Number(currentModalProduct.price || 0);
            const hasVariants = currentModalProduct.variants && Array.isArray(currentModalProduct.variants) && currentModalProduct.variants.length > 0;

            if(hasVariants) {
                const select = document.getElementById('modalVariantSelect');
                const selectedVariant = currentModalProduct.variants[select.value];
                variantName = selectedVariant.name;
                price = Number(selectedVariant.price);
            }

            addItemToCartObject({
                id: String(currentModalProduct.id),
                name: currentModalProduct.name,
                variantName: variantName,
                price: price,
                qty: qty,
                imageStyle: currentModalProduct.imageStyle || 'var(--metallic-white)'
            });

            closeModal('productModal');
        };

        const addItemToCartObject = (newItem) => {
            const existingIndex = cart.findIndex(item => item.id === newItem.id && item.variantName === newItem.variantName);
            if(existingIndex > -1) cart[existingIndex].qty += newItem.qty;
            else cart.push(newItem);
            
            saveCart();
            showToast(`${newItem.name} ${t('cart_added_toast')}`);
        };

        const renderCart = () => {
            const container = document.getElementById('cartItemsContainer');
            if(cart.length === 0) {
                container.innerHTML = '<p class="text-center" style="margin-top: 50px; color: var(--text-muted);">Keranjang Anda kosong.</p>';
                document.getElementById('cartTotalPrice').innerText = 'Rp 0';
                return;
            }

            container.innerHTML = '';
            let total = 0;

            cart.forEach((item, index) => {
                const subtotal = item.price * item.qty;
                total += subtotal;

                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div class="cart-item-img img-placeholder" style="background: ${item.imageStyle}; font-size: 0.8rem;">${item.name.split(' ')[0]}</div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-variant">${item.variantName !== 'Default' ? item.variantName : ''}</div>
                        <div class="cart-item-price">${formatRupiah(item.price)}</div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div class="qty-controls">
                                <button class="qty-btn" onclick="updateCartQty(${index}, -1)">-</button>
                                <span style="font-size: 0.9rem; font-weight:700;">${item.qty}</span>
                                <button class="qty-btn" onclick="updateCartQty(${index}, 1)">+</button>
                            </div>
                            <button class="remove-item" onclick="removeFromCart(${index})"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                `;
                container.appendChild(div);
            });

            document.getElementById('cartTotalPrice').innerText = formatRupiah(total);
        };

        const updateCartQty = (index, change) => {
            cart[index].qty += change;
            if(cart[index].qty < 1) {
                removeFromCart(index);
                return;
            }
            saveCart();
            renderCart();
        };

        const removeFromCart = (index) => {
            cart.splice(index, 1);
            saveCart();
            renderCart();
        };

        /* --- 10. E-COMMERCE CHECKOUT & PAYMENT LOGIC --- */
        function openPaymentModal() {
            if(cart.length === 0) {
                alert(t('cart_empty_alert'));
                return;
            }

            // Cek pengaturan order via WhatsApp
            const waEnabled = window.SITE_SETTINGS && window.SITE_SETTINGS['enable_whatsapp_order'] === 'true';
            if (waEnabled) {
                const waNumber = window.SITE_SETTINGS['whatsapp_order_number'] || '6281234567890';
                let waMessage = window.SITE_SETTINGS['whatsapp_order_message'] || 'Halo Biosphere, saya ingin memesan kopi:\n\n{cart_details}\n\nTotal: {total}\nNama: {name}\nEmail: {email}';
                
                let cartDetails = cart.map(item => `- ${item.name} (${item.variant}) x${item.qty} = ${formatRupiah(item.price * item.qty)}`).join('\n');
                let totalStr = formatRupiah(cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0));
                
                let cName = currentUser ? (currentUser.user_metadata?.name || 'User') : 'Guest';
                let cEmail = currentUser ? currentUser.email : 'guest@example.com';

                waMessage = waMessage.replace('{cart_details}', cartDetails)
                                     .replace('{total}', totalStr)
                                     .replace('{name}', cName)
                                     .replace('{email}', cEmail);
                                     
                const waUrl = `https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent(waMessage)}`;
                
                document.getElementById('cartOffcanvas').classList.remove('active');
                const overlay = document.getElementById('overlay');
                if(overlay) overlay.classList.remove('active');
                
                cart = [];
                saveCart();
                renderCart();
                
                window.open(waUrl, '_blank');
                return;
            }

            const total = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
            document.getElementById('paymentTotalDisplay').innerText = formatRupiah(total);

            selectedPaymentMethod = '';
            document.querySelectorAll('.payment-option').forEach(el => {
                el.classList.remove('selected');
                el.style.borderColor = 'var(--border)';
                el.style.backgroundColor = 'var(--surface)';
            });
            document.getElementById('btnProcessPayment').disabled = true;

            document.getElementById('cartOffcanvas').classList.remove('active');
            document.getElementById('paymentModal').classList.add('active');
            document.getElementById('overlay').classList.add('active'); 
        }

        function selectPaymentMethod(method, element) {
            selectedPaymentMethod = method;
            
            const options = document.querySelectorAll('.payment-option');
            options.forEach(opt => {
                opt.style.borderColor = 'var(--border)';
                opt.style.backgroundColor = 'var(--surface)';
                opt.classList.remove('selected');
            });
            
            element.style.borderColor = 'var(--accent)';
            element.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
            element.classList.add('selected');
            
            document.getElementById('btnProcessPayment').disabled = false;
        }

        async function processPayment() {
            if (!selectedPaymentMethod) return;

            // Kumpulkan data order
            const payload = {
                cart: cart,
                customer: {
                    name: currentUser ? (currentUser.user_metadata?.name || 'User') : 'Guest',
                    email: currentUser ? currentUser.email : 'guest@example.com'
                },
                paymentMethod: selectedPaymentMethod
            };

            showLoader();

            try {
                // Panggil Backend API Vercel Serverless Function
                const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || t('payment_error'));
                }

                hideLoader();
                closeModal('paymentModal');

                // Panggil Pop-up Midtrans Snap
                window.snap.pay(data.token, {
                    onSuccess: function(result){
                        alert(t('payment_success'));
                        cart = [];
                        saveCart();
                        renderCart();
                    },
                    onPending: function(result){
                        alert(t('payment_pending'));
                        cart = [];
                        saveCart();
                        renderCart();
                    },
                    onError: function(result){
                        alert(t('payment_failed'));
                    },
                    onClose: function(){
                        alert(t('payment_closed'));
                    }
                });

            } catch (err) {
                console.error("Checkout Error:", err);
                alert(`Gagal memproses pembayaran:\n${err.message}`);
                hideLoader();
            }
        }

        /* --- 11. CONTACT FORM LOGIC --- */
        async function handleContact(e) {
            e.preventDefault();
            const nama = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const pesan = document.getElementById('contactMessage').value;

            if(!isSupabaseConfigured) {
                showToast(t('kontak_sent_offline'));
                e.target.reset();
                return;
            }

            try {
                showLoader();
                document.getElementById('btnSubmitContact').disabled = true;

                const { error } = await _supabase.from('contacts').insert([{ nama, email, pesan }]);
                if (error) throw error;

                showToast(t('kontak_sent_toast'));
                e.target.reset();
            } catch (err) {
                console.error("Error Send Contact:", err);
                const errorMessage = err.message || "Error tidak diketahui";
                alert(`GAGAL MENGIRIM PESAN!nnAlasan dari Supabase:n"${errorMessage}"nnPastikan RLS sudah di-disable pada tabel 'contacts'.`);
            } finally {
                hideLoader();
                document.getElementById('btnSubmitContact').disabled = false;
            }
        }

        /* --- 11.5 AUTHENTICATION LOGIC --- */
        let isLoginMode = true;
        let currentUser = null;

        const openAuthModal = () => {
            document.getElementById('cartOffcanvas').classList.remove('active');
            document.getElementById('authModal').classList.add('active');
            document.getElementById('overlay').classList.add('active');
            checkSession();
        };

        const toggleAuthMode = (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            document.getElementById('authModalTitle').innerText = isLoginMode ? t('auth_signin_title') : t('auth_register_title');
            document.getElementById('btnSubmitAuth').innerText = isLoginMode ? t('auth_signin_btn') : t('auth_register_btn');
            document.getElementById('authToggleText').innerText = isLoginMode ? t('auth_no_account') : t('auth_have_account');
            document.getElementById('authToggleLink').innerText = isLoginMode ? t('auth_register_link') : t('auth_signin_link');
            document.getElementById('registerNameGroup').style.display = isLoginMode ? 'none' : 'block';
            if(!isLoginMode) document.getElementById('authName').required = true;
            else document.getElementById('authName').required = false;
        };

        async function handleAuth(e) {
            e.preventDefault();
            const email = document.getElementById('authEmail').value;
            const password = document.getElementById('authPassword').value;
            const name = document.getElementById('authName').value;

            showLoader();
            document.getElementById('btnSubmitAuth').disabled = true;

            try {
                if(!isSupabaseConfigured) {
                    // Offline simulation
                    setTimeout(() => {
                        currentUser = { email: email, user_metadata: { name: name || 'User Simulasi' } };
                        updateAuthUI();
                        showToast(isLoginMode ? t('auth_success_signin') : t('auth_success_register'));
                        hideLoader();
                        document.getElementById('btnSubmitAuth').disabled = false;
                    }, 1000);
                    return;
                }

                if(isLoginMode) {
                    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
                    if(error) throw error;
                    currentUser = data.user;
                    showToast(t('auth_success_signin'));
                } else {
                    const { data, error } = await _supabase.auth.signUp({ email, password, options: { data: { name } } });
                    if(error) throw error;
                    currentUser = data.user;
                    showToast(t('auth_success_register'));
                }
                updateAuthUI();
            } catch(err) {
                alert(`Autentikasi Gagal:n${err.message}`);
            } finally {
                if(isSupabaseConfigured) {
                    hideLoader();
                    document.getElementById('btnSubmitAuth').disabled = false;
                }
            }
        }

        async function handleLogout() {
            showLoader();
            try {
                if(isSupabaseConfigured) {
                    await _supabase.auth.signOut();
                }
                currentUser = null;
                updateAuthUI();
                showToast(t('auth_success_signout'));
                closeModal('authModal');
            } catch(err) {
                console.error(err);
            } finally {
                hideLoader();
            }
        }

        async function checkSession() {
            if(isSupabaseConfigured) {
                const { data } = await _supabase.auth.getSession();
                currentUser = data.session?.user || null;
            }
            updateAuthUI();
        }

        function updateAuthUI() {
            if(currentUser) {
                document.getElementById('authForm').style.display = 'none';
                document.getElementById('loggedInView').style.display = 'block';
                document.getElementById('authModalTitle').innerText = t('auth_profile_title');
                document.getElementById('loggedInName').innerText = currentUser.user_metadata?.name || t('auth_user_fallback');
                document.getElementById('loggedInEmail').innerText = currentUser.email;
                document.getElementById('userIcon').innerHTML = '<i class="fa-solid fa-user-check"></i>';
            } else {
                document.getElementById('authForm').style.display = 'block';
                document.getElementById('loggedInView').style.display = 'none';
                document.getElementById('authModalTitle').innerText = isLoginMode ? t('auth_signin_title') : t('auth_register_title');
                document.getElementById('userIcon').innerHTML = '<i class="fa-regular fa-user"></i>';
            }
        }

        /* --- 11.6 QUIZ LOGIC --- */
        let quizAnswers = {};
        const startQuiz = () => {
            quizAnswers = {};
            document.getElementById('quizStep1').style.display = 'block';
            document.getElementById('quizStep2').style.display = 'none';
            document.getElementById('quizResultView').style.display = 'none';
            document.getElementById('quizModal').classList.add('active');
            document.getElementById('overlay').classList.add('active');
        };

        const quizNextStep = (answer) => {
            quizAnswers.brew = answer;
            document.getElementById('quizStep1').style.display = 'none';
            document.getElementById('quizStep2').style.display = 'block';
        };

        const quizResult = (answer) => {
            quizAnswers.taste = answer;
            document.getElementById('quizStep2').style.display = 'none';
            document.getElementById('quizResultView').style.display = 'block';

            // Simple recommendation logic
            let recommended = productsDB[0]; // fallback
            if(quizAnswers.brew === 'espresso' || quizAnswers.taste === 'bold') {
                recommended = productsDB.find(p => p.notes?.toLowerCase().includes('chocolate') || p.notes?.toLowerCase().includes('wine')) || productsDB[1] || productsDB[0];
            } else {
                recommended = productsDB.find(p => p.notes?.toLowerCase().includes('fruity')) || productsDB[0];
            }

            const rView = document.getElementById('quizRecommendedProduct');
            if(recommended) {
                rView.innerHTML = `
                    <div style="font-size: 3rem; margin-bottom: 10px; color: var(--accent);"><i class="fa-solid fa-mug-hot"></i></div>
                    <h3 style="margin-bottom: 5px;">${recommended.name}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 15px;">${recommended.notes || t('quiz_notes_fallback')}</p>
                    <button class="btn btn-accent" onclick="closeModal('quizModal'); openProductDetail('${recommended.id}')">Lihat Detail</button>
                `;
            } else {
                rView.innerHTML = '<p>Silakan cek koleksi lengkap kami!</p>';
            }
        };

        
/* --- DYNAMIC SITE SETTINGS BINDING --- */
let globalSiteSettings = {};

async function fetchSiteSettings() {
    if (!isSupabaseConfigured) return;
    try {
        const { data, error } = await _supabase.from('site_settings').select('key,value');
        if (error) throw error;
        
        if (data && data.length > 0) {
            data.forEach(item => {
                globalSiteSettings[item.key] = item.value;
            });
            applySiteSettings();
        }
    } catch (e) {
        console.error("Error fetching site settings:", e);
    }
}

window.applySiteSettings = function() {
    const isEn = getLang() === 'en';
    
    // Apply text content
    document.querySelectorAll('[data-setting]').forEach(el => {
        const key = el.getAttribute('data-setting');
        let val = globalSiteSettings[key];
        
        // Language fallback
        if (isEn && globalSiteSettings[key + '_en']) {
            val = globalSiteSettings[key + '_en'];
        }
        
        if (val !== undefined && val !== null && val !== '') {
            // Some keys are HTML, some are text. We'll use innerHTML to be safe for textareas containing breaks, 
            // but for safety from XSS, this is from admin so it's trusted.
            // If it's an input/textarea, update value
            if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.value = val;
            } else {
                el.innerHTML = val.replace(/\n/g, '<br>');
            }
        }
    });
    
    // Apply images
    document.querySelectorAll('[data-setting-img]').forEach(el => {
        const key = el.getAttribute('data-setting-img');
        const val = globalSiteSettings[key];
        if (val) {
            if (el.tagName === 'IMG') {
                el.src = val;
            } else {
                el.style.backgroundImage = `url('${val}')`;
            }
        }
    });

    // Special handlers
    // Announcement bar color
    const topbar = document.querySelector('.top-banner');
    if (topbar && globalSiteSettings['announcement_color']) {
        topbar.style.backgroundColor = globalSiteSettings['announcement_color'];
    }
    // Announcement bar toggle
    if (topbar && globalSiteSettings['announcement_enabled'] === 'false') {
        topbar.style.display = 'none';
    }
};

        /* --- 12. INITIALIZATION ON LOAD --- */
        document.addEventListener('DOMContentLoaded', () => {
            fetchProducts();
            fetchSiteSettings(); 
            updateCartBadge();
            checkSession();
             
            
        });
    

        /* --- 13. ORDER TRACKING --- */
        async function trackOrder() {
            const input = document.getElementById('trackingOrderId');
            const resultDiv = document.getElementById('trackingResult');
            const errorDiv = document.getElementById('trackingError');
            const btn = document.getElementById('btnTrack');
            
            if (!input || !input.value.trim()) return;
            
            const orderId = input.value.trim();
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;
            resultDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            
            try {
                if(!isSupabaseConfigured) throw new Error("Offline");
                
                const { data, error } = await _supabase
                    .from('orders')
                    .select('*')
                    .eq('id', orderId)
                    .single();
                    
                if (error || !data) throw new Error("Not found");
                
                // Populate UI
                let statusColor = 'var(--text-main)';
                let statusText = (data.status || 'unknown').toUpperCase();
                if(data.status === 'pending') { statusColor = '#f39c12'; statusText = t('track_status_pending'); }
                if(data.status === 'paid') { statusColor = 'var(--success)'; statusText = t('track_status_paid'); }
                if(data.status === 'shipped') { statusColor = 'var(--primary)'; statusText = t('track_status_shipped'); }
                
                document.getElementById('trackStatus').innerText = statusText;
                document.getElementById('trackStatus').style.color = statusColor;
                document.getElementById('trackDate').innerText = new Date(data.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'});
                document.getElementById('trackName').innerText = data.customer_name || '-';
                document.getElementById('trackTotal').innerText = formatRupiah(data.total_price);
                
                const ul = document.getElementById('trackItems');
                ul.innerHTML = '';
                if(data.items && Array.isArray(data.items)) {
                    data.items.forEach(item => {
                        const li = document.createElement('li');
                        li.style.padding = '8px 0';
                        li.style.borderBottom = '1px dashed rgba(0,0,0,0.1)';
                        li.innerHTML = `<strong>${item.qty}x</strong> ${item.name} <span style="float:right;">` + formatRupiah(item.price * item.qty) + `</span>`;
                        ul.appendChild(li);
                    });
                }
                
                resultDiv.style.display = 'block';
            } catch (err) {
                console.error("Tracking Error:", err);
                errorDiv.style.display = 'block';
            } finally {
                btn.innerHTML = t('track_btn');
                btn.disabled = false;
            }
        }

        /* --- 14. CATEGORY FILTERING --- */
        window.filterCategory = function(category) {
            activeCategoryFilter = category;

            // Update pill active states
            document.querySelectorAll('#categoryPills .pill').forEach(pill => {
                pill.classList.toggle('active', pill.dataset.cat === category);
            });

            // Show/hide sections dynamically
            document.querySelectorAll('.produk-category-section').forEach(sec => {
                if (category === 'all') {
                    sec.style.display = 'block';
                } else {
                    const expectedId = 'section-' + category.replace(/\s+/g, '-').toLowerCase();
                    sec.style.display = sec.id === expectedId ? 'block' : 'none';
                }
            });

            // Re-render with filter
            applyFilters();
        };

applyTranslations();
