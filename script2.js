let joueurActuel = "X";
let joueurs = ["", ""];
let grilleSuivante = null; // index (0-8) ou null si choix libre
let grillesBloquees = Array(9).fill(false); // true = grille gagnée/bloquée

// Utilitaires
function getGrilles() {
  return Array.from(document.querySelectorAll('[class^=grille]'));
}
function getCases(grille) {
  return Array.from(grille.querySelectorAll('.case'));
}

// Gestion formulaire joueurs
function manage() {
  const in1 = document.getElementById("in1").value.trim();
  const in2 = document.getElementById("in2").value.trim();
  document.getElementById("bouton").disabled = !(in1 && in2);
}
function getValue() {
  joueurs[0] = document.getElementById("in1").value.trim() || "Joueur 1";
  joueurs[1] = document.getElementById("in2").value.trim() || "Joueur 2";

  document.querySelector(".joueur1").textContent = `${joueurs[0]} (X)`;
  document.querySelector(".joueur2").textContent = `${joueurs[1]} (O)`;
  document.getElementById("joueur").style.visibility = "visible";
  document.querySelector(".megagrille").style.visibility = "visible";

  document.getElementById("toDelete").remove();

  majCommentaire(`${joueurs[0]} commence !`);

  choisirGrillePossible([]); // au début, libre choix
}

// Commentaire
function majCommentaire(txt) {
  document.getElementById("commentaire").textContent = txt;
}

// Activation des hover
function activerGrille(index) {
  getGrilles().forEach((g, i) => {
    if (i === index && !grillesBloquees[i]) {
      g.setAttribute("data-hover", "case");
    } else {
      g.setAttribute("data-hover", "none");
    }
  });
}
function choisirGrillePossible(bloquees) {
  getGrilles().forEach((g, i) => {
    if (bloquees.includes(i) || grillesBloquees[i]) {
      g.setAttribute("data-hover", "none");
    } else {
      g.setAttribute("data-hover", "grille");
    }
  });
}

// Tour de jeu
function jouerCase(caseEl, grilleIndex, caseIndex) {
  if (caseEl.classList.contains("jouee")) return;

  caseEl.textContent = joueurActuel;
  caseEl.classList.add("jouee");

  // TODO: ici tu pourrais vérifier victoire dans la petite grille
  // Pour l'instant : simplifié, la grille se bloque si toutes les cases sont jouées
  if (getCases(getGrilles()[grilleIndex]).every(c => c.classList.contains("jouee"))) {
    grillesBloquees[grilleIndex] = true;
  }

  // Déterminer la prochaine grille
  grilleSuivante = caseIndex;

  if (grillesBloquees[grilleSuivante]) {
    grilleSuivante = null; // libre choix
    choisirGrillePossible([]);
  } else {
    activerGrille(grilleSuivante);
  }

  // Changer de joueur
  joueurActuel = joueurActuel === "X" ? "O" : "X";
  majCommentaire(`Au tour de ${joueurActuel === "X" ? joueurs[0] : joueurs[1]}`);
}

// Initialisation écouteurs
function initJeu() {
  getGrilles().forEach((grille, gi) => {
    getCases(grille).forEach((c, ci) => {
      c.addEventListener("click", () => {
        const hoverMode = grille.getAttribute("data-hover");
        if (hoverMode === "case" || hoverMode === "grille") {
          jouerCase(c, gi, ci);
        }
      });
    });
  });
}

// Lancer
initJeu();