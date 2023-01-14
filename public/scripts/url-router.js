import Catalog from './views/CatalogView.js';
import Login from './views/LoginView.js';
import Signup from './views/SignupView.js';
import Profile from './views/ProfileView.js';
import Favorites from './views/FavoritesView.js';
import Movie from './views/MovieView.js';

$(window).bind('popstate', router);

$(document).ready(function () {
  preventDefaultLinksBehaviour();
  router();
});

function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}

function pathToRegex(path) {
  return new RegExp(
    '^' +
      path
        .replace(/\//g, '\\/')
        .replace(':pageNum', '([1-9]+[0-9]*)')
        .replace(':movieId', '([0-9a-f-]+)') +
      '$',
  );
}

function getParams(match) {
  const values = match.resultMatch.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((result) => result[1]);

  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    }),
  );
}

const routes = [
  { path: '/', view: Catalog },
  { path: '/:pageNum', view: Catalog },
  { path: '/movie/:movieId', view: Movie },
  { path: '/login', view: Login },
  { path: '/register', view: Signup },
  { path: '/favorites', view: Favorites },
  { path: '/profile', view: Profile },
];

async function router() {
  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      resultMatch: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.resultMatch != null);

  if (!match) {
    match = {
      route: routes[0],
      resultMatch: routes[0].path.match(pathToRegex(routes[0].path)),
    };
  }

  let view = new match.route.view(getParams(match));
  let html = await view.getHtml();
  $('main').html(html);
  view.start();
}

function preventDefaultLinksBehaviour() {
  $('body').click((e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.href);
    }

    if ($(e.target).hasClass('nav-link')) {
      $('.nav-link').removeClass('active');
      $(e.target).addClass('active');
    }
  });
}
