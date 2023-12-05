const API_KEY = '4f538816';

function createMovieCard(movie) {
    const movieListContainer = document.getElementById('movie-list-container');

    // Create Bootstrap card elements
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const titleElement = document.createElement('h5');
    titleElement.className = 'card-title';
    titleElement.textContent = movie.title;

    const ratingElement = document.createElement('p');
    ratingElement.className = 'card-text';
    ratingElement.textContent = `Rating: ${movie.rating}`;

    const summaryElement = document.createElement('p');
    summaryElement.className = 'card-text';
    summaryElement.textContent = `Summary: ${movie.movieSummary}`;

    const genreElement = document.createElement('p');
    genreElement.className = 'card-text';
    genreElement.textContent = `Genre: ${movie.genre}`;

    const posterElement = document.createElement('img');
    posterElement.className = 'card-img-top';
    posterElement.src = ''; // Leave it blank for now, we'll set it below

    // Set a uniform size for the poster image
    posterElement.style.width = '100%';
    posterElement.style.height = '600px'; // Adjust the height as needed

    // Append elements
    cardBody.appendChild(titleElement);
    cardBody.appendChild(ratingElement);
    cardBody.appendChild(summaryElement);
    cardBody.appendChild(genreElement);
    card.appendChild(posterElement);
    card.appendChild(cardBody);
    movieListContainer.appendChild(card);

    // Fetch the poster image and set the src attribute
    const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(movie.title)}&apikey=${API_KEY}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Poster) {
                posterElement.src = data.Poster;
            }
        })
        .catch(error => {
            console.error(`Error fetching poster for ${movie.title}:`, error.message);
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
    .then(moviesData => {
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
    const rating = document.getElementById('rating').value;

    // Create a new movie object
    const newMovie = {
        id: Date.now(), // Use a timestamp as a unique ID for simplicity
        title: title,
        rating: parseFloat(rating),
        // Add other properties as needed
    };

    // Add the new movie to the data and create a card for it
    moviesData.movies.push(newMovie);
    createMovieCard(newMovie);

    // Clear the form
    addMovieForm.reset();
});
