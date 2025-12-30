#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generates API documentation from OpenAPI spec
 * Fetches spec from running admin server and creates markdown docs
 */

async function generateOpenApiDocs() {
  const specUrl = 'http://localhost:3001/api/openapi';
  
  console.log('📡 Fetching OpenAPI spec from', specUrl);
  
  try {
    const response = await fetch(specUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const spec = await response.json();
    
    console.log('✅ Spec fetched successfully');
    console.log(`   Version: ${spec.info.version}`);
    console.log(`   Paths: ${Object.keys(spec.paths).length}`);
    
    // Generate endpoint documentation
    let markdown = `# API Endpoints Reference\n\n`;
    markdown += `> Auto-generated from OpenAPI ${spec.openapi} specification\n\n`;
    markdown += `**API Version:** ${spec.info.version}\n\n`;
    markdown += spec.info.description + '\n\n';
    
    // Group endpoints by tag
    const endpointsByTag = {};
    
    for (const [pathStr, methods] of Object.entries(spec.paths)) {
      for (const [method, details] of Object.entries(methods)) {
        const tag = details.tags?.[0] || 'Other';
        if (!endpointsByTag[tag]) {
          endpointsByTag[tag] = [];
        }
        endpointsByTag[tag].push({
          path: pathStr,
          method: method.toUpperCase(),
          details
        });
      }
    }
    
    // Generate documentation for each tag
    for (const [tag, endpoints] of Object.entries(endpointsByTag)) {
      markdown += `## ${tag}\n\n`;
      
      for (const { path, method, details } of endpoints) {
        markdown += `### ${method} ${path}\n\n`;
        markdown += `**${details.summary}**\n\n`;
        markdown += `${details.description}\n\n`;
        
        // Request body
        if (details.requestBody) {
          markdown += `#### Request Body\n\n`;
          const content = details.requestBody.content['application/json'];
          if (content?.schema) {
            markdown += '```json\n';
            markdown += JSON.stringify(content.schema, null, 2);
            markdown += '\n```\n\n';
          }
        }
        
        // Responses
        markdown += `#### Responses\n\n`;
        for (const [code, response] of Object.entries(details.responses)) {
          markdown += `**${code}** - ${response.description}\n\n`;
          
          if (response.content?.['application/json']?.schema) {
            markdown += '```json\n';
            markdown += JSON.stringify(response.content['application/json'].schema, null, 2);
            markdown += '\n```\n\n';
          }
        }
        
        markdown += '---\n\n';
      }
    }
    
    // Save generated markdown
    const outputPath = path.join(__dirname, '../api/endpoints-generated.md');
    fs.writeFileSync(outputPath, markdown, 'utf-8');
    
    console.log('✅ API documentation generated:', outputPath);
    
    // Also save the raw spec as JSON
    const specPath = path.join(__dirname, '../public/openapi.json');
    fs.writeFileSync(specPath, JSON.stringify(spec, null, 2), 'utf-8');
    
    console.log('✅ OpenAPI spec saved:', specPath);
    
  } catch (error) {
    console.error('❌ Failed to generate OpenAPI docs:', error.message);
    console.error('\n⚠️  Make sure the admin server is running:');
    console.error('   pnpm --filter @castquest/admin dev\n');
    process.exit(1);
  }
}

// Only run if called directly
if (require.main === module) {
  generateOpenApiDocs();
}

module.exports = { generateOpenApiDocs };
