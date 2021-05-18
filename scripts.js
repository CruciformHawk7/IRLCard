// Background max offset
const Deg = 15;
// Foreground max offset
const ForDeg = 10;

let mouseMoveHandler = (e, halfW, halfH, midToLeft, midToTop) => {
    let mousX = e.pageX;
    let mousY = e.pageY;

    // Background
    let xper = (mousX - midToLeft) / halfW;
    let yper = (mousY - midToTop) / halfH;

    $('.background-main').css('transform',
        `translate(-50%, -50%) rotateY(${xper * Deg}deg) rotateX(${yper * -Deg}deg)`);

    // Foreground
    $('.foreground').css('transform',
        `translate(-50%, -50%) rotateY(${xper * ForDeg}deg) rotateX(${yper * -ForDeg}deg)`);
};

let gyroHandler = () => {
    let gyro = new AbsoluteOrientationSensor({ frequency: 60 });
    gyro.onerror = (event) => {
        console.log("Orientation access denied.");
        $('.main-card').mousemove(container, (e) => {
            setTimeout(() => {
                mouseMoveHandler(e, halfW, halfH, midToLeft, midToTop);
            }, 0, [e, halfW, halfH, midToLeft, midToTop]);
        });
    };
    let initY = null,
        initX = null;

    gyro.addEventListener('reading', () => {

        if (initY == null) initY = gyro.quaternion[0];
        if (initX == null) initX = gyro.quaternion[1];

        let yper = (initY - gyro.quaternion[0]) * 5;
        let xper = (initX - gyro.quaternion[1]) * 5;

        xper %= 5;
        yper %= 5;

        $('.background-main').css('transform',
            `translate(-50%, -50%) rotateY(${xper * Deg}deg) rotateX(${yper * -Deg}deg)`);

        $('.foreground').css('transform',
            `translate(-50%, -50%) rotateY(${xper * ForDeg}deg) rotateX(${yper * -ForDeg}deg)`);
    });
    gyro.start();
};

$(() => {
    const container = $('.main-card');
    const halfW = container.width() / 2;
    const halfH = container.height() / 2;
    const midToLeft = container.offset().left + halfW;
    const midToTop = container.offset().top + halfH;

    if ('AbsoluteOrientationSensor' in window) {
        setTimeout(() => gyroHandler(), 0);
    } else {
        $('.main-card').mousemove(container, (e) => {
            setTimeout(() => {
                mouseMoveHandler(e, halfW, halfH, midToLeft, midToTop);
            }, 0, [e, halfW, halfH, midToLeft, midToTop]);
        });
    }
});