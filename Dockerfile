# Use a Node base image
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install

# Install kubectl
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" \
    && install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install app dependencies (package.json AND package-lock.json)
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Build the React app
RUN npm run build

# Your server runs on port 3000
EXPOSE 3000

# Start the Node.js server
CMD [ "npm", "start" ]
