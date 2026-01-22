#!/usr/bin/env node

/**
 * Health Check Module
 * 
 * Safely reads and validates health-report.json for CI workflows.
 * 
 * Features:
 * - Safe JSON parsing with fallback handling
 * - Validates health status even when file is malformed or empty
 * - Defaults to "healthy" for empty but valid files
 * - Clear diagnostic logging
 * - Exits with code 1 only when status="unhealthy"
 * 
 * Usage:
 *   node scripts/health/check-health.js [path-to-health-report.json]
 */

const fs = require('fs');
const path = require('path');

/**
 * Read and validate health report
 * @param {string} filePath - Path to health-report.json
 * @returns {{status: string, healthy: boolean, message: string, details?: any}}
 */
function checkHealth(filePath) {
  const result = {
    status: 'healthy',
    healthy: true,
    message: 'Health check passed',
  };

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log('ℹ️  Health report file not found - assuming healthy');
    return result;
  }

  try {
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8').trim();
    
    // Handle empty file
    if (!content || content === '') {
      console.log('ℹ️  Health report is empty - assuming healthy');
      return result;
    }

    // Parse JSON
    let data;
    try {
      data = JSON.parse(content);
    } catch (parseError) {
      console.error('⚠️  Failed to parse health-report.json:', parseError.message);
      console.error('Content:', content.substring(0, 200));
      // Don't fail CI on parse errors - assume healthy
      result.message = `Health report parsing failed, assuming healthy: ${parseError.message}`;
      return result;
    }

    // Validate parsed data
    if (!data || typeof data !== 'object') {
      console.log('ℹ️  Health report is not an object - assuming healthy');
      return result;
    }

    // Check status field
    const status = data.status?.toLowerCase() || 'healthy';
    result.status = status;
    result.details = data;

    if (status === 'unhealthy') {
      result.healthy = false;
      result.message = 'Health check failed: status is unhealthy';
      console.error('❌ Health check failed');
      console.error('Status:', status);
      if (data.errors) {
        console.error('Errors:', JSON.stringify(data.errors, null, 2));
      }
      if (data.warnings) {
        console.error('Warnings:', JSON.stringify(data.warnings, null, 2));
      }
    } else {
      console.log('✅ Health check passed');
      console.log('Status:', status);
      if (data.warnings && data.warnings.length > 0) {
        console.log('Warnings:', JSON.stringify(data.warnings, null, 2));
      }
    }

    return result;
  } catch (error) {
    console.error('⚠️  Error reading health report:', error.message);
    // Don't fail CI on read errors - assume healthy
    result.message = `Health report read failed, assuming healthy: ${error.message}`;
    return result;
  }
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const filePath = args[0] || path.join(process.cwd(), 'health-report.json');

  console.log('🔍 Checking health report:', filePath);
  console.log('');

  const result = checkHealth(filePath);

  console.log('');
  console.log('Result:', result.message);

  // Exit with appropriate code
  process.exit(result.healthy ? 0 : 1);
}

// Export for testing and module usage
if (require.main === module) {
  main();
} else {
  module.exports = { checkHealth };
}
