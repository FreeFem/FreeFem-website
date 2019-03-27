loadExample = (path, editor) => {
	const xhr = new XMLHttpRequest()
	xhr.open('GET', path, true)
	xhr.onload = function(e) {
		 if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					 editor.setValue(xhr.responseText)
				} else {
					 console.error(xhr.statusText)
				}
		 }
	}
	xhr.onerror = function(e) {
		 console.error(xhr.statusText)
	}
	xhr.send(null)
}
