const request = require('./common/request')
const urls = require('./common/urls')
const util = require('./common/util')
const CATS = require('./playlist-cats')
const ORDERS = ['hot', 'new']

module.exports = Playlist

function Playlist() {

}

Playlist.CATS = CATS
Playlist.ORDERS = ORDERS

/**
 * Query playlist.
 *
 * @param  {Object} options
 * @param {String} [options.cat] should be one of `Playlist.CATS`
 * @param {String} [options.order] should be one of `Playlist.ORDERS`
 * @param {Number} [options.page]
 * @public
 */
Playlist.query = function(options) {
  var url = urls.playlist.query(options)
  return request(url).then(parsePlaylist)
}

function parsePlaylist($) {
  var eles = $('#m-pl-container > li')

  if (!eles.length) {
    return []
  }

  return util.map(eles, ele => {
    ele = $(ele)

    var coverEle = ele.find('.j-flag')
    var nameEle = ele.find('.msk')
    var link = nameEle.attr('href')
    var playEle = ele.find('.nb')
    var creatorEle = ele.find('.nm')
    var creatorLink = creatorEle.attr('href')

    return {
      id: /id=(\d+)/.exec(link)[1],
      name: nameEle.attr('title'),
      link: urls.full(link),
      cover: /(.+)\?param/.exec(coverEle.attr('src'))[1],
      playcount: util.count(playEle.text()),
      creator: {
        id: /id=(\d+)/.exec(creatorLink)[1],
        name: creatorEle.attr('title'),
        link: urls.full(creatorLink)
      },
      crawltime: Date.now()
    }
  })
}
