$(document).ready(function () {
    $("#signup-form").validate({
        rules: {
            userName: "required",
            password: {
                required: true,
                minlength: 6
            },
            confirm_password: {
                required: true,
                minlength: 6,
                equalTo: "#password" 
            },
            email: {
                required: true,
                email: true
            },
            name: "required",
            birthDate: "required",
        },
        messages: {
            userName: "Введите логин",
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
            birthDate: "Введите дату рождения",
        }
    });
});