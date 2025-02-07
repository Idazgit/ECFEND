// on définit les matchs comme étant un tableau
let matchsDylan = [];

const generateDatesDylan = (array) => {
  const nav = document.querySelector(".nav");
  array.forEach((element) => {
    const div = document.createElement("div");
    div.classList.add("day");
    div.textContent = element.date;
    div.addEventListener("click", () => generateSectionDylan(element.regions));
    nav.appendChild(div);
  });
};
// on nomme les éléments du DOM
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
// on définit le carouselindex à 0
let carouselIndex = 0;

const generateModalContent = (players) => {
  console.log("Avant suppression, modal-content :", modalContent.innerHTML);
  modalContent.innerHTML = "";
  const img = document.querySelector(".carousel");
  console.log("salut", img);

  img.src = players[carouselIndex];
  //bouton précédent du carousel qui enleve -1 au carouselindex
  const previousButton = document.createElement("button");
  previousButton.textContent = "Précédent";
  previousButton.addEventListener("click", () => {
    carouselIndex--;
    if (carouselIndex === -1) carouselIndex = players.length - 1;
    img.src = players[carouselIndex];
  });
  //bouton suivant du carousel qui rajoute +1 au carouselindex
  const nextButton = document.createElement("button");
  nextButton.textContent = "Suivant";
  nextButton.addEventListener("click", () => {
    carouselIndex++;
    if (carouselIndex === players.length) carouselIndex = 0;
    img.src = players[carouselIndex];
  });
  // on append les deux boutons au modalContent
  modalContent.append(previousButton, nextButton);
};
// on définit la fermeture du modal et stopPropa pour ne pas cliquer derrière
const closeModal = document.querySelector(".closeModal");
closeModal.addEventListener("click", () => {
  event.stopPropagation();
  modal.innerHTML = "";
});

const generateSectionDylan = (array) => {
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
const fetchDataDylan = () => {
  fetch("./dylan-matchs.json")
    .then((response) => response.json())
    .then((data) => {
      matchsDylan = data;
      generateDatesDylan(matchsDylan);
      generateSectionDylan(matchsDylan[0].regions);
    });
};
fetchDataDylan();
