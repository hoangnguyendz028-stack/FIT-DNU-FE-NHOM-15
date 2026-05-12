import { toggleLike } from "./api.js";

export function renderArtworks(artworks = []) {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  gallery.innerHTML = artworks.length
    ? artworks
        .map(
          (item) => `
      <div class="col">
        <div class="card art-card h-100 shadow-sm">
          <img src="${item.image}" class="card-img-top" alt="${item.title}" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text text-muted mb-1">${item.artist}</p>
            <p class="card-text mb-2"><span class="badge bg-secondary">${item.category}</span></p>
            <p class="card-text text-truncate mb-3">${item.description || "No description available."}</p>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              <button type="button" class="btn btn-outline-primary btn-sm view-artwork" data-id="${item.id}">View</button>
              <button type="button" class="btn btn-outline-danger btn-sm like-btn ${item.liked ? "liked" : ""}" data-id="${item.id}" data-liked="${item.liked ? "true" : "false"}" data-likes="${item.likes || 0}">
                ${item.liked ? "&#10084;" : "&#10084;"} ${item.likes || 0}
              </button>
            </div>
          </div>
        </div>
      </div>`
        )
        .join("")
    : `<div class="col-12 text-center py-5"><p class="text-muted">No artworks found.</p></div>`;

  const viewButtons = gallery.querySelectorAll(".view-artwork");
  const likeButtons = gallery.querySelectorAll(".like-btn");
  const modalElement = document.getElementById("artworkModal");
  const modalContent = document.getElementById("modalContent");

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const item = artworks.find((art) => art.id === button.dataset.id);
      if (!item || !modalElement || !modalContent) return;

      modalContent.innerHTML = `
        <div class="text-center mb-4">
          <img src="${item.image}" class="img-fluid rounded" alt="${item.title}" />
        </div>
        <h3>${item.title}</h3>
        <p class="text-muted mb-1">${item.artist}</p>
        <p class="mb-2"><strong>Category:</strong> ${item.category}</p>
        <p>${item.description || "No description available."}</p>
        <p><strong>Likes:</strong> ${item.likes || 0}</p>
      `;

      const bsModal = new bootstrap.Modal(modalElement);
      bsModal.show();
    });
  });

  likeButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;
      const currentLiked = button.dataset.liked === "true";
      const nextLiked = !currentLiked;
      const item = artworks.find((art) => art.id === id);
      const currentLikes = item?.likes ?? 0;
      const newLikes = nextLiked ? currentLikes + 1 : Math.max(currentLikes - 1, 0);

      try {
        await toggleLike(id, nextLiked, newLikes);
        if (item) {
          item.liked = nextLiked;
          item.likes = newLikes;
        }
        button.dataset.liked = nextLiked ? "true" : "false";
        button.dataset.likes = newLikes;
        button.classList.toggle("liked", nextLiked);
        button.innerHTML = `${nextLiked ? "&#10084;" : "&#10084;"} ${newLikes}`;
      } catch (error) {
        console.error("Unable to update like status:", error);
      }
    });
  });
}
