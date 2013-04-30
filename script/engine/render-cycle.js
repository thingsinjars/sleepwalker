/* RenderCycle */
var lastRenderCycleTime = 0;

function renderCycle() {
	// webkitRequestAnimationFrame(renderCycle);
	updateMiniMap();

	clearSprites();

	castRays();

	renderSprites();

	renderEnemies();

	renderAudio();

	// time since last rendering
	var now = new Date().getTime();
	var timeDelta = now - lastRenderCycleTime;
	var cycleDelay = 1000 / 30;
	if(timeDelta > cycleDelay) {
		cycleDelay = Math.max(1, cycleDelay - (timeDelta - cycleDelay));
	}
	lastRenderCycleTime = now;

	setTimeout(function() {
		requestAnimationFrame(renderCycle);
		// Drawing code goes here
	}, cycleDelay);

	// setTimeout(renderCycle, cycleDelay);
	fps = 1000 / timeDelta;
	if(showOverlay) {
		updateOverlay();
	}
}

function clearSprites() {
	// clear the visible sprites array but keep a copy in oldVisibleSprites for later.
	// also mark all the sprites as not visible so they can be added to visibleSprites again during raycasting.
	oldVisibleSprites = [];
	for(var i = 0; i < visibleSprites.length; i++) {
		var sprite = visibleSprites[i];
		oldVisibleSprites[i] = sprite;
		sprite.visible = false;
	}
	visibleSprites = [];
}

function renderSprites() {
	var i, sprite;

	for(i = 0; i < visibleSprites.length; i++) {
		sprite = visibleSprites[i];
		var img = sprite.img;
		img.style.display = "block";

		// translate position to viewer space
		var dx = sprite.x + 0.5 - player.x;
		var dy = sprite.y + 0.5 - player.y;

		// distance to sprite
		var dist = Math.sqrt(dx * dx + dy * dy);

		// sprite angle relative to viewing angle
		var spriteAngle = Math.atan2(dy, dx) - player.rot;

		// size of the sprite
		var size = viewDist / (Math.cos(spriteAngle) * dist);

		if(size <= 0) continue;

		// x-position on screen
		var x = Math.tan(spriteAngle) * viewDist;

		img.style.left = (screenWidth / 2 + x - size / 2) + "px";

		// y is constant since we keep all sprites at the same height and vertical position
		img.style.top = ((screenHeight - size) / 2) + "px";

		img.style.width = size + "px";
		img.style.height = size + "px";

		var dbx = sprite.x - player.x;
		var dby = sprite.y - player.y;
		var blockDist = dbx * dbx + dby * dby;
		img.style.zIndex = -Math.floor(blockDist * 1000);
	}

	// hide the sprites that are no longer visible
	for(i = 0; i < oldVisibleSprites.length; i++) {
		sprite = oldVisibleSprites[i];
		if(visibleSprites.indexOf(sprite) < 0) {
			sprite.visible = false;
			sprite.img.style.display = "none";
		}
	}
}

function renderEnemies() {

	for(var i = 0; i < enemies.length; i++) {
		var enemy = enemies[i];
		var img = enemy.img;

		var dx = enemy.x - player.x;
		var dy = enemy.y - player.y;

		var angle = Math.atan2(dy, dx) - player.rot;

		if(angle < -Math.PI) angle += 2 * Math.PI;
		if(angle >= Math.PI) angle -= 2 * Math.PI;

		// is enemy in front of player? Maybe use the FOV value instead.
		if(angle > -Math.PI * 0.5 && angle < Math.PI * 0.5) {
			var distSquared = dx * dx + dy * dy;
			var dist = Math.sqrt(distSquared);
			var size = viewDist / (Math.cos(angle) * dist);

			if(size <= 0) continue;

			var x = Math.tan(angle) * viewDist;

			var style = img.style;
			var oldStyles = enemy.oldStyles;

			// height is equal to the sprite size
			if(size != oldStyles.height) {
				style.height = size + "px";
				oldStyles.height = size;
			}

			// width is equal to the sprite size times the total number of states
			var styleWidth = size * enemy.totalStates;
			if(styleWidth != oldStyles.width) {
				style.width = styleWidth + "px";
				oldStyles.width = styleWidth;
			}

			// top position is halfway down the screen, minus half the sprite height
			var styleTop = ((screenHeight - size) / 2);
			if(styleTop != oldStyles.top) {
				style.top = styleTop + "px";
				oldStyles.top = styleTop;
			}

			// place at x position, adjusted for sprite size and the current sprite state
			var styleLeft = (screenWidth / 2 + x - size / 2 - size * enemy.state);
			if(styleLeft != oldStyles.left) {
				style.left = styleLeft + "px";
				oldStyles.left = styleLeft;
			}

			var styleZIndex = -(distSquared * 1000) >> 0;
			if(styleZIndex != oldStyles.zIndex) {
				style.zIndex = styleZIndex;
				oldStyles.zIndex = styleZIndex;
			}

			var styleDisplay = "block";
			if(styleDisplay != oldStyles.display) {
				style.display = styleDisplay;
				oldStyles.display = styleDisplay;
			}

			var styleClip = "rect(0, " + (size * (enemy.state + 1)) + ", " + size + ", " + (size * (enemy.state)) + ")";
			if(styleClip != oldStyles.clip) {
				style.clip = styleClip;
				oldStyles.clip = styleClip;
			}
		} else {
			var styleDisplay = "none";
			if(styleDisplay != enemy.oldStyles.display) {
				img.style.display = styleDisplay;
				enemy.oldStyles.display = styleDisplay;
			}
		}
	}
}

function updateOverlay() {
	overlay.innerHTML = "FPS: " + fps.toFixed(1) + "<br/>" + overlayText;
	overlayText = "";
}

function drawMiniMap() {

	// draw the topdown view minimap
	var miniMap = $("minimap"); // the actual map
	var miniMapCtr = $("minimapcontainer"); // the container div element
	var miniMapObjects = $("minimapobjects"); // the canvas used for drawing the objects on the map (player character, etc)
	miniMap.width = mapWidth * miniMapScale; // resize the internal canvas dimensions
	miniMap.height = mapHeight * miniMapScale; // of both the map canvas and the object canvas
	miniMapObjects.width = miniMap.width;
	miniMapObjects.height = miniMap.height;

	var w = (mapWidth * miniMapScale) + "px"; // minimap CSS dimensions
	var h = (mapHeight * miniMapScale) + "px";
	miniMap.style.width = miniMapObjects.style.width = miniMapCtr.style.width = w;
	miniMap.style.height = miniMapObjects.style.height = miniMapCtr.style.height = h;

	var ctx = miniMap.getContext("2d");

	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, miniMap.width, miniMap.height);

	// loop through all blocks on the map
	for(var y = 0; y < mapHeight; y++) {
		for(var x = 0; x < mapWidth; x++) {

			var wall = map[level][y][x];

			if(wall > 0) { // if there is a wall block at this (x,y) ...
				ctx.fillStyle = "rgb(200,200,200)";
				ctx.fillRect( // ... then draw a block on the minimap
				x * miniMapScale, y * miniMapScale, miniMapScale, miniMapScale);
			}

			if(spriteMap[y][x]) {
				ctx.fillStyle = "rgb(100,200,100)";
				ctx.fillRect(
				x * miniMapScale + miniMapScale * 0.25, y * miniMapScale + miniMapScale * 0.25, miniMapScale * 0.5, miniMapScale * 0.5);
			}
		}
	}

	updateMiniMap();
}

function updateMiniMap() {

	var miniMap = $("minimap");
	var miniMapObjects = $("minimapobjects");

	var objectCtx = miniMapObjects.getContext("2d");
	miniMapObjects.width = miniMapObjects.width;

	objectCtx.fillStyle = "red";
	objectCtx.fillRect( // draw a dot at the current player position
	player.x * miniMapScale - 2, player.y * miniMapScale - 2, 4, 4);

	objectCtx.strokeStyle = "red";
	objectCtx.beginPath();
	objectCtx.moveTo(player.x * miniMapScale, player.y * miniMapScale);
	objectCtx.lineTo(
	(player.x + Math.cos(player.rot) * 4) * miniMapScale, (player.y + Math.sin(player.rot) * 4) * miniMapScale);
	objectCtx.closePath();
	objectCtx.stroke();

	for(var i = 0; i < enemies.length; i++) {
		var enemy = enemies[i];

		objectCtx.fillStyle = "blue";
		objectCtx.fillRect( // draw a dot at the enemy position
		enemy.x * miniMapScale - 2, enemy.y * miniMapScale - 2, 4, 4);
	}
}