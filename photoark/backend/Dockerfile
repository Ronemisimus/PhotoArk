# ---- Base Stage ----
# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# ---- Dependencies Stage ----
FROM base AS dependencies
# Copy package.json and package-lock.json
COPY package*.json ./
# Install app dependencies
RUN npm install

# ---- Build Stage ----
FROM dependencies AS build
# Copy the rest of the source code
COPY . .
# Compile TypeScript to JavaScript
RUN npm run build

# ---- Production Stage ----
FROM base AS production
ENV NODE_ENV=production
# Copy package.json and package-lock.json
COPY package*.json ./
# Install only production dependencies
RUN npm install --omit=dev
# Copy compiled code from the build stage
COPY --from=build /usr/src/app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD [ "npm", "start" ]