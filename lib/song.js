const request = require('./common/request')
const urls = require('./common/urls')

module.exports = Song

/**
 * Initialize `Song` with given `id`.
 *
 * @param {Number} id
 * @public
 */
function Song(id) {
  if (!(this instanceof Song)) {
    return new Song(id)
  }

  this.id = id
}

Song.prototype = {
  constructor: Song,

  lyric() {
    var url = urls.song.lyric(this.id)
    return request(url, null, 'json')
  }
}
