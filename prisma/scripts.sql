-- Allow all users to use the public schema
GRANT USAGE ON SCHEMA public TO PUBLIC;

-- Grant access to all tables in the public schema
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO PUBLIC;

-- Grant execute permissions on all functions in the public schema
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO PUBLIC;

-- Ensure future tables and functions inherit these permissions automatically
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO PUBLIC;

-------------------------RLS -------------------------

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_owner_only" ON tenants
FOR SELECT
USING ("ownerId" = auth.uid());

CREATE POLICY "users_in_tenant" ON users
FOR ALL
USING ("tenantId" IN (SELECT "id" FROM tenants WHERE "ownerId" = auth.uid()))
WITH CHECK ("tenantId" IN (SELECT "id" FROM tenants WHERE "ownerId" = auth.uid()));

CREATE POLICY "users_info_in_tenant" ON users_info
FOR ALL
USING ("tenantId" IN (SELECT "id" FROM tenants WHERE "ownerId" = auth.uid()))
WITH CHECK ("tenantId" IN (SELECT "id" FROM tenants WHERE "ownerId" = auth.uid()));

CREATE POLICY "user_device" ON devices
FOR ALL
USING ("tenantId" IN (SELECT "id" FROM tenants WHERE "ownerId" = auth.uid()))
WITH CHECK ("tenantId" IN (SELECT "id" FROM tenants WHERE "ownerId" = auth.uid()));

CREATE POLICY "access_logs" ON devices
FOR ALL
USING ("tenantId" IN (SELECT "id" FROM tenants WHERE "ownerId" = auth.uid()))
WITH CHECK ("tenantId" IN (SELECT "id" FROM tenants WHERE "ownerId" = auth.uid()));

CREATE POLICY "no_access" ON tenant_info
FOR ALL
USING (false);

-- Disable row-level security on all tables
ALTER TABLE tenants DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE users_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_info DISABLE ROW LEVEL SECURITY;

-- Drop policies (if needed) for complete deactivation
DROP POLICY IF EXISTS "tenant_owner_only" ON tenants;
DROP POLICY IF EXISTS "users_in_tenant" ON users;
DROP POLICY IF EXISTS "users_info_in_tenant" ON users_info;
DROP POLICY IF EXISTS "no_access" ON tenant_info;