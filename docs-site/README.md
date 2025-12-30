# CastQuest Documentation Site

Beautiful, searchable documentation powered by VitePress.

## 🚀 Quick Start

```bash
# Install dependencies (from workspace root)
pnpm install

# Start dev server
pnpm docs:dev

# Visit http://localhost:5173
```

## 📁 Structure

```
docs-site/
├── .vitepress/
│   └── config.ts          # VitePress configuration
├── guide/                  # User guides and tutorials
│   ├── getting-started.md
│   ├── installation.md
│   ├── quick-start.md
│   ├── environment-setup.md
│   └── concepts/          # Core concept documentation
├── architecture/          # System architecture docs
├── api/                   # API reference documentation
│   └── endpoints/         # Generated from OpenAPI spec
├── sdk/                   # SDK documentation
│   ├── introduction.md
│   ├── installation.md
│   └── api/              # Generated from TypeDoc
├── whitepaper/           # Protocol whitepaper
├── scripts/              # Documentation generation scripts
└── index.md              # Homepage
```

## 🛠️ Available Commands

### Development

```bash
# Start dev server with hot reload
pnpm docs:dev

# Build for production
pnpm docs:build

# Preview production build
pnpm docs:preview
```

### Documentation Generation

```bash
# Generate all documentation
pnpm docs:generate

# Generate SDK docs (TypeDoc)
pnpm docs:sdk

# Generate API docs (OpenAPI)
pnpm docs:api
```

## 📝 Writing Documentation

### Creating New Pages

1. Create a markdown file in the appropriate directory
2. Add frontmatter if needed:

```markdown
---
title: My Page Title
description: Page description for SEO
---

# My Page Title

Content here...
```

3. Add to `.vitepress/config.ts` sidebar if it should appear in navigation

### Using Mermaid Diagrams

```markdown
\`\`\`mermaid
graph TD
    A[Start] --> B[End]
\`\`\`
```

### Code Blocks with Highlighting

````markdown
```typescript
const client = new CastQuestClient({
  apiUrl: 'http://localhost:3010/api'
});
```
````

### Custom Containers

```markdown
::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a danger notice
:::
```

## 🤖 Automated Documentation

### TypeDoc (SDK Documentation)

SDK documentation is automatically generated from TypeScript source code:

```bash
pnpm docs:sdk
```

This reads from `packages/sdk/src/` and generates markdown in `docs-site/sdk/api/`.

Configuration: `packages/sdk/typedoc.json`

### OpenAPI (API Documentation)

API documentation is generated from the OpenAPI specification:

```bash
# 1. Start the admin dashboard
pnpm --filter ./apps/admin dev -- -p 3010

# 2. Generate docs (in another terminal)
pnpm docs:api
```

This fetches the spec from `http://localhost:3010/api/openapi` and generates markdown in `docs-site/api/endpoints/`.

Configuration: `docs-site/scripts/generate-openapi-docs.js`

## 🎨 Customization

### Theme Configuration

Edit `.vitepress/config.ts`:

```typescript
export default defineConfig({
  themeConfig: {
    logo: '/logo.svg',
    nav: [...],
    sidebar: {...},
    socialLinks: [...]
  }
})
```

### Custom Components

Create Vue components in `.vitepress/components/` and use them in markdown:

```markdown
<MyComponent :prop="value" />
```

## 🔍 Search

Local search is enabled by default:

```typescript
search: {
  provider: 'local'
}
```

For Algolia search, configure in `.vitepress/config.ts`.

## 📦 Deployment

### Build

```bash
pnpm docs:build
```

Output: `docs-site/.vitepress/dist/`

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd docs-site
vercel --prod
```

### Deploy to GitHub Pages

```bash
# Build
pnpm docs:build

# Deploy
cd docs-site/.vitepress/dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:CastQuest/castquest-frames.git master:gh-pages
```

### Deploy to Netlify

1. Connect your repository
2. Set build command: `pnpm docs:build`
3. Set publish directory: `docs-site/.vitepress/dist`

## 🐛 Troubleshooting

### Port Already in Use

Change the port in package.json:

```json
"dev": "vitepress dev --port 5174"
```

### Build Errors

Clear cache and rebuild:

```bash
rm -rf docs-site/.vitepress/cache
rm -rf docs-site/.vitepress/dist
pnpm docs:build
```

### TypeDoc Errors

Ensure SDK builds successfully:

```bash
cd packages/sdk
pnpm build
```

### OpenAPI Generation Fails

Ensure admin dashboard is running:

```bash
pnpm --filter ./apps/admin dev -- -p 3010
```

## 📚 Resources

- [VitePress Documentation](https://vitepress.dev/)
- [Markdown Extensions](https://vitepress.dev/guide/markdown)
- [TypeDoc Documentation](https://typedoc.org/)
- [OpenAPI Specification](https://swagger.io/specification/)

## 🤝 Contributing

See [CONTRIBUTING.md](../docs/CONTRIBUTING.md) for guidelines on contributing to documentation.

## 📄 License

MIT - See [LICENSE](../LICENSE) for details.
