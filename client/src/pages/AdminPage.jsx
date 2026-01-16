import { useEffect, useState } from "react";
import axios from "axios";

function AdminPage() {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [activeTab, setActiveTab] = useState('orders');
    const [products, setProducts] = useState([]);

    const [newProduct, setNewProduct] = useState({
        name: '', 
        category: 'GIÀY BÓNG ĐÁ', 
        price: '', image: '', 
        description: '',
        sizes: ''
    });

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('https://zandoosport.onrender.com/api/orders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get('https://zandoosport.onrender.com/api/products');
            setProducts(res.data);
        } catch (err) { console.error(err); }
    }

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`https://zandoosport.onrender.com/api/orders/${orderId}`, { status: newStatus });
            alert(`Đã cập nhật trạng thái: ${newStatus}`);
            setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            alert('Không thể cập nhật trạng thái đơn hàng.');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            try {
                await axios.delete(`https://zandoosport.onrender.com/api/products/${id}`);
                alert('Đã xóa sản phẩm.');
                setProducts(products.filter(p => p._id !== id));
            } catch (err) {
                alert('Không thể xóa sản phẩm.');
            }
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.image) {
            return alert("Vui lòng điền tên, giá và link ảnh!");
        }

        const sizeArray = newProduct.sizes 
            ? newProduct.sizes.toString().split(/[, ]+/).filter(s => s !== '')
            : [];
            
        const productData = {
            ...newProduct,
            sizes: sizeArray,
        }    

        try {
            const res = await axios.post('https://zandoosport.onrender.com/api/products', productData);
            alert("Thêm sản phẩm thành công!");
            setProducts([...products, res.data]); 
            setNewProduct({ 
                name: '', 
                category: 'GIÀY BÓNG ĐÁ', 
                price: '', 
                image: '', 
                description: '',
                sizes: ''
            }); 
        } catch (err) {
            alert("Lỗi khi thêm: " + err.message);
        }}

    const totalRevenue = orders
        .filter(o => o.status === 'Đã giao')
        .reduce((sum, o) => sum + o.totalPrice, 0);

    const pendingOrdersCount = orders.filter(o => o.status === 'Chờ xử lý').length;

    const filteredOrders = filterStatus === 'all' 
        ? orders
        : orders.filter(o => o.status === filterStatus);

    return (
        <div style={{maxWidth:'1200px', margin:'20px auto', padding:'20px', background:'#f8f9fa', borderRadius:'10px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                <h2 style={{color:'#d90429', margin:0, textTransform:'uppercase'}}>Hệ Thống Quản Trị</h2>
                <div style={{display:'flex', gap:'10px'}}>
                     <button className="back-btn" onClick={() => window.location.href='/'}>Về Trang Chủ</button>
                </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'20px', marginBottom:'30px'}}>
                <div style={{background:'white', padding:'20px', borderRadius:'10px', borderLeft:'5px solid #2ecc71', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
                    <p style={{color:'#666', margin:0}}>Doanh Thu (Đã giao)</p>
                    <h3 style={{fontSize:'1.8rem', color:'#2ecc71', margin:0}}>{totalRevenue.toLocaleString()}đ</h3>
                </div>
                <div style={{background:'white', padding:'20px', borderRadius:'10px', borderLeft:'5px solid #3498db', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
                    <p style={{color:'#666', margin:0}}>Tổng Sản Phẩm</p>
                    <h3 style={{fontSize:'1.8rem', color:'#3498db', margin:0}}>{products.length} SP</h3>
                </div>
                <div style={{background:'white', padding:'20px', borderRadius:'10px', borderLeft:'5px solid #f1c40f', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
                    <p style={{color:'#666', margin:0}}>Đơn Chờ Xử Lý</p>
                    <h3 style={{fontSize:'1.8rem', color:'#f1c40f', margin:0}}>{pendingOrdersCount} Đơn</h3>
                </div>
            </div>
            <div style={{marginBottom:'20px', display:'flex', gap:'10px'}}>
                <button 
                    onClick={() => setActiveTab('orders')}
                    style={{
                        padding:'10px 20px', borderRadius:'5px', border:'none', cursor:'pointer', fontWeight:'bold',
                        background: activeTab === 'orders' ? '#0f172a' : '#e2e8f0',
                        color: activeTab === 'orders' ? 'white' : '#333'
                    }}
                >
                    📦 QUẢN LÝ ĐƠN HÀNG
                </button>
                <button 
                    onClick={() => setActiveTab('products')}
                    style={{
                        padding:'10px 20px', borderRadius:'5px', border:'none', cursor:'pointer', fontWeight:'bold',
                        background: activeTab === 'products' ? '#0f172a' : '#e2e8f0',
                        color: activeTab === 'products' ? 'white' : '#333'
                    }}
                >
                    👟 QUẢN LÝ SẢN PHẨM
                </button>
            </div>
            {activeTab === 'orders' && (
                <div style={{background:'white', borderRadius:'10px', padding:'20px', boxShadow:'0 5px 15px rgba(0,0,0,0.05)'}}>
                    <div style={{marginBottom:'20px', display:'flex', gap:'10px', alignItems:'center'}}>
                        <span style={{fontWeight:'bold'}}>Lọc:</span>
                        {['all', 'Chờ xử lý', 'Đang giao', 'Đã giao', 'Đã hủy'].map(status => (
                            <button key={status} onClick={() => setFilterStatus(status)} 
                                style={{padding:'5px 10px', borderRadius:'15px', border:'1px solid #ddd', cursor:'pointer', background: filterStatus === status ? '#333' : 'white', color: filterStatus === status ? 'white' : '#333'}}>
                                {status === 'all' ? 'Tất cả' : status}
                            </button>
                        ))}
                    </div>

                    <table style={{width:'100%', borderCollapse:'collapse'}}>
                        <thead>
                            <tr style={{background:'#f8f9fa', textAlign:'left'}}>
                                <th style={{padding:'10px'}}>Mã</th>
                                <th style={{padding:'10px'}}>Ngày</th>
                                <th style={{padding:'10px'}}>Khách hàng</th>
                                <th style={{padding:'10px'}}>Sản phẩm</th>
                                <th style={{padding:'10px'}}>Tổng tiền</th>
                                <th style={{padding:'10px'}}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order._id} style={{borderBottom:'1px solid #eee'}}>
                                    <td style={{padding:'10px', fontSize:'0.8rem', color:'#888'}}>#{order._id.slice(-6)}</td>
                                    <td style={{padding:'10px', fontSize:'0.9rem'}}>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td style={{padding:'10px', fontWeight:'bold'}}>{order.userName}<br/><span style={{fontWeight:'normal', fontSize:'0.8rem', color:'#666'}}>{order.address}</span></td>
                                    <td style={{padding:'10px'}}>
                                        {order.products.map((p,i) => <div key={i} style={{fontSize:'0.85rem'}}>• {p.name} (x{p.quantity})</div>)}
                                    </td>
                                    <td style={{padding:'10px', color:'#d90429', fontWeight:'bold'}}>{order.totalPrice.toLocaleString()}đ</td>
                                    <td style={{padding:'10px'}}>
                                        <select value={order.status} onChange={(e) => updateOrderStatus(order._id, e.target.value)} 
                                            style={{padding:'5px', borderRadius:'5px', border:'1px solid #ddd', fontWeight:'bold'}}>
                                            <option value="Chờ xử lý">Chờ xử lý</option>
                                            <option value="Đang giao">Đang giao</option>
                                            <option value="Đã giao">Đã giao</option>
                                            <option value="Đã hủy">Đã hủy</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {activeTab === 'products' && (
                <div style={{background:'white', borderRadius:'10px', padding:'20px', boxShadow:'0 5px 15px rgba(0,0,0,0.05)'}}>
                    <div style={{background:'#f1f5f9', padding:'20px', borderRadius:'10px', marginBottom:'30px'}}>
                        <h3 style={{marginTop:0, marginBottom:'15px'}}>Thêm Sản Phẩm Mới</h3>
                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                            <input className="form-input" placeholder="Tên sản phẩm..." value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                            <input className="form-input" placeholder="Link ảnh (URL)..." value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
                            <input className="form-input" type="number" placeholder="Giá (VNĐ)..." value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                            <select className="form-input" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                                <option value="GIÀY BÓNG ĐÁ">GIÀY BÓNG ĐÁ</option>
                                <option value="ÁO ĐẤU">ÁO ĐẤU</option>
                                <option value="PHỤ KIỆN">PHỤ KIỆN</option>
                            </select>

                            <input
                            className="form-input"
                            placeholder="Size (cách nhau dấu phẩy). Ví dụ: 39, 40, 41"
                            value={newProduct.sizes}
                            onChange={e => setNewProduct({...newProduct, sizes: e.target.value})}
                            />

                            <textarea
                            className="form-input"
                            placeholder="Mô tả chi tiết sản phẩm..."
                            style={{gridColumn:'span 2', height:'80px', fontFamily:'inherit'}}
                            value={newProduct.description}
                            onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                            />
                        </div>
                        <button onClick={handleAddProduct} style={{marginTop:'15px', padding:'10px 25px', background:'#2ecc71', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold'}}>+ THÊM NGAY</button>
                    </div>
                    <table style={{width:'100%', borderCollapse:'collapse'}}>
                        <thead>
                            <tr style={{background:'#f8f9fa', textAlign:'left'}}>
                                <th style={{padding:'10px'}}>Ảnh</th>
                                <th style={{padding:'10px'}}>Tên sản phẩm</th>
                                <th style={{padding:'10px'}}>Giá</th>
                                <th style={{padding:'10px'}}>Danh mục</th>
                                <th style={{padding:'10px'}}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p._id} style={{borderBottom:'1px solid #eee'}}>
                                    <td style={{padding:'10px'}}><img src={p.image} alt="" style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'5px'}} /></td>
                                    <td style={{padding:'10px', fontWeight:'bold'}}>{p.name}</td>
                                    <td style={{padding:'10px', color:'#d90429'}}>{p.price.toLocaleString()}đ</td>
                                    <td style={{padding:'10px'}}><span style={{background:'#eee', padding:'3px 8px', borderRadius:'4px', fontSize:'0.8rem'}}>{p.category}</span></td>
                                    <td style={{padding:'10px'}}>
                                        <button onClick={() => handleDeleteProduct(p._id)} style={{background:'#ef4444', color:'white', border:'none', padding:'5px 10px', borderRadius:'5px', cursor:'pointer'}}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}

export default AdminPage;