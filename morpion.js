const grilles=document.querySelectorAll('[class^="grille"]');
const lignes=document.querySelectorAll('[class^="ligne"]');
const cases=document.querySelectorAll('.case');
const megagrille=document.querySelector('.megagrille')

function estMultipleDeTrois(nombre){
    if (Number.isInteger(nombre/3)){return true};
    return false
}
var bigwidth=2*window.innerWidth/5;
window.addEventListener('resize', () => {
    bigwidth=2*window.innerWidth/5; console.log(bigwidth);
    for (var i=0;i<3;i++){
        if (estMultipleDeTrois(bigwidth+i)==true){console.log("ok",i,bigwidth+i),megagrille.style.setProperty('width',`${bigwidth+i}px`)}
    };
    const width = cases[0].offsetWidth;
    for (var i=0;i<grilles.length;i++){grilles[i].style.setProperty('grid-auto-rows', `${width}px`)};  
});
window.addEventListener('load', () => {
    for (var i=0;i<3;i++){
        if (estMultipleDeTrois(bigwidth+i)==true){console.log("ok",bigwidth+i),megagrille.style.setProperty('width',`${bigwidth+i}px`)}
        else {megagrille.style.setProperty('width',`${Math.floor(bigwidth)}px`)}
    };
    const width = cases[0].offsetWidth;
    for (var i=0;i<grilles.length;i++){grilles[i].style.setProperty('grid-auto-rows', `${width}px`)
};  
});

const BoutonValider = document.getElementsByClassName("valider");
let noms=[];

var joueuractuel=0;

document.getElementById("bouton").addEventListener('click',function(){
    const nom1=document.getElementsByClassName("name1")[0].value;
    const nom2=document.getElementsByClassName("name2")[0].value;
    document.getElementById("toDelete").style.display('none');
    let nb=Math.random();
    if (nb>0.5){document.getElementsByClassName("quicommence")[0].innerText=`C'est ${nom1} qui commence !`; joueuractuel=1}
    else {document.getElementsByClassName("quicommence")[0].innerText=`C'est ${nom2} qui commence !`;joueuractuel=2};
}
);

function griser(i){
    for (var j=0;j<grilles.length;j++){grilles[j].style.backgroundColor="rgba(220,220,220,0.5)"};
    grilles[i].style.backgroundColor='rgb(255,255,255)';
};

const Arraygrilles=Array.from(grilles);


for (var i=0;i<grilles.length;i++){
    grilles[i].addEventListener('click',function(event){
        const target = event.target;
        var parent=target.parentElement;
        var indice=Arraygrilles.indexOf(parent);
        griser(indice); 
    })
};

for (var i=0;i<cases.length;i++){
    cases[i].addEventListener('click',function(event){
        const target = event.target;
        var indice=Arraygrilles.indexOf(target);
        griser(indice); 
    })
};