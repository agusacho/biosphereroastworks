// js/utils.js

/**
 * Escapes HTML characters in a string to prevent XSS attacks.
 * @param {string} str - The raw string input from user
 * @returns {string} - The escaped safe string
 */
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Formats a number to Indonesian Rupiah currency.
 * @param {number} n - The number to format
 * @returns {string} - The formatted currency string
 */
function formatRupiah(n) {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0 
    }).format(n || 0);
}

/**
 * Formats a date string or timestamp to Indonesian locale format.
 * @param {string|number} d - The date value
 * @returns {string} - The formatted date string
 */
function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleString('id-ID', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}
