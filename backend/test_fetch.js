const fetch = require('node-fetch');
const fs = require('fs');
const FormData = global.FormData;
const { Blob } = require('buffer');

async function run() {
  try {
    fs.writeFileSync('dummy.txt', 'hello');
    const formData = new FormData();
    formData.append('image', new Blob([fs.readFileSync('dummy.txt')]), 'dummy.txt');
    const res = await fetch('http://localhost:5001/predict', { method: 'POST', body: formData });
    console.log(res.status);
    console.log(await res.text());
  } catch (e) {
    console.error(e);
  }
}
run();
