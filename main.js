console.log(films)

function buildCards() {
    // const cardsContainer = document.getElementById("cards-container");
    const cardsContainer = document.querySelector(".row");
    console.log("cardsContainer :>> ", cardsContainer);

    for (let i = 0; i < films.length; i++){
        console.log("films[i]: ", films[i]);

        //card div
        const cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "card col-sm-12 col-md-6 col-lg-2");
        cardDiv.setAttribute("style", "width: 18rem");
        if (i % 2 == 0) {
            cardDiv.classList.add("text-bg-primary");
        } else {
            cardDiv.classList.add("text-bg-light");
        }

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

buildCards();

function sayHello() {
    alert("Hello there");
}

//! CallBacks
function one() {
    console.log("I am a callback");
}
function two(fnc) {
    console.log("I am not a callback");
    fnc();
}
two(one);

//* Without callbacks
let calculator = function (num1, num2, operationType) {
    if (operationType === "add") {
        return num1 + num2;
    } else if (operationType === "multiply") {
        return num1 * num2;
    }
}
console.log(calculator(3, 3, "multiply"));

//* Event Listener
function changeToRed(event) {
    console.log("event :>> event.target.localName");
    const regularButton = document.getElementById("regular-button");
    regularButton.classList.toggle("red");
}

function addEventListener() {
    const regularButton = document.getElementById("regular-button");
    regularButton.addEventListener("click", function () {
        regularButton.classList.toggle("red");
    })
    regularButton.addEventListener("click", changeToRed);
}
addEventListener()