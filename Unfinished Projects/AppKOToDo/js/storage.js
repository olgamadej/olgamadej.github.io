/* store values*/
localStorage.setItem('key', 'value');

/*retrieve values*/
let val = localStorage.getItem('key');
console.log(val);
let key = 'pacman_highscore';
localStorage.setItem(key, 123123);

let options =
  {"name":"Walter",
  "game":"bowling",
  "weapons": ["uzi", "pistol", "anger"]};
let str = JSON.stringify(options); /*parses the 'options', which has an array within so couldn't in its normal state be passed to the JSON file*/
localStorage.setItem("TheDude", str);

let original = localStorage.getItem("TheDude");

console.log(original);
