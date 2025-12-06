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
						--primary-color: #667eea;
						--secondary-color: #764ba2;
						--text-dark: #1a1a2e;
						--text-medium: #4a4a5e;
						--text-light: #7a7a8e;
						--bg-light: #f5f5f7;
						--bg-white: #ffffff;
						--border-color: #e0e0e5;
						--nav-height: 70px;
						--spacing-sm: 0.5rem;
						--spacing-md: 1rem;
						--spacing-lg: 1.5rem;
						--spacing-xl: 2rem;
						--spacing-xxl: 3rem;
					}

					[data-theme="dark"] {
						--text-dark: #e4e4e7;
						--text-medium: #b0b0c0;
						--text-light: #8a8aa0;
						--bg-light: #0f0f1e;
						--bg-white: #1a1a2e;
						--border-color: #2a2a3e;
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
						max-width: 1000px;
						margin: 0 auto;
						padding: var(--spacing-lg);
					}

					/* Navigation */
					.navbar {
						background: var(--bg-white);
						box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
						padding: var(--spacing-md) var(--spacing-lg);
						position: sticky;
						top: 0;
						z-index: 100;
						margin-bottom: var(--spacing-xxl);
					}

					.navbar-brand {
						font-size: 1.25rem;
						font-weight: 700;
						color: var(--primary-color);
						text-decoration: none;
					}

					.navbar a {
						color: var(--text-dark);
						text-decoration: none;
						transition: color 0.2s;
					}

					.navbar a:hover {
						color: var(--primary-color);
					}

					/* Header */
					header {
						background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
						color: white;
						padding: var(--spacing-xxl) var(--spacing-lg);
						text-align: center;
						border-radius: 0.5rem;
						margin-bottom: var(--spacing-xxl);
						box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
						position: relative;
						overflow: hidden;
					}

					header::before {
						content: '';
						position: absolute;
						top: -50%;
						right: -10%;
						width: 300px;
						height: 300px;
						background: rgba(255, 255, 255, 0.05);
						border-radius: 50%;
						animation: float 6s ease-in-out infinite;
					}

					@keyframes float {
						0%, 100% { transform: translateY(0px); }
						50% { transform: translateY(20px); }
					}

					header h1 {
						font-size: 2.5rem;
						margin-bottom: var(--spacing-md);
						font-weight: 700;
						position: relative;
						z-index: 2;
					}

					header .subtitle {
						font-size: 1.1rem;
						opacity: 0.95;
						margin-bottom: var(--spacing-lg);
						position: relative;
						z-index: 2;
					}

					.rss-info {
						background: rgba(255, 255, 255, 0.15);
						padding: var(--spacing-lg);
						border-radius: 0.5rem;
						margin-top: var(--spacing-lg);
						backdrop-filter: blur(10px);
						border: 1px solid rgba(255, 255, 255, 0.2);
						position: relative;
						z-index: 2;
					}

					.rss-info p {
						margin: var(--spacing-sm) 0;
						font-size: 0.95rem;
					}

					.subscribe-buttons {
						display: flex;
						gap: var(--spacing-md);
						margin-top: var(--spacing-lg);
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
						border: none;
						cursor: pointer;
						font-size: 0.9rem;
						box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
					}

					.subscribe-btn:hover {
						transform: translateY(-3px);
						box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
					}

					.subscribe-btn svg {
						width: 18px;
						height: 18px;
					}

					/* Main content */
					main {
						background: var(--bg-white);
						border-radius: 0.5rem;
						box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
						padding: var(--spacing-xxl);
						margin-bottom: var(--spacing-xxl);
					}

					.feed-description {
						color: var(--text-medium);
						margin-bottom: var(--spacing-xxl);
						padding-bottom: var(--spacing-lg);
						border-bottom: 2px solid var(--border-color);
						font-size: 1rem;
						line-height: 1.8;
					}

					.posts-header {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: var(--spacing-xxl);
						padding-bottom: var(--spacing-lg);
						border-bottom: 3px solid var(--primary-color);
					}

					.posts-header h2 {
						color: var(--primary-color);
						font-size: 1.75rem;
						margin: 0;
					}

					.posts-count {
						background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
						color: white;
						padding: 0.5rem 1.25rem;
						border-radius: 2rem;
						font-weight: 600;
						font-size: 0.85rem;
						box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
					}

					/* Feed items */
					.feed-item {
						border: 1px solid var(--border-color);
						border-radius: 0.5rem;
						padding: var(--spacing-xl);
						margin-bottom: var(--spacing-xl);
						transition: all 0.2s;
						background: var(--bg-light);
					}

					.feed-item:hover {
						box-shadow: 0 6px 16px rgba(102, 126, 234, 0.12);
						border-color: var(--primary-color);
						background: var(--bg-white);
						transform: translateY(-2px);
					}

					.feed-item-title {
						font-size: 1.35rem;
						font-weight: 600;
						margin-bottom: var(--spacing-md);
						color: var(--text-dark);
					}

					.feed-item-title a {
						color: var(--primary-color);
						text-decoration: none;
						transition: color 0.2s;
					}

					.feed-item-title a:hover {
						color: var(--secondary-color);
						text-decoration: underline;
					}

					.feed-item-meta {
						display: flex;
						align-items: center;
						gap: var(--spacing-md);
						color: var(--text-light);
						font-size: 0.9rem;
						margin-bottom: var(--spacing-md);
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
						line-height: 1.8;
						margin-bottom: var(--spacing-lg);
						font-size: 0.95rem;
					}

					.feed-item-link {
						display: inline-block;
						padding: 0.6rem 1.25rem;
						background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
						color: white;
						text-decoration: none;
						border-radius: 0.35rem;
						font-size: 0.9rem;
						font-weight: 600;
						transition: all 0.2s;
						box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
					}

					.feed-item-link:hover {
						transform: translateY(-2px);
						box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
					}

					/* Footer */
					footer {
						text-align: center;
						color: var(--text-light);
						padding: var(--spacing-xl);
						border-top: 1px solid var(--border-color);
						font-size: 0.9rem;
						background: var(--bg-white);
						border-radius: 0.5rem;
						margin-top: var(--spacing-xxl);
					}

					footer a {
						color: var(--primary-color);
						text-decoration: none;
						transition: color 0.2s;
					}

					footer a:hover {
						text-decoration: underline;
					}

					/* Theme toggle */
					.theme-toggle-btn {
						position: fixed;
						bottom: 2rem;
						right: 2rem;
						width: 50px;
						height: 50px;
						border-radius: 50%;
						background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
						color: white;
						border: none;
						cursor: pointer;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 1.5rem;
						box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
						transition: all 0.3s;
						z-index: 1000;
					}

					.theme-toggle-btn:hover {
						transform: scale(1.1);
						box-shadow: 0 6px 16px rgba(102, 126, 234, 0.45);
					}

					/* Responsive */
					@media (max-width: 768px) {
						.container {
							padding: var(--spacing-md);
						}

						header {
							padding: var(--spacing-xl) var(--spacing-md);
						}

						header h1 {
							font-size: 1.75rem;
						}

						main {
							padding: var(--spacing-lg);
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
							gap: var(--spacing-md);
						}

						.posts-header h2 {
							font-size: 1.35rem;
						}
					}
				</style>
			</head>
			<body>
				<nav class="navbar">
					<div class="navbar-brand">
						<a href="https://astrochristian.github.io">← Back to AstroChristian</a>
					</div>
				</nav>

				<div class="container">
					<header>
						<h1>
							<xsl:value-of select="/rss/channel/title" />
						</h1>
						<p class="subtitle">
							<xsl:value-of select="/rss/channel/description" />
						</p>
						<div class="rss-info">
							<p>📡 This is an RSS Feed - Subscribe to get new posts delivered automatically</p>
							<div class="subscribe-buttons">
								<a href="#" class="subscribe-btn" onclick="copyFeedUrl(); return false;">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
										<rect x="8" y="2" width="8" height="4"></rect>
										<path d="M9 14l2 2 4-4"></path>
									</svg>
									Copy Feed URL
								</a>
								<a href="#" class="subscribe-btn" onclick="subscribeFeedly(); return false;">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<circle cx="12" cy="12" r="10"></circle>
										<path d="M12 6v6l4 2"></path>
									</svg>
									Subscribe in Feedly
								</a>
							</div>
						</div>
					</header>

					<main>
						<xsl:if test="/rss/channel/description">
							<p class="feed-description">
								<xsl:value-of select="/rss/channel/description" />
							</p>
						</xsl:if>

						<div class="posts-header">
							<h2>📝 Recent Posts</h2>
							<span class="posts-count">
								<xsl:value-of select="count(/rss/channel/item)" /> articles
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

					<footer>
						<p>
							<strong>
								<xsl:value-of select="/rss/channel/title" />
							</strong>
							<br/>
							Last updated: <xsl:value-of select="/rss/channel/lastBuildDate" />
							<br/>
							<a href="https://astrochristian.github.io">Visit Main Site</a> • <a href="https://github.com/astrochristian">GitHub</a>
						</p>
					</footer>
				</div>

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

					function subscribeFeedly() {
						const feedUrl = window.location.href;
						const feedlyUrl = `https://feedly.com/i/subscription/${encodeURIComponent(feedUrl)}`;
						window.open(feedlyUrl, '_blank');
					}

					updateThemeButton();
				</script>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
