let toast = siiimpleToast.setOptions({
    container: 'body',
    class: 'siiimpleToast',
    position: 'top|center',
    margin: 15,
    delay: 0,
    duration: 3000,
    style: {},
});

function postRant(event) {
    event.stopPropagation();

    fetch('http://localhost:3000/api/rants/newRant', {
        method: "POST",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ rant: document.querySelector('#rant-editor').value })
    })
        .then(data => data.json())
        .then(response => {
            if (response.error) {
                toast.alert("Internal Server Error, please try again");
            } else {
                window.location = `/rant?rantid=${response.rantUrl}`;
            }
        });
}