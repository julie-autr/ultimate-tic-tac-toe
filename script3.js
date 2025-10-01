const grilles=document.querySelectorAll('[class^="grille"]');
const lignes=document.querySelectorAll('[class^="ligne"]');
const cases=document.querySelectorAll('.case');
const megagrille=document.querySelector('.megagrille')

const htmljoueur=document.getElementById("joueur");
const htmlmega=document.getElementsByClassName("megagrille")[0];

grilles.forEach((grille, index) => {
  setPlayability("grille", index, "playable")
});

cases.forEach((c, index) => {
  setPlayability("case", index, "playable")
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

function setActivePlayer(player) {
    // player = 1 ou 2
    const joueur1 = document.getElementsByClassName("joueur1")[0];
    const joueur2 = document.getElementsByClassName("joueur2")[0];

    if (!joueur1 || !joueur2) {
        console.error("Les éléments joueur1 / joueur2 n'existent pas encore dans le DOM !");
        return;
    }
    if (player === 1) {
        joueur1.setAttribute("data-active", "true");
        joueur2.setAttribute("data-active", "false");
    } else if (player === 2) {
        joueur1.setAttribute("data-active", "false");
        joueur2.setAttribute("data-active", "true");
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

var canSelectGrid=1; // pour ne pouvoir utiliser 'griser' en cliquant sur une grille uniquement si ça n'a pas encore été fait
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
    if (nb > 0.5) {
        document.getElementById("quicommence").innerText = `C'est ${noms[0]} qui commence !`;
        joueuractuel = 1;
        setActivePlayer(1);
    } else {
        document.getElementById("quicommence").innerText = `C'est ${noms[1]} qui commence !`;
        joueuractuel = 2;
        setActivePlayer(2);
    }
    document.getElementById("joueur").innerHTML
    // Afficher la grille et les autres trucs
    document.getElementsByClassName("megagrille")[0].style.visibility='visible';
    document.getElementById("joueur").style.visibility='visible';
    document.getElementsByClassName("joueur1")[0].innerText=noms[0]; document.getElementsByClassName("joueur2")[0].innerText=noms[1];
    chooseGrid();
};


function chooseGrid() {
  grilles.forEach((grille, i) => {
    setHoverGrille(i, "grille");

    grille.onclick = (event) => {

      const clickedGrille = event.currentTarget;
      const indice = Array.from(grilles).indexOf(clickedGrille);
      if (canSelectGrid === 1 && clickedGrille.getAttribute("data-playable") === "playable") {
        griser(indice);
        grilleactuelle = indice;
        console.log("Grille ", indice, " choisie");

        // Lorsqu'on choisit pour la première fois, on supprime le texte 
        const texteParent = document.getElementsByClassName("texte")[0];
        const quicommence = document.getElementById("quicommence");
        if (texteParent && quicommence) {
          texteParent.removeChild(quicommence);
        }

        coup(indice);
        canSelectGrid = 0;
      } else if (clickedGrille.getAttribute("data-playable") !== "playable") {
        console.log("Cette grille ne peut pas être jouée");
      } else {
        console.log("Grille ", indice, " cliquée, mais une autre grille choisie avant");
      }
    };
  });
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
    
    var indice_grille=Arraygrilles.indexOf(parent);
    const indice_case_global = Array.from(cases).indexOf(target);
    const indice_case_in_grille = Array.from(parent.children).indexOf(target);
    // L'indice de la case dans la grille est l'indice de la grille suivante

    console.log("Variable grille actuelle = ", grilleactuelle);
    console.log("Indice_grille récupéré = ", indice_grille);
    console.log("target.getAttribute(data-playable)", target.getAttribute("data-playable"))

    if (grilleactuelle==indice_grille && target.getAttribute("data-playable") === "playable"){
        console.log("On peut jouer cette case")
        joueespargrille[indice_grille]+=1;

        console.log("Case globale cliquée :", indice_case_global);
        console.log("Case locale cliquée :", indice_case_in_grille);


        if (joueuractuel === 1){setPlayability("case", indice_case_global, "playedby1"); casesjouees1[indice_grille][indice_case_in_grille]=1;}
        else if (joueuractuel === 2){setPlayability("case", indice_case_global, "playedby2"); casesjouees2[indice_grille][indice_case_in_grille]=1;}

        for (var i=0;i<casesjouables.length;i++){casesjouables[i].removeEventListener('click',listenercase)}

        if (checkgrille(indice_grille)==0){ //la grille n'a pas été gagnée
            griser(indice_case_in_grille);
            changercouleurnoms();

            if (grilles[indice_case_in_grille].getAttribute("data-playable") === "playable"){
                console.log("On joue désormais dans la grille ", indice_case_in_grille)
                grilleactuelle = indice_case_in_grille;
                coup(indice_case_in_grille);  
            }
            else {
                console.log('Le coup emmène dans une grille finie'); 
                canSelectGrid=1;
                chooseGrid();
            }
        }
        else if (checkgrille(indice_grille)==1){
            for (var n = 0; n < casesjouables.length; n++) {
                let idx = Array.prototype.indexOf.call(cases, casesjouables[n]);
                if (idx !== -1) {setPlayability("case", idx, "playedby1");}
            }            
            canSelectGrid=1;
            chooseGrid();
        }
        else if (checkgrille(indice_grille)==2){
            for (var n = 0; n < casesjouables.length; n++) {
                let idx = Array.prototype.indexOf.call(cases, casesjouables[n]);
                if (idx !== -1) {setPlayability("case", idx, "playedby2");}
            }            
            canSelectGrid=1;
            chooseGrid();
        }
        checkwin();
    }
    else console.log("Tu ne peux pas jouer cette case coco")
}


function checkgrille(indice){ //g indice de la grille qu'on teste
    const winning=[/^111......$/,/^...111...$/,/^......111$/,/^1..1..1..$/,/^.1..1..1.$/,/^..1..1..1$/,/^1...1...1$/,/^..1.1.1..$/];
    var binairejouees1=casesjouees1[indice].join('');
    var binairejouees2=casesjouees2[indice].join('');
    var grillegagnée=0;
    for (var i=0;i<winning.length;i++){
        if (winning[i].test(binairejouees1)==true){grillegagnée=1}
        if (winning[i].test(binairejouees2)==true){grillegagnée=2}
    }
    var enfants=grilles[indice].children;
    if (grillegagnée==1){
        setPlayability("grille", indice, "wonby1")
    }
    else if (grillegagnée==2){
        setPlayability("grille", indice, "wonby2")
    }
    else if (joueespargrille[indice]==9&&grillegagnée==0){setPlayability("grille", indice, "exaequo");document.getElementById("commentaire").innerText='Cette grille est perdue'}
    return grillegagnée
}

function getGrillesState() {
    let binWon1 = "";
    let binWon2 = "";
    let binPlayable = "";

    grilles.forEach((grille) => {
        const state = grille.getAttribute("data-playable");

        if (state === "wonby1") {
            binWon1 += "1";
            binWon2 += "0";
            binPlayable += "0";
        } else if (state === "wonby2") {
            binWon1 += "0";
            binWon2 += "1";
            binPlayable += "0";
        } else if (state === "playable") {
            binWon1 += "0";
            binWon2 += "0";
            binPlayable += "1";
        } else {
            // cas "exaequo" ou autre
            binWon1 += "0";
            binWon2 += "0";
            binPlayable += "0";
        }
    });
    return {
        joueur1: binWon1,  joueur2: binWon2,playable: binPlayable 
    };
}


function checkwin(){
    const winning=[/^111......$/,/^...111...$/,/^......111$/,/^1..1..1..$/,/^.1..1..1.$/,/^..1..1..1$/,/^1...1...1$/,/^..1.1.1..$/];
    const playability = getGrillesState();
    var binairegagnees1=playability.joueur1;
    var binairegagnees2=playability.joueur2;
    var binairejouables=playability.playable;
    var gagnant=0;
    for (var i=0;i<winning.length;i++){
        if (winning[i].test(binairegagnees1)==true){gagnant=1}
        if (winning[i].test(binairegagnees2)==true){gagnant=2}
    }
    if (gagnant==1){htmljoueur.innerText=`Bravo !!! C'est ${noms[0]} qui a gagné !`;htmlmega.style.visibility='hidden'}
    else if (gagnant==2){htmljoueur.innerText=`Bravo !!! C'est ${noms[1]} qui a gagné !`;htmlmega.style.visibility='hidden'}
    else if (gagnant==0 && binairejouables=='000000000'){htmljoueur.innerText='Egalité, personne n\'a gagné ! Cliquez sur `Rejouer` pour commencer une nouvelle partie';htmlmega.style.visibility='hidden'}
}

function changercouleurnoms() {
    if (joueuractuel === 1) {
        joueuractuel = 2;
        setActivePlayer(2);
    } else if (joueuractuel === 2) {
        joueuractuel = 1;
        setActivePlayer(1);
    }
}
