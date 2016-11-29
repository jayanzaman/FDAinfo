$(document).ready(function() {
    console.log('script loaded.')


    // var $searchInput = $('#search').value()
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
    };
    addEvent();


    var parseData = function(data) {

        // var manufacturerName = data.results[0].openfda.manufacturer_name;
        // var stringData = JSON.stringify(data.results[0]);
        // console.log(data)
        // console.log("Drug Info: " + stringData)
        // console.log("Manufaturer: " + manufacturerName)

        var dosage_and_administration = data.results[0].dosage_and_administration[0];
        $('.dosage').text(dosage_and_administration)
        var indications_and_usage = data.results[0].indications_and_usage;
        $('.indications').text(indications_and_usage);
        var contraindications = data.results[0].contraindications;
        $('.contraindications').text(contraindications);
        var warnings_and_cautions = data.results[0].warnings_and_cautions;
        var warnings = data.results[0].warnings;
        if (warnings_and_cautions != null) {
            $('.warnings_and_cautions').text(warnings_and_cautions);
        } else if (warnings != null) {
            $('.warnings_and_cautions').text(warnings)
        }
        // var generic_name = data.results[0].openfda.generic_name[0];
        if (data.results[0].openfda.generic_name[0] === "undefined") {
            $('.generic').text("Generic name couldn't be found")
        } else {
            var generic_name = data.results[0].openfda.generic_name[0];
            $('.generic').text(generic_name)
        }



    };
    var adverseData = function(adverse_events) {
        var adverseEvents = adverse_events.results;
        adverseEvents.forEach(function(event) {
            // console.log(event.term);
            // console.log(event.count);
        })

    }

    var professionalsData = function(data) {

        $('ul.collapsible').remove();

        var $expandable = $('<ul class="collapsible" data-collapsible="expandable"></ul>')

        $('div.professionals').append($expandable);
        for (var key in data.results[0]) {
            if (key != "Openfda") {
                console.log(key);
                console.log(data.results[0][key])

                var value = data.results[0][key]

                var keyArr = key.split('_');
                var tempKey = [];
                for (var i = 0; i < keyArr.length; i++) {
                    var firstLetter = keyArr[i].charAt(0).toUpperCase();
                    var word = keyArr[i].split('')
                    word.shift();
                    word.unshift(firstLetter);
                    tempKey.push(word.join(''));
                }
                var newKey = tempKey.join(' ');

                var $item = $('<li><div class="collapsible-header">' + newKey + '</div><div class="collapsible-body">' + value + '</div></li>')
                $expandable.append($item);
            } else {
                console.log("openfda")
            }

        }
        $('.collapsible').collapsible();
    }

    $('#autocomplete-input').on('keydown', function(e) {
        if (e.which == 13) {
            $('#searchbtn').trigger('click')
        }
    })



    var drugs = {
        "Abilify": null,
        "Aciphex": null,
        "Actonel": null,
        "Actos": null,
        "Adderall": null,
        "Adipex": null,
        "Advil": null,
        "Aldactone": null,
        "Aleve": null,
        "Allegra": null,
        "Altace": null,
        "Ambien": null,
        "Amoxil": null,
        "AndroGel": null,
        "Apresoline": null,
        "Armour": null,
        "Ativan": null,
        "Avapro": null,
        "Avelox": null,
        "Avodart": null,
        "Bactroban": null,
        "Benicar": null,
        "Bentyl": null,
        "Biaxin": null,
        "Brilinta": null,
        "Buspar": null,
        "Bystolic": null,
        "Caltrate": null,
        "Cardizem": null,
        "Cardura": null,
        "Catapres": null,
        "Ceftin": null,
        "Celebrex": null,
        "Celexa": null,
        "Chantix": null,
        "Cialis": null,
        "Cipro": null,
        "Cleocin": null,
        "Clovate": null,
        "Cogentin": null,
        "Colcrys": null,
        "Concerta": null,
        "Coreg": null,
        "Coumadin": null,
        "Cozaar": null,
        "Crestor": null,
        "Cymbalta": null,
        "Daliresp": null,
        "Deltasone": null,
        "Depakote": null,
        "Desyrel": null,
        "Detrol": null,
        "Dexilant": null,
        "Diabeta": null,
        "Diflucan": null,
        "Dilantin": null,
        "Diovan": null,
        "Ditropan": null,
        "Dolophine": null,
        "Dramamine": null,
        "Duragesic": null,
        "Dyazide": null,
        "Effexor": null,
        "Elavil": null,
        "Enbrel": null,
        "Evista": null,
        "Exelon": null,
        "Flagyl": null,
        "Flexeril": null,
        "Flomax": null,
        "Flonase": null,
        "Focalin": null,
        "Folvite": null,
        "Fosamax": null,
        "Gablofen": null,
        "Glucophage": null,
        "Glucotrol": null,
        "HCTZ": null,
        "Humalog": null,
        "Humira": null,
        "Hytrin": null,
        "Imitrex": null,
        "Inderal": null,
        "Januvia": null,
        "Juxtapid": null,
        "Keflex": null,
        "Kenalog": null,
        "Klonopin": null,
        "K-Tab": null,
        "Lamictal": null,
        "Lanoxin": null,
        "Lantus": null,
        "Lasix": null,
        "Latuda": null,
        "Levaquin": null,
        "Levemir": null,
        "Levitra": null,
        "Lexapro": null,
        "Lipitor": null,
        "Lopid": null,
        "Lopressor": null,
        "Lotensin": null,
        "Lotrimin": null,
        "Lovenox": null,
        "Lunesta": null,
        "Lyrica": null,
        "Macrobid": null,
        "Medrol": null,
        "Mevacor": null,
        "Minocin": null,
        "Mirapex": null,
        "Mobic": null,
        "Namenda": null,
        "Nasonex": null,
        "Neurontin": null,
        "Nexium": null,
        "Niaspan": null,
        "NitroStat": null,
        "Nizoral": null,
        "Norvasc": null,
        "Novolog": null,
        "Omnicef": null,
        "Onglyza": null,
        "OxyContin": null,
        "Pamelor": null,
        "Patanol": null,
        "Paxil": null,
        "Pen": null,
        "Pepcid": null,
        "Percocet": null,
        "Phenergan": null,
        "Plavix": null,
        "Pradaxa": null,
        "Pravachol": null,
        "Premarin": null,
        "Prevacid": null,
        "Prilosec": null,
        "Prinivil": null,
        "Pristiq": null,
        "ProAir": null,
        "Procardia": null,
        "Proscar": null,
        "Protonix": null,
        "Prozac": null,
        "Pyridium": null,
        "Reglan": null,
        "Relafen": null,
        "Remeron": null,
        "Requip": null,
        "Restoril": null,
        "Rheumatrex": null,
        "Risperdal": null,
        "Robaxin": null,
        "Robitussin": null,
        "Seroquel": null,
        "Singulair": null,
        "Soma": null,
        "Spiriva": null,
        "Strattera": null,
        "Suboxone": null,
        "Synthroid": null,
        "Tamiflu": null,
        "Tenormin": null,
        "Tessalon": null,
        "Topamax": null,
        "Travatan": null,
        "Tylenol": null,
        "Uceris": null,
        "Uloric": null,
        "Ultram": null,
        "Valium": null,
        "Valtrex": null,
        "Vasotec": null,
        "Verelan": null,
        "VESIcare": null,
        "Viagra": null,
        "Vibramycin": null,
        "Vicodin": null,
        "Victoza": null,
        "Voltaren": null,
        "Vytorin": null,
        "Vyvanse": null,
        "Wellbutrin": null,
        "Xalatan": null,
        "Xanax": null,
        "Xarelto": null,
        "Zanaflex": null,
        "Zantac": null,
        "Zebeta": null,
        "Zetia": null,
        "Zithromax": null,
        "Zocor": null,
        "Zofran": null,
        "Zoloft": null,
        "Zostavax": null,
        "Zovirax": null,
        "Zyloprim": null,
        "Zyprexa": null,
        "Zyrtec": null
    }


    $('input.autocomplete').autocomplete({
        data: drugs
    });
    // $('.collapsible').collapsible();






})
