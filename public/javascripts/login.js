/**
 * Shortcut for document.getElementById
 * @param id searched element
 * @returns the DOM element
 */
let getElement = function (id) {
    return document.getElementById(id);
}

/**
 * ClickEvent for btnLogin
 */
getElement("btnLogin").addEventListener("click", function (event) {
    getElement("lError").innerHTML = "";
    login();
});

/**
 * Login request
 * @returns {Promise<void>}
 */
async function login() {

    let data = {username: getElement("username").value, password: getElement("password").value}
    const response = await postRequest("/login/verification", data);
    getElement("lError").innerHTML = response.status;
    if (response.status == 200) {
        alert("Your account was successfully logged in");
        window.location.href = response.location;
    } else if(response.status == 404 || response.status == 401) {
        getElement("lError").innerHTML = response.error;
    } else {
        getElement("lError").innerHTML = "Sorry, there are problems on our side.";
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