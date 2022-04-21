window.addEventListener('resize',function(){
    const width=document.querySelector('.grille').offsetWidth;
    console.log(width);
    document.querySelector('.megagrille').style.setProperty('grid-auto-rows',`${width}px`); 
});
window.addEventListener('load',function(){
    const width=document.querySelector('.grille').offsetWidth;
    console.log(width);
    document.querySelector('.megagrille').style.setProperty('grid-auto-rows',`${width}px`);
});