let toast = siiimpleToast.setOptions({
    container: 'body',
    class: 'siiimpleToast',
    position: 'top|center',
    margin: 15,
    delay: 0,
    duration: 3000,
    style: {},
});

async function signup() {
    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const validation = validateInput();

    if (validation) {
        toast.alert(validation);
    } else {
        if (!document.querySelector('button').classList.contains('deactivated')) {
            document.querySelector('button').classList.add('deactivated');

            const apiResponse = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    password: password
                })
            });

            const result = await apiResponse.json();

            if (result.error) {
                document.querySelector('button').classList.remove('deactivated');
                toast.alert(result.message);
            } else {
                window.location = "/";
            }
        }
    }
}