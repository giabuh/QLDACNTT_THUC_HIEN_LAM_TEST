const asyncHandler = require('../../utils/asyncHandler');
const service = require('./service');

const list = asyncHandler(async (req, res) => {
  const { data, pagination } = await service.list(req.query);
  res.json({ success: true, data, pagination });
});

module.exports = { list };
