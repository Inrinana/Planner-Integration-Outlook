const {Pool} = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testDB',
  password: '123',
  port: 5432  
  
});


db.connect(function(err) {
    if (err) {
      return console.error('Ошибка: ' + err);
    } else {
      console.log("Подключение к бд - успешно")
    }
});

async function fetchDataFromDB() {
  var sql = `UPDATE public."tblUsr" SET usr_psw = $1 WHERE usr_psw IS NULL;`;
try {
  const randomPasswordLength = 10; // Длина случайного пароля
  const randomPassword = generateRandomPassword(randomPasswordLength);
  const result = await db.query(sql, [randomPassword]);
  console.log(`-- проверены строки`);
} catch (error) {
  console.error('-- Ошибка при обновлении паролей:', error);
};
}

const interval = 300000;
setInterval(fetchDataFromDB, interval);

function generateRandomPassword(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*-_=+';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }
  return password;
}


module.exports = db; 
