const crypto = require('crypto');

const FULL_ACCESS_ROLES = ['CEO', 'ADMIN'];
const HRD_ASSIGNABLE = ['EMPLOYEE', 'LINE_MANAGER', 'KIOSK'];
const PROTECTED_ROLES = ['CEO', 'ADMIN'];

/** May `actorRole` give an account the role `targetRole`? */
function canAssignRole(actorRole, targetRole) {
  if (FULL_ACCESS_ROLES.includes(actorRole)) return true;
  if (actorRole === 'HR_DIRECTOR') return HRD_ASSIGNABLE.includes(targetRole);
  return false;
}

/** May `actorRole` edit / reset / unlock an existing account whose role is `subjectRole`? */
function canManageUserWithRole(actorRole, subjectRole) {
  if (FULL_ACCESS_ROLES.includes(actorRole)) return true;
  if (actorRole === 'HR_DIRECTOR') return !PROTECTED_ROLES.includes(subjectRole);
  return false;
}

/** 12 random url-safe chars plus a fixed "@1" so letter, digit and symbol are always present. */
function generateTemporaryPassword() {
  return `${crypto.randomBytes(9).toString('base64url')}@1`;
}

module.exports = { canAssignRole, canManageUserWithRole, generateTemporaryPassword };
