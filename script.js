// on définit les matchs comme étant un tableau
let matchsTristan = [];

const generateDatesTristan = (array) => {
  const nav = document.querySelector(".nav");
  array.forEach((element) => {
    const div = document.createElement("div");
    div.classList.add("day");
    div.textContent = element.date;
    div.addEventListener("click", () =>
      generateSectionTristan(element.regions)
    );
    nav.appendChild(div);
  });
};
// on nomme les éléments du DOM
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");

modal.appendChild(modalContent);
// on définit le carouselindex à 0
let carouselIndex = 0;

const generateModalContent = (players) => {
  const closeModal = document.createElement("div");
  closeModal.className = "fa-solid fa-xmark";

  // on définit la fermeture du modal et stopPropa pour ne pas cliquer derrière
  closeModal.addEventListener("click", (event) => {
    event.stopPropagation();
    modal.style.display = "none";
    modalContent.innerHTML = "";
  });

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
      .split("/")
      .pop()
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
  // on append les deux boutons au modalContent
  modalContent.append(closeModal, img, playerName, previousButton, nextButton);
};

const generateSectionTristan = (array) => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  array.forEach((element) => {
    const section = document.createElement("section");
    section.classList.add("container");

    const divRegion = document.createElement("div");
    divRegion.classList.add("region");
    divRegion.textContent = element.region;

    const groupeMatch = document.createElement("div");
    groupeMatch.classList.add("groupeMatch");

    element.matchs.forEach((match) => {
      const divMatch = document.createElement("div");
      divMatch.classList.add("match");

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

      divMatch.append(firstTeam, score, secondTeam);
      groupeMatch.appendChild(divMatch);
    });

    section.append(divRegion, groupeMatch);
    main.appendChild(section);
  });
};
// fetch du Json pour pouvoir récupérer les données et appele la
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
