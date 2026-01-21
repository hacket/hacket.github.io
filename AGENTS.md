# AGENTS.md

This document provides guidelines for agentic coding agents working on this Jekyll-based static site.

## Build/Lint/Test Commands

### Development
- **Start dev server**: `bundle exec jekyll s -l` (or `./tools/run.sh`)
  - Options: `-H <host>`, `-p` for production mode
  - Server runs on `127.0.0.1:4000` by default with live reload

- **Install dependencies**: `bundle install`
  - Requires Ruby 3.3+
  - Uses jekyll-theme-chirpy ~7.2

### Production Build
- **Build site**: `bundle exec jekyll b -d "_site"` (or `./tools/test.sh`)
  - Production mode: `JEKYLL_ENV=production bundle exec jekyll b`

- **Test links**: `bundle exec htmlproofer _site --disable-external --ignore-urls "/^http:\/\/127.0.0.1/,/^http:\/\/0.0.0.0/,/^http:\/\/localhost/"`
  - Tests internal links only
  - Excludes localhost/127.0.0.1/0.0.0.0 URLs

### Single File Operations
- **Test specific post**: Build and check for errors in the post's markdown
- **Validate YAML**: Check front matter syntax in any `.md` or `.yml` file

## Code Style Guidelines

### General Formatting (.editorconfig)
- **Encoding**: UTF-8
- **Indentation**: 2 spaces (no tabs)
- **Line endings**: Unix-style (LF)
- **Trailing whitespace**: Trim (except Markdown)
- **Final newline**: Yes

### File-specific Styles

**YAML files** (.yml, front matter):
- Use double quotes for strings
- Follow Jekyll front matter conventions
- Categories/tags as YAML arrays: `categories: [AI, Development]`
- Date format: `YYYY-MM-DD HH:mm:ss` or ISO format

**JavaScript/CSS/SCSS**:
- Use single quotes for strings
- Follow standard Prettier formatting
- Libraries located in `assets/lib/`

**Markdown** (.md):
- Do NOT trim trailing whitespace
- Front matter at the top (between `---` markers)
- Use Jekyll/Liquid syntax for dynamic content
- Chinese language support (site.lang: zh-CN)
- Categories: organize posts in `_posts/category/` directories
- Post filenames: `YYYY-MM-DD-title.md`

**HTML**:
- Treated as Liquid templates
- Use Shopify.theme-check-vscode formatter
- Liquid tags with `{% %}` and output with `{{ }}`

**Ruby**:
- Frozen string literal: `# frozen_string_literal: true` at file top
- Follow standard Ruby conventions
- Plugins in `_plugins/` directory

**Shell scripts**:
- Use shfmt formatter
- Shebang: `#!/usr/bin/env bash` or `#!/usr/bin/env ruby`

### Naming Conventions

**Posts**: Organize by category in subdirectories:
```
_posts/
  01-Android/
  02-Swiss-Army-Knife/
  03-Computer-Basics/
  04-Full-Stack/
  05-Tools/
  06-AI/
```

**Files**: kebab-case preferred for most files
**Front matter keys**: Use kebab-case or snake_case consistently

### Error Handling

- Jekyll provides build errors for invalid YAML/Liquid syntax
- Check build output for line numbers and error descriptions
- Validate front matter structure matches Jekyll expectations
- Use htmlproofer to catch broken links before deployment

### Content Guidelines

- Default layout for posts: `layout: post`
- Default layout for pages: `layout: page`
- TOC enabled by default in posts
- Comments enabled by default in posts
- Use Chinese for content (site configured for zh-CN)
- Support for categories, tags, and archives built-in

### Theme-specific Notes

This site uses **jekyll-theme-chirpy**:
- Check theme docs: https://github.com/cotes2020/jekyll-theme-chirpy/wiki
- Custom styles should go in appropriate theme override locations
- PWA enabled with caching
- MathJax included for mathematical notation
- Mermaid diagrams supported

### Testing Workflow

Before committing changes:
1. Run `bundle exec jekyll b` to check for build errors
2. Optionally run `bundle exec htmlproofer _site --disable-external` to verify links
3. Test locally with `bundle exec jekyll s -l` to preview changes
