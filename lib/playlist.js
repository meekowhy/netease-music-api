const request = require('./common/request')
const urls = require('./common/urls')
const util = require('./common/util')
const CATS = require('./playlist-cats')
const ORDERS = ['hot', 'new']

module.exports = Playlist

/**
 * Initialize `Playlist` with given `id`.
 *
 * @param {Number} id
 * @public
 */
function Playlist(id) {
  if (!(this instanceof Playlist)) {
    return new Playlist(id)
  }

  this.id = id
}

Playlist.prototype = {

  /**
   * Get songs of a playlist.
   *
   * @return {Array}
   * @public
   */
  songs() {
    var url = urls.playlist.home(this.id)
    return request(url).then(parseSongs)
  },

  /**
   * Get detail information of a playlist.
   *
   * @return {Object}
   * @public
   */
  detail() {
    var url = urls.playlist.home(this.id)
    return request(url).then(parseDetail)
  }
}

/**
 * Categories and orders for query options.
 *
 * @public
 */
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

/**
 * Get playlists from html.
 *
 * @private
 */
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
      id: util.id(link),
      name: nameEle.attr('title'),
      link: urls.full(link),
      cover: /(.+)\?param/.exec(coverEle.attr('src'))[1],
      playcount: util.count(playEle.text()),
      creator: {
        id: util.id(creatorLink),
        name: creatorEle.attr('title'),
        link: urls.full(creatorLink)
      },
      crawltime: Date.now()
    }
  })
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
 * Get playlist detail information from html.
 *
 * @private
 */
function parseDetail($) {
  var creatorEle = $('.user .name a')
  var creatorLink = creatorEle.attr('href')
  var createTime = $('.user .time').text()
  var opEle = $('#content-operation')
  var id = opEle.data('rid')

  return {
    id,
    name: $('.tit h2').text(),
    link: urls.playlist.home(id),
    cover: $('.cover img').data('src'),
    creator: {
      id: util.id(creatorLink),
      name: creatorEle.text(),
      link: urls.full(creatorLink)
    },
    createtime: +new Date(createTime.split(/\s+/)[0]),
    favs: opEle.find('.u-btni-fav').data('count'),
    shares: opEle.find('.u-btni-share').data('count'),
    comments: +$('#cnt_comment_count').text(),
    playcount: +$('#play-count').text(),
    tags: util.map($('.tags i'), ele => $(ele).text()),
    description: $('#album-desc-more').text(),
    songs: parseSongs($),
    crawltime: Date.now()
  }
}
