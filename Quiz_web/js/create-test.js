let tests = JSON.parse(localStorage.getItem("tests")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];
let questions = [];
let isEditingQuestion = false;
let editQuestionIndex = null;
let isEditingTest = false;
let editTestIndex = null;
let answerInputs = [];
let deleteQuestionIndex = null;

const urlParams = new URLSearchParams(window.location.search);
const testId = urlParams.get("id");
if (testId) {
  const testIndex = tests.findIndex(t => t.id === parseInt(testId));
  if (testIndex !== -1) {
    isEditingTest = true;
    editTestIndex = testIndex;
    const test = tests[testIndex];
    document.getElementById("pageTitle").innerText = "Sửa bài test";
    document.getElementById("testName").value = test.name;
    document.getElementById("testCategory").value = test.category;
    document.getElementById("testTime").value = parseInt(test.time) || "";
    questions = test.questions || [];
  }
}

function loadCategories() {
  const categorySelect = document.getElementById("testCategory");
  categorySelect.innerHTML = '<option value="">Chọn danh mục</option>';
  categories.forEach(cat => {
    categorySelect.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
  });
}

function renderQuestions() {
  const tableBody = document.getElementById("questionTable");
  tableBody.innerHTML = "";
  questions.forEach((question, index) => {
    tableBody.innerHTML += `
      <tr>
        <td style="text-align: center">${index + 1}</td>
        <td>${question.content}</td>
        <td style="text-align: center">
          <button class="btn btn-edit btn-warning" onclick="openQuestionModal(${index})">Sửa</button>
          <button class="btn btn-delete btn-danger" onclick="openDeleteQuestionModal(${index})">Xóa</button>
        </td>
      </tr>
    `;
  });
}

function addAnswerInput(answer = "", isCorrected = false) {
  const answersContainer = document.getElementById("answersContainer");
  const answerIndex = answerInputs.length;
  const answerDiv = document.createElement("div");
  answerDiv.className = "answer-row";
  answerDiv.innerHTML = `
    <input type="checkbox" class="answer-correct" ${isCorrected ? "checked" : ""} />
    <input type="text" class="form-control answer-input" placeholder="Nhập câu trả lời" value="${answer}" />
    <button class="btn btn-danger btn-sm" onclick="removeAnswerInput(${answerIndex})">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5zm2.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5zm-3 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5z"/>
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 2h5V2H5.5v1z"/>
      </svg>
    </button>
  `;
  answersContainer.appendChild(answerDiv);
  answerInputs.push(answerDiv);
}

function removeAnswerInput(index) {
  if (answerInputs.length <= 2) {
    alert("Phải có ít nhất 2 đáp án!");
    return;
  }
  const answersContainer = document.getElementById("answersContainer");
  answersContainer.removeChild(answerInputs[index]);
  answerInputs.splice(index, 1);
  answerInputs.forEach((div, i) => {
    const button = div.querySelector("button");
    button.setAttribute("onclick", `removeAnswerInput(${i})`);
  });
}

function openQuestionModal(index = null) {
  isEditingQuestion = index !== null;
  editQuestionIndex = index;
  document.getElementById("questionModalLabel").innerText = isEditingQuestion ? "Sửa câu hỏi" : "Thêm câu hỏi";

  const contentInput = document.getElementById("questionContent");
  const answersContainer = document.getElementById("answersContainer");
  answersContainer.innerHTML = "";
  answerInputs = [];

  if (isEditingQuestion) {
    const question = questions[index];
    contentInput.value = question.content;
    question.answers.forEach(answer => addAnswerInput(answer.answer, answer.isCorrected));
  } else {
    contentInput.value = "";
    addAnswerInput();
    addAnswerInput();
  }

  document.getElementById("questionContentError").style.display = "none";
  document.getElementById("answersError").style.display = "none";
  const modal = new bootstrap.Modal(document.getElementById("questionModal"));
  modal.show();
}

function saveQuestion() {
  const content = document.getElementById("questionContent").value.trim();
  const answerInputs = document.querySelectorAll(".answer-input");
  const answerCheckboxes = document.querySelectorAll(".answer-correct");

  const contentError = document.getElementById("questionContentError");
  const answersError = document.getElementById("answersError");

  let hasError = false;

  if (!content || content.length < 5 || content.length > 200) {
    contentError.style.display = "block";
    hasError = true;
  } else {
    contentError.style.display = "none";
  }

  const answers = Array.from(answerInputs).map((input, i) => ({
    answer: input.value.trim(),
    isCorrected: answerCheckboxes[i].checked
  }));

  const allAnswersFilled = answers.every(answer => answer.answer && answer.answer.length >= 2 && answer.answer.length <= 100);
  const hasCorrectAnswer = answers.some(answer => answer.isCorrected);

  if (answers.length < 2 || !allAnswersFilled || !hasCorrectAnswer) {
    answersError.style.display = "block";
    hasError = true;
  } else {
    answersError.style.display = "none";
  }

  if (hasError) return;

  const question = { content, answers };

  if (isEditingQuestion) {
    questions[editQuestionIndex] = question;
  } else {
    questions.push(question);
  }

  renderQuestions();
  const modal = bootstrap.Modal.getInstance(document.getElementById("questionModal"));
  modal.hide();
}

function openDeleteQuestionModal(index) {
  deleteQuestionIndex = index;
  const modal = new bootstrap.Modal(document.getElementById("deleteQuestionModal"));
  modal.show();
}

function confirmDeleteQuestion() {
  if (deleteQuestionIndex !== null) {
    questions.splice(deleteQuestionIndex, 1);
    renderQuestions();
    const modal = bootstrap.Modal.getInstance(document.getElementById("deleteQuestionModal"));
    modal.hide();
    deleteQuestionIndex = null;
  }
}

function saveTest() {
  const testName = document.getElementById("testName").value.trim();
  const testCategory = document.getElementById("testCategory").value;
  const testTime = document.getElementById("testTime").value.trim();

  const nameError = document.getElementById("testNameError");
  const categoryError = document.getElementById("testCategoryError");
  const timeError = document.getElementById("testTimeError");

  let hasError = false;

  if (!testName || testName.length < 5 || testName.length > 100) {
    nameError.innerText = "Tên bài test không được để trống và phải từ 5-100 ký tự";
    nameError.style.display = "block";
    hasError = true;
  } else if (tests.some((t, i) => t.name === testName && (!isEditingTest || i !== editTestIndex))) {
    nameError.innerText = "Tên bài test đã tồn tại";
    nameError.style.display = "block";
    hasError = true;
  } else {
    nameError.style.display = "none";
  }

  if (!testCategory || !categories.some(cat => cat.name === testCategory)) {
    categoryError.innerText = "Vui lòng chọn một danh mục hợp lệ";
    categoryError.style.display = "block";
    hasError = true;
  } else {
    categoryError.style.display = "none";
  }

  const timeValue = parseInt(testTime);
  if (!testTime || isNaN(timeValue) || timeValue <= 0 || timeValue > 120) {
    timeError.innerText = "Thời gian phải là số nguyên dương từ 1 đến 120";
    timeError.style.display = "block";
    hasError = true;
  } else {
    timeError.style.display = "none";
  }

  if (questions.length < 1) {
    alert("Bài test phải có ít nhất 1 câu hỏi!");
    hasError = true;
  }

  if (hasError) return;

  const testData = {
    id: isEditingTest ? tests[editTestIndex].id : (tests.length ? Math.max(...tests.map(t => t.id)) + 1 : 1),
    name: testName,
    category: testCategory,
    image: "../assets/images/image 1.png",
    playAmount: isEditingTest ? tests[editTestIndex].playAmount : 0,
    time: `${timeValue}min`,
    questions: questions
  };

  if (isEditingTest) {
    tests[editTestIndex] = testData;
  } else {
    tests.push(testData);
  }

  localStorage.setItem("tests", JSON.stringify(tests));
  window.location.href = "test-manager.html";
}

// Khởi tạo
loadCategories();
renderQuestions();