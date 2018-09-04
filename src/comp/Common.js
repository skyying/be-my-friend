export const hasValueInObj = (obj, value) => {
  for (let name in obj) {
    if (obj[name] === value) {
      return true;
    }
  }
  return false;
};

export const getKeyByValue = (obj, value) => {
  for (let key in obj) {
    if (obj[key] === value) {
      return key;
    }
  }
  return null;
};

export const genRandomKey = (n = 3) => {
  let letter = "abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVXYZ";
  return Array.from({length: n})
    .fill(0)
    .map(w => letter[Math.floor(Math.random() * (letter.length - 1))])
    .join("");
};
