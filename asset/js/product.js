import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { app } from "./firebase_config.js";

export async function fetchData(collectionName) {
  const db = getFirestore(); // db la firestore
  const querySnapshot = await getDocs(collection(db, collectionName));

  let products = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    products.push({ id: doc.id, ...doc.data() });
  });
  return products;
}

// ham hien thi san pham len trang web dua tren (id) cua phan tu html
export async function renderProduct(id) {
  //lay phan tu html chua ds san pham theo id
  let productContainer = document.getElementById(id);
  let productHtml = "";
  let products = await fetchData("products");
  // forEach: duyet qua tung phan tu trong ds san pham
  products.forEach((p) => {
    productHtml += `
            <div class="products-card">
               <img
               src="../asset/image/${p.image}"
               alt=""
               class="products-img"
               />
               <div class="products-info">
               <h3 class="products-name">${p.name}</h3>
               <p class="products-discription">${p.description}</p>
               <h2 class="products-price">$${p.price}</h2>
               </div>
               <a href="product-detail.html?id=${p.id}">
                  <button id="buy-btn">Buy Now</button>
               </a>
               <button id="cart-btn" onclick="addToCart('${p.id}')">Add to cart</button>
            </div>
         `;
  });

  //innerHTML: chuyen ve dinh dang file html
  productContainer.innerHTML = productHtml;
}

export async function renderProductDetails(id) {
  // lay phan tu chua chi tiet cua san pham
  let productContainer = document.getElementById(id);
  // lay id cua san pham tu URL
  let product_id = new URLSearchParams(window.location.search).get("id");
  // tim san pham trong danh sach dua tren id
  let productHtml = `<div><p>No product found.</p></div>`;
  let products = await fetchData("products");
  let product = null;
  products.forEach((p) => {
    if (p.id == product_id) {
      product = p;
    }
  });
  if (product != null) {
    productHtml = `
         <div class="detail-gallery">
          <img
            src="../asset/image/${product.image}"
            alt="Chi tiết sản phẩm"
          />
         </div>

         <div class="detail-info">
          <h1>${product.name}</h1>
          <span class="detail-price">$${product.price}</span>

          <p class="detail-desc">${product.description}</p>

          <div class="actions">
            <div class="quantity-selector">
              <button>-</button>
              <input type="text" value="1" readonly />
              <button>+</button>
            </div>
            <button class="btn btn-primary" style="flex: 1">
              Add to cart
            </button>
            <a href="payment.html?id=${product.id}">
               <button class="btn btn-outline" style="flex: 1">Buy now</button>
            </a>
          </div>
          <div
            style="
              margin-top: 30px;
              border-top: 1px solid #eee;
              padding-top: 20px;
            "
          >
            <p>🚚 <strong>Free shipping</strong> for orders over 500k VND.</p>
            <p style="margin-top: 10px">🛡️ 30-day <strong>1-to-1 replacement warranty.</strong></p>
          </div>
        </div>
      `;
  }

  //innerHTML: chuyen ve dinh dang file html
  productContainer.innerHTML = productHtml;
}

export async function renderProductPayment(id) {
  // lay phan tu chua thong tin thanh toan
  let productContainer = document.getElementById(id);
  // lay id cua san pham tu URL
  let product_id = new URLSearchParams(window.location.search).get("id");
  // tim san pham trong danh sach dua tren id
  let productHtml = `<div><p>No product found.</p></div>`;
  let products = await fetchData("products");
  let product = null;
  products.forEach((p) => {
    if (p.id == product_id) {
      product = p;
    }
  });
  if (product != null) {
    productHtml = `
        <div id="payment-info">
            <img src="../asset/image/${product.image}" alt="This is an image product." width="300px">
          <div class="info">
                <p><strong>Name:</strong> ${product.name}</p>
                <p><strong>Price:</strong> $${product.price}</p>
                <p><strong>Stock:</strong> ${product.stock}</p>
                <label for="num-of-product"> <strong>Number of products:</strong></label>
                <input type="text" name="num-of-product" id="num-of-product">

                <label for="phone-number"><strong>Phone-number:</strong></label>
                <input type="text" name="phone-number" id="phone-number">

                <label for="address"><strong>Address:</strong></label>
                <input type="text" name="address" id="address">

                <p>🚚 <strong>Free shipping</strong> for orders over 500k VND.</p>
                <p style="margin-top: 10px">
                🛡️ 30-day <strong>1-to-1 replacement warranty.</strong></p>

                <button type="submit" id="payment-button">Payment</button>
          </div>
        </div>
      `;
  }

  //innerHTML: chuyen ve dinh dang file html
  productContainer.innerHTML = productHtml;
}

// Lay nut va input search
const SearchInput = document.getElementById("search-input");
const SearchBtn = document.getElementById("search-btn");

export async function renderSearchedProducts(products) {
  //lay phan tu html chua ds san pham theo id
  let productContainer = document.getElementById("products-list");
  let productHtml = "";

  if (products.length === 0) {
    productHtml = "Khong tim thay san pham";
    productContainer.innerHTML = productHtml;
    return;
  }
  // forEach: duyet qua tung phan tu trong ds san pham
  products.forEach((p) => {
    // if (p.category === "coffee") {
    productHtml += `
            <div class="products-card">
               <img
               src="../asset/image/${p.image}"
               alt=""
               class="products-img"
               />
               <div class="products-info">
               <h3 class="products-name">${p.name}</h3>
               <p class="products-discription">${p.description}</p>
               <h2 class="products-price">$${p.price}</h2>
               </div>
               <a href="product-detail.html?id=${p.id}">
                  <button id="buy-btn">Buy Now</button>
               </a>
               <button id="cart-btn" onclick="addToCart('${p.id}')">Add to cart</button>
            </div>
         `;
    // }
  });

  //innerHTML: chuyen ve dinh dang file html
  productContainer.innerHTML = productHtml;
}

async function searchProducts() {
  let searchText = SearchInput.value.trim();

  if (searchText !== "") {
    const db = getFirestore(app); // db la firestore
    const q = query(
      collection(db, "products"),
      where("name", ">=", searchText),
      where("name", "<=", searchText + "\uf8ff"),
    );
    const querySnapshot = await getDocs(q);

    let products = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      products.push({ id: doc.id, ...doc.data() });
    });
    console.log(products);
    renderSearchedProducts(products);
  }
}

if (SearchBtn) {
  SearchBtn.addEventListener("click", searchProducts);
}

export async function renderProductSlider(id) {
  let sliderContainer = document.getElementById(id);
  let products = await fetchData("products");

  let sliderHtml = `
    <div class="slider-wrapper">
      <button class="slider-arrow slider-prev" onclick="sliderPrev()">&#10094;</button>
      <div class="slider-container">
        <div class="slider-content" id="slider-content">
  `;

  // Clone 4 sản phẩm cuối cùng vào đầu
  const lastFour = products.slice(products.length - 4); // slice(products.length - 4): lấy 4 phần tử cuối
  lastFour.forEach((p) => {
    sliderHtml += `
      <div class="slider-item">
        <div class="products-card">
          <img src="../asset/image/${p.image}" alt="" class="products-img" />
          <div class="products-info">
            <h3 class="products-name">${p.name}</h3>
            <p class="products-discription">${p.description}</p>
            <h2 class="products-price">$${p.price}</h2>
          </div>
          <a href="product-detail.html?id=${p.id}">
            <button id="buy-btn">Buy Now</button>
          </a>
          <button id="cart-btn" onclick="addToCart('${p.id}')">Add to cart</button>
        </div>
      </div>
    `;
  });

  // Thêm tất cả sản phẩm
  products.forEach((p) => {
    sliderHtml += `
      <div class="slider-item">
        <div class="products-card">
          <img src="../asset/image/${p.image}" alt="" class="products-img" />
          <div class="products-info">
            <h3 class="products-name">${p.name}</h3>
            <p class="products-discription">${p.description}</p>
            <h2 class="products-price">${p.price}</h2>
          </div>
          <a href="product-detail.html?id=${p.id}">
            <button id="buy-btn">Buy Now</button>
          </a>
          <button id="cart-btn" onclick="addToCart('${p.id}')">Add to cart</button>
        </div>
      </div>
    `;
  });

  // Clone 4 sản phẩm đầu tiên vào cuối
  const firstFour = products.slice(0, 4);
  firstFour.forEach((p) => {
    sliderHtml += `
      <div class="slider-item">
        <div class="products-card">
          <img src="../asset/image/${p.image}" alt="" class="products-img" />
          <div class="products-info">
            <h3 class="products-name">${p.name}</h3>
            <p class="products-discription">${p.description}</p>
            <h2 class="products-price">${p.price}</h2>
          </div>
          <a href="product-detail.html?id=${p.id}">
            <button id="buy-btn">Buy Now</button>
          </a>
          <button id="cart-btn" onclick="addToCart('${p.id}')">Add to cart</button>
        </div>
      </div>
    `;
  });

  sliderHtml += `
        </div>
      </div>
      <button class="slider-arrow slider-next" onclick="sliderNext()">&#10095;</button>
    </div>
  `;

  sliderContainer.innerHTML = sliderHtml;
  window.totalSliderItems = products.length;
  window.currentSlide = 4; // Bắt đầu từ sản phẩm thực sự đầu tiên

  // Set initial position
  const slider = document.getElementById("slider-content");
  slider.style.transform = `translateX(-100%)`;
}

window.sliderNext = function () {
  window.currentSlide++;
  updateSlider();
};

window.sliderPrev = function () {
  window.currentSlide--;
  updateSlider();
};

function updateSlider() {
  const slider = document.getElementById("slider-content");
  const offset = -window.currentSlide * 25;

  slider.style.transition = "transform 0.5s ease";
  slider.style.transform = `translateX(${offset}%)`;

  // Khi đến cuối clone, jump về vị trí thực sự
  if (window.currentSlide === window.totalSliderItems + 4) {
    setTimeout(() => {
      slider.style.transition = "none";
      window.currentSlide = 4;
      slider.style.transform = `translateX(-100%)`;
    }, 500);
  }

  // Khi đến đầu clone, jump về vị trí thực sự
  if (window.currentSlide === 3) {
    setTimeout(() => {
      slider.style.transition = "none";
      window.currentSlide = window.totalSliderItems + 3;
      slider.style.transform = `translateX(${-window.currentSlide * 25}%)`;
    }, 500);
  }
}
