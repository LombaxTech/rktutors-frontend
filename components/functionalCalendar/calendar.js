import moment from "moment";
import React, { useState, useEffect } from "react";

export default function FunctionalCalendar({
  minDate,
  disableDays,
  disabledTimes,
  interval,
  onChange,
  minHour,
  maxHour,
}) {
  const [currentDay, setCurrentDay] = useState(
    new Date(new Date().setHours(0, 0, 0))
  );
  const [currentMonthName, setCurrentMonth] = useState("");
  const [days, setDays] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [selectedTime, setSelectedTime] = useState("00:00");
  // const [minDate, setMinDate] = useState(null);
  // const [disableDays, setDisableDays] = useState([]);
  // const [disabledTimes, setDisabledTimes] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState(60);
  const [selectedDay, setSelectedDay] = useState(
    new Date(new Date().setHours(0, 0, 0))
  );

  const [loading, setLoading] = useState(true);

  function daysToShow(disable = disableDays, back = null) {
    const milliSecsInDays = 86400000;
    const currentDayTimeStamp = new Date(currentDay).getTime();
    let dayTime = currentDayTimeStamp;

    let days = [];

    for (let i = 0; days.length < 8; i++) {
      back
        ? days.unshift({
            date: new Date(dayTime),
            readableDate: moment(new Date(dayTime)).format("ddd, MMM DD"),
          })
        : days.push({
            date: new Date(dayTime),
            readableDate: moment(new Date(dayTime)).format("ddd, MMM DD"),
          });

      dayTime = back ? dayTime - milliSecsInDays : dayTime + milliSecsInDays;
    }

    return days;
  }

  function intervalMaker() {
    let timeArray = [];

    if (minHour && maxHour) {
      for (let i = minHour; i < maxHour; i++) {
        for (
          let minutes = 0;
          minutes < 60;
          minutes = minutes + selectedInterval
        ) {
          let hours = i < 10 ? `0${i}` : i;
          let mins = minutes < 10 ? `0${minutes}` : minutes;

          timeArray.push({
            value: `${hours}:${mins}`,
            disabled: disabledTimes.includes(`${hours}:${mins}`),
          });
        }
      }
    } else {
      for (let i = 0; i < 24; i++) {
        for (
          let minutes = 0;
          minutes < 60;
          minutes = minutes + selectedInterval
        ) {
          let hours = i < 10 ? `0${i}` : i;
          let mins = minutes < 10 ? `0${minutes}` : minutes;

          timeArray.push({
            value: `${hours}:${mins}`,
            disabled: disabledTimes.includes(`${hours}:${mins}`),
          });
        }
      }
    }

    setTimeOptions(timeArray);
  }

  useEffect(() => {
    setLoading(true);

    let disableArray = !!disableDays
      ? disableDays.map((item) => {
          return moment(new Date(new Date(item))).format("YYYY-MM-DD");
        })
      : [];

    const calendarData = daysToShow(disableArray);

    setDays(calendarData);
    minDate = !!minDate
      ? moment(new Date(new Date(minDate).setHours(0, 0, 0))).format(
          "YYYY-MM-DD"
        )
      : null;

    disableDays = !!disableDays
      ? disableDays.map((item) => {
          return moment(new Date(new Date(item))).format("YYYY-MM-DD");
        })
      : [];

    disabledTimes = !!disabledTimes ? disabledTimes : [];

    setSelectedInterval(interval);
    intervalMaker();
    setLoading(false);
  }, []);

  useEffect(() => {
    const timeArray = !!selectedTime ? selectedTime.split(":") : [0, 0];

    onChangeHandler(
      new Date(
        selectedDay.getFullYear(),
        selectedDay.getMonth(),
        selectedDay.getDate(),
        timeArray[0],
        timeArray[1]
      )
    );
  }, [selectedDay, selectedTime]);

  function showTime() {
    const timeArray = !!selectedTime ? selectedTime.split(":") : [0, 0];

    return moment(
      new Date(
        selectedDay.getFullYear(),
        selectedDay.getMonth(),
        selectedDay.getDate(),
        timeArray[0],
        timeArray[1]
      )
    ).format("dddd, DD/MM/YYYY hh:mm A");
  }

  function disableCheck(item) {
    let result = false;

    if (
      !!minDate &&
      moment(item.date).format("YYYY-MM-DD") <
        moment(minDate).format("YYYY-MM-DD")
    ) {
      result = true;
    } else if (disableDays.includes(moment(item.date).format("YYYY-MM-DD"))) {
      result = true;
    }

    return result;
  }

  function checkActive(time, date) {
    return (
      time === selectedTime &&
      moment(selectedDay).format("YYYY-MM-DD") ===
        moment(date).format("YYYY-MM-DD")
    );
  }

  function checkDisabledDate(time, date) {
    return disabledTimes.includes(
      `${moment(date).format("YYYY-MM-DD")} ${time}`
    );
  }

  function onChangeHandler(data) {
    if (typeof onChange === "function") {
      onChange(data);
    }
  }

  if (!loading)
    return (
      <div className={`mainContainer`}>
        <div className={`header text-white flex items-center`}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignitems: "center",
            }}
          >
            {showTime()}
          </div>

          <div className={`buttonsContainer`}>
            <button
              className={`buttons btn`}
              onClick={() => {
                const newDays = daysToShow(disableDays, true);
                setCurrentDay(new Date(newDays[0].date));
                setDays(newDays);
              }}
            >
              Previous Week
            </button>

            <button
              className={`buttons btn`}
              onClick={() => {
                setCurrentDay(new Date(days[7].date));
                const newDays = daysToShow();
                setDays(newDays);
              }}
            >
              Next Week
            </button>
          </div>
        </div>

        <div className={`daysHeader`}>
          {days &&
            days.map((day, i) => {
              // console.log("logging day");
              // console.log(day);

              return (
                <div
                  key={i}
                  className={`${
                    disableCheck(day) ? `disabledDayColumnMain` : ""
                  } overflow-hidden
              `}
                >
                  <div className={`headings`}>{day.readableDate}</div>

                  <div
                    className={`timeSlotsContainer overscroll-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}
                  >
                    {timeOptions &&
                      timeOptions.map((time, i) => {
                        let hour = Number(time.value.substring(0, 2));
                        let dateWithHour = new Date(day.date).setHours(hour);
                        let beforeNow = dateWithHour < new Date();

                        return (
                          <div
                            key={i}
                            className={`${
                              checkDisabledDate(time.value, day.date)
                                ? `disabledTimeSlots`
                                : checkActive(time.value, day.date)
                                ? `activeTimeSlot`
                                : `timeSlots`
                            } 
                            ${beforeNow ? `disabledTimeSlots` : ""}
                            
                            my-2`}
                            onClick={() => {
                              setSelectedTime(time.value);
                              setSelectedDay(day.date);
                            }}
                          >
                            {time.value}
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
}
