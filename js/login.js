const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("error-message");

function setTokenLocalStorage(token) {
     localStorage.setItem('bearer', token);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // empêche le rechargement de la page

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

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

    if (!response.ok) {
      throw new Error("Erreur dans l'identifiant ou le mot de passe");
    }

    const data = (await response.json()).token;

    setTokenLocalStorage(data)

    // redirection de l'Url
    window.location = "../index.html";

  } catch (error) {
    errorMessage.textContent = "Erreur dans l'identifiant ou le mot de passe";
  }
});