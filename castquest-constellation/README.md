# CASTQUEST Constellation

This folder contains the full CASTQUEST constellation of repositories:

- castquest-frames
- castquest-templates
- castquest-sdk
- castquest-games
- castquest-quests
- castquest-contracts
- castquest-ai
- castquest-ui
- castquest-indexer

This script (setup-castquest-constellation-core.ps1) created the local
folder structure and starter files only. No git operations were performed.

Next, run Script 2 (setup-castquest-constellation-git.ps1) to:

- initialize git in each repo
- add SSH and HTTPS remotes
- push to your remote origin using a PAT
