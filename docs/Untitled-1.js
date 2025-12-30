// docs-site/.vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'CastQuest Protocol',
  description: 'Sovereign, composable protocol for Farcaster frames and onchain quests',
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Architecture', link: '/architecture/overview' },
      { text: 'API Reference', link: '/api/overview' },
      { text: 'SDK', link: '/sdk/introduction' },
      { text: 'Whitepaper', link: '/whitepaper/vision' }
    ],

    sidebar: {
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
            { text: 'Templates', link: '/guide/concepts/templates' }
          ]
        },
        {
          text: 'Tutorials',
          items: [
            { text: 'Create Your First Quest', link: '/guide/tutorials/first-quest' },
            { text: 'Build a Custom Frame', link: '/guide/tutorials/custom-frame' },
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
            { text: 'Smart Brain', link: '/architecture/smart-brain' }
          ]
        },
        {
          text: 'Modules Deep Dive',
          items: [
            { text: 'M4: Objects', link: '/architecture/modules/m4-objects' },
            { text: 'M5B: Quests', link: '/architecture/modules/m5b-quests' },
            { text: 'M6: Templates', link: '/architecture/modules/m6-templates' },
            { text: 'M7: Engine', link: '/architecture/modules/m7-engine' },
            { text: 'M8: Brain', link: '/architecture/modules/m8-brain' }
          ]
        }
      ],

      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/overview' },
            { text: 'Authentication', link: '/api/authentication' },
            { text: 'Error Handling', link: '/api/errors' }
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
            { text: 'Quick Start', link: '/sdk/quick-start' }
          ]
        },
        {
          text: 'API Reference',
          link: '/sdk/api/index'
        },
        {
          text: 'Examples',
          items: [
            { text: 'Basic Usage', link: '/sdk/examples/basic' },
            { text: 'Frame Validation', link: '/sdk/examples/validation' },
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
            { text: 'Architecture', link: '/whitepaper/architecture' },
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
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  }
})