// Javascript implementation of FF litterate programming
// =====================================================
//
// Written by Antoine Le Hyaric [[http://www.ljll.math.upmc.fr/lehyaric]]
//
// Antoine Le Hyaric (1,2)
// 1- CNRS, UMR 7598, Laboratoire Jacques-Louis Lions, F-75005, Paris, France
// 2- Sorbonne Universités, UPMC Univ Paris 06, UMR 7598, Laboratoire Jacques-Louis Lions, F-75005, Paris, France
//
// This file is part of Freefem++
//
// Freefem++ is free software; you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation; either version 2.1 of
// the License, or (at your option) any later version.
//
// Freefem++ is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with Freefem++; if not, write to the Free Software
// Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA


// <<ffjs_reset>> clear the whole page, back to initial script

let stdout = document.getElementById('ffjs_stdout');
let stdoutText = '';
let stderrText = '';
let stderr = document.getElementById('ffjs_stderr');
let arrow = document.getElementById('arrow');
let arrowText = document.getElementById('arrow-text');
let arrowSpinner = document.getElementById('arrow-spinner');
let arrowReload = document.getElementById('arrow-reload');

editor.on('change', function() {

  // Show the run button again if the editor iss modified after the first execution
  if (arrow.classList.contains('is-invisible')) {
    arrow.classList.remove('is-invisible')
    arrowText.classList.remove('is-invisible')
  }
})

function ffjs_clear_stdout() {
  stdout.textContent = '';
}

function ffjs_clear_stderr() {
  stderr.textContent = '';
}

function ffjs_add_stdout(text) {
  stdoutText = stdoutText + text + '<br/>';

}

function ffjs_add_stderr(text) {
  stderrText = stderrText + text + '<br/>';
}

function ffjs_reset() {

  // [[http://www.w3schools.com/js/js_popup.asp]]
  var r = confirm("This will erase all your changes. Are you sure?");
  if (!r) return;

  console.log("ffjs_reset: Resetting form...");
  ffjs_clear_stdout();
  ffjs_clear_stderr();
  ffjs_clearallgraphs();

  // Find all script text portions in the HTML document [[http://api.jquery.com/attribute-starts-with-selector/]].  $(this).value and
  // $(this).defaultValue were also tried but they did not work and kept a value of "undefined".

  var script = "";
  $(".ffjs").each(function() {
    if ($(this).is("input") || $(this).is("select") || $(this).is("textarea")) {
      $(this).val($(this).text());
    }
  });
}

// <<ffjs_extract_script>> Extract script text from HTML page
function ffjs_extract_script() {

  // get the  CodeMIrror editor content
  let script = editor.getValue()

  // <<cleanup_bizarre_html_characters>> Change some UTF characters produced in htlatex generation by [[file:freefemjs.sty]]
  script = script.replace(/\xa0/g, " ");
  return script;
}

// <<ffjs_export>> Export the current script text from the HTML page and allows to save it as a file
function ffjs_export(name) {

  // using [[https://github.com/eligrey/FileSaver.js]] downloaded in [[file:Makefile::FileSaver.js]]
  var blob = new Blob([ffjs_extract_script()], {
    type: "text/plain;charset=utf-8"
  });
  saveAs(blob, name);
}

// <<<ffjs_evaluate>>> run FreeFem++ evaluations
function ffjs_evaluate() {

  ffjs_clear_stdout()
  ffjs_clear_stderr()

  arrowText.classList.add('is-invisible')
  arrowSpinner.classList.remove('is-invisible')
  console.log('spinner ok')

  window.setTimeout(function() {
    console.log("ffjs_evaluate: Running FreeFem++...")
    ffjs_callcxx(ffjs_extract_script())
    console.log("ffjs_evaluate: FreeFem++ complete.")

    //TODO buggy stuff
    const ffjsGraph = document.getElementsByClassName('ffjs_graph')
    ffjsGraph[0].style.height = 'unset'

    //console output
    stdout.innerHTML = stdoutText
    stderr.innerHTML = stderrText

    arrowSpinner.classList.add('is-invisible')
    arrow.classList.add('is-invisible')
  }, 50);

}


// <<ffjs_listgraphs>> receives graph file names from [[file:util.cpp::listgraphs]] character by character when FF calls
// [[file:~/ff/src/Graphics/sansrgraph.cpp::openPS]]

var ffjs_graphs = [""];
var ffjs_current_graph = "default";

function ffjs_listgraphs(c) {

  // any character being received is added to the current file name, unless its \0 which means the end of the current file name.

  var i = ffjs_graphs.length - 1;
  if (c) ffjs_graphs[i] = ffjs_graphs[i] + String.fromCharCode(c);
  else {
    ffjs_current_graph = ffjs_graphs[i];
    ffjs_graphs.push("");
  }
}

// <<ffjs_files_data>> Copy of FS contents to be able to access files after [[file:pre.js::ffjs_callcxx]] has ended. Valorized in
// [[file:post.js::ffjs_files_data]] ALH_IDEA do something with this data!

var ffjs_files_data = [];

// 2D graphics. The following functions are called from [[file:~/ff/src/Graphics/sansrgraph.cpp]]

var ffjs_canvas;
var ffjs_point = {
  x: 0,
  y: 0
};
var ffjs_context;
var ffjs_scale;

// <<ffjs_graphstart>> called by [[file:~/ff/src/Graphics/sansrgraph.cpp::ffjs_graphstart]]

// ALH_IDEA restart a new graph for all FF plots, and place it in a div with the same name as the file specified in ps= (deactivate
// postscript output for that file?)

function ffjs_graphstart() {

  // Transfer all graphs to divs of class "ffjs_graph".

  ffjs_canvas = null;
  var jquery_canvas;
  var ffjs_canvas_default;
  var jquery_canvas_default;
  $(".ffjs_graph").each(function() {

    // Each of these divs contains a "data-ffjs" attribute which may be "all" to receive all graphs, or a file name to receive only one
    // file, as specified ine the "ps=" plot parameter and sent to this function by [[file:~/ff/src/Graphics/sansrgraph.cpp]]
    // [[http://stackoverflow.com/questions/432174/how-to-store-arbitrary-data-for-some-html-tags]]

    if ($(this).data('ffjs') == ffjs_current_graph) {

      // [[http://stackoverflow.com/questions/2925130/jquery-equivalent-of-getting-the-context-of-a-canvas]]
      jquery_canvas = $(this);
      ffjs_canvas = $(this).get(0);
    }

    // keep location for default graphs if we dont find an exact match
    if ($(this).data('ffjs') == 'default') {
      jquery_canvas_default = $(this);
      ffjs_canvas_default = $(this).get(0);
    }
  })

  // use default canvas if we did not find an exact match on the "ps=" name
  if (!ffjs_canvas) {
    ffjs_canvas = ffjs_canvas_default;
    jquery_canvas = jquery_canvas_default;
  }

  // canvas from [[http://openclassrooms.com/courses/la-balise-canvas-avec-javascript]]

  if (!ffjs_canvas) {
    console.log("ffjs_graphstart: No canvas available for graph '" + ffjs_current_graph + "'");
    return;
  }

  console.log("ffjs_graphstart: Creating graph '" + ffjs_current_graph + "'...");

  // Do not change canvas width and height to correspond to FF dimensions because that would make all lines too thin. Just keep the actual
  // size of the rendered page and set a scale factor.  But make sure to keep the same aspect ratio on screen than in FF (cf
  // [[file:~/ff/src/Graphics/sansrgraph.cpp::aspect_ratio]]).

  jquery_canvas.height(jquery_canvas.width() / Math.sqrt(2));
  ffjs_canvas.width = ffjs_canvas.offsetWidth;
  ffjs_canvas.height = ffjs_canvas.offsetHeight;
  ffjs_scale = 10000 / ffjs_canvas.width;

  ffjs_context = ffjs_canvas.getContext('2d');
  if (!ffjs_context) {
    console.log("No context for FFJS canvas");
    return;
  }

  // [[http://www.w3schools.com/tags/canvas_filltext.asp]]
  ffjs_context.font = "12px bold Arial";

  // use fillRect() instead of clearRect() to have a white background for the picture instead of a transparent one (some FF drawings show
  // imperfections when drawn onto a different colored background).

  ffjs_context.fillStyle = "white"; // [[http://www.w3schools.com/tags/canvas_fillstyle.asp]]
  ffjs_context.fillRect(0, 0, ffjs_canvas.width, ffjs_canvas.height);
}

// <<ffjs_graphdone>> called by [[file:~/ff/src/Graphics/sansrgraph.cpp::ffjs_graphdone]]
function ffjs_graphdone() {
  ffjs_current_graph = "default"
}

// <<ffjs_clearallgraphs>
function ffjs_clearallgraphs() {
  $(".ffjs_graph").each(function() {
    var canvas = $(this).get(0);
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  })
}

// <<ffjs_couleur>> called by [[file:~/ff/src/Graphics/sansrgraph.cpp::ffjs_couleur]]
function ffjs_couleur(r, g, b) {
  if (!ffjs_context) return;
  var rgb = "rgb(" + Math.floor(r * 255) + "," + Math.floor(g * 255) + "," + Math.floor(b * 255) + ")";
  ffjs_context.strokeStyle = rgb;
  ffjs_context.fillStyle = rgb;
}

// <<ffjs_rmoveto>> called by [[file:~/ff/src/Graphics/sansrgraph.cpp::ffjs_rmoveto]]
function ffjs_rmoveto(x, y) {
  if (!ffjs_context) return;
  ffjs_point = {
    x: x / ffjs_scale,
    y: y / ffjs_scale
  };
}

// <<ffjs_rlineto>> called by [[file:~/ff/src/Graphics/sansrgraph.cpp::ffjs_rlineto]]
function ffjs_rlineto(x, y) {
  if (!ffjs_context) return;

  // cf http://openclassrooms.com/courses/la-balise-canvas-avec-javascript
  ffjs_context.beginPath();
  ffjs_context.moveTo(ffjs_point.x, ffjs_point.y);
  ffjs_context.lineTo(x / ffjs_scale, y / ffjs_scale);
  ffjs_context.stroke();
  ffjs_context.closePath();
  ffjs_point = {
    x: x / ffjs_scale,
    y: y / ffjs_scale
  };
}

// <<ffjs_plotstring>> called by [[file:~/ff/src/Graphics/sansrgraph.cpp::ffjs_plotstring]]
// [[http://kripken.github.io/emscripten-site/docs/api_reference/emscripten.h.html#c.EM_ASM_]]
var ffjs_string = "";

function ffjs_plotstring(c) {
  if (!ffjs_context) return;
  if (c) ffjs_string += String.fromCharCode(c);
  else {

    // cf [[http://www.w3schools.com/tags/canvas_filltext.asp]]
    ffjs_context.fillText(ffjs_string, ffjs_point.x, ffjs_point.y);
    ffjs_string = "";
  }
}

// <<ffjs_penthickness>> called by [[file:~/ff/src/Graphics/sansrgraph.cpp::ffjs_penthickness]]. ALH_BUG ffjs_penthickness() does not seem
// to be called during the first run of the Laplace.edp example?

function ffjs_penthickness(pepais) {
  if (!ffjs_context) return;

  // [[http://www.w3schools.com/tags/canvas_linewidth.asp]]
  ffjs_context.lineWidth = pepais;
}

// <<ffjs_fillpoly>> called by [[file:~/ff/src/Graphics/sansrgraph.cpp::ffjs_fillpoly]]. Initialize it as an object and not a pure array
// because that is what jsDraw2D expects.

function ffjs_fillpoly_begin(x, y) {
  if (!ffjs_context) return;
  ffjs_context.beginPath();
  ffjs_context.moveTo(x / ffjs_scale, y / ffjs_scale);
}

function ffjs_fillpoly_next(x, y) {
  if (!ffjs_context) return;
  ffjs_context.lineTo(x / ffjs_scale, y / ffjs_scale);
}

function ffjs_fillpoly_close() {
  if (!ffjs_context) return;
  ffjs_context.fill();
  ffjs_context.closePath();
}
