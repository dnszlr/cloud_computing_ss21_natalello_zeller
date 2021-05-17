let btnProfilePicture = document.getElementById('btnProfilePicture');
let inputProfilePicture = document.getElementById('inputProfilePicture');

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
    let profilePicture = btnProfilePicture.style.backgroundImage.replace('url(','').replace(')','').replace(/\"/gi, "");
    let data = {email: email, username: username, password: password, img: profilePicture};
    console.log(data);
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

async function postImageRequest(url, image) {
    console.log(image);
    const formData = new FormData();
    formData.append('image', image);
    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });
    return response;
}

btnProfilePicture.addEventListener('click', function (event) {
    event.preventDefault();
    inputProfilePicture.click();
});

inputProfilePicture.addEventListener('change', async function (event) {
    event.preventDefault();
    const imageList = event.target.files;
    let profilePicture = imageList[0];
    let response = await postImageRequest('/registration/visualRecognition', profilePicture);
    if(response.status == 200) {
        // only images with less than 10mb allowed
        if (profilePicture.size > 10485760) {
            alert("Files with only less than 16mb are allowed!");
        } else {
            let reader = new FileReader();
            reader.onloadend = function() {
                btnProfilePicture.style.backgroundImage = 'url(' + reader.result + ')';
            }
            if(profilePicture){
                reader.readAsDataURL(profilePicture);
            }
        }
    } else if(response.status == 403) {
        alert("The selected image doesn't show a human face. Please try again!");
    } else {
        getElement("lError").innerHTML = "Sorry there is a problem on our side";
    }
});