CREATE TABLE financials (
	id SERIAL UNIQUE PRIMARY KEY NOT NULL,
	sc_id INTEGER,
	company_name TEXT,
	recording_date TEXT,
	total_sales INTEGER,
	cogs INTEGER,
	inventory_stock INTEGER,
	cash_counter INTEGER,
	accounts_receivables INTEGER,
	accounts_payable INTEGER
);