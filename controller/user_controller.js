const pool = require("../config/db_connection");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const gc = new Storage({
  keyFilename: path.join(__dirname, "./ethos-firestore-key.json"),
  projectId: "ethos-kreatif-app",
});
const patnerEthosBucket = gc.bucket("patner-ethos");
pool.on("error", (err) => {
  console.error(err);
});

const getData = (req, res) => {
  let myQuery = "SELECT * FROM users";
  pool.query(myQuery, (err, result) => {
    if (err) {
      res.status(400).json({ message: `${err}` });
    } else {
      res.status(200).json({ message: "success", data: result });
    }
  });
};

const createData = async (req, res) => {
  const { name } = req.body;
  let data;
  if (req.file) {
    data = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    patnerEthosBucket
      .file(req.file.filename)
      .createWriteStream({ resumable: false, gzip: true });
  } else {
    return res.status(400).json({ message: "no image found" });
  }

  const sql = `INSERT INTO users (name,picture) VALUES('${name}','${data.toString()}')`;
  await pool.query(sql, (error, result) => {
    if (error) {
      res.status(400).json({ message: `${error}` });
    } else {
      res.status(200).json(result);
    }
  });
};
const updateData = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  let data;
  if (req.file) {
    data = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  } else {
    return res.status(400).json({ message: "no image found" });
  }
  const sql = `UPDATE users SET name='${name}',picture='${data.toString()}' WHERE id=${id}`;
  await pool.query(sql, (error, result) => {
    if (error) {
      res.status(400).json({ message: `${error}` });
    } else {
      res.status(200).json(result);
    }
  });
};
const deleteData = async (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM users WHERE id=${id}`;
  await pool.query(sql, (error, result) => {
    if (error) {
      res.status(400).json({ message: `${error}` });
    } else {
      res.status(200).json(result);
    }
  });
};
const oneData = async (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM users WHERE id=${id}`;
  await pool.query(sql, (error, result) => {
    if (error) {
      res.status(400).json({ message: `${error}` });
    } else {
      res.status(200).json(result);
    }
  });
};

module.exports = { getData, createData, updateData, deleteData, oneData };
