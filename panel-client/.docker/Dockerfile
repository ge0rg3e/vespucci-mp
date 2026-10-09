FROM nodejs_ragemp:latest as builder

# Change folder path
WORKDIR /panel/release

# Copy the dependencies all over again including the node_modules because is needed to run next.js preview
COPY ./source .
COPY ./source/.env ./

# Container will always start the image using this..

CMD ["npm", "start"]