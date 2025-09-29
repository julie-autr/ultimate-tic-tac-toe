const grilles=document.querySelectorAll('[class^="grille"]');
const lignes=document.querySelectorAll('[class^="ligne"]');
const cases=document.querySelectorAll('.case');
const megagrille=document.querySelector('.megagrille')

grilles.forEach((grille, index) => {
  setPlayability("grille", index, "playable")
});

let noms=[];

var joueuractuel=0;
var grilleactuelle = 150;

// pour vérifier si la méga grille est un multiple de 3 (pour que les sous-grilles soient exactement de la même taille)
function estMultipleDeTrois(nombre){
    if (Number.isInteger(nombre/3)){return true};
    return false
}
// pour ajouter dans le css la hauteur des cases au chargement et quand on recadre la page pour que ce soit des carrés responsive
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

// pour que le bouton "Valider" ne soit pas cliquable si les noms ne sont pas renseignés
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

function setHoverGrille(index, mode) {
    // mode = "case", "grille" ou "none"
    grilles[index].setAttribute("data-hover", mode);
}

function setPlayability(element, index, mode) {
    // element = "case" ou "grille"
    if (element === "case") {
        // mode = "playable", "playedby1", "playedby2"
        cases[index].setAttribute("data-playable", mode);}
    else {
        // mode = "playable", "wonby1", "wonby2" ou "exaequo"
        grilles[index].setAttribute("data-playable", mode);
    }
}

// pour griser toutes les cases sauf celle sur laquelle on a cliqué
function griser(index) {
    grilles.forEach((grille, j) => {
        if (j === index) {
            setHoverGrille(j, "case");   // Seule cette grille permet le hover sur ses cases
        } else {
            setHoverGrille(j, "none");   // Les autres sont bloquées
        }
    });
    console.log("Toutes les grilles sont grisées sauf la grille n°", index)
}

var coup1=0; // pour ne pouvoir utiliser 'griser' en cliquant sur une grille uniquement si ça n'a pas encore été fait
const Arraygrilles=Array.from(grilles);


// Losque la partie commence, Valider cliqué 
function getValue() {
    console.log("Bouton Valider cliqué")
    // Récupérer les noms
    var nom1 = document.getElementById("in1").value;
    var nom2 = document.getElementById("in2").value;
    console.log(nom1,nom2); noms.push(nom1); noms.push(nom2);
    document.getElementById("toDelete").style.display='none';
    // Choisir qui commence
    let nb=Math.random();
    if (nb>0.5){document.getElementById("quicommence").innerText=`C'est ${noms[0]} qui commence !`;joueuractuel=1;document.getElementsByClassName("joueur1")[0].style.backgroundColor='#80586D'}
    else{document.getElementById("quicommence").innerText=`C'est ${noms[1]} qui commence !`;joueuractuel=2;document.getElementsByClassName("joueur2")[0].style.backgroundColor='#659ABD'};
    document.getElementById("joueur").innerHTML
    // Afficher la grille et les autres trucs
    document.getElementsByClassName("megagrille")[0].style.visibility='visible';
    document.getElementById("joueur").style.visibility='visible';
    document.getElementsByClassName("joueur1")[0].innerText=noms[0]; document.getElementsByClassName("joueur2")[0].innerText=noms[1];
    chooseGrid();
};

function chooseGrid() {
    for (var i=0;i<grilles.length;i++){
        setHoverGrille(i, "grille")
        grilles[i].addEventListener('click',function(event){
        const target = event.target;
        var parent=target.parentElement;
        var indice=Arraygrilles.indexOf(parent);
        if (coup1==0){
            griser(indice);
            grilleactuelle=indice;
            console.log("Grille ", indice, " choisie")
            document.getElementsByClassName("texte")[0].removeChild(document.getElementById("quicommence"))
            coup(indice);
        }
        else{console.log("Grille ", indice, " cliquée, mais une autre grille choisie avant")}
        coup1+=1;
    }) 
    }
}

var casesjouables=[];
var Arraycasesjouables=[];

function coup(g) { 
    casesjouables = grilles[g].children; 
    Arraycasesjouables = Array.from(casesjouables);

    for (var i = 0; i < casesjouables.length; i++) {
        casesjouables[i].addEventListener('click', listenercase);
    }
}

var choisir=0;
var joueespargrille=[0,0,0,0,0,0,0,0,0]
var casesjouees1=[[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]];
var casesjouees2=[[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]];

function listenercase(event){ //g est l'indice de la grille dans laquelle on joue, et donc l'indice du parent de la case 
    console.log('cliqué');
    event.stopImmediatePropagation();
    const target = event.target;
    var parent=target.parentElement;
    var indiceparent=Arraygrilles.indexOf(parent);
    if (grilleactuelle==indiceparent && parent.getAttribute("data-playable") === "playable"){
        console.log("Cette case est jouable")
        joueespargrille[indiceparent]+=1;
        const ind = Array.from(cases).indexOf(target);
        if (joueuractuel === 1){setPlayability("case", ind, "playedby1"); casesjouees1[indiceparent][ind]=1;}
        else if (joueuractuel === 2){setPlayability("case", ind, "playedby2"); casesjouees2[indiceparent][ind]=1;}

        /* if (checkgrille(indiceparent)==0){ //la grille n'a pas été gagnée
            if (grillesjouables[indice]==0){
                griser(indice);
                changercouleurnoms();
                for (var i=0;i<casesjouables.length;i++){casesjouables[i].removeEventListener('click',listenercase)}
                checkwin();
                coup(indice);  
            }
            else {
                console.log('vous voulez jouer dans une grille finie'); 
                griser(indice);
                changercouleurnoms();
                for (var i=0;i<casesjouables.length;i++){casesjouables[i].removeEventListener('click',listenercase)}
                choisir=1
                checkwin();
                choisirgrille();
            }
        }
        else if (checkgrille(indiceparent)==1){
            for (var n=0;n<casesjouables.length;n++){casesjouables[n].style.backgroundColor='#80586D';casesjouables[n].removeEventListener('click',listenercase)};
            choisir=1;
            checkwin();
            choisirgrille();
        }
        else if (checkgrille(indiceparent)==2){
            for (var n=0;n<casesjouables.length;n++){casesjouables[n].style.backgroundColor='#659ABD';casesjouables[n].removeEventListener('click',listenercase)};
            choisir=1;
            checkwin();
            choisirgrille();
        }*/
    }
    else console.log("pas cette case la coco")
}


function changercouleurnoms(){
    if (joueuractuel==1){joueuractuel=2;document.getElementsByClassName("joueur2")[0].style.backgroundColor='#659ABD';document.getElementsByClassName("joueur1")[0].style.backgroundColor='rgb(255,255,255,0)';} 
    else if (joueuractuel==2){joueuractuel=1;document.getElementsByClassName("joueur1")[0].style.backgroundColor='#80586D';document.getElementsByClassName("joueur2")[0].style.backgroundColor='rgb(255,255,255,0)';}; 
}
