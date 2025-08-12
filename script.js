// Note mapping for PC keyboard
const keyMap = {
  'a': 'C4', 's': 'D4', 'd': 'E4', 'f': 'F4',
  'g': 'G4', 'h': 'A4', 'j': 'B4', 'k': 'C5',
  'w': 'C#4', 'e': 'D#4', 't': 'F#4',
  'y': 'G#4', 'u': 'A#4'
};

// Play note (highlight key)
function playNote(note) {
  const key = document.querySelector(`.key[data-note="${note}"]`);
  if (key) {
    key.classList.add('active');
    setTimeout(() => key.classList.remove('active'), 200);
  }
}

// Mouse click support
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('mousedown', () => {
    const note = key.getAttribute('data-note');
    playNote(note);
  });
});

// PC keyboard support
document.addEventListener('keydown', e => {
  const note = keyMap[e.key.toLowerCase()];
  if (note) playNote(note);
});

// MIDI support
function onMIDISuccess(midiAccess) {
  document.getElementById("midi-status").textContent = "🎹 MIDI connected!";
  for (let input of midiAccess.inputs.values()) {
    input.onmidimessage = handleMIDIMessage;
  }
}

function onMIDIFailure() {
  document.getElementById("midi-status").textContent = "⚠️ MIDI not supported or no device found";
}

function handleMIDIMessage(event) {
  const [command, note, velocity] = event.data;
  if (command === 144 && velocity > 0) {
    const noteName = midiNoteToName(note);
    playNote(noteName);
  }
}

function midiNoteToName(note) {
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const octave = Math.floor(note / 12) - 1;
  const name = notes[note % 12];
  return `${name}${octave}`;
}

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
  onMIDIFailure();
}
