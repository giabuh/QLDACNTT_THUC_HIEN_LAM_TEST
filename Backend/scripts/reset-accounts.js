// reset-lead-password.js — Reset tài khoản LEAD và tất cả locked accounts
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../db');

async function resetAccounts() {
  try {
    console.log('🔧 Resetting accounts...\n');

    const accounts = [
      { email: 'ceo@fwbnexus.vn', password: 'Ceo@123456' },
      { email: 'hrd@fwbnexus.vn', password: 'Hrd@123456' },
      { email: 'lead@fwbnexus.vn', password: 'Lead@123456' },
      { email: 'employee@fwbnexus.vn', password: 'Emp@123456' },
    ];

    for (const acc of accounts) {
      const hash = await bcrypt.hash(acc.password, 12);
      const { rowCount } = await db.query(
        `UPDATE users 
         SET password_hash = $1, 
             failed_login_attempts = 0, 
             locked_until = NULL,
             is_active = true
         WHERE LOWER(email) = LOWER($2)`,
        [hash, acc.email]
      );
      console.log(`  ${rowCount > 0 ? '✅' : '⚠️'} ${acc.email} → ${rowCount > 0 ? 'Reset OK' : 'NOT FOUND'}`);
    }

    console.log('\n✅ All accounts reset successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetAccounts();
