var play = 1;
var slideIndex = 0;
var slideTimer;
showSlides();

function showSlides() {
	var i;
	var slides = document.getElementsByClassName("slidesImages");
	var dots = document.getElementsByClassName("slidesDot");
	for (i = 0; i < slides.length; i++)
		slides[i].style.display = "none";
	slideIndex++;
	if (slideIndex > slides.length)
		slideIndex = 1;
	for (i = 0; i < dots.length; i++)
		dots[i].className = dots[i].className.replace(" active", "");
	slides[slideIndex-1].style.display = "block";
	dots[slideIndex-1].className += " active";
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
		button.style.backgroundImage = 'url("img/slides/play.png")';
		play = 0;
		clearTimeout(slideTimer);
	}
	else {
		button.style.backgroundImage = 'url("img/slides/pause.png")';
		play = 1;
		showSlides();
	}
}



