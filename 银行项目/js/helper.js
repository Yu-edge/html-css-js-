// 首字母大写
const firstLetterU = function (str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
};

// 排序
const sortAscend = function (arr) {
  return arr.sort((a, b) => {
    return a - b;
  });
};
const sortDecend = function (arr) {
  return arr.sort((a, b) => {
    return b - a;
  });
};
