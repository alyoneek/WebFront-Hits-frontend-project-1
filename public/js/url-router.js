$(window).bind("popstate", router);

$(document).ready(function() {
    console.log(3)
    preventDefaultLinksBehaviour();
    router();
});

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
};

const routes = [
    { path: "/", view: "/public/views/catalog.html" },
    { path: "/login", view: "/public/views/login.html" },
    { path: "/register", view: "/public/views/signin.html" },
    { path: "/favorites", view: "/public/views/catalog.html" },
    { path: "/profile", view: "/public/views/profile.html" },
];

async function router() {
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        }
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

    if (!match) {
        match = {
            route: routes[0],
            isMatch: true
        }
    }; 

    // возможно, переделать, как в видео было через классы
    let view = match.route.view;
    let html = await fetch(view).then((response) => response.text());
    $("main").html(html);
};

function preventDefaultLinksBehaviour() {
    $("body").click((e) => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
}