
// components.js - Shared UI components (Navbar, Footer)

const navbarHTML = `
    <!-- Top Announcement Bar -->
    <div class="top-banner" style="background-color: var(--accent);">
        <p class="top-banner-text" data-i18n="top_banner_text" data-setting="announcement_text">Promo Terbatas! Gratis Ongkir Jawa-Bali untuk pembelian biji kopi 1kg.</p>
    </div>

    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-content">
            <a href="index.html" class="logo">
                <img src="logo.png" alt="Biosphere Roast Works Logo" style="height:40px; margin-right:10px;">
                Biosphere Roast Works
            </a>
            <ul class="nav-links" id="navLinks">
                <li><a href="index.html" class="nav-item" data-page="index" data-i18n="nav_home">Beranda</a></li>
                <li><a href="produk.html" class="nav-item" data-page="produk" data-i18n="nav_products">Produk</a></li>
                <li><a href="tentang.html" class="nav-item" data-page="tentang" data-i18n="nav_about">Tentang Kami</a></li>
                <li><a href="roasting.html" class="nav-item" data-page="roasting" data-i18n="nav_roasting">Proses Roasting</a></li>
                <li><a href="blog.html" class="nav-item" data-page="blog" data-i18n="nav_blog">Blog</a></li>
                <li><a href="kontak.html" class="nav-item" data-page="kontak" data-i18n="nav_contact">Kontak</a></li>
                <li><a href="tracking.html" class="nav-item" data-page="tracking" data-i18n="nav_track">Lacak Pesanan</a></li>
            </ul>
            <div class="nav-actions">
                <a href="#" class="cart-icon" onclick="openCart(event)">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span class="cart-badge" id="cartBadge">0</span>
                </a>
                <button class="lang-btn" id="langToggleBtn" onclick="toggleLanguage()">EN</button>
                <div class="hamburger" id="hamburgerBtn" onclick="toggleMobileMenu()">
                    <i class="fa-solid fa-bars"></i>
                </div>
            </div>
        </div>
    </nav>
`;

const footerHTML = `
    <!-- Footer -->
    <footer>
        <div class="footer-content">
            <div class="footer-col">
                <h3>Biosphere Roast Works</h3>
                <p class="footer-desc" data-i18n="footer_desc" data-setting="footer_about">Memadukan presisi sains dengan seni sangrai untuk menghasilkan kopi berkualitas terbaik.</p>
                <div class="social-links">
                    <a href="https://instagram.com" target="_blank"><i class="fa-brands fa-instagram"></i></a>
                    <a href="https://tiktok.com" target="_blank"><i class="fa-brands fa-tiktok"></i></a>
                    <a href="https://wa.me/6282123456789" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>
                </div>
            </div>
            <div class="footer-col">
                <h3 data-i18n="footer_menu">Menu Cepat</h3>
                <ul class="footer-links">
                    <li><a href="produk.html" data-i18n="footer_link_shop">Belanja Kopi</a></li>
                    <li><a href="roasting.html" data-i18n="footer_link_roasting">Fasilitas Roasting</a></li>
                    <li><a href="kontak.html" data-i18n="footer_link_contact">Hubungi Kami</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h3 data-i18n="footer_contact">Pemesanan & Kerjasama</h3>
                <ul class="footer-links">
                    <li><i class="fa-brands fa-whatsapp" style="margin-right:10px; color:var(--accent);"></i> <span data-setting="nav_whatsapp">0821-2345-6789</span></li>
                    <li><i class="fa-solid fa-envelope" style="margin-right:10px; color:var(--accent);"></i> hello@biosphereroast.com</li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Biosphere Roast Works. All rights reserved.</p>
        </div>
    </footer>
`;

function renderComponents() {
    // Inject Navbar
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (navPlaceholder) {
        navPlaceholder.innerHTML = navbarHTML;
        
        // Set active link based on current page
        let currentPath = window.location.pathname.split('/').pop();
        if (currentPath === '' || currentPath === '/') currentPath = 'index.html';
        const pageKey = currentPath.split('.')[0];
        
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-page') === pageKey) {
                item.classList.add('active');
            }
        });
    }

    // Inject Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
    }
}

// Call render synchronously if DOM is already building, or add listener.
// Since we'll place the script at the top or bottom, we can listen for DOMContentLoaded.
document.addEventListener('DOMContentLoaded', () => {
    renderComponents();
});
