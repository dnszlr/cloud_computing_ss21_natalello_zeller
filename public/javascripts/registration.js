
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
    let data = {email: getElement("email").value, username: getElement("username").value, password: getElement("password").value}
    const response = await postRequest("/registration", data);
    if (response.status == 200) {
        window.location.href = response.location;
    } else if(response.status == 500) {
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