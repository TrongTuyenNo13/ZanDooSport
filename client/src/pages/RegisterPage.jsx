import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage({ onRegisterSuccess }) {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const navigate = useNavigate();

     const handleChange = (e) => setFormData({ ...formData, [e.target.name] : e.target.value});

     const doRegister = async () => {
        try {
            await axios.post('https://zandoosport.onrender.com/api/auth/register', formData);
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate('/login');
        } catch (err) {
            alert("Đăng ký thất bại: " + (err.response?.data?.message || err.message));
        }
     };

     return (
        <div className="auth-container">
            <h2>ĐĂNG KÝ TÀI KHOẢN</h2>
            <input className="form-input" name="name" placeholder="Họ và tên" onChange={handleChange} />
            <input className="form-input" name="email" placeholder="Email" onChange={handleChange} />
            <input className="form-input" name="phone" placeholder="Số điện thoại" onChange={handleChange} />
            <input className="form-input" name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} />
      
            <button className="auth-btn" onClick={doRegister}>ĐĂNG KÝ</button>
      
            <p className="toggle-auth">
                Đã có tài khoản? <span style={{color:'blue', cursor:'pointer'}} onClick={() => navigate('/login')}>Đăng nhập</span>
            </p>
        </div>
     );
}

export default RegisterPage;