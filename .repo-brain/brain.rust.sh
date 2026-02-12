#!/usr/bin/env bash
set -e

[[ ! -f Cargo.toml ]] && exit 0

echo "🦀 Normalizing Rust toolchain"

# Ensure rust-toolchain.toml exists
if [[ ! -f rust-toolchain.toml ]]; then
cat <<EOF > rust-toolchain.toml
[toolchain]
channel = "stable"
components = ["clippy", "rustfmt"]
EOF
fi

cargo fetch
