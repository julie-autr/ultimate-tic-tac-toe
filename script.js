const grilles=document.querySelectorAll('[class^="grille"]');
const lignes=document.querySelectorAll('[class^="ligne"]');
const cases=document.querySelectorAll('.case');
const megagrille=document.querySelector('.megagrille')

const htmljoueur=document.getElementById("joueur");
const htmlmega=document.getElementsByClassName("megagrille")[0];
const htmlcommentaires = document.getElementById("commentaires");

let partieEnCours = false;

// -------------------------------------------------------------------Menu des options et gestion des options 
// Variable pour stocker le mode de jeu (2b par défaut)
let ruleMode = "2b"; 

// --- Toggle du menu d'options ---
const optionsBtn = document.getElementById('menuToggle');
const sideMenuOptions = document.getElementById('sideMenuOption');

// --- Toggle des règles ---
const rulesBtn = document.getElementById('rulesBtn');
const sideMenuRules = document.getElementById('sideMenuRules');

optionsBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    // Fermer l'autre menu si ouvert
    sideMenuRules.classList.remove('open');
    sideMenuOptions.classList.toggle('open');
});

rulesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // Fermer l'autre menu si ouvert
    sideMenuOptions.classList.remove('open');
    sideMenuRules.classList.toggle('open');
});

// Fermer les menus si clic à l'extérieur
document.addEventListener('click', (e) => {
    if (!sideMenuOptions.contains(e.target) && !optionsBtn.contains(e.target)) {
        sideMenuOptions.classList.remove('open');
    }
    if (!sideMenuRules.contains(e.target) && !rulesBtn.contains(e.target)) {
        sideMenuRules.classList.remove('open');
    }
});




// Gestion des boutons d'options
const optionButtons = document.querySelectorAll('.opt-btn');

function toggleOption(option){
    optionButtons.forEach(btn => btn.classList.remove('active'));
    
    const offButton = document.querySelector(`.opt-btn.off[data-option="${option}"]`);
    const onButton = document.querySelector(`.opt-btn.on[data-option="${option}"]`);
    offButton.classList.add('active');
    onButton.classList.add('active');
}

optionButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        const clickedOption = e.target.getAttribute('data-option');
        const clickedState = e.target.getAttribute('data-state');

        // Si on clique sur un bouton ON
        if (clickedState === 'on') {
            if (partieEnCours){
                // On demande confirmation AVANT de changer quoi que ce soit
                const confirmation = await showConfirmModal("Changer de mode va réinitialiser la partie. Continuer ?");
                if (!confirmation) {
                    console.log("Changement de mode annulé");
                    return; // Stoppe ici, rien ne change
                }

                toggleOption(clickedOption)
                
                ruleMode = clickedOption; console.log("Mode de jeu changé :", ruleMode);

                // Redémarrer la partie
                restartGame();
            }
            else {
                toggleOption(clickedOption)
                ruleMode = clickedOption; console.log("Mode de jeu changé :", ruleMode);
            }
        }
    });
});


grilles.forEach((grille, index) => {
  setPlayability("grille", index, "playable")
});

cases.forEach((c, index) => {
  setPlayability("case", index, "playable")
});

let noms=[];

var joueuractuel=0;
var grilleactuelle = 150;


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


// Partie commune : choisir qui commence et préparer le tour
function startTurn() {
    let nb = Math.random();
    if (nb > 0.5) {
        joueuractuel = 1;
        setActivePlayer(1);
        htmlcommentaires.innerHTML = `C'est <span class="player-name player1">${noms[0]}</span> qui commence !`;
    } else {
        joueuractuel = 2;
        setActivePlayer(2);
        htmlcommentaires.innerHTML = `C'est <span class="player-name player2">${noms[1]}</span> qui commence !`;
    }

    // Affichage de la grille et des éléments
    document.querySelector(".megagrille").style.display = "block";
    void document.querySelector(".megagrille").offsetHeight; // Force reflow
    document.getElementById("joueur").style.display = "flex";    
    document.getElementsByClassName("joueur1")[0].innerText = noms[0];
    document.getElementsByClassName("joueur2")[0].innerText = noms[1];

    chooseGrid((indice) => {
        htmlcommentaires.innerText = ""; // Effacer message après le premier coup
        coup(indice);
    });

    partieEnCours = true;
}


// Losque la partie commence, Valider cliqué 
function getValue() {
    console.log("Bouton Valider cliqué")
    partieEnCours = true;
    // Récupérer les noms
    var nom1 = document.getElementById("in1").value;
    var nom2 = document.getElementById("in2").value;
    console.log(nom1,nom2); noms.push(nom1); noms.push(nom2);
    document.getElementById("toDelete").style.display = "none";     // Choisir qui commence
    startTurn();
};


function chooseGrid(callback) {
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
        if (texteParent && htmlcommentaires) {
          htmlcommentaires.style.display = "none";
        }

        canSelectGrid = 0;
        callback(indice);
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

function listenercase(event){ //g est l'indice de la grille dans laquelle on joue, et donc l'indice du parent de la case 
    console.log('cliqué');
    event.stopImmediatePropagation();
    const target = event.target;
    var parent=target.parentElement;
    
    var indice_grille=Arraygrilles.indexOf(parent);
    const indice_case_global = Array.from(cases).indexOf(target);
    const indice_case_in_grille = Array.from(parent.children).indexOf(target);
    // L'indice de la case dans la grille est l'indice de la grille suivante

    if (grilleactuelle==indice_grille && target.getAttribute("data-playable") === "playable"){
        console.log("On peut jouer cette case")

        console.log("Case globale cliquée :", indice_case_global);
        console.log("Case locale cliquée :", indice_case_in_grille);


        if (joueuractuel === 1){setPlayability("case", indice_case_global, "playedby1"); }
        else if (joueuractuel === 2){setPlayability("case", indice_case_global, "playedby2"); }

        for (var i=0;i<casesjouables.length;i++){casesjouables[i].removeEventListener('click',listenercase)}

        vainqueur = checkgrille(indice_grille)
        // On change la couleur de la grille si elle a été gagnée 
        if (vainqueur===1){ //la grille a été gagnée
            for (var n = 0; n < casesjouables.length; n++) {
            let idx = Array.prototype.indexOf.call(cases, casesjouables[n]);
            if (idx !== -1) {setPlayability("case", idx, "playedby1");}
            } 
        }
        else if (vainqueur===2){ //la grille a été gagnée
            for (var n = 0; n < casesjouables.length; n++) {
            let idx = Array.prototype.indexOf.call(cases, casesjouables[n]);
            if (idx !== -1) {setPlayability("case", idx, "playedby2");}
            }  
        }

        if (checkwin()) {
            return; // stoppe ici si victoire
        }
        // On envoie dans la grille associée
        // Si elle est jouable
        if (grilles[indice_case_in_grille].getAttribute("data-playable") === "playable"){
            changercouleurnoms();
            griser(indice_case_in_grille);
            console.log("On joue désormais dans la grille ", indice_case_in_grille)
            grilleactuelle = indice_case_in_grille;
            coup(indice_case_in_grille);  
        } 
        // Si on a cliqué sur une grille déjà finie
        else {
            if (ruleMode === "2b"){
            changercouleurnoms();
            console.log('Le coup emmène dans une grille finie'); 
            canSelectGrid=1;
            chooseGrid((indice) => {
            coup(indice);
            });
            } 
            else if (ruleMode === "2a") {
            console.log('Le coup emmène dans une grille finie'); 
            canSelectGrid=1;
            chooseGrid((indice) => {
            changercouleurnoms();
            coup(indice);
            });
            }
            else if (ruleMode === "1") {
            // Normalement, c'est TRES peu probable : 
            // que si indice_grille = indice_case_in_grille au moment où la grille est finie... 
            // Dans ce cas, c'est l'adversaire qui choisit nsm 
            changercouleurnoms();
            canSelectGrid=1;
            chooseGrid((indice) => {
            coup(indice);
            });
            }
        }
    }
    else console.log("Tu ne peux pas jouer cette case coco")
}

function joueesParGrille(indice) {
    const grille = grilles[indice];
    if (!grille) return 0;

    // Compte le nombre de cases dont data-playable ≠ "playable"
    return [...grille.querySelectorAll('.case')]
        .filter(c => c.dataset.playable !== "playable")
        .length;
}


function checkgrille(indice) {
    // Combinaisons gagnantes (chaînes binaires)
    const winning = [
        /^111......$/, /^...111...$/, /^......111$/, /^1..1..1..$/,
        /^.1..1..1.$/, /^..1..1..1$/, /^1...1...1$/, /^..1.1.1..$/
    ];

    // Sélectionne les 9 cases appartenant à la grille "indice"
    const grille = grilles[indice];
    if (!grille) return 0; // Sécurité si la grille n'existe pas

    const casesGrille = grille.querySelectorAll('.case');
    const binaires = [ "", "" ]; // [joueur1, joueur2]
    casesGrille.forEach(c => {
        const val = c.getAttribute("data-playable");
        binaires[0] += (val === "playedby1" ? "1" : "0");
        binaires[1] += (val === "playedby2" ? "1" : "0");
    });

    // Vérifie si un joueur a gagné
    let grillegagnee = 0;
    binaires.forEach((b, j) => {
        if (winning.some(regex => regex.test(b))) grillegagnee = j + 1;
    });
    if (grillegagnee === 1 || grillegagnee === 2){
        console.log(`Grille ${indice} gagnée par le joueur ${grillegagnee}`);
        setPlayability("grille", indice, `wonby${grillegagnee}`);
        if (ruleMode === "1") {
            grilles.forEach((g, gi) => {
                const cible = g.querySelectorAll('.case')[indice];
                if (cible.getAttribute('data-playable') === 'playable') {
                    cible.setAttribute('data-playable', `playedby${joueuractuel}`);
                }
                const etatGrille = g.getAttribute("data-playable");
                if (!["wonby1", "wonby2", "exaequo"].includes(etatGrille)) {
                    console.log("on teste la grille", gi);
                    checkgrille(gi);
                }
            });
        }
    }
    else if (joueesParGrille(indice) == 9 && grillegagnée == 0) {
        setPlayability("grille", indice, "exaequo");
        console.log("Grille ", indice, " exaequo")
    }

    return grillegagnee;
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

function afficherBoutonRejouer() {
    const resetBtn = document.getElementById("resetBtn");

    // Change le contenu
    resetBtn.textContent = "Rejouer";

    // Applique le style spécial
    resetBtn.classList.add("rejouer");

    // Supprime l’ancien event listener (qui ouvrait la modale)
    resetBtn.replaceWith(resetBtn.cloneNode(true));
    const newBtn = document.getElementById("resetBtn");

    // Ajoute un event listener direct → resetGame sans modale
    newBtn.addEventListener("click", () => {
        restartGame();  // ta fonction de redémarrage
        restaurerBoutonReset(); // revient à l’icône
    });
}

function restaurerBoutonReset() {
    const resetBtn = document.getElementById("resetBtn");

    // Remet le SVG original
    resetBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
        </svg>
    `;

    // Retire la classe "Rejouer"
    resetBtn.classList.remove("rejouer");

    // Réattache l’ancien comportement (ouverture modale si besoin)
    resetBtn.addEventListener("click", () => {
        document.getElementById("modalOverlay").classList.add("show");
    });
}



function checkwin(){
    const winning=[/^111......$/,/^...111...$/,/^......111$/,/^1..1..1..$/,/^.1..1..1.$/,/^..1..1..1$/,/^1...1...1$/,/^..1.1.1..$/];
    const playability = getGrillesState();
    const { joueur1: binaire1, joueur2: binaire2, playable: jouables } = playability;
    var gagnant=0;
    for (var i=0;i<winning.length;i++){
        if (winning[i].test(binaire1)==true){gagnant=1}
        if (winning[i].test(binaire2)==true){gagnant=2}
    }
    if (gagnant==0 && jouables!=='000000000'){
        return false
    }
    if (gagnant === 1 || gagnant === 2){
        console.log(`${gagnant} a gagné`)
        htmlcommentaires.innerHTML=`C\'est <span class="player-name player${gagnant}">${noms[gagnant-1]}</span> qui a gagné ! Cliquez sur Rejouer pour commencer une nouvelle partie.`;
}
    else if (gagnant==0 && jouables=='000000000'){
        console.log("fin de partie, égalité");
        htmlcommentaires.innerText=`Egalité, personne n\'a gagné ! Cliquez sur Rejouer pour commencer une nouvelle partie.`;
        }
    htmlcommentaires.style.display = "block";
    // htmlmega.style.display = "none";
    partieEnCours = false;
    afficherBoutonRejouer();
    return true
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

document.getElementById("resetBtn").addEventListener("click", () => {
  askAndRestart("Souhaitez-vous vraiment recommencer une nouvelle partie ?");
});

async function askAndRestart(message){
    const confirmation = await showConfirmModal(message);
    if (!confirmation) {
        console.log("Redémarrage annulé");
        return; // L'utilisateur a cliqué sur Non
    }
    restartGame();
}

function restartGame() {
    // Réinitialiser les variables de jeu
    joueuractuel = 0;
    grilleactuelle = 150;
    canSelectGrid = 1;
    
    // Réinitialiser les grilles et les cases
    grilles.forEach((grille, i) => {
        setPlayability("grille", i, "playable");
        Array.from(grille.children).forEach((c, j) => {
            setPlayability("case", Array.from(cases).indexOf(c), "playable");
        });
        setHoverGrille(i, "grille");
    });
    
    if (htmlcommentaires) {
        htmlcommentaires.innerHTML = "";
    }
    startTurn()
    console.log("Partie réinitialisée !");
}


function showConfirmModal(message) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('modalOverlay');
        const messageEl = document.getElementById('modalMessage');
        const yesBtn = document.getElementById('modalYes');
        const noBtn = document.getElementById('modalNo');
        
        // Afficher le message
        messageEl.textContent = message;
        overlay.classList.add('show');
        
        // Gérer le clic sur Oui
        const handleYes = () => {
            overlay.classList.remove('show');
            yesBtn.removeEventListener('click', handleYes);
            noBtn.removeEventListener('click', handleNo);
            resolve(true);
        };
        
        // Gérer le clic sur Non
        const handleNo = () => {
            overlay.classList.remove('show');
            yesBtn.removeEventListener('click', handleYes);
            noBtn.removeEventListener('click', handleNo);
            resolve(false);
        };
        
        yesBtn.addEventListener('click', handleYes);
        noBtn.addEventListener('click', handleNo);
    });
}