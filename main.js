import * as THREE from
"https://unpkg.com/three@0.160.0/build/three.module.js";

import {generateMaze, bfsDistances, findFarthest}
from "./maze.js";

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

  // ===== 迷路生成 =====
  maze = generateMaze(size, seed);
  import {bfsParents, buildPath} from "./maze.js";
  const parent = bfsParents(maze, 1, 1);

// 一番遠い場所を探す（簡易：ランダムじゃなく右下寄り）
let endX = 1;
let endZ = 1;

for(let z=0; z<size; z++){
  for(let x=0; x<size; x++){
    if(maze[z][x] === 0){
      endX = x;
      endZ = z;
    }
  }
}

// 経路作成
const path = buildPath(parent, endX, endZ);

// ルートが短すぎる場合保険
if(path.length < 10) return;

// 🔥 重要：順番配置
const keyIndex = Math.floor(path.length * 0.3);
const doorIndex = Math.floor(path.length * 0.6);
const goalIndex = path.length - 1;

const [kx, kz] = path[keyIndex];
const [dx, dz] = path[doorIndex];
const [gx, gz] = path[goalIndex];

// 置く（レイヤー管理）
maze[kz][kx] = 2; // key
maze[dz][dx] = 3; // door
maze[gz][gx] = 4; // goal
  const dist = bfsDistances(maze, 1, 1);
  const goal = findFarthest(dist);

  maze[goal.gz][goal.gx] = 4;

  buildMaze();

  camera.position.set(1,1,1);

  document.getElementById("menu")
    .style.display = "none";

  animate();
}

function buildMaze(){

  const wallMat =
    new THREE.MeshBasicMaterial({color:0xffffff});

  const floorMat =
    new THREE.MeshBasicMaterial({color:0x222222});

  const goalMat =
    new THREE.MeshBasicMaterial({color:0x00ff00});

  for(let z=0; z<size; z++){
    for(let x=0; x<size; x++){

      // 壁
      if(maze[z][x] === 1){

        const wall =
          new THREE.Mesh(
            new THREE.BoxGeometry(1,2,1),
            wallMat
          );

        wall.position.set(x,1,z);
        scene.add(wall);
      }

      // ゴール
      else if(maze[z][x] === 4){

        const goal =
          new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            goalMat
          );

        goal.position.set(x,0.5,z);
        scene.add(goal);
      }

      // 床
      else{

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

  // 壁判定
  if(maze[Math.floor(nz)][Math.floor(nx)] !== 1){
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
