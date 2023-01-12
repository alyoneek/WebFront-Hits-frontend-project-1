import AbstractView from "./AbstractView.js";
import { loadNavbar } from "../navbar.js";
import { loadFavoritesMovies } from "../favorites.js";


export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("FavoritesPage");
        this.pathName = "/public/views/favorites.html";
    }

    start() {
        loadNavbar();
        loadFavoritesMovies();
    }
}