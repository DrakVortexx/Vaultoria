const Auth = {
  init() {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const toggleBtn = document.getElementById("auth-toggle");

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const login = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;
      try {
        await API.login(login, password);
        App.loadGame();
      } catch (err) {
        UI.toast(err.message, "error");
      }
    });

    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("reg-username").value;
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById("reg-confirm").value;
      if (password !== confirmPassword) {
        UI.toast("Passwords do not match", "error");
        return;
      }
      try {
        await API.register(username, password, confirmPassword);
        App.loadGame();
      } catch (err) {
        UI.toast(err.message, "error");
      }
    });

    toggleBtn.addEventListener("click", () => {
      loginForm.classList.toggle("hidden");
      registerForm.classList.toggle("hidden");
      toggleBtn.textContent = registerForm.classList.contains("hidden")
        ? "Need an account? Register"
        : "Already have an account? Login";
    });
  },
};
