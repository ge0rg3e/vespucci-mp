FROM nodejs_ragemp:latest as builder

# Change folder path
WORKDIR /panel/release

# Copy the server dependencies
COPY ./source/.env ./
COPY ./source/dist .

# Install dependencies (which are now less)
RUN pnpm install

# Expose Ports so people can connect

EXPOSE 3025

CMD ["npm", "run", "serve"]
