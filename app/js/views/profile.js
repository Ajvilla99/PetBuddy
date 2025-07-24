import { api } from "../api";
import { auth } from "../auth";
import { formatDateTime, getRelativeTime, renderActionButton } from "../utils";

export async function showProfile() {
    const user = await auth.getUser();

    
    let posts = await api.get('/posts');
    posts = posts.filter(post => post.user === user.name || post.user === user.email);

    document.getElementById('app-content').innerHTML = `
        <div class="my-profile">
            <div class="profile-container">
                <div class="profile-header">
                    <img src="https://picsum.photos/600/400" alt="Profile Photo">
                </div>
                <hr>
                <div class="profile-photo">
                    <div class="profile-photo-container">
                        <img src="https://i.pravatar.cc/150?u=${user.email}" alt="Profile Photo">
                    </div>
                </div>
                <div class="profile-info">
                    <div class="profile-info-header">
                    </div>
                    <h1>${user.name}</h1>
                    <p>@${user.name}</p>
                </div>
            </div>
            <hr class="profile-divider">
            <div class="profile-status">
                <div class="profile-status-item adopted">
                    <i class="fa-solid fa-heart"></i>
                    Adoptados ${0}
                </div>
                <div class="profile-status-item interested">
                    <i class="fa-solid fa-eye"></i> 
                    Interesados ${0}
                </div>
                <div class="profile-status-item in-adoption">
                    <i class="fa-solid fa-paw"></i> 
                    En adopción ${0}
                </div>
            </div>
            <hr class="profile-divider">
            <div class="profile-posts">
                <h2>My posts</h2>
                <hr class="profile-divider">
                <div class="">
                    ${
                        posts.map(post => {

                            const isLiked = post.likes?.includes(user.email);
                            const actionButton = renderActionButton(post, user); 
                            
                            const imageHtml = post.imageUrl
                                ? `<div class="user-post-images"><img src="${post.imageUrl}" alt="Imagen del post"></div>`
                                : '';

                            return `
                            <div class="user-post">
                                <div class="user-post-header">
                                    <img src="https://i.pravatar.cc/150?u=${user.email}" alt="Avatar de ${post.user}">
                                </div>
                                <div class="user-post-content">
                                    <div class="user-post-title">
                                        <div>
                                            <strong>${post.user}</strong>
                                            <small class="post-relative-time" title="${formatDateTime(post.createdAt)}"> · ${getRelativeTime(post.createdAt)}</small>
                                        </div>
                                    </div>
                                    
                                    <h3>${post.title}</h3>
                                    <p>${post.description}</p>
                                    
                                    ${imageHtml}
                                    
                                    <div class="user-post-actions">
                                        <div class="post-meta">
                                            <span title="Likes" class="like-btn-container">
                                            <i class="fa-solid fa-heart like-btn ${isLiked ? 'liked' : ''}" data-id="${post.id}"></i> 
                                            ${post.likes?.length || 0}
                                            </span>
                                            <span title="Interesados">
                                            <i class="fa-solid fa-user-check"></i> 
                                            ${post.interested?.length || 0}
                                            </span>
                                        </div>
                                        ${user.role === 'user' ? `<div class="post-footer">${actionButton}</div>` : ''}
                                    </div>
                                </div>
                            </div>    
                        `})
                    }
                </div>
            </div>
        </div>
    `;



}