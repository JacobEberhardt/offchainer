# Base image
FROM postgres

# Set environment variables
ENV POSTGRES_DB offchainer

# Copy setup command
COPY createTableOffchainer.sql createTableCounter.sql createTableEmployee.sql /docker-entrypoint-initdb.d/
