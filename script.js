// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO 

  // clear context 
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // fill w black background
  ctx.rect(0,0, canvas.width, canvas.height);
  ctx.fillStyle='black';
  ctx.fill();


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
  const form = document.getElementById('generate-meme');
  form.reset();

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
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

  // generate is enabled until pressed --> clear, read text enabled
  // clear is enabled until pressed --> read text disabled, generate enabled 

const generateBtn = document.querySelector('button[type=submit]');
generateBtn.addEventListener('click', function(event) {
  event.preventDefault();
  generateBtn.disabled = true;
  clearBtn.disabled = false;
  readBtn.disabled = false;
  let textTop = document.getElementById('text-top');
  let textBottom = document.getElementById('text-bottom');
});


const clearBtn = document.querySelector('button[type=reset]');
clearBtn.addEventListener('click', () => {
  clearBtn.disabled = true;
  generateBtn.disabled = false;
  readBtn.disabled = true;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

const readBtn = document.querySelector('button[type=button]');
readBtn.addEventListener('click', () => {
  
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
