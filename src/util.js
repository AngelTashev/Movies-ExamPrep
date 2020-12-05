export function setUserData(data) {
    sessionStorage.setItem('auth', JSON.stringify(data));
}

export function getUserData() {
    let auth = sessionStorage.getItem('auth');
    if (auth !== null) {
        return JSON.parse(auth);
    }
    return null;
}

export function getUserId() {
    let auth = sessionStorage.getItem('auth');
    if (auth !== null) {
        return JSON.parse(auth).localId;
    }
    return null;
}

export function removeUserData() {
    sessionStorage.clear();
}

export function objectToArray(data) {
    if (data === null) {
        return [];
    }
    return Object.entries(data).map(([k, v]) => Object.assign({_id:k}, v));
}

export async function addPartials(ctx) {
    const partials = await Promise.all([
        ctx.load('/src/templates/common/header.hbs'),
        ctx.load('/src/templates/common/footer.hbs'),
        ctx.load('/src/templates/common/messages.hbs')
    ]);
    ctx.partials = {
        header: partials[0],
        footer: partials[1],
        messages: partials[2],
    };
}

export async function displaySuccessMessage(ctx) {
    const message = ctx.app.message;

    if (message) {
        const successBox = document.getElementById('successBox');
        successBox.innerHTML = message;
        successBox.parentElement.style.display = 'block';
        setTimeout(function(){
            successBox.parentElement.style.display = 'none';
            ctx.app.message = undefined;
        }, 3000);
    }
}