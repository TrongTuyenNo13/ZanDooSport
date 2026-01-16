import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from "./pages/HomePage";
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';


function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const API_URL = 'https://zandoosport.onrender.com/api';

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data);
      } catch (err) { console.error(err); }
    };
    fetchProducts();
  }, []);

  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3000);
  };

  const doLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    showToast('Đăng xuất', 'Bạn đã đăng xuất thành công.'); 
  }

  const addToCart = (product, size) => {
    if (product.sizes && product.sizes.length > 0 && !size) {
      return showToast("Chọn Size", "Vui lòng chọn Size trước!");
    }

    const itemKey = size ? `${product._id}-${size}` : product._id;
    const exist = cart.find((x) => x.key === itemKey);

    if (exist) {
      setCart(cart.map((x) => x.key === itemKey ? { ...exist, qty: exist.qty + 1 } : x ));
    } else {
      setCart([...cart, { ...product, qty: 1, selectedSize: size, key: itemKey }]);
    }
    showToast("Đã thêm", `${product.name} ${size ? `(Size ${size})` : ''}`);
  };

  const removeFromCart = (item) => {
    if (item.qty === 1 ) {
      setCart(cart.filter((x) => x.key !== item.key));
    } else {
      setCart(cart.map((x) => x.key === item.key ? { ...x, qty: x.qty - 1 } : x ));
    }
  };

  const removeAll = (item) => {
    setCart(cart.filter((x) => x.key !== item.key));
  };

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    navigate('/');
    showToast("Đăng nhập thành công!", `Xin chào ${userData.name}`);
  };

  return (
    <div className="app-container">
      {toast && (
        <div className="toast-notification">
            <div className="toast-icon">✅</div>
            <div><h4>{toast.title}</h4><p>{toast.message}</p></div>
        </div>
      )}


      <Header user={user} cartCount={cart.reduce((a, c) => a + c.qty, 0)} doLogout={doLogout} />

      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={<HomePage products={products} addToCart={addToCart} />} 
          />
          

          <Route 
            path="/product/:id" 
            element={<ProductDetailPage addToCart={addToCart} />} 
          />
          

          <Route 
            path="/cart" 
            element={
                <CartPage 
                    cart={cart} 
                    removeFromCart={removeFromCart} 
                    addToCart={addToCart} 
                    removeAll={removeAll} 
                    user={user}
                    setCart={setCart} 
                />
            } 
          />


          <Route 
            path="/login" 
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />} 
          />


          <Route 
            path="/register" 
            element={<RegisterPage onRegisterSuccess={handleLoginSuccess} />} 
          />

          <Route 
            path="/admin" 
            element={ 
                user && user.email?.includes('admin') 
                ? <AdminPage /> 
                : <div style={{textAlign:'center', marginTop:'50px'}}>Bạn không có quyền truy cập trang này!</div> 
            } 
          />
        </Routes>
      </main>

      <footer className="footer">© 2026 ZanDoo Sport. All rights reserved.</footer>
      
      <div className="contact-floating">
        <a href="#" className="contact-icon"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1200px-Icon_of_Zalo.svg.png"/></a>
        <a href="#" className="contact-icon"><img src="https://png.pngtree.com/element_our/png/20180803/messenger-logo-icon-png_31773.png"/></a>
        <a href="#" className="contact-icon"><img src="https://www.shutterstock.com/image-vector/phone-icon-telephone-symbol-call-260nw-1519381412.jpg"/></a>
      </div>
    </div>
  );
}

export default App;