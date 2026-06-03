document.addEventListener("DOMContentLoaded", () => {

  // Ouvrir la modale
  document.getElementById("btn-modifier").addEventListener("click", (e) => {
    e.preventDefault();
    console.log("clic !");
    ouvrirModale();
  });

// Fermer avec la croix
document.getElementById("modal-close").addEventListener("click", fermerModale);
document.getElementById("modal-close-2").addEventListener("click", fermerModale);

// Fermer en cliquant en dehors
document.getElementById("modal-overlay").addEventListener("click", (e) => {
  if (e.target === document.getElementById("modal-overlay")) {
    fermerModale();
  }
});

// Flèche retour → vue galerie
document.getElementById("modal-retour").addEventListener("click", () => {
  document.getElementById("modal-formulaire").style.display = "none";
  document.getElementById("modal-galerie").style.display = "block";
});

// Bouton "Ajouter une photo" → vue formulaire
document.getElementById("btn-ajout-photo").addEventListener("click", () => {
  document.getElementById("modal-galerie").style.display = "none";
  document.getElementById("modal-formulaire").style.display = "block";
});

function ouvrirModale() {
  document.getElementById("modal-overlay").style.display = "flex";
  document.getElementById("modal-galerie").style.display = "block";
  afficherTravauxModale();
  chargerCategories();
}

function fermerModale() {
  document.getElementById("modal-overlay").style.display = "none";
  // revenir sur la vue galerie par défaut
  document.getElementById("modal-galerie").style.display = "block";
  document.getElementById("modal-formulaire").style.display = "none";
}

function afficherTravauxModale() {
  const modalGallery = document.getElementById("modal-gallery");
  modalGallery.innerHTML = "";

  travaux.forEach(travail => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const btnSupp = document.createElement("button");

    img.src = travail.imageUrl;
    img.alt = travail.title;
    btnSupp.classList.add("btn-supprimer");
    btnSupp.innerHTML = `<svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
      </svg>`;

    // événement suppression
    btnSupp.addEventListener("click", async () => {
      await supprimerTravail(travail.id, figure);
    });

    figure.appendChild(img);
    figure.appendChild(btnSupp);
    modalGallery.appendChild(figure);
  });
}



// Ajout

// charger les catégories dans le select
async function chargerCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  
  const select = document.getElementById("categorie-photo");
  select.innerHTML = "";
  
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}

// ajouter une photo
async function ajouterPhoto() {
  const token = localStorage.getItem("token");
  const titre = document.getElementById("titre-photo").value;
  const categorie = document.getElementById("categorie-photo").value;
  const fichier = document.getElementById("input-file").files[0];
  

  // vérifier que tous les champs sont remplis
  if (!titre || !categorie || !fichier) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  // créer le FormData pour envoyer l'image
  const formData = new FormData();
  formData.append("title", titre);
  formData.append("category", categorie);
  formData.append("image", fichier);

  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });

  if (response.ok) {
    const nouveauTravail = await response.json();
    travaux.push(nouveauTravail);
    afficherTravaux(travaux);
    fermerModale();
  } else {
    alert("Erreur lors de l'ajout !");
  }
}

// bouton valider
document.getElementById("btn-valider").addEventListener("click", ajouterPhoto);

// bouton upload → ouvre le sélecteur de fichier
document.getElementById("btn-upload").addEventListener("click", () => {
  document.getElementById("input-file").click();
});


// Suppression 

  async function supprimerTravail(id, figure) {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (response.ok) {
    // supprimer de la modale
    figure.remove();
    // supprimer du tableau travaux
    travaux = travaux.filter(t => t.id !== id);
    // mettre à jour la galerie principale
    afficherTravaux(travaux);
  } else {
    alert("Erreur lors de la suppression !");
  }
}


function verifierFormulaire() {
  const titre = document.getElementById("titre-photo").value;
  const categorie = document.getElementById("categorie-photo").value;
  const fichier = document.getElementById("input-file").files[0];
  const btnValider = document.getElementById("btn-valider");

  if (titre && categorie && fichier) {
    btnValider.style.backgroundColor = "#1D6154";
  } else {
    btnValider.style.backgroundColor = "#ccc";
  }
}

document.getElementById("input-file").addEventListener("change", (e) => {
  const fichier = e.target.files[0];
  if (fichier) {
    const url = URL.createObjectURL(fichier);
    const uploadZone = document.getElementById("upload-zone");
    // vider seulement le visuel, pas l'input
    uploadZone.style.backgroundImage = `url(${url})`;
    uploadZone.style.backgroundSize = "contain";
    uploadZone.style.backgroundRepeat = "no-repeat";
    uploadZone.style.backgroundPosition = "center";
    uploadZone.style.height = "150px";
    // cacher le contenu de la zone
    uploadZone.querySelectorAll("img, button, p").forEach(el => el.style.display = "none");
    verifierFormulaire();
  }
});
document.getElementById("titre-photo").addEventListener("input", verifierFormulaire);
document.getElementById("categorie-photo").addEventListener("change", verifierFormulaire);

});