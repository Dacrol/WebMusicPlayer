$('.play-button').click(function (e) { 
  e.preventDefault()
  play()
})

$('.pause-button').click(function (e) { 
  e.preventDefault()
  pause()
})

function play() {
  $('.audio_bad_apple').get(0).play()
}

function pause() {
  $('.audio_bad_apple').get(0).pause()
}
