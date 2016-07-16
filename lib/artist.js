const request = require('./common/request')
const util = require('./common/util')
const baseurl = util.baseurl

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
  },

  /**
   * Get all albums.
   *
   * @return {Promise<Array>}
   * @public
   */
  albums() {
    var page = 1
    var result = []
    var self = this

    return new Promise((resolve, reject) => {
      next()

      function next() {
        self._albums(page++).then(data => {
          if (data.length) {
            result = result.concat(data)
            next()
          } else {
            resolve(result)
          }
        }).catch(err => reject(err))
      }
    })
  },

  /**
   * Get a page of albums.
   *
   * @param  {Number} page
   * @return {Promise<Array>}
   * @private
   */
  _albums(page = 1) {
    var pagesize = 12
    var offset = (page - 1) * pagesize
    var url = `${baseurl}/artist/album?id=${this.id}&limit=${pagesize}&offset=${offset}`
    return request(url).then(parseAlbums)
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

/**
 * Get albums.
 *
 * @private
 */
function parseAlbums($) {
  var eles = $('.m-cvrlst > li')

  if (!eles.length) {
    return []
  }

  return util.map(eles, ele => {
    ele = $(ele)

    var coverEle = ele.find('img')
    var linkEle = ele.find('.dec a')
    var link = linkEle.attr('href')
    var timeEle = ele.find('p span')

    return {
      id: util.id(link),
      name: linkEle.text(),
      link: util.fullurl(link),
      cover: /(.+)\?param/.exec(coverEle.attr('src'))[1],
      time: timeEle.text()
    }
  })
}
