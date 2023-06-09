const gallery = document.querySelector(".gallery")
const modify = document.createElement('span');
const modal = document.querySelector(".modal")


// get works from api//
async function getworks(){
    const response = await fetch('http://localhost:5678/api/works')
    const infos = await response.json();

    return infos;
}
// create works //
async function displayGallery(){
  const works = await getworks();
 
  works.forEach(work=> {
    const figure = document.createElement("figure")
    figure.setAttribute("data-name", work.category.name);
    figure.setAttribute("data-id", work.id);
    const figureImg = document.createElement("img")
    figureImg.src = work.imageUrl
    const figCaption = document.createElement("figcaption")
    figCaption.innerHTML = work.title
    gallery.appendChild(figure)
    figure.appendChild(figureImg)
    figure.appendChild(figCaption)    
});

  showModalGallery(works);
}

// modal gallery //
const showModalGallery = (works) => {
  const close = document.querySelector("#close")
  
  const listWorks = document.querySelector(".list-works")
  listWorks.innerHTML = "";
  
  modify.addEventListener("click", () => {
  modal.style.display="block"
  });
  close.addEventListener("click", () => {
   modal.style.display="none"
   });
   document.querySelector(".modal").addEventListener("click", (event) => {
    if (event.target === document.querySelector(".modal")) {
      modal.style.display="none"
    }
});
   
   console.log(works)
  works.forEach((work) => {
    listWorks.innerHTML += `<div class="modal-work"><img src=${work.imageUrl}>
    <span class="delete-work" data-id=${work.id}><i class="fa-solid fa-trash-can">
    </i></i></span><span>éditer</span></div>`
    listWorks.textContent = ""; 

  })
  works.forEach((work) => {
    addWorkToModal(work);
  });
  
 // delete works in gallery //
  const deleteWorks = document.querySelectorAll(".delete-work")
  deleteWorks.forEach((deleteWork) => {
    deleteWork.addEventListener("click", (e) => {
      e.preventDefault()
      const id = deleteWork.dataset.id;
      
      fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage["token"]}`,
        }
        
        
      })
        .then(response => {
          if (response.ok) {
            console.log("L'image a bien été supprimée");
            

            Array.from(gallery.querySelectorAll("figure")).forEach(
              (figure) => {
                  if (figure.getAttribute("data-id") === id) {
                      figure.remove();
                  }
              }
          );
          }
      
        })
        .catch(error => {
          console.error(error);
        });
        
    });
  });  
  
}

// return to modal gallery // 
const reTurn = document.getElementById("return")
reTurn.addEventListener("click", ()=>{
    modal.style.display="block"
    addWorks.style.display="none"
})
document.getElementById("btnChoosePhoto").addEventListener("click", function() {
  document.getElementById("btnAddPhoto").click();
});
const btnAddWork = document.querySelector(".btn-addwork")
const addWorks = document.querySelector(".modal-addwork")
const closed = document.querySelector("#closed")

btnAddWork.addEventListener("click", () =>{
  modal.style.display="none"
  addWorks.style.display="block"

});
closed.addEventListener('click', () => {
  addWorks.style.display="none"
  });

// display modal to add img//
  const modalAddwork = document.querySelector(".modal-addwork")
  modalAddwork.addEventListener("click", (event) => {
      if (event.target === document.querySelector(".modal-addwork")) {
          modalAddwork.style.display="none"
      }
  });

   // add work to gallery //
  async function addWorkToGallery(work) {
    
    if (work) {
      const figure = document.createElement("figure");
      figure.setAttribute("data-name", work.category ? work.category.name : "");
      figure.setAttribute("data-id", work.id);
      const figureImg = document.createElement("img");
      figureImg.src = work.imageUrl;
      const figCaption = document.createElement("figcaption");
      figCaption.innerHTML = work.title;
      gallery.appendChild(figure);
      figure.appendChild(figureImg);
      figure.appendChild(figCaption);
    }
  }
  
// form modal addwork //
  const submitForm = document.getElementById("addPhotoForm");

submitForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("PhotoTitle").value;
  const category = document.getElementById("PhotoCategory").value;
  const image = document.getElementById("btnAddPhoto").files[0];

  if (!title || !category || !image) {
    alert("Invalid! Please fill in all the fields");
    return;
  }

  const formData = new FormData(submitForm);

  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage["token"]}`,
      },
      body: formData,
    });

    if (response.ok) {
      const newWork = await response.json();
      addWorkToGallery(newWork);
      addWorkToModal(newWork);
      document.getElementById("PhotoTitle").value = "";
      document.getElementById("PhotoCategory").value = "";
      document.getElementById("btnAddPhoto").value = "";
      document.getElementById("yourPhoto").src = "";
      alert("l'image a bien été ajoutée");
      submitForm.reset();
      document.getElementById("btnAddPhoto").files = null;
    }
  } catch (error) {
    console.error(error);
  }
});

  

// display work to modal window//
const addWorkToModal = (work) => {
  const listWorks = document.querySelector(".list-works");
  
  const modalWork = document.createElement("div");
  modalWork.className = "modal-work";
  
  const img = document.createElement("img");
  img.src = work.imageUrl;
  
  const deleteBtn = document.createElement("span");
  deleteBtn.className = "delete-work";
  deleteBtn.dataset.id = work.id;
  
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fa-solid fa-trash-can";
  
  const editSpan = document.createElement("span");
  editSpan.innerHTML = "éditer";
  
  modalWork.appendChild(img);
  modalWork.appendChild(deleteBtn);
  deleteBtn.appendChild(deleteIcon);
  modalWork.appendChild(editSpan);
  
  listWorks.appendChild(modalWork);
 
  // delete work in modal //
  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const id = deleteBtn.dataset.id;
    fetch(`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage["token"]}`,
      }
    })
    .then(response => {
      if (response.ok) {
        console.log("L'image a bien été supprimée");
        modalWork.remove();
      }
    })
    .catch(error => {
      console.error('Erreur', error);
    });
  });
};


// select img in preview area //
  const inputImage = document.getElementById("btnAddPhoto");
  const labelImage = document.getElementById("data-photos");
  const photoForm = document.getElementById("PhotoContainer");
  const photoFormMessage = document.getElementById("data-photo");
  const modalImageIcon = document.getElementById("img-icon");
  const previewImage = photoForm.querySelector("img");
  const btnAddImg = document.getElementById("btnChoosePhoto");
  function displaySelectedImage(inputElement, previewElement, labelElement, messageElement, iconElement) {
    labelElement.addEventListener("click", () => {
      inputElement.click();
      inputElement.style.display = 'none'
    })
    inputElement.addEventListener("change", function(event){
      event.preventDefault();
      const selectedImage = inputElement.files[0];
      previewElement.src = URL.createObjectURL(selectedImage);
      previewElement.style.maxHeight = "100%";
      previewElement.style.width = "auto";
  
      labelElement.style.display = "none";
      messageElement.style.display = "none";
      inputElement.style.display = "none";
      iconElement.style.display = "none";
      btnAddImg.style.display="none";
      
    })
      
  }
  displaySelectedImage(inputImage, previewImage, labelImage, photoFormMessage, modalImageIcon);
  


// change color btn if datas filled //
function changeButtonColor() {
    const title = document.getElementById("PhotoTitle").value;
    const category = document.getElementById("PhotoCategory").value;
    const image = document.getElementById("btnAddPhoto").files[0];
    const button = document.getElementById("valider");

    if (title !== "" && category !== "" && image !== "") {
      button.style.backgroundColor = "#1D6154";
    } else {
      button.style.backgroundColor = "";
    }
  }

  document.getElementById("PhotoTitle").addEventListener("change", changeButtonColor);
  document.getElementById("PhotoCategory").addEventListener("change", changeButtonColor);
  document.getElementById("btnAddPhoto").addEventListener("change", changeButtonColor);
  
const addImg = document.getElementById("data-photos");
addImg.addEventListener("change", checkData);

function checkData(event) {
  const image = event.target.files[0];
  if (image.size < 4 * 1024 * 1024) {

    
  } else {
    alert("La taille de l'image est trop grande");
  }
  
}

displayGallery()
  .catch(error => console.error(error));

  
  const createButton = async (button) => {
    try {
      const filtErs = document.querySelector('.filters');
  
      filtErs.insertAdjacentHTML(
        'beforeend',
        `<button data-name="${button.name}">${button.name}</button>`
      );
    } catch (error) {
      console.error(error);
    }
  };
 
  // display works //
  async function displayCategories() {
    try {
      const response = await fetch("http://localhost:5678/api/categories");
      const infos = await response.json();
      
      const select =  document.getElementById("PhotoCategory")
      infos.forEach((category) => {
        const option = document.createElement("option")
        option.textContent = category.name
        option.value = category.id

        select.appendChild(option)

        createButton(category);
      });

  // create filter btn
      const buttons = document.querySelectorAll(".filters button");
      buttons.forEach((button, index) => { 
        const buttonName = button.dataset.name;
        if (index === 0) { 
          button.classList.add("active"); 
        }
        button.addEventListener("click", function() {
          buttons.forEach((works) =>
            works.classList.remove("active"));
          button.classList.add("active")
      
          const images = document.querySelectorAll(".gallery figure");
          images.forEach((image) => {
            if (image.getAttribute("data-name") === buttonName) {
              image.classList.remove("added_filter");
            } else {
              image.classList.add("added_filter");
            }
          });
        });
      });
      
    
      
      async function showAllWorks() {
        try {
          const allWorks = await document.querySelectorAll('figure');
          allWorks.forEach((works) => works.classList.remove('added_filter'));
        } catch (error) {
          console.error(error);
        }
      }
      
  
      const btnAll = document.querySelector(".all");
      btnAll.addEventListener("click", showAllWorks);
  
    } catch (error) {
      console.error(error);
    }
  }
  
  displayCategories();
  

const logout = () => {
    window.localStorage.removeItem("token"); 
    window.location.replace("Login/log.html"); 
  };
  //  modifies the display of elements when a user is logged in //
const userConnectedPage = () => {
      const addBtn = () => {
      const projectsTitle = document.querySelector("#projects");
      const icon = document.createElement('i');
      icon.className = 'fa-regular fa-pen-to-square';
      projectsTitle.appendChild(icon);
      modify.textContent = 'modifier';
      projectsTitle.appendChild(modify);
      const blackHead = document.querySelector(".head");
      blackHead.style.display = "flex";
      const btnModify = document.querySelector(".modify-btn")
      btnModify.style.display = "block"
    };

    addBtn();
    
   const intro = document.getElementById("introduction")
  
    const loginButton = document.getElementById("loginbtn");
    const logoutButton = document.createElement("a");
    logoutButton.id = "logoutbtn";
    logoutButton.textContent = "logout";
    loginButton.replaceWith(logoutButton);
    document.querySelector(".filters").style.display = "none";
    logoutButton.addEventListener("click", logout);
};

const token = localStorage.getItem("token");
if (token) {
    userConnectedPage();
}





