var level = 0;

var enemies;

var player;

var mapWidth = 0;
var mapHeight = 0;

var miniMapScale = 8;

var screenWidth = 320;
var screenHeight = 200;

var showOverlay = true;

var stripWidth = 3;
var fov = 60 * Math.PI / 180;

var numRays = Math.ceil(screenWidth / stripWidth);
var fovHalf = fov / 2;

var viewDist = (screenWidth / 2) / Math.tan((fov / 2));

var twoPI = Math.PI * 2;

var numTextures = 4;
var wallTextures = ["assets/images/walls_1.png", "assets/images/walls_2.png", "assets/images/walls_3.png", "assets/images/walls_4.png"];

var userAgent = navigator.userAgent.toLowerCase();
var isGecko = userAgent.indexOf("gecko") != -1 && userAgent.indexOf("safari") == -1;

// enable this to use a single image file containing all wall textures. This performs better in Firefox. Opera likes smaller images.
var useSingleTexture = isGecko;


var screenStrips = [];
var overlay;

var fps = 0;
var overlayText = "";

/* Sprites */
var spriteMap;
var visibleSprites = [];
var oldVisibleSprites = [];