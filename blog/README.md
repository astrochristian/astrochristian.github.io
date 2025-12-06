# Blog System

This is a simple, intuitive blog system that converts markdown files to HTML pages with support for embedded images and MathJax equations.

## Quick Start: Adding a New Post

### 1. Create a Markdown File

Create a new `.md` file in the `blog/posts/` directory with your content. The filename doesn't matter - the slug in the frontmatter determines the URL.

### 2. Add Frontmatter

At the top of your markdown file, add YAML frontmatter with metadata:

```markdown
---
title: Your Post Title
date: 2025-12-06
excerpt: A brief summary of your post that appears on the blog listing page
slug: your-post-url-slug
---

Your content starts here...
```

**Required fields:**
- `title`: The title of your blog post
- `date`: Publication date in YYYY-MM-DD format
- `excerpt`: Short description for the blog listing page (1-2 sentences)
- `slug`: URL-friendly identifier (will appear as `/blog/your-post-url-slug.html`)

### 3. Write Your Content

Write your content using standard markdown syntax. See the "Markdown Features" section below for all supported features.

### 4. Add Images (Optional)

To include images in your post:

1. Place your image files in the `blog/images/` directory
2. Reference them in your markdown:

```markdown
![Alt text description](images/your-image.jpg)
```

### 5. Build the Blog

Run the build script to convert your markdown to HTML:

```bash
cd blog
node build-blog.js
```

This will:
- Generate an HTML page for your post at `/blog/your-post-url-slug.html`
- Update the blog index at `/blog/posts-index.json`

### 6. Commit and Push

```bash
git add .
git commit -m "Add new blog post: Your Post Title"
git push
```

That's it! Your post is now live.

---

## Markdown Features

### Headers

```markdown
# H1 Header
## H2 Header
### H3 Header
```

### Text Formatting

```markdown
**Bold text**
*Italic text*
`inline code`
```

### Links

```markdown
[Link text](https://example.com)
```

### Images

```markdown
![Alt text](images/your-image.jpg)
```

Images are automatically:
- Responsive (max-width: 100%)
- Rounded with shadow effects
- Properly styled for both light and dark themes

### Code Blocks

````markdown
```python
def example_function():
    return "Hello, World!"
```
````

### Lists

Unordered:
```markdown
- Item 1
- Item 2
- Item 3
```

Ordered:
```markdown
1. First item
2. Second item
3. Third item
```

### Blockquotes

```markdown
> This is a blockquote
```

### Horizontal Rules

```markdown
---
```

### Math Equations (MathJax)

Inline math with `$` or `\(`:
```markdown
The speed of light is $c = 3 \times 10^8$ m/s.
```

Display math with `$$` or `\[`:
```markdown
$$
E = mc^2
$$
```

#### Advanced Math Examples

```markdown
$$
T_{21} \approx 27 \text{ mK} \left(\frac{\Omega_b h^2}{0.023}\right) \left(\frac{0.15}{\Omega_m h^2}\right)^{1/2} \left(\frac{1+z}{10}\right)^{1/2} (1 - T_{\gamma}/T_S)
$$
```

Greek letters: `$\alpha, \beta, \gamma, \Delta, \Omega$`

Fractions: `$\frac{a}{b}$`

Superscripts/subscripts: `$x^2, H_0$`

---

## File Structure

```
blog/
├── README.md                  # This file
├── build-blog.js             # Build script
├── post-template.html        # HTML template for posts
├── posts/                    # Your markdown files go here
│   └── welcome-to-my-blog.md
├── images/                   # Your images go here
│   └── (your images)
├── posts-index.json          # Auto-generated index (don't edit)
└── *.html                    # Auto-generated post pages (don't edit)
```

---

## Tips and Best Practices

### Writing Good Excerpts

Excerpts appear on the blog listing page. Keep them:
- 1-2 sentences
- Descriptive and engaging
- Free of markdown formatting

### Choosing Slugs

Slugs become the URL of your post. Good slugs are:
- Short and descriptive
- Lowercase with hyphens
- No special characters
- Example: `bayesian-calibration-reach` not `Bayesian_Calibration_for_REACH!!!`

### Image Best Practices

- Use descriptive filenames: `reach-telescope-karoo.jpg` not `IMG_1234.jpg`
- Optimize images before uploading (reasonable file size)
- Always include alt text for accessibility
- Common formats: `.jpg`, `.png`, `.svg`

### Math Rendering

- Use `$...$` for inline math that flows with text
- Use `$$...$$` for display equations on their own line
- Test your equations by checking the rendered page
- Common symbols:
  - Fractions: `\frac{numerator}{denominator}`
  - Greek: `\alpha, \beta, \gamma, \Omega`
  - Subscripts: `T_S`
  - Superscripts: `x^2`
  - Text in equations: `\text{your text}`

### Updating Existing Posts

1. Edit the `.md` file in `blog/posts/`
2. Run `node build-blog.js`
3. Commit and push

---

## Troubleshooting

### Build script not working?

Make sure you're in the `blog` directory:
```bash
cd /home/tachyon/website/astrochristian.github.io/blog
node build-blog.js
```

### Post not appearing on blog page?

Check:
1. Did you run the build script?
2. Is the frontmatter formatted correctly?
3. Is the date in YYYY-MM-DD format?
4. Clear browser cache and refresh

### Images not showing?

Check:
1. Image file is in `blog/images/` directory
2. Path in markdown is `images/your-file.jpg` (relative to blog/)
3. Filename matches exactly (case-sensitive)
4. File format is supported (.jpg, .png, .svg, etc.)

### Math not rendering?

- Wait for page to fully load (MathJax loads asynchronously)
- Check console for errors
- Ensure you're using `$...$` or `$$...$$` delimiters
- Escape special characters if needed

---

## Advanced Customization

### Modifying the Template

The HTML template is at `blog/post-template.html`. You can edit:
- Navigation structure
- Footer content
- Meta tags
- Styling (but prefer editing `assets/css/style.css`)

### Customizing Styles

Blog-specific styles are in `/assets/css/style.css` under the `/* Blog Styles */` section.

You can customize:
- Colors
- Typography
- Spacing
- Code block styling
- Image borders/shadows

### Extending the Build Script

The build script (`build-blog.js`) is a simple Node.js script. You can extend it to:
- Add syntax highlighting
- Generate RSS feeds
- Create tag/category systems
- Add reading time estimates

---

## Example Post Template

Save this as `blog/posts/my-new-post.md`:

```markdown
---
title: My Awesome Research Update
date: 2025-12-06
excerpt: A fascinating look at recent developments in 21-cm cosmology and what they mean for our understanding of the early universe.
slug: research-update-december-2025
---

## Introduction

Start your post with an engaging introduction...

### Key Points

- First important point
- Second important point
- Third important point

### The Math Behind It

Here's the key equation:

$$
\chi^2 = \sum_{i=1}^{N} \frac{(O_i - E_i)^2}{\sigma_i^2}
$$

### Code Example

```python
import numpy as np
import matplotlib.pyplot as plt

# Your code here
```

### Including an Image

![My research setup](images/my-setup.jpg)

## Conclusion

Wrap up your thoughts...

---

*Questions? Feel free to reach out!*
```

---

Happy blogging! 🚀
