CREATE TABLE employee (
	id SERIAL UNIQUE PRIMARY KEY NOT NULL,
	first_name TEXT,
	last_name TEXT,
	start_date TEXT,
	department TEXT,
	salary INTEGER
);
