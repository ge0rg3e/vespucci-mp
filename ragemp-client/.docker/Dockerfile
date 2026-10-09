FROM nodejs_ragemp:latest

WORKDIR /app

# Copy the files
COPY ./source ./
COPY ./source/.env ./

# Container will always start the image using this..
EXPOSE 3000

CMD ["pnpm", "start"] 