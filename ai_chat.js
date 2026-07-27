/**
 * ai_chat.js — Biosphere Roast Works
 * AI Chat Widget (Gemini API + Rule-based Fallback)
 */

(function initAiChat() {
    // 1. Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        /* Chat Widget Styles */
        #aiChatWidget {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
        }
        
        #aiChatBtn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--accent2, #168782), var(--accent, #D4AF37));
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        #aiChatBtn:hover {
            transform: scale(1.08);
        }
        
        #aiChatPanel {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: rgba(19, 25, 41, 0.95);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            transform-origin: bottom right;
            transform: scale(0);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
        }
        #aiChatPanel.open {
            transform: scale(1);
            opacity: 1;
            pointer-events: all;
        }
        
        /* Mobile responsive */
        @media (max-width: 480px) {
            #aiChatPanel {
                position: fixed;
                bottom: 0;
                right: 0;
                width: 100vw;
                height: 100vh;
                border-radius: 0;
                bottom: 0;
            }
            #aiChatWidget {
                bottom: 16px;
                right: 16px;
            }
        }
        
        #aiChatHeader {
            padding: 16px 20px;
            background: linear-gradient(90deg, rgba(22,135,130,0.2), rgba(212,175,55,0.2));
            border-bottom: 1px solid rgba(255,255,255,0.05);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        #aiChatHeader h4 {
            margin: 0;
            font-size: 1rem;
            font-weight: 700;
            color: var(--text, #fff);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        #aiChatHeader .status-dot {
            width: 8px;
            height: 8px;
            background: #22C55E;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 8px #22C55E;
        }
        #aiChatClose {
            background: transparent;
            border: none;
            color: var(--muted, #7A8599);
            cursor: pointer;
            font-size: 1.2rem;
            transition: color 0.2s;
        }
        #aiChatClose:hover { color: #fff; }
        
        #aiChatBody {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        /* Custom scrollbar for chat */
        #aiChatBody::-webkit-scrollbar { width: 4px; }
        #aiChatBody::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
        
        .chat-msg {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 14px;
            font-size: 0.88rem;
            line-height: 1.4;
            animation: msgIn 0.3s ease-out;
            word-wrap: break-word;
        }
        @keyframes msgIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .msg-bot {
            align-self: flex-start;
            background: rgba(255,255,255,0.05);
            color: #E8EDF5;
            border-bottom-left-radius: 4px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .msg-bot strong { color: var(--accent, #D4AF37); }
        
        .msg-user {
            align-self: flex-end;
            background: linear-gradient(135deg, var(--accent2, #168782), rgba(22,135,130,0.8));
            color: white;
            border-bottom-right-radius: 4px;
        }
        
        .chat-typing {
            align-self: flex-start;
            background: rgba(255,255,255,0.05);
            padding: 12px 14px;
            border-radius: 14px;
            border-bottom-left-radius: 4px;
            display: none;
        }
        .typing-dots {
            display: flex;
            gap: 4px;
        }
        .typing-dot {
            width: 6px;
            height: 6px;
            background: var(--muted, #7A8599);
            border-radius: 50%;
            animation: typingBounce 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typingBounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
        
        #aiChatInputArea {
            padding: 14px;
            background: rgba(0,0,0,0.2);
            border-top: 1px solid rgba(255,255,255,0.05);
            display: flex;
            gap: 8px;
        }
        #aiChatInput {
            flex: 1;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 10px 16px;
            color: #fff;
            font-size: 0.88rem;
            font-family: 'Inter', sans-serif;
            outline: none;
            transition: border-color 0.2s;
        }
        #aiChatInput:focus {
            border-color: var(--accent, #D4AF37);
        }
        #aiChatSend {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--accent, #D4AF37);
            color: #111;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s, background 0.2s;
        }
        #aiChatSend:hover {
            transform: scale(1.05);
            background: #F5D980;
        }
        #aiChatSend:disabled {
            background: rgba(255,255,255,0.1);
            color: var(--muted, #7A8599);
            cursor: not-allowed;
            transform: none;
        }
        
        /* Product Recommendation Card inside chat */
        .chat-product-card {
            background: rgba(0,0,0,0.2);
            border: 1px solid rgba(212,175,55,0.3);
            border-radius: 10px;
            padding: 10px;
            margin-top: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            color: white;
            transition: background 0.2s;
        }
        .chat-product-card:hover {
            background: rgba(212,175,55,0.1);
        }
        .chat-product-img {
            width: 40px;
            height: 40px;
            border-radius: 6px;
            object-fit: cover;
            background: var(--surface, #131929);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            color: var(--muted);
            border: 1px solid rgba(255,255,255,0.1);
        }
        .chat-product-info { flex: 1; }
        .chat-product-name { font-weight: 600; font-size: 0.85rem; margin-bottom: 2px; }
        .chat-product-price { color: var(--accent, #D4AF37); font-size: 0.8rem; font-weight: 700; }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML
    const widget = document.createElement('div');
    widget.id = 'aiChatWidget';
    widget.innerHTML = `
        <div id="aiChatPanel">
            <div id="aiChatHeader">
                <h4><span class="status-dot"></span> Asisten Biosphere</h4>
                <button id="aiChatClose"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div id="aiChatBody">
                <div class="chat-msg msg-bot">
                    Halo! Saya asisten virtual Biosphere Roast Works. Ada yang bisa saya bantu tentang produk kopi atau proses roasting kami?
                </div>
                <div id="aiChatTyping" class="chat-typing">
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
            <div id="aiChatInputArea">
                <input type="text" id="aiChatInput" placeholder="Ketik pesan..." autocomplete="off">
                <button id="aiChatSend" disabled><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
        <button id="aiChatBtn" title="Chat dengan AI">
            <i class="fa-solid fa-robot"></i>
        </button>
    `;
    document.body.appendChild(widget);

    // 3. Logic & State
    const btn = document.getElementById('aiChatBtn');
    const panel = document.getElementById('aiChatPanel');
    const closeBtn = document.getElementById('aiChatClose');
    const input = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('aiChatSend');
    const body = document.getElementById('aiChatBody');
    const typingInd = document.getElementById('aiChatTyping');

    let isOpen = false;
    let isTyping = false;
    let productsData = [];
    let geminiKey = '';

    // Load data silently
    async function loadData() {
        if (typeof supabase === 'undefined') return;
        const SUPABASE_URL = 'https://gvuzsbrplmgqjuchjcpk.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dXpzYnJwbG1ncWp1Y2hqY3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MTE5NDMsImV4cCI6MjA5MTI4Nzk0M30.PowRUwVvHnEKvfBC3jvK5gHUsCACT2ecTJxOAat8qXU';
        try {
            const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            // Get Products
            const { data: prods } = await _sb.from('products').select('*');
            if (prods) productsData = prods;
            
            // Get API Key if exists
            const { data: sets } = await _sb.from('site_settings').select('value').eq('key', 'gemini_api_key').single();
            if (sets && sets.value) geminiKey = sets.value;
        } catch (e) { console.error('AI Chat load data error:', e); }
    }
    loadData();

    // Toggle
    btn.addEventListener('click', () => {
        isOpen = !isOpen;
        panel.classList.toggle('open', isOpen);
        if (isOpen) {
            input.focus();
            // Pulse animation off
            btn.style.animation = 'none';
        }
    });
    
    closeBtn.addEventListener('click', () => {
        isOpen = false;
        panel.classList.remove('open');
    });

    // Input events
    input.addEventListener('input', () => {
        sendBtn.disabled = input.value.trim().length === 0;
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !sendBtn.disabled) sendMessage();
    });

    sendBtn.addEventListener('click', sendMessage);

    function addMessage(text, isUser = false, rawHtml = null) {
        const div = document.createElement('div');
        div.className = `chat-msg ${isUser ? 'msg-user' : 'msg-bot'}`;
        
        if (rawHtml) {
            div.innerHTML = rawHtml;
        } else {
            // Format basic markdown
            let formatted = text
                .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
                .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
                .replace(/\\n/g, '<br>');
            div.innerHTML = formatted;
        }
        
        body.insertBefore(div, typingInd);
        scrollToBottom();
    }

    function scrollToBottom() {
        body.scrollTop = body.scrollHeight;
    }

    function showTyping(show) {
        isTyping = show;
        typingInd.style.display = show ? 'block' : 'none';
        input.disabled = show;
        sendBtn.disabled = show || input.value.trim().length === 0;
        if (show) scrollToBottom();
        else setTimeout(() => input.focus(), 10);
    }

    // Format Rupiah
    const rp = (num) => 'Rp ' + (num || 0).toLocaleString('id-ID');

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        
        addMessage(text, true);
        input.value = '';
        sendBtn.disabled = true;
        showTyping(true);

        try {
            if (geminiKey) {
                await askGemini(text);
            } else {
                await askRuleBased(text);
            }
        } catch (e) {
            console.error(e);
            addMessage('Maaf, saya sedang mengalami gangguan sistem. Silakan coba lagi nanti.');
        } finally {
            showTyping(false);
        }
    }

    /* ── RULE-BASED FALLBACK ── */
    async function askRuleBased(text) {
        // Simulate delay
        await new Promise(r => setTimeout(r, 800 + Math.random() * 1000));
        
        const q = text.toLowerCase();
        let reply = '';
        let matchedProduct = null;

        if (q.includes('halo') || q.includes('hai') || q.includes('pagi') || q.includes('siang') || q.includes('sore') || q.includes('malam')) {
            reply = 'Halo! Senang bisa mengobrol dengan Anda. Ada yang ingin ditanyakan seputar produk kopi kami?';
        } 
        else if (q.includes('harga') || q.includes('berapa')) {
            // Try to find product
            const found = productsData.find(p => q.includes(p.name.toLowerCase().split(' ')[0]));
            if (found) {
                reply = `Harga untuk **${found.name}** adalah **${rp(found.price)}**. Stok saat ini: ${found.stock_quantity > 0 ? 'Tersedia' : 'Habis'}.`;
                matchedProduct = found;
            } else {
                reply = 'Harga produk kami bervariasi. Untuk Roasted Bean mulai dari Rp 80.000, sedangkan minuman mulai dari Rp 21.000. Anda bisa cek halaman Produk untuk lengkapnya!';
            }
        }
        else if (q.includes('rekomendasi') || q.includes('enak') || q.includes('favorit')) {
            const beans = productsData.filter(p => p.category === 'Roasted Bean');
            if (beans.length > 0) {
                const p = beans[Math.floor(Math.random() * beans.length)];
                reply = `Saya merekomendasikan **${p.name}**. Kopi ini memiliki profil rasa yang khas (${p.notes || 'nikmat'}).`;
                matchedProduct = p;
            } else {
                reply = 'Kami merekomendasikan Single Origin andalan kami. Silakan cek menu Produk ya!';
            }
        }
        else if (q.includes('lokasi') || q.includes('alamat') || q.includes('dimana')) {
            reply = 'Kami berlokasi di **Jl. Srikaya, Perum Bumi Tajur Raya No.7 Blok A4**, Citeureup, Bogor. Anda bisa mampir ke roastery kami!';
        }
        else if (q.includes('pesan') || q.includes('beli') || q.includes('order')) {
            reply = 'Untuk memesan, Anda bisa langsung menambahkan produk ke keranjang belanja di halaman **Produk** dan melakukan checkout. Jika ada pesanan khusus, silakan hubungi kami via WhatsApp!';
        }
        else if (q.includes('roasting') || q.includes('sangrai')) {
            reply = 'Kami menyangrai kopi secara rutin setiap pekan menggunakan profil khusus untuk memunculkan potensi rasa terbaik dari setiap biji, dengan metode presisi dari Drying, Maillard, hingga First Crack.';
        }
        else if (q.includes('terima kasih') || q.includes('makasih') || q.includes('tks')) {
            reply = 'Sama-sama! Jangan ragu bertanya jika butuh bantuan lain. Selamat menikmati kopi Anda! ☕';
        }
        else {
            // Default search product
            const words = q.split(' ').filter(w => w.length > 3);
            for (const w of words) {
                const found = productsData.find(p => p.name.toLowerCase().includes(w) || (p.notes && p.notes.toLowerCase().includes(w)));
                if (found) {
                    matchedProduct = found;
                    reply = `Mungkin Anda mencari **${found.name}**? Kopi ini harganya ${rp(found.price)}.`;
                    break;
                }
            }
            if (!reply) {
                reply = 'Maaf, saya kurang paham. Anda bisa menanyakan tentang rekomendasi kopi, harga, lokasi, atau cara pemesanan.';
            }
        }

        // Build HTML
        let finalHtml = reply.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
        
        // Append product card if matched
        if (matchedProduct) {
            const img = matchedProduct.image_icon 
                ? `<img src="${matchedProduct.image_icon}" class="chat-product-img">`
                : `<div class="chat-product-img"><i class="fa-solid fa-mug-hot"></i></div>`;
            
            finalHtml += `
                <a href="produk.html" class="chat-product-card">
                    ${img}
                    <div class="chat-product-info">
                        <div class="chat-product-name">${matchedProduct.name}</div>
                        <div class="chat-product-price">${rp(matchedProduct.price)}</div>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color:var(--muted);font-size:.8rem;"></i>
                </a>
            `;
        }

        addMessage('', false, finalHtml);
    }

    /* ── GEMINI API CALL ── */
    async function askGemini(text) {
        // Build context from products
        const prodContext = productsData.map(p => `- ${p.name} (${p.category}): Harga ${rp(p.price)}, Notes: ${p.notes||'-'}, Stok: ${p.stock_quantity}`).join('\\n');
        
        const systemPrompt = `Kamu adalah asisten AI ramah untuk Biosphere Roast Works, sebuah roastery kopi di Bogor. 
Berikan jawaban yang singkat, padat, hangat, dan gunakan bahasa Indonesia yang santai tapi profesional.
Gunakan format markdown tebal (**text**) untuk nama produk atau poin penting.
Berikut adalah katalog produk kami:
${prodContext}
Info lain: Alamat di Jl. Srikaya, Perum Bumi Tajur Raya No.7 Blok A4, Bogor. Pemesanan bisa via website (halaman produk).
Jawab pertanyaan user berikut:`;

        const requestBody = {
            contents: [{
                parts: [{ text: systemPrompt + "\\n\\nUser: " + text }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 250
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('API Error');
        }

        const data = await response.json();
        const replyText = data.candidates[0].content.parts[0].text;
        
        addMessage(replyText);
    }

})();
