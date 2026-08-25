# Stage 1: Build the Rust app
FROM rust:1.98.0-slim AS build

RUN rustup target add x86_64-unknown-linux-musl
RUN apt-get update && apt-get install -y musl-tools

WORKDIR /app

COPY . .

RUN cargo build --release --target=x86_64-unknown-linux-musl

# Stage 2: Create a small image with the compiled binary
FROM alpine:latest

COPY --from=build /app/target/x86_64-unknown-linux-musl/release/backend /backend
COPY showcase.json /etc/showcase/showcase.json

RUN ls -la /

EXPOSE 8080

CMD ["/backend"]
