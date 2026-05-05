
FROM mcr.microsoft.com/playwright:v1.48.2-jammy


WORKDIR /app


ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1


COPY package*.json ./


RUN npm install


COPY . .


EXPOSE 4000


CMD ["node", "server.js"]
