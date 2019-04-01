const donateLink = document.getElementById('donate')
const nav = donateLink.parentElement.querySelectorAll('nav > a')

donateLink.onclick = function() {
  donateLink.innerHTML = 'COMING SOON'
  setTimeout(function() {
    donateLink.innerHTML = 'DONATE'
  }, 3000)
}
