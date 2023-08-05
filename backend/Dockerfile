# Use an official Go runtime as the parent image
FROM golang:1.20

# Set the working directory
WORKDIR /go/src/app

# Copy the current directory contents into the container
COPY . .

# Download all dependencies
RUN go get -d -v ./...

# Install the app
RUN go install -v ./...

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the app
CMD ["app"]
