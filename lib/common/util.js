module.exports = {
  map,
  count
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
