async function likeEvent(rantId) {
    let response = await fetch(`http://localhost:3000/api/rants/likeEvent?rantId=${rantId}`, {
        "method": "POST",
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    if (result.error) {
        if (response.status === 401) {
            // If the user is not logged in, redirect them to the login page
            window.location = "/login";
        } else {
            // Add the error handling code here later
            return undefined;
        }
    } else {
        return result.likeStatus;
    }
}

async function like(rantId) {
    const heart = document.querySelector('svg');
    const liked = await likeEvent(rantId);

    if (liked) {
        heart.setAttribute("fill", "#ff4d7a");
        heart.innerHTML = '<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>';

        let newLikeCount = Number(document.querySelector('#likeCount').innerHTML);
        newLikeCount++;
        document.querySelector('#likeCount').innerHTML = newLikeCount.toString();
    } else {
        heart.setAttribute('fill', "currentColor");
        heart.innerHTML = '<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>'

        let newLikeCount = Number(document.querySelector('#likeCount').innerHTML);
        newLikeCount--;
        document.querySelector('#likeCount').innerHTML = newLikeCount.toString();
    }
}