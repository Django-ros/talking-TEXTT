/** @format */

//Setup
const heading = document.querySelector("head");

heading.innerHTML += `<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
    crossorigin="anonymous">`;
const body = document.querySelector("#deploy");

//Deployement
deploy.innerHTML += `<div class="container text-center bg-info">
    <div class="row">
      <div class="col-md-6 mx-auto">
        <form class="mb-5 mt-5" id="formit">
          <div class="form-group">
            <textarea name="" id="text-input" class="form-control form-control-lg" placeholder="Type anything..."></textarea>
          </div>
          <div class="form-group">
            <label for="rate">Rate</label>
            <div id="rate-value" class="badge badge-primary float-right">1</div>
            <input type="range" id="rate" class="custom-range" min="0.5" max="2" value="1" step="0.1">
          </div>
          <div class="form-group">
            <label for="pitch">Pitch</label>
            <div id="pitch-value" class="badge badge-primary float-right">1</div>
            <input type="range" id="pitch" class="custom-range" min="0" max="2" value="1" step="0.1">
          </div>
          <div class="form-group">
            <select id="voice-select" class="form-control form-control-lg"></select>
          </div>
          <button class="btn bitn btn-light btn-lg btn-block">Talk to me</button>
        </form>
         </div>
    </div>
  </div>`;

body.style += `background: #141414;
      height:100vh;
      width:100%;
      display:flex;
      align-items: center;
      justify-content: center;`;

// Init SpeechSynth API
const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector("#formit");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");

const btn = document.querySelector(".bitn");

//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== "undefined";

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Init voices array
let voices = [];

const getVoices = () => {
	voices = synth.getVoices();

	// Loop through voices and create an option for each one
	voices.forEach((voice) => {
		// Create option element
		const option = document.createElement("option");
		// Fill option with voice and language
		option.textContent = voice.name + "(" + voice.lang + ")";

		// Set needed option attributes
		option.setAttribute("data-lang", voice.lang);
		option.setAttribute("data-name", voice.name);
		voiceSelect.appendChild(option);
	});
};

if (isFirefox) {
	getVoices();
}
if (isChrome) {
	if (synth.onvoiceschanged !== undefined) {
		synth.onvoiceschanged = getVoices;
	}
}
if (voices.length === 0) {
	alert("Only one voice available, Try another browser for more");
}
// Speak
const speak = () => {
	// Check if speaking
	if (synth.speaking) {
		alert("Already speaking...");
		return;
	}
	if (textInput.value !== "") {
		const speakText = new SpeechSynthesisUtterance(textInput.value);
		let selectedVoice;
		if (voiceSelect.selectedOptions.length) {
			selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
				"data-name"
			);
		}
		// Loop through voices
		voices.forEach((voice) => {
			if (voice.name === selectedVoice) {
				speakText.voice = voice;
			}
		});

		// Set pitch and rate
		speakText.rate = rate.value;
		speakText.pitch = pitch.value;
		// Speak
		synth.speak(speakText);
	}
};

// EVENT LISTENERS

// Text form submit
textForm.addEventListener("submit", (e) => {
	e.preventDefault();
	speak();
	textInput.blur();
});

// Rate value change
rate.addEventListener("change", (e) => (rateValue.textContent = rate.value));

// Pitch value change
pitch.addEventListener("change", (e) => (pitchValue.textContent = pitch.value));

// Voice select change
voiceSelect.addEventListener("change", (e) => speak());
