module.exports = (name, fn) => opt => (req, res, next) => {
  fn._middlewareName = name;
  return fn(req, res, next, opt);
}