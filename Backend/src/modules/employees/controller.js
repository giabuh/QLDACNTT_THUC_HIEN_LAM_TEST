const asyncHandler = require('../../utils/asyncHandler');
const service = require('./service');

const list = asyncHandler(async (req, res) => {
  const { data, pagination } = await service.list(req.user, req.query);
  res.json({ success: true, data, pagination });
});

const get = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.get(req.user, req.params.id, req.scope) });
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, message: 'Thêm nhân viên thành công', data: await service.create(req.user, req.body) });
});

const update = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Cập nhật nhân viên thành công', data: await service.update(req.user, req.params.id, req.body) });
});

module.exports = { list, get, create, update };
