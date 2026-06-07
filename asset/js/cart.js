import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { getCurrentUser } from "./auth.js";
import { app } from "./firebase_config.js";

const db = getFirestore(app);

export async function loadCart(uid) {
  const container = document.getElementById("cart");
  if (container && !container.querySelector(".spinner")) {
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  }

  const docRef = doc(db, "carts", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const cart = docSnap.data();
    console.log("Cart:", cart);

    renderCart(cart.items);
  } else {
    renderEmptyCart();
  }
}

export async function renderCart(items) {
  const container = document.getElementById("cart");

  // Hiển thị loading nếu chưa có spinner
  if (container && !container.querySelector(".spinner")) {
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  }

  const products = await Promise.all(
    items.map(async (item) => {
      const productRef = doc(db, "products", item.productId);
      const productSnap = await getDoc(productRef);
      return productSnap.exists() ? { item, data: productSnap.data() } : null;
    })
  );

  let html = `
    <div class="cart-header">
      <span>Product</span>
      <span>Price</span>
      <span>Quantity</span>
      <span>Remove</span>
    </div>
    `;

  let total = 0;
  let hasProducts = false; // Biến kiểm tra xem giỏ hàng có sản phẩm hay không

  products.forEach((product) => {
    if (!product) return;
    hasProducts = true; // Gán thành true khi tìm thấy sản phẩm hợp lệ
    const { item, data: p } = product;
    total += p.price * item.quantity;
    html += `
      <div class="cart-row">
        <div class="cart-product">
          <img src="../asset/image/${p.image}"/>
          <div>
            <h4>${p.name}</h4>
            <p>${p.description || ""}</p>
          </div>
        </div>
        <div class="cart-price">$${p.price}</div>
        <div class="cart-qty">
          <button onclick="decrease('${item.productId}')">-</button>
          <span>${item.quantity}</span>
          <button onclick="increase('${item.productId}')">+</button>
        </div>
        <div class="cart-remove">
          <button onclick="removeItem('${item.productId}')"><img src="../asset/image/remove_icon.png" alt="remove icon" /></button>
        </div>
      </div>
      `;
  });

  // Kiểm tra với biến hasProducts để hiển thị
  if (!hasProducts) {
    renderEmptyCart();
    return;
  }

  // Chuyển thẻ link quay lại mua hàng và total vào biến html nếu giỏ hàng của user có sản phẩm
  html += `
    <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        ">
      <a href="index.html">← Quay lại mua hàng</a>
      <h2>Tổng: $${total.toFixed(2)}</h2>
    </div>
  `;

  container.innerHTML = html;
}

export async function addToCart(productId) {
  const user = getCurrentUser();

  //B1: Kiem tra dang nhap
  if (!user) {
    // Neu chua -> yeu cau dang nhap
    alert("Vui lòng đăng nhập để tiếp tục!");
    window.location.href = "login.html";
  }

  const uid = user.uid; // Lay id cua user trong Fbase Auth
  const cartRef = doc(db, "carts", uid); // Lay dia chi gio hang(cartRef) cua user

  try {
    // Lay cart thong qua carRef
    const docSnap = await getDoc(cartRef);

    //B2: Kiem tra co ton tai cart kh
    if (!docSnap.exists()) {
      // Neu cart kh ton tai -> Tao moi
      const newCart = {
        items: [
          {
            productId: productId,
            quantity: 1,
          },
        ],
      };

      await setDoc(cartRef, newCart);
      alert("Đã tạo giỏ hàng và thêm sản phẩm");
      return;
    }

    // Neu cart da ton tai -> Lay ds item trong cart
    let items = docSnap.data().items || [];

    // Kiem tra san pham da co chua
    const index = items.findIndex((item) => item.productId === productId); // Tim item co productId trong cart

    // Neu da co roi
    if (index !== -1) {
      // Tang so luong
      items[index].quantity += 1;
    }
    //Nguoc lai
    else {
      items.push({
        productId: productId,
        quantity: 1,
      });
    }

    // Cap nhat lai Fstore
    await setDoc(cartRef, { items }); // Cap nhat lai item trong cartRef
    alert("Đã cập nhật giỏ hàng!");
  } catch (error) {
    console.error("Lỗi thêm giỏ hàng", error);
    alert("Có lỗi xảy ra!");
  }
}

export async function removeItem(productId) {
  const user = getCurrentUser();
  if (!user) {
    alert("Vui lòng đăng nhập!");
    return;
  }

  const cartRef = doc(db, "carts", user.uid); // Lay gio hang cua user
  const docSnap = await getDoc(cartRef); //Lay du lieu gio hang tren firestore thong qua CartRef
  if (!docSnap.exists()) return;

  let items = docSnap.data().items || [];
  //filter: dung de bo cac phan tu neu kh dung dk
  items = items.filter((item) => item.productId !== productId);

  // Ghi lai len Firestore
  await setDoc(cartRef, { items });

  // Render lai gio hang
  renderCart(items);
}

window.removeItem = removeItem;

function renderEmptyCart() {
  const container = document.getElementById("cart");
  if (container) {
    container.innerHTML = `
      <div class="cart-empty">
        <p>Giỏ hàng bạn đang trống, hãy mua hàng!</p>
        <a href="./shop.html">Đến trang Shop</a>
      </div>
    `;
  }
}
