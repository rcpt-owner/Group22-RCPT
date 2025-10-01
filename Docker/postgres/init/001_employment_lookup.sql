--------- Tables ---------
CREATE TABLE IF NOT EXISTS salary_rate_multiplier (
  unit TEXT PRIMARY KEY,      -- 'FTE' | 'Daily' | 'Hourly'
  multiplier NUMERIC(12,6) NOT NULL
);

CREATE TABLE IF NOT EXISTS salary_rate (
  id BIGSERIAL PRIMARY KEY,

  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,

  payroll_type TEXT NOT NULL,       -- 'Fortnight' or 'Casual'
  category TEXT NOT NULL,           -- 'Academic' or 'Professional'

  -- Rates: Fortnight rows store FTE (annual); Casual rows store Hourly.
  fte_rate   NUMERIC(12,2),
  daily_rate NUMERIC(12,2),
  hourly_rate NUMERIC(12,2),

  currency TEXT DEFAULT 'AUD',
  effective_from DATE DEFAULT DATE '2025-05-01',  
  effective_to   DATE
);

--------- Multipliers (from “Salary Rate Multipliers” table) ----------
INSERT INTO salary_rate_multiplier (unit, multiplier) VALUES
  ('FTE',    1.000000),
  ('Daily',  0.004545),  -- ~ 1 / 220 workdays
  ('Hourly', 1.000000)
ON CONFLICT (unit) DO UPDATE SET multiplier = EXCLUDED.multiplier;

---------- Fortnight and Academic ----------
INSERT INTO salary_rate (code, name, payroll_type, category, fte_rate)
VALUES
  ('FortnightAcademicRA Grade 1.1', 'RA Grade 1.1', 'Fortnight', 'Academic', 78115.00),
  ('FortnightAcademicRA Grade 1.2', 'RA Grade 1.2', 'Fortnight', 'Academic', 80661.00),
  ('FortnightAcademicRA Grade 1.3', 'RA Grade 1.3', 'Fortnight', 'Academic', 85555.00),

  ('FortnightAcademicLevel A.1', 'Level A.1', 'Fortnight', 'Academic', 85555.00),
  ('FortnightAcademicLevel A.2', 'Level A.2', 'Fortnight', 'Academic', 90434.00),
  ('FortnightAcademicLevel A.3', 'Level A.3', 'Fortnight', 'Academic', 95237.00),
  ('FortnightAcademicLevel A.4', 'Level A.4', 'Fortnight', 'Academic', 100214.00),
  ('FortnightAcademicLevel A.5', 'Level A.5', 'Fortnight', 'Academic', 104189.00),
  ('FortnightAcademicLevel A.6', 'Level A.6', 'Fortnight', 'Academic', 108156.00),
  ('FortnightAcademicLevel A.7', 'Level A.7', 'Fortnight', 'Academic', 112124.00),
  ('FortnightAcademicLevel A.8', 'Level A.8', 'Fortnight', 'Academic', 116094.00),

  ('FortnightAcademicLevel B.1', 'Level B.1', 'Fortnight', 'Academic', 122212.00),
  ('FortnightAcademicLevel B.2', 'Level B.2', 'Fortnight', 'Academic', 126791.00),
  ('FortnightAcademicLevel B.3', 'Level B.3', 'Fortnight', 'Academic', 131373.00),
  ('FortnightAcademicLevel B.4', 'Level B.4', 'Fortnight', 'Academic', 135954.00),
  ('FortnightAcademicLevel B.5', 'Level B.5', 'Fortnight', 'Academic', 140541.00),
  ('FortnightAcademicLevel B.6', 'Level B.6', 'Fortnight', 'Academic', 145121.00),

  ('FortnightAcademicLevel C.1', 'Level C.1', 'Fortnight', 'Academic', 149701.00),
  ('FortnightAcademicLevel C.2', 'Level C.2', 'Fortnight', 'Academic', 154293.00),
  ('FortnightAcademicLevel C.3', 'Level C.3', 'Fortnight', 'Academic', 158868.00),
  ('FortnightAcademicLevel C.4', 'Level C.4', 'Fortnight', 'Academic', 163444.00),
  ('FortnightAcademicLevel C.5', 'Level C.5', 'Fortnight', 'Academic', 168025.00),
  ('FortnightAcademicLevel C.6', 'Level C.6', 'Fortnight', 'Academic', 172613.00),

  ('FortnightAcademicLevel D.1', 'Level D.1', 'Fortnight', 'Academic', 180254.00),
  ('FortnightAcademicLevel D.2', 'Level D.2', 'Fortnight', 'Academic', 186361.00),
  ('FortnightAcademicLevel D.3', 'Level D.3', 'Fortnight', 'Academic', 192466.00),
  ('FortnightAcademicLevel D.4', 'Level D.4', 'Fortnight', 'Academic', 198584.00),

  ('FortnightAcademicLevel E.1', 'Level E.1', 'Fortnight', 'Academic', 232180.00)
ON CONFLICT (code) DO NOTHING;

----------- Fortnight and Professional ----------
INSERT INTO salary_rate (code, name, payroll_type, category, fte_rate)
VALUES
  ('FortnightProfessionalUOM 1.1','UOM 1.1','Fortnight','Professional', 60073.00),
  ('FortnightProfessionalUOM 1.2','UOM 1.2','Fortnight','Professional', 61284.00),
  ('FortnightProfessionalUOM 1.3','UOM 1.3','Fortnight','Professional', 62501.00),

  ('FortnightProfessionalUOM 2.1','UOM 2.1','Fortnight','Professional', 65189.00),
  ('FortnightProfessionalUOM 2.2','UOM 2.2','Fortnight','Professional', 66494.00),
  ('FortnightProfessionalUOM 2.3','UOM 2.3','Fortnight','Professional', 67825.00),

  ('FortnightProfessionalUOM 3.1','UOM 3.1','Fortnight','Professional', 68190.00),
  ('FortnightProfessionalUOM 3.2','UOM 3.2','Fortnight','Professional', 69557.00),
  ('FortnightProfessionalUOM 3.3','UOM 3.3','Fortnight','Professional', 70943.00),
  ('FortnightProfessionalUOM 3.4','UOM 3.4','Fortnight','Professional', 72363.00),
  ('FortnightProfessionalUOM 3.5','UOM 3.5','Fortnight','Professional', 73814.00),
  ('FortnightProfessionalUOM 3.6','UOM 3.6','Fortnight','Professional', 75289.00),

  ('FortnightProfessionalUOM 4.1','UOM 4.1','Fortnight','Professional', 78824.00),
  ('FortnightProfessionalUOM 4.2','UOM 4.2','Fortnight','Professional', 80403.00),
  ('FortnightProfessionalUOM 4.3','UOM 4.3','Fortnight','Professional', 82012.00),
  ('FortnightProfessionalUOM 4.4','UOM 4.4','Fortnight','Professional', 83655.00),

  ('FortnightProfessionalUOM 5.1','UOM 5.1','Fortnight','Professional', 85238.00),
  ('FortnightProfessionalUOM 5.2','UOM 5.2','Fortnight','Professional', 86939.00),
  ('FortnightProfessionalUOM 5.3','UOM 5.3','Fortnight','Professional', 88575.00),
  ('FortnightProfessionalUOM 5.4','UOM 5.4','Fortnight','Professional', 90450.00),
  ('FortnightProfessionalUOM 5.5','UOM 5.5','Fortnight','Professional', 92257.00),
  ('FortnightProfessionalUOM 5.6','UOM 5.6','Fortnight','Professional', 94110.00),
  ('FortnightProfessionalUOM 5.7','UOM 5.7','Fortnight','Professional', 95985.00),
  ('FortnightProfessionalUOM 5.8','UOM 5.8','Fortnight','Professional', 97906.00),

  ('FortnightProfessionalUOM 6.1','UOM 6.1','Fortnight','Professional', 98870.00),
  ('FortnightProfessionalUOM 6.2','UOM 6.2','Fortnight','Professional', 100852.00),
  ('FortnightProfessionalUOM 6.3','UOM 6.3','Fortnight','Professional', 102860.00),
  ('FortnightProfessionalUOM 6.4','UOM 6.4','Fortnight','Professional', 104921.00),
  ('FortnightProfessionalUOM 6.5','UOM 6.5','Fortnight','Professional', 107023.00),

  ('FortnightProfessionalUOM 7.1','UOM 7.1','Fortnight','Professional', 109093.00),
  ('FortnightProfessionalUOM 7.2','UOM 7.2','Fortnight','Professional', 111280.00),
  ('FortnightProfessionalUOM 7.3','UOM 7.3','Fortnight','Professional', 113502.00),
  ('FortnightProfessionalUOM 7.4','UOM 7.4','Fortnight','Professional', 115771.00),
  ('FortnightProfessionalUOM 7.5','UOM 7.5','Fortnight','Professional', 118091.00),

  ('FortnightProfessionalUOM 8.1','UOM 8.1','Fortnight','Professional', 122736.00),
  ('FortnightProfessionalUOM 8.2','UOM 8.2','Fortnight','Professional', 125187.00),
  ('FortnightProfessionalUOM 8.3','UOM 8.3','Fortnight','Professional', 127688.00),
  ('FortnightProfessionalUOM 8.4','UOM 8.4','Fortnight','Professional', 130244.00),
  ('FortnightProfessionalUOM 8.5','UOM 8.5','Fortnight','Professional', 132847.00),

  ('FortnightProfessionalUOM 9.1','UOM 9.1','Fortnight','Professional', 143185.00),
  ('FortnightProfessionalUOM 9.2','UOM 9.2','Fortnight','Professional', 146043.00),
  ('FortnightProfessionalUOM 9.3','UOM 9.3','Fortnight','Professional', 148972.00),

  ('FortnightProfessionalUOM 10','UOM 10','Fortnight','Professional', 153412.00)
ON CONFLICT (code) DO NOTHING;

---------- Casual and Professional (Hourly) ----------
INSERT INTO salary_rate (code, name, payroll_type, category, hourly_rate)
VALUES
  ('CasualProfessionalUOM 1.1','UOM 1.1','Casual','Professional', 39.04),
  ('CasualProfessionalUOM 1.2','UOM 1.2','Casual','Professional', 39.83),
  ('CasualProfessionalUOM 1.3','UOM 1.3','Casual','Professional', 40.62),

  ('CasualProfessionalUOM 2.1','UOM 2.1','Casual','Professional', 42.37),
  ('CasualProfessionalUOM 2.2','UOM 2.2','Casual','Professional', 43.22),
  ('CasualProfessionalUOM 2.3','UOM 2.3','Casual','Professional', 44.08),

  ('CasualProfessionalUOM 3.1','UOM 3.1','Casual','Professional', 44.32),
  ('CasualProfessionalUOM 3.2','UOM 3.2','Casual','Professional', 45.20),
  ('CasualProfessionalUOM 3.3','UOM 3.3','Casual','Professional', 46.10),
  ('CasualProfessionalUOM 3.4','UOM 3.4','Casual','Professional', 47.03),
  ('CasualProfessionalUOM 3.5','UOM 3.5','Casual','Professional', 47.97),
  ('CasualProfessionalUOM 3.6','UOM 3.6','Casual','Professional', 48.93),

  ('CasualProfessionalUOM 4.1','UOM 4.1','Casual','Professional', 51.22),
  ('CasualProfessionalUOM 4.2','UOM 4.2','Casual','Professional', 52.24),
  ('CasualProfessionalUOM 4.3','UOM 4.3','Casual','Professional', 53.29),
  ('CasualProfessionalUOM 4.4','UOM 4.4','Casual','Professional', 54.35),

  ('CasualProfessionalUOM 5.1','UOM 5.1','Casual','Professional', 55.39),
  ('CasualProfessionalUOM 5.2','UOM 5.2','Casual','Professional', 56.49),
  ('CasualProfessionalUOM 5.3','UOM 5.3','Casual','Professional', 57.62),
  ('CasualProfessionalUOM 5.4','UOM 5.4','Casual','Professional', 58.78),
  ('CasualProfessionalUOM 5.5','UOM 5.5','Casual','Professional', 59.95),
  ('CasualProfessionalUOM 5.6','UOM 5.6','Casual','Professional', 61.15),
  ('CasualProfessionalUOM 5.7','UOM 5.7','Casual','Professional', 62.37),
  ('CasualProfessionalUOM 5.8','UOM 5.8','Casual','Professional', 63.62),

  ('CasualProfessionalUOM 6.1','UOM 6.1','Casual','Professional', 64.24),
  ('CasualProfessionalUOM 6.2','UOM 6.2','Casual','Professional', 65.53),
  ('CasualProfessionalUOM 6.3','UOM 6.3','Casual','Professional', 66.88),
  ('CasualProfessionalUOM 6.4','UOM 6.4','Casual','Professional', 68.18),
  ('CasualProfessionalUOM 6.5','UOM 6.5','Casual','Professional', 69.54),

  ('CasualProfessionalUOM 7.1','UOM 7.1','Casual','Professional', 70.89),
  ('CasualProfessionalUOM 7.2','UOM 7.2','Casual','Professional', 72.30),
  ('CasualProfessionalUOM 7.3','UOM 7.3','Casual','Professional', 73.75),
  ('CasualProfessionalUOM 7.4','UOM 7.4','Casual','Professional', 75.23),
  ('CasualProfessionalUOM 7.5','UOM 7.5','Casual','Professional', 76.73),

  ('CasualProfessionalUOM 8.1','UOM 8.1','Casual','Professional', 79.75),
  ('CasualProfessionalUOM 8.2','UOM 8.2','Casual','Professional', 81.34),
  ('CasualProfessionalUOM 8.3','UOM 8.3','Casual','Professional', 82.97),
  ('CasualProfessionalUOM 8.4','UOM 8.4','Casual','Professional', 84.63),
  ('CasualProfessionalUOM 8.5','UOM 8.5','Casual','Professional', 86.32),

  ('CasualProfessionalUOM 9.1','UOM 9.1','Casual','Professional', 93.04),
  ('CasualProfessionalUOM 9.2','UOM 9.2','Casual','Professional', 94.89),
  ('CasualProfessionalUOM 9.3','UOM 9.3','Casual','Professional', 96.79),

  ('CasualProfessionalUOM 10','UOM 10','Casual','Professional', 99.68)
ON CONFLICT (code) DO NOTHING;

---------- Casual and Academic (Hourly) ----------
INSERT INTO salary_rate (code, name, payroll_type, category, hourly_rate)
VALUES
  ('CasualAcademicRA Grade 1.1','RA Grade 1.1','Casual','Academic', 50.77),
  ('CasualAcademicRA Grade 1.2','RA Grade 1.2','Casual','Academic', 52.42),
  ('CasualAcademicRA Grade 1.3','RA Grade 1.3','Casual','Academic', 55.59),

  ('CasualAcademicLevel A.1','Level A.1','Casual','Academic', 55.59),
  ('CasualAcademicLevel A.2','Level A.2','Casual','Academic', 58.77),
  ('CasualAcademicLevel A.3','Level A.3','Casual','Academic', 61.94),
  ('CasualAcademicLevel A.4','Level A.4','Casual','Academic', 65.12),
  ('CasualAcademicLevel A.5','Level A.5','Casual','Academic', 67.70),
  ('CasualAcademicLevel A.6','Level A.6','Casual','Academic', 70.28),
  ('CasualAcademicLevel A.7','Level A.7','Casual','Academic', 72.85),
  ('CasualAcademicLevel A.8','Level A.8','Casual','Academic', 75.43),

  ('CasualAcademicLevel B.1','Level B.1','Casual','Academic', 79.40),
  ('CasualAcademicLevel B.2','Level B.2','Casual','Academic', 82.38),
  ('CasualAcademicLevel B.3','Level B.3','Casual','Academic', 85.37),
  ('CasualAcademicLevel B.4','Level B.4','Casual','Academic', 88.34),
  ('CasualAcademicLevel B.5','Level B.5','Casual','Academic', 91.32),
  ('CasualAcademicLevel B.6','Level B.6','Casual','Academic', 94.29),

  ('CasualAcademicLevel C.1','Level C.1','Casual','Academic', 97.27),
  ('CasualAcademicLevel C.2','Level C.2','Casual','Academic',100.85),
  ('CasualAcademicLevel C.3','Level C.3','Casual','Academic',103.23),
  ('CasualAcademicLevel C.4','Level C.4','Casual','Academic',106.20),
  ('CasualAcademicLevel C.5','Level C.5','Casual','Academic',109.18),
  ('CasualAcademicLevel C.6','Level C.6','Casual','Academic',112.15),

  ('CasualAcademicLevel D.1','Level D.1','Casual','Academic',117.12),
  ('CasualAcademicLevel D.2','Level D.2','Casual','Academic',121.09),
  ('CasualAcademicLevel D.3','Level D.3','Casual','Academic',125.05),
  ('CasualAcademicLevel D.4','Level D.4','Casual','Academic',129.03),

  ('CasualAcademicLevel E.1','Level E.1','Casual','Academic',150.85)
ON CONFLICT (code) DO NOTHING;

---------- Indexes ----------
CREATE INDEX IF NOT EXISTS ec_idx_lookup ON salary_rate (payroll_type, category, name);