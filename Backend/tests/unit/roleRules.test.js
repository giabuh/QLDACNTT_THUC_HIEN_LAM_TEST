const { test } = require('node:test');
const assert = require('node:assert/strict');
const { canAssignRole, canManageUserWithRole, generateTemporaryPassword } = require('../../src/modules/users/roleRules');

test('CEO and ADMIN can assign any role', () => {
  for (const actor of ['CEO', 'ADMIN']) {
    for (const target of ['CEO', 'ADMIN', 'HR_DIRECTOR', 'LINE_MANAGER', 'EMPLOYEE', 'KIOSK']) {
      assert.equal(canAssignRole(actor, target), true, `${actor} -> ${target}`);
    }
  }
});

test('HR_DIRECTOR can only assign EMPLOYEE, LINE_MANAGER, KIOSK', () => {
  assert.equal(canAssignRole('HR_DIRECTOR', 'EMPLOYEE'), true);
  assert.equal(canAssignRole('HR_DIRECTOR', 'LINE_MANAGER'), true);
  assert.equal(canAssignRole('HR_DIRECTOR', 'KIOSK'), true);
  assert.equal(canAssignRole('HR_DIRECTOR', 'HR_DIRECTOR'), false);
  assert.equal(canAssignRole('HR_DIRECTOR', 'CEO'), false);
  assert.equal(canAssignRole('HR_DIRECTOR', 'ADMIN'), false);
});

test('other roles cannot assign anything', () => {
  assert.equal(canAssignRole('EMPLOYEE', 'EMPLOYEE'), false);
  assert.equal(canAssignRole('LINE_MANAGER', 'EMPLOYEE'), false);
});

test('HR_DIRECTOR cannot manage CEO or ADMIN accounts but can manage the rest', () => {
  assert.equal(canManageUserWithRole('HR_DIRECTOR', 'CEO'), false);
  assert.equal(canManageUserWithRole('HR_DIRECTOR', 'ADMIN'), false);
  assert.equal(canManageUserWithRole('HR_DIRECTOR', 'EMPLOYEE'), true);
  assert.equal(canManageUserWithRole('CEO', 'ADMIN'), true);
  assert.equal(canManageUserWithRole('EMPLOYEE', 'EMPLOYEE'), false);
});

test('temporary passwords are strong and unique', () => {
  const a = generateTemporaryPassword();
  const b = generateTemporaryPassword();
  assert.notEqual(a, b);
  for (const p of [a, b]) {
    assert.ok(p.length >= 12);
    assert.match(p, /[A-Za-z]/);
    assert.match(p, /\d/);
    assert.match(p, /[^A-Za-z0-9]/);
  }
});
