const ALWAYS = new Set(['face_encoding', 'password_hash', 'token_hash']);
const ADMIN_HIDDEN = new Set([
  'base_salary', 'salary', 'citizen_id', 'bank_account', 'bank_name', 'date_of_birth', 'address',
]);

/**
 * Copy of an audit old/new value with secrets replaced by "[REDACTED]".
 * ADMIN is a technical role and additionally loses salary and personal data.
 */
function redactAuditValues(value, roleCode) {
  const hidden = (key) => ALWAYS.has(key) || (roleCode === 'ADMIN' && ADMIN_HIDDEN.has(key));
  const walk = (v) => {
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') {
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, hidden(k) ? '[REDACTED]' : walk(x)]));
    }
    return v;
  };
  return walk(value);
}

module.exports = { redactAuditValues };
