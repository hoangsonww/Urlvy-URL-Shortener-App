# Use VS Code’s official Node.js 18 devcontainer image
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:18

# Install Docker Compose CLI
RUN apt-get update \
 && apt-get install -y docker-compose \
 && apt-get clean -y \
 && rm -rf /var/lib/apt/lists/*

# (Optional) Install global tools you find handy
RUN npm install -g typescript ts-node

# Default workdir
WORKDIR /workspace
