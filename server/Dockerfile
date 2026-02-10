# Use the official Playwright image for version 1.48.2 (matching the version in package.json)
FROM mcr.microsoft.com/playwright:v1.48.2-jammy

# Create app directory
WORKDIR /app

# Set Playwright to install browsers in a specific, predictable directory
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose the port
EXPOSE 4000

# Start command
CMD ["node", "server.js"]
