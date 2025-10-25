--------- Table ---------
CREATE TABLE IF NOT EXISTS non_staff_costs (
    cost_subcategory TEXT PRIMARY KEY,
    cost_category TEXT NOT NULL
);

--------- Insert Values ---------
INSERT INTO non_staff_costs (cost_subcategory, cost_category) VALUES
('Advertising, Marketing and Promotional Expenses', 'Advertising and marketing'),
('Consumable Goods', 'Consumable Goods and Supplies'),
('Library', 'Consumable Goods and Supplies'),
('Computer Software and Services', 'Data Management'),
('Computer Software and Services (includes Research data management and software services)', 'Data Management'),
('Major assets and equipment (>$10,000)/infrastructure costs', 'Equipment and maintenance and utilities'),
('Minor Assets and Equipment (Asset < $10,000) Non-Capitalised Equipment', 'Equipment and maintenance and utilities'),
('Rental and Hire', 'Equipment and maintenance and utilities'),
('Repairs and Maintenance', 'Equipment and maintenance and utilities'),
('Utilities and Services', 'Equipment and maintenance and utilities'),
('Consultants', 'Expert Services and Consultants and Contractors'),
('Contracted and Temporary Labour', 'Expert Services and Consultants and Contractors'),
('Contracted Services (ex. ICA)', 'Expert Services and Consultants and Contractors'),
('Other expert services', 'Expert Services and Consultants and Contractors'),
('Open Access Fees', 'Other consumable service'),
('Professional memberships and subscriptions', 'Other consumable service'),
('Other Student Support (includes PhD Stipends/grants)', 'PhD Stipends'),
('Contributions to HEPS', 'Shared Grant Payments'),
('Entertainment and catering', 'Travel and entertainment'),
('Travel, Staff Development, and Conference Expense', 'Travel and entertainment');
