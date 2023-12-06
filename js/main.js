// main.js

const API_KEY = '4f538816';
let moviesData; // Store movies data globally

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

        // Append delete button to the edit form
        // document.getElementById('editForm').appendChild(deleteButton);

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

// Function to update the UI with edited information
// function updateMovieCardUI(index, editedMovie) {
//     const movieListContainer = document.getElementById('movie-list-container');
//     const card = movieListContainer.children[index];
//     if (card) {
//         const titleElement = card.querySelector('.card-title');
//         const genreElement = card.querySelector('.card-text:nth-child(2)');
//         const ratingElement = card.querySelector('.card-text:nth-child(3)');
//         const summaryText = card.querySelector('.summary-text');
//
//         // Update DOM elements with edited information
//         titleElement.textContent = editedMovie.title;
//         genreElement.textContent = `Genre: ${editedMovie.genre}`;
//         ratingElement.textContent = `Rating: ${editedMovie.rating}`;
//         summaryText.textContent = `Summary: ${editedMovie.movieSummary}`;
//     }
// }

// Function to update the UI with edited information
// function updateMovieCardUI(index, editedMovie) {
//     const movieListContainer = document.getElementById('movie-list-container');
//     const card = movieListContainer.children[index];
//     if (card) {
//         const titleElement = card.querySelector('.card-title');
//         const genreElement = card.querySelector('.card-text:nth-child(2)');
//         const ratingElement = card.querySelector('.card-text:nth-child(3)');
//         const summaryText = card.querySelector('.summary-text');
//
//         // Update DOM elements with edited information
//         titleElement.textContent = editedMovie.title;
//         genreElement.textContent = `Genre: ${editedMovie.genre}`;
//         ratingElement.textContent = `Rating: ${editedMovie.rating}`;
//         summaryText.textContent = `Summary: ${editedMovie.movieSummary}`;
//
//         // Fetch updated information from the JSON server
//         const jsonServerUrl = `http://localhost:3000/movies/${editedMovie.id}`;
//         fetch(jsonServerUrl)
//             .then(response => response.json())
//             .then(data => {
//                 // Update poster if available
//                 const posterElement = card.querySelector('.card-img-top');
//                 if (data.Poster) {
//                     posterElement.src = data.Poster;
//                 }
//             })
//             .catch(error => {
//                 console.error(`Error fetching updated data for ${editedMovie.title}:`, error.message);
//             });
//     }
// }

// Fetch movies data from the JSON file
fetch('http://localhost:3000/movies')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        moviesData = data;
        moviesData.forEach(movie => {
            createMovieCard(movie);
        });
    })
    .catch(error => {
        console.error('Error fetching movies data:', error.message);
    });

// Event listener for the "Save" button in the edit form
document.getElementById('saveEdit').addEventListener('click', function () {
    const editedMovie = {
        id: moviesData.find(movie => movie.title === document.getElementById('editTitle').value).id,
        title: document.getElementById('editTitle').value,
        rating: document.getElementById('editRating').value,
        genre: document.getElementById('editGenre').value,
        movieSummary: document.getElementById('editSummary').value,
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
            }
        })
        .catch(error => {
            console.error(`Error fetching data for ${title}:`, error.message);
        });

    addMovieForm.reset();
});
