var canvas, ctx, saveButton, clearButton;
var pos = {x:0, y:0};
var rawImage;
var model;

function getModel() {
	model = tf.loadLayersModel('./model/model.json');
	return model;
}

async function predict(model, tensor) {
    const predictedClass = tf.tidy(() => {
      const predictions = model.predict(tensor);
      return predictions.as1D().argMax();
    });
    const classId = (await predictedClass.data())[0];
    document.getElementById('answer').innerHTML=(String.fromCharCode(65+classId));
}

function save() {
	var raw = tf.browser.fromPixels(rawImage,1);
	var resized = tf.image.resizeBilinear(raw, [28,28]);
	var tensor = resized.expandDims(0);
	model.then(model => {
            predict(model, tensor);
     })
}

function setPosition(e){
	pos.x = e.clientX-100;
	pos.y = e.clientY-100;
}

function draw(e) {
	if(e.buttons!=1) return;
	ctx.beginPath();
	ctx.lineWidth = 24;
	ctx.lineCap = 'round';
	ctx.strokeStyle = 'white';
	ctx.moveTo(pos.x, pos.y);
	setPosition(e);
	ctx.lineTo(pos.x, pos.y);
	ctx.stroke();
	rawImage.src = canvas.toDataURL('image/png');
}

function erase() {
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,280,280);
    document.getElementById('answer').innerHTML="-";
}

function init() {
	model = getModel();
	canvas = document.getElementById('canvas');
	rawImage = document.getElementById('canvasimg');
	ctx = canvas.getContext("2d");
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,280,280);
	canvas.addEventListener("mousemove", draw);
	canvas.addEventListener("mousedown", setPosition);
	canvas.addEventListener("mouseenter", setPosition);
	saveButton = document.getElementById('sb');
	saveButton.addEventListener("click", save);
	clearButton = document.getElementById('cb');
	clearButton.addEventListener("click", erase);
}
document.addEventListener('DOMContentLoaded', init);




