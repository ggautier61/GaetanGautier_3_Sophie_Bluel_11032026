let token = "";
let userConnected = false;

let projectsList = [];
let categories = [];
let gallery;

// ====================== FONCTIONS D'AFFICHAGE ======================
function loadToken() {
    const stored = localStorage.getItem('bearer');
    userConnected = !!stored;
    token = stored ?? stored;
}

function deleteToken() {
    localStorage.removeItem('bearer');
}

function displayProject(project) {
    const figure = document.createElement("figure");
    figure.id = `project_${project.id}`;
    gallery.appendChild(figure);

    const img = document.createElement("img");
    img.src = project.imageUrl;
    img.alt = "Image Projet";
    figure.appendChild(img);

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = project.title;
    figure.appendChild(figcaption);
}

function displayFilterAll() {
    const div = document.createElement('div');
    div.textContent = 'Tous';
    div.id = 'filterButton_0';
    div.classList.add('filterButton', 'filterButtonSelected');
    document.querySelector('#portfolio .filterContainer').appendChild(div);
}

function displayCategory(category) {
    const div = document.createElement('div');
    div.id = `filterButton_${category.id}`;
    div.textContent = category.name;
    div.classList.add('filterButton');
    document.querySelector('#portfolio .filterContainer').appendChild(div);
}

function deleteFilterSelected() {
    document.querySelectorAll('.filterButtonSelected').forEach(btn => btn.classList.remove('filterButtonSelected'));
}

function displayProjectDialog(project, galleryEdit) {
    const figure = document.createElement('figure');
    figure.style.position = 'relative';
    figure.id = `projectFigureEdit_${project.id}`;
    galleryEdit.appendChild(figure);

    const img = document.createElement('img');
    img.src = project.imageUrl;
    img.alt = "Image Projet";
    img.style.position = 'relative';
    figure.appendChild(img);

    // Bouton delete
    const deleteContainer = document.createElement('div');
    deleteContainer.classList.add("deleteContainer");
    figure.appendChild(deleteContainer);

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid', 'fa-trash-can');
    deleteContainer.appendChild(deleteIcon);

    // Suppression
    deleteIcon.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            const res = await fetch(`http://localhost:5678/api/works/${project.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                document.getElementById(`projectFigureEdit_${project.id}`)?.remove();
                document.getElementById(`project_${project.id}`)?.remove();
                fetch('http://localhost:5678/api/works')
                .then(res => res.json())
                .then(projects => {
                    projectsList = projects;                    
                })
                .catch(console.error);
            } else {
                alert('Impossible de supprimer le projet !');
            }
        } catch (e) { }
    });
}

// ====================== GESTION DU DIALOGUE ======================
let currentObjectUrl = null;

const maxSize = 4 * 1024 * 1024;
const allowedTypes = ["image/jpeg", "image/png"];

function initFormDialog() {
    if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
        currentObjectUrl = null;
    }

    document.getElementById("titre").value = "";
    document.getElementById('categoriesSelect').value = "";
    document.getElementById("imageInput").value = "";
    document.getElementById("error-message").value = "";

    const previewImg = document.querySelector('.imageAddContainerDialog img');
    previewImg.src = "./assets/icons/Image.png";
    previewImg.style.cssText = '';

    document.querySelector('.ajouterButtonContainerDialog').style.display = 'flex';
    document.querySelector('.imageAddContainerDialog').style.cssText = '';
    document.getElementById('projet-form').style.display = 'none';
    document.querySelector('.editPageContainer').style.display = '';
    document.getElementById('dialogButton').textContent = "Ajouter une photo";
}

function switchToAddMode(h3, arrowLeftButton, projetForm, galleryProjetsContainer, dialogButton) {
    galleryProjetsContainer.style.display = 'none';
    arrowLeftButton.style.visibility = 'unset';
    projetForm.style.display = 'flex';
    projetForm.style.height="100%"
    h3.textContent = "Ajout Photo";
    dialogButton.textContent = "Valider";
}

function switchToGalleryMode(h3, arrowLeftButton, projetForm, galleryProjetsContainer, dialogButton) {
    galleryProjetsContainer.style.display = '';
    arrowLeftButton.style.visibility = 'hidden';
    projetForm.style.display = 'none';
    h3.textContent = "Galerie photo";
    dialogButton.textContent = "Ajouter une photo";
    initFormDialog();
}

// ====================== INITIALISATION ======================
loadToken();

if (userConnected) {
    // Bannière mode édition
    const mainContainer = document.querySelector('.main-container');
    const editBanner = document.createElement('div');
    editBanner.classList.add("editBanner");
    editBanner.innerHTML = `
        <p style="color: white; display: flex; column-gap: 15px; align-items: center;">
            <i class="fa-regular fa-pen-to-square"></i>
            <span>Mode édition</span>
        </p>`;
    mainContainer.before(editBanner);

    // Logout
    const logButton = document.getElementById('logButton');
    logButton.textContent = "logout";
    logButton.addEventListener('click', (e) => {
        e.preventDefault();
        deleteToken();
        window.location = "./views/login.html";
    });

    // Cacher les filtres
    document.querySelector('#portfolio .filterContainer').style.display = "none";

    // Références dialogue
    const EditDialog = document.getElementById('edit-dialogue');
    const showDialogBtn = document.getElementById('showDialog');
    const galleryEdit = document.querySelector('#edit-dialogue .gallery-edit');
    const galleryProjetsContainer = document.querySelector('#edit-dialogue .editPageContainer');
    const projetForm = document.getElementById('projet-form');
    const h3 = document.querySelector('#edit-dialog_entete h3');
    const arrowLeftButton = document.querySelector('#edit-dialog-entete-button .fa-arrow-left');
    const dialogButton = document.getElementById('dialogButton');
    const uploadBtn = document.getElementById("uploadBtn");
    const imageInput = document.getElementById("imageInput");
    const errorMessageEl = document.getElementById('error-message');

    showDialogBtn.style.display = "flex";

    // Écouteurs du dialogue
    showDialogBtn.addEventListener('click', (e) => {
        e.preventDefault();
        EditDialog.showModal();
        document.body.style.overflow = "hidden";

        galleryEdit.innerHTML = "";
        projectsList.forEach(project => displayProjectDialog(project, galleryEdit));
    });

    EditDialog.addEventListener("click", (event) => {
        if (event.target === EditDialog) EditDialog.close();
    });

    EditDialog.addEventListener('close', () => {
        galleryEdit.innerHTML = "";
        initFormDialog();
        document.body.style.overflow = "";
    });

    document.querySelector('.fa-xmark').addEventListener('click', () => {
        EditDialog.close();
    });

    // Flèche retour
    arrowLeftButton.addEventListener('click', (e) => {
        e.preventDefault();
        switchToGalleryMode(h3, arrowLeftButton, projetForm, galleryProjetsContainer, dialogButton);
    });

    // Upload + preview
    uploadBtn.addEventListener("click", () => imageInput.click());

    imageInput.addEventListener("change", (event) => {
        errorMessageEl.textContent = "";
        const file = imageInput.files[0];
        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            errorMessageEl.textContent = "Seules les images JPG et PNG sont autorisées.";
            imageInput.value = "";
            return;
        }
        if (file.size > maxSize) {
            errorMessageEl.textContent = "La taille maximale est de 4 Mo.";
            imageInput.value = "";
            return;
        }

        if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
        currentObjectUrl = URL.createObjectURL(file);

        const container = document.querySelector('.imageAddContainerDialog');
        container.style.cssText = 'height: stretch; margin: 0; width: auto;';

        const preview = document.querySelector('.imageAddContainerDialog img');
        preview.src = currentObjectUrl;
        preview.style.height = '100%';

        document.querySelector('.ajouterButtonContainerDialog').style.display = 'none';
    });

    // Bouton principal (Ajouter / Valider)
    dialogButton.addEventListener('click', async (event) => {
        event.preventDefault();

        // =================== CAS AJOUTER ==========================
        if (dialogButton.textContent === "Ajouter une photo") {
            switchToAddMode(h3, arrowLeftButton, projetForm, galleryProjetsContainer, dialogButton);

            const select = document.getElementById('categoriesSelect');
            if (select.children.length <= 1) {
                categories.forEach(cat => {
                    const opt = document.createElement('option');
                    opt.value = cat.id;
                    opt.textContent = cat.name;
                    select.appendChild(opt);
                });
            }
            return;
        }

        // ====================== CAS "VALIDER" ======================
        errorMessageEl.textContent = "";

        const titre = document.getElementById("titre").value.trim();
        const categoryId = document.getElementById('categoriesSelect').value;
        const file = imageInput.files[0];

        if (!file) return errorMessageEl.textContent = "Veuillez sélectionner une photo.";
        if (!titre || !/^[\wàâäéèêëïîôöùûüç'" -~]+$/.test(titre)) {
            return errorMessageEl.textContent = 'Le titre ne doit pas être vide ou comporter de caractères spéciaux';
        }
        if (!categoryId) return errorMessageEl.textContent = "Veuillez sélectionner une catégorie.";

        const formData = new FormData();
        formData.append("title", titre);
        formData.append("category", categoryId);
        formData.append("image", file);

        try {
            const res = await fetch("http://localhost:5678/api/works/", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            console.log(res);

            const data = await res.json();

            if (data && res.ok) {

                fetch('http://localhost:5678/api/works')
                    .then(res => res.json())
                    .then(projects => {
                        projectsList = projects;                    
                    })
                    .catch(console.error);

                displayProjectDialog(data, galleryEdit);
                displayProject(data);

                switchToGalleryMode(h3, arrowLeftButton, projetForm, galleryProjetsContainer, dialogButton);
                alert("Le projet a été ajouté avec succès !");
            } else {
                alert("Impossible d'ajouter le nouveau projet !");
            }
        } catch (err) {
            console.error(err);
        }
    });
}

// ====================== CHARGEMENT DES DONNÉES ======================
gallery = document.querySelector('.gallery');

fetch('http://localhost:5678/api/works')
    .then(res => res.json())
    .then(projects => {
        projectsList = projects;
        projects.forEach(project => displayProject(project));
    })
    .catch(console.error);

fetch('http://localhost:5678/api/categories')
    .then(res => res.json())
    .then(cats => {
        categories = cats;
        const filterContainer = document.querySelector('#portfolio .filterContainer');
        displayFilterAll();

        cats.forEach(cat => displayCategory(cat));

        // Filtres
        document.querySelectorAll('.filterButton').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.id.split('_')[1]);

                const filtered = id === 0
                    ? projectsList
                    : projectsList.filter(p => p.categoryId === id);

                deleteFilterSelected();
                button.classList.add('filterButtonSelected');

                gallery.innerHTML = "";
                filtered.forEach(project => displayProject(project));
            });
        });
    })
    .catch(console.error);