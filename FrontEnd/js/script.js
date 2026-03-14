let params = new URLSearchParams (document.location.href.split('?')[1]);
let userConneted = params.get("connected");
console.log('userConnected', userConneted)

//Initialisation du container
let gallery = document.querySelectorAll("#portfolio .gallery");
let portfolio = document.querySelector('#portfolio')
let h2Filter = document.querySelector('#portfolio h2')
let divFilterContainer = document.querySelectorAll('#portfolio .filterContainer')[0]
// let divFilterContainer = document.createElement("div");
// divFilterContainer.classList.add('filterContainer')
let filterButtons;
let projectsList;
let projectsListFiltered;


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

        //TODO : Récupérer le token après login
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc3MzQ4MzEyNywiZXhwIjoxNzczNTY5NTI3fQ.GQ4D0UV37iztYlAsXtBXz3qG6p6AMxkF1DOXWRnhpAY'
        
        
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
                    console.log('projet ' + project.id + " non supprimé")
                }
            });
        } catch (error) {
            
        }
        console.log('suppression du projet ' + project.id)
    })

}

if (userConneted) {

    let mainContainer = document.querySelectorAll('.main-container')[0]

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

    let buttons = document.querySelectorAll('nav li a')
    let EditDialog = document.querySelector('#edit-dialogue')
    let showDialog = document.querySelector('#showDialog')


    buttons.forEach(btn => {
        if (btn.textContent === "login") {
            btn.textContent = "logout"
        }
    })

    //editButton.setAttribute('style', "display: flex;");

    divFilterContainer.setAttribute('style', "display: none;");

    showDialog.addEventListener('click', function(event) {
        event.preventDefault()
        EditDialog.showModal();

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
    })

    let closeButtonDialog = document.querySelectorAll('.fa-xmark')[0]

    closeButtonDialog.addEventListener('click', function(event) {
        EditDialog.close()
    })


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


fetch('http://localhost:5678/api/categories')
.then(response => response.json())
.then(categories => {
    // Récupération de la liste des projets de Sophie. Boucle pour création éléments html
    displayFilterAll()
    
    for(let i = 0; i < categories.length; i++){
        
        displayCategory(categories[i]);
        
    }
    filterButtons = document.querySelectorAll('#portfolio .filterButton')

    filterButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault()

            let id = button.id.split('_')[1]

            if (parseInt(id) === 0) {
                projectsListFiltered = projectsList
            }
            else {
                projectsListFiltered = projectsList.filter(p => p.categoryId === parseInt(id))                
            }

            deleteFilterSelected()
            button.classList.add('filterButtonSelected')
            
            //supression de toutes les figures avant d'en créer des nouvelles
            gallery[0].querySelectorAll("figure").forEach(figure => figure.remove());

            projectsListFiltered.forEach(project => displayProject(project))


    })
})

}).catch(error => console.log(error))



