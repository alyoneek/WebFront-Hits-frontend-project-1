const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImUiLCJlbWFpbCI6IjFAZXhhbXBsZS5jb20iLCJuYmYiOjE2NjcxMDcxMDQsImV4cCI6MTY2NzExMDcwNCwiaWF0IjoxNjY3MTA3MTA0LCJpc3MiOiJodHRwczovL3JlYWN0LW1pZHRlcm0ua3Jlb3NvZnQuc3BhY2UvIiwiYXVkIjoiaHR0cHM6Ly9yZWFjdC1taWR0ZXJtLmtyZW9zb2Z0LnNwYWNlLyJ9.IH-uVzVRjq6BtbEsbmXN5s3OTLz_x876OcGEgsFCW1Y";
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
        $("#user-avatar").attr("src", data.avatarLink);
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

                    $(this).find("#saveBtn").text("Редактировать");
                    $(this).find("#saveBtn").removeClass("save");
                    $(this).find("#saveBtn").addClass("edit");
                    $(this).find("#saveBtn").attr("id", "editBtn");

                    location.reload();
                }
            })
            .catch(error => console.log(error))     
        }
    })

    $("#profile-details").click(function(event) {
        if (event.target.id == "editBtn") {
            $(this).find("#email").removeAttr("readonly");
            $(this).find("#avatarLink").removeAttr("readonly");
            $(this).find("#name").removeAttr("readonly");
            $(this).find("#birthDate").removeAttr("readonly");
            $(this).find("#gender").removeAttr("disabled");

            $(event.target).attr("type", "button");

            $(event.target).text("Сохранить");
            $(event.target).removeClass("edit");
            $(event.target).addClass("save");
            $(event.target).attr("id", "saveBtn");
        } else if (event.target.id == "saveBtn") {
            $(event.target).attr("type", "submit");
        }
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