const extractFrames = require('ffmpeg-extract-frames')
const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(400, 220)
const ctx = canvas.getContext('2d');
const GIFEncoder = require('gifencoder');
const encoder = new GIFEncoder(400, 220);
const pngFileStream = require('png-file-stream');

new Promise(async(resolve, reject) => {
  let offsets = []
  for(let i=6000; i<10000; i+=100){
    offsets.push(i);
  }
  
  await extractFrames({
    input: '1.mp4',
    output: './screenshot-%i.jpg',
    offsets: offsets
  }).catch(err=>{
    console.log('err', err)
  });  
  
  play = await loadImage('./overlay.png');
  //banner = await loadImage('./banner.png');
  
  for(let i=1; i<40; i++){
    image = await loadImage(`./screenshot-${i}.jpg`);
    let height = image.height;
    let width = image.width;
    if(height > width) {
      ctx.rect(0, 0, 400, 220);
      ctx.fillStyle = '#000000';
      ctx.fill();
      width = 220*width/height;
      height = 220;
      ctx.drawImage(image, (400-width)/2, 0, width, height);
    } else {
      height = 220;
      width = 400;
      ctx.drawImage(image, 0, 0, width, height);
    }
    // ctx.rect(60, 100, 150, 30);
    // ctx.globalAlpha  = 0.7;
    // ctx.fillStyle = '#333';
    // ctx.fill();
    // ctx.globalAlpha = 1.0;
    // ctx.font = '20px Impact'
    // ctx.fillStyle = '#ffffff';
    // ctx.fillText('Play a video', 70, 120)
    // ctx.drawImage(play, 10, 95, 40, 40)
    ctx.drawImage(play, 10, 150);
    ctx.drawImage(banner, 30, 30, 80, 45);
    let buf = canvas.toBuffer();
    if (i < 10) {
      fs.writeFileSync(`test-0${i}.png`, buf);
    } else {
      fs.writeFileSync(`test-${i}.png`, buf);
    }
  }
  
  const stream = pngFileStream('./test-??.png')
    .pipe(encoder.createWriteStream({ repeat: 0, delay: 100, quality: 10 }))
    .pipe(fs.createWriteStream('myanimated.gif'));


    stream.on('finish', () => {
      resolve
    });
    stream.on('error', err=>{
      console.log('err', errr)
      reject
    });
  });

