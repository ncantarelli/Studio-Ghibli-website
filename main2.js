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

// Movie cards function

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

// Filter box and dropdowns

const createDirectorsDropdown = (films) => {
    const dropdown = document.getElementById("directorOptions");
    const directorArray = films.map((film) => {
        return film.director;
    });

    const uniquedirectorArray = [...new Set(directorArray)];
    
      const showAllOption = document.createElement("option");
      showAllOption.value = "All Directors";
      showAllOption.innerText = "All Directors";
      dropdown.appendChild(showAllOption);
    
    uniquedirectorArray.forEach((directorName) => {
        const option = document.createElement("option");
        option.value = directorName;
        option.innerText = directorName;
        dropdown.appendChild(option);
    });

};

const sortMovies = (films, sortOption) => {
      const sortedFilms = [...films]; // Copies the films array to avoid modifying the original
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
      if (selectedDirector === "All Directors") {
        return films;
      }
      return films.filter((film) => film.director === selectedDirector);
};

// Event listeners

const setEventListeners = (films) => {
      const searchButton = document.querySelector(".search-button");

      const dateSlider = document.getElementById("dateSlider");
      noUiSlider.create(dateSlider, {
        start: [1986, 2023], // Start and end years
        connect: true,
        range: {
          min: 1986,
          max: 2023,
        },
        tooltips: [true, true], // Show tooltips
        format: {
          to: (value) => Math.floor(value), // Display whole years
          from: (value) => parseFloat(value),
        },
      });
  
      // Event listener on slider for the "input" event
      slider.addEventListener("input", () => {
        updateFilteredMovies(films);
      });
  
      searchButton.addEventListener("click", () => {
        const selectedDirector = document.getElementById("directorOptions").value;
        const selectedSort = document.getElementById("sortOptions").value;

        let filteredMovies = films;

        if (selectedDirector !== "All Directors") {
            filteredMovies = filterByDropdown(films, selectedDirector);
        }

        const sortedMovies = sortMovies(filteredMovies, selectedSort);
            buildCards(sortedMovies);
            updateFilteredMovies(sortedMovies); // Updates based on the selected date range
      });
  
      const showAllButton = document.querySelector(".show-all-button");
      showAllButton.addEventListener("click", () => {
        document.getElementById("directorOptions").selectedIndex = 0;
        document.getElementById("sortOptions").selectedIndex = 0;
        dateSlider.noUiSlider.set([1986, 2023]); // Resets date slider
        buildCards(films);
      });
};
    
const filterByDateRange = (films, minYear, maxYear) => {
      return films.filter((film) => {
        const releaseYear = parseInt(film.release_date.split("-")[0]);
        return releaseYear >= minYear && releaseYear <= maxYear;
      });
};

// Custom Slider that hopefully works once I delete the noUIslider library

const slider = document.getElementById("dateSlider");
const handle1 = document.getElementById("handle-1");
const handle2 = document.getElementById("handle-2");
const tooltip1 = document.getElementById("tooltip-1");
const tooltip2 = document.getElementById("tooltip-2");

let isDragging = false;
let activeHandle = null;

// Function to update tooltip position and value
function updateTooltip(handle, tooltip) {
  const handleRect = handle.getBoundingClientRect();
  const sliderRect = slider.getBoundingClientRect();
  tooltip.style.left = `${handleRect.left - sliderRect.left + handleRect.width / 2}px`;
  tooltip.textContent = handle.dataset.value;
}

function updateTooltips() {
  tooltip1.textContent = handle1.dataset.value;
  tooltip2.textContent = handle2.dataset.value;
}

// For making the handles work
handle1.dataset.value = "1986";
handle2.dataset.value = "2023";
updateTooltip(handle1, tooltip1);
updateTooltip(handle2, tooltip2);

// Event listeners for mouse and touch events
function startDragging(event, handle) {
  isDragging = true;
  activeHandle = handle;
}

function stopDragging() {
  isDragging = false;
  activeHandle = null;
  updateTooltips(); // Updates the tooltips after dragging stops
}

function drag(event) {
  if (!isDragging || !activeHandle) return;

  const sliderRect = slider.getBoundingClientRect();
  const newValue = ((event.clientX - sliderRect.left) / sliderRect.width) * 100;
  
  // Ensure the value stays within the slider bounds (0 to 100)
  const clampedValue = Math.min(100, Math.max(0, newValue));

  // Update the handle's position and value
  activeHandle.style.left = `${clampedValue}%`;
  activeHandle.dataset.value = Math.floor(1986 + (clampedValue / 100) * (2023 - 1986)); // Adjust the value range

  // Update the tooltip position and value
  updateTooltip(activeHandle, activeHandle === handle1 ? tooltip1 : tooltip2);
}

// Calling Event listeners for the range slider
handle1.addEventListener("mousedown", (e) => startDragging(e, handle1));
handle2.addEventListener("mousedown", (e) => startDragging(e, handle2));
window.addEventListener("mousemove", drag);
window.addEventListener("mouseup", stopDragging);

handle1.addEventListener("touchstart", (e) => startDragging(e.touches[0], handle1));
handle2.addEventListener("touchstart", (e) => startDragging(e.touches[0], handle2));
window.addEventListener("touchmove", (e) => drag(e.touches[0]));
window.addEventListener("touchend", stopDragging);

function updateFilteredMovies(films) {
  const selectedMinYear = parseInt(handle1.dataset.value);
  const selectedMaxYear = parseInt(handle2.dataset.value);

  const filteredMovies = filterByDateRange(films, selectedMinYear, selectedMaxYear);

  buildCards(filteredMovies);
}
updateTooltips();

// Show more/Show less button
function showMoreButton() {
  var dots = document.getElementById("dots");
  var moreText = document.getElementById("more");
  var btnText = document.getElementById("myButton");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Show more ↓";
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Show less ↑";
    moreText.style.display = "inline";
  }
}

getData().then((films) => {
  setEventListeners(films);

  // Updates the filtered movies based on the default slider values
  updateFilteredMovies(films);
});

