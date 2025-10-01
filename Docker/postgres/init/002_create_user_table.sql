--------- Table ---------
CREATE TABLE IF NOT EXISTS "users" (
    userid VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_approver BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_email ON "users"(email);
CREATE INDEX IF NOT EXISTS idx_user_admin ON "users"(is_admin);
CREATE INDEX IF NOT EXISTS idx_user_approver ON "users"(is_approver);


