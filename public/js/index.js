$(function() {
	$(".site input").prop("checked", false);

	let today = new Date();
	let month = today.getMonth() + 1;
	if (month < 10) month = "0" + month;
	let day = today.getDate();
	if (day < 10) day = "0" + day;
	const button = $("button"); // submit button

	$("#datepicker").datepicker("setDate", null); // start with no date chosen

	// formatted yyyy-mm-dd date
	$("#selectedDate").text(`${today.getFullYear()}-${month}-${day}`);


	// future dates OK
	$("#datepicker").datepicker({
		dateFormat: "yy-mm-dd",
		onSelect: function(selectedDate) {
			$("#selectedDate").css("background-color", "red").text(selectedDate);
			setTimeout(() => {
				$("#selectedDate").css("background-color", "white");
			}, 500);
		}
	});

	$("li > input").on("change", handleSite); // enable submit button when date chosen
	// take click oin words same as radio button
	$("li > span").on("click", e => {
		$(e.target).parent().find("input").trigger("click");
	});
	button.on("click", launch); // open app when submit button pushed

	function handleSite() { // highlight and enable submit button
		$("ul li").css("background", "white");
		$(this).parent().css("background", "orange");
		button.prop("disabled", false);
	}
	function launch() {
		// gather parameters for URL
		const startDate = $("#selectedDate").text().trim();
		const location = $(".site input:checked").parent().text().trim();
		const locationId = $(".site input:checked").val();

		$("container").hide();
		const app = $("#app").text(); // grab 'allvac' or 'byvac' name
		$("loading").show(); // reveal loading text and spinner

		// open data app in this window
		window.open(
			`/appts/${startDate}/${encodeURI(location)}/${locationId}/${app}`,
			"_self"
		);
	}
});
