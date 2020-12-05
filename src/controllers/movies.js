import { createMovie, deleteById, editMovie, getAll, getById, likeById, getByTitle } from "../data.js";
import { addPartials, displaySuccessMessage, getUserId } from "../util.js";

let errorBox;

export async function homePage() {

    await addPartials(this);

    const context = {};
    context.user = this.app.userData;

    if (context.user) {
        const search = this.params.search;
        if (search) {
            context.movies = await getByTitle(search);
        } else {
            console.log('here')
            context.movies = await getAll();
        }
        const moviePartial = await this.load('/src/templates/movies/movie.hbs');
        this.partials.movie = moviePartial;
    }

    await this.partial('/src/templates/movies/homePage.hbs', context);

    displaySuccessMessage(this);
}

export async function createPage() {

    if(!checkLogin(this)) return this.redirect('/login');

    await addPartials(this);
    await this.partial('/src/templates/movies/createPage.hbs');
    loadMessageElement();
}

export async function postCreate(ctx) {

    if(!checkLogin(ctx)) return this.redirect('/login');

    try {
        const { title, description, imageUrl } = ctx.params;
        if (!title || !description || !imageUrl) {
            throw new Error('Invalid inputs!');
        }

        await createMovie(title, description, imageUrl);
        setTimeout(function () {
            ctx.app.message = 'Created successfully';
            ctx.redirect('/home');
        }, 500);
    } catch (err) {
        errorBox.parentElement.style.display = 'block';
        errorBox.innerHTML = err.message;
        console.clear();
    }
}

export async function detailsPage() {

    if(!checkLogin(this)) return this.redirect('/login');

    await addPartials(this);

    const result = await getById(this.params.id);
    const userId = await getUserId();

    const movie = Object.assign(result, {
        _isCreator: result._ownerId === userId,
        _isLiked: result.likes ? result.likes.includes(userId) : false,
        _likesCount: result.likes ? result.likes.length : 0,
    });

    const context = {
        movie,
        user: this.app.userData,
    };

    this.partial('/src/templates/movies/detailsPage.hbs', context);

}

export async function editPage() {

    if(!checkLogin(this)) return this.redirect('/login');

    await addPartials(this);

    const context = {
        user: this.app.userData,
        movie: await getById(this.params.id),
    }
    await this.partial('/src/templates/movies/editPage.hbs', context);
    loadMessageElement();
}

export async function postEdit(ctx) {

    if(!checkLogin(ctx)) return this.redirect('/login');

    try {
        const { id, title, description, imageUrl } = ctx.params;
        if (!title || !description || !imageUrl) {
            throw new Error('Invalid inputs!');
        }

        await editMovie(id, title, description, imageUrl);
        ctx.app.message = 'Edited successfully';
        ctx.redirect('/home');

    } catch (err) {
        errorBox.parentElement.style.display = 'block';
        errorBox.innerHTML = err.message;
        console.clear();
    }
}

export async function deleteMovie() {

    if(!checkLogin(this)) return this.redirect('/login');

    const id = this.params.id;
    await deleteById(id);

    this.app.message = 'Deleted successfully';
    this.redirect('/home');
}

export async function likeMovie() {

    if(!checkLogin(this)) return this.redirect('/login');

    const id = this.params.id;
    await likeById(id);

    this.redirect('/details/' + id);
}

export async function searchMovie() {

    if(!checkLogin(this)) return this.redirect('/login');

    const search = this.params.search;

    this.redirect(`/home?search="${search}"`);
}

function checkLogin(ctx) {
    return !!ctx.app.userData;
}

function loadMessageElement() {
    errorBox = document.getElementById('errorBox');
}