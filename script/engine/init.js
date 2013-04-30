// Load the values for the current level
playing = true;


function init() {
  // debugger;
  if(level >= map.length) {
    playing = false;
    return endTitle();
  }

  player = players[level];

  mapWidth = map[level][0].length;

  mapHeight = map[level].length;

  bindKeys();

  initScreen();

  initSprites();

  initEnemies();

  drawMiniMap();

  showTitle(level);

  initAudio();

  // preparingNewLevel = false;
  if(level === 0) {
    gameCycle();
    renderCycle();
  }
}

function initScreen() {

  var screen = $("screen");

  for(var i = 0; i < screenWidth; i += stripWidth) {
    var strip = dc("img");
    strip.style.position = "absolute";
    strip.style.height = "0px";
    strip.style.left = strip.style.top = "0px";

    if(useSingleTexture) {
      strip.src = (window.opera ? "assets/images/walls_19color.png" : "assets/images/walls.png");
    }

    strip.oldStyles = {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      clip: "",
      src: ""
    };

    screenStrips.push(strip);
    screen.appendChild(strip);
  }

  // overlay div for adding text like fps count, etc.
  overlay = dc("div");
  overlay.id = "overlay";
  overlay.style.display = showOverlay ? "block" : "none";
  screen.appendChild(overlay);

}

function initEnemies() {
  enemies = [];
  var screen = $("screen");

  for(var i = 0; i < mapEnemies[level].length; i++) {
    var enemy = mapEnemies[level][i];
    var type = Types.enemy[enemy.type];
    var img = dc("img");
    img.src = type.img;
    img.style.display = "none";
    img.style.position = "absolute";

    enemy.state = 0;
    enemy.rot = 0;
    enemy.rotDeg = 0;
    enemy.dir = 0;
    enemy.speed = 0;
    enemy.moveSpeed = type.moveSpeed;
    enemy.rotSpeed = type.rotSpeed;
    enemy.totalStates = type.totalStates;
    enemy.audioFile = type.audioFile;
    enemy.z = type.z;

    enemy.oldStyles = {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      clip: "",
      display: "none",
      zIndex: 0
    };

    enemy.img = img;
    enemies.push(enemy);

    screen.appendChild(img);
  }
}


function initSprites() {
  spriteMap = [];
  for(var y = 0; y < map[level].length; y++) {
    spriteMap[y] = [];
  }

  var screen = $("screen");

  for(var i = 0; i < mapItems[level].length; i++) {
    var sprite = mapItems[level][i];
    var itemType = Types.item[sprite.type];
    var img = dc("img");
    img.src = itemType.img;
    img.style.display = "none";
    img.style.position = "absolute";

    sprite.visible = false;
    sprite.block = itemType.block;
    sprite.img = img;

    spriteMap[sprite.y][sprite.x] = sprite;
    screen.appendChild(img);
  }

}

function endTitle() {
  $('title').innerHTML = 'End of the game.';
}

function showTitle(level) {
  $('title').innerHTML = levelTitles[level];
}