saveEDP = (editor) => {
	const code = editor.getValue()

	var element = document.createElement('a')
	element.setAttribute('href', 'data:text/plain; charset=utf-8,' + encodeURIComponent(code))
	element.setAttribute('download', 'script.edp')

	element.style.display = 'none'
	document.body.appendChild(element)

	element.click()

	document.body.removeChild(element)
}
