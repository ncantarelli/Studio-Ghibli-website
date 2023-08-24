const getData = () => {
    const url = "https://ghibliapi.vercel.app";
    fetch("https://ghibliapi.vercel.app/films")
        .then((response) => {
        return response.json();
    })
        .then((result) => {
            const films = result;
            buildCards(films);
            createDirectorsDropdown(films);
            filterByDropdown(films);
            setEventListeners(films);
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
    cardsContainer.innerHTML = ""; // Clear previous cards

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
    };
        
};

const createDirectorsDropdown = (films) => {
    const dropdown = document.getElementById("directorOptions");
    const directorArray = films.map((film) => {
        return film.director;
    });

    const uniquedirectorArray = [...new Set(directorArray)];

    // // Add "Show all" option
    //   const showAllOption = document.createElement("option");
    //   showAllOption.innerText = "Show all movies";
    // dropdown.appendChild(showAllOption);
    
    uniquedirectorArray.forEach((directorName) => {
        const option = document.createElement("option");
        option.innerText = directorName;
        dropdown.appendChild(option);
    });
};

const sortMovies = (films, sortOption) => {
      const sortedFilms = [...films]; // Copy the films array to avoid modifying the original
      switch (sortOption) {
        case "oldest":
          sortedFilms.sort((a, b) => a.release_date.localeCompare(b.release_date));
          break;
        case "newest":
          sortedFilms.sort((a, b) => b.release_date.localeCompare(a.release_date));
          break;
        case "rating":
          sortedFilms.sort((a, b) => b.rt_score - a.rt_score);
        break;
        case "running-time":
              sortedFilms.sort((a, b) => b.running_time - a.running_time);
        break
      default:
      break;
      }
      return sortedFilms;
};
    
const filterByDropdown = (films, selectedDirector) => {
      return films.filter((film) => film.director === selectedDirector);
};

const setEventListeners = (films) => {
    const searchButton = document.querySelector(".search-button");
      searchButton.addEventListener("click", () => {
        const selectedDirector = document.getElementById("directorOptions").value;
        const selectedSort = document.getElementById("sortOptions").value;
        let filteredMovies = films;

        if (selectedDirector) {
          filteredMovies = filterByDropdown(films, selectedDirector);
        }

        const sortedMovies = sortMovies(filteredMovies, selectedSort);
        buildCards(sortedMovies);
      });

    const showAllButton = document.querySelector(".show-all-button");
      showAllButton.addEventListener("click", () => {
        document.getElementById("directorOptions").selectedIndex = 0;
        document.getElementById("sortOptions").selectedIndex = 0;
        buildCards(films);
      });
    };