function renderAudio() {
  var i;

  // console.log('player: '+player.x, 0, player.y);
  audioContext.listener.setPosition(player.x, 0, player.y);
  setListenerOrientation(player);

  //Update Player audio
  if(typeof player.audio !== 'undefined') {
    if(player.speed === 0) { // Player isn't moving
      player.audio.volume.gain.value = 0;
    } else {
      player.audio.volume.gain.value = 1;
    }
  }

  //Update Enemy audio
  for(i = 0; i < enemies.length; i++) {
    if(typeof enemies[i].audio !== 'undefined') {
      updateAudioPosition(enemies[i]);
    }
  }

  //Update Item audio
  for(i = 0; i < mapItems[level].length; i++) {
    if(typeof mapItems[level][i].audio !== 'undefined') {
      updateAudioPosition(mapItems[level][i]);
    }
  }
}

function updateAudioPosition(noiseMaker) {
  noiseMaker.audio.panner.setPosition(noiseMaker.x, noiseMaker.z, noiseMaker.y);
}

function setListenerOrientation(listener) {
  var x = Math.cos(listener.rot) * 4,
    y = Math.sin(listener.rot) * 4;
  audioContext.listener.setOrientation(x, 0, y, 0, 1, 0);

}