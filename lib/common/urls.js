const qs = require('querystring')

const baseurl = 'http://music.163.com'
exports.baseurl = baseurl

module.exports = {
  baseurl,
  full,
  playlist,
  album
}

/**
 * Return the full url with given path.
 *
 * @param  {String} path
 * @return {String}
 * @public
 */
function full(path) {
  if (path[0] !== '/') {
    path = '/' + path
  }
  return `${baseurl}${path}`
}

function playlist(id) {
  return `${baseurl}/playlist?id=${id}`
}

playlist.query = function(options = {}) {
  var pagesize = 35
  var page = options.page || 1
  delete options.page

  Object.assign(options, {
    limit: pagesize,
    offset: (page - 1) * pagesize
  })

  return `${baseurl}/discover/playlist/?${qs.stringify(options)}`
}

function album(id) {
  return `${baseurl}/album?id=${id}`
}
