

var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var config = {
	type: 'line',
	data: {
		labels: [],
		datasets: [{
			label: 'Smittede',
			backgroundColor: '#b75b4d',
			borderColor: '#b75b4d',
			data: [],
			fill: false,
		},
    {
      label: 'Kurerede',
      backgroundColor: '#55b752',
      borderColor: '#55b752',
      data: [],
      fill: false,
    },
    {
      label: 'Raske',
      backgroundColor: '#b4b1b7',
      borderColor: '#b4b1b7',
      data: [],
      fill: false,
    }],
	},
};

window.onload = function() {
	var ctx = document.getElementById('canvasPanel').getContext('2d');
	window.myLine = new Chart(ctx, config);
};
