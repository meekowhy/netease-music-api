const request = require('request')
const cheerio = require('cheerio')

const headers = {
  'Referer': 'http://music.163.com/',
  'User-Agent': [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5)',
    'AppleWebKit/537.36 (KHTML, like Gecko)',
    'Chrome/51.0.2704.103 Safari/537.36'
  ].join(' ')
}

const transforms = {
  html: data => cheerio.load(data),
  json: data => JSON.parse(data),
  str: data => data
}

exports = module.exports = sendRequest

function sendRequest(url, form, transform) {
  var options = {
    url,
    method: 'GET',
    headers
  }

  if (form) {
    Object.assign(options, {
      method: 'POST',
      form
    })
  }

  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) {
        return reject(err)
      }
      transform = transforms[transform] || transforms['html']
      resolve(transform(body))
    })
  })
}
