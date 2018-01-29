CREATE TABLE financials (
	id SERIAL UNIQUE PRIMARY KEY NOT NULL,
	sc_id INTEGER,
	root_hash TEXT,
	company_name TEXT,
	recording_date INTEGER,
	total_sales INTEGER,
	cogs INTEGER,
	inventory_stock INTEGER,
	cash_counter INTEGER,
	accounts_receivables INTEGER,
	accounts_payable INTEGER
);