import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage({ products, addToCart }) {
    const navigate = useNavigate();
    const [category, setCategory ] = useState('all');
    const [currentPage, setCurrentPage ] = useState(1);
    const itemsPerPage = 4;

    const [currentBanner, setCurrentBanner] = useState(0);
    const banners = [
    "https://i.pinimg.com/736x/ad/06/51/ad0651f14d0b8025e4ae6f74bb11daa8.jpg",
    "https://i.pinimg.com/1200x/91/41/ae/9141ae5ccfa0ea4ff7b9e9f6afd4305e.jpg",
    "https://i.pinimg.com/736x/6e/b1/c7/6eb1c7b3922d19df77c5c369edc1d6c5.jpg"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner(prev => (prev === banners.length - 1 ? 0 : prev + 1));
        }, 3000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
    const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const hotProducts = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 4);

    const renderStars = (r) => {
        return <div className="rating">{'★'.repeat(Math.floor(r))}{'☆'.repeat(5 - Math.floor(r))} ({r})</div>;
    };

    return (
        <>
      <div className="banner-container">
        <img src={banners[currentBanner]} className="banner-img" alt="Banner quảng cáo" />
      </div>

      <div className="hot-section">
        <h2 className="section-title">🔥 SẢN PHẨM BÁN CHẠY</h2>
        <div className="product-grid">
          {hotProducts.map(p => (
            <div key={p._id} className="product-card" onClick={() => navigate(`/product/${p._id}`)}>
              <div className="hot-badge">HOT</div>
              <div className="image-box"><img src={p.image} alt={p.name} /></div>
              <div className="card-details">
                <div className="tag">{p.category}</div>
                <h3>{p.name}</h3>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    {renderStars(p.rating)}
                    <span style={{fontSize:'0.8rem', color:'#666'}}>Đã bán: {p.sold || 0}</span>
                </div>
                <p className="price">{p.price.toLocaleString()} VNĐ</p>
                <button className="add-btn" onClick={(e) => { e.stopPropagation(); navigate(`/product/${p._id}`); }}>XEM NGAY</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{textAlign:'center', marginTop:'40px'}}><h2 className="section-title">DANH MỤC SẢN PHẨM</h2></div>
      <div className="category-bar">
        {['all', 'GIÀY BÓNG ĐÁ', 'ÁO ĐẤU', 'PHỤ KIỆN'].map(cat => (
          <button key={cat} className={category === cat ? 'active' : ''} onClick={() => {setCategory(cat); setCurrentPage(1);}}>
            {cat === 'all' ? 'TẤT CẢ' : cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {currentProducts.map(p => (
          <div key={p._id} className="product-card" onClick={() => navigate(`/product/${p._id}`)}>
            <div className="image-box"><img src={p.image} alt={p.name} /></div>
            <div className="card-details">
              <div className="tag">{p.category}</div>
              <h3>{p.name}</h3>
              {renderStars(p.rating)}
              <p className="price">{p.price.toLocaleString()} VNĐ</p>
              <button className="add-btn" onClick={(e) => {e.stopPropagation(); addToCart(p, null); }}>THÊM VÀO GIỎ</button>
            </div>
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)}>Trước</button>
          {Array.from({length: totalPages}, (_,i) => (
            <button key={i} className={currentPage === i+1 ? 'active' : ''} onClick={() => setCurrentPage(i+1)}>{i+1}</button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)}>Sau</button>
        </div>
      )}
    </>
    );
}

export default HomePage;