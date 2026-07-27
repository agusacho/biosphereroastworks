import glob
import re

html_files = glob.glob('*.html')
html_files = [f for f in html_files if f not in ('admin.html', 'maintenance.html', 'vercel.html', 'index2.html')]

for f_name in html_files:
    with open(f_name, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(r'main\.js\?v=\d+', 'main.js?v=4', content)
    content = re.sub(r'site_settings\.js(\?v=\d+)?', 'site_settings.js?v=4', content)
    content = re.sub(r'i18n\.js(\?v=\d+)?', 'i18n.js?v=4', content)

    with open(f_name, 'w', encoding='utf-8') as f:
        f.write(content)

print("Cache busting v4 applied safely.")
