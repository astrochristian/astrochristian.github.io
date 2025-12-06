#!/usr/bin/env node

/**
 * This script updates the last-updated timestamp in all HTML pages
 * It reads the latest git commit date and injects it into the footer of each page
 * Run this as part of your build/deploy process
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// List of HTML files to update
const htmlFiles = [
  'index.html',
  'research.html',
  'talks.html',
  'blog.html',
  'misc.html',
  'contact.html'
];

try {
  // Get the latest commit date in ISO format
  const commitDate = execSync('git log -1 --format=%cI', { encoding: 'utf-8' }).trim();
  
  // Parse and format the date
  const date = new Date(commitDate);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const timestampElement = `<p class="last-updated">Last updated: ${formattedDate}</p>`;
  
  // Update each HTML file
  htmlFiles.forEach(filename => {
    const filePath = path.join(__dirname, filename);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠ File not found: ${filename}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // Replace the timestamp placeholder
    if (content.includes('<!-- LAST_UPDATED -->')) {
      content = content.replace('<!-- LAST_UPDATED -->', timestampElement);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ Updated ${filename}`);
    } else {
      console.warn(`⚠ No placeholder found in ${filename}`);
    }
  });
  
  console.log(`\n✓ All pages updated to: ${formattedDate}`);
} catch (error) {
  console.error('Error updating timestamp:', error.message);
  process.exit(1);
}
