const barre = document.getElementById("barre");
const navItems = document.querySelectorAll(".nav-link");
const mesAchatsLink = document.querySelector('a[href="#mesAchats"]');
const articleLink = document.querySelector('a[href="#article"]');

function updateBarre(el){
  const offsetLeft = (el.offsetLeft  + ((el.offsetWidth) / 2) - ((barre.offsetWidth) / 2))/16 ;
  barre.style.left = `${offsetLeft}em`;
  console.log(el.offsetLeft+" | "+barre.offsetWidth);
}

navItems.forEach((item,index) => {
  item.addEventListener('click', (event) => {
    updateBarre(event.currentTarget);
  });
});
//Position initiale
document.addEventListener('DOMContentLoaded',() => {
  const activeItem = document.querySelector('.nav-item a.active');
  console.log(activeItem);
  
  updateBarre(activeItem);
})

mesAchatsLink.addEventListener('click', () => {
  barre.classList.add('barreEffetAchats');
});

articleLink.addEventListener('click', () => {
  barre.classList.remove('barreEffetAchats');
});
