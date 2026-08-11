import re, json
import urllib.request

with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()
url_match = re.search(r'const SUPABASE_URL\s*=\s*[\'"`]+(https?://[^\'"`]+)[\'"`]+', js)
key_match = re.search(r'const SUPABASE_ANON_KEY\s*=\s*[\'"`]+([^\'"`]+)[\'"`]+', js)

if url_match and key_match:
    url = url_match.group(1) + '/rest/v1/site_settings?select=key,type,label,section'
    headers = {
        'apikey': key_match.group(1),
        'Authorization': 'Bearer ' + key_match.group(1),
        'Content-Type': 'application/json'
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            print('KEYS FOUND:')
            for item in data:
                print(f"- {item['key']} ({item['type']}): {item['label']}")
    except Exception as e:
        print('Error fetching:', e)
else:
    print('Supabase config not found')
