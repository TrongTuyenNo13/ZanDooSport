import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('home');
  const [category, setCategory] = useState('all');

  const[user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ name: '', email: '', phone: '', password: '', loginInput: ''});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [currentBanner, setCurrentBanner] = useState(0);

  const [toast, setToast] = useState(null);

  const banners = [
    "https://i.pinimg.com/736x/a5/0e/5b/a50e5b7d6e17cb883427a94a4accead5.jpg",

    "https://i.pinimg.com/736x/13/a3/c3/13a3c3e2a5109c734e4a3a88b8713b00.jpg",
    
    "https://i.pinimg.com/1200x/57/dd/fc/57ddfcf27ea2192fe812e24a80e66cf8.jpg"
  ]

  useEffect(() => {
    const savedUdser = localStorage.getItem('user');
    if (savedUdser) {
      setUser(JSON.parse(savedUdser));
    }
  }, []);

  useEffect (() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Lấy dữ liệu từ Backend (Port 8888)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://zandoosport.onrender.com/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Lỗi kết nối:", err);
      }
    };
    fetchProducts();
  }, []);

  
  const showToast = (title, message) => {
    setToast({ title, message});
    setTimeout(() => setToast(null), 3000);
  };

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name] : e.target.value });
  };

  const doRegister = async () => {
    try {
      const res = await axios.post('https://zandoosport.onrender.com/api/auth/register', {
        name: authForm.name,
        email: authForm.email,
        phone: authForm.phone,
        password: authForm.password
      });
      showToast("Chúc mừng bạn!", "Bạn đã đăng ký tài khoản thành công.");
      setView('login');
    } catch (err) {
      showToast("Lỗi đăng ký!", err.response.data.message || "Đăng kí không thành công, vui lòng thử lại.");
    }
  };

  const doLogin = async () => {
    try {
      const res = await axios.post('https://zandoosport.onrender.com/api/auth/login', {
        loginInput: authForm.loginInput,
        password: authForm.password
      });

      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      showToast(`Chào mừng ${res.data.name} đến với ZanDoo Sport!`);
      setView('home');
    } catch (err) {
      showToast("Lỗi đăng nhập!", err.response.data.message || "Đăng nhập không thành công, vui lòng thử lại.");
    }
  };

  const doLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    showToast("Đã đăng xuất!", "Bạn đã đăng xuất khỏi tài khoản.");
    setView('home');
  };

  const addToCart = (product) => {
    const exist = cart.find((x) => x._id === product._id);
    if (exist) {
      setCart(cart.map((x) => x._id === product._id ? { ...exist, qty: exist.qty + 1 } : x));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    
    showToast("Thêm thành công!", `Đã thêm: ${product.name} vào giỏ hàng.`);
  };

  const removeFromCart = (product) => {
    const exist = cart.find((x) => x._id === product._id);
    if (exist.qty === 1) {
      setCart(cart.filter((x) => x._id !== product._id));
    } else {
      setCart(cart.map((x) => x._id === product._id ? { ...exist, qty: exist.qty - 1 } : x));
    }
  };

  const removeAll = (product) => {
    setCart(cart.filter((x) => x._id !== product._id));
    showToast("Đã xóa!", `Đã bỏ ${product.name} khỏi giỏ hàng.`)
  };

  const handleCheckout = () => {
    if (!user) return showToast("Vui lòng đăng nhập!", "Bạn cần đăng nhập để thực hiện thanh toán.");
    if(cart.length === 0) return alert("Giỏ hàng của bạn đang trống, vui lòng chọn 1 sản phẩm!");
    showToast("THANH TOÁN THÀNH CÔNG! Cảm ơn bạn đã mua hàng tại ZanDoo Sport.");
    setCart([]); 
    setTimeout(() => setView('home'), 2000)
  };

  const totalPrice = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleCategoryChange = (Cat) => { setCategory(Cat); setCurrentPage(1); };

  const getCategoryLabel = (cat) => {
    if (cat === 'all') return 'TẤT CẢ';
    if (cat === 'Giày') return 'GIÀY BÓNG ĐÁ';
    return cat.toUpperCase();
  }

  
  return (
   <div className="app-container">
      {toast && (
        <div className="toast-notification">
          <div className="toast-icon">✅</div>
          <div className="toast-body">
            <h4>{toast.title}</h4>
            <p>{toast.message}</p>
          </div>
        </div>
      )}

      <div className="contact-floating">
        <a href="https://zalo.me/0909xxxxxx" target="_blank" className="contact-icon zalo" title="Chat Zalo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1200px-Icon_of_Zalo.svg.png" alt="Zalo" />
        </a>
        <a href="https://m.me/zandoosport" target="_blank" className="contact-icon messenger" title="Chat Messenger">
          <img src="https://png.pngtree.com/element_our/png/20180803/messenger-logo-icon-png_31773.png" alt="Messenger" />
        </a>
        <a href="tel:0909123456" className="contact-icon hotline" title="Gọi ngay">
          <img src="https://www.shutterstock.com/image-vector/phone-icon-telephone-symbol-call-260nw-1519381412.jpg" alt="hotline" />
        </a>
      </div>

      {/* HEADER */}
      <header className="header">
        <div className="brand-section" onClick={() => setView('home')}>
          <h1 className="brand-name">ZANDOO SPORT</h1>
          <p className="brand-slogan">Be Strong - Be Fast - Be Yourself</p>
        </div>
        
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div className="cart-btn" onClick={() => setView('cart')}>
            🛒 <span className="cart-count">{cart.reduce((a, c) => a + c.qty, 0)}</span>
          </div>
          {user ? (
            <div className="user-info">
              <span className="user-name">Hi, {user.name}</span>
              <button className="logout-btn" onClick={doLogout}>(Đăng xuất)</button>
            </div>
          ) : (
            <button className="login-btn" onClick={() => setView('login')}>Đăng nhập</button>
          )}
        </div>
      </header>

      <main className="main-content">
        {view === 'login' && (
          <div className="auth-container">
            <h2 className="auth-title">ĐĂNG NHẬP</h2>
            <div className="form-group">
              <label>Email hoặc Số điện thoại:</label>
              <input className="form-input" name="loginInput" type="text" placeholder="Nhập email hoặc SĐT" onChange={handleAuthChange} />
            </div>
            <div className="form-group">
              <label>Mật khẩu:</label>
              <input className="form-input" name="password" type="password" placeholder="Nhập mật khẩu" onChange={handleAuthChange} />
            </div>
            <button className="auth-btn" onClick={doLogin}>ĐĂNG NHẬP NGAY</button>
            <p className="toggle-auth">Chưa có tài khoản? <span onClick={() => setView('register')}>Đăng ký tại đây</span></p>
          </div>
        )}


        {view === 'register' && (
          <div className="auth-container">
            <h2 className="auth-title">TẠO TÀI KHOẢN</h2>
            <div className="form-group"><label>Họ và Tên:</label><input className="form-input" name="name" type="text" placeholder="Ví dụ: Nguyễn Văn A" onChange={handleAuthChange} /></div>
            <div className="form-group"><label>Email (Không bắt buộc):</label><input className="form-input" name="email" type="email" placeholder="example@gmail.com" onChange={handleAuthChange} /></div>
            <div className="form-group"><label>Số điện thoại:</label><input className="form-input" name="phone" type="text" placeholder="0909xxxxxx" onChange={handleAuthChange} /></div>
            <div className="form-group"><label>Mật khẩu:</label><input className="form-input" name="password" type="password" placeholder="******" onChange={handleAuthChange} /></div>
            <button className="auth-btn" onClick={doRegister}>ĐĂNG KÝ NGAY</button>
            <p className="toggle-auth">Đã có tài khoản? <span onClick={() => setView('login')}>Đăng nhập</span></p>
          </div>
        )}


        {view === 'cart' && (
          <div className="cart-container">
            <h2 className="section-title">GIỎ HÀNG</h2>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Giỏ hàng đang trống...</p>
                <button className="continue-btn" onClick={() => setView('home')}>QUAY LẠI TRANG MUA SẮM</button>
              </div>
            ) : (
              <div className="cart-content">
                <div className="cart-list">
                  {cart.map((item) => (
                    <div key={item._id} className="cart-item">
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                      <div className="cart-item-info"><h3>{item.name}</h3><p className="cart-item-price">{item.price.toLocaleString()} VNĐ</p></div>
                      <div className="cart-item-actions">
                        <div className="qty-group"><button className="qty-btn" onClick={() => removeFromCart(item)}>-</button><span className="qty-value">{item.qty}</span><button className="qty-btn" onClick={() => addToCart(item)}>+</button></div>
                        <button className="del-btn" onClick={() => removeAll(item)}>Xóa</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary-box">
                  <div className="summary-row"><span>Tổng số lượng:</span><span>{cart.reduce((a, c) => a + c.qty, 0)} sản phẩm</span></div>
                  <div className="summary-row total"><span>Thành tiền:</span><span className="total-price">{cart.reduce((a, c) => a + c.price * c.qty, 0).toLocaleString()} VNĐ</span></div>
                  <button className="checkout-btn" onClick={handleCheckout}>THANH TOÁN</button>
                  <button className="back-btn" onClick={() => setView('home')}>← Quay lại trang mua sắm</button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'home' && (
          <div className="shop-container">
            <div className="banner-container">
              <img src={banners[currentBanner]} alt="Banner" className="banner-img" />
              <div className="banner-dots">{banners.map((_, i) => (<span key={i} className={`dot ${currentBanner === i ? 'active' : ''}`} onClick={() => setCurrentBanner(i)}></span>))}</div>
            </div>

            <div className="category-bar">
              {['all', 'Giày', 'Áo đấu', 'Phụ kiện'].map(cat => (
                <button key={cat} className={category === cat ? 'active' : ''} onClick={() => { setCategory(cat); setCurrentPage(1); }}>
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>

            <div className="product-grid">
              {currentProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="image-box"><img src={product.image} alt={product.name} /></div>
                  <div className="card-details">
                    <div className="tag">{product.category === 'Giày' ? 'GIÀY BÓNG ĐÁ' : product.category}</div>
                    <h3>{product.name}</h3>
                    <p className="price">{product.price.toLocaleString()} VNĐ</p>
                    <button className="add-btn" onClick={() => addToCart(product)}>THÊM VÀO GIỎ</button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Trang trước</button>
                {Array.from({ length: totalPages }, (_, i) => (<button key={i + 1} className={currentPage === i + 1 ? 'active' : ''} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>))}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Trang sau</button>
              </div>
            )}
          </div>
        )}
      </main>
      <footer className="footer">© 2026 ZanDoo Sport. All rights reserved.</footer>
    </div>
  );
}

export default App;