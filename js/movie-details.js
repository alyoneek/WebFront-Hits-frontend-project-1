server = "https://react-midterm.kreosoft.space/api/movies/details"

$(document).ready(function() {
    loadMovieInfo("7eae1e59-d6c5-4316-a2af-08d9b9f3d2a2");
    console.log(1)
});

function loadMovieInfo(id) {
    fetch(`${server}/${id}`)
    .then((response) => {
        return response.json();   
    })
    .then((json) => {
        let movieInfoContainer = $("#movie-info");
        let averageRating = json.reviews.length ? calculateAverageRating(json.reviews) : 0;

        movieInfoContainer.find(".movie-title").text(json.name);
        movieInfoContainer.find(".movie-average-rating").text(averageRating === 0 ? "-" : averageRating);
        movieInfoContainer.find(".movie-average-rating").addClass(averageRating <= 5 && averageRating > 0 ? "red" : "green");
        movieInfoContainer.find(".brief-description").text(json.description);
        movieInfoContainer.find(".movie-poster").attr("src", json.poster);
        movieInfoContainer.find(".movie-year").text(json.year);
        movieInfoContainer.find(".movie-country").text(json.country);
        movieInfoContainer.find(".movie-genres").text(genrateStringGenres(json.genres));
        movieInfoContainer.find(".movie-time").text(`${json.time} мин`);
        movieInfoContainer.find(".movie-tagline").text(`"${json.tagline}"`);
        movieInfoContainer.find(".movie-director").text(json.director);
        movieInfoContainer.find(".movie-budget").text(`$${json.budget.toLocaleString()}`);
        movieInfoContainer.find(".movie-fees").text(`$${json.fees.toLocaleString()}`);
        movieInfoContainer.find(".movie-age-limit").text(`${json.ageLimit}+`);
    });
}

function calculateAverageRating(reviews) {
    return reviews.length === 0 ? 0 : normalizeScore(reviews.reduce((result, reviewObject) => (result + reviewObject.rating), 0) / reviews.length);
}

function normalizeScore(score) {
    return Math.round(score * 10) / 10;
}

function genrateStringGenres(genres) {
    return genres.reduce((genresArray, genreObject) => [...genresArray, genreObject.name], []).join(", ");
}