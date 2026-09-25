// ============================================================
// scripts/seed-missing-data.js
// Nạp dữ liệu mẫu cho leave_requests, payroll_periods, payslips, notifications
// ============================================================
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const db = require('../db');

async function seedMissingData() {
  console.log('🚀 Bắt đầu nạp seed data cho các bảng còn trống...');

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // 1. Dọn dẹp dữ liệu cũ nếu đã tồn tại để tránh xung đột
    await client.query('DELETE FROM payslips');
    await client.query('DELETE FROM payroll_periods');
    await client.query('DELETE FROM leave_requests');
    await client.query('DELETE FROM notifications');

    // 2. Nạp leave_requests (3 đơn mẫu với 3 stage)
    console.log('📝 1/4 Đang nạp leave_requests...');
    await client.query(`
      INSERT INTO leave_requests (
        id, employee_id, leave_type_id, start_date, end_date, total_days,
        reason, handover_to, stage,
        manager_approved_by, manager_approved_at, manager_note,
        hr_approved_by, hr_approved_at, hr_note, submitted_at
      ) VALUES 
      (
        'LP-2026-001', 'NV-0842', 'LT-AL', CURRENT_DATE + 2, CURRENT_DATE + 3, 2.0,
        'Nghỉ giải quyết việc gia đình cá nhân', 'Đặng Thảo', 'CHO_TRUONG_PHONG_DUYET',
        NULL, NULL, NULL,
        NULL, NULL, NULL, NOW() - INTERVAL '1 day'
      ),
      (
        'LP-2026-002', 'NV-1003', 'LT-SL', CURRENT_DATE - 3, CURRENT_DATE - 2, 2.0,
        'Khám sức khỏe chuyên sâu có chỉ định giấy C65', 'Trần Trọng', 'CHO_HR_PHE_CHUAN',
        'NV-1002', NOW() - INTERVAL '2 days', 'Đồng ý duyệt cấp 1, chuyển HR duyệt thủ tục bảo hiểm',
        NULL, NULL, NULL, NOW() - INTERVAL '3 days'
      ),
      (
        'LP-2026-003', 'NV-1005', 'LT-AL', CURRENT_DATE - 10, CURRENT_DATE - 9, 2.0,
        'Nghỉ phép thường niên kết hợp nghỉ dưỡng', 'Phạm Minh Quân', 'DA_PHE_DUYET',
        'NV-1002', NOW() - INTERVAL '10 days', 'Đồng ý sắp xếp công việc',
        'NV-1001', NOW() - INTERVAL '9 days', 'HR phê duyệt theo chế độ phép năm', NOW() - INTERVAL '11 days'
      )
    `);

    // 3. Nạp payroll_periods (1 kỳ đã chốt 2026-08, 1 kỳ dự thảo 2026-09)
    console.log('💰 2/4 Đang nạp payroll_periods & payslips...');
    const periodRes = await client.query(`
      INSERT INTO payroll_periods (
        period, total_headcount, total_net, total_bhxh, total_tax, total_ot_hours,
        status, locked_by, locked_at, note
      ) VALUES
      ('2026-08', 14, 0, 0, 0, 48.5, 'DA_CHOT', 'NV-1001', '2026-09-05 17:30:00', 'Kỳ lương Tháng 08/2026 đã chốt và chuyển khoản thành công'),
      ('2026-09', 14, 0, 0, 0, 24.0, 'DU_THAO', NULL, NULL, 'Kỳ lương Tháng 09/2026 đang tổng hợp dữ liệu chấm công')
      RETURNING id, period
    `);

    const periodAugId = periodRes.rows.find(p => p.period === '2026-08').id;
    const periodSepId = periodRes.rows.find(p => p.period === '2026-09').id;

    // Lấy danh sách 14 nhân viên để sinh phiếu lương tháng 08
    const { rows: employees } = await client.query(
      `SELECT id, base_salary, bank_account, bank_name FROM employees ORDER BY id`
    );

    let sumNet = 0;
    let sumBhxh = 0;
    let sumTax = 0;

    for (const emp of employees) {
      const base = parseFloat(emp.base_salary) || 12000000;
      const actualWorkDays = 22;
      const standardWorkDays = 22;
      const otHours = emp.id === 'NV-0842' ? 6 : emp.id === 'NV-1004' ? 8 : 0;
      const otPay = Math.round(otHours * (base / 22 / 8 * 1.5));
      const allowances = 1500000; // Phụ cấp ăn trưa + xăng xe
      const bonus = emp.id === 'NV-0001' ? 10000000 : 0;
      const gross = base + otPay + allowances + bonus;

      const bhxh = Math.round(base * 0.08);
      const bhyt = Math.round(base * 0.015);
      const bhtn = Math.round(base * 0.01);
      const pitDeduction = 11000000;
      const pitTaxable = Math.max(0, gross - (bhxh + bhyt + bhtn) - pitDeduction);
      const pit = pitTaxable > 0 ? Math.round(pitTaxable * 0.05) : 0;
      const totalDeductions = bhxh + bhyt + bhtn + pit;
      const net = gross - totalDeductions;

      sumNet += net;
      sumBhxh += bhxh;
      sumTax += pit;

      await client.query(`
        INSERT INTO payslips (
          period_id, employee_id, base_salary, actual_work_days, standard_work_days,
          ot_hours, ot_pay, allowances, bonus, gross_income,
          bhxh_amount, bhyt_amount, bhtn_amount, pit_deduction, pit_taxable, pit_amount,
          total_deductions, net_salary, status, paid_date, bank_account, bank_name
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16,
          $17, $18, 'DA_CHUYEN_KHOAN', '2026-09-05', $19, $20
        )
      `, [
        periodAugId, emp.id, base, actualWorkDays, standardWorkDays,
        otHours, otPay, allowances, bonus, gross,
        bhxh, bhyt, bhtn, pitDeduction, pitTaxable, pit,
        totalDeductions, net, emp.bank_account, emp.bank_name
      ]);
    }

    // Cập nhật tổng kỳ lương tháng 08
    await client.query(`
      UPDATE payroll_periods SET
        total_net = $1, total_bhxh = $2, total_tax = $3
      WHERE id = $4
    `, [sumNet, sumBhxh, sumTax, periodAugId]);

    // 4. Nạp notifications (5 thông báo mẫu)
    console.log('🔔 3/4 Đang nạp notifications...');
    await client.query(`
      INSERT INTO notifications (
        id, role_target, type, category, title, summary,
        sender_name, sender_role, is_read, created_at
      ) VALUES
      (
        'NOTIF-0001', 'CEO', 'payroll', 'Tài chính & Lương',
        'Bảng lương Tháng 08/2026 đã được phê duyệt và giải ngân',
        'Tổng chi ngân sách lương: ' || TO_CHAR($1::NUMERIC, 'FM999,999,999,999') || ' VNĐ cho 14 nhân sự.',
        'Trần Mai Hương', 'Giám Đốc Nhân Sự (HRD)', false, NOW() - INTERVAL '2 hours'
      ),
      (
        'NOTIF-0002', 'LINE_MANAGER', 'approval', 'Nghỉ phép',
        'Đơn xin nghỉ phép mới chờ phê duyệt: LP-2026-001',
        'Nhân viên Phạm Minh Quân xin nghỉ 2 ngày từ ' || TO_CHAR(CURRENT_DATE + 2, 'DD/MM') || ' đến ' || TO_CHAR(CURRENT_DATE + 3, 'DD/MM') || '.',
        'Phạm Minh Quân', 'Kỹ sư Phần mềm', false, NOW() - INTERVAL '4 hours'
      ),
      (
        'NOTIF-0003', 'HR_DIRECTOR', 'c65_claim', 'Bảo hiểm & Phép',
        'Đơn nghỉ ốm C65 chờ HR duyệt chế độ: LP-2026-002',
        'Trưởng phòng Vũ Đình Khang đã duyệt cấp 1 cho nhân viên Trần Quang Thắng (Kèm minh chứng bệnh viện).',
        'Vũ Đình Khang', 'Trưởng phòng Kỹ thuật', false, NOW() - INTERVAL '1 day'
      ),
      (
        'NOTIF-0004', 'EMPLOYEE', 'payroll', 'Phiếu lương cá nhân',
        'Phiếu lương Tháng 08/2026 đã sẵn sàng trên cổng ESS',
        'Đã hoàn tất thanh toán tiền lương qua ngân hàng Vietcombank. Vui lòng kiểm tra sao kê.',
        'Phòng Kế toán & Nhân sự', 'C&B Specialist', true, NOW() - INTERVAL '3 days'
      ),
      (
        'NOTIF-0005', 'EMPLOYEE', 'system', 'Hệ thống',
        'Chào mừng bạn đến với Cổng thông tin Nhân sự NEXUS HR v2.0',
        'Trải nghiệm các tính năng chấm công FaceID, cổng dự án Kanban và quản lý ngày phép trực tuyến.',
        'Ban Quản Trị Hệ Thống', 'Admin', true, NOW() - INTERVAL '5 days'
      )
    `, [sumNet]);

    // 5. Cập nhật Materialized View
    console.log('🔄 4/4 Refresh Materialized View mv_dashboard_stats...');
    await client.query('REFRESH MATERIALIZED VIEW mv_dashboard_stats');

    await client.query('COMMIT');
    console.log('✅ Nạp dữ liệu mẫu hoàn tất 100%! Cơ sở dữ liệu đã sẵn sàng cho demo.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Lỗi khi nạp seed data:', error);
    throw error;
  } finally {
    client.release();
    process.exit(0);
  }
}

seedMissingData();
