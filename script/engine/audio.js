/* Audio
 * Contains all Audio-related
 * Initialisation
 * Updating
 * Rendering
 *
 * Uses WebkitAudioContext
 */

var audioContext = {};
var bufferList;

function setReverbImpulseResponse(url, convolver) {
    // Load impulse response asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
        var ab = request.response;
        convolver.buffer = audioContext.createBuffer(ab, false);
    }

    request.send();
}

function setAudioSource(audio, url) {
    var buffer = bufferList[2];

    // See if we have cached buffer
    if(buffer) {
        audio.source.buffer = buffer;
    } else {
        // Load asynchronously
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onload = function() {
            var buffer = audioContext.createBuffer(request.response, true);

            audio.source.buffer = buffer;
            bufferList[url] = buffer; // cache it
        }

        request.send();
    }
}

function createSource() {
    var source, dryGainNode, wetGainNode, panner, lowFilter, convolver, kInitialReverbLevel = 0.6;

    source = audioContext.createBufferSource();
    dryGainNode = audioContext.createGainNode();
    wetGainNode = audioContext.createGainNode();
    volume = audioContext.createGainNode();
    panner = audioContext.createPanner();

    lowFilter = audioContext.createBiquadFilter();
    lowFilter.frequency.value = 22050.0;
    lowFilter.Q.value = 5.0;

    convolver = audioContext.createConvolver();

    // Connect audio processing graph
    source.connect(lowFilter);
    lowFilter.connect(panner);

    panner.connect(volume);

    // Connect dry mix
    volume.connect(dryGainNode);
    dryGainNode.connect(audioContext.destination);

    // Connect wet mix
    volume.connect(convolver);
    convolver.connect(wetGainNode);
    wetGainNode.connect(audioContext.destination);
    wetGainNode.gain.value = kInitialReverbLevel;


    setReverbImpulseResponse('assets/audio/impulse-responses/bin_dfeq/s3_r4_bd.wav', convolver);

    source.playbackRate.value = 1.0;

    panner.setPosition(0, 0, 0);
    source.loop = true;

    return {
        volume: volume,
        panner: panner,
        source: source
    };
}


function tearDownAudio() {
    // Get Rid of all existing nodes
    if(typeof player.audio !== 'undefined') {
        player.audio.source.noteOff(audioContext.currentTime);
        player.audio = {};
    }
    for(var i = 0; i < enemies.length; i++) {
        if(typeof enemies[i].audio !== 'undefined') {
            enemies[i].audio.source.noteOff(audioContext.currentTime);
            enemies[i].audio = {};
        }
    }
    for(var i = 0; i < mapItems[level].length; i++) {
        if(typeof Types.item[mapItems[level][i].type].audioFile !== 'undefined') {
            mapItems[level][i].audio.source.noteOff(audioContext.currentTime);
            mapItems[level][i].audio = {};
        }
    }
}

function initAudio() {

    if(typeof audioContext.listener === 'undefined') {
        // Initialize audio (only one per scene)
        if('AudioContext' in window) {
            audioContext = new AudioContext();
        } else if('webkitAudioContext' in window) {
            audioContext = new webkitAudioContext();
        } else {
            throw new Error('AudioContext not supported. :(');
        }
    } else {
        // tearDownAudio();
    }
    audioContext.listener.setPosition(player.x, player.z, player.y);

    setListenerOrientation(player);

    bufferList = {};

    if(typeof player.audioFile !== 'undefined') {
        player.audio = createSource();
        setAudioSource(player.audio, player.audioFile);
        player.audio.source.noteOn(audioContext.currentTime + 0.020);
    }

    for(var i = 0; i < enemies.length; i++) {
        if(typeof enemies[i].audioFile !== 'undefined') {
            enemies[i].audio = createSource();
            setAudioSource(enemies[i].audio, enemies[i].audioFile);
            enemies[i].audio.source.noteOn(audioContext.currentTime + 0.020);
        }
    }
    for(var i = 0; i < mapItems[level].length; i++) {
        if(typeof Types.item[mapItems[level][i].type].audioFile !== 'undefined') {
            mapItems[level][i].audio = createSource();
            setAudioSource(mapItems[level][i].audio, Types.item[mapItems[level][i].type].audioFile);
            mapItems[level][i].audio.source.loop = Types.item[mapItems[level][i].type].looping;
            mapItems[level][i].audio.source.noteOn(audioContext.currentTime + 0.020);
        }
    }
}