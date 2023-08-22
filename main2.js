const getData = () => {
    const url = "https://ghibliapi.vercel.app";
    fetch("https://ghibliapi.vercel.app/films")
        .then((response) => {
        return response.json();
    })
        .then((result) => {
            const films = result;
            buildCards(films);
            return result;
        })
        .catch((error) => {
            console.log("error :>> ", error);
        })
}

getData();

function buildCards(films) {
    const cardsContainer = document.querySelector(".row");
    console.log("cardsContainer :>> ", cardsContainer);

    for (let i = 0; i < films.length; i++){
        console.log("films[i]: ", films[i]);

        //card div
        const cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "card col-sm-12 col-md-6 col-lg-3");
        cardDiv.setAttribute("style", "width: 23.75rem");

        //image
        const image = document.createElement("img");
        image.setAttribute("src", films[i].image);
        image.setAttribute("alt", films[i].title);
        image.setAttribute("class", "card-img-title");
        cardDiv.appendChild(image);

        cardsContainer.appendChild(cardDiv);

        //card body
        const cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");
        cardDiv.appendChild(cardBody);

        //card header
        const h5 = document.createElement("h5");
        h5.classList.add("card-title");
        h5.innerText = films[i].title;
        cardBody.appendChild(h5);

        //p description
        const p = document.createElement("p");
        p.setAttribute("class", "card-text");
        p.innerText = films[i].description;
        cardBody.appendChild(p)
    }
        
}

