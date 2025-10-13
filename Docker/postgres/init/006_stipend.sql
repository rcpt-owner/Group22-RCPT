--------- Table ---------
CREATE TABLE IF NOT EXISTS stipend (
    year INT PRIMARY KEY,
    rate DECIMAL(8,2) NOT NULL
);

--------- Insert Values ---------
INSERT INTO stipend (year, rate) VALUES
(2024, 37000.00),
(2025, 38500.00),
(2026, 39655.00),
(2027, 40844.65),
(2028, 42069.99),
(2029, 43332.09),
(2030, 44632.05),
(2031, 45971.01),
(2032, 47350.14);