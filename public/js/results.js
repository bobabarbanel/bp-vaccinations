$(function () {
    const locationId = $('locationId').text().trim();
    const startDate = $('startDate').text().trim();
    const timeLeft = $('.countdown_timer');
    const timeStamp = $("#time");
    const MINUTES = 3;

    timeStamp.text("As of " + new Date())
    const REFRESH_TIME = MINUTES * 60 * 1000; // 3 minutes

    const TRANSITION_COLOR = '#AED6F1';
    const AFTER_TRANSITION_COLORS = {
        "PENDING": "wheat",
        "CANCELLED": "wheat",
        "COMPLETED": "white",
        "TOTAL": "white",
        "OPEN": "pink",
        "time": "white"
    };

    $("#bar").css("width", 0.1 + "%");
    init_timer();
    draw(Date.now(), REFRESH_TIME)
    const interval = setInterval(function () {
        refreshValues();
    }, REFRESH_TIME);

    async function draw(start, end) {
        const indicator = setInterval(() => {
            const nowMS = Date.now() - start;
            const now = nowMS / 1000 / 60;
            let min = Math.floor(MINUTES - now);
            let sec = Math.floor(((MINUTES - now) - min) * 60);
            sec = Math.round(sec / 5) * 5;
            if (sec < 10) sec = '0' + sec;
            if (min < 0) {
                min = MINUTES;
                sec = '00';
            }
            timeLeft.html(`<i class="fas fa-history"></i>&nbsp;${min}:${sec}&nbsp;`);

            $("#bar").css("width", 615 * nowMS / end + "px")

            if (nowMS >= (.995) * end) {
                clearInterval(indicator);
                $("#bar").css("width", 0.1 + "%"); // reset
            }
        }, 5000)
    }
    // function rand() { return  Math.floor(Math.random()*20); }
    async function refreshValues() {

        let url = `/refresh/${startDate.trim()}/${locationId.trim()}`;
        const data = (await axios.get(url)).data;
        for (let tag in data) {
            const target = $('#' + tag);

            target.css("background", TRANSITION_COLOR).text(data[tag]);

            setTimeout(() => {
                target.css('background', AFTER_TRANSITION_COLORS[tag]);
            }, 500);
            if (data[OPEN] == 0) {
                clearInterval(interval);
            }
        }
        init_timer();
        draw(Date.now(), REFRESH_TIME * .95).then(() => init_timer());

        timeStamp.css('background', TRANSITION_COLOR).text("As of " + new Date());
        setTimeout(() => {
            timeStamp.css('background', AFTER_TRANSITION_COLORS["time"]);
        }, 500)
    }

    function init_timer() {
        timeLeft.html('<i class="fas fa-history"></i>&nbsp;3:00');
    }
});
