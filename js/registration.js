$(document).ready(function () {
    $("#signup-form").submit(function (event) {
        event.preventDefault();

        let objectData = getObjectData();
        if (objectData) {
            fetch("https://react-midterm.kreosoft.space/api/account/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(objectData)
            })
            .then(response => {
                if(!response.ok) {
                    return response.json().then(text => { throw new Error(text.message) })
                }
                return response.json(); 
            })
            .then(data => console.log(data))
            .catch(error => console.log(error))     
        }
    });
});

function getFormData() {
    let inputs = $(".form-control");
    let formData = new FormData();

    for (let input of inputs) {
        if ($(input).hasClass("error")) {
            return null;
        }
        formData.append($(input).attr("id"), $(input).val());
    }
    formData.delete("confirm_password");
    return formData;
}

function getObjectData() {
    let formData = getFormData();
    if (formData) {
        let objectData = Object.fromEntries(formData);
        objectData.gender = parseInt($("#gender").val());

        return objectData;
    }
    
    return null;
}