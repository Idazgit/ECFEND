// on définit les matchs comme étant un tableau
let matchsTristan = [];

const generateDatesTristan = (array) => {
  const nav = document.querySelector(".nav");
  // Pour chaque élément du tableau, on crée une div avec la date
  array.forEach((element) => {
    const div = document.createElement("div");
    div.classList.add("day");
    div.textContent = element.date;

    // au click génére la section correspondante au clic éffectué
    div.addEventListener("click", () =>
      generateSectionTristan(element.regions)
    );
    nav.appendChild(div);
  });
};
// on nomme les éléments du DOM pour le modal
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");

modal.appendChild(modalContent);

// index qui gère la position dans le carousel
let carouselIndex = 0;

// fonction qui génére le contenu de la modal / carousel
const generateModalContent = (players) => {
  const closeModal = document.createElement("div");
  closeModal.className = "fa-solid fa-xmark";

  // on définit la fermeture du modal et stopPropa pour ne pas cliquer derrière
  closeModal.addEventListener("click", (event) => {
    event.stopPropagation();
    modal.style.display = "none";
    modalContent.innerHTML = "";
  });
  // création de l'image du carousel
  const img = document.createElement("img");
  img.classList.add("carousel");
  img.src = players[carouselIndex];

  // Ajout de la div pour le pseudo
  const playerName = document.createElement("div");
  playerName.classList.add("pseudo-joueur");
  const path = players[carouselIndex];
  const fileName = path.split("/").pop().replace(".png", "");
  playerName.textContent = fileName;

  //bouton précédent du carousel qui enleve -1 au carouselindex
  const previousButton = document.createElement("button");
  previousButton.textContent = "Précédent";
  previousButton.addEventListener("click", () => {
    carouselIndex--;
    if (carouselIndex === -1) carouselIndex = players.length - 1;
    img.src = players[carouselIndex];
    //pseudo qui change en grace a l'index
    const newFileName = players[carouselIndex]
      // on split sur le dernier /
      .split("/")
      // on prend le dernier élément
      .pop()
      //on remplace le .png par vide
      .replace(".png", "");
    playerName.textContent = newFileName;
  });
  //bouton suivant du carousel qui rajoute +1 au carouselindex
  const nextButton = document.createElement("button");
  nextButton.textContent = "Suivant";
  nextButton.addEventListener("click", () => {
    carouselIndex++;
    if (carouselIndex === players.length) carouselIndex = 0;
    img.src = players[carouselIndex];
    //pseudo qui change en grace a l'index
    const newFileName = players[carouselIndex]
      .split("/")
      .pop()
      .replace(".png", "");
    playerName.textContent = newFileName;
  });
  // on append les éléments au modalContent
  modalContent.append(closeModal, img, playerName, previousButton, nextButton);
};
// Fonction pour générer les sections de matchs
const generateSectionTristan = (array) => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  // Pour chaque élément du tableau (régions)
  array.forEach((element) => {
    // Création de la section container
    const section = document.createElement("section");
    section.classList.add("container");
    // Création de la div région avec son nom
    const divRegion = document.createElement("div");
    divRegion.classList.add("region");
    divRegion.textContent = element.region;
    // Création du groupe de matchs
    const groupeMatch = document.createElement("div");
    groupeMatch.classList.add("groupeMatch");
    // Pour chaque match dans la région
    element.matchs.forEach((match) => {
      // Création de la div match
      const divMatch = document.createElement("div");
      divMatch.classList.add("match");

      // Création des éléments du match (logos et score)
      const firstTeam = document.createElement("img");
      firstTeam.src = `./img/Logo/${match.teams[0]}.png`;
      firstTeam.classList.add("logo");

      const score = document.createElement("p");
      score.textContent = match.result;

      const secondTeam = document.createElement("img");
      secondTeam.src = `./img/Logo/${match.teams[1]}.png`;
      secondTeam.classList.add("logo");

      // au click on affichera le modal et carousel en fonction du match

      divMatch.addEventListener("click", () => {
        console.log("Modal ouvert avec les joueurs :", match.players);
        console.log(modal);

        modal.style.display = "flex";
        generateModalContent(match.players);
      });
      // append des éléments du match
      divMatch.append(firstTeam, score, secondTeam);
      groupeMatch.appendChild(divMatch);
    });
    // append de la section complète
    section.append(divRegion, groupeMatch);
    main.appendChild(section);
  });
};
// fetch du Json pour pouvoir récupérer les données et génère les matches de la première date
const fetchDataTristan = () => {
  fetch("./tristan-matchs.json")
    .then((response) => response.json())
    .then((data) => {
      matchsTristan = data;
      generateDatesTristan(matchsTristan);
      generateSectionTristan(matchsTristan[0].regions);
    });
};
fetchDataTristan();

// Sélection du bouton burger et création de la div du menu
const burgerButton = document.querySelector(".burger-button");
const menuContainer = document.createElement("div");

// Configuration de la div du menu
menuContainer.classList.add("menu-container");
menuContainer.style.display = "none";

// Créer le home qui va servir a recharger la page
const home = document.createElement("a");
home.textContent = "Home";
home.classList.add("home");
// Au clic sur Home, on recharge la page
home.addEventListener("click", () => {
  window.location.reload();
});

// Ajout à la div du menu
menuContainer.appendChild(home);
// Ajout du menu au document et after sert a ajouter le menu apres le button
burgerButton.after(menuContainer);

// Gestion du clic sur le burger
burgerButton.addEventListener("click", () => {
  // Si le menu est caché, on l'affiche, sinon on le cache
  if (menuContainer.style.display === "none") {
    menuContainer.style.display = "block";
  } else {
    menuContainer.style.display = "none";
  }
});
