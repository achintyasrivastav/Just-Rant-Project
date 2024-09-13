document.addEventListener("DOMContentLoaded", () => {
    const postButton = document.getElementById("post");
    const postTitleInput = document.getElementById("post-title");
    const postBodyInput = document.getElementById("post-body");
    const oldPostsDiv = document.getElementById("notes"); // updated to match HTML
    const alertMessage = document.getElementById("alert-message");

    // Fetch posts from localStorage or initialize empty array
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    // Function to display alert message
    function showAlert(message) {
        if (alertMessage) {
            alertMessage.textContent = message;
            alertMessage.classList.remove("hidden");
            alertMessage.classList.add("show");

            setTimeout(() => {
                alertMessage.classList.remove("show");
                alertMessage.classList.add("hidden");
            }, 3000);
        }
    }

    // Save posts back to localStorage
    function savePostsToLocalStorage() {
        localStorage.setItem("posts", JSON.stringify(posts));
    }

    // Function to load all existing posts on page load
    function loadPosts() {
        oldPostsDiv.innerHTML = ''; // Clear existing posts
        posts.forEach(post => addPostToDOM(post, true));
    }

    // Add a post to the DOM
    function addPostToDOM(post, isEditable = false) {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");

        // Construct post HTML content
        postDiv.innerHTML = `
            <h3 class="post-title">${post.title}</h3>
            <p class="post-body">${post.body}</p>
            <p class="post-meta">Posted on: ${post.date}</p>
            ${isEditable ? `<button class="delete-post" data-id="${post.id}">Delete</button>` : ''}
            <button class="all-is-well">All is Well</button> 
            <span class="count">${post.wellCount || 0}</span>
        `;

        // Append the post to the posts container
        oldPostsDiv.appendChild(postDiv);

        // Delete post event listener
        if (isEditable) {
            const deleteButton = postDiv.querySelector('.delete-post');
            if (deleteButton) {
                deleteButton.addEventListener('click', () => {
                    deletePost(post.id);
                });
            }
        }

        // 'All is Well' button functionality
        const allIsWellButton = postDiv.querySelector('.all-is-well');
        const countSpan = postDiv.querySelector('.count');
        if (allIsWellButton) {
            allIsWellButton.addEventListener('click', () => {
                toggleAllIsWell(post.id, countSpan);
            });
        }
    }

    // Add new post to localStorage and DOM
    function addPost(title, body) {
        const newPost = {
            id: Date.now(), // Unique ID for each post
            title: title,
            body: body,
            date: new Date().toLocaleString(),
            wellCount: 0 // Initialize well count
        };
        posts.push(newPost); // Add to posts array
        savePostsToLocalStorage(); // Save posts to localStorage
        addPostToDOM(newPost, true); // Add to DOM
    }

    // Delete post by ID
    function deletePost(postId) {
        posts = posts.filter(post => post.id !== postId);
        savePostsToLocalStorage();
        loadPosts(); // Reload posts after deletion
    }

    // Event listener for post button click
    postButton.addEventListener("click", () => {
        const title = postTitleInput.value.trim();
        const body = postBodyInput.value.trim();

        if (title && body) {
            addPost(title, body);
            postTitleInput.value = ""; // Clear input
            postBodyInput.value = ""; // Clear textarea
            showAlert("Post added successfully!");
        } else {
            showAlert("Please fill out both fields.");
        }
    });

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

    postButton.addEventListener("click", () => {
        const title = postTitleInput.value;
        const body = postBodyInput.value;

        if (title && body) {
            addPost(title, body);
            postTitleInput.value = "";
            postBodyInput.value = "";
            showAlert("Post added successfully!");
        } else {
            showAlert("Please fill out both fields.");
        }
    });

    loadPosts(); // Load existing posts when the page loads
});
