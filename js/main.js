// main.js

const API_KEY = '4f538816';
let moviesData; // Store movies data globally

function createMovieCard(movie) {
    const movieListContainer = document.getElementById('movie-list-container');

    // Create Bootstrap card elements
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4 card';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const titleElement = document.createElement('h5');
    titleElement.className = 'card-title';
    titleElement.textContent = movie.title;

    const posterContainer = document.createElement('div');
    posterContainer.className = 'poster-container';

    const posterElement = document.createElement('img');
    posterElement.className = 'card-img-top';
    posterElement.src = ''; // Leave it blank for now, we'll set it below

    const summaryContainer = document.createElement('div');
    summaryContainer.className = 'summary-container';

    const ratingElement = document.createElement('p');
    ratingElement.className = 'card-text';
    ratingElement.textContent = `Rating: ${movie.rating}`;

    const genreElement = document.createElement('p');
    genreElement.className = 'card-text';
    genreElement.textContent = `Genre: ${movie.genre}`;

    const summaryText = document.createElement('p');
    summaryText.className = 'summary-text';
    summaryText.textContent = `Summary: ${movie.movieSummary}`;

    // Set a uniform size for the poster image
    posterElement.style.width = '100%';
    posterElement.style.height = '400px'; // Adjust the height as needed

    // Append elements
    cardBody.appendChild(titleElement);
    summaryContainer.appendChild(summaryText);
    cardBody.appendChild(genreElement);
    cardBody.appendChild(ratingElement);
    posterContainer.appendChild(posterElement);
    posterContainer.appendChild(summaryContainer);
    cardBody.appendChild(posterContainer);
    card.appendChild(cardBody);
    movieListContainer.appendChild(card);

    // Fetch the poster image and set the src attribute
    const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(movie.title)}&apikey=${API_KEY}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Poster) {
                posterElement.src = data.Poster;
                ratingElement.textContent = `Rating: ${data.imdbRating}`;
                genreElement.textContent = `Genre: ${data.Genre}`;
                summaryText.textContent = `Summary: ${data.Plot}`;
            }
        })
        .catch(error => {
            console.error(`Error fetching data for ${movie.title}:`, error.message);
        });
}

// Fetch movies data from the JSON file
fetch('data/movies.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        moviesData = data; // Store movies data globally
        // Populate movie cards
        moviesData.movies.forEach(movie => {
            createMovieCard(movie);
        });
    })
    .catch(error => {
        console.error('Error fetching movies data:', error.message);
    });

// Handle the form submission (you can add this part if you want to add movies dynamically)
const addMovieForm = document.getElementById('add-movie-form');
addMovieForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get values from the form
    const title = document.getElementById('title').value;

    // Fetch additional movie data from the API
    const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Poster) {
                const newMovie = {
                    id: Date.now(), // Use a timestamp as a unique ID for simplicity
                    title: data.Title,
                    rating: data.imdbRating,
                    movieSummary: data.Plot,
                    genre: data.Genre,
                };

                // Add the new movie to the data and create a card for it
                moviesData.movies.push(newMovie);
                createMovieCard(newMovie);
            }
        })
        .catch(error => {
            console.error(`Error fetching data for ${title}:`, error.message);
        });

    // Clear the form
    addMovieForm.reset();
});
