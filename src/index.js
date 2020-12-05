import { registerPage, loginPage, postRegister, postLogin, logoutUser } from './controllers/user.js';
import { createPage, homePage, postCreate, detailsPage, editPage, postEdit, deleteMovie, likeMovie, searchMovie } from './controllers/movies.js';
import { getUserData } from './util.js';

const app = Sammy('#container', function (context) {

    this.use('Handlebars', 'hbs');

    this.userData = getUserData();

    this.get('/', homePage);
    this.get('/home', homePage);
    this.get('/create', createPage);
    this.get('/edit/:id', editPage);
    this.get('/details/:id', detailsPage);
    this.get('/delete/:id', deleteMovie);
    this.get('/like/:id', likeMovie);
    this.get('/search', searchMovie);

    this.post('/create', (ctx) => { postCreate(ctx); });
    this.post('/edit/:id', (ctx) => { postEdit(ctx); });

    this.get('/register', registerPage);
    this.get('/login', loginPage);
    this.get('/logout', logoutUser);

    this.post('/register', (ctx) => { postRegister(ctx); });
    this.post('/login', (ctx) => { postLogin(ctx); });

});

app.run();