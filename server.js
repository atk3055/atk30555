

// استيراد الحزم
const express = require('express');
const fetch = require('node-fetch');
const app = express(); // إنشاء تطبيق Express

// تمكين معالجة JSON
app.use(express.json());

// المسار لمعالجة الكود المرسل من Discord
app.post('/exchange-code', async (req, res) => {
    const { code } = req.body;

    try {
        // إرسال طلب إلى Discord لاستبدال الكود بـ Access Token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: '1172257242913984512',
                client_secret: 'hQxN_GRZNKoq-ZuNlJIa6pYuNrdJ3cG2',
                grant_type: 'authorization_code', // نوع الطلب
                code: code, // الكود المستلم من Discord
                redirect_uri: 'https://atk3055.github.io/atk30555/callback.html', // رابط إعادة التوجيه
            }),
        });

        const tokenData = await tokenResponse.json(); // تحليل استجابة JSON

        // التحقق من نجاح استبدال الكود
        if (tokenData.access_token) {
            // استخدام Access Token لجلب بيانات المستخدم
            const userResponse = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                },
            });

            const userData = await userResponse.json(); // تحليل بيانات المستخدم
            res.json({ username: userData.username, id: userData.id }); // إرسال البيانات إلى العميل
        } else {
            res.status(400).json({ error: tokenData.error_description || 'Failed to exchange code.' });
        }
    } catch (error) {
        console.error('Error:', error); // تسجيل الأخطاء
        res.status(500).json({ error: 'Internal Server Error.' });
    }
});

// تشغيل الخادم
const PORT = 21445; // المنفذ الذي يعمل عليه الخادم
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
