export class ApiService {
    _urlBase = "https://react-midterm.kreosoft.space/api";

    async get(url) {
        try {
            const response = await fetch(`${this._urlBase}${url}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
    
            let data = {};
    
            if (!response.ok) {
                data.error = response.statusText;
            } else {
                data.body = await response.json();
            }
            return (data);
        } 
        catch(error) {
            console.log(error);
        } 
    }

    async post(url) {
        try {
            const response = await fetch(`${this._urlBase}${url}`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
    
            let data = {};
    
            if (!response.ok) {
                data.error = response;
            } else {
                data.body = response;
            }
            
            return (data);
        } 
        catch(error) {
            console.log(error);
        } 
    }

    async postWithBody(url, body) {
        try {
            const response = await fetch(`${this._urlBase}${url}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(body)
            });
    
            let data = {};
    
            if (!response.ok) {
                data.error = response;
            } else {
                data.body = response;
            }
            
            return (data);
        } 
        catch(error) {
            console.log(error);
        } 
    }

    async put(url, body) {
        try {
            const response = await fetch(`${this._urlBase}${url}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(body)
            });
            
            let data = {};
    
            if (!response.ok) {
                data.error = response;
            } else {
                data.body = response;
            }
            
            return (data);
        } 
        catch(error) {
            console.log(error);
        } 
    }

    async delete(url) {
        try {
            const response = await fetch(`${this._urlBase}${url}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            
            let data = {};
    
            if (!response.ok) {
                data.error = response;
            } else {
                data.body = response;
            }
            
            return (data);
        } 
        catch(error) {
            console.log(error);
        } 
    }

    getMoviesOnPage(pageNum) {
        return this.get(`/movies/${pageNum}`);
    }

    getMovieDetails(movieId) {
        return this.get(`/movies/details/${movieId}`);
    }

    getProfileInfo() {
        return this.get(`/account/profile`);
    }

    getFavoriteMovies() {
        return this.get(`/favorites`);
    }

    async register(body) {
        let response = await this.postWithBody(`/account/register`, body);
        if (response.body) {
            response.body = await response.body.json();
        } else if (response.error) {
            response.error = await response.error.json();
        }
        return(response);
    }

    async login(body) { 
        let response = await this.postWithBody(`/account/login`, body);
        if (response.body) {
            response.body = await response.body.json();
        } else if (response.error) {
            response.error = await response.error.json();
        }
        return(response);
    }

    logout() {
        return this.post(`/account/logout`);
    }

    async addToFavorites(movieId) {
        return this.post(`/favorites/${movieId}/add`);
    }

    addReview(movieId, body) {
        return this.postWithBody(`/movie/${movieId}/review/add`, body);
    }

    editReview(movieId, reviewId, body) {
        return this.put(`/movie/${movieId}/review/${reviewId}/edit`, body);
    }

    editProfile(body) {
        return this.put(`/account/profile`, body);
    }

    deleteFavoriteMovie(movieId) {
        return this.delete(`/favorites/${movieId}/delete`);
    }

    deleteReview(movieId, reviewId) {
        return this.delete(`/movie/${movieId}/review/${reviewId}/delete`);
    }
}
