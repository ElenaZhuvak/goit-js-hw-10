
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const inputEl = document.querySelector('#datetime-picker');
const buttonEl = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate;
let countdownInterval;

flatpickr('#datetime-picker', {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      if (selectedDates[0] <= new Date()) {
        iziToast.error({
            title: 'Error',
            message: 'Please choose a date in the future',
            position: 'topRight'
        });
        buttonEl.disabled = true;
      } else {
        userSelectedDate = selectedDates[0];
        buttonEl.disabled = false;
      }
    }
});

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
  
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  
    return { days, hours, minutes, seconds };
  }

function addLeadingZero (value) {
    return value.toString().padStart(2, '0');
}

function updateTimer (endTime) {
    const currentTime = new Date().getTime();
    const timeLeft = endTime - currentTime;

    if(timeLeft === 0) {
        clearInterval(countdownInterval);
        clockFace({days: 0, hours: 0, minutes: 0, seconds: 0});
        buttonEl.disabled = false;
        inputEl.disabled = false;
        iziToast.success({
            title: 'Countdown finished',
            message: 'The timer has reached zero!',
            position: 'topRight' 
        });
        return;
    }

        const time = convertMs(timeLeft);
        clockFace(time);
}

function clockFace (time) {
    daysEl.textContent = addLeadingZero(time.days);
    hoursEl.textContent = addLeadingZero(time.hours);
    minutesEl.textContent = addLeadingZero(time.minutes);
    secondsEl.textContent = addLeadingZero(time.seconds);
}


buttonEl.addEventListener('click', onClickStart);
function onClickStart () {
    if (userSelectedDate) {
        buttonEl.disabled = true;
        inputEl.disabled = true;
        const endTime = userSelectedDate.getTime();
        updateTimer(endTime);
        countdownInterval = setInterval(() => updateTimer(endTime), 1000);
    }
}




