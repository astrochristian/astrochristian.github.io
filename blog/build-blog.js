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

	// Code blocks (must come before inline code)
	html = html.replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

	// Inline code
	html = html.replace(/`(.+?)`/g, '<code>$1</code>');

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

		// Convert markdown to HTML
		const htmlContent = parseMarkdown(markdownContent);

		// Replace template placeholders
		let html = template;
		html = html.replace(/\{\{TITLE\}\}/g, title);
		html = html.replace(/\{\{DATE\}\}/g, date);
		html = html.replace(/\{\{FORMATTED_DATE\}\}/g, formatDate(date));
		html = html.replace(/\{\{CONTENT\}\}/g, htmlContent);

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

	console.log(`\nBlog built successfully! Generated ${postsIndex.length} post(s).`);
	console.log(`Posts index written to: blog/posts-index.json`);
}

// Run the build
try {
	buildBlog();
} catch (error) {
	console.error('Error building blog:', error);
	process.exit(1);
}
