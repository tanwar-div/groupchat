async function verifyUser(): Promise<void> {
    const username: HTMLInputElement = <HTMLInputElement>document.getElementById("username");
    const password: HTMLInputElement = <HTMLInputElement>document.getElementById("password");
    let formdata: FormData = new FormData();
    formdata.append("username", username.value);
    formdata.append("password", password.value);
    const response: Response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
            'Accept': "*/*",
        },
        body: formdata
    });
    const token: string = await response.text();
    if (response.ok) {
        localStorage.setItem("token", token);
        navigateToUserPage();
    } else {
        const invalidUsername = document.querySelector<HTMLElement>("label[for='username']")
        if(invalidUsername) {
            invalidUsername.innerText = "Username - login or password is invalid";
            invalidUsername.classList.add("text-danger")
        }
        const invalidPassword = document.querySelector<HTMLElement>("label[for='password']")
        if(invalidPassword) {
            invalidPassword.innerText = "Password - login or password is invalid";
            invalidPassword.classList.add("text-danger")
        }
    }
    username.value = '';
    password.value = '';
}

function navigateToUserPage(): void {
    window.location.href = "http://localhost:8080/server/@me"
}