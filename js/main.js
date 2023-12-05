const API_KEY = '4f538816';
const movieTitle = 'The Shawshank Redemption'; // Replace with the title of the movie you want to search for

const apiUrl = `http://www.omdbapi.com/?t=${movieTitle}&apikey=${API_KEY}`;

fetch(apiUrl)
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        // Handle the data from the OMDB API here
        console.log(data);

        // Access and display the movie poster
        const posterUrl = data.Poster;
        const posterImage = document.createElement('img');
        posterImage.src = posterUrl;
        document.body.appendChild(posterImage); // You can append it to any element on your page

        // Display other movie information
        const movieTitle = data.Title;
        const movieGenre = data.Genre;
        const moviePlot = data.Plot;
        const movieRating = data.Ratings[0].Value; // Access the first rating

        // Create elements for other movie information
        const titleElement = document.createElement('h1');
        const genreElement = document.createElement('p');
        const plotElement = document.createElement('p');
        const ratingElement = document.createElement('p');

        // Set text content for the elements
        titleElement.textContent = `Title: ${movieTitle}`;
        genreElement.textContent = `Genre: ${movieGenre}`;
        plotElement.textContent = `Plot: ${moviePlot}`;
        ratingElement.textContent = `Rating: ${movieRating}`;

        // Append elements to the document
        document.body.appendChild(titleElement);
        document.body.appendChild(genreElement);
        document.body.appendChild(plotElement);
        document.body.appendChild(ratingElement); // Display the movie rating
    })
    .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error('There was a problem with the fetch operation:', error);
    });
