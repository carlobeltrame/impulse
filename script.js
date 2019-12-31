const video = document.getElementById('visualization');
const dataList = document.querySelector('#midi-data ul');

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  console.warn("No MIDI support in your browser");
}

function onMIDIFailure() {
  console.warn("Not recognising MIDI controller");
}

function onMIDISuccess(midi) {
  var allInputs = midi.inputs.values();
  for (var input = allInputs.next(); input && !input.done; input = allInputs.next()) {
    input.value.onmidimessage = onMIDIMessage;
  }
}

function onMIDIMessage(message) {
  visualizeMIDIMessage(message);
  // debug
  addMIDIMessageToList(message);
}

function visualizeMIDIMessage(message){
  const data = message.data;
  const event = data[0];
  if (event == 144) {
  // Note on
  // On some controllers, note off is also in here, with velocity 0
    const velocity = data[2];
    video.style.opacity = velocity / 127.0;
  } else if (event == 128) {
  // Note off
    video.style.opacity = 0;
  }
}

function addMIDIMessageToList(messageData) {
  if (messageData.data[0] === 248) return;
  var newItem = document.createElement('li');
  newItem.appendChild(document.createTextNode(messageData.data));
  dataList.appendChild(newItem);
}
