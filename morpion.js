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

let noms=[];

var joueuractuel=0;

function manage() {
    var txt1 = document.getElementById("in1").value;
    var txt2 = document.getElementById("in2").value;
    var bt = document.getElementById('bouton');
    if (txt1!=''&&txt2!='') {
        bt.disabled = false;
    }
    else {
        bt.disabled = true;
    }
};


function griser(index){
    for (var j=0;j<grilles.length;j++){
        if (j!=index){grilles[j].style.backgroundColor="rgba(220,220,220,0.5)"}
        else{grilles[j].style.backgroundColor="rgb(255,255,255)"}
    };
    
};

const Arraygrilles=Array.from(grilles);


for (var i=0;i<grilles.length;i++){
    grilles[i].addEventListener('click',function(event){
        const target = event.target;
        var parent=target.parentElement;
        var indice=Arraygrilles.indexOf(parent);
        console.log(indice)
        griser(indice); 
    })
};
function getValue() {
    var nom1 = document.getElementById("in1").value;
    var nom2 = document.getElementById("in2").value;
    console.log(nom1,nom2); noms.push(nom1); noms.push(nom2);
    document.getElementById("toDelete").style.display='none';
    let nb=Math.random();
    if (nb>0.5){document.getElementById("quicommence").innerText=`C'est ${noms[0]} qui commence !`;joueuractuel=1}
    else{document.getElementById("quicommence").innerText=`C'est ${noms[1]} qui commence !`;joueuractuel=2}
};


for (var i=0;i<cases.length;i++){
    cases[i].addEventListener('click',function(event){
        const target = event.target;
        var indice=Arraygrilles.indexOf(target);
        griser(indice); 
    });
}

