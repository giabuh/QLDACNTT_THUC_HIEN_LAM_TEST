const SECRET_KEYS = new Set(['password_hash', 'token_hash', 'face_encoding']);

function scrub(value) {
  if (Array.isArray(value)) return value.map(scrub);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, SECRET_KEYS.has(k) ? '[REDACTED]' : scrub(v)])
    );
  }
  return value;
}

const toJson = (v) => (v == null ? null : JSON.stringify(scrub(v)));

/**
 * Append one row to audit_logs. `executor` is `db` or a transaction client so the
 * audit row commits/rolls back together with the change it describes.
 */
async function writeAudit(executor, { user, action, table, recordId, oldValues, newValues, req }) {
  await executor.query(
    `INSERT INTO audit_logs
       (user_id, employee_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      user?.userId ?? null,
      user?.employeeId ?? null,
      action,
      table,
      recordId == null ? null : String(recordId),
      toJson(oldValues),
      toJson(newValues),
      req?.ip ? String(req.ip).slice(0, 45) : null,
      req?.headers?.['user-agent'] ?? null,
    ]
  );
}

module.exports = { writeAudit };
