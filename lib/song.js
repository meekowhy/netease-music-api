const request = require('./common/request')
const baseurl = require('./common/util').baseurl

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

  /**
   * Get lyric of a song.
   *
   * @return {Promise<Object>}
   * @public
   */
  lyric() {
    var url = `${baseurl}/api/song/lyric?id=${this.id}&lv=-1&kv=-1&tv=-1`
    return request(url, null, 'json')
  },

  /**
   * Get detail of a song.
   *
   * @return {Promise<Object>}
   * @public
   */
  detail() {
    var url = `${baseurl}/api/song/detail?ids=[${this.id}]`

    return request(url, null, 'json')
      .then(data => {
        if (data.songs && data.songs.length) {
          return data.songs[0]
        }
        return {
          id: this.id
        }
      })
  }
}
