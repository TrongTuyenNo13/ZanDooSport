import { Link, useNavigate } from 'react-router-dom';

function Header({ user, cartCount, doLogout}) {
    const navigate = useNavigate();

    return (
        <header className="header">
      <div onClick={() => navigate('/')} style={{cursor:'pointer'}}>
        <h1 className="brand-name">ZANDOO SPORT</h1>
        <p className="brand-slogan">Be Strong - Be Fast - Be Yourself</p>
      </div>
      <div style={{display: 'flex', alignItems: 'center'}}>
        {user && user.email?.toLowerCase().includes('admin') && (
            <Link to="/admin" className="login-btn" style={{marginRight:'10px', background:'#f1c40f', color:'black', border:'none', textDecoration:'none', display:'inline-block', lineHeight:'20px'}}>
              QUẢN TRỊ
            </Link>
        )}
        
        <div className="cart-btn" onClick={() => navigate('/cart')}>
          🛒 <span className="cart-count">{cartCount}</span>
        </div>

        {user ? (
          <div className="user-info">
            <span>Hi, {user.name}</span>
            <button className="logout-btn" onClick={doLogout}>(Thoát)</button>
          </div>
        ) : (
          <Link to="/login" className="login-btn" style={{textDecoration:'none'}}>Đăng nhập</Link>
        )}
      </div>
    </header>
    );
}

export default Header;