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
        movieInfoContainer.find(".movie-title").text(json.name);
        movieInfoContainer.find(".brief-description").text(json.description);
        movieInfoContainer.find(".movie-poster").attr("src", json.poster);
        movieInfoContainer.find(".movie-year").text(json.year);
        movieInfoContainer.find(".movie-country").text(json.country);
        //movieInfoContainer.find(".movie-genres").text(json.description);
        movieInfoContainer.find(".movie-time").text(json.time);
        movieInfoContainer.find(".movie-tagline").text(json.tagline);
        movieInfoContainer.find(".movie-director").text(json.director);
        movieInfoContainer.find(".movie-budget").text(json.budget);
        movieInfoContainer.find(".movie-fees").text(json.fees);
        movieInfoContainer.find(".movie-age-limit").text(json.ageLimit);
    });
}