document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorEmail = document.getElementById("errorEmail");
    const errorPassword = document.getElementById("errorPassword");

    errorEmail.textContent = "";
    errorPassword.textContent = "";

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email === "") {
      errorEmail.textContent = "Vui lòng nhập địa chỉ email.";
      isValid = false;
    } else if (!emailPattern.test(email)) {
      errorEmail.textContent = "Vui lòng nhập địa chỉ email hợp lệ.";
      isValid = false;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (password === "") {
      errorPassword.textContent = "Vui lòng nhập mật khẩu.";
      isValid = false;
    } else if (!passwordPattern.test(password)) {
      errorPassword.textContent =
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái in hoa, thường và số.";
      isValid = false;
    }

    if (isValid) {
      const adminEmail = "shadowsgamer371@gmail.com";
      const adminPassword = "Tientda1";
      let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

      if (!accounts.some((acc) => acc.email === adminEmail)) {
        accounts.push({
          email: adminEmail,
          password: adminPassword,
          fullname: "Admin",
          role: "admin",
        });
        localStorage.setItem("accounts", JSON.stringify(accounts));
      }

      const account = accounts.find(
        (acc) => acc.email === email && acc.password === password
      );

      if (!account) {
        errorEmail.textContent = "Email hoặc mật khẩu không đúng.";
        errorPassword.textContent = "Email hoặc mật khẩu không đúng.";
        isValid = false;
      } else {
        alert("Đăng nhập thành công!");
        document.getElementById("loginForm").reset();
        if (account.role === "admin") {
          window.location.href = "test-manager.html";
        } else {
          window.location.href = "dashboard.html";
        }
      }
    }
  });
