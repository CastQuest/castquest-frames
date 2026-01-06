# Deprecated Husky shim.
# This file is kept for backward compatibility with hooks that still source it.
# It now intentionally does nothing and always succeeds.

# If sourced, return success; if executed, exit success.
return 0 2>/dev/null || exit 0