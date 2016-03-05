module.exports = (req, res, body, cb) => {
  if (body instanceof Error) {
    // snoop for RestError or HttpError, but don't rely on
    // instanceof
    res.statusCode = body.statusCode || 500;

    body = { error: body.message };
  } else if (Buffer.isBuffer(body)) {
    body = body.toString('base64');
  }

  let data = JSON.stringify(body);
  res.setHeader('Content-Length', Buffer.byteLength(data));
  return cb(null, data);
};
