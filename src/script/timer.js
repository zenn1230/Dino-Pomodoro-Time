/**
 * Time berisi informasi waktu yaitu : detik dan menit
 * time.seconds -> detik
 * time.minutes -> menit
 * @typedef {Object} time
 * @property {Number} seconds
 * @property {Number} minutes
 */

class Time{
    constructor(seconds, minutes){
        this.seconds = seconds;
        this.minutes = minutes;
    }
}



/**
 * Element tombol yang mengatur timer apakah jalan / berhenti
 * @type {Element}
 */
const buttonControl = document.querySelector("button");

/**
 * Element text yang menampilkan waktu timer
 * @type {Element}
 */
const textTimer = document.querySelector("#text-timer");

/**
 * Status dari timer : 
 * 2, 4 -> Short break, 
 * 1, 3 -> Focus, 
 * 5 -> Long break, 
 * 6 -> End
 * @type {Number}
 */
let statusTimer = 1;

const durationTimer = {
    focus:new Time(0, 25),
    shortBreak:new Time(0, 5),
    longBreak:new Time(0, 10)
}

/**
 * Waktu timer sekarang
 * @type {time}
 */
let timeInTimer = durationTimer.focus;

/**
 * Berbagai class dari icon yang ada di button
 * @type {{rotateArrow:String, play:String}}
 */
 const icon = {
    rotateArrow:"fa-rotate-right",
    play:"fa-play"
};

/**
 * Berisi interval dari timer
 * @type {Number}
 */
let intervalOfTimer;


const makeNumberTo2Digits = val => (val > 9)? val : "0"+val;

/**
 * Function agar membuat timer di halaman web dikurang 1 detik
 * Lalu kembalikan true jika time-nya habis
 * @param {time} time 
 * @returns {time | boolean} Hasil dari waktu dikurang 1 detik | boolean
 */

function decrementTime(time){
    /**
     * Variable yang menyimpan nilai seconds
     * @type {number}
     */
    let seconds = time.seconds;

    /**
     * Variable yang menyimpan nilai minutes
     * @type {number}
     */
    let minutes = time.minutes;

    if(seconds < 1 && minutes === 0) return true; //Mengembalikan nilai true jika time-nya habis

    /* Mengurangi waktu */
    if(seconds < 1 && minutes > 0){
        seconds = 59;
        minutes -= 1;
        return new Time(seconds, minutes);
    }
    
    seconds -= 1;
    return new Time(seconds, minutes);
}


/**
 * Mengreset timer
 * @return {VoidFunction}
 */
function resetTimer(iconElement, textTimer){
    //Ubah icon button menjadi rotate arrow
    iconElement.classList.replace(icon.rotateArrow, icon.play);
    
    //Mengreset waktu timer & status timer-nya
    timeInTimer = durationTimer.focus;
    statusTimer = 1;

    //Membesihkan interval timer-nya
    clearInterval(intervalOfTimer);

    //Tampilkan timer
    showTime(textTimer, timeInTimer)
}

/**
 * Function untuk menampilkan waktu
 * @param {Element} textTimer 
 * @param {time} time
 * @return {VoidFunction}
 */
const showTime = (textTimer, time) => textTimer.innerHTML = `${makeNumberTo2Digits(time.minutes)}:${makeNumberTo2Digits(time.seconds)}`;


buttonControl.addEventListener("click", ()=> {
    /**
     * Icon button
     * @type {Element}
     */
    const iconElement = buttonControl.querySelector("i");

    if(iconElement.classList.contains(icon.play)){
        //Proses untuk menjalankan timer

        //Tukar icon button
        iconElement.classList.replace(icon.play, icon.rotateArrow);

        //Buat interval dari timer
        intervalOfTimer = setInterval(()=>{

            //Kurangkan waktu lalu tampilkan
            timeInTimer = decrementTime(timeInTimer);
            showTime(textTimer, timeInTimer);

            //Lakukan sesuatu jika waktu di timer habis
            if(timeInTimer !== true) return true;
            statusTimer += 1; //Perbarui status

            //Ganti waktu di timer
            switch(statusTimer % 2){
                case 1:
                    //Ketika status-nya focus
                    timeInTimer = durationTimer.focus;
                    document.body.style.backgroundColor = "red";
                    break;
                case 0:
                    //Ketika status-nya short break
                    timeInTimer = durationTimer.shortBreak;
                    document.body.style.backgroundColor = "blue";
                    break;
            }

            if(statusTimer === 8){
                //Ketika status-nya long break
                timeInTimer = durationTimer.longBreak;
            }else if(statusTimer === 9){
                //Lakukan reset ketika waktunya habis
                resetTimer(iconElement, timeInTimer)
            };
            //Tampilkan waktu
            showTime(textTimer, timeInTimer);
        }, 1000);
    }else{
        if(!confirm("Apakah kamu ingin mengreset?")){
            return true;
        }
        //Proses untuk mengreset timer
        resetTimer(iconElement, textTimer)
    };
});