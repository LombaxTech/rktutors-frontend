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

export const isPast = (date) => date < new Date();

export const formatDate = (date) => moment(date).format("ha DD/MM/YY");

export const formatMsgDate = (date) =>
  moment(date).format("hh:mma  DD/MM/YYYY");

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

export const hasStudentBookedTutor = (studentId, tutor) =>
  tutor.prevBookedStudents.some((student) => student.id === studentId);

export const getLastNChars = (string, n) => string.substr(string.length - n);

export const toTitleCase = (phrase) =>
  phrase
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const diffHours = (date1, date2) => Math.abs(date1 - date2) / 36e5;
