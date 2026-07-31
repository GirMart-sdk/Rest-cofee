-- Devuelve un resultado simple para ser parseado por el script de PowerShell.
-- 'count: 1' si la tabla Menu tiene registros, 'count: 0' si está vacía.
SELECT
    'count: ' || (CASE WHEN EXISTS (SELECT 1 FROM "MenuItem" LIMIT 1) THEN 1 ELSE 0 END)
AS result;