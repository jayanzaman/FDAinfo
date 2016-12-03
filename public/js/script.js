$(document).ready(function() {
    console.log('script loaded.')

    var callFDA = function() {
        var drugName = $('.autocomplete').val();
        $.ajax({
            url: 'https://api.fda.gov/drug/label.json?search=openfda.brand_name.%22' + drugName + '%22',
            dataType: 'json',
            success: function(data) {
                parseData(data);
                professionalsData(data);
            }
        })
        $.ajax({
            url: 'https://api.fda.gov/drug/event.json?search=patient.drug.openfda.brand_name:%22' + drugName + '%22&count=patient.reaction.reactionmeddrapt.exact',
            dataType: 'json',
            success: function(adverse_events) {
                adverseData(adverse_events);

            }
        })
    }

    var addEvent = function() {
        $('#searchbtn').on('click', function() {
            callFDA();
        })
        $('.detailsButton').on('click', function() {
            callFDA();
        })

    };
    addEvent();

    var collapsibleListAcc = function(header, body) {

        var $item = $('<li><div class="collapsible-header">' + header + '</div><div class="collapsible-body">' + body + '</div></li>')
        $('#popcollapsible').append($item);
        $('.collapsible').collapsible();
    }

    var parseData = function(data) {

        var $popout = $('#popout');
        $('#popcollapsible').remove();
        var $accordion = $('<ul id="popcollapsible" class="collapsible popout collapsible-accordion" data-collapsible="accordion">')
        $popout.append($accordion)

        var indications_and_usage = data.results[0].indications_and_usage;
        $('.collapsible').collapsible();
        collapsibleListAcc("Indications and Usage", indications_and_usage)
        var contraindications = data.results[0].contraindications;
        collapsibleListAcc("Contraindications", contraindications)
        var warnings_and_cautions = data.results[0].warnings_and_cautions;
        collapsibleListAcc("Warnings and Cautions", warnings_and_cautions)
        var warnings = data.results[0].warnings;

        if (!data.results[0].openfda || !data.results[0].openfda.generic_name || !data.results[0].openfda.generic_name.length) {
            $('.generic').text("Generic name couldn't be found")
        } else {
            var generic_name = data.results[0].openfda.generic_name[0];
            $('.generic').text(generic_name)
        }
    };

    var capitalizeWords = function(word) {

        var keyArr = word.split('_');
        var tempKey = [];
        for (var i = 0; i < keyArr.length; i++) {
            var firstLetter = keyArr[i].charAt(0).toUpperCase();
            var word = keyArr[i].split('')
            word.shift();
            word.unshift(firstLetter);
            tempKey.push(word.join(''));
        }
        var newKey = tempKey.join(' ');

        return newKey;
    };

    var collapsibleListExp = function(header, body) {
        $('#profExp').remove();
        var $expandable = $('<ul class="collapsible" data-collapsible="expandable"></ul>')
        var $item = $('<li><div class="collapsible-header">' + header + '</div><div class="collapsible-body">' + body + '</div></li>')
        $expandable.append($item);

        $('.collapsible').collapsible();
    }

    var professionalsData = function(data) {

        $('#profExp').remove();

        var $expandable = $('<ul id="profExp" class="collapsible" data-collapsible="expandable"></ul>')

        $('div.professionals').append($expandable);
        for (var key in data.results[0]) {
            var value = data.results[0][key]

            var newKey = capitalizeWords(key);
            var $item = $('<li><div class="collapsible-header">' + newKey + '</div><div class="collapsible-body">' + value + '</div></li>')
            $expandable.append($item);

            $('.collapsible').collapsible();
        }

        $('#autocomplete-input').on('keydown', function(e) {
            if (e.which == 13) {
                $('#searchbtn').trigger('click')
            }
        })
    };

    var adverseData = function(adverse_events) {
        $('.card-panel').remove()

        var adverseEvents = adverse_events.results;
        var eventObj = {};
        var highestCount = 1;
        var $searchItem = $('input.visualSearch')
        var $drugname = $searchItem.val()
        console.log($drugname)

        adverseEvents.forEach(function(event) {
            var term = event.term;
            eventObj[term] = event.count;
            if (event.count > highestCount) {
                highestCount = event.count;
            }

        })

        var $visuals = $('div.visuals');
        var $chartContainer = $('<div class="card-panel"></div>')
        $visuals.append($chartContainer);
        var $adverseEventsTitle = $('<h4 class="adverseEventsTitle center-align">Patient Reports on ' + $drugname + '</h4>')
        $chartContainer.append($adverseEventsTitle);
        var $badEventContainer = $('<div class="badEventContainer"></div>')


        for (var key in eventObj) {
            var count = eventObj[key]
            var percentage = Math.ceil((count / highestCount) * 100);
            console.log(percentage)
            var $badEventContainer = $('<div class="badEventContainer"></div>')
            $badEventContainer.append('<div class="term">' + key + ' (' + count + ')</div>')

            $badEventContainer.append('<div class="progress"><div class="determinate" style="width: ' + percentage + '%"></div></div>')
            $chartContainer.append($badEventContainer);
        }


    };

    var drugs = {
        "Abilify": null,
        "Actonel": null,
        "Actos": null,
        "Adipex": null,
        "Advil": null,
        "Amoxil": null,
        "AndroGel": null,
        "Armour": null,
        "Benicar": null,
        "Buspar": null,
        "Cymbalta": null,
        "Daliresp": null,
        "Deltasone": null,
        "Evista": null,
        "Lantus": null,
        "Levaquin": null,
        "Levemir": null,
        "Lyrica": null,
        "Medrol": null,
        "Norvasc": null,
        "Novolog": null,
        "Onglyza": null,
        "OxyContin": null,
        "Percocet": null,
        "Phenergan": null,
        "Pradaxa": null,
        "Pristiq": null,
        "Remeron": null,
        "Rheumatrex": null,
        "Risperdal": null,
        "Robitussin": null,
        "Strattera": null,
        "Tessalon": null,
        "Tylenol": null,
        "Uceris": null,
        "Uloric": null,
        "Vicodin": null,
        "Xalatan": null,
        "Zebeta": null,
        "Zetia": null,
        "Zyrtec": null
    }


    var pairs = {}
    var pairArr = []
    var i = 1

    function doTimeout(brand) {
        setTimeout(function ajaxCall() {

            console.log(brand);
            $.ajax({
                url: 'https://api.fda.gov/drug/label.json?search=openfda.brand_name.%22' + brand + '%22',
                dataType: 'json',
                // success: function(data) {
                // }
            }).done(function(data) {
                if (!data.results[0].openfda || !data.results[0].openfda.generic_name[0]) {
                    pairs[brand] = "No match"
                    pairArr.push(pairs)
                } else {
                    var gnName = data.results[0].openfda.generic_name[0];
                    pairs[brand] = gnName;
                    pairArr.push(pairs)
                }
            })
            i++
        }, i + 0000)
    }

    var matchDrugs = function() {


        for (var key in drugs) {
            doTimeout(key)
        }

        console.log(pairArr)
    }


    // matchDrugs();
    //I've used this function to compare my list of drugs to the API to see which ones were working and which ones weren't


    $('input.autocomplete').autocomplete({
        data: drugs
    });
    // $('.collapsible').collapsible();

    //datepicker
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });




})
