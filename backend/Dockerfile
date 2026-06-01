FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]
