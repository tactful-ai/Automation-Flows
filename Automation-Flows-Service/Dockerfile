FROM node:14.19.3-slim 

WORKDIR /usr/src/app

# Install helper tools
RUN apt-get update && apt-get install -y \
    curl \
    unzip 

# install aws cli
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" 
RUN unzip awscliv2.zip
RUN ./aws/install

# AWS codeartifact credentials
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_ACCESS_KEY_ID
ARG AWS_REGION

# Install dependencies
COPY package*.json ./
RUN npm run login
RUN npm ci

# Copy source files
COPY . .

# Build app
RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]



