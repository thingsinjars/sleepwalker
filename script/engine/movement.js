function move(entity, timeDelta) {
	// time timeDelta has passed since we moved last time. We should have moved after time gameCycleDelay,
	// so calculate how much we should multiply our movement to ensure game speed is constant
	var mul = timeDelta / gameCycleDelay;

	var moveStep = mul * entity.speed * entity.moveSpeed; // entity will move this far along the current direction vector
	entity.rotDeg += mul * entity.dir * entity.rotSpeed; // add rotation if entity is rotating (entity.dir != 0)
	entity.rotDeg %= 360;

	if(entity.rotDeg < -180) entity.rotDeg += 360;
	if(entity.rotDeg >= 180) entity.rotDeg -= 360;

	var snap = (entity.rotDeg + 360) % 90;
	if(snap < 2 || snap > 88) {
		entity.rotDeg = Math.round(entity.rotDeg / 90) * 90;
	}

	entity.rot = entity.rotDeg * Math.PI / 180;

	var newX = entity.x + Math.cos(entity.rot) * moveStep; // calculate new entity position with simple trigonometry
	var newY = entity.y + Math.sin(entity.rot) * moveStep;

	var pos = checkCollision(entity.x, entity.y, newX, newY, 0);

	entity.x = pos.x; // set new position
	entity.y = pos.y;

}

function checkCollision(fromX, fromY, toX, toY, radius) {
	var pos = {
		x: fromX,
		y: fromY
	},
		dx, dy;

	if(toY < 0 || toY >= mapHeight || toX < 0 || toX >= mapWidth) return pos;

	var blockX = Math.floor(toX);
	var blockY = Math.floor(toY);


	if(isBlocking(blockX, blockY)) {
		return pos;
	}

	pos.x = toX;
	pos.y = toY;

	var blockTop = isBlocking(blockX, blockY - 1);
	var blockBottom = isBlocking(blockX, blockY + 1);
	var blockLeft = isBlocking(blockX - 1, blockY);
	var blockRight = isBlocking(blockX + 1, blockY);

	if(blockTop !== 0 && toY - blockY < radius) {
		toY = pos.y = blockY + radius;
	}
	if(blockBottom !== 0 && blockY + 1 - toY < radius) {
		toY = pos.y = blockY + 1 - radius;
	}
	if(blockLeft !== 0 && toX - blockX < radius) {
		toX = pos.x = blockX + radius;
	}
	if(blockRight !== 0 && blockX + 1 - toX < radius) {
		toX = pos.x = blockX + 1 - radius;
	}

	// is tile to the top-left a wall
	if(isBlocking(blockX - 1, blockY - 1) !== 0 && !(blockTop !== 0 && blockLeft !== 0)) {
		dx = toX - blockX;
		dy = toY - blockY;
		if(dx * dx + dy * dy < radius * radius) {
			if(dx * dx > dy * dy) toX = pos.x = blockX + radius;
			else toY = pos.y = blockY + radius;
		}
	}
	// is tile to the top-right a wall
	if(isBlocking(blockX + 1, blockY - 1) !== 0 && !(blockTop !== 0 && blockRight !== 0)) {
		dx = toX - (blockX + 1);
		dy = toY - blockY;
		if(dx * dx + dy * dy < radius * radius) {
			if(dx * dx > dy * dy) toX = pos.x = blockX + 1 - radius;
			else toY = pos.y = blockY + radius;
		}
	}
	// is tile to the bottom-left a wall
	if(isBlocking(blockX - 1, blockY + 1) !== 0 && !(blockBottom !== 0 && blockBottom !== 0)) {
		dx = toX - blockX;
		dy = toY - (blockY + 1);
		if(dx * dx + dy * dy < radius * radius) {
			if(dx * dx > dy * dy) toX = pos.x = blockX + radius;
			else toY = pos.y = blockY + 1 - radius;
		}
	}
	// is tile to the bottom-right a wall
	if(isBlocking(blockX + 1, blockY + 1) !== 0 && !(blockBottom !== 0 && blockRight !== 0)) {
		dx = toX - (blockX + 1);
		dy = toY - (blockY + 1);
		if(dx * dx + dy * dy < radius * radius) {
			if(dx * dx > dy * dy) toX = pos.x = blockX + 1 - radius;
			else toY = pos.y = blockY + 1 - radius;
		}
	}

	return pos;
}

function isBlocking(x, y) {

	// first make sure that we cannot move outside the boundaries of the level
	if(y < 0 || y >= mapHeight || x < 0 || x >= mapWidth) return true;

	var ix = Math.floor(x);
	var iy = Math.floor(y);

	// return true if the map block is not 0, ie. if there is a blocking wall.
	if(map[level][iy][ix] !== 0) return true;

	if(spriteMap[iy][ix] && spriteMap[iy][ix].block) return true;

	return false;
}