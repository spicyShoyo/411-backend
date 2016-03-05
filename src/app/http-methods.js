let defineMethodDecorator = (method, path) => (target, name, desc) => {
  desc.value._path = path;
  desc.value._method = method;
  desc.enumerable = true;
  return desc;
};

let PUT = path => defineMethodDecorator('put', path);

let GET = path => defineMethodDecorator('get', path);

let POST = path => defineMethodDecorator('post', path);

let DELETE = path => defineMethodDecorator('del', path);



module.exports = {
  PUT, GET, POST, DELETE
};
