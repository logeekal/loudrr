const { default: axios } = require("axios");

function getCurrentDate() {
    return Date.now().toLocaleString();
}

const fs = require('fs');
const path = require('path');

async function getAvatar (seed) {
    const API_HOST= 'https://robohash.org';
    const image = await axios.get(`${API_HOST}/${seed}`,{responseType: "arraybuffer"});
    const raw = Buffer.from(image.data).toString('base64');
    return `data:${image.headers['Content-Type']};base64,${raw}`
    
}







function getTestAvatar () {
    const file = `${process.cwd()}/assets/test_avatar.png`;
    const image = fs.readFileSync( file);
    const imageExt = path.extname(file);
    const raw = Buffer.from(image).toString('base64')
    return `data:${imageExt};base64,${raw}`
}

module.exports = {
    getCurrentDate,    
    getAvatar,
    getTestAvatar

}