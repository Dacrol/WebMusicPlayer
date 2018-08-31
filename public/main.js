const songs = ['bad_apple', 'fires_at_midnight', 'devil_trigger']

songs.forEach((song) => {
  $('.songs').append(`<div class="song d-flex align-items-center pl-4 pr-4">
  <div class="song-cover">
    <img class="img-thumbnail" src="/${song}.jpg" alt="${titleCase(song)}">
  </div>
  <div class="flex-fill song-title pl-4">${titleCase(song)}</div>
  <div class="play-icon">
    <i class="fas fa-play-circle" aria-hidden="true"></i>
  </div>
  <audio class="audio_${song}" src="${song}.mp3" ></audio>
</div>`)
})

$('.play-button').click(function (e) { 
  e.preventDefault()
  play()
  toggleButtons()
})

$('.pause-button').click(function (e) { 
  e.preventDefault()
  pause()
  toggleButtons()
})

function play() {
  $('.audio_bad_apple').get(0).play()
}

function pause() {
  $('.audio_bad_apple').get(0).pause()
}

function toggleButtons() {
  $('.pause-button').toggle()
  $('.play-button').toggle()
}

function titleCase(str) {
  var splitStr = str.replace(/_/g, ' ').toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  return splitStr.join(' '); 
}