# Use the official Playwright image for version 1.58.2 (matching the latest rollback)
FROM mcr.microsoft.com/playwright:v1.48.2-jammy

# Create app directory
WORKDIR /app

# Set Playwright to use the pre-installed browsers in the image
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (only app dependencies, browsers are already in image)
RUN npm install

# Copy all files
COPY . .

# Expose the API port
EXPOSE 4000

# Start command
CMD ["node", "server.js"]
