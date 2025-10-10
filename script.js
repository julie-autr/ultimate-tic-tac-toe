// ============================================================================
// SÉLECTION DES ÉLÉMENTS DOM
// ============================================================================

const grilles = document.querySelectorAll('[class^="grille"]');
const lignes = document.querySelectorAll('[class^="ligne"]');
const cases = document.querySelectorAll('.case');
const megagrille = document.querySelector('.megagrille');

const htmlJoueur = document.getElementById("gameInfo");
const htmlCommentaires = document.getElementById("commentaires");

const optionsBtn = document.getElementById('optionsToggle');
const optionsSideMenus = document.getElementById('optionsSideMenu');
const rulesToggleBtn = document.getElementById('rulesToggleBtn');
const rulesSideMenu = document.getElementById('rulesSideMenu');
const optionButtons = document.querySelectorAll('.game-mode-btn');

// ============================================================================
// VARIABLES D'ÉTAT DU JEU
// ============================================================================

let partieEnCours = false;
let ruleMode = "2b"; // Mode de jeu par défaut
let noms = [];
let joueurActuel = 0;
let grilleActuelle = 150;
let canSelectGrid = 1;
let casesJouables = [];
let arrayCasesJouables = [];

const arrayGrilles = Array.from(grilles);

// ============================================================================
// GESTION DES MENUS (OPTIONS ET RÈGLES)
// ============================================================================

// Toggle du menu d'options
optionsBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    rulesSideMenu.classList.remove('open');
    optionsSideMenus.classList.toggle('open');
});

// Toggle des règles
rulesToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    optionsSideMenus.classList.remove('open');
    rulesSideMenu.classList.toggle('open');
});

// Fermer les menus si clic à l'extérieur
document.addEventListener('click', (e) => {
    if (!optionsSideMenus.contains(e.target) && !optionsBtn.contains(e.target)) {
        optionsSideMenus.classList.remove('open');
    }
    if (!rulesSideMenu.contains(e.target) && !rulesToggleBtn.contains(e.target)) {
        rulesSideMenu.classList.remove('open');
    }
});

// Gestion des boutons d'options
function toggleOption(option) {
    optionButtons.forEach(btn => btn.classList.remove('active'));
    
    const offButton = document.querySelector(`.game-mode-btn.off[data-option="${option}"]`);
    const onButton = document.querySelector(`.game-mode-btn.on[data-option="${option}"]`);
    offButton.classList.add('active');
    onButton.classList.add('active');
}

optionButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        const clickedOption = e.target.getAttribute('data-option');
        const clickedState = e.target.getAttribute('data-state');

        // Si on clique sur un bouton ON
        if (clickedState === 'on') {
            if (partieEnCours) {
                const confirmation = await showConfirmModal("Changer de mode va réinitialiser la partie. Continuer ?");
                if (!confirmation) {
                    console.log("Changement de mode annulé");
                    return;
                }
                toggleOption(clickedOption);
                ruleMode = clickedOption;
                console.log("Mode de jeu changé :", ruleMode);
                restartGame();
            } else {
                toggleOption(clickedOption);
                ruleMode = clickedOption;
                console.log("Mode de jeu changé :", ruleMode);
            }
        }
    });
});

// ============================================================================
// INITIALISATION DU JEU
// ============================================================================

// Initialiser toutes les grilles et cases comme jouables
grilles.forEach((grille, index) => {
    setPlayability("grille", index, "playable");
});

cases.forEach((c, index) => {
    setPlayability("case", index, "playable");
});

// Validation des noms de joueurs
function manage() {
    const txt1 = document.getElementById("in1").value;
    const txt2 = document.getElementById("in2").value;
    const bt = document.getElementById('bouton');
    
    if (txt1 !== '' && txt2 !== '') {
        bt.disabled = false;  
    } else {
        bt.disabled = true; 
    }
}

// Récupérer les noms et démarrer la partie
function getValue() {
    console.log("Bouton Valider cliqué");
    partieEnCours = true;
    
    const nom1 = document.getElementById("in1").value;
    const nom2 = document.getElementById("in2").value;
    console.log(nom1, nom2);
    
    noms.push(nom1);
    noms.push(nom2);
    
    document.getElementById("gameSetup").style.display = "none";
    startTurn();
}

// Démarrer un tour (choisir qui commence)
function startTurn() {
    const nb = Math.random();
    
    if (nb > 0.5) {
        joueurActuel = 1;
        setActivePlayer(1);
        htmlCommentaires.innerHTML = `C'est <span class="player-name player1">${noms[0]}</span> qui commence !`;
    } else {
        joueurActuel = 2;
        setActivePlayer(2);
        htmlCommentaires.innerHTML = `C'est <span class="player-name player2">${noms[1]}</span> qui commence !`;
    }

    // Affichage de la grille et des éléments
    megagrille.style.display = "block";
    void megagrille.offsetHeight; // Force reflow
    htmlJoueur.style.display = "flex";    
    document.getElementsByClassName("joueur1")[0].innerText = noms[0];
    document.getElementsByClassName("joueur2")[0].innerText = noms[1];

    chooseGrid((indice) => {
        htmlCommentaires.innerText = "";
        coup(indice);
    });

    partieEnCours = true;
}

// ============================================================================
// GESTION DE L'AFFICHAGE ET DES ÉTATS
// ============================================================================

function setHoverGrille(index, mode) {
    // mode = "case", "grille" ou "none"
    grilles[index].setAttribute("data-hover", mode);
}

function setPlayability(element, index, mode) {
    // element = "case" ou "grille"
    if (element === "case") {
        // mode = "playable", "playedby1", "playedby2"
        cases[index].setAttribute("data-playable", mode);
    } else {
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

function changerCouleurNoms() {
    if (joueurActuel === 1) {
        joueurActuel = 2;
        setActivePlayer(2);
    } else if (joueurActuel === 2) {
        joueurActuel = 1;
        setActivePlayer(1);
    }
}

// ============================================================================
// LOGIQUE DE SÉLECTION DES GRILLES
// ============================================================================

function griser(index) {
    grilles.forEach((grille, j) => {
        if (j === index) {
            setHoverGrille(j, "case");
        } else {
            setHoverGrille(j, "none");
        }
    });
}

function chooseGrid(callback) {
    grilles.forEach((grille, i) => {
        setHoverGrille(i, "grille");

        grille.onclick = (event) => {
            const clickedGrille = event.currentTarget;
            const indice = Array.from(grilles).indexOf(clickedGrille);
            
            if (canSelectGrid === 1 && clickedGrille.getAttribute("data-playable") === "playable") {
                griser(indice);
                grilleActuelle = indice;
                console.log("Grille ", indice, " choisie");

                const texteParent = document.getElementsByClassName("texte")[0];
                if (texteParent && htmlCommentaires) {
                    htmlCommentaires.style.display = "none";
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

// ============================================================================
// LOGIQUE DE JEU (COUPS ET CASES)
// ============================================================================

function coup(g) { 
    casesJouables = grilles[g].children; 
    arrayCasesJouables = Array.from(casesJouables);

    for (let i = 0; i < casesJouables.length; i++) {
        casesJouables[i].addEventListener('click', listenerCase);
    }
}

function listenerCase(event) {
    event.stopImmediatePropagation();
    
    const target = event.target;
    const parent = target.parentElement;
    
    const indiceGrille = arrayGrilles.indexOf(parent);
    const indiceCaseGlobal = Array.from(cases).indexOf(target);
    const indiceCaseInGrille = Array.from(parent.children).indexOf(target);

    if (grilleActuelle == indiceGrille && target.getAttribute("data-playable") === "playable") {

        if (joueurActuel === 1) {
            setPlayability("case", indiceCaseGlobal, "playedby1");
        } else if (joueurActuel === 2) {
            setPlayability("case", indiceCaseGlobal, "playedby2");
        }

        for (let i = 0; i < casesJouables.length; i++) {
            casesJouables[i].removeEventListener('click', listenerCase);
        }

        const vainqueur = checkGrille(indiceGrille);
        
        // Changer la couleur de la grille si elle a été gagnée 
        if (vainqueur === 1) {
            for (let n = 0; n < casesJouables.length; n++) {
                const idx = Array.prototype.indexOf.call(cases, casesJouables[n]);
                if (idx !== -1) {
                    setPlayability("case", idx, "playedby1");
                }
            } 
        } else if (vainqueur === 2) {
            for (let n = 0; n < casesJouables.length; n++) {
                const idx = Array.prototype.indexOf.call(cases, casesJouables[n]);
                if (idx !== -1) {
                    setPlayability("case", idx, "playedby2");
                }
            }  
        }

        if (checkWin()) {
            return; // Stoppe ici si victoire
        }
        
        // On envoie dans la grille associée
        if (grilles[indiceCaseInGrille].getAttribute("data-playable") === "playable") {
            changerCouleurNoms();
            griser(indiceCaseInGrille);
            console.log("On joue désormais dans la grille ", indiceCaseInGrille);
            grilleActuelle = indiceCaseInGrille;
            coup(indiceCaseInGrille);  
        } else {
            // Si on a cliqué sur une grille déjà finie
            if (ruleMode === "2b") {
                changerCouleurNoms();
                console.log('Le coup emmène dans une grille finie'); 
                canSelectGrid = 1;
                chooseGrid((indice) => {
                    coup(indice);
                });
            } else if (ruleMode === "2a") {
                console.log('Le coup emmène dans une grille finie'); 
                canSelectGrid = 1;
                chooseGrid((indice) => {
                    changerCouleurNoms();
                    coup(indice);
                });
            } else if (ruleMode === "1") {
                changerCouleurNoms();
                canSelectGrid = 1;
                chooseGrid((indice) => {
                    coup(indice);
                });
            }
        }
    } else {
        console.log("Tu ne peux pas jouer cette case");
    }
}

// ============================================================================
// UTILITAIRES
// ============================================================================

function getCases(grille) {
    // Si on passe un nombre, on récupère l'élément correspondant
    if (typeof grille === 'number') {
        grille = document.querySelector(`.grille${grille}`);
    }

    if (!grille) return null;

    const cases = grille.querySelectorAll('.case');
    return cases;
}

function joueesParGrille(indice) {
    const grille = grilles[indice];
    if (!grille) return 0;

    return [...getCases(grille)]
        .filter(c => c.dataset.playable !== "playable")
        .length;
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
        joueur1: binWon1,
        joueur2: binWon2,
        playable: binPlayable 
    };
}

// ============================================================================
// VÉRIFICATION DES VICTOIRES
// ============================================================================

function checkGrille(indice) {
    // Combinaisons gagnantes (chaînes binaires)
    const winning = [
        /^111......$/, /^...111...$/, /^......111$/, /^1..1..1..$/,
        /^.1..1..1.$/, /^..1..1..1$/, /^1...1...1$/, /^..1.1.1..$/
    ];

    const grille = grilles[indice];
    if (!grille) return 0;

    const casesGrille = getCases(grille);
    const binaires = ["", ""]; // [joueur1, joueur2]
    
    casesGrille.forEach(c => {
        const val = c.getAttribute("data-playable");
        binaires[0] += (val === "playedby1" ? "1" : "0");
        binaires[1] += (val === "playedby2" ? "1" : "0");
    });

    // Vérifie si un joueur a gagné
    let grilleGagnee = 0;
    binaires.forEach((b, j) => {
        if (winning.some(regex => regex.test(b))) {
            grilleGagnee = j + 1;
        }
    });
    
    if (grilleGagnee === 1 || grilleGagnee === 2) {
        console.log(`Grille ${indice} gagnée par le joueur ${grilleGagnee}`);
        setPlayability("grille", indice, `wonby${grilleGagnee}`);
        
        if (ruleMode === "1") {
            grilles.forEach((g, gi) => {
                const cible = getCases(g)[indice];
                if (cible.getAttribute('data-playable') === 'playable') {
                    cible.setAttribute('data-playable', `playedby${joueurActuel}`);
                }
                const etatGrille = g.getAttribute("data-playable");
                if (!["wonby1", "wonby2", "exaequo"].includes(etatGrille)) {
                    console.log("on teste la grille", gi);
                    checkGrille(gi);
                }
            });
        }
    } else if (joueesParGrille(indice) == 9 && grilleGagnee == 0) {
        setPlayability("grille", indice, "exaequo");
        console.log("Grille ", indice, " exaequo");
    }

    return grilleGagnee;
}

function checkWin() {
    const winning = [
        /^111......$/, /^...111...$/, /^......111$/, /^1..1..1..$/,
        /^.1..1..1.$/, /^..1..1..1$/, /^1...1...1$/, /^..1.1.1..$/
    ];
    
    const playability = getGrillesState();
    const { joueur1: binaire1, joueur2: binaire2, playable: jouables } = playability;
    let gagnant = 0;
    
    for (let i = 0; i < winning.length; i++) {
        if (winning[i].test(binaire1) == true) {
            gagnant = 1;
        }
        if (winning[i].test(binaire2) == true) {
            gagnant = 2;
        }
    }
    
    if (gagnant == 0 && jouables !== '000000000') {
        return false;
    }
    
    if (gagnant === 1 || gagnant === 2) {
        console.log(`${gagnant} a gagné`);
        htmlCommentaires.innerHTML = `C'est <span class="player-name player${gagnant}">${noms[gagnant-1]}</span> qui a gagné ! Cliquez sur Rejouer pour commencer une nouvelle partie.`;
    } else if (gagnant == 0 && jouables == '000000000') {
        console.log("fin de partie, égalité");
        htmlCommentaires.innerText = `Égalité, personne n'a gagné ! Cliquez sur Rejouer pour commencer une nouvelle partie.`;
    }
    
    htmlCommentaires.style.display = "block";
    partieEnCours = false;
    afficherBoutonRejouer();
    return true;
}

// ============================================================================
// GESTION DU REDÉMARRAGE
// ============================================================================

document.getElementById("resetBtn").addEventListener("click", () => {
    askAndRestart("Souhaitez-vous vraiment recommencer une nouvelle partie ?");
});

async function askAndRestart(message) {
    const confirmation = await showConfirmModal(message);
    if (!confirmation) {
        console.log("Redémarrage annulé");
        return;
    }
    restartGame();
}

function restartGame() {
    // Réinitialiser les variables de jeu
    joueurActuel = 0;
    grilleActuelle = 150;
    canSelectGrid = 1;
    
    // Réinitialiser les grilles et les cases
    grilles.forEach((grille, i) => {
        setPlayability("grille", i, "playable");
        Array.from(grille.children).forEach((c, j) => {
            setPlayability("case", Array.from(cases).indexOf(c), "playable");
        });
        setHoverGrille(i, "grille");
    });
    
    if (htmlCommentaires) {
        htmlCommentaires.innerHTML = "";
    }
    
    startTurn();
    console.log("Partie réinitialisée !");
}

function afficherBoutonRejouer() {
    const resetBtn = document.getElementById("resetBtn");

    resetBtn.textContent = "Rejouer";
    resetBtn.classList.add("rejouer");

    // Supprime l'ancien event listener
    resetBtn.replaceWith(resetBtn.cloneNode(true));
    const newBtn = document.getElementById("resetBtn");

    newBtn.addEventListener("click", () => {
        restartGame();
        restaurerBoutonReset();
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

    resetBtn.classList.remove("rejouer");

    resetBtn.addEventListener("click", () => {
        document.getElementById("modalOverlay").classList.add("show");
    });
}

// ============================================================================
// MODALE DE CONFIRMATION
// ============================================================================

function showConfirmModal(message) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('modalOverlay');
        const messageEl = document.getElementById('modalMessage');
        const yesBtn = document.getElementById('modalYes');
        const noBtn = document.getElementById('modalNo');
        
        messageEl.textContent = message;
        overlay.classList.add('show');
        
        const handleYes = () => {
            overlay.classList.remove('show');
            yesBtn.removeEventListener('click', handleYes);
            noBtn.removeEventListener('click', handleNo);
            resolve(true);
        };
        
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