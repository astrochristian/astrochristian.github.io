import requests

# Download arXiv astro-ph.CO
r = requests.get("https://arxiv.org/list/astro-ph/pastweek?show=1000")

# Write to file
with open("astro_ph.html","w") as f:
	f.write(r.text)