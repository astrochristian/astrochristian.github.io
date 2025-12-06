<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<xsl:template match="/">
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>
					<xsl:value-of select="/rss/channel/title" /> - RSS Feed
				</title>
				<style>
					:root {
						--primary-color: #4a90e2;
						--primary-dark: #2e5c8a;
						--text-dark: #333;
						--text-medium: #666;
						--text-light: #999;
						--bg-light: #f5f5f5;
						--bg-white: #ffffff;
						--border-color: #e0e0e0;
						--success-color: #27ae60;
					}

					[data-theme="dark"] {
						--primary-color: #6ba3f5;
						--text-dark: #e0e0e0;
						--text-medium: #b0b0b0;
						--text-light: #888;
						--bg-light: #1a1a1a;
						--bg-white: #242424;
						--border-color: #333;
					}

					* {
						margin: 0;
						padding: 0;
						box-sizing: border-box;
					}

					html {
						scroll-behavior: smooth;
					}

					body {
						font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
						line-height: 1.6;
						color: var(--text-dark);
						background-color: var(--bg-light);
						transition: background-color 0.3s, color 0.3s;
					}

					.container {
						max-width: 900px;
						margin: 0 auto;
						padding: 2rem;
					}

					header {
						background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
						color: white;
						padding: 3rem 2rem;
						text-align: center;
						border-bottom: 3px solid var(--primary-color);
						margin-bottom: 2rem;
					}

					header h1 {
						font-size: 2.5rem;
						margin-bottom: 0.5rem;
						font-weight: 700;
					}

					header .subtitle {
						font-size: 1.1rem;
						opacity: 0.95;
						margin-bottom: 1.5rem;
					}

					.rss-info {
						background: rgba(255, 255, 255, 0.15);
						padding: 1.5rem;
						border-radius: 0.5rem;
						margin-top: 1.5rem;
						backdrop-filter: blur(10px);
					}

					.rss-info p {
						margin: 0.5rem 0;
						font-size: 0.95rem;
					}

					.subscribe-buttons {
						display: flex;
						gap: 1rem;
						margin-top: 1.5rem;
						flex-wrap: wrap;
						justify-content: center;
					}

					.subscribe-btn {
						display: inline-flex;
						align-items: center;
						gap: 0.5rem;
						padding: 0.75rem 1.5rem;
						background: white;
						color: var(--primary-color);
						text-decoration: none;
						border-radius: 0.5rem;
						font-weight: 600;
						transition: all 0.2s;
						border: 2px solid white;
						cursor: pointer;
						font-size: 0.9rem;
					}

					.subscribe-btn:hover {
						transform: translateY(-2px);
						box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
					}

					.subscribe-btn svg {
						width: 18px;
						height: 18px;
					}

					main {
						background: var(--bg-white);
						border-radius: 0.5rem;
						box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
						padding: 2rem;
						margin-bottom: 2rem;
					}

					.feed-description {
						color: var(--text-medium);
						margin-bottom: 2rem;
						padding-bottom: 1.5rem;
						border-bottom: 1px solid var(--border-color);
						font-style: italic;
					}

					.posts-header {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: 2rem;
						padding-bottom: 1rem;
						border-bottom: 2px solid var(--primary-color);
					}

					.posts-header h2 {
						color: var(--primary-color);
						font-size: 1.75rem;
					}

					.posts-count {
						background: var(--primary-color);
						color: white;
						padding: 0.5rem 1rem;
						border-radius: 2rem;
						font-weight: 600;
						font-size: 0.9rem;
					}

					.feed-item {
						border: 1px solid var(--border-color);
						border-radius: 0.5rem;
						padding: 1.5rem;
						margin-bottom: 1.5rem;
						transition: all 0.2s;
					}

					.feed-item:hover {
						box-shadow: 0 4px 12px rgba(74, 144, 226, 0.1);
						border-color: var(--primary-color);
					}

					.feed-item-title {
						font-size: 1.3rem;
						font-weight: 600;
						margin-bottom: 0.5rem;
					}

					.feed-item-title a {
						color: var(--primary-color);
						text-decoration: none;
						transition: color 0.2s;
					}

					.feed-item-title a:hover {
						color: var(--primary-dark);
						text-decoration: underline;
					}

					.feed-item-meta {
						display: flex;
						align-items: center;
						gap: 1rem;
						color: var(--text-light);
						font-size: 0.9rem;
						margin-bottom: 1rem;
					}

					.feed-item-date {
						display: flex;
						align-items: center;
						gap: 0.3rem;
					}

					.feed-item-date::before {
						content: "📅";
					}

					.feed-item-description {
						color: var(--text-medium);
						line-height: 1.7;
						margin-bottom: 1rem;
					}

					.feed-item-link {
						display: inline-block;
						padding: 0.5rem 1rem;
						background: var(--primary-color);
						color: white;
						text-decoration: none;
						border-radius: 0.3rem;
						font-size: 0.9rem;
						font-weight: 500;
						transition: all 0.2s;
					}

					.feed-item-link:hover {
						background: var(--primary-dark);
						transform: translateY(-2px);
					}

					footer {
						text-align: center;
						color: var(--text-light);
						padding: 2rem;
						border-top: 1px solid var(--border-color);
						font-size: 0.9rem;
					}

					footer a {
						color: var(--primary-color);
						text-decoration: none;
					}

					footer a:hover {
						text-decoration: underline;
					}

					.theme-toggle-btn {
						position: fixed;
						bottom: 2rem;
						right: 2rem;
						width: 50px;
						height: 50px;
						border-radius: 50%;
						background: var(--primary-color);
						color: white;
						border: none;
						cursor: pointer;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 1.5rem;
						box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
						transition: all 0.3s;
						z-index: 1000;
					}

					.theme-toggle-btn:hover {
						transform: scale(1.1);
						box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4);
					}

					@media (max-width: 768px) {
						.container {
							padding: 1rem;
						}

						header {
							padding: 2rem 1rem;
						}

						header h1 {
							font-size: 1.75rem;
						}

						main {
							padding: 1.5rem;
						}

						.subscribe-buttons {
							flex-direction: column;
						}

						.subscribe-btn {
							width: 100%;
							justify-content: center;
						}

						.posts-header {
							flex-direction: column;
							align-items: flex-start;
							gap: 1rem;
						}
					}
				</style>
			</head>
			<body>
				<header>
					<h1>
						<xsl:value-of select="/rss/channel/title" />
					</h1>
					<p class="subtitle">
						<xsl:value-of select="/rss/channel/description" />
					</p>
					<div class="rss-info">
						<p>📡 This is an RSS feed. Subscribe using your favorite RSS reader to get updates automatically.</p>
						<div class="subscribe-buttons">
							<a href="#" class="subscribe-btn" onclick="copyFeedUrl(); return false;">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
									<rect x="8" y="2" width="8" height="4"></rect>
									<path d="M9 14l2 2 4-4"></path>
								</svg>
								Copy Feed URL
							</a>
							<a href="https://feedly.com/i/subscription/feed/" class="subscribe-btn">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<circle cx="12" cy="12" r="10"></circle>
									<path d="M12 6v6l4 2"></path>
								</svg>
								Subscribe in Reader
							</a>
						</div>
					</div>
				</header>

				<main class="container">
					<xsl:if test="/rss/channel/description">
						<p class="feed-description">
							<xsl:value-of select="/rss/channel/description" />
						</p>
					</xsl:if>

					<div class="posts-header">
						<h2>📝 Recent Posts</h2>
						<span class="posts-count">
							<xsl:value-of select="count(/rss/channel/item)" /> posts
						</span>
					</div>

					<xsl:for-each select="/rss/channel/item">
						<article class="feed-item">
							<h3 class="feed-item-title">
								<a>
									<xsl:attribute name="href">
										<xsl:value-of select="link" />
									</xsl:attribute>
									<xsl:value-of select="title" />
								</a>
							</h3>
							<div class="feed-item-meta">
								<span class="feed-item-date">
									<xsl:value-of select="pubDate" />
								</span>
							</div>
							<p class="feed-item-description">
								<xsl:value-of select="description" />
							</p>
							<a class="feed-item-link">
								<xsl:attribute name="href">
									<xsl:value-of select="link" />
								</xsl:attribute>
								Read Full Post →
							</a>
						</article>
					</xsl:for-each>
				</main>

				<footer class="container">
					<p>
						<strong>
							<xsl:value-of select="/rss/channel/title" />
						</strong>
						<br/>
						Last updated: <xsl:value-of select="/rss/channel/lastBuildDate" />
						<br/>
						<a href="https://astrochristian.github.io">Visit the main site</a> • <a href="https://github.com/astrochristian">GitHub</a>
					</p>
				</footer>

				<button class="theme-toggle-btn" onclick="toggleTheme()">🌙</button>

				<script>
					// Theme toggle
					const html = document.documentElement;
					const currentTheme = localStorage.getItem('theme') || 'light';
					html.setAttribute('data-theme', currentTheme);

					function toggleTheme() {
						const theme = html.getAttribute('data-theme');
						const newTheme = theme === 'light' ? 'dark' : 'light';
						html.setAttribute('data-theme', newTheme);
						localStorage.setItem('theme', newTheme);
						updateThemeButton();
					}

					function updateThemeButton() {
						const btn = document.querySelector('.theme-toggle-btn');
						const theme = html.getAttribute('data-theme');
						btn.textContent = theme === 'light' ? '🌙' : '☀️';
					}

					function copyFeedUrl() {
						const url = window.location.href;
						navigator.clipboard.writeText(url).then(() => {
							const btn = event.target.closest('.subscribe-btn');
							const originalText = btn.innerHTML;
							btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
							setTimeout(() => {
								btn.innerHTML = originalText;
							}, 2000);
						});
					}

					updateThemeButton();
				</script>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
