$(document).ready(function () {
    $("#signup-form").validate({
        // in 'rules' user have to specify all the constraints for respective fields
        rules: {
            login: "required",
            // lastname: "required",
            // username: {
            //     required: true,
            //     minlength: 2 //for length of lastname
            // },
            password: {
                required: true,
                minlength: 6
            },
            confirm_password: {
                required: true,
                minlength: 6,
                equalTo: "#password" //for checking both passwords are same or not
            },
            email: {
                required: true,
                email: true
            },
            name: "required",
        },
        // in 'messages' user have to specify message as per rules
        messages: {
            login: "Введите логин",
            // lastname: " Please enter your lastname",
            // username: {
            //     required: " Please enter a username",
            //     minlength: " Your username must consist of at least 2 characters"
            // },
            password: {
                required: "Введите пароль",
                minlength: "Минимальная длина пароля - 6 символов"
            },
            confirm_password: {
                required: "Введите пароль",
                minlength: "Минимальная длина пароля - 6 символов",
                equalTo: "Пароль не совпадает"
            },
            email: {
                required: "Введите email",
                email: "Введите корректный email"
            },
            name: "Введите ФИО",
        }
    });
});