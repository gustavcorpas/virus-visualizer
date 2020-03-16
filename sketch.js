const canvasWidth = 640;
const canvasHeight = 480;
const hittimeout = 100;

let started = false;

let sicktimeout = 2000;
let blobamount = 200;
let stopamount = 0;

let maxNumberOfSick = 0;

let blobs = [];

function setup(){
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('sketch-holder');

  frameRate(60);
}

function start(){

  if(started){
    return;
  }
  started = true;

  let c_sick = color('#b75b4d');
  let c_healty = color('#55b752');
  let c_bland = color('#b4b1b7');

  for(let i = 0; i < (blobamount - 1 - stopamount); i++){
    let vector = createVector(random(0 + 20, canvasWidth - 20), random(0 + 20, canvasHeight - 20));
    let direction = createVector(random(-1, 1), random(-1, 1));
    blobs.push(new Blob(c_bland, vector, direction));
  }
  for(let i = 0; i < stopamount; i++){
    let vector = createVector(random(0 + 20, canvasWidth - 20), random(0 + 20, canvasHeight - 20));
    let direction = createVector(0, 0);
    blobs.push(new Blob(c_bland, vector, direction));
  }

  let vector = createVector(random(0 + 20, canvasWidth - 20), random(0 + 20, canvasHeight - 20));
  let direction = createVector(random(-1, 1), random(-1, 1));
  blobs.push(new Blob(c_sick, vector, direction, 'sick', new Date()));


  setTimeout(pushToPanel,1000);

  function pushToPanel(){
    let sick = []; healthy = []; bland = [];
    for(let blob of blobs){
      switch (blob.status) {
        case 'sick':
          sick.push(blob);
          break;
        case 'healthy':
          healthy.push(blob);
          break;
        default:
          bland.push(blob);
          break;

      }
    }

    config.data.labels.push(new Date().getSeconds().toString());

    config.data.datasets[0].data.push(sick.length);
    config.data.datasets[1].data.push(healthy.length);
    config.data.datasets[2].data.push(bland.length);

    if(window.myLine){
      window.myLine.update();
    }


    maxNumberOfSick = max(config.data.datasets[0].data);
    document.querySelector('#maxNumberOfSick').innerText = maxNumberOfSick;
    document.querySelector('#maxNumberOfSickPercent').innerText = nf((maxNumberOfSick / blobs.length) * 100, 0, 2);


    setTimeout(pushToPanel, 1000);
  }



}

function draw() {



  // clear
  fill(255);
  stroke('#333');
  rect(0,0,canvasWidth, canvasHeight);

  drawBlobs();
  moveBlobs();
  updateBlobs();

}


function drawBlobs(){
  for(let blob of blobs){
    fill(blob.color);
    noStroke();
    ellipse(blob.pos.x, blob.pos.y, blob.size, blob.size);
  }
}

function moveBlobs(){
  for(let blob of blobs){
    blob.pos = blob.pos.add(blob.direction);
  }
}

function updateBlobs(){
  for(let i = 0; i < blobs.length; i++){

    if(blobs[i].status == 'sick' && new Date().getTime() - blobs[i].timesincesick.getTime() > sicktimeout){
      blobs[i].status = 'healthy';
      blobs[i].color = color('#55b752');
    }

    if(new Date().getTime() - blobs[i].lasthit.getTime() < hittimeout){
      continue;
    }

    if(hitwall(blobs[i])){

    }
    for(let j = 0; j < blobs.length; j++){
      if(i == j) continue;

      if(intersects(blobs[i], blobs[j])){
        // two blobs have collided

        // bounce them... DISABLED because no :(
        let direction_i = blobs[i].direction;
        let direction_j = blobs[j].direction
        blobs[i].direction.reflect(createVector(0,0)).setMag(direction_i.mag());
        blobs[i].lasthit = new Date();

        // color them

        if(blobs[i].status == 'healthy'){

        }
        else if(blobs[j].status == 'sick'){
          blobs[i].status = 'sick';
          blobs[i].color = color('#b75b4d');
          blobs[i].timesincesick = new Date();
        }

      }

    }
  }
}

function intersects(a, b){

  if(abs(a.pos.x - b.pos.x) < a.size && abs(a.pos.y - b.pos.y) < a.size){
    return true;
  }
  return false;
}

function hitwall(a){

  if(a.pos.x - a.size < 0 || a.pos.x + a.size > canvasWidth){

      a.direction.reflect(createVector(1, 0)).normalize();
      a.lasthit = new Date();



  }
  if(a.pos.y - a.size < 0 || a.pos.y + a.size > canvasHeight){

      a.direction.reflect(createVector(0, 1)).normalize();
      a.lasthit = new Date();

  }
  return false;
}



class Blob {
  constructor(color, vector, direction, status = 'bland', timesincesick = null, size = 10){
    this.lasthit = new Date();
    this.size = size;
    this.color = color;
    this.pos = vector;
    this.direction = direction;
    this.status = status;
    this.timesincesick = timesincesick;
  }


}
