server = "https://react-midterm.kreosoft.space/api"

$(document).ready(function() {
    loadMovieInfo("22158c42-001a-40a3-a2a7-08d9b9f3d2a2");
});

function loadMovieInfo(id) {
    fetch(`${server}/${id}`)
    .then((response) => {
        return response.json();   
    })
    .then((json) => {
        addMovieDetails(json);
        addReviews(json.reviews);
    });
}

function addMovieDetails(details) {
    let movieInfoContainer = $("#movie-info");
    let averageRating = details.reviews.length ? calculateAverageRating(details.reviews) : 0;

    movieInfoContainer.find(".movie-title").text(details.name);
    movieInfoContainer.find(".movie-average-rating").text(averageRating ? averageRating : "");
    movieInfoContainer.find(".movie-average-rating").addClass(averageRating <= 5 ? "red" : "green");
    movieInfoContainer.find(".brief-description").text(details.description);
    movieInfoContainer.find(".movie-poster").attr("src", details.poster);
    movieInfoContainer.find(".movie-year").text(details.year);
    movieInfoContainer.find(".movie-country").text(details.country);
    movieInfoContainer.find(".movie-genres").text(genrateStringGenres(details.genres));
    movieInfoContainer.find(".movie-time").text(`${details.time} мин`);
    movieInfoContainer.find(".movie-tagline").text(`"${details.tagline}"`);
    movieInfoContainer.find(".movie-director").text(details.director);
    movieInfoContainer.find(".movie-budget").text(`$${details.budget.toLocaleString()}`);
    movieInfoContainer.find(".movie-fees").text(`$${details.fees.toLocaleString()}`);
    movieInfoContainer.find(".movie-age-limit").text(`${details.ageLimit}+`);
}

function addReviews(reviews) {
    let commentsContainer = $("#comments");
    commentsContainer.empty();

    for (review of reviews) {
        let reviewBlock = $("#review-template").clone();

        if (!review.isAnonymous) {
            if (review.author.avatar) {
                reviewBlock.find(".user-avatar").removeClass("anonymous");
                reviewBlock.find(".user-avatar").attr("src", review.author.avatar);
            }
            reviewBlock.find(".user-name").text(review.author.nickName);
        }

        reviewBlock.find(".score-value").text(review.rating);
        reviewBlock.find(".date-value").text(new Date(review.createDateTime).toLocaleDateString());
        reviewBlock.find(".comment-text").text(review.reviewText);
        reviewBlock.addClass(review.rating > 5 ? "green" : "red");

        reviewBlock.removeClass("d-none");
        commentsContainer.append(reviewBlock);
    }
}

function calculateAverageRating(reviews) {
    return reviews.length === 0 ? 0 : normalizeScore(reviews.reduce((result, reviewObject) => (result + reviewObject.rating), 0) / reviews.length);
}

function normalizeScore(score) {
    return Math.round(score * 10) / 10;
}

function genrateStringGenres(genres) {
    return genres.reduce((genresArray, genreObject) => [...genresArray, genreObject.name], []).join(", ");
}