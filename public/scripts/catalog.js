import { ApiService } from "./ApiService.js";
import { calculateAverageRating, genrateStringGenres } from "./common.js";


export function loadMovies(currentPage) {
    const apiService = new ApiService();

    let answer = apiService.getMoviesOnPage(currentPage);
    answer.then((data) => {
        if (data.body) {
            $("#catalog").empty();
            addMoviesCards($("#catalog"), data.body.movies, $("#card-template"));
            addPaginationItems(currentPage, data.body.pageInfo.pageCount);
        }
    });
}

function getPageNumbers(total, max, current) {
    const half = Math.floor(max / 2);
    let to = max;
    
    if(current + half >= total) {
      to = total;
    } else if(current > half) {
      to = current + half ;
    }
    
    let from = Math.max(to - max, 0);
  
    return Array.from({length: Math.min(total, max)}, (_, i) => (i + 1) + from);
}

function addPaginationItems(currentPage, pageCount) {
    let pagination = $(".pagination");
    let pageNumbers =  getPageNumbers(pageCount, 3, currentPage);

    pagination.append(`
        <li class="page-item direction-item">
            <a class="page-link" href="/${currentPage - 1 >= 1 ? currentPage - 1 : 1}" tabindex="-1" aria-disabled="true" data-link><i class="fa-solid fa-angle-left"></i></a>
        </li>
    `);

    for (let number of pageNumbers) {
        pagination.append(`
            <li class="page-item num-item"><a class="page-link ${number === currentPage ? "active" : ""}" href="/${number}" data-link>${number}</a></li>
        `);
    }

    pagination.append(`
        <li class="page-item direction-item">
            <a class="page-link" href="/${currentPage + 1 <= pageCount ? currentPage + 1 : pageCount}" data-link><i class="fa-solid fa-angle-right"></i></a>
        </li>
    `);
}

function addMoviesCards(container, movies, template) {
    for (let movie of movies) {
        let movieCard = createBasicMovieCard(movie, template);
        movieCard.find(".movie-link").attr("href", `/movie/${movie.id}`);
        container.append(movieCard);
    }
}

export function createBasicMovieCard(movie, template) {
    let movieCard = template.clone();
    movieCard.removeAttr("id");
    movieCard.removeClass("d-none")
    if (movie.name) movieCard.find(".movie-title").text(movie.name);
    movieCard.find(".movie-poster").attr("src", movie.poster ? movie.poster : "/public/images/movie-poster-not-found.jpg");
    if (movie.year) movieCard.find(".movie-year").text(movie.year);
    movieCard.find(".score-value").text(calculateAverageRating(movie.reviews) === 0 ? "-" : calculateAverageRating(movie.reviews));
    if (movie.country && movie.country.length && movie.genres.length) {
        movieCard.find(".country-genres-divider").removeClass("d-none");
    }
    if (movie.country) movieCard.find(".movie-country").text(movie.country);
    movieCard.find(".movie-genres").text(genrateStringGenres(movie.genres));
    return movieCard;
}