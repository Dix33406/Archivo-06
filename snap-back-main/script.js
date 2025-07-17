function countdown() {
    const goalDate = new Date("2025-12-31T23:59:59").getTime();
    const now = new Date().getTime();
    const distance = goalDate - now;

    if (distance < 0) {
        document.getElementById("countdown").innerHTML = "¡Llegó el día!";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML =
        days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
}
setInterval(countdown, 1000);