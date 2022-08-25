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
