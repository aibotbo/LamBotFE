# Use the official Node.js image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy the package files
COPY package.json yarn.lock ./

# Install dependencies
RUN npm install && npm install yarn

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["yarn", "start"]

