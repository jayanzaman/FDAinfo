$(document).ready(function() {
    console.log('script loaded.')

    var drugName = "Abilify";
    var callFDA = function() {
        $.ajax({
            url: 'https://api.fda.gov/drug/label.json?search=openfda.brand_name.%22' + drugName + '%22',
            dataType: 'json',
            success: function(data) {
                parseData(data);
            }
        })
        $.ajax({
            url: 'https://api.fda.gov/drug/event.json?search=patient.drug.openfda.brand_name:%22' + drugName + '%22&count=patient.reaction.reactionmeddrapt.exact',
            dataType: 'json',
            success: function(data) {

            }
        })
    }
    callFDA();

    var parseData = function(data) {

        var manufacturerName = data.results[0].openfda.manufacturer_name[0];
        var stringData = JSON.stringify(data.results[0]);
        console.log(data)
            // console.log("Drug Info: " + stringData)
            // console.log("Manufaturer" + manufacturerName)







        // console.log(data.results[0].dosage_and_administration[0])
        var dosageTable = data.results[0].dosage_and_administration_table[0];
        var $dosageTable = $('.dosageTable');
        $dosageTable.append(dosageTable);
        $('table').addClass('bordered highlight');
        var dosageTable2 = data.results[0].dosage_and_administration_table[1];
        var $dosageTable2 = $('.dosageTable');
        $dosageTable2.append(dosageTable2);
        $('table').addClass('bordered highlight');
    };


})
