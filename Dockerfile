FROM node:16

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "src/server.js"]

# Start the application
CMD ["node", "src/server.js"]
