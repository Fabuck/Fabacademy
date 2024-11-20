const API_URL = "http://146.59.242.125:3009/promos/";
const API_KEY = "6bd2ed35-c55b-4eab-b9d7-fcada75d5d80";
const modal = document.querySelector(".modal-overlay");

const params = new URLSearchParams(window.location.search);
const data = {
  name: params.get("name"),
  startDate: params.get("startDate"),
  endDate: params.get("endDate"),
  id: params.get("id"),
};
console.log(data);

///////////////Get promo info ///////////////////

async function getPromo() {
  try {
    const response = await fetch(API_URL + data.id, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`, // Ajout du token d'accès
        "Content-Type": "application/json", // Optionnel, mais recommandé
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const datum = await response.json(); // Convertir la réponse en JSON
    console.log(datum);
    displayPromo(datum);
    return datum; // Retourner les données
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    throw error; // Relancer l'erreur pour gestion ultérieure
  }
}

///////////////////////Display promo/////////////////////////////
function displayPromo(data) {
  document.querySelector(".nomPromo").textContent = data.name;
  document.querySelector(".start").textContent = new Date(data.startDate)
    .toISOString()
    .split("T")[0];
  document.querySelector(".end").textContent = new Date(data.endDate)
    .toISOString()
    .split("T")[0];
  document.querySelector(".nbr").textContent = data.students.length;
}

////////////////////Get eleves //////////////////

async function getPromoById(promo) {
  try {
    const response = await fetch(API_URL + promo.id, {
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
    await displayEleves(data);

    return data; // Retourner les données
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    throw error; // Relancer l'erreur pour gestion ultérieure
  }
}

////////////////////Display eleves //////////////////

async function displayEleves(promo) {
  promo.students.sort((a, b) => a.firstName.localeCompare(b.firstName));
  promo.students.forEach((element) => {
    let divEleve = document.createElement("div");
    let divNom = document.createElement("div");
    let divPrenom = document.createElement("div");
    let divAge = document.createElement("div");
    let divPen = document.createElement("div");
    let divBin = document.createElement("div");
    let penIcon = document.createElement("img");
    let binIcon = document.createElement("img");

    divEleve.classList.add("eleve");

    divNom.textContent = element.firstName;
    divPrenom.textContent = element.lastName;
    divAge.textContent = element.age;
    penIcon.src = "../img/pen.png";
    binIcon.src = "../img/bin.png";
    divPen.appendChild(penIcon);
    divBin.appendChild(binIcon);

    divEleve.appendChild(divNom);
    divEleve.appendChild(divPrenom);
    divEleve.appendChild(divAge);
    divEleve.appendChild(divPen);
    divEleve.appendChild(divBin);

    document.querySelector(".listeEleves").appendChild(divEleve);

    binIcon.addEventListener("click", () => {
      deleteEleve(element);
    });

    penIcon.addEventListener("click", () => {
      let modifierNom = document.createElement("input");
      let modifierPrenom = document.createElement("input");
      let modifierAge = document.createElement("input");
      let btnValider = document.createElement("button");

      btnValider.textContent = "Valider";
      btnValider.classList.add("valider");
      modifierNom.classList.add("modifierNom");
      modifierNom.type = "text";
      modifierPrenom.type = "text";
      modifierAge.type = "number";
      modifierNom.value = divNom.textContent;
      modifierPrenom.value = divPrenom.textContent;
      modifierAge.value = divAge.textContent;

      divNom.replaceWith(modifierNom);
      divPrenom.replaceWith(modifierPrenom);
      divAge.replaceWith(modifierAge);
      divPen.replaceWith(btnValider);

      btnValider.addEventListener("click", async () => {
        await modifyEleve(element, modifierNom, modifierPrenom, modifierAge);
        console.log(data);
        document.querySelectorAll(".eleve").forEach((element) => {
          element.remove();
        });
        await getPromoById(data);
      });
    });
  });
}

///////////////Modifier promo /////////////////////

async function modifyPromo(element, nom, start, end) {
  const bodyData = {
    name: nom.value,
    startDate: start.value,
    endDate: end.value,
    endDate: end.value,
  };

  try {
    const response = await fetch(API_URL + element.id, {
      method: "PUT",
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
}

document.querySelector(".modifier").addEventListener("click", () => {
  console.log(data);
  let modifierNom = document.createElement("input");
  let modifierStart = document.createElement("input");
  let modifierEnd = document.createElement("input");
  let btnValider = document.createElement("button");
  btnValider.textContent = "Valider";
  btnValider.classList.add("validerModif");
  modifierNom.classList.add("modifierNom");
  modifierStart.type = "date";
  modifierEnd.type = "date";
  modifierStart.value = document.querySelector(".start").textContent;
  modifierEnd.value = document.querySelector(".end").textContent;
  modifierNom.value = document.querySelector(".nomPromo").textContent;
  modifierNom.style.color = "#ffa502";
  document.querySelector(".nomPromo").replaceWith(modifierNom);
  document.querySelector(".start").replaceWith(modifierStart);
  document.querySelector(".end").replaceWith(modifierEnd);
  document.querySelector(".btnDiv").appendChild(btnValider);

  document.querySelector(".validerModif").addEventListener("click",async () => {
    modifyPromo(data, modifierNom, modifierStart, modifierEnd);
    document.querySelectorAll(".eleve").forEach((element) => {
      element.remove();
    });
    getPromoById(data);
   await location.reload()

  
  });
});

////////////////////Supprimer eleve//////////////////////////////////
async function deleteEleve(eleve) {
  try {
    const response = await fetch(`${API_URL}${data.id}/students/${eleve._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log(`Promotion avec l'ID ${eleve._id} supprimée avec succès.`);
    document.querySelectorAll(".eleve").forEach((eleve) => eleve.remove());

    getPromoById(data);
    return true;
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de la promotion avec l'ID ${eleve._id} :`,
      error
    );
    throw error;
  }
}

///////////////////Ajouter eleves ///////////////////////////////

async function addEleve(eleve) {
  const bodyData = {
    firstName: document.querySelector("#nom").value,
    lastName: document.querySelector("#prenom").value,
    age: document.querySelector("#age").value,
  };

  try {
    const response = await fetch(API_URL + data.id + "/students", {
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
  document.querySelector(".ajouter").classList.add("hidden");
  document.querySelectorAll(".eleve").forEach((eleve) => eleve.remove());
  getPromoById(data);
  getPromo()
}

////////////////Fait apparaitre la modale d'ajout eleves////////////////////////////////
function btnAjouter() {
  document.querySelector(".ajouter").classList.remove("hidden");
 
}

// Fonction pour fermer la modale d'ajout si l'on clique en dehors d'elle///////////////////////

window.onclick = function (event) {
  if (event.target === modal) {
    modal.classList.add("hidden");
    console.log("test");
  }
  if (event.target === document.querySelector(".ajouter")) {
    document.querySelector(".ajouter").classList.add("hidden");
    console.log("test");
  }
};

///////////////////////////Modifier élève /////////////////////
async function modifyEleve(element, modifierNom, modifierPrenom, modifierAge) {
  const bodyData = {
    firstName: modifierNom.value,
    lastName: modifierPrenom.value,
    age: modifierAge.value,
  };

  try {
    const response = await fetch(
      API_URL + data.id + "/students/" + element._id,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de la promotion :", error);
    throw error;
  }
}

/////////////////////////////////// supprimer promo ///////////////////////

async function deletePromo(element) {
  try {
    const response = await fetch(`${API_URL}${element.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log(`Promotion avec l'ID ${element.id} supprimée avec succès.`);

    return true;
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de la promotion avec l'ID ${element.id} :`,
      error
    );
    throw error;
  }
}

//////Afficher modale suppression ////////////////
document.querySelector(".supprimer").addEventListener("click", () => {
  document.querySelector(".suppression").classList.remove("hidden");
});

//////Supprime la promo ///////////////////////
document.querySelector(".validerSup").addEventListener("click", () => {
  deletePromo(data);
  window.location.href = "/assets/pages/accueil.html";
});

getPromo();
getPromoById(data);
