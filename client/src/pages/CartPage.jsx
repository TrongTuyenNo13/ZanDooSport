import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CartPage({ cart, removeFromCart, addToCart, removeAll, user,setCart }) {
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [address, setAddress] = useState("");
    const [guestInfo, setGuestInfo] = useState({ name: '', phone: ''});
    const navigate = useNavigate();

    const totalPrice = cart.reduce((a, c) => a + c.price * c.qty, 0);

    const handleCheckout = async () => {
        if (!user && (!guestInfo.name || !guestInfo.phone)) {
            return alert("Vui lòng nhập tên và số điện thoại!");
        }
        if (!address) {
            return alert("Vui lòng nhập địa chỉ giao hàng!");
        }

        const orderData = {
            userId: user ? user._id : 'Guest',
            userName: user ? user.name : guestInfo.name,
            phone: user ? user.phone : guestInfo.phone,
            address: address,
            products : cart.map(item => ({
                productId: item._id,
                name: item.name,
                quantity: item.qty,
                size: item.selectedSize || "N/A",
                price: item.price,
                image: item.image
            })),
            
            totalPrice: totalPrice,
            status: 'Chờ xử lý'
        };

        try {
            await axios.post('https://zandoosport.onrender.com/api/orders', orderData);
            alert("ĐẶT HÀNG THÀNH CÔNG! Cảm ơn bạn đã ủng hộ.");
            setCart([]);
            setShowCheckoutForm(false);
            navigate('/');
        } catch (err) {
            alert("Đặt hàng thất bại: " + (err.response?.data?.message || err.message));
        }
    }

    return (
        <div className="cart-container">
       <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
          <h2 className="section-title" style={{margin:0, width:'auto', border:0}}>GIỎ HÀNG CỦA BẠN</h2>
          <button className="back-btn" onClick={() => navigate('/')}>← Tiếp tục mua sắm</button>
       </div>
       
       {cart.length === 0 ? (
          <div style={{textAlign:'center', padding:'50px', color:'#888'}}>
            <p>Giỏ hàng đang trống!</p>
            <button className="add-btn" style={{width:'200px', marginTop:'20px'}} onClick={() => navigate('/')}>MUA NGAY</button>
          </div>
       ) : (
         <>
           {cart.map(item => (
             <div key={item.key} className="cart-item">
               <div className="cart-img-wrapper"><img src={item.image} className="cart-item-img" alt={item.name} /></div>
               <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <div style={{display:'flex', gap:'15px', alignItems:'center', marginTop:'8px'}}>
                     {item.selectedSize && <span className="cart-size-tag">Size: {item.selectedSize}</span>}
                     <span className="price" style={{margin:0, fontSize:'1.1rem'}}>{item.price.toLocaleString()} VNĐ</span>
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
           
           <div className="cart-total-section">
             <h3 style={{fontSize:'1.5rem'}}>TỔNG CỘNG: <span style={{color:'var(--danger)'}}>{totalPrice.toLocaleString()} VNĐ</span></h3>
             
             {!showCheckoutForm ? (
                 <button className="add-btn" style={{width:'auto', padding:'15px 40px', marginTop:'15px'}} onClick={() => setShowCheckoutForm(true)}>TIẾN HÀNH ĐẶT HÀNG</button>
             ) : (
                 <div style={{marginTop:'20px', background:'#f8f9fa', padding:'20px', borderRadius:'10px', textAlign:'left'}}>
                     <h4 style={{marginBottom:'15px', color:'#333', borderBottom:'1px solid #ddd', paddingBottom:'10px'}}>Thông tin giao hàng:</h4>
                     
                     {!user && (
                         <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px'}}>
                             <input 
                                 className="form-input" 
                                 placeholder="Họ và tên người nhận..." 
                                 value={guestInfo.name}
                                 onChange={e => setGuestInfo({...guestInfo, name: e.target.value})} 
                             />
                             <input 
                                 className="form-input" 
                                 placeholder="Số điện thoại..." 
                                 value={guestInfo.phone}
                                 onChange={e => setGuestInfo({...guestInfo, phone: e.target.value})} 
                             />
                         </div>
                     )}

                     <input 
                         className="form-input" 
                         style={{marginTop:'0'}} 
                         placeholder="Địa chỉ nhận hàng (Số nhà, đường, phường/xã)..." 
                         value={address} 
                         onChange={e => setAddress(e.target.value)} 
                     />
                     
                     <div style={{marginTop:'20px', display:'flex', gap:'10px', justifyContent:'flex-end'}}>
                         <button className="back-btn" onClick={() => setShowCheckoutForm(false)}>Hủy</button>
                         <button className="add-btn" style={{width:'auto', background:'#27ae60'}} onClick={handleCheckout}>XÁC NHẬN MUA HÀNG</button>
                     </div>
                 </div>
             )}
           </div>
         </>
       )}
    </div>
    );
}

export default CartPage;