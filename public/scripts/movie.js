import { calculateAverageRating, genrateStringGenres, changePage } from "./common.js";
import { ApiService } from "./ApiService.js";
import { validateForm } from "./validation.js"

let movieId = "";

export function loadMovieDetails(id) {
    movieId = id;
    const apiService = new ApiService();

    let answer = apiService.getMovieDetails(movieId);
    answer.then((data) => {
        if (data.body) {
            addMovieDetails(data.body);
            addToFavoritesButton();
            addReviewBlock(data.body); 
        }
    });
}

export function registerAddingReviewEvent() {
    validateForm();

    $("#adding-review").submit(function(e) {
        e.preventDefault();

        const apiService = new ApiService();
        let objectData = getObjectData(); 

        if (objectData) {
            if ($(this).hasClass("add-review")) {
                let answer = apiService.addReview(movieId, objectData);
                answer.then((data) => {
                    if (data.body) {
                        loadMovieDetails(movieId);
                    } else if (data.error) {
                        changePage("/login");
                    }
                });
            } else {
                let answer = apiService.editReview(movieId, $(this).find("#saveBtn").data("reviewid"), objectData);
                answer.then((data) => {
                    if (data.body) {
                        loadMovieDetails(movieId);
                    } else if (data.error) {
                        changePage("/login");
                    }
                });
            }
        }
    });
}

export function registerAddToFavoritesEvent() {
    $("#addToFavoritesBtn").click(changeFavoritesMovies);
}

function changeFavoritesMovies() {
    const apiService = new ApiService();

    if ($(this).hasClass("added")) {
        let answer = apiService.deleteFavoriteMovie(movieId);
        answer.then((data) => {
            if (data.body) {
                addToFavoritesButton();
            } else if (data.error) {
                changePage("/login");
            }
        });
    } else {
        let answer = apiService.addToFavorites(movieId);
        answer.then((data) => {
            if (data.body) {
                addToFavoritesButton();
            } else if (data.error) {
                changePage("/login");
            }
        });
    }
}

function getObjectData() {
    let objectData = {};

    if ($("#reviewText").hasClass("error")) {
        return null;
    }
    objectData.reviewText = $("#reviewText").val();
    objectData.rating = parseInt($("#rating").val());
    objectData.isAnonymous = $("#isAnonymous").is(':checked');
    return objectData;
}

function addToFavoritesButton() {
    const apiService = new ApiService();

    let answer = apiService.getFavoriteMovies();
    answer.then((data) => {
        let addToFavoritesBtn = $("#addToFavoritesBtn");

        if (data.body) {
            addToFavoritesBtn.removeClass("d-none");

            if (isMovieAddedToFavorites(movieId, data.body.movies)) {
                addToFavoritesBtn.addClass("added");
            } else {
                addToFavoritesBtn.removeClass("added");
            }
        } else if (data.error) {
            addToFavoritesBtn.addClass("d-none");
        }
    });
}

function addReviewBlock(movieInfo) {
    const apiService = new ApiService();

    let answer = apiService.getProfileInfo();
    answer.then((data) => {
        setAddReviewProperties();

        if (data.body) {
            doesExistReview(movieInfo.reviews, data.body.id) ? $("#adding-review").addClass("d-none") : $("#adding-review").removeClass("d-none");
            addReviews(movieInfo.reviews, data.body.id);
        } else if (data.error) {
            $("#adding-review").addClass("d-none");
            addReviews(movieInfo.reviews);
        }
    });
}

function setAddReviewProperties() {
    let form = $("#adding-review");
    form.removeClass("edit-review");
    form.addClass("add-review");
    form.find("#saveBtn").removeAttr("data-reviewid");
    form.find("#saveBtn").removeData("reviewid");

    form.find("#reviewText").val("");
    form.find("#rating").val("10");
    form.find("#isAnonymous").prop("checked", false);
    form.find("#isAnonymous").removeAttr("disabled");
}

function isMovieAddedToFavorites(movieId, movies) {
    for (let movie of movies) {
        if (movie.id === movieId) {
            return true;
        }
    }
    return false;
}

function doesExistReview(reviews, userId) { 
    return reviews.find(review => review.author && review.author.userId === userId);
}

function addMovieDetails(details) {
    let movieInfoContainer = $("#movie-info");
    let averageRating = details.reviews.length ? calculateAverageRating(details.reviews) : 0;

    if (details.name) movieInfoContainer.find(".movie-title").text(details.name);
    movieInfoContainer.find(".movie-average-rating").text(averageRating ? averageRating : "");
    if (averageRating <= 5) {
        movieInfoContainer.find(".movie-average-rating").removeClass("green-text");
        movieInfoContainer.find(".movie-average-rating").addClass("red-text");
    } else {
        movieInfoContainer.find(".movie-average-rating").removeClass("red-text");
        movieInfoContainer.find(".movie-average-rating").addClass("green-text");
    }
    if (details.description) movieInfoContainer.find(".brief-description").text(details.description);
    if (details.name) movieInfoContainer.find(".movie-poster").attr("src", details.poster); //gdfgdfhdf
    if (details.year) movieInfoContainer.find(".movie-year").text(details.year);
    if (details.country) movieInfoContainer.find(".movie-country").text(details.country);
    if (details.genres) movieInfoContainer.find(".movie-genres").text(genrateStringGenres(details.genres));
    if (details.time) movieInfoContainer.find(".movie-time").text(`${details.time} мин`);
    if (details.tagline) movieInfoContainer.find(".movie-tagline").text(`"${details.tagline}"`);
    if (details.director) movieInfoContainer.find(".movie-director").text(details.director);
    if (details.budget) movieInfoContainer.find(".movie-budget").text(`$${details.budget.toLocaleString()}`);
    if (details.fees) movieInfoContainer.find(".movie-fees").text(`$${details.fees.toLocaleString()}`);
    if (details.ageLimit) movieInfoContainer.find(".movie-age-limit").text(`${details.ageLimit}+`);
}

function addReviews(reviews, userId) {
    let commentsContainer = $("#comments");
    commentsContainer.empty();

    if (userId && doesExistReview(reviews, userId)) {
        let userReview = doesExistReview(reviews, userId)
        addReview(commentsContainer, userReview, true);
    }

    for (let review of reviews) {
        if (!isUserReview(review, userId)) {
            addReview(commentsContainer, review, false);
        }
    }

    registerChangeReviewEvent();
}

function addReview(container, review, isUser) {
    let reviewBlock = $("#review-template").clone();
    reviewBlock.removeAttr("id");

    if (!review.isAnonymous) {
        if (review.author.avatar) {
            reviewBlock.find(".user-avatar").removeClass("anonymous");
            reviewBlock.find(".user-avatar").attr("src", review.author.avatar);
        }
        reviewBlock.find(".user-name").text(review.author.nickName);
    }

    reviewBlock.attr("data-anonymous", review.isAnonymous);
    reviewBlock.find(".comment-management").attr("data-id", review.id);
    reviewBlock.find(".comment-management").removeClass(isUser ? "d-none" : "");
    reviewBlock.find(".score-value").text(review.rating);
    reviewBlock.find(".date-value").text(new Date(review.createDateTime).toLocaleDateString());
    reviewBlock.find(".comment-text").text(review.reviewText);
    reviewBlock.addClass(review.rating > 5 ? "green" : "red");

    reviewBlock.removeClass("d-none");
    container.append(reviewBlock);
}

function registerChangeReviewEvent() {
    const apiService = new ApiService();

    $(".btn.delete").click(function() {
        let reviewId = $($(this).parent()).data("id");

        let answer = apiService.deleteReview(movieId, reviewId);
        answer.then((data) => {
            if (data.body) {
                loadMovieDetails(movieId);
            } else if (data.error) {
                changePage("/login");
            }
        });
    });

    $(".btn.edit").click(function() {
        let reviewId = $($(this).parent()).data("id");
        let review = $(this).closest(".card");
        review.addClass("d-none");

        setEditReviewProperties(review, reviewId);
    });
}

function setEditReviewProperties(review, reviewId) {
    let form = $("#adding-review");
    form.removeClass("add-review");
    form.addClass("edit-review");
    form.removeClass("d-none");

    form.find("#reviewText").val(review.find(".comment-text").text());
    form.find("#rating").val(review.find(".score-value").text());
    form.find("#isAnonymous").prop("checked", review.data("anonymous"));
    form.find("#isAnonymous").attr("disabled", true);
    form.find("#saveBtn").attr("data-reviewid", reviewId);
}

function isUserReview(review, userId) {
    return review.author && review.author.userId == userId;
}
