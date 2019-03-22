function codeColor(element) {
	var elementText = element.innerHTML

	var commentColor = "green"
	var preprocessorColor = "mediumblue"
	var stringColor = "purple"
	var typeColor = "darkorange"
	var functionColor = "darkred"
	var variableColor = "brown"
	var attributeColor = "red"

	elementText = commentMode(elementText)
	elementText = preprocessorMode(elementText)
	elementText = stringMode(elementText)
	elementText = typeMode(elementText)
	elementText = functionMode(elementText)
	elementText = variableMode(elementText)
	elementText = attributeMode(elementText)

	element.innerHTML = elementText

	function extract(str, start, end, func, repl, plus=0, minus=0) {
		var s, e, d = "", a = []
		while (str.search(start) > -1) {
			s = str.search(start)
			e = str.indexOf(end, s+plus)
			if (e == -1) { e = str.length-minus }
			if (repl) {
				a.push(func(str.substring(s, e-minus + (end.length))))
				str = str.substring(0, s) + repl + str.substr(e-minus + (end.length))
			} else {
				d += str.substring(0, s)
				d += func(str.substring(s, e-minus + (end.length)))
				str = str.substr(e-minus + (end.length))
			}
		}
		this.rest = d + str
		this.arr = a
	}

	function commentMode(txt) {
		var rest = txt, comment, i
		comment = new extract(rest, "//", "\n", commentColoration, "FFCOMMENTPOS")
		rest = comment.rest

		for (i = 0; i < comment.arr.length; i++) {
			rest = rest.replace("FFCOMMENTPOS", comment.arr[i])
		}
		return rest
	}

	function preprocessorMode(txt) {
		var rest = txt, preprocessor, i
		preprocessor = new extract(rest, "load", "\"", preprocessorColoration, "FFPREPROCESSORPOS", 0, 1)
		rest = preprocessor.rest

		for (i = 0; i < preprocessor.arr.length; i++) {
			rest = rest.replace("FFPREPROCESSORPOS", preprocessor.arr[i])
		}
		return rest
	}

	function stringMode(txt) {
		var rest = txt, string, i
		string = new extract(rest, "\"", "\"", stringColoration, "FFSTRINGPOS", 1)
		rest = string.rest

		for (i = 0; i < string.arr.length; i++) {
			rest = rest.replace("FFSTRINGPOS", string.arr[i])
		}
		return rest
	}

	function typeMode(txt) {
		var rest = txt, types, i
		var types = [
			"func",
			"real",
			"matrix",
			"mesh",
			"mesh3",
			"fespace",
			"macro",
			"problem",
			"string",
			"int",
			"cout",
			"varf"
		]

		types.forEach(function(type) {
			type = new extract(rest, "\\b"+type+"\\b", type, typeColoration, "FFTYPEPOS")
			rest = type.rest

			for (i = 0; i < type.arr.length; i++) {
				rest = rest.replace("FFTYPEPOS", type.arr[i])
			}
		})
		return rest
	}

	function functionMode(txt) {
		var rest = txt, functions, i
		var functions = [
			"readmesh3",
			"plot",
			"int2d",
			"int3d",
			"on",
			"savevtk"
		]

		functions.forEach(function(func) {
			func = new extract(rest, func, func, functionColoration, "FFFUNCPOS")
			rest = func.rest

			for (i = 0; i < func.arr.length; i++) {
				rest = rest.replace("FFFUNCPOS", func.arr[i])
			}
		})
		return rest
	}

	function variableMode(txt) {
		var rest = txt, variables, i
		var variables = [
			"P23d",
			"dx",
			"dy",
			"dz",
			"CG",
			"true",
			"P1"
		];

		variables.forEach(function(variable) {
			variable = new extract(rest, variable, variable, variableColoration, "FFVARIABLEPOS")
			rest = variable.rest

			for (i = 0; i < variable.arr.length; i++) {
				rest = rest.replace("FFVARIABLEPOS", variable.arr[i])
			}
		});
		return rest
	}

	function attributeMode(txt) {
		var rest = txt, attributes, i
		var attributes = [
			"solver",
			"wait",
			"dataname",
			"order",
			"flags"
		];

		attributes.forEach(function(attribute) {
			attribute = new extract(rest, attribute, attribute, attributeColoration, "FFATTRIBUTEPOS")
			rest = attribute.rest

			for (i = 0; i < attribute.arr.length; i++) {
				rest = rest.replace("FFATTRIBUTEPOS", attribute.arr[i])
			}
		})
		return rest
	}

	function commentColoration(txt) {
		return "<span style=color:" + commentColor + ">" + txt + "</span>"
	}
	function preprocessorColoration(txt) {
		return "<span style=color:" + preprocessorColor + ">" + txt + "</span>"
	}
	function stringColoration(txt) {
		return "<span style=color:" + stringColor + ">" + txt + "</span>"
	}
	function typeColoration(txt) {
		return "<span style=color:" + typeColor + ">" + txt + "</span>"
	}
	function functionColoration(txt) {
		return "<span style=color:" + functionColor + ">" + txt + "</span>"
	}
	function variableColoration(txt) {
		return "<span style=color:" + variableColor + ">" + txt + "</span>"
	}
	function attributeColoration(txt) {
		return "<span style=color:" + attributeColor + ">" + txt + "</span>"
	}
}
