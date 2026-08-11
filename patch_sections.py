import re

# 1. PATCH produk.html
with open('produk.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# We want to replace the hardcoded sections with <div id="dynamic-product-sections"></div>
# The sections start with <div id="section-minuman" and end before </section> <!-- SECTION: TESTIMONI -->
# Let's use regex to replace it
html_content = re.sub(
    r'<div id="section-minuman" class="produk-category-section">.*?<div class="product-grid" id="grid-roasted"></div>\s*</div>',
    '<div id="dynamic-product-sections"></div>',
    html_content,
    flags=re.DOTALL
)

with open('produk.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# 2. PATCH main.js
with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace renderProducts entirely
old_render = r'function renderProducts\(products\) \{.*?\n    const countElement = document\.getElementById\(\'productCount\'\);\n    if \(countElement\) countElement\.innerText = products\.length;\n\};'

new_render = '''function renderProducts(products) {
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
        const badgeLabel = (product.category && product.category.includes('Roasted')) ? t('produk_badge_roasted') : product.category;
        const pNotes = (getLang() === 'en' && product.notes_en) ? product.notes_en : product.notes;

        let defaultPriceStr = formatRupiah(product.price);
        const hasVariants = product.variants && Array.isArray(product.variants) && product.variants.length > 0;
        if(hasVariants) defaultPriceStr = formatRupiah(product.variants[0].price);

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
};'''

js = re.sub(old_render, new_render, js, flags=re.DOTALL)

# Replace filterCategory entirely
old_filter = r'window\.filterCategory = function\(category\) \{.*?\n            \}\n        \};'
new_filter = '''window.filterCategory = function(category) {
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
        };'''

js = re.sub(old_filter, new_filter, js, flags=re.DOTALL)

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Dynamic sections patched!")
