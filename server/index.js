const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');
const authRoute = require('./routes/auth');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB 
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Lỗi kết nối MongoDB: ',err));

app.use('/api/auth', authRoute);


// API 1: Lấy toàn bộ sản phẩm
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

// API 2: Thêm sản phẩm mới
app.get('/api/seed', async (req, res) => {
    const sizeGiay = ["38", "39", "40", "41", "42", "43", "44"];
    const sizeQuanAo = ["S", "M", "L", "XL", "XXL"];
    const sizeOngDong = ["S", "M", "L"];
    const sizeGangTay = ["7", "8", "9", "10"];

    const sampleData = [
            // 1. GIÀY CỎ NHÂN TẠO
        {name:  "GIÀY BÓNG ĐÁ CỎ NHÂN TẠO NIKE MERCURIAL TF MAX VOLTAGE", category: "GIÀY BÓNG ĐÁ", price: 2700000, image: "https://cdn.hstatic.net/products/1000061481/anh_sp_add-01-01-01-04-07173-w3-2-2_3a138f05f53143289a25c9f6a2c53fb5_medium.jpg", description: "Mẫu giày dành cho lối đá tốc độ, phù hợp với chân thon đến bè vừa", inStock: true, size: sizeGiay},
        {name:  "GIÀY BÓNG ĐÁ CỎ NHÂN TẠO ADIDAS PREDATOR TF IRON METAL", category: "GIÀY BÓNG ĐÁ", price: 2900000, image: "https://cdn.hstatic.net/products/1000061481/anh_sp_a6786dd_web_3-1701-01-10173_de25d71b74704f3285ec007b302134a7_medium.jpg", description: "Mẫu giày dành cho lối đá kiểm soát bóng, phù hợp với chân thon đến bè vừa", inStock: true, size: sizeGiay},
        {name:  "GIÀY BÓNG ĐÁ CỎ NHÂN TẠO NIKE REACT PHANTOM 6 TF SCARY GOOD", category: "GIÀY BÓNG ĐÁ", price: 2600000, image: "https://cdn.hstatic.net/products/1000061481/anh_sp_add-01-01-01-0490-07173-3_16a35977681741f8b02062eb03d36a60_medium.jpg", description: "Mẫu giày dành cho lối đá kiểm soát bóng, phù hợp với chân thon đến bè vừa", inStock: true, size: sizeGiay},
        {name:  "GIÀY BÓNG ĐÁ CỎ NHÂN TẠO NIKE TIEMPO LEGEND 10 TF SCARY GOOD", category: "GIÀY BÓNG ĐÁ", price: 2550000, image: "https://cdn.hstatic.net/products/1000061481/anh_sp_add_web_3-02-02-01-01-01-01-01-01-2_fdd2b9941d194ca6be8eeafd42a0f56b_medium.jpg", description: "Mẫu giày dành cho lối đá kiểm soát bóng, phù hợp với chân thon đến bè vừa", inStock: true, size: sizeGiay},
        {name:  "GIÀY BÓNG ĐÁ CỎ NHÂN TẠO PUMA FUTURE 7 TF BLUEMAZING", category: "GIÀY BÓNG ĐÁ", price: 2750000, image: "https://product.hstatic.net/1000061481/product/anh_sp_add_web_3-02-02-01-01-88801-01-001-01-01_6652749ed4f84e49b486357ea0d996ad_medium.jpg", description: "Mẫu giày dành cho lối kiểm soát bóng, phù hợp với chân thon", inStock: true, size: sizeGiay},
        {name:  "GIÀY BÓNG ĐÁ CỎ NHÂN TẠO PUMA ULTRA ULTIMATE TF POISON PINK", category: "GIÀY BÓNG ĐÁ", price: 2550000, image: "https://product.hstatic.net/1000061481/product/1-01-01-01-01-02-02-02-02-02-02-01-01-02-02-02-02-02-02-01-02-02-02-01_6372ff10a85745a085995683d4e04b6f_medium.jpg", description: "Mẫu giày dành cho lối đá tốc độ, phù hợp với chân thon", inStock: true, size: sizeGiay},
        {name:  "GIÀY BÓNG ĐÁ CỎ TỰ NHIÊN NIKE AIRZOOM MERCURIAL SUPERFLY 10 FG MAX VOLTAGE", category: "GIÀY BÓNG ĐÁ", price: 5000000, image: "https://cdn.hstatic.net/products/1000061481/2221241hjk26-2-2_50266cf8101b4461b9cd64dc35506142_medium.jpg", description: "Mẫu giày dành cho lối đá tốc độ, phù hợp với chân thon", inStock: true, size: sizeGiay},
        {name:  "GIÀY BÓNG ĐÁ CỎ TỰ NHIÊN NIKE AIRZOOM MERCURIAL VAPOR 16 FG SCARY GOOD", category: "GIÀY BÓNG ĐÁ", price: 5000000, image: "https://cdn.hstatic.net/products/1000061481/anh_sp_add_web_ball02-02-0202-02-02-2-2-2_7c77c93b61694890a212f74e2864287a_medium.jpg", description: "Mẫu giày dành cho lối đá tốc độ, phù hợp với chân thon", inStock: true, size: sizeGiay},
        {name:  "GIÀY BÓNG ĐÁ CỎ TỰ NHIÊN ADIDAS F50 FG LUCID LEMON", category: "GIÀY BÓNG ĐÁ", price: 4500000, image: "https://cdn.hstatic.net/products/1000061481/anh_sp_add_web_3-1701-01-10173_35aa1512c1344815a276df8a17fac4a0_medium.jpg", description: "Mẫu giày dành cho lối đá tốc độ, phù hợp với chân thon", inStock: true, size: sizeGiay},
        {name:  "GIÀY BÓNG ĐÁ CỎ TỰ NHIÊN ADIDAS PREDATOR ACCURACY FG BLISS BLUE", category: "GIÀY BÓNG ĐÁ", price: 3650000, image: "https://product.hstatic.net/1000061481/product/eb_4-02-02-01-01-01-01-01-02-02-02-02-02-02-01-01-02-02-02-02-02-02-01_d1ed9317dc65498db7e595a6fbb15b9b_medium.jpg", description: "Mẫu giày dành cho lối kiểm soát bóng, phù hợp với chân thon", inStock: true, size: sizeGiay},
            // 2. ÁO ĐẤU CLB
        {name: "ÁO ĐÂU CLB MANCHESTER UNITED SÂN NHÀ 2025/2026", category: "ÁO ĐẤU", price: 899000, image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/341ec36583354390854e7ad4fd2a02dd_9366/Manchester_United_25-26_Home_Jersey_Red_JI7428_01_laydown.jpg", description: "Áo đấu sân nhà CLB Manchester United mùa giải 2025/26, thiết kế hiện đại với công nghệ thoáng khí.", inStock: true, size: sizeQuanAo},
        {name: "ÁO ĐẤU CLB REAL MADRID SÂN NHÀ 2025/20626", category: "ÁO ĐẤU", price: 899000, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiu6dUXCJ6rP3CJmXQUyIr0yK2cB_ZIU2dcA&s", description: "Áo đấu sân nhà CLB Real Madrid mùa giải 2025/26, thiết kế hiện đại với công nghệ thoáng khí.", inStock: true, size: sizeQuanAo},
        {name: "ÁO ĐẤU CLB CHELSEA SÂN KHÁCH 2025/2026", category: "ÁO ĐẤU", price: 899000, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAv6_whorE1bICvrZr66qY3fSxbIIOjv5w2g&s", description: "Áo đấu sân khách CLB Chelsea mùa giải 2025/26, thiết kế hiện đại với công nghệ thoáng khí.", inStock: true, size: sizeQuanAo},
        {name: "ÁO ĐẤU CLB ARSENAL SÂN KHÁCH 2025/2026", category: "ÁO ĐẤU", price: 899000, image: "https://cdn.hstatic.net/products/200000293662/ph_ng_tr_ng__nh_d_ng_web__1__15c60007f90449d4ae0f58c6c19baa59.jpg", description: "Áo đấu sân khách CLB Arsenal mùa giải 2025/26, thiết kế hiện đại với công nghệ thoáng khí.", inStock: true, size: sizeQuanAo},
        {name: "ÁO ĐẤU CLB LIVERPOOL SÂN NHÀ 2025/2026", category: "ÁO ĐẤU", price: 899000, image: "https://cdn.hstatic.net/products/200000293662/ph_ng_tr_ng__nh_d_ng_web__1200_x_1220_px___1200_x_1200_px__21144690b1914e89a1c880ec7d204f42.jpg", description: "Áo đấu sân nhà CLB Liverpool mùa giải 2025/26, thiết kế hiện đại với công nghệ thoáng khí.", inStock: true, size: sizeQuanAo},
        {name: "ÁO ĐẤU CLB MANCHESTER CITY SÂN NHÀ 2025/2026", category: "ÁO ĐẤU", price: 899000, image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/780338/01/fnd/VNM/fmt/png/%C3%81o-Thi-%C4%90%E1%BA%A5u-S%C3%A2n-Nh%C3%A0-Manchester-City-25/26-Nam", description: "Áo đấu sân nhà CLB Manchester City mùa giải 2025/26, thiết kế hiện đại với công nghệ thoáng khí.", inStock: true, size: sizeQuanAo},
        {name: "ÁO ĐẤU CLB AC MILAN SÂN KHÁCH 2025/2026", category: "ÁO ĐẤU", price: 899000, image: "https://footdealer.co/wp-content/uploads/2025/07/Maillot-Match-Milan-AC-Exterieur-2025-2026-1.jpeg", description: "Áo đấu sân khách CLB AC Milan mùa giải 2025/26, thiết kế hiện đại với công nghệ thoáng khí.", inStock: true, size: sizeQuanAo},
        {name: "ÁO ĐẤU CLB BAYERN MUNICH SÂN NHÀ 2025/2026", category: "ÁO ĐẤU", price: 899000, image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/bbb4a070dea5429aa1756f460ea466d4_9366/Ao_djau_san_nha_cua_FC_Bayern_mua_giai_25-26_DJo_JJ2137_01_laydown.jpg", description: "Áo đấu sân nhà CLB Bayern Munich mùa giải 2025/26, thiết kế hiện đại với công nghệ thoáng khí.", inStock: true, size: sizeQuanAo},
        {name: "ÁO ĐẤU CLB INTER MILAN SÂN KHÁCH 2025/2026", category: "ÁO ĐẤU", price: 899000, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlIaGCXmNIYBaUnJnAbpJ-Lr_muvWm6LERIQ&s", description: "Áo đấu sân khách CLB Inter Minlan mùa giải 2025/26, thiết kế hiện đại với công nghệ thoáng khí.", inStock: true, size: sizeQuanAo},
        {name: "ÁO ĐẤU CLB BARCELONA SÂN NHÀ 2025/2026", category: "ÁO ĐẤU", price: 899000, image: "https://vanauthentic.com/watermark/product/450x450x2/upload/product/a7b06d0011244ce3ae0df16043cee103_7736.jpeg", description: "Áo đấu sân nhà CLB Barcelona mùa giải 2025/26, thiết kế hiện đại với công nghệ thoáng khí.", inStock: true, size: sizeQuanAo},

            // 3. PHỤ KIỆN BÓNG ĐÁ
        {name: "Bóng Động Lực UHV 2.07", category: "PHỤ KIỆN", price: 450000, image: "https://product.hstatic.net/1000288768/product/5_fd939c062d524778a45c9d5844f97ee2_master.png", description: "Bóng đá Động Lực UHV 2.07 chính hãng, chất lượng cao, phù hợp cho luyện tập và thi đấu.", inStock: true, size: []},
        {name: "Găng Tay Thủ Môn Adidas Predator Pro", category: "PHỤ KIỆN", price: 1200000, image: "https://product.hstatic.net/200000960027/product/ia0864_18aebc88469647c6a00b8f15fdf45407_master.png", description: "Găng tay thủ môn Adidas Predator Pro với công nghệ tiên tiến, giúp tăng cường độ bám và bảo vệ tối đa.", inStock: true, size: sizeGangTay},
        {name: "Bịt Bảo Vệ Ống Đồng Nike Mercurial Lite", category: "PHỤ KIỆN", price: 300000, image: "https://i.ebayimg.com/images/g/VHwAAOSw1OhnrDR7/s-l1600.webp", description: "Bịt bảo vệ ống đồng Nike Mercurial Lite nhẹ và thoải mái, bảo vệ hiệu quả trong suốt trận đấu.", inStock: true, size: sizeOngDong},
        {name: "Tất chống trơn bóng đá cao cấp SoxPro", category: "PHỤ KIỆN", price: 100000, image: "https://product.hstatic.net/200000411627/product/soxpro-classic-grip-socks__1__7cfb9aaf567d409987055a04a473fe36_master.jpg", description: "Vớ chống trượt thể thao, thoáng khí, thấm hút, bám sân tốt.", inStock: true, size: []},
        {name: "Băng gối, bó gối thể thao co giãn đàn hồi bảo vệ gối cao cấp chính hãng Grand Sport", category: "PHỤ KIỆN", price: 100000, image: "https://down-vn.img.susercontent.com/file/vn-11134208-7r98o-ltkval3kuh3hb8", description: "Băng gối thể thao giúp vệ đầu gối trong suốt quá trình thi đấu cho những người có vấn đề về đầu gối.", inStock: true, size: []},
        {name: "Bình xịt nóng Ligpro (200ml)", category: "PHỤ KIỆN", price: 120000, image: "https://shopvnb.com//uploads/gallery/xit-nong-200ml_1736888617.webp", description: "Giúp làm nóng các cơ trước khi bước vào trận đấu.", inStock: true, size: []},
        {name: "Bình xịt lạnh Ligpro (160ml)", category: "PHỤ KIỆN", price: 120000, image: "https://cdn.shopvnb.com/uploads/gallery/binh-xit-lanh-ligpro-160ml-1_1730145413.webp", description: "Giúp làm giảm những chấn thương và các cơn đau gặp phải trong quá trình thi đấu.", inStock: true, size: []},
        {name: "Băng keo thể thao Nano cuộn 2.5cm", category: "PHỤ KIỆN", price: 10000, image: "https://shopvnb.com//uploads/gallery/bang-keo-the-thao-nano-cuon-2-5cm_1695262727.webp", description: "Giúp hỗ trợ, gia tăng hiệu suất tập luyện và giảm chấn thương khi tập luyện và thi đấu. ", inStock: true, size: []},
        {name: "Áo Giữ Nhiệt AKKA Màu Đen", category: "PHỤ KIỆN", price: 100000, image: "https://pos.nvncdn.com/3c8244-211061/ps/20231121_jZSEVvhRKt.jpeg?v=1700551004", description: "Giúp tránh những trận đấu có thời tiết nắng hoặc lạnh.", inStock: true, size: sizeQuanAo},
        {name: "Quần Body AKKA Pro Màu Đen", category: "PHỤ KIỆN", price: 100000, image: "https://pos.nvncdn.com/3c8244-211061/ps/20231130_62Bi8AMWVo.jpeg?v=1701317661", description: "Giúp tránh những trận đấu có thời tiết nắng hoặc lạnh.", inStock: true, size: sizeQuanAo},
        ];
    try {
        await Product.deleteMany({});
        await Product.insertMany(sampleData);
        res.send("ĐÃ THÊM DỮ LIỆU THÀNH CÔNG! VUI LÒNG QUAY LẠI TRANG CHỦ.");
    } catch (err) {
        res.status(500).send("LỖI KHI THÊM DỮ LIỆU: " + err.message);
    }
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));