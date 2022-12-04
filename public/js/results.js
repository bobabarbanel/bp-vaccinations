$(function() {
	const locationId = $("locationId").text().trim();
	const startDate = $("startDate").text().trim();
	const location = $("location").text().trim();
	const timeLeft = $(".countdown_timer");
	const bar = $("bar");

	const REFRESH_MINUTES = 3; // data refresh time
	const REFRESH_TIME = REFRESH_MINUTES * 60 * 1000; // refresh time in seconds
	let interval = null;

	run_indicator();
	// bar that widens over refresh time cycle
	function run_indicator() {
		// This mif() would stop cycle when OPEN reservation == 0.
		// But new ones can get added IN clinic, so keep going!

		// if (+$("#OPEN_TOTAL").text().trim() === 0) {
		// 	if (interval) clearInterval(interval);
		// 	// if (indicator) clearInterval(indicator);
		// 	init_timer("Done");
		// 	bar.css("width", "80%").css("background-color", "green");
		// 	$("body").css("background-color", "lightgrey");
		// } else {
			draw(Date.now(), REFRESH_TIME);
		// }
	}

	function draw(start, end) {
		bar.css("width", 0.1 + "%");
		init_timer(`${REFRESH_MINUTES}:00`);

		interval = setInterval(() => {
			const nowMS = Date.now() - start;
			const now = nowMS / 1000 / 60;
			let min = Math.floor(REFRESH_MINUTES - now);
			let sec = Math.floor((REFRESH_MINUTES - now - min) * 60);
			sec = Math.round(sec / 5) * 5;
			if (sec < 10) sec = "0" + sec;
			if (min < 0) {
				min = REFRESH_MINUTES;
				sec = "00";
			}
			init_timer(`${min}:${sec}`);

			let percent = 80 - (REFRESH_MINUTES - now) * 80 / REFRESH_MINUTES;
			bar.css("width", percent + "%");
			if (nowMS >= 0.995 * end) {
				clearInterval(interval);
				interval = null;
				refreshValues().then(() => run_indicator()); // get and display latest data
			}
		}, 5000); // show every 5 seconds
	}

	async function refreshValues() {
		const url = `/refresh/${startDate}/${encodeURI(location)}/${locationId}`;
		let vs = await axios.get(url);
		vs = vs.data;

		for (let part of ["OPEN", "COMPLETED", "PENDING", "CANCELLED", "NO_SHOW"]) {
			for (let vac of ["P", "M", "J"]) {
				const id = `${part}_${vac}`; // html id
				$(`#${id}`).text(vs[part][vac]);
			}
		}
		for (let id of [
			"OPEN_TOTAL",
			"COMPLETED_TOTAL",
			"TOTAL_OC_P",
			"TOTAL_OC_M",
			"TOTAL_OC_J",
			"TOTAL_OC",
			"PENDING_TOTAL",
			"CANCELLED_TOTAL",
			"NO_SHOW_TOTAL",
			"timeStamp"
		]) {
			$(`#${id}`).text(vs[id]);
		}
	}

	function init_timer(text) {
		timeLeft.html(`<i class="fas fa-history"></i>&nbsp;${text}&nbsp;`);
	}
});
