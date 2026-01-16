import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage({onLoginSuccess }) {
    const [formData, setFormData] = useState({ loginInput: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const doLogin = async () => {
        try {
            const res = await axios.post('https://zandoosport.onrender.com/api/auth/login', formData);
            onLoginSuccess(res.data);
        } catch (err) {
            alert("Đăng nhập thất bại: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="auth-container">
      <h2>ĐĂNG NHẬP</h2>
      <input 
        className="form-input" 
        name="loginInput" 
        placeholder="Email hoặc Số điện thoại" 
        onChange={handleChange} 
      />
      <input 
        className="form-input" 
        name="password" 
        type="password" 
        placeholder="Mật khẩu" 
        onChange={handleChange} 
      />
      <button className="auth-btn" onClick={doLogin}>ĐĂNG NHẬP</button>
      
      <p className="toggle-auth">
        Chưa có tài khoản? <span style={{color:'blue', cursor:'pointer'}} onClick={() => navigate('/register')}>Đăng ký ngay</span>
      </p>
    </div>
    );
}

export default LoginPage;