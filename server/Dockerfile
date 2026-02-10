# Use the official Playwright image which comes with all browser dependencies pre-installed
FROM mcr.microsoft.com/playwright:v1.41.0-jammy

# Create app directory
WORKDIR /app

# Set Playwright to install browsers in a specific, predictable directory
# and tell it where to look for them at runtime.
ENV PLAYWRIGHT_BROWSERS_PATH=/app/ms-playwright

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Install Chromium browser into the specific path defined above
RUN npx playwright install chromium

# Expose the port your server runs on
EXPOSE 4000

# Start the server
CMD ["node", "server.js"]
