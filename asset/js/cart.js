import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { getCurrentUser } from "./auth.js";
import { app } from "./firebase_config.js";

const db = getFirestore(app);

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
