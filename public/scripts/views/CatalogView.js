import AbstractView from "./AbstractView.js";
import { loadMovies } from "../catalog.js";
import { loadNavbar } from "../navbar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("MovieCatalog");
        this.pathName = "/public/views/catalog.html"
    }

    start() {
        loadNavbar();
        loadMovies(this.params.pageNum ? parseInt(this.params.pageNum) : 1);
    }
}   