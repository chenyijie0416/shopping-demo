const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SECRET_KEY = "你的超級秘密金鑰";

// 中間件
app.use(bodyParser.json());
app.use(cors());

// 模擬資料庫
let users = []; // { username, passwordHash, isAdmin }

// ----- 註冊 -----
app.post('/api/register', async (req,res)=>{
    const { username, password } = req.body;
    if(users.find(u=>u.username===username)){
        return res.status(400).json({message:"帳號已存在"});
    }
    const hash = await bcrypt.hash(password,10);
    users.push({username,passwordHash:hash,isAdmin:false});
    res.json({message:"註冊成功"});
});

// ----- 登入 -----
app.post('/api/login', async (req,res)=>{
    const { username, password } = req.body;
    const user = users.find(u=>u.username===username);
    if(!user) return res.status(400).json({message:"帳號不存在"});
    const valid = await bcrypt.compare(password,user.passwordHash);
    if(!valid) return res.status(400).json({message:"密碼錯誤"});

    const token = jwt.sign({ username:user.username, isAdmin:user.isAdmin }, SECRET_KEY, { expiresIn:'1h' });
    res.json({message:"登入成功", token});
});

// ----- 驗證 JWT 中介函數 -----
function authMiddleware(req,res,next){
    const token = req.headers['authorization'];
    if(!token) return res.status(401).json({message:"未提供 token"});
    try{
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({message:"無效 token"});
    }
}

// ----- 會員列表（管理員可見） -----
app.get('/api/members', authMiddleware, (req,res)=>{
    if(!req.user.isAdmin) return res.status(403).json({message:"權限不足"});
    const memberList = users.map(u=>({username:u.username,isAdmin:u.isAdmin}));
    res.json(memberList);
});

// ----- 新增會員（管理員可操作） -----
app.post('/api/members/add', authMiddleware, async (req,res)=>{
    if(!req.user.isAdmin) return res.status(403).json({message:"權限不足"});
    const { username, password } = req.body;
    if(users.find(u=>u.username===username)) return res.status(400).json({message:"帳號已存在"});
    const hash = await bcrypt.hash(password,10);
    users.push({username,passwordHash:hash,isAdmin:false});
    res.json({message:"新增成功"});
});

// ----- 刪除會員（管理員可操作） -----
app.delete('/api/members/delete/:username', authMiddleware, (req,res)=>{
    if(!req.user.isAdmin) return res.status(403).json({message:"權限不足"});
    const index = users.findIndex(u=>u.username===req.params.username);
    if(index===-1) return res.status(404).json({message:"帳號不存在"});
    users.splice(index,1);
    res.json({message:"刪除成功"});
});

// ----- 建立初始管理員 -----
async function createAdmin(){
    const hash = await bcrypt.hash("123456",10);
    users.push({username:"admin",passwordHash:hash,isAdmin:true});
}
createAdmin();

app.listen(PORT, ()=>{ console.log(`Server running on http://localhost:${PORT}`); });
