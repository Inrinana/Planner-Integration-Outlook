var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer')
const urlencodedParser = express.urlencoded({extended: false});
var db = require('../db/db_connect');


router.get('/', (req, res) => {
  const token = req.query.token;
  
  try {
    // Поиск пользователя по токену и проверка срока действия
    const query = `SELECT * FROM public."tblUsr" WHERE reset_token = $1 AND reset_token_expiration > $2`;
    db.query(query, [token, Date.now()], (err, data) => {
      if (err) {
        throw err;
      } else {
        const user = data.rows[0];
        if (!user) {
        return res.send('Ссылка недействительна или истек срок действия.');
      } else {
        // Отправка страницы с формой смены пароля
        res.render('permPass', { token });
      }
      }
      
    });
 
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    res.send('Произошла ошибка.');
  }
});


router.post('/', urlencodedParser, async (req, res) => {
  const email = req.body.email;

  // Генерирование и сохранение временного токена в базе данных
  const token = generateRandomToken();
  var expiration = Date.now() + 5 * 60 * 1000; // Срок действия 5 минут
  await saveTokenToDatabase(token, expiration, email);

  // Отправка письма с ссылкой для смены пароля
  const resetLink = `http://localhost:3000/resetPass?token=${token}`;
  sendResetPasswordEmail(email, resetLink);

  console.log('Письмо с инструкциями отправлено.');
  res.render('index')
});

async function saveTokenToDatabase(token, expiration, email) {
  try {
    console.log(typeof(token), expiration, email)
    // Подключение к базе данных и сохранение токена
    await db.query(`UPDATE public."tblUsr" SET reset_token = '${token}', reset_token_expiration = ${expiration} WHERE usr_email = '${email}'`);
    console.log('Токен успешно сохранен в базе данных.');
  } catch (error) {
    console.error('Ошибка при сохранении токена:', error);
  }
}

async function sendResetPasswordEmail(email, resetLink) {
  try {
    // Создание транспортера для отправки электронной почты
    let transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 587,
      secure: false,
      auth: {
          user: process.env.USER,
          pass: process.env.PASS,
      },
    });

    // Отправка письма
    await transporter.sendMail({
      from: '"Планер" <>',
      to: email,
      subject: 'Новый пароль',
      text: `Здравствуйте!

      Вы получили это письмо, потому что запросили смену пароля для вашей учетной записи.
      
      Для смены пароля, пожалуйста, перейдите по следующей ссылке:
      
      ${resetLink}
      
      Ссылка будет действительна в течение 5 минут. 
      
      Если вы не запрашивали смену пароля, пожалуйста, проигнорируйте это письмо.
      
      С наилучшими пожеланиями,
      Команда поддержки!`,
    });
    console.log('Письмо успешно отправлено.');
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
  }
}


function generateRandomToken() {
  const length = 32;
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  return token;
}

module.exports = router;