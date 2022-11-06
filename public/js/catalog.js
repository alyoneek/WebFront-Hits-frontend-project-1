const server = "https://react-midterm.kreosoft.space/api";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Ikh5dW4tamluIiwiZW1haWwiOiJkcmFtYV9xdWVlbkBnbWFpbC5jb20iLCJuYmYiOjE2Njc3NTA5NzAsImV4cCI6MTY2Nzc1NDU3MCwiaWF0IjoxNjY3NzUwOTcwLCJpc3MiOiJodHRwczovL3JlYWN0LW1pZHRlcm0ua3Jlb3NvZnQuc3BhY2UvIiwiYXVkIjoiaHR0cHM6Ly9yZWFjdC1taWR0ZXJtLmtyZW9zb2Z0LnNwYWNlLyJ9.-2agwuUH_fXo5X76ITkJI8GLnrq-wCp0Gt0pi0DakOA";

$(document).ready(function() {
    console.log(2)
    const observer = new MutationObserver(function() {
        loadNavbar();
        loadMovies(2);
    });

    observer.observe($("main")[0], {
        childList: true
    })
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