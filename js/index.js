// Slides
var play = 1;
var slideIndex = 0;
var slideTimer;

function showSlides() {
	var i;
	var slides = document.getElementsByClassName('slidesImages');
	var dots = document.getElementsByClassName('slidesDot');
	for (i = 0; i < slides.length; i++)
		slides[i].style.display = 'none';
	slideIndex++;
	if (slideIndex > slides.length)
		slideIndex = 1;
	for (i = 0; i < dots.length; i++)
		dots[i].className = dots[i].className.replace(' active', '');
	slides[slideIndex-1].style.display = 'flex';
	dots[slideIndex-1].className += ' active';
	if (play === 1)
		slideTimer = setTimeout(showSlides, 5000);
}

function changeSlides(i) {
	slideIndex = i-1;
	clearTimeout(slideTimer);
	showSlides();
}

function playPause() {
	var button = document.getElementById('slidesPlayPause');
	
	if (play === 1) {
		button.style.backgroundImage = 'url("img/icons/play.png")';
		play = 0;
		clearTimeout(slideTimer);
	}
	else {
		button.style.backgroundImage = 'url("img/icons/pause.png")';
		play = 1;
		showSlides();
	}
}

// Cite
var cite = 0;
function showCite() {
	if (cite === 0) {
		var citetext = document.getElementById('citetext');
		citetext.style.display = 'block';
		cite = 1;
	}
	else {
		var citetext = document.getElementById('citetext');
		citetext.style.display = 'none';
		cite = 0;
	}
}

// X3d
function resizeX3d() {
	var i;
	var x3ds = document.getElementsByTagName('x3d');
	var up = document.getElementById('left');
	var right = document.getElementById('right');
	
	for (i = 0; i < x3ds.length; i++){
		x3ds[i].style.height = 0.5*right.offsetHeight;
		x3ds[i].style.width = 0.5*left.offsetWidth;
	}
}



// Start
showSlides();
resizeX3d();
window.onresize = resizeX3d;



