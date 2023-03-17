const gallery = document.querySelector(".gallery")
async function getworks(){
    const response = await fetch('http://localhost:5678/api/works')
    const infos = await response.json();

    return infos;
}

async function displayGallery(){
    const works = await getworks();
    console.log(works)

    works.forEach(works=> {
        const figure = document.createElement("figure")
    
        const figureImg = document.createElement("img")
        figureImg.src = works.imageUrl
        const figCaption = document.createElement("figcaption")
        figCaption.innerHTML = works.title
        gallery.appendChild(figure)
        
        figure.appendChild(figureImg)
        figure.appendChild(figCaption)
        
    });
}

displayGallery()
  .catch(error => console.error(error));

  
 