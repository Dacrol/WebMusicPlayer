let songs = [{file: 'bad_apple', title: 'Bad Apple', artist: 'Nomico'},
{file: 'monody', title: 'Monody', artist: 'TheFatRat feat. Laura Brehm'}]

songs = [...songs, ...songs, ...songs]
console.log(songs)
let playing = songs[0].file

songs.forEach(song => {
  $('.songs')
    .append(`<div class="song d-flex align-items-center pl-4" data-song="${song.file}">
  <div class="song-cover">
    <img class="img-thumbnail" src="/${song.file}.jpg" alt="${titleCase(song.title)}">
  </div>
  <div class="flex-fill song-title pl-4">
  <div>${titleCase(song.title)}</div>
  <div><small class="text-muted">${song.artist}</small></div>
  </div>
  <div class="play-icon">
    <i class="fas fa-play-circle" aria-hidden="true"></i>
  </div>
  <audio class="audio_${song.file}" src="${song.file}.mp3" ></audio>
</div>`)
  $('.audio_' + song.file)
    .get(0)
    .addEventListener('timeupdate', function(e) {
      let progress = this.currentTime / this.duration
      $('.progress-bar')
        .attr('aria-valuenow', progress)
        .css('width', Math.round(progress * 100 * 1000) / 1000 + '%')
      $('.time-tracker').text(
        formatTime(this.currentTime) + ' / ' + formatTime(this.duration)
      )
      // console.log(progress)
    })
})

// Hides scrollbar:
const scrollable = $('.hide-scroll').get(0)
scrollable.style.paddingRight =
  scrollable.offsetWidth - scrollable.clientWidth + 20 + 'px'

play(playing, false)

$('.toggle-view').click(function(e) {
  switchViews()
})

$('.song').click(function(e) {
  let song = $(this).attr('data-song')
  reset()
  play(song)
  // console.log(song)
  $('.play-button').hide()
  $('.pause-button').show()
})

$('.play-button').click(function(e) {
  e.preventDefault()
  play()
})

$('.pause-button').click(function(e) {
  e.preventDefault()
  pause()
  // toggleButtons()
})

$('.next').click(function(e) {
  nextPrev()
})

$('.back').click(function(e) {
  nextPrev(-1)
})

function play(song = playing, startPlaying = true) {
  $('.audio_' + playing)
    .get(0)
    .pause()
  playing = song
  const songData = songs.find(data => data.file === song)
  $('.song-title-right').text(songData.title)
  $('.song-artist-right').text(songData.artist)
  updatePlaying(song)
  if (startPlaying){
  $('.audio_' + playing)
    .get(0)
    .play()
  toggleButtons()
}
}

function pause() {
  $('.audio_' + playing)
    .get(0)
    .pause()
  toggleButtons()
}

function toggleButtons() {
  $('.pause-button').toggle()
  $('.play-button').toggle()
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
  $('#current-song').prop('src', '/' + song + '.jpg')
  $('body').css('background-image', `url('${song}.jpg')`)
}

function nextPrev(prev = 1) {
  reset()
  let index = songs.findIndex(song => song === playing)
  let next = songs[index + prev]
  if (next) {
    play(next)
  } else {
    play(prev === 1 ? songs[0] : songs[songs.length - 1])
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
