const form = document.querySelector(".login-section");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (response.ok) {
      afficherMessage("Connexion réussie ! Redirection en cours...", "succes");
      localStorage.setItem("token", data.token);
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      afficherMessage("Identifiants incorrects, veuillez réessayer.", "erreur");
    }

  } catch (error) {
    afficherMessage("Erreur serveur, veuillez réessayer plus tard.", "erreur");
    console.log("Erreur serveur :", error);
  }
});

function afficherMessage(texte, type) {
  // supprime un éventuel message précédent
  const ancienMessage = document.querySelector(".message-login");
  if (ancienMessage) ancienMessage.remove();

  const message = document.createElement("p");
  message.className = "message-login";
  message.textContent = texte;
  message.style.cssText = `
    text-align: center;
    font-weight: bold;
    margin-top: 10px;
    color: ${type === "succes" ? "green" : "red"};
  `;

  form.appendChild(message);
}