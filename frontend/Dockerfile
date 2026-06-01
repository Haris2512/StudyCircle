FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the preview port
EXPOSE 4173

# Start the preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
