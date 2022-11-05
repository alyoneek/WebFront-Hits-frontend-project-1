const server = "https://react-midterm.kreosoft.space/api";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImUiLCJlbWFpbCI6Imppbm5pQGV4YW1wbGUuY29tIiwibmJmIjoxNjY3NTcyMTc0LCJleHAiOjE2Njc1NzU3NzQsImlhdCI6MTY2NzU3MjE3NCwiaXNzIjoiaHR0cHM6Ly9yZWFjdC1taWR0ZXJtLmtyZW9zb2Z0LnNwYWNlLyIsImF1ZCI6Imh0dHBzOi8vcmVhY3QtbWlkdGVybS5rcmVvc29mdC5zcGFjZS8ifQ.x4z25gwLK1mvVF_bFiy9NVQFSItW3JhsinWHdsXc3f4";

$(document).ready(function() {
    loadMovies(2);
    loadNavbar();
});

function loadMovies(page) {
    fetch(`${server}/movies/${page.toString()}`)
    .then((response) => {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
    })
    .then((json) => {
        $("#catalog").empty();
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
            if (movie.country.length && movie.genres.length) {
                movieCard.find(".country-genres-divider").removeClass("d-none");
            }
            movieCard.find(".movie-country").text(movie.country);
            movieCard.find(".movie-genres").text(genrateStringGenres(movie.genres));

            $("#catalog").append(movieCard);
        }
    })
    .catch(error => { console.log(error) });
}

function loadNavbar() {
    $("#navbar").find("#user-name").text("");

    fetch(`${server}/account/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then((response) => {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
    })
    .then((json) => {
        $("#navbar").find("#user-name").text(json.nickName);
        $("#navbar").removeClass("unauthorized");
        $("#navbar").addClass("authorized");
    })
    .catch(error => {
        console.log(error);
        $("#navbar").removeClass("authorized");
        $("#navbar").addClass("unauthorized");
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