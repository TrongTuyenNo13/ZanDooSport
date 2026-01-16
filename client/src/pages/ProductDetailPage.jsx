import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetailPage({ addToCart }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        axios.get('https://zandoosport.onrender.com/api/products/')
            .then(res => {
                const found = res.data.find(p => p._id === id);
                setProduct(found);
            })
            .catch(err => console.error(err));
    }, [id]);

    if (!product) 
        return <div style={{padding:'50px', textAlign:'center'}}>Đang tải sản phẩm...</div>;

    const renderStars = (r) => (
        <div className="rating">{'★'.repeat(Math.floor(r))}{'☆'.repeat(5 - Math.floor(r))} ({r})</div>
    );

    return (
        <div className="product-detail-container">
      <div className="detail-image"><img src={product.image} alt={product.name} /></div>
      <div className="detail-info">
        <button className="back-btn" onClick={() => navigate(-1)}>← QUAY LẠI</button>
        
        <div className="tag" style={{fontSize:'1rem', color:'#d4af37', marginTop:'15px'}}>
          {product.category}
        </div>
        
        <h1 className="detail-name">{product.name}</h1>
        
        <div className="detail-meta">
          {renderStars(product.rating)}
          <span>| Đã bán: {product.sold || 0}</span>
          <span style={{color:'#2ecc71', fontWeight:'bold', marginLeft:'10px'}}>
            | {product.inStock ? "Còn hàng" : "Hết hàng"}
          </span>
        </div>
        
        <p className="detail-price">{product.price.toLocaleString()} VNĐ</p>
        
        {product.sizes && product.sizes.length > 0 && (
          <div className="size-section">
            <span className="size-label">CHỌN SIZE:</span>
            <div className="size-grid">
              {product.sizes.map(sz => (
                <button 
                  key={sz} 
                  className={`size-btn ${selectedSize === sz ? 'selected' : ''}`} 
                  onClick={() => setSelectedSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{margin:'20px 0', padding:'15px', background:'#f9f9f9', borderRadius:'10px', color:'#555', lineHeight:'1.6'}}>
          {product.description}
        </div>
        
        <button 
          className="add-btn" 
          style={{padding:'15px', fontSize:'1.1rem'}} 
          onClick={() => addToCart(product, selectedSize)}
        >
          THÊM VÀO GIỎ NGAY
        </button>
      </div>
    </div>
    );
}

export default ProductDetailPage;