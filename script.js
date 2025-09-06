// 模擬用戶
const users = [{ username: "admin", password: "123456" }];

// 登入
const loginForm = document.getElementById('loginForm');
if(loginForm) {
    loginForm.addEventListener('submit', function(e){
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loginMessage = document.getElementById('loginMessage');
        
        const user = users.find(u => u.username === username && u.password === password);
        if(user){
            localStorage.setItem('loggedIn', 'true');
            loginMessage.textContent = "登入成功！";
            setTimeout(()=>{ window.location.href = "shop.html"; }, 1000);
        } else {
            loginMessage.textContent = "帳號或密碼錯誤";
        }
    });
}

// 購物車操作
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 新增預設商品
function addToCart(name, price){
    let cart = getCart();
    cart.push({name, price});
    saveCart(cart);
    alert(`${name} 已加入購物車`);
}

// 客製化花束加入購物車
const previewText = document.getElementById('previewText');
const previewImg = document.getElementById('previewImg');
const flowerType = document.getElementById('flowerType');
const flowerColor = document.getElementById('flowerColor');
const flowerWrap = document.getElementById('flowerWrap');
const priceEl = document.getElementById('price');

if(flowerType){
    function updatePreview() {
        const name = `${flowerType.value}花束 - ${flowerColor.value} - ${flowerWrap.value}`;
        previewText.textContent = name;
        priceEl.textContent = 500 + 50 * ['紙袋','禮盒','絲帶'].indexOf(flowerWrap.value);

        // 動態圖片對應
        const imgMap = {
            "玫瑰": {
                "紅": "https://image.wishflorist.com.tw/majorgls/img_resizer/index2?CFile=12361.jpg&Width=640",
                "白": "https://image-cdn-flare.qdm.cloud/q63c84157b9aca/image/data/2022/04/16/d587f43188f6892f38b40453f79f8da2.jpg",
                "粉": "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
            },
            "百合": {
                "紅": "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
                "白": "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6",
                "粉": "https://images.unsplash.com/photo-1519681393784-d120267933ba"
            },
            "鬱金香": {
                "紅": "https://images.unsplash.com/photo-1528803648305-1a3d4bb0c7c3",
                "白": "https://images.unsplash.com/photo-1486308510493-aa648336c4d5",
                "粉": "https://images.unsplash.com/photo-1526699258767-1f3c93baf173"
            }
        };
        previewImg.src = imgMap[flowerType.value][flowerColor.value];
    }

    flowerType.addEventListener('change', updatePreview);
    flowerColor.addEventListener('change', updatePreview);
    flowerWrap.addEventListener('change', updatePreview);

    window.addCustomFlower = function() {
        const name = `${flowerType.value}花束 - ${flowerColor.value} - ${flowerWrap.value}`;
        const price = parseInt(priceEl.textContent);
        addToCart(name, price);
    }

    updatePreview();
}

// 顯示購物車
const cartItems = document.getElementById('cartItems');
if(cartItems){
    function renderCart() {
        let cart = getCart();
        let total = 0;
        cartItems.innerHTML = '';
        if(cart.length === 0){
            cartItems.innerHTML = "<p>購物車目前沒有商品</p>";
        } else {
            cart.forEach((item, index) => {
                cartItems.innerHTML += `<p>${item.name} - NT$${item.price} <button onclick="removeItem(${index})">刪除</button></p>`;
                total += item.price;
            });
        }
        document.getElementById('totalPrice').textContent = "總金額: NT$" + total;
    }

    window.removeItem = function(index) {
        let cart = getCart();
        cart.splice(index,1);
        saveCart(cart);
        renderCart();
    }

    window.clearCart = function() {
        if(confirm("確定要清空購物車嗎？")){
            saveCart([]);
            renderCart();
        }
    }

    renderCart();
}
