const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password} = req.body;

        if (!email && !phone) {
            return res.status(400).json({ message: 'Vui lòng đăng nhập Email hoặc Số điện thoại!'});
        }

        const existingUser = await User.findOne ({
            $or: [
                { email: emal || "khong-co-email"},
                { phone: phone || "khong-co-phone"}
            ]
        });
        if (existingUser) {
            return res.status(400).json({ mesage: 'Email hoặc Số điện thoại này đã được sử dụng!'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User ({
            name,
            password: hashedPassword,
            ...User(email && { email }),
            ...User(phone && { phone })
        });

        const user = await newUser.save();

        res.status(200).json ({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            mesage: 'Đăng ký thành công!'
        });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ: ' + err.mesage});
    }
});

router.post('/login', async (req, res) => {
    try {
        const { loginInput, password } = req.body;

        const user = await User.findOne ({
            $or: [
                { email: loginInput },
                { phone: loginInput }
            ]
        });

        if (!user) {
            return res.status(400).json({ message: 'Tài khoản không tồn tại!'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu không đúng!'});
        }

        res.status(200).json ({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
            message: 'Đăng nhập thành công!'
        });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ: ' + err.message});
    }
});

module.export = router;