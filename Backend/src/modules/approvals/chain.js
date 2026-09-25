// Approval chain shared by leave requests, overtime requests and medical claims.
//   employee -> LINE_MANAGER (same department) -> HR_DIRECTOR
//   LINE_MANAGER / HR_DIRECTOR requests skip to the last step and only the CEO approves them.
//   A CEO request is approved automatically; the CEO can approve any pending step directly.
//   Nobody acts on their own request.

const PENDING = ['CHO_TRUONG_PHONG_DUYET', 'CHO_HR_PHE_CHUAN'];
const CEO_ONLY_REQUESTERS = ['LINE_MANAGER', 'HR_DIRECTOR', 'CEO'];

function initialStage(requesterRole) {
  if (requesterRole === 'CEO') return { stage: 'CHO_HR_PHE_CHUAN', autoApprove: true };
  if (CEO_ONLY_REQUESTERS.includes(requesterRole)) return { stage: 'CHO_HR_PHE_CHUAN', autoApprove: false };
  return { stage: 'CHO_TRUONG_PHONG_DUYET', autoApprove: false };
}

/**
 * May the actor approve (or reject) a request that is currently at `stage`?
 * -> { ok: true, next } where next is the stage after an approval, or { ok: false, reason }.
 * Reasons: NOT_PENDING | SELF_APPROVAL | WRONG_ROLE | OUT_OF_SCOPE | CEO_ONLY
 */
function decide({
  stage, requesterRole, requesterId, requesterDepartmentId, actorRole, actorId, actorDepartmentId,
}) {
  if (!PENDING.includes(stage)) return { ok: false, reason: 'NOT_PENDING' };
  if (actorId && actorId === requesterId) return { ok: false, reason: 'SELF_APPROVAL' };
  if (actorRole === 'CEO') return { ok: true, next: 'DA_PHE_DUYET' };

  if (stage === 'CHO_TRUONG_PHONG_DUYET') {
    if (actorRole !== 'LINE_MANAGER') return { ok: false, reason: 'WRONG_ROLE' };
    if (!actorDepartmentId || actorDepartmentId !== requesterDepartmentId) return { ok: false, reason: 'OUT_OF_SCOPE' };
    return { ok: true, next: 'CHO_HR_PHE_CHUAN' };
  }

  // stage === 'CHO_HR_PHE_CHUAN'
  if (CEO_ONLY_REQUESTERS.includes(requesterRole)) return { ok: false, reason: 'CEO_ONLY' };
  if (actorRole === 'HR_DIRECTOR') return { ok: true, next: 'DA_PHE_DUYET' };
  return { ok: false, reason: 'WRONG_ROLE' };
}

/** Monday-to-Friday days between two 'YYYY-MM-DD' dates, inclusive. */
function workingDays(start, end) {
  const from = new Date(`${start}T00:00:00Z`);
  const to = new Date(`${end}T00:00:00Z`);
  let count = 0;
  for (let d = from; d <= to; d = new Date(d.getTime() + 86400000)) {
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) count += 1;
  }
  return count;
}

module.exports = { initialStage, decide, workingDays, PENDING };
