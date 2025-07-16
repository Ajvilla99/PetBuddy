import { api } from '../api.js';
import { auth } from '../auth.js';
import { formatDateTime, isPostPast, getRelativeTime } from '../utils.js';

/**
 * Displays the list of posts.
 * If the user is an user, it shows their posts.
 * If the user is a user, it shows available posts.
 * If the user is not authenticated, it shows a forbidden view.
 * The view includes options to register for posts, edit posts (if admin or user), and delete posts (if admin).
 * It also shows the number of available slots for each post.
 */
export async function showPosts() {
    const user = auth.getUser();
    document.getElementById('view-title').textContent = user.role === 'user' ? 'Your posts' : 'Available posts';
    const contentEl = document.getElementById('app-content');
    contentEl.innerHTML = `<div class="posts-list"></div>`; // Placeholder

    let posts = await api.get('/posts');

    if (user.role === 'user') {
        posts = posts.filter(post => post.user === user.name || post.user === user.email);
    }

    const postsListEl = contentEl.querySelector('.posts-list');
    if (posts.length === 0) {
        postsListEl.innerHTML = `
            <div class="no-posts">
                <div>
                    <i class="fa-solid fa-folder-open no-posts-icon"></i>
                    <h3>No posts Found</h3>
                    <p>There are no posts to display at the moment.</p>
                </div>
            </div>`;
        return;
    }

    postsListEl.innerHTML = posts.map(post => {
        const isEnrolled = post.interested && post.interested.includes(user.email);
        const isFull = post.capacity <= 0;
        const isPast = isPostPast(post.date, post.time);
        
        let actionButton = '';
        if (user.role === 'user') {
            if (isPast) {
                actionButton = `<button class="btn-secondary" disabled>Post Finished</button>`;
            } else if (isEnrolled) {
                actionButton = `<button class="btn-secondary" disabled>interested</button>`;
            } else if (isFull) {
                actionButton = `<button class="btn-danger" disabled>Full</button>`;
            } else {
                actionButton = `<button class="btn-primary register-btn" data-id="${post.id}">register</button>`;
            }
        }

        return `
        <div class="post-item ${isPast ? 'past-post' : ''}">
            <div class="post-header">
                <span class="post-category">${post.category || 'General'}</span>
                ${isPast ? '<span class="post-status past">Past Post</span>' : ''}
                <div class="post-actions">
                    <button class="edit-btn" title="Edit post" data-id="${post.id}"><i class="fa-solid fa-pencil"></i></button>
                    <button class="delete-btn" title="Delete post" data-id="${post.id}"><i class="fa-solid fa-trash"></i></button>
                    <button class="view-interested-btn" title="View interested" data-id="${post.id}"><i class="fa-solid fa-users"></i></button>
                </div>
            </div>
            <div class="post-content">
                <h3 class="post-name">${post.title || 'No Title'}</h3>
                <p class="post-description">${post.description || 'No description available.'}</p>
                <div class="post-datetime">
                    <span class="post-date" title="Post Date and Time">
                        <i class="fa-solid fa-calendar-days"></i> ${formatDateTime(post.date, post.time)}
                    </span>
                    <span class="post-relative-time">${getRelativeTime(post.date, post.time)}</span>
                </div>
                <div class="post-meta">
                    <span title="user"><i class="fa-solid fa-chalkboard-user"></i> ${post.user || 'N/A'}</span>
                    <span title="Available Slots"><i class="fa-solid fa-chair"></i> ${post.capacity || 0}</span>
                </div>
            </div>
            ${user.role === 'user' ? `<div class="post-footer">${actionButton}</div>` : ''}
        </div>
    `}).join('');

    // --- Add Post Listeners ---
    if (user.role === 'admin' || user.role === 'user') {
        postsListEl.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = () => location.hash = `#/dashboard/posts/edit/${btn.dataset.id}`;
        });
        postsListEl.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = async () => {
                if (confirm('Are you sure you want to delete this post?')) {
                    await api.delete(`/posts/${btn.dataset.id}`);
                    showPosts(); // Reload list
                }
            };
        });
    }

    if (user.role === 'admin' || user.role === 'user') {
        postsListEl.querySelectorAll('.view-interested-btn').forEach(btn => {
            btn.onclick = async () => {
                const post = await api.get(`/posts/${btn.dataset.id}`);
                const enrolledList = post.interested && post.interested.length > 0
                    ? post.interested.join('\n')
                    : 'There are no users interested in this post.';
                alert(`interested Users:\n\n${enrolledList}`);
            };
        });
    }

    if (user.role === 'user') {
        postsListEl.querySelectorAll('.register-btn').forEach(btn => {
            btn.onclick = async () => {
                const postId = btn.dataset.id;
                const post = await api.get(`/posts/${postId}`);
                
                // Check if post is in the past
                if (isPostPast(post.date, post.time)) {
                    alert('Cannot register for past posts.');
                    return;
                }
                
                if (!post.interested) post.interested = [];
                if (post.interested.includes(user.email)) {
                    alert('You are already interested.');
                    return;
                }
                if (post.capacity <= 0) {
                    alert('This post is full.');
                    return;
                }

                post.interested.push(user.email);
                post.capacity -= 1;

                await api.patch(`/posts/${postId}`, {
                    interested: post.interested,
                    capacity: post.capacity
                });
                alert('Registration successful!');
                showPosts(); // Reload list
            };
        });
    }
}