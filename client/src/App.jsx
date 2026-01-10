import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('home'); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  
  const [category, setCategory] = useState('all');
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ name: '', email: '', phone: '', password: '', loginInput: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [currentBanner, setCurrentBanner] = useState(0);
  const [toast, setToast] = useState(null);

  const banners = [
    "https://i.pinimg.com/736x/ad/06/51/ad0651f14d0b8025e4ae6f74bb11daa8.jpg",
    "https://i.pinimg.com/1200x/91/41/ae/9141ae5ccfa0ea4ff7b9e9f6afd4305e.jpg",
    "https://i.pinimg.com/736x/6e/b1/c7/6eb1c7b3922d19df77c5c369edc1d6c5.jpg"
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const timer = setInterval(() => setCurrentBanner(p => (p === banners.length - 1 ? 0 : p + 1)), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://zandoosport.onrender.com/api/products');
        const enhancedData = res.data.map(p => ({
            ...p,
            rating: (Math.random() * (5 - 4) + 4).toFixed(1),
            sold: Math.floor(Math.random() * 500) + 50
        }));
        setProducts(enhancedData);
      } catch (err) { console.error(err); }
    };
    fetchProducts();
  }, []);

  const showToast = (title, message) => { setToast({ title, message }); setTimeout(() => setToast(null), 3000); };
  const handleAuthChange = (e) => setAuthForm({ ...authForm, [e.target.name]: e.target.value });

  const doRegister = async () => {
    try { await axios.post('https://zandoosport.onrender.com/api/auth/register', authForm); showToast("Thành công", "Đăng ký thành công!"); setView('login'); } 
    catch (err) { showToast("Lỗi", err.response?.data?.message); }
  };
  const doLogin = async () => {
    try { const res = await axios.post('https://zandoosport.onrender.com/api/auth/login', authForm); localStorage.setItem('user', JSON.stringify(res.data)); setUser(res.data); showToast("Chào mừng", `Hi ${res.data.name}`); setView('home'); } 
    catch (err) { showToast("Lỗi", err.response?.data?.message); }
  };
  const doLogout = () => { localStorage.removeItem('user'); setUser(null); setView('home'); };

  // --- LOGIC GIỎ HÀNG CÓ SIZE ---
  const addToCart = (product, size) => {
    if (product.sizes && product.sizes.length > 0 && !size) return showToast("Chọn Size", "Vui lòng chọn Size trước!");
    const itemKey = size ? `${product._id}-${size}` : product._id;
    const exist = cart.find((x) => x.key === itemKey);
    if (exist) setCart(cart.map((x) => x.key === itemKey ? { ...exist, qty: exist.qty + 1 } : x));
    else setCart([...cart, { ...product, qty: 1, selectedSize: size, key: itemKey }]);
    showToast("Đã thêm", `${product.name} ${size ? `(Size ${size})` : ''}`);
  };

  const removeFromCart = (item) => {
    if (item.qty === 1) setCart(cart.filter((x) => x.key !== item.key));
    else setCart(cart.map((x) => x.key === item.key ? { ...x, qty: x.qty - 1 } : x));
  };
  const removeAll = (item) => setCart(cart.filter((x) => x.key !== item.key));

  const openDetail = (p) => { setSelectedProduct(p); setSelectedSize(null); setView('detail'); window.scrollTo(0,0); };

  const renderStars = (r) => <div className="rating">{'★'.repeat(Math.floor(r))}{'☆'.repeat(5 - Math.floor(r))} ({r})</div>;

  const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const hotProducts = products.slice(0, 4); 

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="pagination">
        <button 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          &laquo; Trước
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => (
          <button 
            key={i} 
            className={currentPage === i + 1 ? 'active' : ''} 
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button 
          disabled={currentPage === totalPages} 
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Sau &raquo;
        </button>
      </div>
    );
  };

  return (
    <div className="app-container">
      {toast && <div className="toast-notification"><div className="toast-icon">✅</div><div><h4>{toast.title}</h4><p>{toast.message}</p></div></div>}

      <header className="header">
        <div onClick={() => setView('home')} style={{cursor:'pointer'}}>
          <h1 className="brand-name">ZANDOO SPORT</h1>
          <p className="brand-slogan">Be Strong - Be Fast - Be Yourself</p>
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div className="cart-btn" onClick={() => setView('cart')}>
            🛒 <span className="cart-count">{cart.reduce((a, c) => a + c.qty, 0)}</span>
          </div>
          {user ? (
            <div className="user-info"><span>Hi, {user.name}</span><button className="logout-btn" onClick={doLogout}>(Thoát)</button></div>
          ) : (<button className="login-btn" onClick={() => setView('login')}>Đăng nhập</button>)}
        </div>
      </header>

      <main className="main-content">
        {view === 'home' && (
          <>
            <div className="banner-container"><img src={banners[currentBanner]} className="banner-img" alt="Banner" /></div>
            
            <div className="hot-section">
              <h2 className="section-title">🔥 SẢN PHẨM BÁN CHẠY</h2>
              <div className="product-grid">
                {hotProducts.map(p => (
                  <div key={p._id} className="product-card" onClick={() => openDetail(p)}>
                    <div className="hot-badge">HOT</div>
                    <div className="image-box"><img src={p.image} alt={p.name} /></div>
                    <div className="card-details">
                      <div className="tag">{p.category}</div>
                      <h3>{p.name}</h3>
                      <div style={{display:'flex', justifyContent:'space-between'}}>
                        {renderStars(p.rating)}
                        <span className="sold-count">Đã bán: {p.sold}</span>
                      </div>
                      <p className="price">{p.price.toLocaleString()} VNĐ</p>
                      <button className="add-btn" onClick={(e) => { e.stopPropagation(); openDetail(p); }}>XEM NGAY</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{textAlign:'center', marginTop:'40px'}}><h2 className="section-title">DANH MỤC SẢN PHẨM</h2></div>
            <div className="category-bar">
              {['all', 'GIÀY BÓNG ĐÁ', 'ÁO ĐẤU', 'PHỤ KIỆN'].map(cat => (
                <button key={cat} className={category === cat ? 'active' : ''} onClick={() => {setCategory(cat); setCurrentPage(1);}}>{cat === 'all' ? 'TẤT CẢ' : cat.toUpperCase()}</button>
              ))}
            </div>
            
            <div className="product-grid">
              {currentProducts.map(p => (
                <div key={p._id} className="product-card" onClick={() => openDetail(p)}>
                  <div className="image-box"><img src={p.image} alt={p.name} /></div>
                  <div className="card-details">
                    <div className="tag">{p.category}</div>
                    <h3>{p.name}</h3>
                    {renderStars(p.rating)}
                    <p className="price">{p.price.toLocaleString()} VNĐ</p>
                    <button className="add-btn" onClick={(e) => {e.stopPropagation(); openDetail(p)}}>THÊM VÀO GIỎ</button>
                  </div>
                </div>
              ))}
            </div>
            
            {renderPagination()}
          </>
        )}

        {view === 'detail' && selectedProduct && (
          <div className="product-detail-container">
            <div className="detail-image"><img src={selectedProduct.image} alt={selectedProduct.name} /></div>
            <div className="detail-info">
              <button className="back-btn" onClick={() => setView('home')}>← TIẾP TỤC MUA SẮM</button>
              
              <div className="tag" style={{fontSize:'1rem', color:'#d4af37'}}>{selectedProduct.category}</div>
              <h1 className="detail-name">{selectedProduct.name}</h1>
              
              <div className="detail-meta">
                {renderStars(selectedProduct.rating)}
                <span style={{color:'#777'}}>| Đã bán: {selectedProduct.sold}</span>
                <span style={{color:'#2ecc71', fontWeight:'bold'}}>| {selectedProduct.inStock ? "Còn hàng" : "Hết hàng"}</span>
              </div>
              
              <p className="detail-price">{selectedProduct.price.toLocaleString()} VNĐ</p>
              
              <div style={{margin:'15px 0', lineHeight:'1.6', color:'#555', background:'#f9f9f9', padding:'15px', borderRadius:'10px'}}>
                <p><strong>Mô tả sản phẩm:</strong> {selectedProduct.description}</p>
              </div>

              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div className="size-section">
                  <span className="size-label">CHỌN SIZE ({selectedProduct.sizes.length} sizes):</span>
                  <div className="size-grid">
                    {selectedProduct.sizes.map(sz => (
                      <button key={sz} className={`size-btn ${selectedSize === sz ? 'selected' : ''}`} onClick={() => setSelectedSize(sz)}>{sz}</button>
                    ))}
                  </div>
                </div>
              )}

              <button className="add-btn" style={{marginTop:'20px', padding:'18px', fontSize:'1.1rem'}} onClick={() => addToCart(selectedProduct, selectedSize)}>THÊM VÀO GIỎ NGAY</button>
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="cart-container">
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                <h2 className="section-title" style={{margin:0, textAlign:'left', width:'auto'}}>GIỎ HÀNG CỦA BẠN</h2>
                <button className="back-btn" onClick={() => setView('home')} style={{margin:0}}>← Quay lại mua sắm</button>
             </div>
             
             {cart.length === 0 ? (
                <div style={{textAlign:'center', padding:'50px'}}>
                    <p style={{fontSize:'1.2rem', color:'#888'}}>Giỏ hàng của bạn đang trống!</p>
                    <button className="add-btn" style={{width:'auto', marginTop:'20px', padding:'10px 30px'}} onClick={() => setView('home')}>MUA NGAY</button>
                </div>
             ) : (
               <>
                 {cart.map(item => (
                   <div key={item.key} className="cart-item">
                     <div className="cart-img-wrapper">
                        <img src={item.image} className="cart-item-img" alt={item.name} />
                     </div>

                     <div className="cart-item-info">
                       <h4>{item.name}</h4>
                       <div style={{display:'flex', alignItems:'center', gap:'15px', marginTop:'8px'}}>
                          {item.selectedSize && <span className="cart-size-tag">Size: {item.selectedSize}</span>}
                          <span className="price" style={{fontSize:'1.1rem', margin:0, color:'#d90429'}}>{item.price.toLocaleString()} VNĐ</span>
                       </div>
                     </div>

                     <div className="cart-item-actions">
                       <button onClick={() => removeFromCart(item)}>-</button>
                       <span>{item.qty}</span>
                       <button onClick={() => addToCart(item, item.selectedSize)}>+</button>
                       <button className="delete-btn" onClick={() => removeAll(item)}>Xóa</button>
                     </div>
                   </div>
                 ))}
                 
                 <div style={{textAlign:'right', marginTop:'30px', borderTop:'2px solid #eee', paddingTop:'20px'}}>
                   <h3 style={{fontSize:'1.5rem'}}>Tổng cộng: <span style={{color:'var(--danger)'}}>{cart.reduce((a,c)=>a+c.price*c.qty,0).toLocaleString()} VNĐ</span></h3>
                   <button className="add-btn" style={{width:'auto', padding:'15px 50px', marginTop:'15px', fontSize:'1.1rem'}} onClick={()=>{alert("Thanh toán thành công!"); setCart([]); setView('home')}}>THANH TOÁN</button>
                 </div>
               </>
             )}
          </div>
        )}
        
        {view === 'login' && <div className="auth-container"><h2>ĐĂNG NHẬP</h2><input className="form-input" name="loginInput" placeholder="Email/SĐT" onChange={handleAuthChange} /><input className="form-input" name="password" type="password" placeholder="Mật khẩu" onChange={handleAuthChange} /><button className="auth-btn" onClick={doLogin}>ĐĂNG NHẬP</button><p className="toggle-auth">Chưa có tài khoản? <span onClick={() => setView('register')}>Đăng ký</span></p></div>}
        {view === 'register' && <div className="auth-container"><h2>ĐĂNG KÝ</h2><input className="form-input" name="name" placeholder="Họ tên" onChange={handleAuthChange} /><input className="form-input" name="email" placeholder="Email" onChange={handleAuthChange} /><input className="form-input" name="phone" placeholder="Số điện thoại" onChange={handleAuthChange} /><input className="form-input" name="password" type="password" placeholder="Mật khẩu" onChange={handleAuthChange} /><button className="auth-btn" onClick={doRegister}>ĐĂNG KÝ</button><p className="toggle-auth">Đã có tài khoản? <span onClick={() => setView('login')}>Đăng nhập</span></p></div>}

      </main>
      <footer className="footer">© 2026 ZanDoo Sport. All rights reserved.</footer>
      
      <div className="contact-floating">
        <a href="#" className="contact-icon"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1200px-Icon_of_Zalo.svg.png" alt="Zalo"/></a>
        <a href="#" className="contact-icon"><img src="https://png.pngtree.com/element_our/png/20180803/messenger-logo-icon-png_31773.png" alt="Messenger"/></a>
        <a href="#" className="contact-icon"><img src="https://www.shutterstock.com/image-vector/phone-icon-telephone-symbol-call-260nw-1519381412.jpg" alt="Hotline"/></a>
      </div>
    </div>
  );
}

export default App;