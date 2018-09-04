function parseUri(uri) {
  return uri.split('&').reduce((acc, param) => {
    let pair = param
      .split('=')
      .map(value => decodeURIComponent(value.replace('+', ' ')))
    acc[pair[0]] = pair[1]
    return acc
  }, {})
}

async function getAudio(id) {
  let data = parseUri(
    await $.get(
      'https://cors-anywhere.herokuapp.com/https://www.youtube.com/get_video_info?video_id=' +
        id
    )
  )
  // console.log(data)
  let streams = (data.url_encoded_fmt_stream_map + ',' + data.adaptive_fmts)
    .split(',')
    .map(parseUri)
  // console.log(streams);
  let youtubeTitle = data.title.split(' - ')
  let image = data.thumbnail_url.replace('default', 'maxresdefault')
  let audio = streams.find(stream => stream.type.startsWith('audio/'))
  return {
    file: audio.url,
    image: image,
    title: youtubeTitle.length > 1 ? youtubeTitle[1] : youtubeTitle[0],
    artist: youtubeTitle.length > 1 ? youtubeTitle[0] : undefined
  }
}
