import AbstractView from "./AbstractView.js";
import { loadNavbar } from "../navbar.js";
import { loadMovieDetails, registerAddingReviewEvent, registerAddToFavoritesEvent } from "../movie.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("MoviePage");
        this.pathName = "/public/views/movie.html";
    }

    start() {
        loadNavbar();
        registerAddingReviewEvent();
        registerAddToFavoritesEvent();
        loadMovieDetails(this.params.movieId);
    }
}