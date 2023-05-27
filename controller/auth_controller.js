const pool = require("../config/db_connection");
const crypto = require("crypto");
const algorithm = "aes-256-cbc"; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const jwt = require("jsonwebtoken");
pool.on("error", (err) => {
  console.error(err);
});
const encryption = (id) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedData = cipher.update(id, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData;
};
const decrypted = (text) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decryptedData = decipher.update(text, "hex", "utf-8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
};
const register = (req, res) => {
  const { username, password } = req.body;
  const sql = `INSERT INTO auth (username,password) VALUES('${username}','${password}')`;
  const sqlValidate = `SELECT* FROM auth WHERE username='${username}'`;
  pool.query(sqlValidate, (error, result) => {
    if (error) {
      res.status(400).json({ message: `${error}` });
    } else {
      if (result.length > 0) {
        res.status(400).json({ message: "username already exist" });
      } else {
        pool.query(sql, (error, result) => {
          if (error) {
            res.status(400).json({ message: `${error}` });
          } else {
            res.status(200).json(result);
          }
        });
      }
    }
  });
};
const login = (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM auth WHERE username='${username}' AND password='${password}'`;
  pool.query(sql, (error, result) => {
    if (error) {
      res.status(400).json({ message: `${error}` });
    }
    if (result.length > 0) {
      const id = encryption(result[0].id.toString());

      const user = {
        id: id,
        username: result[0].username,
      };
      const token = jwt.sign(user, process.env.SECRET_KEY);
      res.status(200).json({ message: "success", token: token });
    }
  });
};
const getUser = (req, res) => {
  try {
    res.status(200).json({ message: "success", data: req.user });
  } catch (error) {
    res.status(400).json({ message: "failed" });
  }
};
const getUsers = (req, res) => {
  const sql = `SELECT * FROM auth`;
  pool.query(sql, (error, result) => {
    if (error) {
      res.status(400).json({ message: `${error}` });
    } else {
      res.status(200).json({ message: "success", data: result });
    }
  });
};
const getUserById = (req, res) => {
  const { id } = req.params;
  const decId = decrypted(id);

  const sql = `SELECT * FROM auth WHERE id=${decId}`;
  pool.query(sql, (error, result) => {
    if (error) {
      res.status(400).json({ message: `${error}` });
    } else {
      res.status(200).json({ message: "success", data: result });
    }
  });
  //   res.json({ decId });
};
module.exports = { register, login, getUser, getUserById };
