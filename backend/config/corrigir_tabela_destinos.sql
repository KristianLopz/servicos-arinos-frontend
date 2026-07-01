USE travelbuddy;

ALTER TABLE destinations ADD COLUMN IF NOT EXISTS country VARCHAR(100) NOT NULL DEFAULT 'Brasil' AFTER name;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS state VARCHAR(100) NULL AFTER country;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS description TEXT NULL AFTER state;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS estimated_cost DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER description;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS climate VARCHAR(100) NULL AFTER estimated_cost;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS best_season VARCHAR(100) NULL AFTER climate;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) NULL AFTER best_season;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS tourist_spots JSON NULL AFTER image_url;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS active TINYINT(1) DEFAULT 1 AFTER tourist_spots;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER active;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER createdAt;

UPDATE destinations SET active = 1 WHERE active IS NULL;

UPDATE destinations SET image_url = '/destinations/rio-de-janeiro.png' WHERE name = 'Rio de Janeiro';
UPDATE destinations SET image_url = '/destinations/florianopolis.png' WHERE name = 'Florianópolis';
UPDATE destinations SET image_url = '/destinations/chapada-diamantina.png' WHERE name = 'Chapada Diamantina';
UPDATE destinations SET image_url = '/destinations/gramado.png' WHERE name = 'Gramado';
UPDATE destinations SET image_url = '/destinations/manaus.png' WHERE name = 'Manaus';
UPDATE destinations SET image_url = '/destinations/praia-do-rosa.png' WHERE name = 'Praia do Rosa';
UPDATE destinations SET image_url = '/destinations/bonito-ms.png' WHERE name = 'Bonito';
UPDATE destinations SET image_url = '/destinations/foz-do-iguacu.png' WHERE name = 'Foz do Iguaçu';
UPDATE destinations SET image_url = '/destinations/lencois-maranhenses.png' WHERE name = 'Lençóis Maranhenses';
UPDATE destinations SET image_url = '/destinations/ouro-preto.png' WHERE name = 'Ouro Preto';
UPDATE destinations SET image_url = '/destinations/sao-paulo.png' WHERE name = 'São Paulo';
