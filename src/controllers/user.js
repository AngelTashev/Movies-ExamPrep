import { register, login, logout } from "../data.js";
import { addPartials, displaySuccessMessage, removeUserData } from "../util.js";

let errorBox;

export async function registerPage() {
    await addPartials(this);
    await this.partial('/src/templates/user/registerPage.hbs');
    loadMessageElement();
}

export async function postRegister(ctx) {
    try {
        const { email, password, repeatPassword } = ctx.params;
        if (!email || !password || !repeatPassword) {
            throw new Error('Invalid inputs!');
        } else if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long!');
        } else if (password !== repeatPassword) {
            throw new Error('Passwords don\'t match!');
        }

        const result = await register(email, password);
        ctx.app.userData = result;
        ctx.app.message = 'Successful registration!';
        ctx.redirect('/home');
    } catch (err) {
        errorBox.parentElement.style.display = 'block';
        errorBox.innerHTML = err.message;
        console.clear();
        removeUserData();
    }
}

export async function loginPage() {
    await addPartials(this);
    await this.partial('/src/templates/user/loginPage.hbs');
    loadMessageElement();
    displaySuccessMessage(this);
}

export async function postLogin(ctx) {
    try {
        const { email, password } = ctx.params;
        if (!email || !password) {
            throw new Error('Invalid inputs!');
        }

        const result = await login(email, password);
        ctx.app.userData = result;
        ctx.app.message = 'Logged in successfully';
        ctx.redirect('/home');
    } catch (err) {
        errorBox.parentElement.style.display = 'block';
        errorBox.innerHTML = err.message;
        console.clear();
        removeUserData();
    }
}

export async function logoutUser() {
    await logout();
    this.app.userData = null;
    this.app.message = 'Successful logout!';
    this.redirect('/login');
}

function loadMessageElement() {
    errorBox = document.getElementById('errorBox');
}