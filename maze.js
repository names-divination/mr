export function mulberry32(seed){
  return function(){
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function generateMaze(size, seed){

  const rand = mulberry32(seed);

  const maze = Array(size)
    .fill()
    .map(()=>Array(size).fill(1));

  function dig(x,y){

    maze[y][x]=0;

    const dirs=[
      [2,0],
      [-2,0],
      [0,2],
      [0,-2]
    ];

    dirs.sort(()=>rand()-0.5);

    for(const [dx,dy] of dirs){

      const nx=x+dx;
      const ny=y+dy;

      if(
        nx>0 && ny>0 &&
        nx<size-1 && ny<size-1 &&
        maze[ny][nx]===1
      ){

        maze[y+dy/2][x+dx/2]=0;
        dig(nx,ny);

      }
    }
  }

  dig(1,1);

  return maze;
}
export function bfsDistances(maze, startX, startZ){
  const size = maze.length;

  const dist = Array(size)
    .fill()
    .map(()=>Array(size).fill(-1));

  const queue = [];

  queue.push([startX,startZ]);
  dist[startZ][startX] = 0;

  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  while(queue.length){
    const [x,z] = queue.shift();

    for(const [dx,dz] of dirs){
      const nx = x + dx;
      const nz = z + dz;

      if(
        nx>=0 && nz>=0 &&
        nx<size && nz<size &&
        maze[nz][nx] === 0 &&
        dist[nz][nx] === -1
      ){
        dist[nz][nx] = dist[z][x] + 1;
        queue.push([nx,nz]);
      }
    }
  }

  return dist;
}
export function findFarthest(dist){

  let max = -1;
  let gx = 1;
  let gz = 1;

  for(let z=0; z<dist.length; z++){
    for(let x=0; x<dist.length; x++){

      if(dist[z][x] > max){
        max = dist[z][x];
        gx = x;
        gz = z;
      }

    }
  }

  return {gx,gz};
}
export function bfsParents(maze, startX, startZ){

  const size = maze.length;

  const parent = Array(size)
    .fill()
    .map(()=>Array(size).fill(null));

  const visited = Array(size)
    .fill()
    .map(()=>Array(size).fill(false));

  const queue = [];

  queue.push([startX,startZ]);
  visited[startZ][startX] = true;

  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  while(queue.length){

    const [x,z] = queue.shift();

    for(const [dx,dz] of dirs){

      const nx = x + dx;
      const nz = z + dz;

      if(
        nx>=0 && nz>=0 &&
        nx<size && nz<size &&
        maze[nz][nx] === 0 &&
        !visited[nz][nx]
      ){

        visited[nz][nx] = true;
        parent[nz][nx] = [x,z];
        queue.push([nx,nz]);

      }
    }
  }

  return parent;
}
