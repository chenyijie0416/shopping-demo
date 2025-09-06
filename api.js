// 註冊
async function register(username,password){
    const res = await fetch("http://localhost:3000/api/register",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,password})
    });
    const data = await res.json();
    return data;
}

// 登入
async function login(username,password){
    const res = await fetch("http://localhost:3000/api/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,password})
    });
    const data = await res.json();
    if(res.ok){
        localStorage.setItem('token',data.token);
    }
    return data;
}

// 取得會員列表（管理員）
async function getMembers(){
    const token = localStorage.getItem('token');
    const res = await fetch("http://localhost:3000/api/members",{
        headers:{ "Authorization": token }
    });
    const data = await res.json();
    return data;
}

// 新增會員（管理員）
async function addMember(username,password){
    const token = localStorage.getItem('token');
    const res = await fetch("http://localhost:3000/api/members/add",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization": token
        },
        body:JSON.stringify({username,password})
    });
    const data = await res.json();
    return data;
}

// 刪除會員（管理員）
async function deleteMember(username){
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/api/members/delete/${username}`,{
        method:"DELETE",
        headers:{ "Authorization": token }
    });
    const data = await res.json();
    return data;
}
