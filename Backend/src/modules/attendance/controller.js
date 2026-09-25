const asyncHandler = require('../../utils/asyncHandler');
const service = require('./service');

const checkIn = asyncHandler(async (req, res) => {
  const { row, message } = await service.checkIn(req.user, req.body);
  res.status(201).json({ success: true, message, data: row });
});

const checkOut = asyncHandler(async (req, res) => {
  const { row, message } = await service.checkOut(req.user, req.body);
  res.json({ success: true, message, data: row });
});

const today = asyncHandler(async (req, res) => {
  const { row, checkedIn, checkedOut } = await service.today(req.user);
  res.json({ success: true, data: row, checkedIn, checkedOut });
});

const myQr = asyncHandler(async (req, res) => {
  res.json({ success: true, ...service.myQr(req.user) });
});

const kioskPunch = asyncHandler(async (req, res) => {
  const { action, created, row, message } = await service.kioskPunch(req.body);
  res.status(created ? 201 : 200).json({ success: true, action, message, data: row });
});

const list = asyncHandler(async (req, res) => {
  const { data, pagination } = await service.list(req.user, req.query, req.scope);
  res.json({ success: true, data, pagination });
});

const adjust = asyncHandler(async (req, res) => {
  const { row, created } = await service.adjust(req.user, req.body, req);
  res.status(created ? 201 : 200).json({ success: true, message: 'Đã cập nhật chấm công', data: row });
});

const timesheet = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.timesheet(req.user, req.query, req.scope) });
});

const exceptions = asyncHandler(async (req, res) => {
  res.json({ success: true, ...(await service.exceptions(req.user, req.query, req.scope)) });
});

const live = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.live(req.user, req.scope) });
});

module.exports = { checkIn, checkOut, today, myQr, kioskPunch, list, adjust, timesheet, exceptions, live };
