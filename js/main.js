// main.js

const API_KEY = '4f538816';
let moviesData = []; // Initialize moviesData as an empty array globally

// Function to create a movie card
function createMovieCard(movie) {
    const movieListContainer = document.getElementById('movie-list-container');

    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4 card';

    const posterContainer = document.createElement('div');
    posterContainer.className = 'poster-container';

    const posterElement = document.createElement('img');
    posterElement.className = 'card-img-top';
    posterElement.src = '';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const titleElement = document.createElement('h5');
    titleElement.className = 'card-title';
    titleElement.textContent = movie.title;

    const genreElement = document.createElement('p');
    genreElement.className = 'card-text';
    genreElement.textContent = `Genre: ${movie.genre}`;

    const ratingElement = document.createElement('p');
    ratingElement.className = 'card-text';
    ratingElement.textContent = `Rating: ${movie.rating}`;

    const summaryText = document.createElement('p');
    summaryText.className = 'summary-text';
    summaryText.textContent = `Summary: ${movie.movieSummary}`;

    const editButton = document.createElement('button');
    editButton.className = 'btn btn-primary btn-edit';
    editButton.textContent = 'Edit';

    cardBody.appendChild(editButton);

    editButton.addEventListener('click', function () {
        document.getElementById('editTitle').value = movie.title;
        document.getElementById('editRating').value = movie.rating;
        document.getElementById('editGenre').value = movie.genre;
        document.getElementById('editSummary').value = movie.movieSummary;

        // Add delete button to the edit form
        const deleteButton = document.getElementById("deleteButton")

        deleteButton.addEventListener('click', function () {
            const deleteIndex = moviesData.findIndex(item => item.title === movie.title);
            if (deleteIndex !== -1) {
                const jsonServerUrl = `http://localhost:3000/movies/${moviesData[deleteIndex].id}`;
                fetch(jsonServerUrl, {
                    method: 'DELETE',
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Movie deleted from the local JSON server:', data);
                        // Remove the card from the UI
                        card.remove();
                    })
                    .catch(error => {
                        console.error('Error deleting movie from the local JSON server:', error.message);
                    });

                // Remove the movie from the global array
                moviesData.splice(deleteIndex, 1);

                // Hide the edit form
                document.getElementById('editForm').style.display = 'none';
            }
        });

        document.getElementById('editForm').style.display = 'block';
    });

    posterElement.style.width = '100%';
    posterElement.style.height = '400px';

    card.appendChild(posterContainer);
    posterContainer.appendChild(posterElement);
    card.appendChild(cardBody);
    cardBody.appendChild(titleElement);
    cardBody.appendChild(genreElement);
    cardBody.appendChild(ratingElement);
    cardBody.appendChild(summaryText);
    movieListContainer.appendChild(card);

    const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(movie.title)}&apikey=${API_KEY}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Poster) {
                posterElement.src = data.Poster;
            }
        })
        .catch(error => {
            console.error(`Error fetching data for ${movie.title}:`, error.message);
        });

    posterContainer.addEventListener('mouseenter', function () {
        summaryText.style.display = 'block';
    });

    posterContainer.addEventListener('mouseleave', function () {
        summaryText.style.display = 'none';
    });
}

// Function to fetch movies data from the JSON file and create movie cards
function fetchMoviesAndCreateCards() {
    fetch('http://localhost:3000/movies')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            moviesData = data;

            // Clear the loading screen
            const loadingScreen = document.querySelector('.loading-center');
            loadingScreen.style.display = 'none';

            moviesData.forEach(movie => {
                createMovieCard(movie);
            });
        })
        .catch(error => {
            console.error('Error fetching movies data:', error.message);
        });
}

// Call the function to fetch movies data and create cards
fetchMoviesAndCreateCards();

// Event listener for the "Save" button in the edit form
document.getElementById('saveEdit').addEventListener('click', function () {
    const editedMovie = {
        id: moviesData.find(movie => movie.title === document.getElementById('editTitle').value).id,
        title: document.getElementById('editTitle').value,
        rating: document.getElementById('editRating').value,
        genre: document.getElementById('editGenre').value,
        movieSummary: document.getElementById('editSummary').value,
        // checkAndPopulateGenreDropdown(),
    };

    const editedIndex = moviesData.findIndex(movie => movie.title === editedMovie.title);

    if (editedIndex !== -1) {
        moviesData[editedIndex] = editedMovie;

        const jsonServerUrl = `http://localhost:3000/movies/${editedMovie.id}`;
        fetch(jsonServerUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedMovie),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Movie updated on the local JSON server:', data);

                // Fetch the updated list from the server and recreate movie cards
                fetch('http://localhost:3000/movies')
                    .then(response => response.json())
                    .then(data => {
                        moviesData = data;
                        // Clear the existing movie cards
                        document.getElementById('movie-list-container').innerHTML = '';
                        // Recreate movie cards
                        moviesData.forEach(movie => {
                            createMovieCard(movie);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching updated movies data:', error.message);
                    });
            })
            .catch(error => {
                console.error('Error updating movie on the local JSON server:', error.message);
            });
    }

    document.getElementById('editForm').style.display = 'none';
});

const addMovieForm = document.getElementById('add-movie-form');
addMovieForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value;

    const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Poster) {
                const newMovie = {
                    id: Date.now(),
                    title: data.Title,
                    rating: data.imdbRating,
                    movieSummary: data.Plot,
                    genre: data.Genre,
                };

                // Check if the movie title already exists
                if (!moviesData.some(movie => movie.title === newMovie.title)) {
                    moviesData.push(newMovie);
                    createMovieCard(newMovie);

                    const jsonServerUrl = 'http://localhost:3000/movies';
                    fetch(jsonServerUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newMovie),
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Movie added to the local JSON server:', data);
                        })
                        .catch(error => {
                            console.error('Error adding movie to the local JSON server:', error.message);
                        });
                } else {
                    console.log('Movie already exists in the list.');
                }
            }
        })
        .catch(error => {
            console.error(`Error fetching data for ${title}:`, error.message);
        });

    addMovieForm.reset();
});

const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', darkModeToggle.checked);
});

//search functions
const searchTitleInput = document.getElementById('searchTitle');
const searchGenreDropdown = document.getElementById('searchGenre');
const searchButton = document.getElementById('searchButton');
const searchResultsPopup = document.getElementById('searchResultsPopup');
const cancelSearchButton = document.getElementById('cancelSearch');

// Function to populate genres in the dropdown
function populateGenreDropdown() {
    // Fetch the genres from the JSON file
    fetch('data/genres.json')
        .then(response => response.json())
        .then(data => {
            const uniqueGenres = data.genres;
            const dropdownOptions = uniqueGenres.map(genre => `<option value="${genre}">${genre}</option>`).join('');
            searchGenreDropdown.innerHTML = `<option value="">All Genres</option>${dropdownOptions}`;
        })
        .catch(error => {
            console.error('Error fetching genres data:', error.message);
        });
}

function performSearch() {
    const titleQuery = searchTitleInput.value.toLowerCase();
    const genreQuery = searchGenreDropdown.value.toLowerCase();

    const filteredMovies = moviesData.filter(movie => {
        const titleMatch = movie.title.toLowerCase().includes(titleQuery);
        const genreMatch = genreQuery === '' || movie.genre.toLowerCase() === genreQuery;
        return titleMatch && genreMatch;
    });

    updateDisplayedMovies(filteredMovies);
}

// Function to update displayed movies on the main page
function updateDisplayedMovies(filteredMovies) {
    const movieListContainer = document.getElementById('movie-list-container');
    movieListContainer.innerHTML = ''; // Clear existing movies

    if (filteredMovies.length === 0) {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'No results found.';
        movieListContainer.appendChild(noResultsMessage);
    } else {
        filteredMovies.forEach(movie => {
            createMovieCard(movie);
        });
    }
}
// Event listeners
searchButton.addEventListener('click', performSearch);
cancelSearchButton.addEventListener('click', () => {
    // Reset the displayed movies to the full list when canceling the search
    updateDisplayedMovies(moviesData);
});

// Function to check if moviesData is not empty and then populate the genre dropdown
function checkAndPopulateGenreDropdown() {
    if (moviesData.length > 0) {
        // Call the function to populate genres in the dropdown
        populateGenreDropdown();
    }
}
// Call the function to populate genres in the dropdown
populateGenreDropdown();