# Health Check Scripts

This directory contains health check utilities for CI/CD workflows and local development.

## check-health.js

Safely reads and validates `health-report.json` for CI workflows.

### Features

- Safe JSON parsing with fallback handling
- Validates health status even when file is malformed or empty
- Defaults to "healthy" for empty but valid files
- Clear diagnostic logging
- Exits with code 1 only when status="unhealthy"

### Usage

```bash
# Check default health report location (./health-report.json)
node scripts/health/check-health.js

# Check specific file
node scripts/health/check-health.js /path/to/health-report.json
```

### Exit Codes

- `0`: Health check passed (status is "healthy" or file not found/empty)
- `1`: Health check failed (status is "unhealthy")

### Health Report Format

The health report JSON file should follow this structure:

```json
{
  "status": "healthy",
  "timestamp": "2026-01-15T10:00:00Z",
  "checks": {
    "database": "ok",
    "api": "ok"
  },
  "warnings": [],
  "errors": []
}
```

For unhealthy status:

```json
{
  "status": "unhealthy",
  "timestamp": "2026-01-15T10:00:00Z",
  "errors": [
    "Database connection failed",
    "API timeout"
  ],
  "warnings": [
    "High memory usage"
  ]
}
```

### Integration with CI

Add to your GitHub Actions workflow:

```yaml
- name: Health Check
  run: node scripts/health/check-health.js
```

The script will:
1. Read the health report file
2. Parse and validate the JSON
3. Log diagnostic information
4. Exit with appropriate code for CI to handle
