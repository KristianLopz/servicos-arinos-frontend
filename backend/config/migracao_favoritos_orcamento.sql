USE travelbuddy;

ALTER TABLE favorites ADD COLUMN budget_value DECIMAL(10,2) NULL AFTER notes;
ALTER TABLE favorites ADD COLUMN budget_days INT NULL AFTER budget_value;
ALTER TABLE favorites ADD COLUMN budget_people INT NULL AFTER budget_days;
