FROM mcr.microsoft.com/playwright:v1.39.0-jammy

WORKDIR /app

# Install global tools
RUN npm cache clean --force && \
    npm install -g netlify-cli@20.1.1 serve

RUN apt update
RUN apt install jq -y

# Copy project files
COPY . .

# Install project deps
RUN npm install