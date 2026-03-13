//Initialisation du container
let gallery = document.querySelectorAll("#portfolio .gallery");
let portfolio = document.querySelector('#portfolio')
let h2Filter = document.querySelector('#portfolio h2')
let divFilterContainer = document.createElement("div");
let filterButtons;
let projectsList;
let projectsListFiltered;


function displayProject(project) {

    //Ajout de la Card
    let figure = document.createElement("figure");
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
    h2Filter.after(divFilterContainer)
    divFilterContainer.classList.add('filterContainer')

    let divFilterAll = document.createElement('div')
    // divFilterAll.classList.add('')
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

