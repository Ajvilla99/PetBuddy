import { auth } from "../auth.js";

/**
 * Displays the dashboard view for authenticated users.
 */
export function showDashboard() {
  const user = auth.getUser();
  document.getElementById("view-title").textContent = "Dashboard";

  const contentEl = document.getElementById("app");
  contentEl.innerHTML = `
        <div class="dashboard-container">
            <aside class="sidebar_left">
                <div>[LOGO]</div>
                <nav>
                <a href="#home">[ICON] <span class="achor-link">Home</span></a>
                <a href="#profile">[ICON] <span class="achor-link">Profile</span></a>
                <a href="#settings"
                    >[ICON] <span class="achor-link">Settings</span></a
                >
                <a href="#logout">[ICON] <span class="achor-link">Logout</span></a>
                </nav>

                <div>[MI PERFIL]</div>
            </aside>

            <div class="content-posts">
                <div class="user-post-container">
                    <div class="user-post-photo">
                        <img src="https://i.pravatar.cc/150?u=${
                          user.email
                        }" alt="">
                    </div>
                    <form class="user-post-form">
                        <textarea placeholder="¿Qué estás pensando?"></textarea>
                        <hr>
                        <button>Postear</button>
                    </form>
                </div>

                <div class="user-posts">
                    ${Array(5)
                      .fill()
                      .map(
                        (_, i) => `
                        <div class="user-post">
                            <div class="user-post-header">
                                <img src="https://i.pravatar.cc/?u=${
                                  user.email
                                }" alt="">
                            </div>
                            <div class="user-post-content">
                                <div class="user-post-title">
                                    <h3>${user.name} - Post ${i + 1}</h3>
                                    <button class="">...</button>
                                </div>
                                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus, quos!</p>
                                <div class="user-post-images">
                                    <img src="https://place.dog/300/300" alt="">
                                </div>
                                <div class="user-post-actions">
                                    <button class="">
                                        <span title="Likes"></span>
                                        <span title="comment" class="open-modal" data-post="${i + 1}"><i class="fa-regular fa-comment"></i></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        `
                      )
                      .join("")}
                </div>
            </div>
            <aside class="aside-right">[CONTENIDO A PENSAR]</aside>
        </div>
        <div id="global-modal-overlay" class="modal-overlay" style="display: none;">
            <button class="close-modal">
                <i class="fa-solid fa-x"></i>
            </button>
            <div class="modal">
                <div class="modal-left">
                    <img id="modal-image" src="" alt="">
                </div>
                <div class="modal-right">
                    <div class="modal-header">
                        <div class="modal-profile">
                        <div class="modal-profile-photo">
                            <img id="modal-user-photo" src="" alt="">
                        </div>
                        <h3 id="modal-title">[Title]</h3>
                        </div>
                    </div>
                <form class="modal-form">
                    <input type="text" placeholder="Write a comment...">
                    <button type="submit">Comment</button>
                </form>
                </div>
            </div>
        </div>

    `;

  // Abrir modal
  document.querySelectorAll(".open-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
        // Obtener el usuario y el número del post desde el botón
      const postNumber = btn.dataset.post;

      // Personaliza el modal
      document.getElementById("modal-image").src =
        "https://i.pravatar.cc/600?u=" + user.email;
      document.getElementById("modal-user-photo").src =
        "https://i.pravatar.cc/150?u=" + user.email;
      document.getElementById(
        "modal-title"
      ).textContent = `${user.name} - Post ${postNumber}`;

      document.getElementById("global-modal-overlay").style.display = "flex";
    });
  });

  // Cerrar modal
  document.querySelector(".close-modal").addEventListener("click", () => {
    document.getElementById("global-modal-overlay").style.display = "none";
  });

  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalOverlay = btn.closest(".modal-overlay");
      if (modalOverlay) {
        modalOverlay.style.display = "none";
      }
    });
  });
}
