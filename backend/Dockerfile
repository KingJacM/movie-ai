# Use an official Go runtime as the parent image
FROM golang:1.20

# Set the working directory
WORKDIR /go/src/app

# Copy the current directory contents into the container
COPY . .

# Build the Go application
RUN go build -o app .

# Ensure the binary is executable
RUN chmod +x app

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the app
CMD ["/go/src/app/app"]
