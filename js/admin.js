const SUPABASE_URL = 'https://gvuzsbrplmgqjuchjcpk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dXpzYnJwbG1ncWp1Y2hqY3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MTE5NDMsImV4cCI6MjA5MTI4Nzk0M30.PowRUwVvHnEKvfBC3jvK5gHUsCACT2ecTJxOAat8qXU';
const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allOrders = [], allProducts = [], filteredOrders = [], filteredProducts = [], siteSettings = [];

/* ==========================================================================
   AUTH
   ========================================================================== */
window.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await _sb.auth.getSession();
    if (session) {
        document.getElementById('loginScreen').style.display = 'none';
        loadDashboard();
    }
    document.getElementById('loginPw').addEventListener('keydown', e => {
        if (e.key === 'Enter') doLogin();
    });
});

async function doLogin() {
    const err = document.getElementById('loginErr');
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPw').value;
    
    err.style.display = 'none';
    
    if (!email || !password) {
        err.textContent = 'Email dan password wajib diisi.';
        err.style.display = 'block';
        return;
    }

    try {
        const { data, error } = await _sb.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        document.getElementById('loginScreen').style.display = 'none';
        loadDashboard();
    } catch (error) {
        err.textContent = error.message || 'Login gagal. Periksa kembali email dan password.';
        err.style.display = 'block';
        setTimeout(() => err.style.display = 'none', 3000);
    }
}

async function doLogout() {
    await _sb.auth.signOut();
    location.reload();
}

/* â•â•â• SIDEBAR MOBILE â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function openSidebar()  { document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebarOverlay').classList.add('open'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarOverlay').classList.remove('open'); }

/* â•â•â• NAVIGATION â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const PAGE_META = {
    dashboard: { title:'Dashboard', sub:'Ringkasan aktivitas toko' },
    orders:    { title:'Manajemen Pesanan', sub:'Kelola semua pesanan pelanggan' },
    products:  { title:'Manajemen Produk', sub:'Tambah, edit, dan hapus produk' },
    settings:  { title:'Tampilan & Konten', sub:'Edit teks, gambar, dan pengumuman website' },
    hpp:       { title:'Kalkulator HPP', sub:'Hitung Harga Pokok Penjualan produk secara detail dan analisis profitabilitas' },
};

function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + name)?.classList.add('active');
    document.getElementById('nav-' + name)?.classList.add('active');
    const m = PAGE_META[name] || {};
    document.getElementById('pageTitle').textContent    = m.title || name;
    document.getElementById('pageSubtitle').textContent = m.sub || '';
    // Topbar action buttons
    document.getElementById('topbarAction').style.display = name === 'products' ? 'flex' : 'none';
    document.getElementById('topbarSave').style.display   = name === 'settings' ? 'flex' : 'none';
    // Load data
    if (name === 'orders')   loadOrders();
    if (name === 'products') loadProducts();
    if (name === 'settings') loadSettings();
    if (name === 'pages')    loadPages();
    if (name === 'hpp')      initHpp();
    closeSidebar();
}

function refreshCurrent() {
    const active = document.querySelector('.page.active')?.id?.replace('page-', '');
    if (active === 'dashboard') loadDashboard();
    if (active === 'orders')    loadOrders();
    if (active === 'products')  loadProducts();
    if (active === 'settings')  loadSettings();
    if (active === 'pages')     loadPages();
    if (active === 'hpp')       { calcBean(); calcDrink(); loadHppAnalysis(); }
    toast('Diperbarui', 'info');
}

/* â•â•â• UTILITIES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const rp = n => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits:0 }).format(n || 0);
const fmtDate = d => d ? new Date(d).toLocaleString('id-ID', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : 'â€”';

function sBadge(s) {
    const lbl = { pending:'Pending', processing:'Diproses', shipped:'Dikirim', delivered:'Terkirim', cancelled:'Dibatalkan' };
    return `<span class="sbadge s-${s || 'pending'}">${lbl[s] || s || 'Pending'}</span>`;
}

function toast(msg, type = 'ok') {
    const icons = { ok:'fa-check-circle', err:'fa-circle-exclamation', info:'fa-circle-info' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<i class="fa-solid ${icons[type] || icons.ok}" style="color:${type==='ok'?'#22C55E':type==='err'?'#EF4444':'#3B82F6'}"></i>${msg}`;
    document.getElementById('toastWrap').appendChild(t);
    setTimeout(() => t.remove(), 3500);
}

/* â•â•â• DASHBOARD â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
async function loadDashboard() {
    try {
        const [{ data: orders }, { data: products }] = await Promise.all([
            _sb.from('orders').select('*').order('created_at', { ascending: false }),
            _sb.from('products').select('*'),
        ]);
        allOrders   = orders   || [];
        allProducts = products || [];

        const pending = allOrders.filter(o => (o.status || 'pending') === 'pending');
        const revenue = allOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total_price || 0), 0);

        document.getElementById('stat-orders').textContent   = allOrders.length;
        document.getElementById('stat-revenue').textContent  = rp(revenue);
        document.getElementById('stat-products').textContent = allProducts.length;
        document.getElementById('stat-pending').textContent  = pending.length;

        updatePendingBadge(pending.length);

        const tbody = document.getElementById('recentBody');
        if (!allOrders.length) {
            tbody.innerHTML = `<tr><td colspan="5"><div class="empty"><i class="fa-solid fa-inbox"></i>Belum ada pesanan</div></td></tr>`;
            return;
        }
        tbody.innerHTML = allOrders.slice(0, 8).map(o => `<tr>
            <td><code style="color:var(--accent);font-size:.76rem;">#${String(o.id).slice(0,8)}</code></td>
            <td style="font-weight:600;">${o.customer_name || 'â€”'}</td>
            <td style="font-weight:700;">${rp(o.total_price)}</td>
            <td>${sBadge(o.status)}</td>
            <td style="color:var(--muted);font-size:.8rem;">${fmtDate(o.created_at)}</td>
        </tr>`).join('');
    } catch (err) {
        toast('Gagal memuat dashboard: ' + err.message, 'err');
    }
}

function updatePendingBadge(n) {
    const b = document.getElementById('pendingBadge');
    b.style.display = n > 0 ? 'inline' : 'none';
    b.textContent = n;
}

/* â•â•â• ORDERS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
async function loadOrders() {
    document.getElementById('ordersBody').innerHTML = `<tr class="ld"><td colspan="9"><i class="fa-solid fa-circle-notch spin"></i> Memuat...</td></tr>`;
    try {
        const { data, error } = await _sb.from('orders').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        allOrders = data || [];
        filteredOrders = [...allOrders];
        renderOrders();
    } catch (err) { toast('Gagal memuat pesanan: ' + err.message, 'err'); }
}

function filterOrders() {
    const q  = document.getElementById('orderSearch').value.toLowerCase();
    const st = document.getElementById('statusFilter').value;
    filteredOrders = allOrders.filter(o =>
        (!q  || (o.customer_name||'').toLowerCase().includes(q) || (o.customer_email||'').toLowerCase().includes(q)) &&
        (!st || (o.status || 'pending') === st)
    );
    renderOrders();
}

function renderOrders() {
    const tbody = document.getElementById('ordersBody');
    if (!filteredOrders.length) {
        tbody.innerHTML = `<tr><td colspan="9"><div class="empty"><i class="fa-solid fa-inbox"></i>Tidak ada pesanan ditemukan</div></td></tr>`;
        return;
    }
    tbody.innerHTML = filteredOrders.map((o, i) => {
        const items = Array.isArray(o.items) ? o.items : [];
        const sum   = items.slice(0,2).map(it => it.name || it.productName || '?').join(', ') + (items.length > 2 ? ` +${items.length-2}` : '');
        const enc   = encodeURIComponent(JSON.stringify(o));
        return `<tr>
            <td style="color:var(--muted);font-size:.8rem;font-weight:700;">${i+1}</td>
            <td><div style="font-weight:600;">${o.customer_name||'â€”'}</div></td>
            <td style="color:var(--muted);font-size:.82rem;">${o.customer_email||'â€”'}</td>
            <td style="font-size:.82rem;">${o.customer_phone||'â€”'}</td>
            <td><div style="font-weight:600;">${escapeHTML(o.customer_name)||'—'}</div></td>
            <td style="color:var(--muted);font-size:.82rem;">${escapeHTML(o.customer_email)||'—'}</td>
            <td style="font-size:.82rem;">${escapeHTML(o.customer_phone)||'—'}</td>
            <td style="font-size:.8rem;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--muted);">${escapeHTML(sum)||'—'}</td>
            <td style="font-weight:700;color:var(--accent);">${rp(o.total_price)}</td>
            <td>
                <select class="st-sel" onchange="updateStatus('${o.id}',this.value)">
                    ${['pending','processing','shipped','delivered','cancelled'].map(s =>
                        `<option value="${s}" ${(o.status||'pending')===s?'selected':''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`
                    ).join('')}
                </select>
            </td>
            <td style="color:var(--muted);font-size:.78rem;white-space:nowrap;">${fmtDate(o.created_at)}</td>
            <td><button class="btn btn-view" onclick="viewOrder('${enc}')"><i class="fa-solid fa-eye"></i></button></td>
        </tr>`;
    }).join('');
    updateSelectAll();
}

async function updateStatus(id, status) {
    try {
        const { error } = await _sb.from('orders').update({ status }).eq('id', id);
        if (error) throw error;
        const o = allOrders.find(x => String(x.id) === String(id));
        if (o) o.status = status;
        updatePendingBadge(allOrders.filter(x => (x.status||'pending') === 'pending').length);
        toast(`Status → ${status}`, 'ok');
    } catch (err) { toast('Gagal update: ' + err.message, 'err'); }
}

function viewOrder(enc) {
    const o = JSON.parse(decodeURIComponent(enc));
    const items = Array.isArray(o.items) ? o.items : [];
    document.getElementById('modalOrderId').textContent = `#${String(o.id).slice(0,8)}`;
    document.getElementById('orderModalBody').innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
            <div>
                <div style="font-size:.72rem;color:var(--muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px;">Pelanggan</div>
                <div style="font-weight:600;">${o.customer_name||'â€”'}</div>
                <div style="font-size:.82rem;color:var(--muted);">${o.customer_email||'â€”'}</div>
                <div style="font-size:.82rem;color:var(--muted);">${o.customer_phone||'â€”'}</div>
            </div>
            <div>
                <div style="font-size:.72rem;color:var(--muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px;">Pesanan</div>
                ${sBadge(o.status)}
                <div style="font-size:.82rem;color:var(--muted);margin-top:6px;">${fmtDate(o.created_at)}</div>
                <div style="font-size:.82rem;color:var(--muted);">Metode: ${o.payment_method||'â€”'}</div>
            </div>
        </div>
        <div style="margin-bottom:16px;">
            <div style="font-size:.72rem;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px;">Item Pesanan</div>
            <ul class="order-items">
                ${items.length ? items.map(it => `
                    <li>
                        <span>${it.name||it.productName||'?'} ${it.variant?`<em style="color:var(--muted)">(${it.variant})</em>`:''} &times; ${it.qty||it.quantity||1}</span>
                        <span style="font-weight:700;">${rp((it.price||0)*(it.qty||it.quantity||1))}</span>
                    </li>`).join('') : '<li style="color:var(--muted);">Tidak ada detail item</li>'}
            </ul>
        </div>
        <div style="background:var(--surface2);border-radius:9px;padding:14px;display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <span style="font-weight:600;">Total Pembayaran</span>
            <span style="font-size:1.2rem;font-weight:800;color:var(--accent);">${rp(o.total_price)}</span>
        </div>
        ${o.customer_phone ? `
        <a href="https://wa.me/${(o.customer_phone||'').replace(/\D/g,'')}?text=Halo%20${encodeURIComponent(o.customer_name||'')}%2C%20pesanan%20Anda%20sudah%20kami%20proses!"
           target="_blank" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:10px;background:rgba(34,197,94,.12);color:#22C55E;border:1px solid rgba(34,197,94,.25);border-radius:8px;font-size:.85rem;font-weight:600;text-decoration:none;">
            <i class="fa-brands fa-whatsapp"></i> Hubungi via WhatsApp
        </a>` : ''}
    `;
    document.getElementById('orderModal').classList.add('open');
}

/* â•â•â• PRODUCTS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
async function loadProducts() {
    document.getElementById('productsBody').innerHTML = `<tr class="ld"><td colspan="9"><i class="fa-solid fa-circle-notch spin"></i> Memuat...</td></tr>`;
    try {
        const { data, error } = await _sb.from('products').select('*').order('category').order('name');
        if (error) throw error;
        allProducts = data || [];
        filteredProducts = [...allProducts];
        renderProducts();
    } catch (err) { toast('Gagal memuat produk: ' + err.message, 'err'); }
}

function filterProducts() {
    const q   = document.getElementById('prodSearch').value.toLowerCase();
    const cat = document.getElementById('catFilter').value;
    filteredProducts = allProducts.filter(p =>
        (!q   || p.name.toLowerCase().includes(q) || (p.notes||'').toLowerCase().includes(q)) &&
        (!cat || p.category === cat)
    );
    renderProducts();
}

function renderProducts() {
    const tbody = document.getElementById('productsBody');
    if (!filteredProducts.length) {
        tbody.innerHTML = `<tr><td colspan="9"><div class="empty"><i class="fa-solid fa-mug-saucer"></i>Tidak ada produk ditemukan</div></td></tr>`;
        return;
    }
    tbody.innerHTML = filteredProducts.map(p => {
        const vr  = Array.isArray(p.variants) ? p.variants : [];
        const col = p.category === 'Roasted Bean' ? 'var(--accent)' : 'var(--accent2)';
        const ini = p.name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
        return `<tr>
            <td style="text-align:center;"><input type="checkbox" class="prod-checkbox" value="${p.id}" onclick="updateSelectAll()"></td>
            <td>
                <div style="display:flex;align-items:center;gap:10px;">
                    ${p.image_icon
                        ? `<img src="${p.image_icon}" alt="${p.name}" style="width:38px;height:38px;border-radius:8px;object-fit:cover;flex-shrink:0;border:1px solid var(--border);" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class='thumb' style='display:none'>${ini}</div>`
                        : `<div class='thumb'>${ini}</div>`}
                    <div><div style="font-weight:600;font-size:.87rem;">${p.name}</div><div style="font-size:.73rem;color:var(--muted);">ID:${p.id}</div></div>
                </div>
            </td>
            <td><span style="font-size:.76rem;font-weight:600;color:${col};background:rgba(255,255,255,.04);padding:3px 8px;border-radius:20px;">${p.category}</span></td>
            <td style="font-weight:700;">${rp(p.price)}</td>
            <td style="font-size:.78rem;color:var(--muted);">${vr.length ? vr.map(v=>v.name).join(', ') : 'â€”'}</td>
            <td><span style="font-weight:600;color:${(p.stock_quantity||0)>10?'#22C55E':'#F59E0B'};">${p.stock_quantity??'â€”'}</span></td>
            <td style="color:var(--accent);">${'â˜…'.repeat(Math.round(p.rating||0))}</td>
            <td style="font-size:.78rem;color:var(--muted);max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.notes||'â€”'}</td>
            <td>
                <div style="display:flex;gap:5px;">
                    <button class="btn btn-edit" onclick="openProductModal(${p.id})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-del"  onclick="deleteProduct(${p.id},'${p.name.replace(/'/g,"\\'")}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');
    updateSelectAll();
}

function openProductModal(id = null) {
    document.getElementById('editId').value = id || '';
    if (id) {
        const p = allProducts.find(x => x.id === id);
        if (!p) return;
        document.getElementById('prodModalTitle').textContent = 'Edit Produk';
        document.getElementById('editName').value     = p.name || '';
        document.getElementById('editCategory').value = p.category || 'Minuman Kopi';
        document.getElementById('editPrice').value    = p.price || '';
        document.getElementById('editStock').value    = p.stock_quantity || '';
        document.getElementById('editNotes').value    = p.notes || '';
        document.getElementById('editDesc').value     = p.description || '';
        document.getElementById('editNotesEn').value  = p.notes_en || '';
        document.getElementById('editDescEn').value   = p.description_en || '';
        document.getElementById('editVariants').value = JSON.stringify(p.variants || [], null, 2);
        // Load existing image
        if (p.image_icon) {
            document.getElementById('editImageUrl').value = p.image_icon;
            document.getElementById('imgPreviewEl').src    = p.image_icon;
            document.getElementById('imgPreviewWrap').style.display = 'block';
            document.getElementById('imgUploadDefault').style.display = 'none';
        } else {
            clearProductImage();
        }
    } else {
        document.getElementById('prodModalTitle').textContent = 'Tambah Produk Baru';
        ['editName','editPrice','editStock','editNotes','editDesc','editNotesEn','editDescEn','editVariants'].forEach(i => document.getElementById(i).value = '');
        clearProductImage();
    }
    document.getElementById('productModal').classList.add('open');
}

async function saveProduct() {
    const id       = document.getElementById('editId').value;
    const name     = document.getElementById('editName').value.trim();
    const category = document.getElementById('editCategory').value;
    const price    = parseInt(document.getElementById('editPrice').value) || 0;
    const stock    = parseInt(document.getElementById('editStock').value) || 0;
    const notes    = document.getElementById('editNotes').value.trim();
    const desc     = document.getElementById('editDesc').value.trim();
    const notes_en = document.getElementById('editNotesEn').value.trim();
    const desc_en  = document.getElementById('editDescEn').value.trim();
    let variants = [];
    try { const raw = document.getElementById('editVariants').value.trim(); variants = raw ? JSON.parse(raw) : []; }
    catch { toast('Format JSON varian tidak valid!', 'err'); return; }
    if (!name) { toast('Nama produk wajib diisi!', 'err'); return; }
    const imageUrl = document.getElementById('editImageUrl').value.trim();
    const payload = { name, category, price, stock_quantity:stock, notes, description:desc, variants, image_icon: imageUrl || null };
    try {
        let error;
        if (id) { ({error} = await _sb.from('products').update(payload).eq('id', id)); }
        else    { ({error} = await _sb.from('products').insert([{...payload, rating:5}])); }
        if (error) throw error;
        toast(id ? 'Produk diperbarui!' : 'Produk ditambahkan!', 'ok');
        closeModal('productModal');
        loadProducts();
    } catch (err) { toast('Gagal simpan: ' + err.message, 'err'); }
}

function toggleAllProducts(cb) {
    const cbs = document.querySelectorAll('.prod-checkbox');
    cbs.forEach(c => c.checked = cb.checked);
    updateSelectAll();
}

function updateSelectAll() {
    const cbs = document.querySelectorAll('.prod-checkbox');
    const checked = document.querySelectorAll('.prod-checkbox:checked');
    const selectAllBtn = document.getElementById('selectAllProducts');
    if(selectAllBtn) selectAllBtn.checked = (cbs.length > 0 && cbs.length === checked.length);
    const count = checked.length;
    const countEl = document.getElementById('selCount');
    if(countEl) countEl.textContent = count;
    
    // Only show if we are on products page
    const pageProducts = document.getElementById('page-products');
    const isProductsPage = pageProducts && pageProducts.classList.contains('active');
    const btn = document.getElementById('btnDeleteSelected');
    if(btn) btn.style.display = (count > 0 && isProductsPage) ? 'inline-flex' : 'none';
}

async function deleteSelectedProducts() {
    const checked = document.querySelectorAll('.prod-checkbox:checked');
    if (checked.length === 0) return;
    if (!confirm(`Hapus ${checked.length} produk terpilih? Tidak dapat dibatalkan.`)) return;
    
    const btn = document.getElementById('btnDeleteSelected');
    btn.innerHTML = '<i class="fa-solid fa-circle-notch spin"></i> Menghapus...';
    btn.disabled = true;

    try {
        const ids = Array.from(checked).map(c => c.value);
        const { error } = await _sb.from('products').delete().in('id', ids);
        if (error) throw error;
        await loadProducts();
        document.getElementById('selectAllProducts').checked = false;
        updateSelectAll();
    } catch (err) {
        console.error('Delete selected error:', err);
        alert('Gagal menghapus produk: ' + err.message);
    } finally {
        btn.innerHTML = '<i class="fa-solid fa-trash"></i> Hapus (<span id="selCount">0</span>)';
        btn.disabled = false;
        updateSelectAll();
    }
}

async function deleteProduct(id, name) {
    if (!confirm(`Hapus produk "${name}"? Tidak dapat dibatalkan.`)) return;
    try {
        const { error } = await _sb.from('products').delete().eq('id', id);
        if (error) throw error;
        toast(`"${name}" dihapus.`, 'ok');
        loadProducts();
    } catch (err) { toast('Gagal hapus: ' + err.message, 'err'); }
}


/* â•â•â• PRODUCT IMAGE UPLOAD â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const STORAGE_BUCKET = 'product-images';

function handleImgDrop(e) {
    e.preventDefault();
    document.getElementById('imgDropZone').classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) uploadProductImage(file);
}

function handleImgSelect(input) {
    const file = input.files[0];
    if (file) uploadProductImage(file);
}

function clearProductImage() {
    document.getElementById('editImageUrl').value      = '';
    document.getElementById('imgPreviewEl').src        = '';
    document.getElementById('imgPreviewWrap').style.display   = 'none';
    document.getElementById('imgUploadDefault').style.display = '';
    document.getElementById('imgProgress').style.display     = 'none';
    document.getElementById('imgProgressBar').style.width    = '0%';
    document.getElementById('imgFileInput').value = '';
}

async function uploadProductImage(file) {
    // Validate
    if (file.size > 5 * 1024 * 1024) { toast('Gambar terlalu besar! Maks. 5 MB.', 'err'); return; }
    const allowed = ['image/jpeg','image/png','image/webp','image/gif'];
    if (!allowed.includes(file.type)) { toast('Format tidak didukung. Gunakan JPG/PNG/WebP.', 'err'); return; }

    // Show progress
    const prog   = document.getElementById('imgProgress');
    const bar    = document.getElementById('imgProgressBar');
    prog.style.display = 'block';
    bar.style.width = '20%';

    try {
        // Unique filename: timestamp + sanitized name
        const ext  = file.name.split('.').pop().toLowerCase();
        const ts   = Date.now();
        const slug = file.name.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 40);
        const path = `products/${ts}_${slug}.${ext}`;

        bar.style.width = '50%';

        const { data: upData, error: upErr } = await _sb.storage
            .from(STORAGE_BUCKET)
            .upload(path, file, { upsert: true, contentType: file.type });

        if (upErr) throw upErr;
        bar.style.width = '80%';

        const { data: urlData } = _sb.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(path);

        const publicUrl = urlData.publicUrl;
        bar.style.width = '100%';

        // Set preview
        document.getElementById('editImageUrl').value             = publicUrl;
        document.getElementById('imgPreviewEl').src               = publicUrl;
        document.getElementById('imgPreviewWrap').style.display   = 'block';
        document.getElementById('imgUploadDefault').style.display = 'none';

        setTimeout(() => { prog.style.display = 'none'; }, 600);
        toast('Gambar berhasil diunggah!', 'ok');

    } catch (err) {
        prog.style.display = 'none';
        bar.style.width = '0%';
        // Fallback: if bucket not found, guide user
        if (err.message && err.message.includes('Bucket not found')) {
            toast('âš ï¸ Bucket belum dibuat. Buat bucket "product-images" di Supabase Storage!', 'err');
        } else {
            toast('Upload gagal: ' + err.message, 'err');
        }
    }
}

/* â•â•â• PAGE VISIBILITY MANAGEMENT â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const PAGE_DEFS = [
    { key:'page_beranda',   name:'Beranda',        url:'index.html',    icon:'fa-house',          color:'rgba(212,175,55,.12)',  colorText:'#D4AF37', desc:'Halaman utama dengan hero slider, quiz kopi, testimoni, dan tentang kami.' },
    { key:'page_produk',    name:'Produk',         url:'produk.html',   icon:'fa-mug-hot',         color:'rgba(22,135,130,.12)', colorText:'#168782', desc:'Katalog produk minuman kopi dan roasted bean dengan filter kategori.' },
    { key:'page_tentang',   name:'Tentang Kami',   url:'tentang.html',  icon:'fa-store',           color:'rgba(59,130,246,.12)', colorText:'#3B82F6', desc:'Profil perusahaan, visi misi, dan anggota tim Biosphere Roast Works.' },
    { key:'page_roasting',  name:'Proses Sangrai', url:'roasting.html', icon:'fa-fire-flame-curved',color:'rgba(249,115,22,.12)',colorText:'#F97316', desc:'Penjelasan filosofi dan tahapan proses sangrai kopi kami.' },
    { key:'page_blog',      name:'Blog',           url:'blog.html',     icon:'fa-newspaper',       color:'rgba(168,85,247,.12)', colorText:'#A855F7', desc:'Artikel dan tips seputar dunia kopi dari tim Biosphere.' },
    { key:'page_tracking',  name:'Lacak Pesanan',  url:'tracking.html', icon:'fa-truck-fast',      color:'rgba(34,197,94,.12)', colorText:'#22C55E', desc:'Halaman pelacakan status dan riwayat pesanan pelanggan.' },
    { key:'page_kontak',    name:'Kontak',         url:'kontak.html',   icon:'fa-phone',           color:'rgba(239,68,68,.12)', colorText:'#EF4444', desc:'Formulir kontak, nomor WhatsApp, alamat, dan peta lokasi.' },
];

let pageStates = {}; // key â†’ 'true'/'false'

async function loadPages() {
    const grid = document.getElementById('pagesGrid');
    grid.innerHTML = `<div style="text-align:center;padding:40px;color:var(--muted);"><i class="fa-solid fa-circle-notch spin"></i> Memuat...</div>`;
    try {
        const { data, error } = await _sb.from('site_settings')
            .select('key,value')
            .in('key', PAGE_DEFS.map(p => p.key));
        if (error) throw error;

        // Build state map, default = true (active)
        pageStates = {};
        PAGE_DEFS.forEach(p => { pageStates[p.key] = 'true'; });
        (data || []).forEach(row => { pageStates[row.key] = row.value; });

        renderPages();
    } catch (err) {
        grid.innerHTML = `<div class="empty"><i class="fa-solid fa-triangle-exclamation"></i>Gagal memuat: ${err.message}</div>`;
    }
}

function renderPages() {
    const grid = document.getElementById('pagesGrid');
    grid.innerHTML = `<div class="pages-grid">${PAGE_DEFS.map(p => {
        const isActive = pageStates[p.key] !== 'false';
        return `
        <div class="page-card ${isActive ? 'card-active' : 'card-offline'}" id="card_${p.key}">
            <div class="page-card-top"></div>
            <div class="page-card-body">
                <div class="page-card-header">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div class="page-card-icon" style="background:${p.color};color:${p.colorText};">
                            <i class="fa-solid ${p.icon}"></i>
                        </div>
                        <div>
                            <div class="page-card-name">${p.name}</div>
                            <div class="page-card-url">/${p.url}</div>
                        </div>
                    </div>
                    <label class="toggle">
                        <input type="checkbox" ${isActive ? 'checked' : ''} onchange="togglePage('${p.key}', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="page-card-desc">${p.desc}</div>
                <div class="page-card-footer">
                    <span class="status-pill ${isActive ? 'online' : 'offline'}">
                        ${isActive ? 'â— Aktif' : 'â— Maintenance'}
                    </span>
                    <a href="${p.url}" target="_blank" class="page-open-link">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i> Buka
                    </a>
                </div>
            </div>
        </div>`;
    }).join('')}</div>`;
}

async function togglePage(key, isActive) {
    const value = isActive ? 'true' : 'false';
    pageStates[key] = value;

    // Optimistic UI update
    const card = document.getElementById('card_' + key);
    if (card) {
        card.className = 'page-card ' + (isActive ? 'card-active' : 'card-offline');
        const pill = card.querySelector('.status-pill');
        if (pill) {
            pill.className = 'status-pill ' + (isActive ? 'online' : 'offline');
            pill.textContent = isActive ? 'â— Aktif' : 'â— Maintenance';
        }
    }

    try {
        const { error } = await _sb.from('site_settings').upsert(
            [{ key, value, type:'boolean', label: PAGE_DEFS.find(p=>p.key===key)?.name + ' â€” Status Aktif', section:'pages', updated_at: new Date().toISOString() }],
            { onConflict:'key' }
        );
        if (error) throw error;
        const def = PAGE_DEFS.find(p => p.key === key);
        toast(`${def?.name} â†’ ${isActive ? 'âœ… Aktif' : 'ðŸ”´ Maintenance'}`, isActive ? 'ok' : 'info');
    } catch (err) {
        // Revert
        pageStates[key] = isActive ? 'false' : 'true';
        renderPages();
        toast('Gagal mengubah status: ' + err.message, 'err');
    }
}
/* â•â•â• SETTINGS / TAMPILAN â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
async function loadSettings() {
    document.getElementById('settingsContainer').innerHTML =
        `<div style="text-align:center;padding:50px;color:var(--muted);"><i class="fa-solid fa-circle-notch spin"></i> Memuat pengaturan...</div>`;
    try {
        const { data, error } = await _sb.from('site_settings').select('*').order('section').order('key');
        if (error) throw error;
        siteSettings = data || [];
        renderSettings();
    } catch (err) {
        document.getElementById('settingsContainer').innerHTML =
            `<div class="empty"><i class="fa-solid fa-triangle-exclamation"></i>Gagal memuat: ${err.message}<br><small style="font-size:.8rem;">Pastikan tabel site_settings sudah dibuat di Supabase.</small></div>`;
    }
}

const SECTION_ICON = {
    global:'fa-globe',
    hero:'fa-image',
    announcement:'fa-bullhorn',
    produk:'fa-mug-hot',
    tentang:'fa-store',
    roasting:'fa-fire-flame-curved',
    testimoni:'fa-quote-left',
    blog:'fa-newspaper',
    kontak:'fa-phone',
    footer:'fa-rectangle-ad',
    checkout:'fa-cart-shopping',
    '':'fa-gear'
};
const SECTION_LABEL = {
    global:'Global â€” Nama & Social Media',
    hero:'Beranda â€” Hero Slider',
    announcement:'Bar Pengumuman (Promo)',
    produk:'Halaman Produk',
    tentang:'Halaman Tentang Kami & Tim',
    roasting:'Halaman Proses Sangrai',
    testimoni:'Testimoni Pelanggan',
    blog:'Halaman Blog',
    kontak:'Halaman Kontak & Maps',
    footer:'Footer & SEO',
    checkout:'Pengaturan Checkout & Order'
};

function renderSettings() {
    if (!siteSettings.length) {
        document.getElementById('settingsContainer').innerHTML =
            `<div class="empty"><i class="fa-solid fa-gear"></i>Belum ada data pengaturan.<br>
            <small>Jalankan file <strong>site_settings_setup.sql</strong> di Supabase SQL Editor terlebih dahulu.</small></div>`;
        return;
    }
    const groups = {};
    siteSettings.forEach(s => { const sec = s.section || ''; if (!groups[sec]) groups[sec] = []; groups[sec].push(s); });

    let html = '';
    for (const [sec, items] of Object.entries(groups)) {
        const icon  = SECTION_ICON[sec] || 'fa-gear';
        const label = SECTION_LABEL[sec] || (sec ? sec.charAt(0).toUpperCase()+sec.slice(1) : 'Lainnya');
        html += `<div class="settings-section">
            <div class="settings-section-title"><i class="fa-solid ${icon}"></i>${label}</div>
            <div class="settings-grid">`;

        items.forEach(item => {
            html += `<div class="setting-item">
                <label>${item.label || item.key}</label>`;
            if (item.type === 'textarea') {
                html += `<textarea class="fi" id="s_${item.key}" rows="3">${escHtml(item.value||'')}</textarea>`;
            } else if (item.type === 'boolean') {
                html += `<select class="fi" id="s_${item.key}">
                    <option value="true"  ${item.value==='true' ?'selected':''}>âœ… Aktif</option>
                    <option value="false" ${item.value!=='true'?'selected':''}>âŒ Nonaktif</option>
                </select>`;
            } else if (item.type === 'color') {
                html += `<div style="display:flex;gap:8px;align-items:center;">
                    <input type="color" id="s_${item.key}" value="${item.value||'#000000'}" style="width:40px;height:36px;padding:2px;border:1px solid var(--border);border-radius:6px;background:transparent;cursor:pointer;" onchange="document.getElementById('s_${item.key}_txt').value=this.value">
                    <input type="text" id="s_${item.key}_txt" class="fi" style="flex:1;" value="${item.value||'#000000'}" onchange="document.getElementById('s_${item.key}').value=this.value">
                </div>`;
            } else if (item.type === 'image_url') {
                const hasImg = !!item.value;
                html += `<div class="img-field-wrap">
                    <input type="text" class="fi" id="s_${item.key}" value="${escHtml(item.value||'')}" placeholder="https://... atau klik Upload" oninput="updateImgPreview('${item.key}',this.value)">
                    <button class="btn-upload-mini" onclick="openContentUpload('${item.key}')">
                        <i class="fa-solid fa-cloud-arrow-up"></i> Upload
                    </button>
                </div>`;
                html += `<div class="image-preview" id="prev_${item.key}" style="${hasImg?'':'display:none;'}">
                    <img src="${escHtml(item.value||'')}" onerror="this.parentElement.style.display='none'" alt="Preview" style="height:110px;object-fit:cover;width:100%;">
                    <button class="image-preview-del" onclick="clearSettingImage('${item.key}')" title="Hapus gambar"><i class="fa-solid fa-xmark"></i></button>
                </div>`;
            } else {
                html += `<input type="text" class="fi" id="s_${item.key}" value="${escHtml(item.value||'')}">`;
            }
            html += `</div>`;
        });
        html += `</div></div>`;
    }
    document.getElementById('settingsContainer').innerHTML = html;
}

function updateImgPreview(key, url) {
    const prev = document.getElementById('prev_' + key);
    if (!prev) return;
    if (url) {
        prev.style.display = '';
        const img = prev.querySelector('img');
        if (img) { img.src = url; img.style.display = ''; img.onerror = () => prev.style.display = 'none'; }
    } else {
        prev.style.display = 'none';
    }
}

function escHtml(s) { return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

async function saveSettings() {
    const btn = document.getElementById('topbarSave');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch spin"></i> Menyimpan...';
    try {
        const updates = siteSettings.map(item => {
            const el = document.getElementById('s_' + item.key);
            const val = el ? el.value : (item.value || '');
            item.value = val;
            return { key: item.key, value: val, type: item.type, label: item.label, section: item.section, updated_at: new Date().toISOString() };
        });
        const { error } = await _sb.from('site_settings').upsert(updates, { onConflict: 'key' });
        if (error) throw error;
        toast('Pengaturan berhasil disimpan!', 'ok');
        renderSettings(); // refresh previews
    } catch (err) {
        toast('Gagal menyimpan: ' + err.message, 'err');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan';
    }
}

/* â•â•â• MODALS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-bg').forEach(m => m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); }));
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.modal-bg.open').forEach(m => m.classList.remove('open')); });

/* â•â•â• CONTENT IMAGE UPLOAD (site_settings image_url fields) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const CONTENT_BUCKET = 'content-images';
let _cntTargetKey   = null;   // which setting key is being edited
let _cntUploadedUrl = '';     // URL after successful upload

function openContentUpload(key) {
    _cntTargetKey = key;
    // Pre-fill with existing value
    const existing = document.getElementById('s_' + key)?.value || '';
    _cntUploadedUrl = existing;
    document.getElementById('cntUrlInput').value  = existing;
    document.getElementById('cntApplyBtn').disabled = !existing;
    // Show preview if existing
    const prev = document.getElementById('cntPreview');
    const img  = document.getElementById('cntPreviewImg');
    if (existing) {
        img.src = existing;
        prev.style.display = '';
        document.getElementById('cntDropDefault').style.display = 'none';
    } else {
        clearCntUpload();
    }
    document.getElementById('cntProgress').style.display     = 'none';
    document.getElementById('cntProgressBar').style.width    = '0%';
    document.getElementById('cntFileInput').value = '';
    // Set modal title based on setting label
    const s = siteSettings.find(x => x.key === key);
    document.getElementById('uploadModalTitle').innerHTML =
        `<i class="fa-solid fa-cloud-arrow-up" style="color:var(--accent);margin-right:7px;"></i>Upload â€” ${s?.label || key}`;
    document.getElementById('contentUploadModal').classList.add('open');
}

function closeContentUpload() {
    document.getElementById('contentUploadModal').classList.remove('open');
    _cntTargetKey = null;
    _cntUploadedUrl = '';
}

function clearCntUpload() {
    _cntUploadedUrl = '';
    document.getElementById('cntPreview').style.display = 'none';
    document.getElementById('cntPreviewImg').src = '';
    document.getElementById('cntDropDefault').style.display = '';
    document.getElementById('cntFileInput').value = '';
    document.getElementById('cntUrlInput').value  = '';
    document.getElementById('cntApplyBtn').disabled = true;
}

function onCntUrlChange(url) {
    _cntUploadedUrl = url;
    document.getElementById('cntApplyBtn').disabled = !url;
    if (url) {
        document.getElementById('cntPreviewImg').src = url;
        document.getElementById('cntPreview').style.display = '';
        document.getElementById('cntDropDefault').style.display = 'none';
        document.getElementById('cntPreviewImg').onerror = () => {
            document.getElementById('cntPreview').style.display = 'none';
        };
    } else {
        document.getElementById('cntPreview').style.display = 'none';
        document.getElementById('cntDropDefault').style.display = '';
    }
}

function handleCntDrop(e) {
    e.preventDefault();
    document.getElementById('cntDropZone').classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) uploadContentImage(file);
}

function handleCntSelect(input) {
    const file = input.files[0];
    if (file) uploadContentImage(file);
}

async function uploadContentImage(file) {
    if (file.size > 5 * 1024 * 1024) { toast('Gambar terlalu besar! Maks. 5 MB.', 'err'); return; }
    const allowed = ['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'];
    if (!allowed.includes(file.type)) { toast('Format tidak didukung. Gunakan JPG/PNG/WebP/GIF.', 'err'); return; }

    const prog = document.getElementById('cntProgress');
    const bar  = document.getElementById('cntProgressBar');
    prog.style.display = 'block';
    bar.style.width    = '15%';
    document.getElementById('cntDropDefault').style.display = 'none';
    document.getElementById('cntApplyBtn').disabled = true;

    try {
        const ext  = file.name.split('.').pop().toLowerCase().replace('jpeg','jpg');
        const ts   = Date.now();
        const slug = (_cntTargetKey || 'img').replace(/[^a-z0-9_]/gi,'_').toLowerCase();
        const path = `${slug}/${ts}.${ext}`;

        bar.style.width = '45%';

        const { error: upErr } = await _sb.storage
            .from(CONTENT_BUCKET)
            .upload(path, file, { upsert: true, contentType: file.type });

        if (upErr) throw upErr;
        bar.style.width = '80%';

        const { data: urlData } = _sb.storage.from(CONTENT_BUCKET).getPublicUrl(path);
        _cntUploadedUrl = urlData.publicUrl;

        bar.style.width = '100%';
        setTimeout(() => { prog.style.display = 'none'; }, 500);

        // Show preview inside modal
        const prevEl = document.getElementById('cntPreview');
        const imgEl  = document.getElementById('cntPreviewImg');
        imgEl.src = _cntUploadedUrl;
        prevEl.style.display = '';
        document.getElementById('cntUrlInput').value = _cntUploadedUrl;
        document.getElementById('cntApplyBtn').disabled = false;
        toast('Gambar berhasil diunggah!', 'ok');

    } catch (err) {
        prog.style.display = 'none';
        bar.style.width = '0%';
        document.getElementById('cntDropDefault').style.display = '';
        if (err.message?.includes('Bucket not found')) {
            toast('âš ï¸ Bucket "content-images" belum dibuat di Supabase Storage!', 'err');
        } else {
            toast('Upload gagal: ' + err.message, 'err');
        }
    }
}

function applyCntImage() {
    if (!_cntTargetKey || !_cntUploadedUrl) return;
    // Apply to the setting input
    const input = document.getElementById('s_' + _cntTargetKey);
    if (input) {
        input.value = _cntUploadedUrl;
        updateImgPreview(_cntTargetKey, _cntUploadedUrl);
    }
    // Update local siteSettings model
    const s = siteSettings.find(x => x.key === _cntTargetKey);
    if (s) s.value = _cntUploadedUrl;
    toast('Gambar diterapkan! Klik Simpan Perubahan untuk menyimpan.', 'info');
    closeContentUpload();
}

function clearSettingImage(key) {
    const input = document.getElementById('s_' + key);
    if (input) input.value = '';
    updateImgPreview(key, '');
    const s = siteSettings.find(x => x.key === key);
    if (s) s.value = '';
}

// Close upload modal on backdrop click
document.getElementById('contentUploadModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeContentUpload();
});

/* â•â•â• HPP CALCULATOR â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function switchHppTab(name, btn) {
    document.querySelectorAll('.hpp-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.hpp-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('hpp-' + name).classList.add('active');
    if (name === 'analysis') loadHppAnalysis();
}

function initHpp() { calcBean(); calcDrink(); }

/* â”€â”€ ROASTED BEAN â”€â”€ */
function calcBean() {
    const greenPrice  = parseFloat(document.getElementById('b-green-price').value)  || 0;
    const greenWeight = parseFloat(document.getElementById('b-green-weight').value) || 1;
    const shrinkPct   = parseFloat(document.getElementById('b-shrink').value)       || 18;
    const unitSize    = parseFloat(document.getElementById('b-unit-size').value)    || 100;
    const energy      = parseFloat(document.getElementById('b-energy').value)       || 0;
    const labor       = parseFloat(document.getElementById('b-labor').value)        || 0;
    const packPerUnit = parseFloat(document.getElementById('b-pack').value)         || 0;
    const overhead    = parseFloat(document.getElementById('b-overhead').value)     || 0;
    const misc        = parseFloat(document.getElementById('b-misc').value)         || 0;
    const targetMargin= parseFloat(document.getElementById('b-margin').value)       || 35;
    const sellPrice   = parseFloat(document.getElementById('b-sell-price').value)   || 0;

    // Derived
    const roastedKg   = greenWeight * (1 - shrinkPct / 100);          // kg after roasting
    const unitsPerBatch = Math.floor((roastedKg * 1000) / unitSize);  // number of units

    if (unitsPerBatch <= 0) return;

    // Total batch costs
    const rawCost      = greenPrice * greenWeight;
    const batchOps     = energy + labor + overhead + misc;
    const packTotal    = packPerUnit * unitsPerBatch;
    const totalCost    = rawCost + batchOps + packTotal;

    // Per unit
    const hppPerUnit   = totalCost / unitsPerBatch;
    const hppPerKg     = totalCost / roastedKg;
    const minSellPrice = hppPerUnit / (1 - targetMargin / 100);
    const actualMargin = sellPrice > 0 ? ((sellPrice - hppPerUnit) / sellPrice * 100) : 0;
    const profitPerUnit = sellPrice - hppPerUnit;

    // Update result cards
    setEl('br-hpp-unit',  rp(hppPerUnit));
    setEl('br-harga-jual', rp(minSellPrice));
    setEl('br-hpp-kg',    rp(hppPerKg));
    setEl('br-output',    unitsPerBatch + ' unit');
    setEl('br-margin',    (sellPrice > 0 ? actualMargin.toFixed(1) : targetMargin.toFixed(1)) + '%');

    // Breakdown
    const rows = [
        { label:'Green Bean', val: rawCost, icon:'fa-seedling', color:'#168782' },
        { label:'Gas / Listrik', val: energy, icon:'fa-fire-burner', color:'#F97316' },
        { label:'Tenaga Kerja', val: labor, icon:'fa-person-digging', color:'#3B82F6' },
        { label:'Kemasan', val: packTotal, icon:'fa-box', color:'#A855F7' },
        { label:'Overhead', val: overhead, icon:'fa-building', color:'#F59E0B' },
        { label:'Lain-lain', val: misc, icon:'fa-ellipsis', color:'#7A8599' },
    ];
    const total = rows.reduce((s, r) => s + r.val, 0);
    const tbody = document.getElementById('beanBreakdownBody');
    tbody.innerHTML = rows.map(r => {
        const pct = total > 0 ? (r.val / total * 100).toFixed(1) : 0;
        return `<tr>
            <td><i class="fa-solid ${r.icon}" style="color:${r.color};margin-right:7px;"></i>${r.label}</td>
            <td style="text-align:right;font-weight:600;">${rp(r.val)}</td>
            <td style="text-align:right;min-width:80px;">
                <span style="color:var(--muted);">${pct}%</span>
                <div class="hpp-pct-bar"><div class="hpp-pct-fill" style="width:${pct}%;background:${r.color};"></div></div>
            </td>
        </tr>`;
    }).join('') + `<tr><td><strong>TOTAL BIAYA BATCH</strong></td><td style="text-align:right;font-weight:800;">${rp(total)}</td><td></td></tr>`;

    // Simulation
    const simCups = [10, 25, 50, 100];
    document.getElementById('beanSimBox').innerHTML = `
        <div style="margin-bottom:10px;font-size:.78rem;color:var(--muted);">Simulasi keuntungan jika terjual dengan harga <strong style="color:var(--accent);">${rp(sellPrice)}</strong>/unit:</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        ${simCups.map(n => `
            <div style="background:var(--surface2);border-radius:9px;padding:12px;border:1px solid var(--border);">
                <div style="font-size:.72rem;color:var(--muted);margin-bottom:3px;">Jual ${n} unit</div>
                <div style="font-weight:800;color:${n * profitPerUnit >= 0 ? '#22C55E' : '#EF4444'};">${rp(n * profitPerUnit)}</div>
            </div>`).join('')}
        </div>
    `;

    // Recommendations
    const marginStatus = actualMargin >= 35 ? 'âœ… Sehat' : actualMargin >= 20 ? 'âš ï¸ Tipis' : 'ðŸ”´ Rugi';
    document.getElementById('beanRecommend').innerHTML = `
        <div style="margin-bottom:12px;padding:12px;background:rgba(212,175,55,.07);border-radius:9px;border:1px solid rgba(212,175,55,.2);">
            <div style="font-size:.75rem;color:var(--muted);margin-bottom:4px;">Harga Jual Rekomendasi (margin ${targetMargin}%)</div>
            <div style="font-size:1.3rem;font-weight:800;color:var(--accent);">${rp(minSellPrice)}</div>
        </div>
        <div style="font-size:.83rem;color:var(--muted);line-height:1.7;">
            <div>ðŸ“¦ Output per batch: <strong style="color:var(--text);">${unitsPerBatch} unit Ã— ${unitSize}g</strong></div>
            <div>âš–ï¸ Berat hasil roasting: <strong style="color:var(--text);">${roastedKg.toFixed(2)} kg</strong></div>
            <div>ðŸ“Š Margin aktual: <strong style="color:var(--text);">${actualMargin.toFixed(1)}% ${marginStatus}</strong></div>
            <div>ðŸ’° Profit per unit: <strong style="color:${profitPerUnit >= 0 ? '#22C55E' : '#EF4444'};">${rp(profitPerUnit)}</strong></div>
        </div>
    `;
}

/* â”€â”€ MINUMAN KOPI â”€â”€ */
function calcDrink() {
    const coffeeGram  = parseFloat(document.getElementById('d-coffee-gram').value)       || 0;
    const coffeePrice = parseFloat(document.getElementById('d-coffee-price-gram').value) || 0;
    const milkMl      = parseFloat(document.getElementById('d-milk-ml').value)           || 0;
    const milkPrice   = parseFloat(document.getElementById('d-milk-price-ml').value)     || 0;
    const sugarGram   = parseFloat(document.getElementById('d-sugar-gram').value)        || 0;
    const sugarPrice  = parseFloat(document.getElementById('d-sugar-price').value)       || 0;
    const ice         = parseFloat(document.getElementById('d-ice').value)               || 0;
    const extra       = parseFloat(document.getElementById('d-extra').value)             || 0;
    const pack        = parseFloat(document.getElementById('d-pack').value)              || 0;
    const energy      = parseFloat(document.getElementById('d-energy').value)            || 0;
    const labor       = parseFloat(document.getElementById('d-labor').value)             || 0;
    const overhead    = parseFloat(document.getElementById('d-overhead').value)          || 0;
    const targetMargin= parseFloat(document.getElementById('d-margin').value)            || 40;
    const sellPrice   = parseFloat(document.getElementById('d-sell-price').value)        || 0;

    const coffeeCost = coffeeGram * coffeePrice;
    const milkCost   = milkMl    * milkPrice;
    const sugarCost  = sugarGram * sugarPrice;
    const bahanTotal = coffeeCost + milkCost + sugarCost + ice + extra;
    const opsTotal   = pack + energy + labor + overhead;
    const hpp        = bahanTotal + opsTotal;

    const minSell    = hpp / (1 - targetMargin / 100);
    const margin     = sellPrice > 0 ? ((sellPrice - hpp) / sellPrice * 100) : 0;
    const profit     = sellPrice - hpp;

    setEl('dr-hpp',    rp(hpp));
    setEl('dr-jual',   rp(minSell));
    setEl('dr-bahan',  rp(bahanTotal));
    setEl('dr-ops',    rp(opsTotal));
    setEl('dr-margin', (sellPrice > 0 ? margin.toFixed(1) : targetMargin.toFixed(1)) + '%');

    const rows = [
        { label:'Kopi', val: coffeeCost, icon:'fa-seedling', color:'#168782' },
        { label:'Susu / Creamer', val: milkCost, icon:'fa-droplet', color:'#3B82F6' },
        { label:'Gula / Sirup', val: sugarCost, icon:'fa-candy-cane', color:'#EC4899' },
        { label:'Es / Air', val: ice, icon:'fa-snowflake', color:'#60A5FA' },
        { label:'Bahan Tambahan', val: extra, icon:'fa-plus', color:'#A855F7' },
        { label:'Kemasan', val: pack, icon:'fa-box', color:'#F59E0B' },
        { label:'Listrik / Gas', val: energy, icon:'fa-bolt', color:'#F97316' },
        { label:'Tenaga Kerja', val: labor, icon:'fa-person', color:'#22C55E' },
        { label:'Overhead', val: overhead, icon:'fa-building', color:'#7A8599' },
    ];
    const total = rows.reduce((s, r) => s + r.val, 0);
    const tbody = document.getElementById('drinkBreakdownBody');
    tbody.innerHTML = rows.map(r => {
        const pct = total > 0 ? (r.val / total * 100).toFixed(1) : 0;
        return `<tr>
            <td><i class="fa-solid ${r.icon}" style="color:${r.color};margin-right:7px;"></i>${r.label}</td>
            <td style="text-align:right;font-weight:600;">${rp(r.val)}</td>
            <td style="text-align:right;min-width:80px;">
                <span style="color:var(--muted);">${pct}%</span>
                <div class="hpp-pct-bar"><div class="hpp-pct-fill" style="width:${pct}%;background:${r.color};"></div></div>
            </td>
        </tr>`;
    }).join('') + `<tr><td><strong>HPP PER CUP</strong></td><td style="text-align:right;font-weight:800;">${rp(total)}</td><td></td></tr>`;

    // Daily simulation
    const simQty = [20, 50, 100, 200];
    document.getElementById('drinkSimBox').innerHTML = `
        <div style="margin-bottom:10px;font-size:.78rem;color:var(--muted);">Simulasi keuntungan harian di harga <strong style="color:var(--accent);">${rp(sellPrice)}</strong>/cup:</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        ${simQty.map(n => `
            <div style="background:var(--surface2);border-radius:9px;padding:12px;border:1px solid var(--border);">
                <div style="font-size:.72rem;color:var(--muted);margin-bottom:3px;">${n} cup/hari</div>
                <div style="font-weight:800;color:${n * profit >= 0 ? '#22C55E' : '#EF4444'};">${rp(n * profit)}/hari</div>
            </div>`).join('')}
        </div>
    `;

    const marginStatus = margin >= 40 ? 'âœ… Sehat' : margin >= 25 ? 'âš ï¸ Tipis' : 'ðŸ”´ Rugi';
    document.getElementById('drinkRecommend').innerHTML = `
        <div style="margin-bottom:12px;padding:12px;background:rgba(212,175,55,.07);border-radius:9px;border:1px solid rgba(212,175,55,.2);">
            <div style="font-size:.75rem;color:var(--muted);margin-bottom:4px;">Harga Jual Rekomendasi (margin ${targetMargin}%)</div>
            <div style="font-size:1.3rem;font-weight:800;color:var(--accent);">${rp(minSell)}</div>
        </div>
        <div style="font-size:.83rem;color:var(--muted);line-height:1.7;">
            <div>â˜• Biaya bahan: <strong style="color:var(--text);">${rp(bahanTotal)}</strong></div>
            <div>âš™ï¸ Biaya operasional: <strong style="color:var(--text);">${rp(opsTotal)}</strong></div>
            <div>ðŸ“Š Margin aktual: <strong style="color:var(--text);">${margin.toFixed(1)}% ${marginStatus}</strong></div>
            <div>ðŸ’° Profit per cup: <strong style="color:${profit >= 0 ? '#22C55E' : '#EF4444'};">${rp(profit)}</strong></div>
        </div>
    `;
}

/* â”€â”€ PRODUCT ANALYSIS â”€â”€ */
async function loadHppAnalysis() {
    const tbody = document.getElementById('hppAnalysisBody');
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted);"><i class="fa-solid fa-circle-notch spin"></i> Memuat...</td></tr>`;
    try {
        const { data, error } = await _sb.from('products').select('id,name,category,price,stock_quantity').order('category').order('name');
        if (error) throw error;
        if (!data?.length) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted);">Belum ada produk.</td></tr>`;
            return;
        }
        tbody.innerHTML = data.map(p => {
            const catColor = p.category === 'Roasted Bean' ? 'var(--accent)' : 'var(--accent2)';
            const inputId = 'hpp_input_' + p.id;
            return `<tr id="hpprow_${p.id}">
                <td style="font-weight:600;">${p.name}</td>
                <td><span style="font-size:.74rem;font-weight:600;color:${catColor};background:rgba(255,255,255,.04);padding:2px 8px;border-radius:20px;">${p.category}</span></td>
                <td style="font-weight:700;">${rp(p.price)}</td>
                <td>
                    <div class="hpp-input-wrap">
                        <span class="hpp-prefix">Rp</span>
                        <input type="number" class="hpp-input" id="${inputId}" placeholder="Masukkan HPP..." style="width:130px;" oninput="updateHppRow(${p.id},${p.price},this.value)">
                    </div>
                </td>
                <td id="hpp_margin_${p.id}" style="color:var(--muted);">â€”</td>
                <td id="hpp_profit_${p.id}" style="color:var(--muted);">â€”</td>
                <td id="hpp_status_${p.id}">â€”</td>
            </tr>`;
        }).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--danger);">Error: ${err.message}</td></tr>`;
    }
}

function updateHppRow(id, sellPrice, hppVal) {
    const hpp = parseFloat(hppVal) || 0;
    if (!hpp) {
        document.getElementById('hpp_margin_' + id).innerHTML = 'â€”';
        document.getElementById('hpp_profit_' + id).innerHTML = 'â€”';
        document.getElementById('hpp_status_' + id).innerHTML = 'â€”';
        return;
    }
    const margin = ((sellPrice - hpp) / sellPrice * 100);
    const profit = sellPrice - hpp;
    const marginClass = margin >= 35 ? 'margin-good' : margin >= 20 ? 'margin-warn' : 'margin-bad';
    const statusText  = margin >= 35 ? 'âœ… Sehat' : margin >= 20 ? 'âš ï¸ Tipis' : margin > 0 ? 'ðŸ”´ Sangat Tipis' : 'ðŸ’¸ Rugi';
    document.getElementById('hpp_margin_' + id).innerHTML = `<span class="margin-badge ${marginClass}">${margin.toFixed(1)}%</span>`;
    document.getElementById('hpp_profit_' + id).innerHTML = `<span style="font-weight:700;color:${profit >= 0 ? '#22C55E' : '#EF4444'};">${rp(profit)}</span>`;
    document.getElementById('hpp_status_' + id).innerHTML = `<span style="font-size:.82rem;">${statusText}</span>`;
}

function setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}


    /* --- CONTACTS / INBOX --- */
    async function loadContacts() {
        if (!isLoggedIn) return;
        try {
            const { data, error } = await _sb.from('contacts').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            
            const tbody = document.getElementById('contactsTableBody');
            const badge = document.getElementById('contactsBadge');
            
            if (data && data.length > 0) {
                badge.style.display = 'inline-block';
                badge.innerText = data.length;
                
                let html = '';
                data.forEach(c => {
                    const d = new Date(c.created_at).toLocaleString('id-ID');
                    html += `
                        <tr>
                            <td style='white-space:nowrap;font-size:0.75rem;'>${d}</td>
                            <td style='font-weight:600;'>${escapeHTML(c.nama)}</td>
                            <td><a href='mailto:${escapeHTML(c.email)}' style='color:var(--info); text-decoration:none;'>${escapeHTML(c.email)}</a></td>
                            <td style='max-width:300px; white-space:pre-wrap;'>${escapeHTML(c.pesan)}</td>
                            <td style='text-align:right;'>
                                <button class='btn btn-del' onclick="deleteContact('${c.id}')"><i class='fa-solid fa-trash'></i></button>
                            </td>
                        </tr>
                    `;
                });
                tbody.innerHTML = html;
            } else {
                badge.style.display = 'none';
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);">Belum ada pesan.</td></tr>';
            }
        } catch (err) {
            console.error("Error loadContacts:", err);
        }
    }

    async function deleteContact(id) {
        if(!confirm('Hapus pesan ini secara permanen?')) return;
        try {
            const { error } = await _sb.from('contacts').delete().eq('id', id);
            if (error) throw error;
            loadContacts();
        } catch (err) {
            console.error("Error deleteContact:", err);
            alert("Gagal menghapus pesan: " + err.message);
        }
    }

    // Hook into initial load
    const _originalInitAdmin = initAdmin;
    initAdmin = async function() {
        await _originalInitAdmin();
        loadContacts();
    };


