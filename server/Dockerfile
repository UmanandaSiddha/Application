# Use a lightweight Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files into the container
COPY . .

# Compile TypeScript files to JavaScript
RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]