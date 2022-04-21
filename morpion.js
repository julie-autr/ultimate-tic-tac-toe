const grilles=document.querySelectorAll('[class^="grille"]');
const cases=document.querySelectorAll('.case');

window.addEventListener('resize', () => {
    const width = cases[0].offsetWidth;
    for (var i=0;i<cases.length;i++){grilles[i].style.setProperty('grid-auto-rows', `${width}px`)};  

});
window.addEventListener('load', () => {
    const width = cases[0].offsetWidth;
    for (var i=0;i<cases.length;i++){grilles[i].style.setProperty('grid-auto-rows', `${width}px`)};  
});
