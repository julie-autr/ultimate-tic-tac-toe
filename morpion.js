const grilles=document.querySelectorAll('[class^="grille"]');
const lignes=document.querySelectorAll('[class^="ligne"]');
const cases=document.querySelectorAll('.case');
const megagrille=document.querySelector('.megagrille')

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

let noms=[];
var joueuractuel=0;


// pour que le bouton "Valider" ne soit pas cliquable si les noms ne sont pas renseignés
function manage() {
    var txt1 = document.getElementById("in1").value;
    var txt2 = document.getElementById("in2").value;
    var bt = document.getElementById('bouton');
    if (txt1!=''&&txt2!='') {
        bt.disabled = false;  
    }
    else {
        bt.disabled = false; //RECHANGER EN TRUE APRES
    }
};

// pour récupérer les noms des deux joueurs, déterminer qui commence
function getValue() {
    var nom1 = document.getElementById("in1").value;
    var nom2 = document.getElementById("in2").value;
    console.log(nom1,nom2); noms.push(nom1); noms.push(nom2);
    document.getElementById("toDelete").style.display='none';
    let nb=Math.random();
    if (nb>0.5){document.getElementById("quicommence").innerText=`C'est ${noms[0]} qui commence !`;joueuractuel=1;document.getElementsByClassName("joueur1")[0].style.backgroundColor='#AFA4CE'}
    else{document.getElementById("quicommence").innerText=`C'est ${noms[1]} qui commence !`;joueuractuel=2;document.getElementsByClassName("joueur2")[0].style.backgroundColor='#AFA4CE'};
    document.getElementById("joueur").innerHTML
    document.getElementsByClassName("megagrille")[0].style.visibility='visible';
    document.getElementById("joueur").style.visibility='visible';
    document.getElementsByClassName("joueur1")[0].innerText=noms[0]; document.getElementsByClassName("joueur2")[0].innerText=noms[1];

};


var grillessurvol=[0,0,0,0,0,0,0,0,0];

// pour griser toutes les cases sauf celle sur laquelle on a cliqué
function griser(index){
    for (var j=0;j<grilles.length;j++){
        if (j!=index){grilles[j].style.backgroundColor="rgba(220,220,220,0.5)";grillessurvol[j]=0;}
        else{grilles[j].style.backgroundColor="rgb(255,255,255)";grillessurvol[j]=1;}
    };
};

var coup1=0; // pour ne pouvoir utiliser 'griser' en cliquant sur une grille uniquement si ça n'a pas encore été fait

const Arraygrilles=Array.from(grilles);


for (var i=0;i<grilles.length;i++){
    grilles[i].addEventListener('click',function(event){
        const target = event.target;
        var parent=target.parentElement;
        var indice=Arraygrilles.indexOf(parent);
        //console.log("grille n°",indice)
        if (coup1==0){griser(indice);
            grillessurvol[indice]=1;
            document.getElementsByClassName("texte")[0].removeChild(document.getElementById("quicommence"))
            coup(indice);
        }
        
        coup1+=1;
    })
};

function checkgrille(g){ //g indice de la grille qu'on teste
    const winning=[/^111......$/,/^...111...$/,/^......111$/,/^1..1..1..$/,/^.1..1..1.$/,/^..1..1..1$/,/^1...1...1$/,/^..1.1.1..$/];
    var binairejouees1=casesjouees1[g].join('');
    var binairejouees2=casesjouees2[g].join('');
    var grillegagnée=0;
    for (var i=0;i<winning.length;i++){
        if (winning[i].test(binairejouees1)==true){grillegagnée=1}
        if (winning[i].test(binairejouees2)==true){grillegagnée=2}
    }
    var enfants=grilles[g].children;
    if (grillegagnée==1){
        grilles[g].style.backgroundColor=='#80586D';
        grillesjouables[g]=1;
        return grillegagnée
    }
    else if (grillegagnée==2){
        grilles[g].style.backgroundColor=='#659ABD';
        grillesjouables[g]=1;
        return grillegagnée
    }
    else {return grillegagnée}
}

var grillejouables=[0,0,0,0,0,0,0,0,0]
var casesjouees1=[[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]];
var casesjouees2=[[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]];

function coup(g){ //g est l'indice de la grille dans laquelle on se situe, qui a déjà été grisée
    var casesjouables=grilles[g].children // tableau des cases enfants de notre grille
    var Arraycasesjouables=Array.from(casesjouables);

    for (var i=0;i<casesjouables.length;i++){
        
        casesjouables[i].onmouseover = function(){if (grillessurvol[g]==1&&this.style.backgroundColor!='rgb(128, 88, 109)'&&this.style.backgroundColor!='rgb(101, 154, 189)'){this.style.backgroundColor = "rgba(220,220,220,0.5)";}};
        casesjouables[i].onmouseout = function(){if (grillessurvol[g]==1&&this.style.backgroundColor!='rgb(128, 88, 109)'&&this.style.backgroundColor!='rgb(101, 154, 189)'){this.style.backgroundColor = "rgba(255,255,255,0)";}};
        
            casesjouables[i].addEventListener('click',function(event){
                event.stopPropagation();
                const target = event.target;
                if (grillessurvol[g]==1&&target.style.backgroundColor!='rgb(128, 88, 109)'&&target.style.backgroundColor!='rgb(101, 154, 189)'){
                    var indice=Arraycasesjouables.indexOf(target);
                    casesjouables[indice].style.backgroundColor="rgba(255,255,255,0)";
                    //console.log("case n°",indice)
                    griser(indice);

                    if (joueuractuel==1){joueuractuel=2; 
                    casesjouables[indice].style.backgroundColor='#80586D';
                    document.getElementsByClassName("joueur2")[0].style.backgroundColor='#AFA4CE';
                    document.getElementsByClassName("joueur1")[0].style.backgroundColor='rgb(255,255,255,0)';
                    casesjouees1[g][indice]=1;}
                    else if(joueuractuel==2){joueuractuel=1; 
                    casesjouables[indice].style.backgroundColor='#659ABD';
                    document.getElementsByClassName("joueur1")[0].style.backgroundColor='#AFA4CE';
                    document.getElementsByClassName("joueur2")[0].style.backgroundColor='rgb(255,255,255,0)';
                    casesjouees2[g][indice]=1;}
                    else console.log("numéro de joueur pas logique");

                    if (checkgrille(g)==0){coup(indice)}
                    else if (checkgrille(g)==1){}
                    else if (checkgrille(g)==2){}
                } else console.log('pas le droit de cliquer ici')
            
                
            });

    }
};

