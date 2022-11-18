$(function () {
    $('.site input').prop('checked', false);
    $("#launchButton").prop("disabled", true);
    let today = new Date();
    let month = today.getMonth() + 1;
    if (month < 10) month = "0" + month;
    let day = today.getDate();
    if (day < 10) day = "0" + day;

    $('#datepicker').datepicker('setDate', null);

    $("#selectedDate").text(`${today.getFullYear()}-${month}-${day}`);


    $("#datepicker").datepicker({
        dateFormat: 'yy-mm-dd',
        onSelect: function (selectedDate) {
            $("#selectedDate").css("background-color", "red").text(selectedDate);
            setTimeout(() => {
                $("#selectedDate").css('background-color', "white");
            }, 500);
        }
    });

    $('.site input').on('change', handleSite);
    $("#launchButton").on('click', launch);
    function handleSite() {
        $('.site label').css("background", "white")
        $(this).parent().css("background", "orange")
        $("#launchButton").prop("disabled", false);
    }
    function launch() {
        const startDate = $('#selectedDate').text().trim();
        const location = $('.site input:checked').parent().text().trim(); // .replace(/\//, '_'); // remove '/' in location text
        const locationId = $('.site input:checked').val();
// console.log({startDate, location, locationId})
        window.open(`/appts/${startDate}/${location}/${locationId}`, '_self');
    }
});