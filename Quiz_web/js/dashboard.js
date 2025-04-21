let quizzes = JSON.parse(localStorage.getItem("tests")) || [];
const quizzesPerPage = 6;
let currentPage = 1;

quizzes = quizzes.map((quiz) => ({
  ...quiz,
  image: quiz.image || "../assets/images/image 1.png",
  playAmount: quiz.playAmount || 0,
  questions: quiz.questions || [],
}));

let filteredQuizzes = [...quizzes]

function displayQuizzes(page) {
  const start = (page - 1) * quizzesPerPage;
  const end = start + quizzesPerPage;
  const quizzesToShow = filteredQuizzes.slice(start, end);

  const quizContainer = document.getElementById("quizContainer");
  quizContainer.innerHTML = "";

  if (quizzesToShow.length === 0) {
    quizContainer.innerHTML = "<p>Chưa có bài test nào</p>";
    return;
  }

  quizzesToShow.forEach((quiz, index) => {
    const quizCard = document.createElement("div");
    quizCard.classList.add("quiz-card");
    quizCard.innerHTML = `
      <img src="${quiz.image}" alt="Quiz Image" />
      <div style="display: flex; flex-direction: column;">
        <p class="category">${quiz.category}</p>
        <h5>${quiz.name}</h5>
        <p>${quiz.questions.length} câu hỏi • ${quiz.playAmount} lượt chơi</p>
        <button class="play-button">Chơi</button>
      </div>
    `;

    const playButton = quizCard.querySelector(".play-button");
    playButton.addEventListener("click", () => {
      quiz.playAmount = (quiz.playAmount || 0) + 1;

      quizzes[quizzes.findIndex((q) => q.id === quiz.id)] = quiz;
      filteredQuizzes[filteredQuizzes.findIndex((q) => q.id === quiz.id)] =
        quiz;

      localStorage.setItem("tests", JSON.stringify(quizzes));

      displayQuizzes(currentPage);

      console.log(`Bắt đầu chơi quiz: ${quiz.name} (ID: ${quiz.id})`);
    });

    quizContainer.appendChild(quizCard);
  });

  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const prevButton = document.createElement("button");
  prevButton.className = `pagination-btn pagination-arrow pagination-left ${
    currentPage === 1 ? "disabled" : ""
  }`;
  prevButton.innerText = "<";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayQuizzes(currentPage);
    }
  });
  pagination.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.className = `pagination-btn pagination-number ${
      currentPage === i ? "active" : ""
    }`;
    pageButton.innerText = i;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      displayQuizzes(currentPage);
    });
    pagination.appendChild(pageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.className = `pagination-btn pagination-arrow pagination-right ${
    currentPage === totalPages ? "disabled" : ""
  }`;
  nextButton.innerText = ">";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayQuizzes(currentPage);
    }
  });
  pagination.appendChild(nextButton);
}

function sortQuizzes() {
  const sortBy = document.getElementById("sortSelect").value;
  filteredQuizzes = [...filteredQuizzes].sort((a, b) => {
    switch (sortBy) {
      case "plays-asc":
        return (a.playAmount || 0) - (b.playAmount || 0);
      case "plays-desc":
        return (b.playAmount || 0) - (a.playAmount || 0);
      default:
        return 0;
    }
  });
  currentPage = 1;
  displayQuizzes(currentPage);
}

displayQuizzes(currentPage);
