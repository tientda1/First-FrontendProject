document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    document.getElementById("errorFullname").innerText = "";
    document.getElementById("errorEmail").innerText = "";
    document.getElementById("errorPassword").innerText = "";
    document.getElementById("errorConfirmPassword").innerText = "";

    if (fullname === "") {
      document.getElementById("errorFullname").innerText =
        "Vui lòng nhập họ và tên.";
      isValid = false;
    } else if (fullname.length > 50) {
      document.getElementById("errorFullname").innerText =
        "Họ và tên không được vượt quá 50 ký tự.";
      isValid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email === "") {
      document.getElementById("errorEmail").innerText =
        "Vui lòng nhập địa chỉ email.";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      document.getElementById("errorEmail").innerText = "Email không hợp lệ.";
      isValid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (password === "") {
      document.getElementById("errorPassword").innerText =
        "Vui lòng nhập mật khẩu.";
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      document.getElementById("errorPassword").innerText =
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái in hoa, thường và số.";
      isValid = false;
    }

    if (confirmPassword === "") {
      document.getElementById("errorConfirmPassword").innerText =
        "Vui lòng nhập lại mật khẩu.";
      isValid = false;
    } else if (password !== confirmPassword) {
      document.getElementById("errorConfirmPassword").innerText =
        "Mật khẩu xác nhận không khớp.";
      isValid = false;
    }

    if (isValid) {
      let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

      const existingAccount = accounts.find((acc) => acc.email === email);
      if (existingAccount) {
        document.getElementById("errorEmail").innerText =
          "Email này đã được đăng ký.";
        return;
      }

      const newAccount = {
        email: email,
        password: password,
        fullname: fullname,
        role: "users",
      };

      accounts.push(newAccount);

      localStorage.setItem("accounts", JSON.stringify(accounts));

      alert("Đăng ký thành công! Thông tin đã được lưu.");
      document.getElementById("registerForm").reset();
      window.location.href = "login.html";
    }
  });
