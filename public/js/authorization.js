$(document).ready(function () {
    $("#login-form").validate({
        rules: {
            username: "required",
            password: "required",
        },
        messages: {
            username: "Введите логин",
            password: "Введите пароль",
        }
    });

    $("#login-form").submit(function (event) {
        event.preventDefault();

        let objectData = getObjectData();
        if (objectData) {
            fetch("https://react-midterm.kreosoft.space/api/account/login", {
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
    return objectData;
}