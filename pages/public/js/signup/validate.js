function validateInput() {
    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const password2 = document.querySelector('#password2').value;

    if (password !== password2) return "Passwords aren't the same";
    if (username.length < 4) return "Username is too short, it must be at least 4 characters";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email))) return "Email is invalid";

    return "";
}