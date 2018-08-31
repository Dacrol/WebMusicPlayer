const songs = ['bad_apple', 'fires_at_midnight', 'devil_trigger']

let playing = songs[0]

songs.forEach(song => {
  $('.songs')
    .append(`<div class="song d-flex align-items-center pl-4 pr-4" data-song="${song}">
  <div class="song-cover">
    <img class="img-thumbnail" src="/${song}.jpg" alt="${titleCase(song)}">
  </div>
  <div class="flex-fill song-title pl-4">${titleCase(song)}</div>
  <div class="play-icon">
    <i class="fas fa-play-circle" aria-hidden="true"></i>
  </div>
  <audio class="audio_${song}" src="${song}.mp3" ></audio>
</div>`)
  $('.audio_' + song)
    .get(0)
    .addEventListener('timeupdate', function(e) {
      let progress = this.currentTime / this.duration
      $('.progress-bar')
        .attr('aria-valuenow', progress)
        .css('width', Math.round(progress * 100 * 1000) / 1000 + '%')
      // console.log(progress)
    })
})

$('.toggle-view').click(function(e) {
  switchViews()
})

$('.song').click(function(e) {
  let song = $(this).attr('data-song')
  play(song)
  console.log(song)
})

$('.play-button').click(function(e) {
  e.preventDefault()
  play()
})

$('.pause-button').click(function(e) {
  e.preventDefault()
  pause()
  toggleButtons()
})

$('.next').click(function(e) {
  nextPrev()
})

$('.back').click(function(e) {
  nextPrev(-1)
})

function play(song = playing) {
  $('.audio_' + playing)
    .get(0)
    .pause()
  playing = song
  updatePlaying(song)
  $('.audio_' + playing)
    .get(0)
    .play()
  toggleButtons()
}

function pause() {
  $('.audio_' + playing)
    .get(0)
    .pause()
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
  let index = songs.findIndex(song => song === playing)
  let next = songs[index + prev]
  if (next) {
    play(next)
  } else {
    play(prev === 1 ? songs[0] : songs[songs.length - 1])
  }
}

function switchViews () {
  $('#left, #right').toggleClass(['d-none', 'd-flex'])
}

function formatTime (secs) {
  var sec_num = parseInt(secs, 10); // don't forget the second param
  var minutes = Math.floor(sec_num / 60);
  var seconds = sec_num - (minutes * 60);

  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return minutes + ':' + seconds;
}