//var values = [12, 53, 46, 67.2, 32, 5, 77];
var total = 0;
var canvas, context;
var values;


document.addEventListener("DOMContentLoaded", function () {
	//set global vars for canvas and context
	canvas = document.querySelector("#myCanvas");
	context = canvas.getContext("2d");

	$.getJSON('/js/cheese.json', function (data) {
		console.log('JSON data received:', data.segments);
		values = data.segments;
		showPie();
	});



});

function showPie() {
	//clear the canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	//set the styles in case others have been set
	//  setDefaultStyles();
	var cx = canvas.width / 2;
	var cy = canvas.height / 2;
	var radius = 100;
	var currentAngle = 0;
	//the difference for each wedge in the pie is arc along the circumference
	//we use the percentage to determine what percentage of the whole circle
	//the full circle is 2 * Math.PI radians long.
	//start at zero and travelling clockwise around the circle
	//start the center for each pie wedge
	//then draw a straight line out along the radius at the correct angle
	//then draw an arc from the current point along the circumference
	//stopping at the end of the percentage of the circumference
	//finally going back to the center point.

	//	total is the sum of all the values
	for (var i = 0; i < values.length; i++) {
		total += values[i].value;
	}

	//get object with max value
	var maxObj = getMax(values, "value");
	//get object with min value
	var minObj = getMin(values, "value");


	for (var i = 0; i < values.length; i++) {

		var pct = values[i].value / total;
		var colour = values[i].color;
		var endAngle = currentAngle + (pct * (Math.PI * 2));
		//draw the arc
		context.moveTo(cx, cy);
		context.beginPath();
		context.fillStyle = colour;

		//The largest should be 90% of the standard radius and the smallest value should be 110% the standard radius.
		if (values[i] === minObj) {
			context.arc(cx, cy, radius * 1.1, currentAngle, endAngle, false);

		} else if (values[i] === maxObj) {
			context.arc(cx, cy, radius * 0.9, currentAngle, endAngle, false);
		} else {
			context.arc(cx, cy, radius, currentAngle, endAngle, false);
		}

		context.lineTo(cx, cy);
		context.fill();

		//Now draw the lines that will point to the values
		context.save();
		context.translate(cx, cy); //make the middle of the circle the (0,0) point
		context.strokeStyle = "#000";
		context.lineWidth = 0.5;
		context.beginPath();
		//angle to be used for the lines
		var midAngle = (currentAngle + endAngle) / 2; //middle of two angles
		context.moveTo(0, 0); //this value is to start at the middle of the circle
		//to start further out...
		var dx = Math.cos(midAngle) * (0.8 * radius);
		var dy = Math.sin(midAngle) * (0.8 * radius);
		context.moveTo(dx, dy);
		//ending points for the lines
		var dx = Math.cos(midAngle) * (radius + 30); //30px beyond radius
		var dy = Math.sin(midAngle) * (radius + 30);
		context.lineTo(dx, dy);
		context.stroke();

		//Set X position for label
		var dxNew = 0.0;
		if (dx < 0) {
			dxNew = dx - 35;
		} else {
			dxNew = dx + 5;
		}

		//Set Y position for label
		var dyNew = 0.0;
		if (dy < 0) {
			dyNew = dy;
		} else {
			dyNew = dy + 10;
		}

		context.fillText(values[i].label, dxNew, dyNew);
		//put the canvas back to the original position
		context.restore();
		//update the currentAngle
		currentAngle = endAngle;
	}
}

//Get max from array
function getMax(arr, prop) {
	var max;
	for (var i = 0; i < arr.length; i++) {
		if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
			max = arr[i];
	}
	return max;
}

//Get min from array
function getMin(arr, prop) {
	var min;
	for (var i = 0; i < arr.length; i++) {
		if (!min || parseInt(arr[i][prop]) < parseInt(min[prop]))
			min = arr[i];
	}
	return min;
}