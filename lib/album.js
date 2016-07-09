const request = require('./common/request')
const urls = require('./common/urls')

module.exports = Album

/**
 * Initialize `Album` with given `id`.
 *
 * @param {Number} id
 * @public
 */
function Album(id) {
  if (!(this instanceof Album)) {
    return new Album(id)
  }

  this.id = id
}

Album.prototype = {
  constructor: Album,

  /**
   * Get songs of an album.
   *
   * @return {Promise<Array>}
   * @public
   */
  songs() {
    var url = urls.album(this.id)
    return request(url).then(parseSongs)
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
