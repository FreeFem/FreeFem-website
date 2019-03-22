fetch('https://api.github.com/repos/FreeFem/FreeFem-sources/releases/latest')
	.then(response => {
		if (response.ok) {
			return response.json()
		} else {
			return Promise.reject('something went wrong!')
		}
	})
	.then(data => {
		document.getElementById("release").innerHTML = "<a href=\"https://github.com/FreeFem/FreeFem-sources/blob/master/CHANGELOG.md\" target=\"_blank\"><strong>" + data.tag_name + "</strong>Release notes</a>"
	})
	.catch(error => document.getElementById("release").innerHTML = "<a href=\"https://github.com/FreeFem/FreeFem-sources/blob/master/CHANGELOG.md\" target=\"_blank\">Release notes</a>");
