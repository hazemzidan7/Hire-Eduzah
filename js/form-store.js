window.FormStore = (function () {
  var _data = {};
  var _files = {};
  return {
    set: function (key, val) { _data[key] = val; },
    get: function (key, def) { return (key in _data) ? _data[key] : (def !== undefined ? def : ''); },
    setFile: function (key, file) { _files[key] = file; },
    getFile: function (key) { return _files[key] || null; },
    getAll: function () { return Object.assign({}, _data); },
    getAllFiles: function () { return Object.assign({}, _files); },
  };
})();
