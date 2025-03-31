#!/bin/bash

# Install dependencies
echo "Installing client dependencies..."
cd client
npm install
npm run build

echo "Installing server dependencies..."
cd ../server
npm install
npm run build

# Start the server
echo "Starting the server..."
npm start
