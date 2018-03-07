# Base image
FROM postgres

# Set environment variables
ENV POSTGRES_DB offchainer

# Copy setup command. Use one line to create unnecessary layers
COPY create-table-counter.sql create-table-employee.sql create-table-financials.sql /docker-entrypoint-initdb.d/
