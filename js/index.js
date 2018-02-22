// Slides
var play = 1;
var slideIndex = 1;
var slideTimer;

//hide all slides
function hideSlides() {
	var slides = document.getElementsByClassName('slidesImages');
	for (var i = 0; i < slides.length; i++)
		slides[i].style.display = 'none';
}

//show all slides
function showSlides() {
	var slides = document.getElementsByClassName('slidesImages');
	for (var i = 0; i < slides.length; i++)
		slides[i].style.display = 'flex';
}

//show slide one by one
function showOneSlide(plus=1) {
	var i;
	var slides = document.getElementsByClassName('slidesImages');
	var dots = document.getElementsByClassName('slidesDot');
	for (i = 0; i < slides.length; i++)
		slides[i].style.display = 'none';
	if(plus) slideIndex++;
	if (slideIndex > slides.length)
		slideIndex = 1;
	for (i = 0; i < dots.length; i++)
		dots[i].className = dots[i].className.replace(' active', '');
	slides[slideIndex-1].style.display = 'flex';
	dots[slideIndex-1].className += ' active';
	if (play === 1){
		slideTimer = setTimeout(showOneSlide, 5000);
	}
}

//change slide
function changeSlides(i) {
	slideIndex = i-1;
	clearTimeout(slideTimer);
	showOneSlide();
}

//activate play/pause
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
		showOneSlide();
	}
}

// Cite
var cite = 0;
//show bibtex
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

// Resize
//resize slides
function resizeSlides() {
	var imgRatio = 0.8;
	// hide all slides
	hideSlides();
	// to get the correct width & height of the up container
	var left = document.getElementById('left');
	var leftWidth = left.offsetWidth;
	var leftHeight = left.offsetHeight;
	// get the down height
	var down = document.getElementById('down');
	var downHeight = down.offsetHeight;
	// show all slides
	showSlides();
	// to get the height of the descriptions and compute the correct size of one slide
	var slides = document.getElementsByClassName('slidesImages');
	for (var i = 0; i < slides.length; i++) {
		if (slides[i].children.length == 2){	//this is an img
			// description height
			var descriptionHeight = slides[i].children[1].offsetHeight;
			// slide width & height
			slides[i].children[0].style.maxWidth = (leftWidth) + "px";
			slides[i].children[0].style.maxHeight = (leftHeight - descriptionHeight - downHeight) + "px";
			// force img
			slides[i].children[0].children[0].style.maxWidth = imgRatio*(leftWidth) + "px";
			slides[i].children[0].children[0].style.maxHeight = imgRatio*(leftHeight - descriptionHeight - downHeight) + "px";
		}
		else if (slides[i].children.length == 3){	//this is an x3d container
			// description height
			var descriptionHeight = slides[i].children[2].offsetHeight;
			// slide width & height
			slides[i].children[1].style.maxWidth = (leftWidth) + "px";
			slides[i].children[1].style.maxHeight = (leftHeight - descriptionHeight - downHeight) + "px";
			// force x3d
			var imgHeight = slides[i].children[0].children[0].offsetHeight;
			slides[i].children[1].children[0].style.width = imgRatio*(leftWidth) + "px";
			slides[i].children[1].children[0].style.height = imgRatio*(leftHeight - descriptionHeight - downHeight - imgHeight) + "px";
		}
	}
	// begin (or continue) show slide
	if (slideTimer)
		clearTimeout(slideTimer);
	showOneSlide(0);
}



// Start
resizeSlides();
window.onresize = resizeSlides;



