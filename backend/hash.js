const bcrypt = require('bcryptjs');

const password = "admin123";

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.log(err);
  } else {
    console.log("HASHED PASSWORD:");
    console.log(hash);
  }
});
