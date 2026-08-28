// server/src/utils/apiResponse.js
// Consistent API response envelopes.
export const ok = (res, data, meta = null, status = 200) => {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
};

export const fail = (res, message, status = 400, details = null) => {
  const body = { success: false, error: message };
  if (details) body.details = details;
  return res.status(status).json(body);
};
