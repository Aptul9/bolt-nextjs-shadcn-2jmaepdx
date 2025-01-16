-- Allow all users to use the public schema
GRANT USAGE ON SCHEMA public TO PUBLIC;

-- Grant access to all tables in the public schema
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO PUBLIC;

-- Grant execute permissions on all functions in the public schema
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO PUBLIC;

-- Ensure future tables and functions inherit these permissions automatically
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO PUBLIC;
