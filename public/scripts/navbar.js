import { ApiService } from "./ApiService.js";
import { changePage } from "./common.js";

export function loadNavbar() {
    $("#navbar").find("#user-name").text("");

    const apiService = new ApiService();
    let answer = apiService.getProfileInfo();
    answer.then((data) => {
        if (data.body) {
            setAauthorizedHeader(data.body.nickName);
        } else if (data.error) {
            $("#navbar").removeClass("authorized");
            setUnaauthorizedHeader();
        }
    });

    registerLogoutEvent()
}

function setAauthorizedHeader(nickName) {
    $("#navbar").find("#user-name").text(nickName);
    $("#navbar").removeClass("unauthorized");
    $("#navbar").addClass("authorized");
}

function setUnaauthorizedHeader() {
    $("#navbar").removeClass("authorized");
    $("#navbar").addClass("unauthorized");
}

function registerLogoutEvent() {
    const apiService = new ApiService();

    $("#logout").click(function() {
        let answer = apiService.logout();
        answer.then((data) => {
            if (data.body) {
                localStorage.setItem("token", "");
                changePage("/");
            } else if (data.error) {
                changePage("/login");
            }
        });
    });
}