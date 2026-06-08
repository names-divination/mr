export function encodeSave(data){
  return "MZE1-" + btoa(JSON.stringify(data));
}

export function decodeSave(code){
  if(!code.startsWith("MZE1-")) return null;
  return JSON.parse(atob(code.slice(5)));
}
