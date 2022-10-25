const server = "https://react-midterm.kreosoft.space/api/movies"

$(document).ready(function() {
    loadMovies(1);
});

function loadMovies(page) {
    $("#catalog").empty();
    fetch(server + "/" + page.toString())
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        let template = $("#card-template");
        for (movie of json.movies) {
            let movieCard = template.clone();
            movieCard.removeAttr("id");
            movieCard.removeClass("d-none")
            movieCard.data("id", movie.id);
            movieCard.find(".movie-title").text(movie.name);
            movieCard.find(".movie-poster").attr("src", movie.poster);
            movieCard.find(".movie-year").text(movie.year);
            movieCard.find(".score-value").text(calculateAverageRating(movie.reviews) === 0 ? "-" : calculateAverageRating(movie.reviews));

            $("#catalog").append(movieCard);
        }
    });
}

function calculateAverageRating(reviews) {
    return reviews.length === 0 ? 0 : normalizeScore(reviews.reduce((result, review) => (result + review.rating), 0) / reviews.length);
}

function normalizeScore(score) {
    return Math.round(score * 10) / 10;
}