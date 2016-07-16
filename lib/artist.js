const request = require('./common/request')
const baseurl = require('./common/util').baseurl

module.exports = Artist

/**
 * Initialize `Artist` with given `id`.
 *
 * @param {Number} id
 * @public
 */
function Artist(id) {
  if (!(this instanceof Artist)) {
    return new Artist(id)
  }

  this.id = id
}

Artist.prototype = {
  constructor: Artist,

  /**
   * Get top songs of an artist.
   *
   * @return {Promise<Array>}
   * @public
   */
  topSongs() {
    var url = `${baseurl}/artist?id=${this.id}`
    return request(url).then(parseSongs)
  },

  /**
   * Get artist description.
   *
   * @return {Promise<String>}
   * @public
   */
  desc() {
    var url = `${baseurl}/artist/desc?id=${this.id}`
    return request(url).then(parseDesc)
  }
}

/**
 * Get songs from html.
 *
 * @private
 */
function parseSongs($) {
  var ele = $('#song-list-pre-cache textarea')

  if (!ele.length) {
    return []
  }

  try {
    return JSON.parse(ele.text())
  } catch (err) {
    return []
  }
}

/**
 * Get artist description.
 *
 * @private
 */
function parseDesc($) {
  return $('.n-artdesc').text()
}
