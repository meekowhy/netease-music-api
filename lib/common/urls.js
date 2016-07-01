const qs = require('querystring')

const baseurl = 'http://music.163.com'
exports.baseurl = baseurl

/**
 * Return the full url with given path.
 *
 * @param  {String} path
 * @return {String}
 * @public
 */
exports.full = function(path) {
  if (path[0] !== '/') {
    path = '/' + path
  }
  return `${baseurl}${path}`
}

exports.playlist = {
  query(options) {
    var pagesize = 35
    var page = options.page || 1
    delete options.page

    Object.assign(options, {
      limit: pagesize,
      offset: (page - 1) * pagesize
    })

    return `${baseurl}/discover/playlist/?${qs.stringify(options)}`
  }
}
