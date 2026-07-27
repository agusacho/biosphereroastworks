const productsData = [
  { name: 'Kopi A', price: 10000, stock_quantity: 10 },
  { name: null, price: 5000, stock_quantity: 0 }, // what if name is null?
];

async function test(text) {
    const q = text.toLowerCase();
    let reply = '';
    let matchedProduct = null;

    if (q.includes('halo')) {
        reply = 'Halo';
    } 
    else if (q.includes('harga')) {
        const found = productsData.find(p => q.includes((p.name || '').toLowerCase().split(' ')[0]));
    }
    else {
        const words = q.split(' ').filter(w => w.length > 3);
        for (const w of words) {
            const found = productsData.find(p => (p.name || '').toLowerCase().includes(w) || (p.notes && p.notes.toLowerCase().includes(w)));
        }
    }
}
test("test").catch(console.error);
