let songs = [
  {
    file: 'bad_apple.mp3',
    title: 'Bad Apple',
    artist: 'Nomico',
    image: 'bad_apple.jpg'
  },
  {
    file: 'monody.mp3',
    title: 'Monody',
    artist: 'TheFatRat feat. Laura Brehm',
    image: 'monody.jpg'
  }
]

const state = { playing: false }

// songs = [...songs, ...songs, ...songs]
// console.log(songs)
loadFromLocalstorage()

songs.forEach(addToPlaylist)

let playing = songs[0].id

// Hides scrollbar:
/* const scrollable = $('.hide-scroll').get(0)
scrollable.style.paddingRight =
  (scrollable.offsetWidth - scrollable.clientWidth > 10
    ? scrollable.offsetWidth - scrollable.clientWidth
    : 20) +
  20 +
  'px' */

play(playing, false)

$('.shuffle, .repeat, .favorite, .playlist-add').click(function() {
  $(this).popover('show')
  setTimeout(() => {
    $(this).popover('hide')
  }, 1000);
})

$(document).bind('keypress', function(e) {
  if (e.which === 32) {
    if (state.playing) pause()
    else play()
  }
})

$('.from-youtube').click(function(event) {
  event.preventDefault()
  let id = window.prompt('Enter YouTube ID')
  // console.log(id)
  addFromYoutube(id)
})

$('.toggle-view').click(function(e) {
  switchViews()
})

$('.play-button').click(function(e) {
  e.preventDefault()
  play()
})

$('.pause-button').click(function(e) {
  e.preventDefault()
  pause()
})

$('.next').click(function(e) {
  nextPrev()
})

$('.back').click(function(e) {
  nextPrev(-1)
})

function play(song = playing, startPlaying = true) {
  let songData
  if (typeof song === 'string') {
    songData = songs.find(data => data.id === song)
  } else {
    songData = song
    song = songData.id
  }
  $('.audio_' + playing)
    .get(0)
    .pause()
  playing = song
  $('.song-title-right').text(songData.title)
  $('.song-artist-right').text(songData.artist)
  updatePlaying(songData)
  const songElement = $('.audio_' + playing).get(0)
  songElement.addEventListener('loadedmetadata', function() {
    console.log(this)
    $('.time-tracker').text(
      formatTime(this.currentTime) + ' / ' + formatTime(this.duration)
    )
  })
  if (startPlaying) {
    songElement.play()
    showPause()
    state.playing = true
  }
}

function pause() {
  $('.audio_' + playing)
    .get(0)
    .pause()
  showPlay()
  state.playing = false
}

function titleCase(str) {
  let splitStr = str
    .replace(/_/g, ' ')
    .toLowerCase()
    .split(' ')
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
  }
  return splitStr.join(' ')
}

function updatePlaying(song) {
  $('#current-song').prop('src', song.image)
  $('body').css('background-image', `url('${song.image}')`)
}

function nextPrev(direction = 1) {
  stop()
  let index = songs.findIndex(song => song.id === playing)
  let next = songs[index + direction]
  if (next) {
    play(next.id)
  } else {
    play(direction === 1 ? songs[0].id : songs[songs.length - 1].id)
  }
}

function switchViews() {
  $('#left, #right').toggleClass(['d-none', 'd-flex'])
}

function formatTime(secs) {
  let sec_num = parseInt(secs, 10)
  let minutes = Math.floor(sec_num / 60)
  let seconds = sec_num - minutes * 60
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return minutes + ':' + seconds
}

function reset() {
  $('.audio_' + playing).get(0).currentTime = 0
}

function stop() {
  reset()
  showPlay()
}

function showPlay() {
  $('.play-button').show()
  $('.pause-button').hide()
}

function showPause() {
  $('.play-button').hide()
  $('.pause-button').show()
}

function addToPlaylist(song) {
  if (!song.id) song.id = song.file.replace('.', '')
  const songElement = $(`<div class="song d-flex justify-content-center align-items-center" data-song="${
    song.id
  }">
  <div class="song-cover">
    <img class="img-thumbnail" src="${song.image}" alt="${titleCase(
    song.title
  )}">
  </div>
  <div class="flex-fill song-title pl-2">
  <div>${titleCase(song.title)}</div>
  <div>
  <small class="text-muted">${song.artist || ''}</small>
  </div>
  </div>
  <div class="remove-icon mr-3">
    <i class="fas fa-minus-circle"></i>
  </div>
  <div class="play-icon">
    <i class="fas fa-play-circle" aria-hidden="true"></i>
  </div>
  <audio class="audio_${song.id}" src="${song.file}"></audio>
</div>`)

  songElement
    .appendTo('.songs')
    .click(function(e) {
      let song = $(this).attr('data-song')
      reset()
      play(song)
      // console.log(song)
      $('.play-button').hide()
      $('.pause-button').show()
    })
    .on('click', '.remove-icon', function(e) {
      e.stopPropagation()
      removeSong(song.id)
      songElement.remove()
    })
  const audioElement = $('.audio_' + song.id).get(0)
  audioElement.addEventListener('timeupdate', function(e) {
    let progress = this.currentTime / this.duration
    $('.progress-bar')
      .attr('aria-valuenow', progress)
      .css('width', Math.round(progress * 100 * 1000) / 1000 + '%')
    $('.time-tracker').text(
      formatTime(this.currentTime) + ' / ' + formatTime(this.duration)
    )
    // console.log(progress)
  })
  audioElement.addEventListener('ended', function(e) {
    nextPrev()
  })
}

async function addFromYoutube(id) {
  try {
    let audio = await getAudio(id)
    songs.push(audio)
    addToPlaylist(audio)
    saveToLocalstorage()
  } catch (error) {
    console.warn('YouTube ID has no associated audio stream')
  }
}

function saveToLocalstorage() {
  const storage = window.localStorage
  const data = JSON.stringify(songs)
  if (data && data.length > 0) {
    storage.setItem('playlist', data)
  }
}

function loadFromLocalstorage() {
  const storage = window.localStorage
  const data = JSON.parse(storage.getItem('playlist'))
  if (data && data.length > 0) {
    songs = data
  }
}

function clearStorage() {
  const storage = window.localStorage
  storage.removeItem('playlist')
}

function removeSong(songId) {
  const songIndex = songs.findIndex(data => data.id === songId)
  if (songIndex > -1) {
    songs.splice(songIndex, 1)
    // $('.songs')
    //   .find(`[data-song="${songId}"]`)
    //   .remove()
    saveToLocalstorage()
  }
}
