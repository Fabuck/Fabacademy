const API_URL = "http://146.59.242.125:3009/promos/";
const API_KEY = "6bd2ed35-c55b-4eab-b9d7-fcada75d5d80";
const promos = document.querySelector(".promos");
const modal = document.querySelector(".modal-overlay");

///////////CLICK  COLLAPSE HEADER//////////////////////
function toggleHeader() {
  document.querySelector("header").classList.toggle("collapsed");
}

///////////////// GET PROMO DATA /////////////////////////////

async function getPromo() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`, // Ajout du token d'accès
        "Content-Type": "application/json", // Optionnel, mais recommandé
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json(); // Convertir la réponse en JSON
    console.log(data);
    displayPromo(data);
    return data; // Retourner les données
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    throw error; // Relancer l'erreur pour gestion ultérieure
  }
}

///////////////////AFFICHE LES PROMOS/////////////////////////////////////////////////////
function displayPromo(data) {
  data.forEach((element) => {
    ////////////Creation contenaire et nom promo//////////////////////////////////////
    let promo = document.createElement("article");
    let nomDiv = document.createElement("div");
    let nomPromo = document.createElement("h2");
    nomPromo.textContent = element.name;
    nomDiv.appendChild(nomPromo);
    promo.appendChild(nomDiv);
    promos.appendChild(promo);

    let promoElevesDiv = document.createElement("div");
    let elevesDiv = document.createElement("div");
    let eleves = document.createElement("div");
    let nbrEleves = document.createElement("div");
    let iconEleves = document.createElement("img");
    iconEleves.src = "../img/student.png";
    elevesDiv.classList.add("elevesDiv");
    eleves.textContent = "Nombre d'élèves :  ";
    nbrEleves.textContent = element.students.length;
    elevesDiv.appendChild(iconEleves);
    elevesDiv.appendChild(eleves);
    elevesDiv.appendChild(nbrEleves);
    promoElevesDiv.appendChild(elevesDiv);
    promo.appendChild(promoElevesDiv);

    ////////////Creation date //////////////////////////////////////
    let datesDiv = document.createElement("div");
    let dateDiv = document.createElement("div");
    let dateStartDiv = document.createElement("div");
    let dateEndDiv = document.createElement("div");
    let dateIcon = document.createElement("img");
    let dateStart = document.createElement("div");
    let dateEnd = document.createElement("div");
    let textStart = document.createElement("div");
    let textEnd = document.createElement("div");
    let iconDiv = document.createElement("div");
    dateIcon.src = "../img/calendar.png";
    dateIcon.classList.add("calendar");
    dateDiv.classList.add("date");
    dateStart.textContent = new Date(element.startDate)
      .toISOString()
      .split("T")[0];
    dateEnd.textContent = new Date(element.endDate).toISOString().split("T")[0];
    textStart.textContent = "Date de début";
    textEnd.textContent = "Date de fin";

    // dateStartDiv.appendChild(dateIcon);
    dateStartDiv.appendChild(textStart);
    dateStartDiv.appendChild(dateStart);

    // dateEndDiv.appendChild(dateIcon);
    dateEndDiv.appendChild(textEnd);
    dateEndDiv.appendChild(dateEnd);
    iconDiv.appendChild(dateIcon);
    dateDiv.appendChild(iconDiv);
    dateDiv.appendChild(dateStartDiv);
    dateDiv.appendChild(dateEndDiv);

    promo.appendChild(dateDiv);

    //////////////////////////Ajout boutons ////////////////////////////////////////
    let btnDiv = document.createElement("div");
    let btnSupprimer = document.createElement("button");
    let btnModifier = document.createElement("button");
    let btnDetails = document.createElement("button");
    btnDiv.classList.add("btnDiv");
    btnSupprimer.classList.add("supprimer");
    btnModifier.classList.add("modifier");
    btnDetails.classList.add("details");
    btnSupprimer.textContent = "Supprimer";
    btnModifier.textContent = "Modifier";
    btnDetails.textContent = "Details";

    btnDiv.appendChild(btnSupprimer);
    btnDiv.appendChild(btnModifier);
    btnDiv.appendChild(btnDetails);

    promo.appendChild(btnDiv);

    btnSupprimer.addEventListener("click", () => {
      deletePromo(element);
    });
  });
}

/////////////////Fonction supprimer promo //////////////////////////////////

async function deletePromo(element) {
  try {
    const response = await fetch(`${API_URL}${element._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log(`Promotion avec l'ID ${element._id} supprimée avec succès.`);
    location.reload();
    return true;
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de la promotion avec l'ID ${element._id} :`,
      error
    );
    throw error;
  }
}

/////////////////////Gere la modale d'ajout//////////////////////////////////
async function addPromo() {
  const bodyData = {
    name: document.querySelector("#nom").value,
    startDate: document.querySelector("#date-debut").value,
    endDate: document.querySelector("#date-fin").value,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de la promotion :", error);
    throw error;
  }
  modal.classList.add("hidden");
  location.reload();
}

////////////////Fait apparaitre la modale d'ajout////////////////////////////////
function btnAjouter() {
  modal.classList.remove("hidden");
}

// Fonction pour fermer la modale si l'on clique en dehors d'elle///////////////////////
window.onclick = function (event) {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
};

getPromo();
