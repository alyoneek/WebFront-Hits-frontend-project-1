server = "https://react-midterm.kreosoft.space/api"

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImUiLCJlbWFpbCI6Imppbm5pQGV4YW1wbGUuY29tIiwibmJmIjoxNjY3NDc4ODUyLCJleHAiOjE2Njc0ODI0NTIsImlhdCI6MTY2NzQ3ODg1MiwiaXNzIjoiaHR0cHM6Ly9yZWFjdC1taWR0ZXJtLmtyZW9zb2Z0LnNwYWNlLyIsImF1ZCI6Imh0dHBzOi8vcmVhY3QtbWlkdGVybS5rcmVvc29mdC5zcGFjZS8ifQ.1GW-s4hx5ZNjLnw0O4gO1JMgDxrS_qgl_KRVMzrWG60";
const movieId = "22158c42-001a-40a3-a2a7-08d9b9f3d2a2";


$(document).ready(function() {
    $("#addToFavoritesBtn").click(changeFavoritesMovies); //вынести
    $("#adding-review").submit(function(e) {
        e.preventDefault();

        let objectData = getObjectData(); 
        console.log($(this).find(".btn.save").data("reviewid"))
        fetch(`${server}/movie/${movieId}/review/${$(this).hasClass("add-review") ? "add" : `${$(this).find(".btn.save").data("reviewid")}/edit`}`, {
            method: $(this).hasClass("add-review") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(objectData)
        })
        .then(response => {
            if (!response.ok) throw Error(response.statusText);
            getMovieInfo(movieId);
        })
        .catch(error => console.log(error));
    });

    getMovieInfo(movieId); //переименовать
});

function getObjectData() {
    let objectData = {};

    objectData.reviewText = $("#reviewText").val();
    objectData.rating = parseInt($("#rating").val());
    objectData.isAnonymous = $("#isAnonymous").is(':checked');
    return objectData;
}

function getMovieInfo(id) { //не обработаны ошибки
    fetch(`${server}/movies/details/${id}`)
    .then((response) => {
        return response.json();   
    })
    .then((json) => {
        addMovieDetails(json);
        addToFavoritesButton();
        addReviewField(json); //переименовать
        //addReviews(json.reviews);
    }); 
}

function addToFavoritesButton() {
    fetch(`${server}/favorites`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            $("#addToFavoritesBtn").addClass("d-none");
            throw Error(response.statusText);
        } else {
            $("#addToFavoritesBtn").removeClass("d-none");
            return response.json();
        }
    })
    .then(data => {
        let addToFavoritesBtn = $("#addToFavoritesBtn");
        if (isMovieAdded(movieId, data.movies)) {
            addToFavoritesBtn.addClass("added");
        } else {
            addToFavoritesBtn.removeClass("added");
        }
    })
    .catch(error => console.log(error));
}

function addReviewField(movieInfo) {
    fetch(`${server}/account/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        $("#adding-review").removeClass("edit-review");
        $("#adding-review").addClass("add-review");
        $("#adding-review").find(".btn.save").removeAttr("data-reviewid");
        $("#adding-review").find(".btn.save").removeData("reviewid");

        $("#adding-review").find("#reviewText").val("");
        $("#adding-review").find("#rating").val("10");
        $("#adding-review").find("#isAnonymous").prop("checked", false);
        $("#adding-review").find("#isAnonymous").removeAttr("disabled");

        if (!response.ok) {
            $("#adding-review").addClass("d-none");
            addReviews(movieInfo.reviews);
            throw Error(response.statusText);
        } else {
            return response.json();
        }
    })
    .then(data => {
        hasLeftReview(movieInfo.reviews, data.id) ? $("#adding-review").addClass("d-none") : $("#adding-review").removeClass("d-none");
        addReviews(movieInfo.reviews, data.id);
    })
    .catch(error => console.log(error));
}

function changeFavoritesMovies() {
    if ($(this).hasClass("added")) {
        console.log(1)
        fetch(`${server}/favorites/${movieId}/delete`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) throw Error(response.statusText);
            addToFavoritesButton()
        })
        .catch(error => console.log(error));
    } else {
        console.log(2)
        fetch(`${server}/favorites/${movieId}/add`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) throw Error(response.statusText);
            addToFavoritesButton()
        })
        .catch(error => console.log(error));
    }
}

function isMovieAdded(movieId, movies) {
    for (let movie of movies) {
        if (movie.id === movieId) {
            return true;
        }
    }
    return false;
}

function hasLeftReview(reviews, userId) { //переимменовать
    return reviews.find(review => review.author && review.author.userId === userId);
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

function addReviews(reviews, userId) {
    let commentsContainer = $("#comments");
    commentsContainer.empty();

    if (userId && hasLeftReview(reviews, userId)) {
        let userReview = hasLeftReview(reviews, userId)
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
    $(".btn.delete").click(function() {
        let reviewId = $($(this).parent()).data("id");

        fetch(`${server}/movie/${movieId}/review/${reviewId}/delete`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            getMovieInfo(movieId);
        })
        .catch((error) => console.log(error));
    });

    $(".btn.edit").click(function() {
        let reviewId = $($(this).parent()).data("id");
        let review = $(this).closest(".card");
        review.addClass("d-none");

        $("#adding-review").removeClass("add-review");
        $("#adding-review").addClass("edit-review");
        $("#adding-review").removeClass("d-none");

        $("#adding-review").find("#reviewText").val(review.find(".comment-text").text());
        $("#adding-review").find("#rating").val(review.find(".score-value").text());
        $("#adding-review").find("#isAnonymous").prop("checked", review.data("anonymous"));
        $("#adding-review").find("#isAnonymous").attr("disabled", true);
        $("#adding-review").find(".btn.save").attr("data-reviewid", reviewId);
        console.log(1)
    });
}

function isUserReview(review, userId) {
    return review.author && review.author.userId == userId;
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