// let buttonSubmitLogin = document.getElementById('buttonSubmitLogin')


// function getToken() {

//     fetch('http://localhost:5678/api/users/login')
//     .then(response => response.json())
//     .then(response => {
//         console.log('response', response)

// }).catch(error => console.log(error))

// }

// buttonSubmitLogin.addEventListener('click', function(event) {
//     event.preventDefault();

//     let emailInput = document.getElementById('email')
//     console.log('email', emailInput.textContent)
//     let passwordInput = document.getElementById('password')

//     // if 
//     // getToken()

//     // if (emailInput.value)

//     console.log("se connecter")
// })

const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("error-message");

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

    const data = await response.json();

    console.log("Utilisateur connecté :", data);

    // redirection par exemple
    window.location = "../index.html?connected=true";

    // window.location.href = "/index.html";

  } catch (error) {
    errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe";
  }
});