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