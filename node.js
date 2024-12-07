/**
 * Develop a program that allows users to input plain text,
 * which will then be encrypted using either AES (for symmetric encryption) or RSA (for asymmetric encryption)
 */

// Import required libraries
const CryptoJS = require('crypto-js');
const NodeRSA = require('node-rsa');
const readline = require('readline');

// Create an interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Symmetric Encryption using AES
function aesEncrypt(plainText, key) {
  const cipherText = CryptoJS.AES.encrypt(plainText, key).toString();
  return cipherText;
}

// Asymmetric Encryption using RSA
function rsaEncrypt(plainText, publicKey) {
  const key = new NodeRSA();
  key.importKey(publicKey, 'pkcs1-public-pem');
  const cipherText = key.encrypt(plainText, 'base64');
  return cipherText;
}

// Generate RSA key pair
function generateRsaKeys() {
  const key = new NodeRSA({ b: 512 }); // 512-bit key for demonstration
  const publicKey = key.exportKey('pkcs1-public-pem');
  const privateKey = key.exportKey('pkcs1-private-pem');
  return { publicKey, privateKey };
}

// Prompt user for encryption method
rl.question('Enter the text to encrypt: ', (plainText) => {
  rl.question('Choose encryption method (AES/RSA): ', (method) => {
    if (method.toLowerCase() === 'aes') {
      rl.question('Enter AES encryption key: ', (aesKey) => {
        const encryptedText = aesEncrypt(plainText, aesKey);
        console.log(`Encrypted Text (AES): ${encryptedText}`);
        rl.close();
      });
    } else if (method.toLowerCase() === 'rsa') {
      const { publicKey, privateKey } = generateRsaKeys();
      console.log(`Generated Public Key: \n${publicKey}`);
      console.log(`Generated Private Key: \n${privateKey}`);
      const encryptedText = rsaEncrypt(plainText, publicKey);
      console.log(`Encrypted Text (RSA): ${encryptedText}`);
      rl.close();
    } else {
      console.log('Invalid method. Please choose AES or RSA.');
      rl.close();
    }
  });
});
