# Base image
FROM postgres

# Set environment variables
ENV POSTGRES_DB offchainer

# Copy setup command
COPY createTableOffchainer.sql /docker-entrypoint-initdb.d/
COPY createTableCounter.sql /docker-entrypoint-initdb.d/
COPY createTableFinancials.sql /docker-entrypoint-initdb.d/
