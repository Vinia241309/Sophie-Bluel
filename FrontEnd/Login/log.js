const email = document.querySelector(".email");
const password = document.querySelector(".password");
const form = document.querySelector("form")

form.addEventListener('submit', (event) => {
  event.preventDefault();
  login(email.value, password.value);
});

async function login(emailValue, passwordValue) {
    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailValue, password: passwordValue }),
      });
  
      const data = await response.json();
  console.log(data)
      if (!data.token) {
        alert("Erreur identifiant ou mot de passe");
      
      } else {
        window.localStorage.setItem("token", data.token);
        const fullUrl = window.location.pathname;
        const split = window.location.pathname.split('/');
        const newUrl = split.splice(0, split.length - 2);
        console.log(window.location)
        document.location.href = newUrl.join('/') + '/index.html'
        console.log(fullUrl,split,newUrl)
      }


    } catch (error) {
      console.error("Échec de connexion", error);
    }
}
