import json, urllib.request
data = json.loads(urllib.request.urlopen('https://fakestoreapi.com/products').read())
for p in data:
    print(f'{p["id"]}: {p["title"][:70]} ({p["category"]})')
