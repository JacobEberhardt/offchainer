CREATE TABLE financials (
	id SERIAL UNIQUE PRIMARY KEY NOT NULL,
	company_name TEXT,
	recording_date date,
	total_sales INTEGER,
	cogs INTEGER,
	inventory_stock INTEGER,
	cash_counter INTEGER,
	accounts_receivables INTEGER,
	accounts_payable INTEGER
);
