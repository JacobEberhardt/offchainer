CREATE TABLE counter (
	id SERIAL UNIQUE PRIMARY KEY NOT NULL,
	root_hash VARCHAR(255),
	counter_one INTEGER,
	counter_two INTEGER,
	counter_three INTEGER,
	counter_four INTEGER
);
