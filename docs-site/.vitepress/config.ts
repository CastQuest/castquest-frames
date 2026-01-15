import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'CastQuest Protocol',
  description: 'Sovereign, composable protocol for Farcaster frames and onchain quests',
  
  base: '/',
  
  // Ignore localhost URLs in documentation examples
  ignoreDeadLinks: [
    // Ignore localhost URLs (valid in development examples)
    /^http:\/\/localhost:\d+/,
    // Ignore advanced guide links (to be created in future)
    '/sdk/examples/validation',
    '/sdk/examples/quest-integration',
    '/sdk/examples/transactions',
    '/guide/advanced/monitoring',
    '/guide/advanced/scaling',
    '/guide/advanced/worker-patterns',
    '/guide/advanced/ai-best-practices',
  ],
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'V3', link: '/v3/index' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Architecture', link: '/architecture/overview' },
      { text: 'API Reference', link: '/api/overview' },
      { text: 'SDK', link: '/sdk/introduction' },
      { text: 'Whitepaper', link: '/whitepaper/vision' }
    ],

    sidebar: {
      '/v3/': [
        {
          text: 'CastQuest V3',
          items: [
            { text: 'Overview', link: '/v3/index' },
            { text: 'Architecture', link: '/v3/architecture' }
          ]
        },
        {
          text: 'Protocol',
          items: [
            { text: 'Constitution', link: '/v3/protocol/constitution' },
            { text: 'AI DAO Constitution', link: '/v3/protocol/ai-dao-constitution' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Tokenomics', link: '/v3/overview/tokenomics' },
            { text: 'Agents', link: '/v3/agents/overview' },
            { text: 'Marketplace', link: '/v3/marketplace/overview' },
            { text: 'Builders', link: '/v3/builders/overview' }
          ]
        }
      ],

      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Environment Setup', link: '/guide/environment-setup' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Frames', link: '/guide/concepts/frames' },
            { text: 'Quests', link: '/guide/concepts/quests' },
            { text: 'Mints', link: '/guide/concepts/mints' },
            { text: 'Templates', link: '/guide/concepts/templates' },
            { text: 'Smart Brain', link: '/guide/concepts/smart-brain' }
          ]
        },
        {
          text: 'Tutorials',
          items: [
            { text: 'Create Your First Quest', link: '/guide/tutorials/first-quest' },
            { text: 'Build a Custom Frame', link: '/guide/tutorials/custom-frame' },
            { text: 'Apply Frame Templates', link: '/guide/tutorials/frame-templates' },
            { text: 'Deploy to Production', link: '/guide/tutorials/deployment' }
          ]
        }
      ],

      '/architecture/': [
        {
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/architecture/overview' },
            { text: 'Modules', link: '/architecture/modules' },
            { text: 'Data Flow', link: '/architecture/flows' },
            { text: 'Smart Brain Runtime', link: '/architecture/smart-brain' }
          ]
        },
        {
          text: 'Modules Deep Dive',
          items: [
            { text: 'M4: BASE API & Objects', link: '/architecture/modules/m4-objects' },
            { text: 'M5B: Quest Engine', link: '/architecture/modules/m5b-quests' },
            { text: 'M6: Frame Templates', link: '/architecture/modules/m6-templates' },
            { text: 'M7: Mint & Render Engine', link: '/architecture/modules/m7-engine' },
            { text: 'M8: Smart Brain', link: '/architecture/modules/m8-brain' }
          ]
        }
      ],

      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/overview' },
            { text: 'Authentication', link: '/api/authentication' },
            { text: 'Error Handling', link: '/api/errors' },
            { text: 'Rate Limits', link: '/api/rate-limits' }
          ]
        },
        {
          text: 'Endpoints',
          items: [
            { text: 'Quests', link: '/api/endpoints/quests' },
            { text: 'Frames', link: '/api/endpoints/frames' },
            { text: 'Frame Templates', link: '/api/endpoints/frame-templates' },
            { text: 'Mints', link: '/api/endpoints/mints' },
            { text: 'Media', link: '/api/endpoints/media' },
            { text: 'BASE Chain', link: '/api/endpoints/base' },
            { text: 'Strategy Worker', link: '/api/endpoints/strategy' },
            { text: 'Smart Brain', link: '/api/endpoints/brain' }
          ]
        }
      ],

      '/sdk/': [
        {
          text: 'SDK Documentation',
          items: [
            { text: 'Introduction', link: '/sdk/introduction' },
            { text: 'Installation', link: '/sdk/installation' },
            { text: 'Quick Start', link: '/sdk/quick-start' },
            { text: 'Configuration', link: '/sdk/configuration' }
          ]
        },
        {
          text: 'Core Modules',
          items: [
            { text: 'Frames Client', link: '/sdk/modules/frames-client' },
            { text: 'Quest Manager', link: '/sdk/modules/quest-manager' },
            { text: 'Template Engine', link: '/sdk/modules/template-engine' },
            { text: 'Mint Controller', link: '/sdk/modules/mint-controller' }
          ]
        },
        {
          text: 'Examples',
          items: [
            { text: 'Basic Usage', link: '/sdk/examples/basic' },
            { text: 'Frame Validation', link: '/sdk/examples/validation' },
            { text: 'Quest Integration', link: '/sdk/examples/quest-integration' },
            { text: 'Transaction Building', link: '/sdk/examples/transactions' }
          ]
        }
      ],

      '/whitepaper/': [
        {
          text: 'Whitepaper',
          items: [
            { text: 'Vision & Problem', link: '/whitepaper/vision' },
            { text: 'Protocol Design', link: '/whitepaper/protocol' },
            { text: 'Technical Architecture', link: '/whitepaper/architecture' },
            { text: 'Token Economics', link: '/whitepaper/tokenomics' },
            { text: 'Roadmap', link: '/whitepaper/roadmap' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/CastQuest/castquest-frames' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 CastQuest Protocol'
    },

    editLink: {
      pattern: 'https://github.com/CastQuest/castquest-frames/edit/main/docs-site/:path'
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'CastQuest Protocol | Sovereign Frames & Onchain Quests' }],
    ['meta', { property: 'og:site_name', content: 'CastQuest Protocol' }],
    ['meta', { property: 'og:url', content: 'https://docs.castquest.xyz/' }]
  ]
})
