/**
 * Develop a program that allows users to input plain text,
 * which will then be encrypted using either AES (for symmetric encryption) or RSA (for asymmetric encryption)
 */

const express = require("express");
const bodyParser = require("body-parser");
const CryptoJS = require("crypto-js");
const NodeRSA = require("node-rsa");

const app = express();
const port = 3000;
app.use(express.json());
// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static HTML
app.use(express.static("public"));

// AES Encryption
function aesEncrypt(plainText, key) {
  return CryptoJS.AES.encrypt(plainText, key).toString();
}

// RSA Encryption
function rsaEncrypt(plainText, publicKey) {
  const key = new NodeRSA();
  key.importKey(publicKey, "pkcs1-public-pem");
  return key.encrypt(plainText, "base64");
}

// RSA Key Pair Generation
function generateRsaKeys() {
  const key = new NodeRSA({ b: 512 });
  return {
    publicKey: key.exportKey("pkcs1-public-pem"),
    privateKey: key.exportKey("pkcs1-private-pem"),
  };
}

// Route to handle encryption
app.post("/encrypt", async (req, res) => {
  const { method, key, plainText } = req.body;
    console.log(req.body);
    
  try {
    let cipherText;
    if (method === "AES") {
      cipherText = aesEncrypt(plainText, key);
      
    } else if (method === "RSA") {
      cipherText = rsaEncrypt(plainText, key);
    }
    
    res.json({ success: true, cipherText });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Route to generate RSA keys
app.get("/generate-rsa-keys", (req, res) => {
  const keys = generateRsaKeys();
  res.json(keys);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
