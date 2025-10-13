--------- Table ---------
CREATE TABLE IF NOT EXISTS staff_benefits (
    staff_type VARCHAR(45) PRIMARY KEY,
    superannuation DECIMAL(8,5) NOT NULL,
    leave_loading DECIMAL(8,5) NOT NULL,
    work_cover DECIMAL(8,5) NOT NULL,
    parental_leave DECIMAL(8,5) NOT NULL,
    long_service_leave DECIMAL(8,5) NOT NULL,
    annual_leave DECIMAL(8,5) NOT NULL
);

--------- Insert Values ---------
INSERT INTO staff_benefits (staff_type, superannuation, leave_loading, work_cover, parental_leave, long_service_leave,
    annual_leave) VALUES
('Continuing', 0.17, 0.0134, 0.005, 0.01, 0.005, 0.12),
('Fixed-Term', 0.17, 0.0134, 0.005, 0.01, 0.005, 0.12),
('Casual', 0.12, 0, 0.005, 0, 0, 0);
