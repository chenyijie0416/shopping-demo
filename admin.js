const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "123456";

const adminLoginForm = document.getElementById('adminLoginForm');
const adminLoginMessage = document.getElementById('adminLoginMessage');
const adminPanel = document.getElementById('adminPanel');
const adminLoginSection = document.getElementById('adminLoginSection');
const userListDiv = document.getElementById('userList');
const addUserForm = document.getElementById('addUserForm');

// 登入管理員
adminLoginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value.trim();

    if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD){
        localStorage.setItem('isAdminLoggedIn', 'true');
        adminLoginSection.style.display = 'none';
        adminPanel.style.display = 'block';
        renderUserList();
    } else {
        adminLoginMessage.textContent = "帳號或密碼錯誤";
    }
});

// 顯示會員列表
function renderUserList(){
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if(users.length === 0){
        userListDiv.innerHTML = "<p>目前沒有會員</p>";
    } else {
        userListDiv.innerHTML = "";
        users.forEach((user,index)=>{
            const userElem = document.createElement('p');
            userElem.textContent = `${user.username} - 密碼: ${user.password} `;
            const delBtn = document.createElement('button');
            delBtn.textContent = "刪除";
            delBtn.onclick = ()=>{
                users.splice(index,1);
                localStorage.setItem('users', JSON.stringify(users));
                renderUserList();
            };
            userElem.appendChild(delBtn);
            userListDiv.appendChild(userElem);
        });
    }
}

// 新增會員
addUserForm.addEventListener('submit', function(e){
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const newUsername = document.getElementById('newUsername').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();

    if(users.find(u=>u.username===newUsername)){
        alert("帳號已存在！");
        return;
    }
    users.push({username:newUsername,password:newPassword});
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    renderUserList();
});

// 登出管理員
function logoutAdmin(){
    localStorage.removeItem('isAdminLoggedIn');
}
