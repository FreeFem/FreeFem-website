let navOpened = false;

openNav = () => {
  const nav = document.getElementById('nav')
  const navButton = document.getElementById('navButton')

  if(window.getComputedStyle(navButton).display === 'none') return

  if (navOpened) {
    nav.style.width = 0
    navOpened = false
  } else {
    nav.style.width = "100%"
    navOpened = true
  }
}
