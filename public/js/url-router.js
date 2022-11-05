$(document).ready(function() {
    preventDefaultLinksBehaviour();
    router();
});

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
};

const routes = [
    { path: "/", view: () => console.log("Movie") },
    { path: "/login", view: () => console.log("Login") },
    { path: "/register", view: () => console.log("Register") },
    { path: "/favorites", view: () => console.log("Favorites") },
    { path: "/profile", view: () => console.log("Profile") },
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

    console.log(match.route.view())
};

function preventDefaultLinksBehaviour() {
    $("body").click((e) => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
}