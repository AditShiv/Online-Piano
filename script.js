// MIDI Setup
let midiAccess = null;

function onMIDISuccess(midi) {
  midiAccess = midi;
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

  // Note on message (command 144) with velocity > 0
  if (command === 144 && velocity > 0) {
    logNote(note);
  }
}

function logNote(note) {
  const noteName = midiNoteToName(note);
  const log = document.getElementById("midi-log");
  const entry = document.createElement("div");
  entry.textContent = `🎵 Played: ${noteName}`;
  log.prepend(entry);
}

function midiNoteToName(note) {
  const notes = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
  const octave = Math.floor(note / 12) - 1;
  const name = notes[note % 12];
  return `${name}${octave}`;
}

// Request MIDI access
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
  onMIDIFailure();
}
