// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');  

const generateBtn = document.querySelector('button[type=submit]');
const readTextBtn = document.querySelector('button[type=button]');
const clearBtn = document.querySelector('button[type=reset]');

let textTop;
let textBottom;
let voiceSelect = document.getElementById('voice-selection');
let voices;
voiceSelect.disabled = false;

// code to populate voice list (mozilla docs)
// removed the 'voice not available option from the list'
// does not work in Chrome - https://stackoverflow.com/questions/41539680/speechsynthesis-speak-not-working-in-chrome

function populateVoiceList() {
  if (typeof speechSynthesis === 'undefined') {
    return;
  }

  voices = speechSynthesis.getVoices();

  for (let i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if (voices[i].default) {
      option.textContent += ' -- DEFAULT';
    };

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  };

  // remove the voice not available option (not from mozilla docs)
  if (voices.length > 0) {
    let noVoiceOption = document.querySelector('option[value=none]');
    noVoiceOption.remove();
  };
};

populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
};

// Fires whenever the img object loads a new image (such as with img.src =)

img.addEventListener('load', () => {

  // clear context 
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // fill w black background
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fill();

  // toggle buttons 
  generateBtn.disabled = false;
  clearBtn.disabled = true;
  readTextBtn.disabled = true;

  // generated correct dimensions for image 
  let dim = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  let dimArr = Object.keys(dim);
  let width = dim[dimArr[0]];
  let height = dim[dimArr[1]];
  let startX = dim[dimArr[2]];
  let startY = dim[dimArr[3]];

  // draw image on canvas
  ctx.drawImage(img, startX, startY, width, height);

  // reset form for new image 
  form.reset();
});

// updates img.src and img.alt when new image uploaded 

const imgInput = document.getElementById('image-input');

imgInput.addEventListener('change', () => {

  // load in image
  let fileList = imgInput.files;
  let file = fileList.item(0);

  // url for path + file name for alt
  var filePath = URL.createObjectURL(file);
  img.setAttribute('src', filePath);
  img.setAttribute('alt', file.name);

});

// generates meme 

const form = document.getElementById('generate-meme');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  generateBtn.disabled = true;
  clearBtn.disabled = false;
  readTextBtn.disabled = false;

  // don't have to draw black bars (not drawn in no text example in vid)
  textTop = document.getElementById('text-top').value;
  textBottom = document.getElementById('text-bottom').value;
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.strokeText(textTop, canvas.width / 2, 30);
  ctx.strokeText(textBottom, canvas.width / 2, canvas.height - 20);

});

// clear canvas

clearBtn.addEventListener('click', () => {
  clearBtn.disabled = true;
  generateBtn.disabled = false;
  readTextBtn.disabled = true;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// read text

var synth = window.speechSynthesis;

const volumeLevel = document.querySelector('input[type=range]');

readTextBtn.addEventListener('click', () => {

  // create utterance from the text from top and bottom text fields
  var utterThis = new SpeechSynthesisUtterance(textTop + " " + textBottom);

  // assign correct voice for utterance (mozilla docs)
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for (let i = 0; i < voices.length; i++) {
    if (voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    };
  };

  // assign volume level
  utterThis.volume = volumeLevel.value / 100;

  // speak utterance
  synth.speak(utterThis);

});

// change volume icons depending on volume level

volumeLevel.addEventListener('input', () => {
  let vol = volumeLevel.value;
  let icon = document.querySelector('img');

  if (vol >= 67 && vol <= 100) {
    icon.src = 'icons/volume-level-3.svg';
    icon.alt = 'Volume Level 3';
  } else if (vol >= 34 && vol <= 66){
    icon.src = 'icons/volume-level-2.svg';
    icon.alt = 'Volume Level 2';
  } else if (vol >= 1 && vol <= 33){
    icon.src = 'icons/volume-level-1.svg';
    icon.alt = 'Volume Level 1';
  } else {
    icon.src = 'icons/volume-level-0.svg';
    icon.alt = 'Volume Level 0';
  }
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
