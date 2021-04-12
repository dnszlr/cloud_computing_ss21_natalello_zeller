/**
 * Shortcut for document.getElementById
 * @param id searched element
 * @returns the DOM element
 */
let getElement = function (id) {
    return document.getElementById(id);
}

// ClickEvent for btnRegister
getElement("btnRegister").addEventListener("click", function (event) {
    getElement("lError").innerHTML = "";
    register();
});

async function register() {
    let email = getElement("email").value;
    let username = getElement("username").value;
    let password = getElement("password").value;
    let data = {email: email, username: username, password: password};
    if (!email || !username || !password) {
        getElement("lError").innerHTML = "Not all fields have a valid value!";
    } else {
        const response = await postRequest("/registration", data);
        if (response.status == 200) {
            window.location.href = response.location;
        } else if (response.status == 500) {
            getElement("lError").innerHTML = response.error.data;
        } else {
            getElement("lError").innerHTML = "Sorry, there are problems on our side.";
        }
    }
}

async function postRequest(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}