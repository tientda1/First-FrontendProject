let categories = JSON.parse(localStorage.getItem("categories")) || [
  { id: 1, name: "📚 Lịch sử" },
  { id: 2, name: "🧠 Khoa học" },
  { id: 3, name: "🎤 Giải trí" },
  { id: 4, name: "🏠 Đời sống" },
  { id: 5, name: "🧠 Vật lý" },
];

const itemsPerPage = 5;
let currentPage = 1;

let isEditing = false;
let editIndex = null;

let deleteIndex = null;

function renderCategories() {
  const tableBody = document.getElementById("categoryTable");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = categories.slice(startIndex, endIndex);

  paginatedCategories.forEach((category, index) => {
    const globalIndex = startIndex + index;
    tableBody.innerHTML += `
      <tr style="border: 1px solid #e1e4e8;">
        <td style="border: 1px solid #e1e4e8;">${category.id}</td>
        <td style="border: 1px solid #e1e4e8;">${category.name}</td>
        <td style="text-align: center;" border: 1px solid #e1e4e8;">
          <button class="btn btn-edit bg-warning" onclick="openEditModal(${globalIndex})">Sửa</button>
          <button class="btn btn-delete bg-danger text-light" onclick="openDeleteModal(${globalIndex})">Xóa</button>
        </td>
      </tr>
    `;
  });

  renderPagination();
  localStorage.setItem("categories", JSON.stringify(categories));
}

function renderPagination() {
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  let paginationHTML = `
    <div class="pagination" style="text-align: center; margin-top: 20px; display: flex; justify-content: center; align-items: center;">
      <button class="pagination-btn pagination-arrow pagination-left" onclick="previousPage()" ${
        currentPage === 1 ? "disabled" : ""
      }><</button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <button class="pagination-btn pagination-number ${
        currentPage === i ? "active" : ""
      }" onclick="goToPage(${i})">${i}</button>
    `;
  }

  paginationHTML += `
      <button class="pagination-btn pagination-arrow pagination-right" onclick="nextPage()" ${
        currentPage === totalPages ? "disabled" : ""
      }>></button>
    </div>
  `;

  const table = document.querySelector("table");
  let paginationDiv = document.querySelector(".pagination");
  if (!paginationDiv) {
    paginationDiv = document.createElement("div");
    paginationDiv.className = "pagination";
    table.insertAdjacentElement("afterend", paginationDiv);
  }
  paginationDiv.innerHTML = paginationHTML;
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    renderCategories();
  }
}

function nextPage() {
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderCategories();
  }
}

function goToPage(page) {
  currentPage = page;
  renderCategories();
}

function openAddModal() {
  isEditing = false;
  editIndex = null;
  document.getElementById("categoryModalLabel").innerText = "Thêm danh mục";
  document.getElementById("categoryName").value = "";
  document.getElementById("categoryEmoji").value = "";
  document.getElementById("categoryError").style.display = "none";
  document.getElementById("emojiError").style.display = "none";
  const modal = new bootstrap.Modal(document.getElementById("categoryModal"));
  modal.show();
}

function openEditModal(index) {
  isEditing = true;
  editIndex = index;
  document.getElementById("categoryModalLabel").innerText = "Sửa danh mục";
  const category = categories[index];
  const emojiMatch = category.name.match(/^([^\s]+)\s*(.*)$/);
  const emoji = emojiMatch ? emojiMatch[1] : "";
  const name = emojiMatch ? emojiMatch[2] : category.name;
  document.getElementById("categoryName").value = name;
  document.getElementById("categoryEmoji").value = emoji;
  document.getElementById("categoryError").style.display = "none";
  document.getElementById("emojiError").style.display = "none";
  const modal = new bootstrap.Modal(document.getElementById("categoryModal"));
  modal.show();
}

function saveCategory() {
  const categoryName = document.getElementById("categoryName").value.trim();
  const categoryEmoji = document.getElementById("categoryEmoji").value.trim();
  const categoryError = document.getElementById("categoryError");
  const emojiError = document.getElementById("emojiError");

  let hasError = false;

  if (!categoryName) {
    categoryError.textContent = "Tên danh mục không được để trống";
    categoryError.style.display = "block";
    hasError = true;
  } else if (categoryName.length < 2 || categoryName.length > 20) {
    categoryError.textContent = "Tên danh mục phải từ 2 đến 20 ký tự";
    categoryError.style.display = "block";
    hasError = true;
  } else {
    categoryError.style.display = "none";
  }

  if (!categoryEmoji) {
    emojiError.textContent = "Emoji không được để trống";
    emojiError.style.display = "block";
    hasError = true;
  } else if (categoryEmoji.length < 1 || categoryEmoji.length > 5) {
    emojiError.textContent = "Emoji phải từ 1 đến 5 ký tự";
    emojiError.style.display = "block";
    hasError = true;
  } else {
    emojiError.style.display = "none";
  }

  const isDuplicate = categories.some((cat, idx) => {
    const existingName = cat.name.split(/\s+/).slice(1).join(" ");
    return existingName === categoryName && (!isEditing || idx !== editIndex);
  });

  if (isDuplicate) {
    categoryError.textContent = "Tên danh mục đã tồn tại";
    categoryError.style.display = "block";
    hasError = true;
  }

  if (hasError) return;

  const fullName = `${categoryEmoji} ${categoryName}`;

  let tests = JSON.parse(localStorage.getItem("tests")) || [];

  if (isEditing) {
    const oldCategoryName = categories[editIndex].name;
    categories[editIndex].name = fullName;
    tests = tests.map((test) => {
      if (test.category === oldCategoryName) {
        return { ...test, category: fullName };
      }
      return test;
    });
  } else {
    const newCategory = { id: categories.length + 1, name: fullName };
    categories.push(newCategory);
  }

  localStorage.setItem("categories", JSON.stringify(categories));
  localStorage.setItem("tests", JSON.stringify(tests));

  renderCategories();
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("categoryModal")
  );
  modal.hide();
}

function openDeleteModal(index) {
  deleteIndex = index;
  const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
  modal.show();
}

function confirmDelete() {
  if (deleteIndex !== null) {
    const categoryToDelete = categories[deleteIndex].name;
    categories.splice(deleteIndex, 1);

    let tests = JSON.parse(localStorage.getItem("tests")) || [];
    tests = tests.filter((test) => test.category !== categoryToDelete);

    const totalPages = Math.ceil(categories.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      currentPage = totalPages;
    } else if (categories.length === 0) {
      currentPage = 1;
    }

    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("tests", JSON.stringify(tests));

    renderCategories();
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("deleteModal")
    );
    modal.hide();
    deleteIndex = null;
  }
}

renderCategories();
