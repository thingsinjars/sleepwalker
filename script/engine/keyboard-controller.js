// bind keyboard events to game functions (movement, etc)


function bindKeys() {

  document.onkeydown = function(e) {
    e = e || window.event;

    switch(e.keyCode) { // which key was pressed?
    case 38:
      // up, move player forward, ie. increase speed
      player.speed = 1;
      break;

    case 40:
      // down, move player backward, set negative speed
      player.speed = -1;
      break;

    case 37:
      // left, rotate player left
      player.dir = -1;
      break;

    case 39:
      // right, rotate player right
      player.dir = 1;
      break;
    }
  }

  document.onkeyup = function(e) {
    e = e || window.event;

    switch(e.keyCode) {
    case 38:
    case 40:
      player.speed = 0; // stop the player movement when up/down key is released
      break;
    case 37:
    case 39:
      player.dir = 0;
      break;
    }
  }
}

function TouchController(areas, repeat) {
  var touchtimer;
  document.onmousedown = document.ontouchstart = document.ontouchmove = function(e) {
    var position;
    e.preventDefault();
    e.touches = [{
      'clientX': e.pageX,
      'clientY': e.pageY
    }];
    switch(true) {
    case(e.touches[0].clientY < window.innerHeight / 3):
      position = 'top';
      break;
    case(e.touches[0].clientY > (2 * window.innerHeight) / 3):
      position = 'bottom';
      break;
    default:
      position = 'middle';
      break;
    }
    position += '-';
    switch(true) {
    case(e.touches[0].clientX < window.innerWidth / 3):
      position += 'left';
      break;
    case(e.touches[0].clientX > (2 * window.innerWidth) / 3):
      position += 'right';
      break;
    default:
      position += 'center';
      break;
    }

    if(!(position in areas)) {
      return true;
    }

    areas[position]();
    if(repeat !== 0) {
      clearInterval(touchtimer);
      touchtimer = setInterval(areas[position], repeat);
    }
    return false;
  };
  // Cancel timeout
  document.onmouseup = document.ontouchend = function(e) {
    clearInterval(touchtimer);
  };
};


TouchController({
  'top-left': function() {
    topLeftFunction();
  }
}, 20);

TouchController({
  'top-center': function() { // UP
    player.speed = 1;
  },
  'middle-left': function() { // LEFT
    player.dir = -1;
  },
  'middle-center': function() { // center
    player.speed = 0;
    player.dir = 0;
  },
  'middle-right': function() { // RIGHT
    player.dir = 1;
  },

  'bottom-center': function() {
    player.speed = -1;
  },
}, 20);