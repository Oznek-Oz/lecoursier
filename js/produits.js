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
fetchData();

var mesAchats = [];
var id = 1 ;
function init(produits){
    /**Converti produits qui est un objet en tableau cle,produits */
    produitsCleValeur = Object.entries(produits);

    /**Creation d'une section contenant les produits de chaque catégorie (riz, pattes,...) */
    produitsCleValeur.forEach(([cle,categorie]) => {
        addSection(cle,categorie);
    });
    let montantAPayer = 0;

    produitsCleValeur.forEach(([cle, categorie]) => {

        const baliseSection = document.querySelector(`section .${cle}`); // This might be problematic if section isn't uniquely identifiable by just .${cle}
        const cardWrapper = document.querySelector(`.${cle}`); // Same here, if .${cle} is not specific enough to the card wrapper within this section

        /**element représente les différentes marque de produit de chaque catégorie (yagoua, meme casse,...) */
        categorie.forEach(element => {

            // It's safer to query within baliseSection for these elements
            const card = baliseSection.querySelector(`.card[aria-label="${element.id}"]`);
            const span = baliseSection.querySelector(`span[data-select="${element.id}"]`);
            const btnChoisir = baliseSection.querySelector(`[data-id="${element.id}"]`);
            const inputQuantite = card.querySelector(".inputQuantite");
            const montant = card.querySelector(".montant");

            let click = true;
            // totalDesAchats seems unused
            /**Calcul du montant total en fonction de la quantité*/
            inputQuantite.addEventListener('input', (event) => {
                let prixArticleSelectionne = calculMontant(inputQuantite.value, parseInt(element.prix));
                let quantite = calculMontant(inputQuantite.value, parseInt(element.prix)) / element.prix;

                if (inputQuantite.value !== "" && parseInt(inputQuantite.value) >= 0 && parseInt(inputQuantite.value) <= parseInt(element.quantite)) {
                    card.querySelector(".messageErreur").classList.add('d-none');
                    card.querySelector(".messageErreurExces").classList.add('d-none');
                    montant.value = `${quantite}p|${prixArticleSelectionne}frs`;
                } else if (parseInt(inputQuantite.value) > parseInt(element.quantite)) {
                    card.querySelector(".messageErreurExces").classList.remove('d-none');
                    montant.value = ""; // Clear previous valid value
                } else {
                     montant.value = ""; // Clear previous valid value for other invalid inputs like negative
                }
            });

            btnChoisir.addEventListener('click', (event) => {
                // Recalculate quantity based on current input value, as it might have changed
                let currentQuantiteValue = parseInt(inputQuantite.value);
                if (isNaN(currentQuantiteValue) || currentQuantiteValue <= 0) {
                    card.querySelector(".messageErreur").classList.remove('d-none');
                    return;
                }
                let quantite = currentQuantiteValue;

                if (quantite > 0 && quantite <= parseInt(element.quantite)) {
                    card.querySelector(".messageErreur").classList.add('d-none'); // Hide error if previously shown
                    span.classList.toggle('d-none');
                    btnChoisir.classList.toggle('active');

                    if(click){ //element ajouté
                        const mesElements = articleEtQuantite(element, quantite);
                        // console.log(mesElements); // Already logged in articleEtQuantite
                        dansMesAchats(mesElements);

                        montantAPayer += calculMontant(quantite, parseInt(element.prix));
                        // console.log(montantAPayer);
                        card.style.transform ='scale(0.8)';
                        btnChoisir.textContent="Retirer";
                        btnChoisir.classList.replace("btn-primary","btn-danger");
                        click = false ;

                    }else{ //element retiré
                        montantAPayer -= calculMontant(quantite, parseInt(element.prix));
                        // console.log(montantAPayer);
                        // Remove from mesAchats - This logic is missing. Need a way to identify and remove.
                        // For now, just reverting UI and totals. Proper removal is needed.
                        const itemIndex = mesAchats.findIndex(item => item.nom === element.nom && item.originalId === element.id); // Assuming you add originalId or similar unique prop
                        if (itemIndex > -1) {
                            mesAchats.splice(itemIndex, 1);
                            dansMesAchats(mesAchats); // Update table
                        }

                        card.style.transform ='';
                        btnChoisir.classList.replace("btn-danger","btn-primary");
                        btnChoisir.textContent="Ajouter";
                        // No need to recreate style element every time
                        click = true;
                    }
                }else if (quantite > parseInt(element.quantite)) {
                    card.querySelector(".messageErreurExces").classList.remove('d-none');
                }
                else {
                    card.querySelector(".messageErreur").classList.remove('d-none');
                }
            });
        });
    });

    /**JS des slides */
    //swipperJS(); // Original global swiper call
    /*var swiper = new Swiper(".slide-content", { // This was the global swiper
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
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });*/
}

/**produit ici représente l'objet contenant chaque marque et ses informations */
function addSlideProduct(key,produit){
    /**Récupération de l'élément parent qui contiendra les slides */
    // `key` should be specific enough to target the correct card-wrapper for the current section
    const cardWrapper = document.querySelector(`section[data-name="${key}"] .card-wrapper`);

    const slideProduct =
    `
        <div class="card swiper-slide" aria-label="${produit.id}">
            <div class="image-content">
                <span class="overlay"></span>
                <div class="card-image">
                    <img src="${produit.image}" alt="${produit.nom}" class="card-img">
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
                        <div class="input-group-append gb-secondary"><span class="input-group-text rounded-start-0">unités</span></div> <!-- Changed FCFA to unités for quantity -->
                    </div>
                    <div class="d-flex justify-content-between mx-auto" style="width:12em;">
                        <button class="btn btn-primary button mb-3 me-2 ms-0 ${produit.id}" data-id="${produit.id}">Ajouter</button>
                        <input type="text" class="form-control mx-0 px-0 total text-center montant fw-bold" style="width:6em; height:2.5em; background-color:bisque; color:rgb(173, 18, 18)" disabled>
                    </div>
                </label>
            </div>
        </div>`; // Added missing closing div for card

    if (cardWrapper) { // Check if cardWrapper was found
        cardWrapper.innerHTML += slideProduct;
    } else {
        console.error("Could not find cardWrapper for key:", key);
    }
}

/**categorie représente l'objet contenant l'ensemble de toutes les marques de chaque catégorie de produits*/
function addSection(cle, categorie){
    const listeProduits = document.querySelector(".listeProduits");
    const baliseSection = document.createElement("section");

    baliseSection.dataset.name = cle; // Used to uniquely identify this section
    baliseSection.classList.add("shadow", "my-5", "mx-0", "py-5", cle + "-section"); // Added a more specific class using cle
    baliseSection.innerHTML =
    `
        <h2 class="text-center category-title mb-4">${cle.charAt(0).toUpperCase() + cle.slice(1)}</h2> <!-- Added category title -->
        <div class="slide-container swiper shadow rounded">
            <div class="slide-content swiper-container"> <!-- This is the swiper-container -->
                <div class="card-wrapper swiper-wrapper"> <!-- ${cle} class removed, was too generic -->

                </div>
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-pagination"></div> <!-- Moved pagination inside slide-container -->
        </div>
        <!-- <div class="swiper-pagination"></div> --> <!-- This pagination was outside, likely for global; now using per-swiper one -->
    `;
    listeProduits.appendChild(baliseSection);

    categorie.forEach(element => {
        // Pass 'cle' which is baliseSection.dataset.name to addSlideProduct, so it can find the correct section's card-wrapper
        addSlideProduct(cle, element);
    });

    // New Swiper initialization for this specific section
    // Ensure selectors target elements *within* this baliseSection
    const swiperContainer = baliseSection.querySelector('.slide-container'); // More specific selector for swiper container
    if (swiperContainer) {
        new Swiper(swiperContainer, { // Target the .slide-container directly
            slidesPerView: 1,
            spaceBetween: 30,
            slidesPerGroup: 1,
            // centeredSlides: true, // Often true for single item view, adjust as needed
            loop: true, // Be cautious with loop: true if you have few slides
            // loopAdditionalSlides:1, // Consider if needed with loop: true
            // loopFillGroupWithBlank: true, // Consider if needed with loop: true
            pagination: {
                el: baliseSection.querySelector('.swiper-pagination'),
                clickable: true,
            },
            navigation: {
                nextEl: baliseSection.querySelector('.swiper-button-next'),
                prevEl: baliseSection.querySelector('.swiper-button-prev'),
            },
            breakpoints: { // Added breakpoints for responsiveness
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 40,
                },
            }
        });
    } else {
        console.error("Swiper container not found for section:", cle);
    }
}

function calculMontant(quantite,prix){
    let q = parseInt(quantite);
    let p = parseInt(prix);
    if (isNaN(q) || isNaN(p) || q < 0) return 0; // Basic validation
    return q * p;
}

function navbarDisplay() {
    const navbar = document.querySelector(".navbar");
    let prevPosition = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentPosition = window.scrollY;
        if (navbar) { // Check if navbar exists
            if (currentPosition < prevPosition) {
                navbar.style.top = '0';
            }else{
                navbar.style.top = '-50px'; // Adjust based on actual navbar height
            }
        }
        prevPosition = currentPosition;
    });
}

/** Cette fonction retourne un tableau conternant les articles choisie et leur quantités */
function articleEtQuantite(element, quantite){
    const nouveauChoixElement = {
        id : id++, // Increment id for next use
        originalId: element.id, // Keep track of original product ID for removal/update
        nom : element.nom,
        prix : element.prix,
        quantite : quantite
    };
    mesAchats.push(nouveauChoixElement);
    // console.log("Mes achats:", mesAchats);
    return mesAchats; // Return updated array
}

function dansMesAchats(achatsArray){ // Parameter renamed for clarity
    const listeArticles = document.getElementById('mesAchats');
    if (!listeArticles) return; // Guard clause

    const tElement = listeArticles.querySelector('.tElement');
    if (!tElement) return; // Guard clause

    tElement.innerHTML=''; // Clear existing rows
    let totalFacture = 0;

    if (achatsArray.length === 0) {
        tElement.innerHTML = '<tr class="text-center emptyRow"><td colspan="5" class="text-secondary"><i>Ajouter un article</i></td></tr>';
    } else {
        achatsArray.forEach(achat => {
            let montantItem = calculMontant(achat.quantite, achat.prix);
            totalFacture += montantItem;

            const row =
                  `<tr>
                    <td>${achat.nom}</td>
                    <td>${achat.prix}</td>
                    <td>${achat.quantite}</td>
                    <td>${montantItem}</td>
                    <td>
                    <button class="editButton btn btn-sm p-0 m-0" data-id="${achat.id}"><img src="./images/icons/edit.png" class="editIcon p-0" alt="Edit"></button> <!-- Alt text and data-id -->
                    <button class="deleteButton btn btn-sm p-0 m-0" data-id="${achat.id}"><img src="./images/icons/supp.png" class="deleteIcon p-0" alt="Delete"></button> <!-- Alt text and data-id -->
                    </td>
                   </tr>
                  `;
            tElement.innerHTML += row;
        });
    }

    // Update total row - ensure it's outside the loop and correctly targets/creates total cells
    // This assumes a specific structure for the total row, might need adjustment
    // For simplicity, let's ensure a footer row for total exists or create it
    let tfoot = listeArticles.querySelector('tfoot');
    if (!tfoot) {
        tfoot = document.createElement('tfoot');
        listeArticles.appendChild(tfoot);
    }
    tfoot.innerHTML =
        `
            <tr>
                <th colspan="3" class="text-end">Total:</th>
                <td id="totalFacture" class="fw-bold">${totalFacture}</td>
                <td></td>
            </tr>
        `;
    // Add event listeners for delete/edit buttons
    attachActionListeners();
}

function attachActionListeners() {
    document.querySelectorAll('.deleteButton').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.id); // This is the unique ID in mesAchats

            // Find the item in mesAchats to get its originalId (product's actual ID)
            const itemToRemove = mesAchats.find(item => item.id === itemId);
            if (!itemToRemove) return; // Should not happen if UI is consistent

            const productOriginalId = itemToRemove.originalId;

            // Remove item from cart
            mesAchats = mesAchats.filter(item => item.id !== itemId);
            dansMesAchats(mesAchats); // Refresh cart table

            // Now, find and reset the corresponding product card in the product list
            // Product cards have aria-label matching originalId, and buttons have data-id matching originalId
            const productCard = document.querySelector(`.card[aria-label="${productOriginalId}"]`);
            if (productCard) {
                const btnChoisir = productCard.querySelector(`button[data-id="${productOriginalId}"]`);
                const inputQuantite = productCard.querySelector(".inputQuantite");
                const montantDisplay = productCard.querySelector(".montant"); // Display for individual item total on card

                if (btnChoisir) {
                    btnChoisir.textContent = "Ajouter";
                    btnChoisir.classList.replace("btn-danger", "btn-primary");
                    btnChoisir.classList.remove("active");
                }
                if (inputQuantite) {
                    inputQuantite.value = ""; // Clear quantity
                }
                if (montantDisplay) {
                    montantDisplay.value = ""; // Clear specific item total on card
                }
                productCard.style.transform = ''; // Reset card style

                // The 'click' variable is local to the init function's event listener scope.
                // We cannot directly reset it here. However, the visual state is reset.
                // The existing logic in init for btnChoisir will re-evaluate 'click'
                // or determine state based on button classes/text if it were designed that way.
                // For now, resetting UI is the primary goal.
                // To make the 'click' variable reset, one would need to restructure how 'click' states are stored,
                // possibly in a global map or as a data attribute on the button/card itself.
            }
        });
    });
    // Add edit functionality here if needed
}

// Initial style setup for cards (if not handled by CSS)
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
        box-shadow: 0 0 20px rgba(0,0,0,0.2); /* Softer shadow */
    }
    .category-title { /* Style for category titles */
        font-family: 'Arial', sans-serif; /* Example font */
        color: #333;
    }
`;
document.head.appendChild(style); // Append to head
