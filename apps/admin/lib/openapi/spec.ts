/**
 * OpenAPI 3.0 Specification for CastQuest Protocol API
 * 
 * This specification documents all API endpoints, request/response schemas,
 * and authentication requirements for the CastQuest Protocol.
 */

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'CastQuest Protocol API',
    version: '0.1.0',
    description: `
REST API for managing frames, quests, mints, and media in the CastQuest Protocol.

## Features

- Frame creation and rendering
- Multi-step quest management
- Collectible mint operations
- Template-based frame generation
- AI-powered suggestions via Smart Brain
- Strategy worker automation

## Base URL

\`\`\`
http://localhost:3001/api  # Development
https://api.castquest.xyz/api  # Production
\`\`\`
    `,
    contact: {
      name: 'CastQuest Team',
      url: 'https://github.com/CastQuest/castquest-frames',
      email: 'team@castquest.xyz'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001/api',
      description: 'Local development server'
    },
    {
      url: 'https://api.castquest.xyz/api',
      description: 'Production API server'
    }
  ],
  tags: [
    { name: 'Quests', description: 'Quest creation and management' },
    { name: 'Frames', description: 'Frame rendering and validation' },
    { name: 'Frame Templates', description: 'Reusable frame templates' },
    { name: 'Mints', description: 'Collectible mint operations' },
    { name: 'Media', description: 'Media asset management' },
    { name: 'BASE Chain', description: 'Mock blockchain operations' },
    { name: 'Strategy Worker', description: 'Autonomous worker operations' },
    { name: 'Smart Brain', description: 'AI-powered suggestions' }
  ],
  paths: {
    '/quests/create': {
      post: {
        tags: ['Quests'],
        summary: 'Create a new quest',
        description: 'Creates a new multi-step quest with the provided details',
        operationId: 'createQuest',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: {
                    type: 'string',
                    description: 'Quest name',
                    minLength: 3,
                    example: 'Complete Tutorial'
                  },
                  description: {
                    type: 'string',
                    description: 'Quest description',
                    example: 'Learn the basics of CastQuest Protocol'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Quest created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean', example: true },
                    quest: { $ref: '#/components/schemas/Quest' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/quests': {
      get: {
        tags: ['Quests'],
        summary: 'List all quests',
        description: 'Returns all quests from the data store',
        operationId: 'listQuests',
        responses: {
          '200': {
            description: 'List of quests',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    quests: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Quest' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/quests/add-step': {
      post: {
        tags: ['Quests'],
        summary: 'Add step to quest',
        description: 'Adds a new step to an existing quest',
        operationId: 'addQuestStep',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['questId', 'stepName'],
                properties: {
                  questId: { type: 'string', example: 'quest_1234567890' },
                  stepName: { type: 'string', example: 'Connect Wallet' },
                  requirements: { type: 'object' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Step added successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    step: { $ref: '#/components/schemas/QuestStep' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/frame-templates/create': {
      post: {
        tags: ['Frame Templates'],
        summary: 'Create a frame template',
        description: 'Creates a reusable frame template with parameters',
        operationId: 'createFrameTemplate',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FrameTemplateInput' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Template created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    template: { $ref: '#/components/schemas/FrameTemplate' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/frame-templates/apply': {
      post: {
        tags: ['Frame Templates'],
        summary: 'Apply template to generate frame',
        description: 'Applies a template with provided parameters to generate a frame',
        operationId: 'applyFrameTemplate',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['templateId', 'parameters'],
                properties: {
                  templateId: { type: 'string' },
                  parameters: { type: 'object' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Frame generated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    frame: { $ref: '#/components/schemas/Frame' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/mints/create': {
      post: {
        tags: ['Mints'],
        summary: 'Create a mint',
        description: 'Creates a new collectible mint',
        operationId: 'createMint',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MintInput' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Mint created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    mint: { $ref: '#/components/schemas/Mint' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/mints/simulate': {
      post: {
        tags: ['Mints'],
        summary: 'Simulate mint claim',
        description: 'Simulates a mint claim to validate before execution',
        operationId: 'simulateMintClaim',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['mintId', 'address'],
                properties: {
                  mintId: { type: 'string' },
                  address: { type: 'string', example: '0x1234...' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Simulation result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    canClaim: { type: 'boolean' },
                    reason: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/strategy/worker/scan': {
      post: {
        tags: ['Strategy Worker'],
        summary: 'Scan for pending actions',
        description: 'Scans the system for pending strategy worker actions',
        operationId: 'scanWorkerActions',
        responses: {
          '200': {
            description: 'Scan completed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    pending: { type: 'number', example: 5 },
                    actions: {
                      type: 'array',
                      items: { type: 'object' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/brain/suggest': {
      post: {
        tags: ['Smart Brain'],
        summary: 'Get AI suggestions',
        description: 'Request AI-powered suggestions for a given context',
        operationId: 'getBrainSuggestions',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['context', 'type'],
                properties: {
                  context: { 
                    type: 'string',
                    example: 'I want to create an engaging quest'
                  },
                  type: { 
                    type: 'string',
                    enum: ['quest', 'frame', 'template'],
                    example: 'quest'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Suggestions generated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    suggestions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          text: { type: 'string' },
                          confidence: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Quest: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'quest_1234567890' },
          name: { type: 'string', example: 'Complete Tutorial' },
          description: { type: 'string', example: 'Learn the basics' },
          steps: {
            type: 'array',
            items: { type: 'string' }
          },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      QuestStep: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          questId: { type: 'string' },
          name: { type: 'string' },
          order: { type: 'number' },
          requirements: { type: 'object' }
        }
      },
      FrameTemplate: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          parameters: { 
            type: 'object',
            additionalProperties: true
          },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      FrameTemplateInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 3 },
          description: { type: 'string' },
          parameters: { type: 'object' }
        }
      },
      Frame: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          templateId: { type: 'string' },
          author: {
            type: 'object',
            properties: {
              address: { type: 'string' },
              handle: { type: 'string' }
            }
          },
          actions: {
            type: 'array',
            items: { type: 'object' }
          },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Mint: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          supply: { type: 'number', example: 100 },
          claimed: { type: 'number', example: 25 },
          price: { type: 'string', example: '0.001' },
          currency: { type: 'string', example: 'ETH' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      MintInput: {
        type: 'object',
        required: ['name', 'supply'],
        properties: {
          name: { type: 'string', minLength: 3 },
          supply: { type: 'number', minimum: 1 },
          price: { type: 'string' },
          currency: { type: 'string', default: 'ETH' },
          description: { type: 'string' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Invalid input parameters' },
              details: { type: 'object' }
            }
          }
        }
      }
    },
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-CastQuest-Key',
        description: 'API key for server-to-server authentication'
      },
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token for user authentication'
      }
    }
  },
  security: [
    { ApiKeyAuth: [] },
    { BearerAuth: [] }
  ]
};
