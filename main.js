import * as THREE from
"https://unpkg.com/three@0.160.0/build/three.module.js";

import {generateMaze} from "./maze.js";
import {encodeSave, decodeSave} from "./save.js";
import {bfsDistances, findFarthest} from "./maze.js";

let scene, camera, renderer;
let maze = [];
let size = 31;

let player = {x:1,z:1};
let seed = Math.floor(Math.random()*999999);

init();

function init(){

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    innerWidth/innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(innerWidth, innerHeight);

  document.getElementById("game")
    .appendChild(renderer.domElement);

  maze = generateMaze(size, seed);
  const startX = 1;
const startZ = 1;

const dist = bfsDistances(maze, startX, startZ);

const goal = findFarthest(dist);

maze[goal.gz][goal.gx] = 4;

  buildMaze();

  camera.position.set(1,1,1);

  document.getElementById("menu")
    .style.display = "none";

  animate();
}

function buildMaze(){

  const wallMat = new THREE.MeshBasicMaterial({color:0xffffff});
  const floorMat = new THREE.MeshBasicMaterial({color:0x222222});

  for(let z=0;z<size;z++){
    for(let x=0;x<size;x++){

      if(maze[z][x]===1){

        const wall =
          new THREE.Mesh(
            new THREE.BoxGeometry(1,2,1),
            wallMat
          );

        wall.position.set(x,1,z);
        scene.add(wall);

      }else{

        const floor =
          new THREE.Mesh(
            new THREE.PlaneGeometry(1,1),
            floorMat
          );

        floor.rotation.x = -Math.PI/2;
        floor.position.set(x,0,z);

        scene.add(floor);
      }
    }
  }
}

let keys={};

addEventListener("keydown",(e)=>{
  keys[e.key]=true;
});

addEventListener("keyup",(e)=>{
  keys[e.key]=false;
});

function updatePlayer(){

  let speed = 0.05;

  let nx = player.x;
  let nz = player.z;

  if(keys["w"]) nz -= speed;
  if(keys["s"]) nz += speed;
  if(keys["a"]) nx -= speed;
  if(keys["d"]) nx += speed;

  if(maze[Math.floor(nz)][Math.floor(nx)]===0){
    player.x = nx;
    player.z = nz;
  }

  camera.position.set(
    player.x,
    1,
    player.z
  );
}

function animate(){

  requestAnimationFrame(animate);

  updatePlayer();

  renderer.render(scene,camera);
}
