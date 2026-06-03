// variable globale pour tous les travaux
var travaux = [];

// fonction pour récupérer les travaux
async function recupererTravaux() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    travaux = await response.json();
    afficherTravaux(travaux);

    const categories = await recupererCategories();
    creerFiltres(categories, travaux);

    const token = localStorage.getItem("token");
    if (token) {
      document.getElementById("edit-banner").style.display = "block";
      document.querySelector(".filters").style.display = "none";
      const loginLink = document.getElementById("login-link");
      loginLink.textContent = "logout";
      loginLink.href = "#";
      loginLink.addEventListener("click", logout);
      const btnModifier = document.getElementById("btn-modifier");
      if (btnModifier) btnModifier.style.display = "block";
    }

  } catch (error) {
    console.log("Erreur lors de la récupération des travaux :", error);
  }
}

// fonction pour récupérer les catégories
async function recupererCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.log("Erreur lors de la récupération des catégories :", error);
    return [];
  }
}

// fonction pour afficher les travaux
function afficherTravaux(travauxAAfficher) {
  let galerie = document.querySelector(".gallery");

  // si la galerie n'existe pas encore, on la crée
  if (!galerie) {
    galerie = document.createElement("div");
    galerie.className = "gallery";
    document.body.appendChild(galerie);
  }

  galerie.innerHTML = "";

  travauxAAfficher.forEach(travail => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    image.src = travail.imageUrl;
    image.alt = travail.title;
    figcaption.textContent = travail.title;

    figure.appendChild(image);
    figure.appendChild(figcaption);
    galerie.appendChild(figure);
  });
}

// fonction pour créer les boutons de filtre
function creerFiltres(categories, travaux) {
  let filtreContainer = document.querySelector(".filters");

  // si le container n'existe pas, on le crée
  if (!filtreContainer) {
    filtreContainer = document.createElement("div");
    filtreContainer.className = "filters";
    // on insère les filtres juste avant la galerie
    const galerie = document.querySelector(".gallery") || document.body;
    galerie.parentNode.insertBefore(filtreContainer, galerie);
  }

  filtreContainer.innerHTML = "";

  // bouton "Tous"
  const boutonTous = document.createElement("button");
  boutonTous.textContent = "Tous";
  boutonTous.addEventListener("click", () => { 
  filtreContainer.querySelectorAll("button").forEach(btn => {
    btn.classList.remove("active");
  });

  boutonTous.classList.add("active");
    afficherTravaux(travaux);
  });
  filtreContainer.appendChild(boutonTous);

  // boutons pour chaque catégorie
  categories.forEach(cat => {
    const bouton = document.createElement("button");
    bouton.textContent = cat.name;
    bouton.addEventListener("click", () => {
      filtreContainer.querySelectorAll("button").forEach(btn => {
      btn.classList.remove("active");
    });

    bouton.classList.add("active");
      const filtres = travaux.filter(t => t.categoryId === cat.id);
      afficherTravaux(filtres);
    });
    filtreContainer.appendChild(bouton);
  });
}

// lancement de tout
recupererTravaux();

// Etape 5.3

function logout() {
  localStorage.removeItem("token");
  window.location.reload();
}
