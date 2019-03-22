let consoleOpen = false;
const exMain = document.getElementById('exampleMain')
const exResult = document.getElementById('exampleResult')
const exConsole = document.getElementById('exampleConsole')
const stdoutDiv = exConsole.children[1];
const exResultArrowDiv = exResult.children[1];

openConsole = () => {
	let media = false
	const template = window.getComputedStyle(exMain).gridTemplateRows
	const tList = template.split(' ')
	if (tList.length > 2)
		media = true

	console

	if (consoleOpen) {
		if (!media) {
			exMain.style.gridTemplateRows = "calc(100% - 1.875rem) 1.875rem"
			exResultArrowDiv.classList.toggle('is-invisible')
		}
		stdoutDiv.classList.toggle('is-invisible')
		consoleOpen = false
	} else {
		stdoutDiv.classList.toggle('is-invisible')
		if (!media) {
			exMain.style.gridTemplateRows = "1.875rem calc(100% - 1.875rem)"
			exResultArrowDiv.classList.toggle('is-invisible')
		}
		consoleOpen = true
	}
}
