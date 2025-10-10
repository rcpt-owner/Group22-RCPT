--------- Table ---------
CREATE TABLE IF NOT EXISTS payroll_tax (
    year INT PRIMARY KEY,
    rate DECIMAL(5,4)
);

--------- Insert Values ---------
INSERT INTO payroll_tax (year, rate) VALUES
(2023, 0.0585),
(2024, 0.0585),
(2025, 0.0585),
(2026, 0.0585);