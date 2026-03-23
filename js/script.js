let params = new URLSearchParams (document.location.href.split('?')[1]);
let userConneted = false;

//Initialisation du container
let gallery = document.querySelectorAll("#portfolio .gallery");
let portfolio = document.querySelector('#portfolio')
let h2Filter = document.querySelector('#portfolio h2')
let divFilterContainer = document.querySelectorAll('#portfolio .filterContainer')[0]
let filterButtons;
let projectsList;
let projectsListFiltered;
let categories = []
      
function loadToken() {
    token = JSON.parse(localStorage.getItem('bearer'));
    if(token == null) {
        token = "";
    } else {
        userConneted=true;
    }
}

loadToken()

function deleteToken() {
    localStorage.removeItem('bearer')
}

function displayProject(project) {

    //Ajout de la Card
    let figure = document.createElement("figure");
    figure.id = "project_" + project.id
    gallery[0].appendChild(figure);

    let divImg = document.createElement("img");
    divImg.setAttribute('src', project.imageUrl);
    divImg.setAttribute('alt',"Image Projet");
    figure.appendChild(divImg)

    //Ajout titre
    let figcaption = document.createElement("figcaption");
    figcaption.textContent = project.title;
    figure.appendChild(figcaption);

}

function displayFilterAll() {

    let divFilterAll = document.createElement('div')
    divFilterAll.textContent = 'Tous'
    divFilterAll.id = 'filterButton_' + 0
    divFilterAll.classList.add('filterButton')
    divFilterAll.classList.add('filterButtonSelected')
    divFilterContainer.appendChild(divFilterAll)
}

function displayCategory(category) {

    let divCategory = document.createElement('div')
    divCategory.id = 'filterButton_' + category.id
    divCategory.textContent = category.name
    divCategory.classList.add('filterButton')
    divFilterContainer.appendChild(divCategory)

}

function deleteFilterSelected() {
    let buttonsSelected = document.querySelectorAll('.filterButtonSelected')
	
	buttonsSelected.forEach((button) => {
		button.classList.remove('filterButtonSelected')
	})
}

function displayProjectDialog(project) {

    let galleryList = document.querySelectorAll('#edit-dialogue .gallery-edit')[0]

    let figure = document.createElement('figure')
    figure.setAttribute('style', 'position: relative;')
    figure.id = 'projectFigureEdit_' + project.id
    galleryList.appendChild(figure)

    let img = document.createElement('img');
    img.setAttribute('src', project.imageUrl);
    img.setAttribute('alt',"Image Projet");
    img.setAttribute('style', 'position: relative;')
    figure.appendChild(img)

    let divDeleteButton = document.createElement('div')
    divDeleteButton.setAttribute('style', 'width: 17px; height: 17px; padding: 3px; position: absolute; right: 5px; top: 6px; background-color: black; color: white; display: flex; justify-content: center; align-items: center;')
    img.appendChild(divDeleteButton)

    let deleteProjetButton = document.createElement('i')
    deleteProjetButton.classList.add('fa-solid')
    deleteProjetButton.classList.add('fa-trash-can')
    deleteProjetButton.setAttribute('style', 'position: static;')
    deleteProjetButton.id = "projetDeleteButton_" + project.id
    divDeleteButton.appendChild(deleteProjetButton)
    
    figure.appendChild(divDeleteButton)

    deleteProjetButton.addEventListener('click', async function(event) {
        event.preventDefault()

        //suppresion du projet au clique du bouton deleteProjetButton
        try {
            await fetch("http://localhost:5678/api/works/" + project.id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + token
                }
            })
            .then((res) => {
                if (res.ok) {
                    //suppression de la figure correspondante
                    let figureProjetEdit = document.getElementById('projectFigureEdit_' + project.id)
                    galleryList.removeChild(figureProjetEdit)
                    let figureProject = document.getElementById('project_' + project.id)
                    gallery[0].removeChild(figureProject)
                    
                }
                else {
                    alert('Impossible de supprimer le projet !')
                }
            });
        } catch (error) {
            
        }
    })

}

function initFormDialog() {
    document.querySelector("#titre").value = ""
    document.getElementById('categoriesSelect').value = ""
    imageInput.value = ""
    document.querySelectorAll('.imageAddContainerDialog img')[0].src = "./assets/icons/Image.png"
    document.querySelectorAll('.ajouterButtonContainerDialog')[0].setAttribute('style', 'display: inherit;')
    document.querySelectorAll('.imageAddContainerDialog')[0].removeAttribute('style')
    document.querySelectorAll('.imageAddContainerDialog img')[0].removeAttribute('style')
    document.getElementById('projet-form').setAttribute('style', 'display: none')
    document.querySelectorAll('.editPageContainer')[0].removeAttribute('style')
    dialogButton.textContent = "Ajouter une photo"


}

if (userConneted) {

    let mainContainer = document.querySelectorAll('.main-container')[0]

    // Bandeau du haut mode edition
    let divEditMessage = document.createElement('div')
    divEditMessage.setAttribute('style', "background-color: black; width: 100%; height: 59px; display: flex; justify-content: center; align-items: center;");

    let divMessageEditText = document.createElement('p')
    let icondivMessageEditText = document.createElement('i')
    icondivMessageEditText.setAttribute('class', 'fa-regular fa-pen-to-square')
    divMessageEditText.appendChild(icondivMessageEditText)

    let divtextEdit = document.createElement('div')
    divtextEdit.textContent = 'Mode édition'
    divMessageEditText.appendChild(divtextEdit)
    divMessageEditText.setAttribute('style', 'color: white; display: flex; column-gap: 15px;')
    divEditMessage.appendChild(divMessageEditText)
    mainContainer.before(divEditMessage)

    // Changement de texte du bouton login pour logout
    let buttons = document.querySelectorAll('nav li a')
    let EditDialog = document.querySelector('#edit-dialogue')
    let showDialog = document.querySelector('#showDialog')
    //TODO A modifier (à créer en javascript)
    showDialog.style = "display: flex;"

    let logButton = document.getElementById('logButton')

    buttons.forEach(btn => {
        if (btn.textContent === "login") {
            btn.textContent = "logout"
        }
    })

    logButton.addEventListener('click', function(event) {
        event.preventDefault()
        if (logButton.textContent = "logout") {
            deleteToken()
            //TODO : A la deconnexion de l'utilisateur, faut-il rediriger vers login.html ou rester su index.html ?
            window.location = "./views/login.html";
        }
    })

    // Cache les Filtres catégorie
    divFilterContainer.setAttribute('style', "display: none;");

    // Dialog + bouton showDialog
    showDialog.addEventListener('click', function(event) {
        event.preventDefault()
        EditDialog.showModal();
        document.body.style.overflow = "hidden";
        
        projectsList.forEach(project => {
            displayProjectDialog(project)
        })
    })

    let dialog = document.getElementById('edit-dialogue')
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    })

    dialog.addEventListener('close', function() {
        let galleryList = document.querySelectorAll('.gallery-edit')[0]
        galleryList.innerHTML = ""
        initFormDialog()
    })

    let closeButtonDialog = document.querySelectorAll('.fa-xmark')[0]

    closeButtonDialog.addEventListener('click', function(event) {
        EditDialog.close()
        document.body.style.overflow = "";
    })

    let galleryProjetsContainer = document.querySelectorAll('#edit-dialogue .editPageContainer')[0]
    let projetForm = document.getElementById('projet-form')
    let arrowLeftButton = document.querySelectorAll('#edit-dialog-entete-button .fa-arrow-left')[0]
    let dialogButton = document.getElementById('dialogButton')

    dialogButton.addEventListener('click', async function(event) {
        event.preventDefault()

        // Upload Photo projet
        const uploadBtn = document.getElementById("uploadBtn");
        let imageInput = document.getElementById("imageInput");
        let errorMessage = document.getElementById('error-message')

        switch (dialogButton.textContent) {

            case "Ajouter une photo":
                
                galleryProjetsContainer.setAttribute('style', 'display: none;')
                arrowLeftButton.setAttribute('style', 'visibility: unset;')
                projetForm.setAttribute('style', 'display: flex; flex-direction: column; flex: 4')
                let h3 = document.querySelectorAll('#edit-dialog_entete h3')[0]
                h3.textContent = "Ajout Photo"

                dialogButton.textContent="Valider"

                arrowLeftButton.addEventListener('click', function(event) {
                    event.preventDefault()

                    galleryProjetsContainer.setAttribute('style', '')
                    arrowLeftButton.setAttribute('style', 'visibility: hidden;')
                    //TODO: Vider le formulaire ????
                    projetForm.setAttribute('style', 'display: none')
                    h3.textContent = "Galerie photo"
                    dialogButton.textContent="Ajouter une photo"

                })

                let categorySelect = document.querySelectorAll('#valid_form select')[0]

                if (categorySelect.children.length <= 1) {
                    categories.forEach((category) => {
                        let option = document.createElement('option')
                        option.value = category.id
                        option.textContent = category.name
                        categorySelect.appendChild(option)
                    })
                }

                uploadBtn.addEventListener("click", () => {
                    imageInput.click();
                });

                
                imageInput.addEventListener("change", function(event) {
                    event.preventDefault()

                    errorMessage.textContent = "";
                    let file = imageInput.files[0]
                    if (!file) return;

                    const maxSize = 4 * 1024 * 1024; //4mo
                    const allowedTypes = ["image/jpeg", "image/png"];

                    if (!allowedTypes.includes(file.type)) {
                        errorMessage.textContent = "Seules les images JPG et PNG sont autorisées.";
                        imageInput.value = "";
                        return;
                    }

                    if (file.size > maxSize) {
                        errorMessage.textContent = "La taille maximale est de 4 Mo.";
                        imageInput.value = "";
                        return;
                    }

                    let imageAddContainerDialog = document.querySelectorAll('.imageAddContainerDialog')[0]
                    imageAddContainerDialog.setAttribute('style', 'height: stretch; margin: 0; width: auto;')

                    let image = document.querySelectorAll('.imageAddContainerDialog img')[0]
                    image.src = `./assets/images/${file.name}`
                    image.setAttribute('style', 'height: 100%;')

                    let ajouterButtonContainerDialog = document.querySelectorAll('.ajouterButtonContainerDialog')[0]
                    ajouterButtonContainerDialog.setAttribute('style', 'display: none;')
                    
                    return;
                });

                break;
        
            case "Valider":
                
                errorMessage.textContent = ""

                //Vérification de la validité des champs
                let titre = document.querySelector("#titre").value;
                let category = document.getElementById('categoriesSelect').value

                // Si pas ok, affichage message d'erreur
                if (imageInput.value === "") { 
                    errorMessage.textContent = "Veuillez sélectionner une photo."
                    break;
                }
                if (!titre.match(/^([\wàâäéèêëïîôöùûüç'" -~]+)$/)) { 
                    errorMessage.textContent = 'Le titre ne doit pas être vide ou comporter des caractères spéciaux'
                    break;
                }
                if (category === "") { 
                    errorMessage.textContent = "Veuillez sélectionner une catégorie."
                    break;
                }

                // Si ok, post du nouveau projet
                let file = imageInput.files[0]
                let projet = {
                    title: titre,
                    categoryId : category
                }

                console.log('new project', projet)

                const formData = new FormData();
                formData.append("title", titre);
                formData.append("category", category);
                formData.append("image", file);

                fetch("http://localhost:5678/api/works/", {
                    method: "POST",
                    headers: {
                        "Authorization": 'Bearer ' + token
                    },
                    body: formData,
                })
                .then(res => res.json())
                .then((data) => {
                    if (data) {

                        //Rafraichissement nouvelle image dans le dialog + portfolio
                        displayProjectDialog(data)
                        displayProject(data)

                        //Vider les input
                        initFormDialog()

                        imageInput.removeEventListener('change')

                        alert("Le projet a été ajouté avec succés !")
                        
                    }
                    else {
                        alert("Impossible d'ajouter le nouveau projet !")
                    }
                }).catch(error => console.log(error));                

                break;
            default:
                break;
        }
    })
}

function checkValidityInput() {


    if (!document.querySelector('#imageInput').value.match(/^([a-zA-Zàâäéèêëïîôöùûüç' -]+)$/)){
            alert('Le champs nom ne doit pas contenir de caractères spéciaux ou numériques');
            return false;
    } 
    if (!document.querySelector('#firstname').value.match(/^([a-zA-Zàâäéèêëïîôöùûüç' -]+)$/)){
        alert('Le champs prénom ne doit pas contenir de caractères spéciaux ou numériques');
        return false;
    }
    if (!document.querySelector('#email').value.match(/^[\w]+\@[\w]+\.[a-z]{2,3}$/)){
        alert('L\'adresse email renseignée n\'est pas valide. Elle doit être sous la forme exemple@exemple.fr et ne pas contenir de caractères spéciaux');
        return false;
    }
    if (!document.querySelector('#address').value.match(/^([\wàâäéèêëïîôöùûüç' ]+)$/)){
        alert('Le champs Adresse ne doit pas contenir de caractères spéciaux ou numériques');
        return false;
    }
    if (!document.querySelector('#city').value.match(/^([a-zA-Zàâäéèêëïîôöùûüç' -]+)$/)){
        alert('Le champs ville ne doit pas contenir de caractères spéciaux ou numériques');
        return false;
    }

    return true;

}

// Récupération de l'api
fetch('http://localhost:5678/api/works')
.then(response => response.json())
.then(projects => {

    projectsList = projects
    // Récupération de la liste des projets de Sophie. Boucle pour création éléments html
    for(let i = 0; i < projects.length; i++){
        
        displayProject(projects[i]);
        
    }
}).catch(error => console.log(error))

fetchCategories()