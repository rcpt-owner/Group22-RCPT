
CREATE TABLE Region (
    name VARCHAR(100) PRIMARY KEY,
    region_code VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO Region (name, region_code) VALUES
('Parkville', 'RE_001'),
('Creswick', 'RE_002'),
('Werribee', 'RE_003'),
('Burnley', 'RE_004'),
('Dookie', 'RE_005'),
('Southbank', 'RE_006'),
('Fishermans Bend', 'RE_007'),
('Victorian Comprehensive Cancer Centre', 'RE_008'),
('Royal Women''s Hospital', 'RE_009'),
('St Vincent''s Health', 'RE_010'),
('Northern Health', 'RE_011'),
('Western Health', 'RE_012'),
('Mercy Public Hospitals', 'RE_013'),
('Melbourne Health', 'RE_014'),
('Royal Victorian Eye & Ear Hospital', 'RE_015'),
('Austin Health', 'RE_016'),
('Royal Children''s Hospital', 'RE_017'),
('Dental Health Services Victoria', 'RE_018'),
('Rural Health Service', 'RE_019'),
('Residential - Clinical', 'RE_020'),
('Residential - Student Accommodation', 'RE_021'),
('Portfolio - Special Crown Leases', 'RE_022'),
('Portfolio - Bequests/Trust Properties', 'RE_023'),
('Portfolio - Commercial', 'RE_024'),
('Hawthorn', 'RE_025'),
('Shepparton', 'RE_026'),
('Ballarat', 'RE_027'),
('Germany', 'RE_028'),
('Singapore', 'RE_029'),
('China', 'RE_030');