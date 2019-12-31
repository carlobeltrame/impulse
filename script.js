var midi, data;

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  console.warn("No MIDI support in your browser")
}

function onMIDISuccess(midiData) {
  midi = midiData;
  var allInputs = midi.inputs.values();
  for (var input = allInputs.next(); input && !input.done; input = allInputs.next()) {
    input.value.onmidimessage = gotMIDImessage;
  }
}
var dataList = document.querySelector('#midi-data ul')

function gotMIDImessage(messageData) {
  if (messageData.data[0] === 248) return;
  var newItem = document.createElement('li');
  newItem.appendChild(document.createTextNode(messageData.data));
  dataList.appendChild(newItem);
  onMIDImessage(messageData);
}

function onMIDIFailure() {
  console.warn("Not recognising MIDI controller")
}

function onMIDImessage(message){
  console.log('success');
  const srcElement = message.srcElement;
  const data = message.data;
  const event = data[0];
  console.log(event);
  if (event == 144) {
    const velocity = data[2];
    console.log(velocity);
    const video = document.getElementById('myVideo');
    video.style.opacity = velocity / 127.0;
  } else if (event == 128) {
    const video = document.getElementById('myVideo');
    video.style.opacity = 0;
  }
}
