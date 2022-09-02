import Calendar from './calendar';

const Sample = () => {
  return (
    <div>
      <Calendar
        disableDays={ [new Date(2022, 7, 18)] }
        interval={ 10 }
        disabledTimes={ ["2022-08-20 10:00", "2022-08-20 11:00", "2022-08-21 11:00"] }
        minDate={ new Date(2022, 7, 10) }
        onChange={ (value) => {
          console.log(value)
        } }
      />
    </div>
  )
}
