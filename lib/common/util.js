const baseurl = 'http://music.163.com'

module.exports = {
  map,
  count,
  id,
  baseurl,
  fullurl
}

/**
 * Return the full url with given path.
 *
 * @param  {String} path
 * @return {String}
 * @public
 */
function fullurl(path) {
  if (path[0] !== '/') {
    path = '/' + path
  }
  return `${baseurl}${path}`
}

/**
 * Map function.
 *
 * @param  {Array|Object} eles
 * @param  {Function} fn
 * @return {Array}
 * @public
 */
function map(eles, fn) {
  return Array.prototype.map.call(eles, fn)
}

/**
 * Convert a count string to number.
 *
 * Examples:
 *
 *   count('23')
 *   // => 23
 *   count('23万')
 *   // => 230000
 *
 * @param  {String} cnt
 * @return {Number}
 * @public
 */
function count(cnt) {
  var reg = /^(\d+)(.*)$/
  var result = reg.exec(cnt)

  if (!result) {
    return 0
  }

  var num = +result[1]
  var suffix = result[2]

  if (suffix === '万') {
    return num * 10000
  }

  return num
}

/**
 * Get id from a link.
 *
 * @param  {String} link
 * @return {Number}
 * @public
 */
function id(link) {
  var result = /id=(\d+)/.exec(link)
  return result ? +result[1] : ''
}
