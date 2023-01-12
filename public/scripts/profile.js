import { validateForm } from "./validation.js";
import { ApiService } from "./ApiService.js";
import { getObjectFromInputs, changePage } from "./common.js"

export function loadProfile() {
    const apiService = new ApiService();

    let answer = apiService.getProfileInfo();
    answer.then((data) => {
        if (data.body) {
            addProfileInfo(data.body);
        } else if (data.error) {
            changePage("/login");
        }
    });
}

function addProfileInfo(info) {
    $("#user-avatar").attr("src", info.avatarLink ? info.avatarLink : "/public/images/user-icon.png");
            
    let profileDetails = $("#profile-form");
    profileDetails.attr("data-id", info.id);
    profileDetails.find("#nickName").text(info.nickName);
    profileDetails.find("#email").val(info.email);
    profileDetails.find("#avatarLink").val(info.avatarLink);
    profileDetails.find("#name").val(info.name);
    profileDetails.find("#birthDate").val(new Date(info.birthDate).toLocaleDateString().split('.').reverse().join('-'));
    profileDetails.find("#gender").val(info.gender);
}

export function registerEditProfileEvent() {
    $("#editBtn").click(function() {
        enableFields($("#profile-form"));
        $(this).addClass("d-none");
        $("#saveBtn").removeClass("d-none");
    });
}

export function registerSaveProfileEvent() {
    validateForm();

    $("#profile-form").submit(function (event) {
        event.preventDefault();

        const apiService = new ApiService();
        let objectData = getObjectFromInputs();

        if (objectData) {
            objectData.nickName = $(this).find("#nickName").text();
            objectData.id = $(this).data("id");
            objectData.gender = parseInt($("#gender").val());   

            let answer = apiService.editProfile(objectData);
            answer.then((data) => {
                if (data.body) {
                    disableFields($(this));
                    $("#saveBtn").addClass("d-none");
                    $("#editBtn").removeClass("d-none");
                    loadProfile();
                } else if (data.error) {
                    changePage("/login");
                }
            });
        }
    });
};

function enableFields(form) {
    form.find("#email").removeAttr("readonly");
    form.find("#avatarLink").removeAttr("readonly");
    form.find("#name").removeAttr("readonly");
    form.find("#birthDate").removeAttr("readonly");
    form.find("#gender").removeAttr("disabled");
}

function disableFields(form) {
    form.find("#email").attr("readonly", "readonly");
    form.find("#avatarLink").attr("readonly", "readonly");
    form.find("#name").attr("readonly", "readonly");
    form.find("#birthDate").attr("readonly", "readonly");
    form.find("#gender").attr("disabled", "readonly");
}