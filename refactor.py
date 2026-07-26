import os
import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Extract CSS
style_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
if style_match:
    css_content = style_match.group(1)
    os.makedirs('css', exist_ok=True)
    with open('css/style.css', 'w', encoding='utf-8') as f:
        f.write(css_content.strip())
    html = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="css/style.css">', html, flags=re.DOTALL)

# 2. Fix Navigation Links
nav_replacements = {
    'href="#beranda"': 'href="index.html"',
    'href="#Produk"': 'href="produk.html"',
    'href="#tentang"': 'href="tentang.html"',
    'href="#roasting"': 'href="roasting.html"',
    'href="#kontak"': 'href="kontak.html"',
    'href="#blog"': 'href="blog.html"',
}
for old, new in nav_replacements.items():
    html = html.replace(old, new)

# 3. Extract sections
section_ids = ['beranda', 'quiz', 'shop', 'testimoni', 'tentang', 'roasting', 'kontak']
section_contents = {}

for sec_id in section_ids:
    # Use non-greedy match up to the NEXT section or the closing main tag
    match = re.search(rf'(<section id="{sec_id}".*?</section>)', html, re.DOTALL | re.IGNORECASE)
    if match:
        section_contents[sec_id] = match.group(1)
    else:
        print(f"Section {sec_id} not found!")

# 4. Create base template by stripping ALL sections from <main>
# We find <main>...</main> and replace everything inside it with a placeholder
main_match = re.search(r'(<main>)(.*?)(</main>)', html, re.DOTALL | re.IGNORECASE)
if main_match:
    template = html.replace(main_match.group(2), '\n<!-- CONTENT_PLACEHOLDER -->\n')
else:
    print("Main tag not found!")
    template = html

# 5. Define pages and their sections
pages = {
    'index.html': ['beranda', 'quiz', 'testimoni'],
    'produk.html': ['shop'],
    'tentang.html': ['tentang'],
    'roasting.html': ['roasting'],
    'kontak.html': ['kontak']
}

for filename, secs in pages.items():
    page_content = []
    for s in secs:
        if s in section_contents:
            page_content.append(section_contents[s])
    
    joined_content = '\n'.join(page_content)
    page_html = template.replace('<!-- CONTENT_PLACEHOLDER -->', joined_content)
    
    # Update active class in navbar
    # Remove existing class="active" from navbar items
    page_html = re.sub(r'href="[^"]*"\s+class="active"', lambda m: m.group(0).replace(' class="active"', ''), page_html)
    # Add active to the current page
    page_html = page_html.replace(f'href="{filename}"', f'href="{filename}" class="active"')
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(page_html)

print("Refactoring complete.")
