FROM nodejs_ragemp:latest as builder

# Needed by prelease_server - 19.04.2023.
RUN apt-get install -y libatomic1 libunwind8 icu-devtools 

# Change folder path
WORKDIR /server/release

# Copy the server dependencies
COPY ./source/.env ./
COPY ./source/dist .
COPY ./server_binaries .

# Now creating a volume for that specific path 
# And now the docker-compose will mention where that will be picked up from

# Creating the directory first (is needed)
RUN mkdir ./client_packages/game_resources

# Mounting the volumes
VOLUME ["/server/release/client_packages/game_resources"]

# Install dependencies (which are now less)
RUN pnpm install

# Making it an executable now
RUN chmod +x ./ragemp-server

# Expose Ports so people can connect

EXPOSE 22005/udp
EXPOSE 22006

CMD ["./ragemp-server"]