// 註冊系統
const registerForm = document.getElementById('registerForm');
if(registerForm){
    registerForm.addEventListener('submit', function(e){
        e.preventDefault();
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value.trim();
        const registerMessage = document.getElementById('registerMessage');

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const exists = users.find(u => u.username === username);
        if(exists){
            registerMessage.textContent = "帳號已存在";
        } else {
            users.push({username, password});
            localStorage.setItem('users', JSON.stringify(users));
            registerMessage.style.color = "green";
            registerMessage.textContent = "註冊成功！3秒後跳轉登入頁...";
            setTimeout(()=>{ window.location.href = "login.html"; }, 3000);
        }
    });
}

// 登入系統
const loginForm = document.getElementById('loginForm');
if(loginForm){
    loginForm.addEventListener('submit', function(e){
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const loginMessage = document.getElementById('loginMessage');

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);
        if(user){
            localStorage.setItem('loggedInUser', username);
            loginMessage.style.color = "green";
            loginMessage.textContent = "登入成功！3秒後跳轉購物頁...";
            setTimeout(()=>{ window.location.href = "shop.html"; }, 3000);
        } else {
            loginMessage.style.color = "red";
            loginMessage.textContent = "帳號或密碼錯誤";
        }
    });
}

// 檢查是否登入
function requireLogin() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if(!loggedInUser){
        alert("請先登入！");
        window.location.href = "login.html";
    }
}
