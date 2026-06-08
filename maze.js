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
