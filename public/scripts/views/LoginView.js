import AbstractView from "./AbstractView.js";
import { loadNavbar } from "../navbar.js";
import { submitAuthorizationForm } from "../login.js";


export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("LoginPage");
        this.pathName = "/public/views/login.html";
    }

    start() {
        loadNavbar();
        submitAuthorizationForm();
    }
}