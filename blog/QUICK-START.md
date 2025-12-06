# Quick Start: Adding a Blog Post

## The Easy Way (Fully Automatic)

1. **Create your post** - Add a new `.md` file in `blog/posts/`:

```markdown
---
title: My Amazing Post
date: 2025-12-06
excerpt: A short description of what this post is about
slug: my-amazing-post
---

## Your Content Here

Write your post using markdown, math equations, and images!

$$
E = mc^2
$$
```

2. **Add images** (optional) - Put them in `blog/images/`

3. **Push to GitHub**:
```bash
git add blog/posts/my-post.md blog/images/my-image.jpg
git commit -m "Add new blog post"
git push
```

4. **Done!** GitHub Actions will automatically:
   - Build your post to HTML
   - Update the blog index
   - Commit and deploy

Check your site in 1-2 minutes!

---

## Preview Locally (Two Ways)

### Option 1: Live Browser Preview (Easiest)

1. Open `blog/preview.html` in VSCode Live Server
2. Click "Choose File" and select your markdown file
3. See it rendered instantly with math and formatting!

No build step needed - it runs entirely in the browser.

### Option 2: Build Script

```bash
cd blog
node build-blog.js
```

Then open `blog/your-slug.html` in a browser.

---

## Markdown Cheat Sheet

### Math
```markdown
Inline: $E = mc^2$
Display: $$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$
```

### Images
```markdown
![Description](images/my-image.jpg)
```

### Code
````markdown
```python
def hello():
    print("Hello, World!")
```
````

### Formatting
```markdown
**bold** *italic* `code`
[link](https://example.com)
> blockquote
```

---

That's it! Just write markdown and push. The rest is automatic.
