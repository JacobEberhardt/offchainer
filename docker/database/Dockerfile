# Base image
FROM postgres

# Set environment variables
ENV POSTGRES_DB offchainer

# Copy setup command. Use one line to create unnecessary layers
COPY createTableOffchainer.sql createTableCounter.sql createTableEmployee.sql createTableFinancials.sql /docker-entrypoint-initdb.d/