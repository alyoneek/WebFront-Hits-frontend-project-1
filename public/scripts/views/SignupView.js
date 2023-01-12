import AbstractView from "./AbstractView.js";
import { loadNavbar } from "../navbar.js";
import { submitAuthorizationForm } from "../login.js";


export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("SigninPage");
        this.pathName = "/public/views/signup.html";
    }

    start() {
        loadNavbar();
        submitAuthorizationForm();
    }
}