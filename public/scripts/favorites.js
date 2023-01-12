import { ApiService } from "./ApiService.js";
import { createBasicMovieCard } from "./catalog.js";
import { changePage } from "./common.js";

export function loadFavoritesMovies() {
    const apiService = new ApiService();

    let answer = apiService.getFavoriteMovies();
    answer.then((data) => {
        if (data.body) {
            $("#favorites-list").empty();
            addFavoritesCards($("#favorites-list"), data.body.movies, $("#favorite-movie-template"))
            registerDeleteEvent();
        } else if (data.error) {
            changePage("/login");
        }
    });
}

function addFavoritesCards(container, movies, template) {
    for (let movie of movies) {
        let movieCard = createBasicMovieCard(movie, template);
        movieCard.find(".btn.delete").attr("data-id", movie.id);
        container.append(movieCard);
    }
}

function registerDeleteEvent() {
    const apiService = new ApiService();

    $(".btn.delete").click(function() {
        let answer = apiService.deleteFavoriteMovie($(this).data("id"));
        answer.then((data) => {
            if (data.body) {
                loadFavoritesMovies();
            } else if (data.error) {
                changePage("/login");
            }
        });
    });
}
