#!/usr/bin/env node
'use strict';

// Validates that every file passed as an argument contains valid JSON.
// Used by lint-staged to check all staged package.json files.
// Usage: node scripts/validate-package-json.js file1.json file2.json

const fs = require('fs');
const files = process.argv.slice(2); // skip node binary and script path

let hasError = false;

for (const file of files) {
  try {
    JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`Invalid JSON in ${file}: ${err.message}`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}
