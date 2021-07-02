function createOverlay() {
    const overlay = document.querySelector('.overlay');
    overlay.style.display = 'flex';

    let rantEditor = document.createElement('textarea');
    rantEditor.setAttribute('onclick', 'stopPropagation(event)');
    rantEditor.setAttribute('id', 'rant-editor');

    let postButton = document.createElement('button');
    postButton.setAttribute('onclick', 'postRant(event)');
    postButton.textContent = "Post Rant";

    let title = document.createElement('h1');
    title.textContent = "New Rant";

    overlay.appendChild(title);
    overlay.appendChild(rantEditor);
    overlay.appendChild(postButton);
}

function derenderOverlay() {
    const overlay = document.querySelector('.overlay');
    overlay.style.display = "none";
    overlay.innerHTML = "";
}

function stopPropagation(event) {
    event.stopPropagation();
}