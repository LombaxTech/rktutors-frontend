import moment from "moment";

export function smallBigString(str1, str2) {
  if (str1 < str2) {
    return str1 + str2;
  }
  return str2 + str1;
}

export const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

export const formatDate = (date) => moment(date).format("ha DD/MM/YYYY");

export function makeId(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const getMean = (array) => array.reduce((a, b) => a + b) / array.length;
