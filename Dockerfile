FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    --no-install-recommends \
    && curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y \
    google-chrome-stable \
    xvfb \
    --no-install-recommends \
    && apt-get purge --auto-remove -y curl gnupg \
    && rm -rf /var/lib/apt/lists/*

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]