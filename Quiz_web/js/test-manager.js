let tests = JSON.parse(localStorage.getItem("tests")) || [
  {
    id: 1,
    name: "History Quiz",
    category: "📚 Lịch sử",
    image: "",
    playAmount: 0,
    time: "10min",
    questions: [
      {
        content:
          "Which is the past of the computer system that one can physically touch?",
        answers: [
          { answer: "data" },
          { answer: "operating systems" },
          { answer: "hardware", isCorrected: true },
          { answer: "software" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Science Challenge",
    category: "🧠 Khoa học",
    image: "",
    playAmount: 0,
    questions: [],
    time: "15min",
  },
  {
    id: 3,
    name: "Entertainment Trivia",
    category: "🎤 Giải trí",
    image: "",
    playAmount: 0,
    questions: [],
    time: "5min",
  },
  {
    id: 4,
    name: "Physics Test",
    category: "🧠 Vật lý",
    image: "",
    playAmount: 0,
    questions: [],
    time: "5min",
  },
];

const itemsPerPage = 5;
let currentPage = 1;
let filteredTests = [...tests];

function parseTimeToMinutes(timeStr) {
  const num = parseInt(timeStr);
  return isNaN(num) ? 0 : num;
}

function renderTests() {
  const tableBody = document.getElementById("testTable");
  tableBody.innerHTML = "";
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTests = filteredTests.slice(startIndex, endIndex);


  paginatedTests.forEach((test, index) => {
    const globalIndex = tests.indexOf(test);
    const questionCount = Array.isArray(test.questions)
      ? test.questions.length
      : 0;
        tableBody.innerHTML += `
        <tr style="border: 1px solid #e1e4e8;">
          <td style="border: 1px solid #e1e4e8;text-align: center">${test.id}</td>
          <td style="border: 1px solid #e1e4e8;">${test.name}</td>
          <td style="border: 1px solid #e1e4e8;">${test.category}</td>
          <td style="border: 1px solid #e1e4e8;">${questionCount}</td>
          <td style="border: 1px solid #e1e4e8;">${test.time}</td>
          <td style="text-align: center">
            <button class="btn btn-edit btn-warning" onclick="openEditModal(${globalIndex})">Sửa</button>
            <button class="btn btn-delete btn-danger" onclick="openDeleteModal(${globalIndex})">Xóa</button>
          </td>
        </tr>
      `;    
  });

  renderPagination();
  localStorage.setItem("tests", JSON.stringify(tests));
}

function renderPagination() {
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
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

  const tableContainer = document.querySelector(".table-container");
  let paginationDiv = document.querySelector(".pagination");
  if (!paginationDiv) {
    paginationDiv = document.createElement("div");
    paginationDiv.className = "pagination";
    tableContainer.insertAdjacentElement("afterend", paginationDiv);
  }
  paginationDiv.innerHTML = paginationHTML;
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTests();
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTests();
  }
}

function goToPage(page) {
  currentPage = page;
  renderTests();
}

function sortTests() {
  const sortBy = document.getElementById("sortSelect").value;
  filteredTests = [...filteredTests].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "time-asc":
        return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
      case "time-desc":
        return parseTimeToMinutes(b.time) - parseTimeToMinutes(a.time);
      case "category":
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });
  currentPage = 1;
  renderTests();
}

function searchTests() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(searchTerm)
  );
  currentPage = 1;
  renderTests();
}

function addTest() {
  window.location.href = "create-test.html";
}

function openEditModal(index) {
  window.location.href = `create-test.html?id=${tests[index].id}`;
}

let deleteIndex = null;

function openDeleteModal(index) {
  deleteIndex = index;
  const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
  modal.show();
}

function confirmDelete() {
  if (deleteIndex !== null) {
    tests.splice(deleteIndex, 1);
    filteredTests = [...tests];
    const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      currentPage = totalPages;
    } else if (filteredTests.length === 0) {
      currentPage = 1;
    }
    renderTests();
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("deleteModal")
    );
    modal.hide();
    deleteIndex = null;
  }
}

renderTests();
