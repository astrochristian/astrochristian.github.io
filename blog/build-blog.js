#!/usr/bin/env node

/**
 * Blog Post Builder
 *
 * Converts markdown blog posts to HTML pages using the post template.
 *
 * Usage:
 *   node build-blog.js
 *
 * This script:
 * 1. Reads all .md files from the posts/ directory
 * 2. Extracts YAML frontmatter (title, date, excerpt)
 * 3. Converts markdown to HTML
 * 4. Generates individual HTML pages for each post
 * 5. Creates an index JSON file for the blog listing page
 */

const fs = require('fs');
const path = require('path');

// Simple markdown parser
function parseMarkdown(markdown) {
	let html = markdown;

	// Store math expressions to protect them from markdown processing
	const mathExpressions = [];
	let mathIndex = 0;

	// Protect display math ($$...$$)
	html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match) => {
		const placeholder = `ĦĦĦMATHDISPLAYĦĦĦ${mathIndex}ĦĦĦENDĦĦĦ`;
		mathExpressions[mathIndex] = match; // match already includes $$
		mathIndex++;
		return placeholder;
	});

	// Protect inline math ($...$)
	html = html.replace(/\$(.+?)\$/g, (match) => {
		const placeholder = `ĦĦĦMATHINLINEĦĦĦ${mathIndex}ĦĦĦENDĦĦĦ`;
		mathExpressions[mathIndex] = match; // match already includes $
		mathIndex++;
		return placeholder;
	});

	// Code blocks (must come before inline code)
	html = html.replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

	// Inline code
	html = html.replace(/`(.+?)`/g, '<code>$1</code>');

	// Headers
	html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
	html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
	html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

	// Bold
	html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
	html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

	// Italic
	html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
	html = html.replace(/_(.+?)_/g, '<em>$1</em>');

	// Images
	html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />');

	// Links
	html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

	// Blockquotes
	html = html.replace(/^\> (.+)/gim, '<blockquote>$1</blockquote>');

	// Horizontal rules
	html = html.replace(/^---$/gim, '<hr />');

	// Unordered lists
	html = html.replace(/^\* (.+)/gim, '<li>$1</li>');
	html = html.replace(/^- (.+)/gim, '<li>$1</li>');
	html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

	// Ordered lists
	html = html.replace(/^\d+\. (.+)/gim, '<li>$1</li>');

	// Line breaks
	html = html.replace(/\n\n/g, '</p><p>');

	// Wrap in paragraphs if not already wrapped
	html = html.split('\n').map(line => {
		// Don't wrap if already a block element
		if (line.match(/^<(h[1-6]|ul|ol|li|blockquote|pre|hr|div|img)/)) {
			return line;
		}
		// Don't wrap empty lines
		if (line.trim() === '') {
			return line;
		}
		// Don't wrap closing tags
		if (line.match(/^<\//)) {
			return line;
		}
		// Wrap everything else
		return line;
	}).join('\n');

	// Clean up multiple paragraph tags
	html = html.replace(/<p><\/p>/g, '');
	html = html.replace(/<p>\s*<\/p>/g, '');

	// Restore math expressions
	mathExpressions.forEach((math, index) => {
		if (math.startsWith('$$')) {
			html = html.replace(`ĦĦĦMATHDISPLAYĦĦĦ${index}ĦĦĦENDĦĦĦ`, math);
		} else {
			html = html.replace(`ĦĦĦMATHINLINEĦĦĦ${index}ĦĦĦENDĦĦĦ`, math);
		}
	});

	return html;
}

// Extract frontmatter from markdown
function extractFrontmatter(content) {
	const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
	const match = content.match(frontmatterRegex);

	if (!match) {
		return {
			frontmatter: {},
			content: content
		};
	}

	const frontmatterText = match[1];
	const markdownContent = match[2];

	const frontmatter = {};
	frontmatterText.split('\n').forEach(line => {
		const colonIndex = line.indexOf(':');
		if (colonIndex !== -1) {
			const key = line.substring(0, colonIndex).trim();
			const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
			frontmatter[key] = value;
		}
	});

	return {
		frontmatter,
		content: markdownContent
	};
}

// Generate slug from title
function generateSlug(title) {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

// Format date
function formatDate(dateString) {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

// Build all blog posts
function buildBlog() {
	const postsDir = path.join(__dirname, 'posts');
	const templatePath = path.join(__dirname, 'post-template.html');
	const outputDir = path.join(__dirname, '..');

	// Read template
	const template = fs.readFileSync(templatePath, 'utf8');

	// Read all markdown files
	const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

	const postsIndex = [];

	files.forEach(file => {
		const filePath = path.join(postsDir, file);
		const content = fs.readFileSync(filePath, 'utf8');

		const { frontmatter, content: markdownContent } = extractFrontmatter(content);

		const title = frontmatter.title || 'Untitled Post';
		const date = frontmatter.date || new Date().toISOString().split('T')[0];
		const excerpt = frontmatter.excerpt || '';
		const slug = frontmatter.slug || generateSlug(title);
		const writtenBy = frontmatter['written-by'] || 'human';

		// Convert markdown to HTML
		const htmlContent = parseMarkdown(markdownContent);

		// Generate Claude badge HTML if written by Claude
		const claudeBadgeHTML = writtenBy === 'claude' ? `
			<div class="claude-badge">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="16" height="16" class="claude-icon">
					<path d="M64 0 C28.7 0 0 28.7 0 64 C0 99.3 28.7 128 64 128 C99.3 128 128 99.3 128 64 C128 28.7 99.3 0 64 0 Z" fill="#1B1B1B"/>
					<text x="64" y="85" font-size="80" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial">C</text>
				</svg>
				<span>Written with Claude</span>
			</div>
		` : '';

		// Replace template placeholders
		let html = template;
		html = html.replace(/\{\{TITLE\}\}/g, title);
		html = html.replace(/\{\{DATE\}\}/g, date);
		html = html.replace(/\{\{FORMATTED_DATE\}\}/g, formatDate(date));
		html = html.replace(/\{\{CONTENT\}\}/g, htmlContent);
		html = html.replace(/\{\{CLAUDE_BADGE\}\}/g, claudeBadgeHTML);

		// Write HTML file
		const outputPath = path.join(outputDir, 'blog', `${slug}.html`);
		fs.writeFileSync(outputPath, html);

		console.log(`Generated: ${slug}.html`);

		// Add to index
		postsIndex.push({
			title,
			date,
			excerpt,
			slug
		});
	});

	// Write posts index
	const indexPath = path.join(outputDir, 'blog', 'posts-index.json');
	fs.writeFileSync(indexPath, JSON.stringify(postsIndex, null, 2));

	// Sort posts by date (newest first)
	const sortedPosts = postsIndex.sort((a, b) => new Date(b.date) - new Date(a.date));

	// Generate RSS feed
	generateRSSFeed(sortedPosts, outputDir);

	// Generate blog index page
	generateBlogIndex(sortedPosts, outputDir);

	console.log(`\nBlog built successfully! Generated ${postsIndex.length} post(s).`);
	console.log(`Posts index written to: blog/posts-index.json`);
	console.log(`RSS feed written to: blog/rss.xml`);
	console.log(`Blog index written to: blog/index.html`);
}

// Generate RSS feed
function generateRSSFeed(posts, outputDir) {
	const baseUrl = 'https://astrochristian.github.io';
	const blogUrl = `${baseUrl}/blog`;
	const buildDate = new Date().toUTCString();

	let rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/blog/rss-stylesheet.xsl"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<channel>
		<title>AstroChristian Blog</title>
		<link>${blogUrl}/</link>
		<description>Exploring radio cosmology, 21-cm science, and the beautiful intersection of astronomy and philosophy</description>
		<language>en-us</language>
		<lastBuildDate>${buildDate}</lastBuildDate>
		<image>
			<url>${baseUrl}/assets/images/logo.png</url>
			<title>AstroChristian Blog</title>
			<link>${blogUrl}/</link>
		</image>
`;

	posts.forEach(post => {
		const postUrl = `${blogUrl}/${post.slug}.html`;
		const pubDate = new Date(post.date).toUTCString();

		rssContent += `
		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${postUrl}</link>
			<guid>${postUrl}</guid>
			<pubDate>${pubDate}</pubDate>
			<description>${escapeXml(post.excerpt)}</description>
		</item>
`;
	});

	rssContent += `
	</channel>
</rss>`;

	const rssPath = path.join(outputDir, 'blog', 'rss.xml');
	fs.writeFileSync(rssPath, rssContent);
}

// Generate blog index page
function generateBlogIndex(posts, outputDir) {
	const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Blog - AstroChristian</title>
	<link rel="stylesheet" href="../assets/css/style.css">
	<link rel="alternate" type="application/rss+xml" href="rss.xml" title="AstroChristian Blog RSS Feed">
</head>
<body>
	<div class="container">
		<nav class="navbar">
			<div class="navbar-brand">
				<a href="/">AstroChristian</a>
			</div>
			<ul class="nav-links">
				<li><a href="/index.html">Home</a></li>
				<li><a href="/research.html">Research</a></li>
				<li><a href="/blog/">Blog</a></li>
				<li><a href="/talks.html">Talks</a></li>
				<li><a href="/contact.html">Contact</a></li>
			</ul>
		</nav>

		<main class="blog-container">
			<header class="blog-header">
				<h1>Blog</h1>
				<p class="blog-description">Exploring radio cosmology, 21-cm science, and the beautiful intersection of astronomy and philosophy</p>
				<a href="rss.xml" class="rss-link">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M4 11a9 9 0 0 1 9 9"></path>
						<path d="M4 4a16 16 0 0 1 16 16"></path>
						<circle cx="5" cy="19" r="1"></circle>
					</svg>
					Subscribe to RSS Feed
				</a>
			</header>

			<section class="blog-posts-list">
${posts.map(post => `
				<article class="blog-post-preview">
					<h2 class="blog-post-title">
						<a href="${post.slug}.html">${post.title}</a>
					</h2>
					<time class="blog-post-date" datetime="${post.date}">
						${formatDate(post.date)}
					</time>
					<p class="blog-post-excerpt">${post.excerpt}</p>
					<a href="${post.slug}.html" class="read-more">Read More →</a>
				</article>
`).join('')}
			</section>
		</main>
	</div>

	<style>
		.blog-header {
			margin-bottom: 3rem;
			text-align: center;
		}

		.blog-header h1 {
			font-size: 2.5rem;
			margin-bottom: 0.5rem;
			color: var(--text-color);
		}

		.blog-description {
			font-size: 1.1rem;
			color: var(--text-secondary);
			margin-bottom: 1.5rem;
		}

		.rss-link {
			display: inline-flex;
			align-items: center;
			gap: 0.5rem;
			padding: 0.75rem 1.5rem;
			background: var(--accent-color, #4a90e2);
			color: white;
			text-decoration: none;
			border-radius: 0.5rem;
			transition: background 0.2s;
		}

		.rss-link:hover {
			background: var(--accent-hover, #357abd);
		}

		.blog-posts-list {
			display: flex;
			flex-direction: column;
			gap: 2rem;
		}

		.blog-post-preview {
			padding: 1.5rem;
			border: 1px solid var(--border-color, #e0e0e0);
			border-radius: 0.5rem;
			background: var(--background-secondary, white);
			transition: box-shadow 0.2s;
		}

		.blog-post-preview:hover {
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		}

		.blog-post-title {
			margin: 0 0 0.5rem 0;
			font-size: 1.5rem;
		}

		.blog-post-title a {
			color: var(--link-color, #4a90e2);
			text-decoration: none;
		}

		.blog-post-title a:hover {
			text-decoration: underline;
		}

		.blog-post-date {
			display: block;
			font-size: 0.9rem;
			color: var(--text-secondary);
			margin-bottom: 1rem;
		}

		.blog-post-excerpt {
			margin: 0.5rem 0;
			color: var(--text-color);
			line-height: 1.6;
		}

		.read-more {
			display: inline-block;
			margin-top: 1rem;
			color: var(--link-color, #4a90e2);
			text-decoration: none;
			font-weight: 500;
			transition: color 0.2s;
		}

		.read-more:hover {
			color: var(--link-hover, #357abd);
		}

		[data-theme="dark"] .blog-post-preview {
			background: var(--background-secondary, #1a1a1a);
			border-color: #333;
		}

		[data-theme="dark"] .blog-post-preview:hover {
			box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
		}
	</style>

	<script>
		// Theme toggle (matching existing site behavior)
		const savedTheme = localStorage.getItem('theme') || 'light';
		document.documentElement.setAttribute('data-theme', savedTheme);

		function toggleTheme() {
			const current = document.documentElement.getAttribute('data-theme');
			const next = current === 'light' ? 'dark' : 'light';
			document.documentElement.setAttribute('data-theme', next);
			localStorage.setItem('theme', next);
		}
	</script>
</body>
</html>`;

	const indexPath = path.join(outputDir, 'blog', 'index.html');
	fs.writeFileSync(indexPath, htmlContent);
}

// Escape XML special characters
function escapeXml(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

// Run the build
try {
	buildBlog();
} catch (error) {
	console.error('Error building blog:', error);
	process.exit(1);
}
