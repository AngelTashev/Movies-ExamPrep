import { setUserData, getUserData, getUserId, objectToArray } from "./util.js";

const apiKey = 'AIzaSyDWqtvimMFA7L5ML5BubEbi2Ks1t_NE9rI';
const databaseUrl = 'https://movies-exam-ec9a4-default-rtdb.firebaseio.com/';

const endpoints = {
    LOGIN: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',
    REGISTER: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=',
    MOVIES: 'movies',
    MOVIE_BY_ID: 'movies/',
}

function host(url) {
    let result = `${databaseUrl}${url}.json`;
    const auth = getUserData();
    if (auth !== null) {
        result += `?auth=${auth.idToken}`;
    }
    return result;
}

async function request(url, method, body) {
    let options = {
        method,
    };

    if (body) {
        Object.assign(options, {
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body),
        });
    }

    let response = await fetch(url, options);

    let data = await response.json();

    if (data && data.hasOwnProperty('error')) {
        let message = data.error.message;
        if (message === 'EMAIL_NOT_FOUND' || message === 'INVALID_PASSWORD') {
            message = 'Invalid email or password!';
        }
        throw new Error(message);
    }
    return data;
}

async function get(url) {
    return request(url, 'GET');
}

async function post(url, body) {
    return request(url, 'POST', body);
}

async function patch(url, body) {
    return request(url, 'PATCH', body);
}

async function del(url) {
    return request(url, 'DELETE');
}

export async function login(email, password) {
    let data = await post(endpoints.LOGIN + apiKey, {
        email,
        password,
        returnSecureToken: true,
    });

    setUserData(data);

    return data;
}

export async function register(email, password) {
    let data = await post(endpoints.REGISTER + apiKey, {
        email,
        password,
        returnSecureToken: true,
    });

    setUserData(data);

    return data;
}

export async function logout() {
    return sessionStorage.clear();
}

export async function createMovie(title, description, imageUrl) {

    const movie = {
        title,
        description,
        imageUrl,
        _ownerId: getUserId(),
    }

    post(host(endpoints.MOVIES), movie);

}

export async function editMovie(id, title, description, imageUrl) {

    const movie = {
        title,
        description,
        imageUrl,
    }

    patch(host(endpoints.MOVIE_BY_ID + id), movie);

}

export async function getAll() {

    const result = await get(host(endpoints.MOVIES));
    const data = objectToArray(result);

    return data;

}

export async function getByTitle(searchTitle) {

    const result = await getAll();
    searchTitle = searchTitle.toLowerCase();
    searchTitle = searchTitle.substring(1, searchTitle.length-1);
    const data = result.filter(e => {
        const movieTitle = e.title.toLowerCase();
        return movieTitle.includes(searchTitle);
    });

    return data;

}

export async function getById(id) {

    const data = await get(host(endpoints.MOVIE_BY_ID + id));
    data._id = id;

    return data;

}

export async function deleteById(id) {
    return await del(host(endpoints.MOVIE_BY_ID + id));
}

export async function likeById(id) {
    const data = await getById(id);

    if (!data.likes) {
        data.likes = [];
    }

    data.likes.push(getUserId());

    return patch(host(endpoints.MOVIE_BY_ID + id), data);
}