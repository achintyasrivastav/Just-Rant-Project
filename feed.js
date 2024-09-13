document.addEventListener('DOMContentLoaded', function () {
    const postsContainer = document.getElementById('notes'); // Assume there's a div with id "notes"
    let posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Function to add each post to the DOM
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <p>Posted on: ${post.date}</p>
            <button class="all-is-well" data-id="${post.id}">All is Well</button>
            <span class="count">${post.wellCount || 0}</span>
        `;

        postsContainer.appendChild(postDiv);

        // Attach event listener to the "All is Well" button
        const allIsWellButton = postDiv.querySelector('.all-is-well');
        const countSpan = postDiv.querySelector('.count');
        
        allIsWellButton.addEventListener('click', function () {
            toggleAllIsWell(post.id, countSpan);
        });
    });

    // Function to toggle the "All is Well" count
    function toggleAllIsWell(postId, countSpan) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            // Toggle the "All is Well" count between increment and decrement
            if (!post.toggleState) {
                post.wellCount += 1;
            } else {
                post.wellCount -= 1;
            }
            post.toggleState = !post.toggleState; // Switch the toggle state
            countSpan.textContent = post.wellCount;
            savePostsToLocalStorage(); // Save updated count to localStorage
        }
    }

    // Save updated posts to localStorage
    function savePostsToLocalStorage() {
        localStorage.setItem('posts', JSON.stringify(posts));
    }
});
