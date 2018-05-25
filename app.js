// 1.0 Creating a module called "SynthPad"
// contains all the letiables and functions that are lerated to it

let SynthPad = (function() {
  // 1.1 letiables (undefined -- to store the references to ley elements):
  let myCanvas;
  let frequencyLabel;
  let volumeLabel;

  let myAudioContext;
  let oscillator;
  let gainNode;

  // 1.2 Notes:
  let lowNote = 261.63; // C4
  let highNote = 493.88; // B4

  //
  // put the rest of the code here

  // 2.0 Constructor:
  let SynthPad = function() {
    myCanvas = document.getElementById('synth-pad');
    frequencyLabel = document.getElementById('frequency');
    volumeLabel = document.getElementById('volume');

    // 2.1 Create an audio context:
    // The AudioContext interface provide methods for creating audioNodes
    // that represent audio sources, processing modules or the audio destination.
    // it also manages how different AudioNodes are connected to each other.
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    myAudioContext = new window.AudioContext();

    SynthPad.setupEventListeners();
  };

  // 3.0 Event Listeners:
  SynthPad.setupEventListeners = function() {

    // 3.1 Disables scrolling on touch devices
    document.body.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, false);

    myCanvas.addEventListener('mousedown', SynthPad.playSound);
    myCanvas.addEventListener('touchstart', SynthPad.playSound);

    myCanvas.addEventListener('mouseup', SynthPad.stopSound);
    document.addEventListener('mouseleave', SynthPad.stopSound);
    myCanvas.addEventListener('touchend', SynthPad.stopSound);
  };

  // 4.0 Creating Sounds
  // 4.1 play a note.
  SynthPad.playSound = function(event) {
    oscillator = myAudioContext.createOscillator(); // an oscillator node, audio source(e,g, guitar)
    gainNode = myAudioContext.createGain(); // control the volume (e,g, effects pedal)

    oscillator.type = "square"; // sine, square, sawtooth, triangle, custom

    gainNode.connect(myAudioContext.destination); // (e,g, the amplifier)
    // like adding thecables between the guitar, effects pedal and amp
    oscillator.connect(gainNode);

    SynthPad.updateFrequency(event); // set the note frequency and volume based on the position of the cursor on the pad

    oscillator.start(0); // fires up the OscillatorNode

    myCanvas.addEventListener('mousemove', SynthPad.updateFrequency);
    myCanvas.addEventListener('touchmove', SynthPad.updateFrequency);

    myCanvas.addEventListener('mouseout', SynthPad.stopSound);
  };

  // 5.0 Stopping sounds
  // 5.1 stop the audio
  SynthPad.stopSound = function(event) {
    oscillator.stop(0);

    myCanvas.removeEventListener('mousemove', SynthPad.updateFrequency);
    myCanvas.removeEventListener('touchmove', SynthPad.updateFrequency);
    myCanvas.removeEventListener('mouseout', SynthPad.stopSound);
  };

  // 6.0 Changing the Pith and volume
  // 6.1 calculate the note frequency.
  SynthPad.calculateNote = function(posX) {
    let noteDifference = highNote - lowNote; // calculate therange between the highNote and lowNote variables
    let noteOffset = (noteDifference / myCanvas.offsetWidth) * (posX - myCanvas.offsetLeft);
    return lowNote + noteOffset;
  };
  // 6.2 calculate the volume.
  SynthPad.calculateVolume = function(posY) {
    let volumeLevel = 1 - (((100 / myCanvas.offsetHeight) * (posY - myCanvas.offsetTop)) / 100);
    return volumeLevel;
  };
  // 6.3 fetch the new frequency and volume.
  SynthPad.calculateFrequency = function(x, y) {
    let noteValue = SynthPad.calculateNote(x); // get note values
    let volumeValue = SynthPad.calculateVolume(y); // get volume values

    oscillator.frequency.value = noteValue;
    gainNode.gain.value = volumeValue;

    frequencyLabel.innerHTML = Math.floor(noteValue) + 'Hz';
    volumeLabel.innerHTML = Math.floor(volumeValue * 100) + '%';
  };
  // 6.4 update the note frequency
  SynthPad.updateFrequency = function(event) {
    if (event.type == 'mousedown' || event.type == 'mousemove') {
      SynthPad.calculateFrequency(event.x, event.y);
    } else if (event.type == 'touchstart' || event.type == 'touchmove') {
      let touch = event.touches[0];
      SynthPad.calculateFrequency(touch.pageX, touch.pageY);
    }
  };


  // 2.2 Export SynthPad:
  // when SynthPad is initialized elsewhere in the app the constructor will be called
  return SynthPad;
  //


}) ();

// 1.3 Initialize the page.
// attach an event listener to the window.onload
window.onload = function() {
  let synthPad = new SynthPad();
}
