FROM codercom/code-server:4.96.4

USER root
RUN apt-get update \
    && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create the missing /tmp/mobby-worker directory
RUN mkdir -p /tmp/mobby-worker

# Revert to the code-server default user
USER coder

# Expose code-server's default port
EXPOSE 8080

# Start code-server on container launch
CMD ["code-server", "--auth", "none", "--bind-addr", "0.0.0.0:8080", "/tmp/mobby-worker"]
