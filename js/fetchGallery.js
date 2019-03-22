window.addEventListener('popstate', function(event) {
	if (history.state) {
		event.preventDefault()
		event.stopPropagation()

		const url = history.state.url
		fetchGallery(event, url, history.state.title, true)

		// Find good link
		const galleryTitle = document.getElementById('galleryTitle')
		const links = galleryTitle.getElementsByTagName('a')

		for (let i = 0; i < links.length; i++)
			if (links[i].href === url)
				links[i].parentNode.parentNode.classList.add('active')
			else
				links[i].parentNode.parentNode.classList.remove('active')
	}
})

function fetchGallery(e, url, title, disableHistory) {
	if (e)
		e.preventDefault()

	fetch(url)
		.then(function(response) {
			return response.text()
		})
		.then(function(html) {
			// Get content (not surrounding header, footer, nav, ...)
			var parser = new DOMParser()
			var content = parser.parseFromString(html, "text/html")
			var galleryImg = content.getElementById('galleryImg')

			// Replace in the page
			document.querySelector('#galleryImg').innerHTML = galleryImg.innerHTML

			// Reset scroll
			document.body.scrollTop = 0
			document.documentElement.scrollTop = 0

			// Set history
			if (!disableHistory) history.pushState({url: url, title: title}, title, url)
			document.title = "FreeFEM - " + title

			// Relaunch MathJax
			try{
				MathJax.Hub.Queue(["Typeset",MathJax.Hub])
			} catch (error) {}
		})
		.catch(function(err) {
			console.log('Failed to fetch page: ', err)
		})
}

function activateGallery(elmt) {
	const galleryTitle = document.getElementById('galleryTitle')
	const list = galleryTitle.getElementsByTagName('li')

	for (let i = 0; i < list.length; i++) {
		list[i].classList.remove('active')
	}
	elmt.classList.add('active')
}
