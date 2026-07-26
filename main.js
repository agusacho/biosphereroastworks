
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
    const gridMinuman = document.getElementById('grid-minuman');
    const gridRoasted = document.getElementById('grid-roasted');
    const productGrid = document.getElementById('productGrid'); // Fallback if still exists

    if (!gridMinuman && !gridRoasted && !productGrid) return; // Exit if not on shop page
    
    if(gridMinuman) gridMinuman.innerHTML = '';
    if(gridRoasted) gridRoasted.innerHTML = '';
    if(productGrid) productGrid.innerHTML = '';

    products.forEach(product => {
        // Menyesuaikan warna badge dengan nilai 'category' dari Supabase
        let badgeClass = 'badge-green';
        if (product.category === 'Roasted Bean') {
            badgeClass = 'badge-roasted';
        } else if (product.category === 'Minuman Kopi') {
            badgeClass = 'Minuman'; 
        }

        let defaultPriceStr = formatRupiah(product.price);
        const hasVariants = product.variants && Array.isArray(product.variants) && product.variants.length > 0;
        if(hasVariants) {
            defaultPriceStr = formatRupiah(product.variants[0].price);
        }

        let card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrapper" style="cursor:pointer;" onclick="${hasVariants ? `openProductDetail('${product.id}')` : ''}">
                <span class="category-badge ${badgeClass}">${(product.category || 'PRODUK').toUpperCase()}</span>
                <div class="img-placeholder">
                    ${product.name.split(' ')[0]}
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating"><i class="fa-solid fa-star"></i> ${product.rating || 0}</div>
                <div class="product-price">${defaultPriceStr}</div>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;">
                    ${product.notes ? 'Notes: ' + product.notes : ''}<br>
                    ${product.stock_quantity > 0 ? 'Stok: ' + product.stock_quantity : 'Stok Habis'}
                </div>
                <div class="product-actions">
                    <button class="btn btn-outline" style="padding: 10px;" onclick="openProductDetail('${product.id}')">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="btn btn-primary" onclick="${hasVariants ? `openProductDetail('${product.id}')` : `quickAddToCart('${product.id}')`}">
                        <i class="fa-solid fa-cart-plus"></i> ${hasVariants ? 'Pilih' : 'Tambah'}
                    </button>
                </div>
            </div>
        `;

        if (product.category === 'Minuman Kopi' && gridMinuman) {
            gridMinuman.appendChild(card);
        } else if (product.category === 'Roasted Bean' && gridRoasted) {
            gridRoasted.appendChild(card);
        } else if (productGrid) {
            productGrid.appendChild(card);
        }
    });

    // Perbarui counter jumlah produk di bagian header katalog
    const countElement = document.getElementById('productCount');
    if (countElement) countElement.innerText = products.length;
};

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
            renderProducts(products); // Pastikan Anda memiliki fungsi renderProducts()
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

        document.querySelectorAll('input[name="category"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                activeCategoryFilter = e.target.value;
                
                
                applyFilters();
            });
        });

        document.getElementById('searchInput').addEventListener('input', applyFilters);
        document.getElementById('sortSelect').addEventListener('change', applyFilters);
        document.querySelectorAll('.filter-origin, .filter-process').forEach(cb => cb.addEventListener('change', applyFilters));

        const filterByCategory = (cat) => {
            document.querySelector(`input[name="category"][value="${cat}"]`).checked = true;
            activeCategoryFilter = cat;
            applyFilters();
        };

        const resetFilters = () => {
            document.querySelector('input[name="category"][value="all"]').checked = true;
            activeCategoryFilter = 'all';
            document.getElementById('searchInput').value = '';
            document.getElementById('sortSelect').value = 'default';
            document.querySelectorAll('.filter-origin, .filter-process').forEach(cb => cb.checked = false);
            
            
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

            if (hasVariants) {
                defaultPriceStr = formatRupiah(p.variants[0].price);
                variantHTML = `
                    <div class="variant-selector mb-4">
                        <label style="display:block; margin-bottom:8px; font-weight:700;">Pilih Varian/Ukuran:</label>
                        <select class="form-control" id="modalVariantSelect" onchange="updateModalPrice()">
                            ${p.variants.map((v, index) => `<option value="${index}">${v.name}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else {
                defaultPriceStr = formatRupiah(p.price || 0);
                variantHTML = `<div class="mb-4 text-muted">Varian: Default (1 kg / 1 Pack)</div>`;
            }

            const modalBody = document.getElementById('productModalBody');
            modalBody.innerHTML = `
                <div class="product-detail-layout">
                    <div class="product-detail-img img-placeholder" style="background: ${p.imageStyle || 'var(--metallic-white)'}; font-size: 2rem;">
                        ${p.name ? p.name.split(' ')[0] : 'Kopi'}
                    </div>
                    <div class="product-detail-info">
                        <span class="category-badge ${p.category === 'drink' ? 'Minuman Kopi' : (p.category === 'roasted' ? 'badge-roasted' : 'badge-green')}" style="position:relative; top:0; left:0; display:inline-block; margin-bottom:10px;">${(p.category || 'PRODUK').toUpperCase()}</span>
                        <h2 style="margin-bottom: 5px;">${p.name}</h2>
                        <div class="product-rating mb-4"><i class="fa-solid fa-star"></i> ${p.rating || 0}</div>
                        
                        <div style="font-size: 1.5rem; font-weight: 700; color: #B38728; margin-bottom: 20px;" id="modalPriceDisplay">${defaultPriceStr}</div>
                        
                        <p class="mb-4"><strong>Notes:</strong> ${p.notes || '-'}</p>
                        ${p.origin ? `<p class="mb-2"><strong>Origin:</strong> ${p.origin}</p>` : ''}
                        ${p.process ? `<p class="mb-4"><strong>Proses:</strong> ${p.process}</p>` : ''}
                        
                        ${variantHTML}

                        <div style="display: flex; gap: 15px; margin-top: 20px;">
                            <div class="qty-controls" style="border: 1px solid var(--border); border-radius: var(--radius); padding: 5px;">
                                <button class="qty-btn" onclick="adjustModalQty(-1)">-</button>
                                <span id="modalQty" style="width: 30px; text-align: center; font-weight: 700;">1</span>
                                <button class="qty-btn" onclick="adjustModalQty(1)">+</button>
                            </div>
                            <button class="btn btn-primary" style="flex-grow: 1;" onclick="addToCartFromModal()">Tambahkan ke Keranjang</button>
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
            showToast(`${newItem.name} ditambahkan ke keranjang`);
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
                alert("Keranjang Anda kosong. Silakan belanja terlebih dahulu.");
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

            showLoader();

            // Kumpulkan data order
            const payload = {
                cart: cart,
                customer: {
                    name: currentUser ? (currentUser.user_metadata?.name || 'User') : 'Guest',
                    email: currentUser ? currentUser.email : 'guest@example.com'
                },
                paymentMethod: selectedPaymentMethod
            };

            try {
                // Panggil Backend API Vercel Serverless Function
                const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Terjadi kesalahan saat memproses pembayaran');
                }

                hideLoader();
                closeModal('paymentModal');

                // Panggil Pop-up Midtrans Snap
                window.snap.pay(data.token, {
                    onSuccess: function(result){
                        alert("Pembayaran berhasil! Pesanan Anda akan segera diproses.");
                        cart = [];
                        saveCart();
                        renderCart();
                    },
                    onPending: function(result){
                        alert("Menunggu pembayaran Anda!");
                        cart = [];
                        saveCart();
                        renderCart();
                    },
                    onError: function(result){
                        alert("Pembayaran gagal!");
                    },
                    onClose: function(){
                        alert('Anda menutup popup tanpa menyelesaikan pembayaran');
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
                showToast("Simulasi Offline: Pesan terkirim!");
                e.target.reset();
                return;
            }

            try {
                showLoader();
                document.getElementById('btnSubmitContact').disabled = true;

                const { error } = await _supabase.from('contacts').insert([{ nama, email, pesan }]);
                if (error) throw error;

                showToast("Pesan berhasil dikirim!");
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
            document.getElementById('authModalTitle').innerText = isLoginMode ? 'Masuk ke Akun' : 'Daftar Akun Baru';
            document.getElementById('btnSubmitAuth').innerText = isLoginMode ? 'Masuk' : 'Daftar';
            document.getElementById('authToggleText').innerText = isLoginMode ? 'Belum punya akun?' : 'Sudah punya akun?';
            document.getElementById('authToggleLink').innerText = isLoginMode ? 'Daftar di sini' : 'Masuk di sini';
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
                        showToast(isLoginMode ? "Berhasil masuk (Offline)" : "Berhasil daftar (Offline)");
                        hideLoader();
                        document.getElementById('btnSubmitAuth').disabled = false;
                    }, 1000);
                    return;
                }

                if(isLoginMode) {
                    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
                    if(error) throw error;
                    currentUser = data.user;
                    showToast("Berhasil masuk!");
                } else {
                    const { data, error } = await _supabase.auth.signUp({ email, password, options: { data: { name } } });
                    if(error) throw error;
                    currentUser = data.user;
                    showToast("Pendaftaran berhasil! Silakan cek email jika butuh verifikasi.");
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
                showToast("Berhasil keluar.");
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
                document.getElementById('authModalTitle').innerText = 'Profil Anda';
                document.getElementById('loggedInName').innerText = currentUser.user_metadata?.name || 'Pengguna';
                document.getElementById('loggedInEmail').innerText = currentUser.email;
                document.getElementById('userIcon').innerHTML = '<i class="fa-solid fa-user-check"></i>';
            } else {
                document.getElementById('authForm').style.display = 'block';
                document.getElementById('loggedInView').style.display = 'none';
                document.getElementById('authModalTitle').innerText = isLoginMode ? 'Masuk ke Akun' : 'Daftar Akun Baru';
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
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 15px;">${recommended.notes || 'Pilihan terbaik untuk Anda'}</p>
                    <button class="btn btn-accent" onclick="closeModal('quizModal'); openProductDetail('${recommended.id}')">Lihat Detail</button>
                `;
            } else {
                rView.innerHTML = '<p>Silakan cek koleksi lengkap kami!</p>';
            }
        };

        /* --- 12. INITIALIZATION ON LOAD --- */
        document.addEventListener('DOMContentLoaded', () => {
            fetchProducts(); 
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
                if(data.status === 'pending') { statusColor = '#f39c12'; statusText = 'MENUNGGU PEMBAYARAN'; }
                if(data.status === 'paid') { statusColor = 'var(--success)'; statusText = 'LUNAS / DIPROSES'; }
                if(data.status === 'shipped') { statusColor = 'var(--primary)'; statusText = 'DIKIRIM'; }
                
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
                btn.innerHTML = 'Lacak';
                btn.disabled = false;
            }
        }

        /* --- 14. CATEGORY FILTERING --- */
        window.filterCategory = function(category) {
            const secMinuman = document.getElementById('section-minuman');
            const secRoasted = document.getElementById('section-roasted');
            
            if(category === 'all') {
                if(secMinuman) secMinuman.style.display = 'block';
                if(secRoasted) secRoasted.style.display = 'block';
            } else if(category === 'Minuman Kopi') {
                if(secMinuman) secMinuman.style.display = 'block';
                if(secRoasted) secRoasted.style.display = 'none';
            } else if(category === 'Roasted Bean') {
                if(secMinuman) secMinuman.style.display = 'none';
                if(secRoasted) secRoasted.style.display = 'block';
            }
        };
