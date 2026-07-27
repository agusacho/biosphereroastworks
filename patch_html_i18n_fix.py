import glob
import re

html_files = glob.glob('*.html')
html_files = [f for f in html_files if f not in ('admin.html', 'maintenance.html', 'vercel.html', 'index2.html')]

for f_name in html_files:
    with open(f_name, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add i18n script before main.js
    if '<script src="i18n.js"></script>' not in content:
        # Some use main.js, some use main.js?v=2
        content = re.sub(r'(<script src="main\.js[^>]*></script>)', r'<script src="i18n.js"></script>\n    \1', content)

    with open(f_name, 'w', encoding='utf-8') as f:
        f.write(content)

print("HTML files patched for i18n injection.")
