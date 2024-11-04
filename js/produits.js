/**Mardi 22 octobre 2024, date de début*/
async function fetchData() {
    try{
        const reponse = await fetch("produits.json");
        
        if(!reponse.ok)
            throw new Error(`Erreur HTTP: ${reponse.status}`);
        
        const produits = await reponse.json();
        init(produits); //initialisation du code

    }
    catch(erreur){
        console("Impossible de contacter le serveur. "+ erreur);
    }
}
fetchData()

var mesAchats = [];
function init(produits){
    /**Converti produits qui est un objet en tableau cle,produits */
    produitsCleValeur = Object.entries(produits); 
    
    /**Creation d'une section contenant les produits de chaque catégorie */
    produitsCleValeur.forEach(([cle,categorie]) => {
        addSection(cle,categorie);
    });
    let montantAPayer = 0;
    produitsCleValeur.forEach(([cle, categorie]) => {

        const baliseSection = document.querySelector(`section .${cle}`);
        const cardWrapper = document.querySelector(`.${cle}`);
        
        /**element représente les différentes marque de produit de chaque catégorie */
        categorie.forEach(element => {

            const card = cardWrapper.querySelector(`.card[aria-label="${element.id}"]`);
            const span = baliseSection.querySelector(`span[data-select="${element.id}"]`);
            const btnChoisir = baliseSection.querySelector(`[data-id="${element.id}"]`);
            const inputQuantite = card.querySelector(".inputQuantite"); 
            const montant = card.querySelector(".montant");

            let click = true;
            let totalDesAchats = 0;
            /**Calcul du montant total en fonction de la quantité*/
            inputQuantite.addEventListener('input', (event) => {
                let prixArticleSelectionne = calculMontant(inputQuantite.value, parseInt(element.prix));
                let quantite = calculMontant(inputQuantite.value, parseInt(element.prix)) / element.prix;

                if (inputQuantite.value !== "" && parseInt(inputQuantite.value) <= parseInt(element.quantite)) {
                    /** retire le message d'erreur si la condition vrai */
                    card.querySelector(".messageErreur").classList.add('d-none');
                    card.querySelector(".messageErreurExces").classList.add('d-none');
                    montant.value = `${quantite}p|${prixArticleSelectionne}frs`;
                }
                if(parseInt(inputQuantite.value) > parseInt(element.quantite)) { 
                    card.querySelector(".messageErreurExces").classList.remove('d-none');
                }
            });
            
            btnChoisir.addEventListener('click', (event) => {
                let quantite = calculMontant(inputQuantite.value, element.prix) / parseInt(element.prix);
                

                /** Affiche le message d'erreur si la condition vrai */
                if (inputQuantite.value !== '' && parseInt(inputQuantite.value) <= parseInt(element.quantite)) {
                    let addQuantity = parseInt(inputQuantite.value);
                    
                    span.classList.toggle('d-none');
                    btnChoisir.classList.toggle('active');

                    
                    if(click){ //element ajouté

                        mesAchats.push(element);
                        console.log(mesAchats);
                        
                        montantAPayer += calculMontant(inputQuantite.value, parseInt(element.prix));
                        console.log(montantAPayer);
                        card.style.transform ='scale(0.8)';
                        btnChoisir.textContent="Retirer";
                        btnChoisir.classList.replace("btn-primary","btn-danger");
                        click = false ;
    
                    }else{ //element retiré
                        console.log(inputQuantite.value);
                        console.log(addQuantity);
                        
                        // montant.value = `${quantite}p|${prixArticleSelectionne}frs`;
                        //if((addQuantity - parseInt(inputQuantite.value)) !== 0){
      
                            montantAPayer -= calculMontant(inputQuantite.value, parseInt(element.prix));
                            console.log(montantAPayer);
                            card.style.transform ='';
                            btnChoisir.classList.replace("btn-danger","btn-primary");
                            btnChoisir.textContent="Ajouter";
                            const style = document.createElement('style');
                            style.cssText = 
                            `
                                .card{
                                    border-radius: 25px;
                                    background-color: #FFF;
                                    transition:transform 0.3s;
                                }
                                .card:hover{
                                    transform: scale(1.03);
                                    box-shadow: 0 0 20px;
                                }
                            `;
                            document.body.appendChild(style);
                            click = true;
                        //}else{
                            //montantAPayer -= calculMontant(inputQuantite.value, parseInt(element.prix));
                            //console.log(montantAPayer);
                        //}
                    }
                }else{
                    card.querySelector(".messageErreur").classList.remove('d-none');
                }
            });
        });
    })


    /**JS des slides */
    var swiper = new Swiper(".slide-content", {
        slidesPerView: 1,
        spaceBetween: 30,
        slidesPerGroup: 1,
        centeredSlides: true,
        loop: true,
        loopAdditionalSlides:1,
        loopFillGroupWithBlank: true,
        pagination: {
        el: ".swiper-pagination",
        clickable: true,
        },
        navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
        },
        /*effect:'fade',
        fadeEffect:{
            crossFade:true,
        },*/
        /*autoplay:{
            delay:3000,
            pauseOnMouseEnter:true,
            disableOnInteraction:false,
        },*/
    });
}

/**produit ici représente l'objet contenant chaque marque et ses informations */
function addSlideProduct(key,produit){
    /**Récupération de l'élément parent qui contiendra les slides */
    const cardWrapper = document.querySelector(`.${key}`);
    
    const slideProduct = 
    `
        <div class="card swiper-slide" aria-label="${produit.id}">
            <div class="image-content">
                <span class="overlay"></span>

                <div class="card-image">
                    <img src="${produit.image}" alt="" class="card-img">
                </div>
                                
            </div>

            <div class="card-content">
                <label class="cadre bg-transparent form-control rounded-5 border-danger-border-light-subtle px-2">
                    <h2 class="name text-center" style="color:bisque">${produit.nom} <span class="d-none" data-select="${produit.id}"><img src="./images/selectionner.jpg" width="20%" height="20%" style="border-radius:50%"></span></h2>
                    <p class="description">${produit.description}</p>
                    <div class="input-group mb-4 mx-auto" style="width:12em; height:2em">
                        <div class="input-group-prepend gb-secondary shadow"><span class="input-group-text rounded-end-0 fw-bold">Prix</span></div>
                        <input type="text" class="form-control bg-success shadow text-center text-warning fw-bold" value="${produit.prix}" disabled>
                        <div class="input-group-append gb-secondary shadow"><span class="input-group-text rounded-start-0 fw-bolder">FCFA</span></div>
                    </div>
                    <p class="text-danger text-center p-0 m-0 d-none messageErreur" style="font-size:0.8em;font-family:monospace;color:rgb(209, 53, 5) !important">Quelle quantité svp? <span class="fs-5 m-0 p-0 fleche">↓</span></p>
                    <p class="text-danger text-center p-0 m-0 d-none messageErreurExces" style="font-size:0.8em;font-family:monospace;color:rgb(209, 53, 5) !important">Quantité excédé <span class="fs-5 m-0 p-0 fleche">↓</span></p>
                    <div class="input-group mb-3 mx-auto" style="width:12em; height:2em">
                        <input type="number" class="form-control inputQuantite" placeholder="Quantité..." min="1" max="${produit.quantite}">
                        <div class="input-group-append gb-secondary"><span class="input-group-text rounded-start-0">FCFA</span></div>
                    </div>
                    <div class="d-flex justify-content-between mx-auto" style="width:12em;">
                        <button class="btn btn-primary button mb-3 me-2 ms-0 ${produit.id}" data-id="${produit.id}">Ajouter</button>
                        <input type="text" class="form-control mx-0 px-0 total text-center montant fw-bold" style="width:6em; height:2.5em; background-color:bisque; color:rgb(173, 18, 18)" disabled>
                    </div>
                </label>
            </div>
    `;
        
    cardWrapper.innerHTML += slideProduct;
    
}

/**categorie représente l'objet contenant l'ensemble de toutes les marques de chaque catégorie de produits*/
function addSection(cle, categorie){
    const listeProduits = document.querySelector(".listeProduits");
    const baliseSection = document.createElement("section");

    baliseSection.dataset.name = cle;
    baliseSection.classList.add("shadow", "my-5", "mx-0", "py-5");
    baliseSection.innerHTML = 
    `
        <div class="slide-container swiper shadow rounded">
            <div class="slide-content swiper-container">
                <div class="card-wrapper swiper-wrapper ${cle}">
                            
                </div>
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-pagination"></div>
        </div>
        <div class="swiper-pagination"></div>
    `;
    listeProduits.appendChild(baliseSection);

    categorie.forEach(element => {
        addSlideProduct(cle,element);       
    });

    listeProduits.appendChild(baliseSection);

}

function calculMontant(quantite,prix){
    let produit = parseInt(quantite)*parseInt(prix);
    return produit;
}

function navbarDisplay() {
    const navbar = document.querySelector(".navbar");
    let prevPosition = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentPosition = window.scrollY;

        if (currentPosition < prevPosition) {
            navbar.style.top = '0';
        }else{
            navbar.style.top = '-50px';
        }
        prevPosition = currentPosition;
    });
}

function dansMesAchats(mesAchats){
    const listeArticles = document.getElementById('mesArticles');
    mesAchats.forEach(article => {
        
    })
}
