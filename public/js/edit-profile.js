const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Ikh5dW4tamluIiwiZW1haWwiOiJkcmFtYV9xdWVlbkBnbWFpbC5jb20iLCJuYmYiOjE2Njc1ODEwODYsImV4cCI6MTY2NzU4NDY4NiwiaWF0IjoxNjY3NTgxMDg2LCJpc3MiOiJodHRwczovL3JlYWN0LW1pZHRlcm0ua3Jlb3NvZnQuc3BhY2UvIiwiYXVkIjoiaHR0cHM6Ly9yZWFjdC1taWR0ZXJtLmtyZW9zb2Z0LnNwYWNlLyJ9.Gh4NqAA67ZQZlzwK-9vitYpN6uvkRZl4Jp0P8ds9XDc";
$(document).ready(function() {
    fetch("https://react-midterm.kreosoft.space/api/account/profile", {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
    })
    .then(data => {
        if (data.avatarLink) {
            $("#user-avatar").attr("src", data.avatarLink);
        }
        
        let profileDetails = $("#profile-details");
        profileDetails.find(".nickName").text(data.nickName);
        profileDetails.find("#email").val(data.email);
        profileDetails.find("#avatarLink").val(data.avatarLink);
        profileDetails.find("#name").val(data.name);
        profileDetails.find("#birthDate").val(new Date(data.birthDate).toLocaleDateString().split('.').reverse().join('-'));
        profileDetails.find("#gender").val(data.gender);
    })
    .catch(error => console.log(error));

    $("#profile-details").validate({
        rules: {
            email: "required",
            name: "required",
            birthDate: "required",
        },
        messages: {
            email: "введите email",
            name: "Введите ФИО",
            birthDate: "Введите дату рождения",
        }
    });

    $("#profile-details").submit(function(event) {
        event.preventDefault();

        let objectData = getObjectData();
        if (objectData) {
            console.log(objectData)
            fetch("https://react-midterm.kreosoft.space/api/account/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(objectData)
            })
            .then(response => {
                if(!response.ok) {
                    return response.json().then(text => { throw new Error(text.message) })
                } else {
                    $(this).find("#email").attr("readonly", "readonly");
                    $(this).find("#avatarLink").attr("readonly", "readonly");
                    $(this).find("#name").attr("readonly", "readonly");
                    $(this).find("#birthDate").attr("readonly", "readonly");
                    $(this).find("#gender").attr("disabled", "readonly");

                    $("#saveBtn").addClass("d-none");
                    $("#editBtn").removeClass("d-none");

                    location.reload(); //кринж
                }
            })
            .catch(error => console.log(error));     
        }
    })

    $("#editBtn").click(function() {
        let form = $("#profile-details");
        form.find("#email").removeAttr("readonly");
        form.find("#avatarLink").removeAttr("readonly");
        form.find("#name").removeAttr("readonly");
        form.find("#birthDate").removeAttr("readonly");
        form.find("#gender").removeAttr("disabled");

        $(this).addClass("d-none");
        $("#saveBtn").removeClass("d-none");
    });
});

function getObjectData() {
    let inputs = $(".form-control");
    let objectData = {};

    for (let input of inputs) {
        if ($(input).hasClass("error")) {
            return null;
        }
        let key = $(input).attr("id");
        let value = $(input).val()
        objectData[key] = value;
    }
    objectData.gender = parseInt($("#gender").val());
    return objectData;
}