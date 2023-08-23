// Get a reference to the canvas element
var canvas = document.getElementById('myCanvas');

// Get the canvas context
var ctx = canvas.getContext('2d');

// Set the stroke style and line width
ctx.strokeStyle = 'black';
ctx.lineWidth = 2;

// Variables to track the mouse position and drawing status
var isDrawing = false;
var lastX = 0;
var lastY = 0;
var pxArray = [];
var gcode = ''; // Declare the gcode variable outside the event listener

// Get a reference to the position text element
var positionText = document.getElementById('positionText');

// Add an event listener to the canvas to track mouse movements
canvas.addEventListener('mousedown', function(event) {
  // Reset the pixel array
  pxArray = [];

  // Start drawing
  isDrawing = true;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Get the current mouse position
  lastX = event.clientX - canvas.offsetLeft;
  lastY = event.clientY - canvas.offsetTop;
});

canvas.addEventListener('mousemove', function(event) {
  if (isDrawing) {
    // Get the current mouse position
    var currentX = event.clientX - canvas.offsetLeft;
    var currentY = event.clientY - canvas.offsetTop;

    // Draw a line from the last position to the current position
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // Print the pixel positions to the console
    pxArray.push({x: currentX, y:currentY});
    console.log('X: ' + currentX + ', Y: ' + currentY);
    positionText.textContent = 'X: ' + currentX + ', Y: ' + currentY;

    // Update the last position
    lastX = currentX;
    lastY = currentY;
  }
});

canvas.addEventListener('mouseup', function(event) {
  // Stop drawing
  isDrawing = false;

  // Reset the gcode variable
  gcode = '';

  // Set the initial position
  gcode += 'G0 X0 Y0\n';

  // Loop through the pixel array
  for (var i = 0; i < pxArray.length; i++) {
    var pixel = pxArray[i];

    // Calculate the coordinates in relation to the canvas size
    var x = pixel.x / canvas.width * 100; // Scale the x-coordinate to fit within 100 units
    var y = pixel.y / canvas.height * 100; // Scale the y-coordinate to fit within 100 units

    // Move to the next position
    gcode += 'G0 X' + x.toFixed(2) + ' Y' + y.toFixed(2) + '\n';
  }
  console.log(pxArray);
});

function saveTextToFile(text, filename) {
  var blob = new Blob([text], { type: 'text/plain' });
  var link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function save(){
  // Save the G-code to a file
  saveTextToFile(gcode, 'drawing.gcode');
}