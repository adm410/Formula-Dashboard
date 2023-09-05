def trackData(track, name):
    laps = ""
    length = ""
    distance = ""

    if name == "Sakhir Grand Prix":
        laps = "87"
        length = "3.543"
        distance = "307.995"
    elif track == "Albert Park Grand Prix Circuit":
        laps = "58"
        length = "5.278"
        distance = "306.124"
    elif track == "Autodromo Internazionale del Mugello":
        laps = "59"
        length = "5.245"
        distance = "309.497"
    elif track == "Autódromo Internacional do Algarve":
        laps = "66"
        length = "4.653"
        distance = "306.826"
    elif track == "Autodromo Enzo e Dino Ferrari":
        laps = "63"
        length = "4.909"
        distance = "309.049"
    elif track == "Autódromo Hermanos Rodríguez":
        laps = "71"
        length = "4.304"
        distance = "305.354"
    elif track == "Autodromo Nazionale di Monza":
        laps = "53"
        length = "5.793"
        distance = "306.72"
    elif track == "Autódromo José Carlos Pace":
        laps = "71"
        length = "4.309"
        distance = "305.879"
    elif track == "Baku City Circuit":
        laps = "51"
        length = "6.003"
        distance = "306.049"
    elif track == "Bahrain International Circuit":
        laps = "57"
        length = "5.412"
        distance = "308.238"
    elif track == "Circuit de Barcelona-Catalunya":
        laps = "66"
        length = "4.675"
        distance = "308.424"
    elif track == "Circuit de Monaco":
        laps = "78"
        length = "3.337"
        distance = "260.286"
    elif track == "Circuit Gilles Villeneuve":
        laps = "70"
        length = "4.361"
        distance = "305.27"
    elif track == "Circuit of the Americas":
        laps = "56"
        length = "5.513"
        distance = "308.405"
    elif track == "Circuit Park Zandvoort":
        laps = "72"
        length = "4.259"
        distance = "306.587"
    elif track == "Circuit Paul Ricard":
        laps = "53"
        length = "5.842"
        distance = "309.69"
    elif track == "Hockenheimring":
        laps = "67"
        length = "4.574"
        distance = "306.458"
    elif track == "Hungaroring":
        laps = "70"
        length = "4.381"
        distance = "306.63"
    elif track == "Istanbul Park":
        laps = "58"
        length = "5.338"
        distance = "309.396"
    elif track == "Jeddah Corniche Circuit":
        laps = "50"
        length = "6.174"
        distance = "308.45"
    elif track == "Las Vegas Strip Street Circuit":
        laps = "50"
        length = "6.12"
        distance = "305.88"
    elif track == "Losail International Circuit":
        laps = "57"
        length = "5.38"
        distance = "306.66"
    elif track == "Marina Bay Street Circuit":
        laps = "61"
        length = "5.063"
        distance = "308.706"
    elif track == "Miami International Autodrome":
        laps = "57"
        length = "5.412"
        distance = "308.326"
    elif track == "Nürburgring":
        laps = "60"
        length = "5.148"
        distance = "308.617"
    elif track == "Red Bull Ring":
        laps = "71"
        length = "4.318"
        distance = "306.452"
    elif track == "Shanghai International Circuit":
        laps = "56"
        length = "5.451"
        distance = "305.066"
    elif track == "Silverstone Circuit":
        laps = "52"
        length = "5.891"
        distance = "306.198"
    elif track == "Sochi Autodrom":
        laps = "53"
        length = "5.848"
        distance = "309.745"
    elif track == "Circuit de Spa-Francorchamps":
        laps = "44"
        length = "7.004"
        distance = "308.052"
    elif track == "Suzuka Circuit":
        laps = "53"
        length = "5.807"
        distance = "307.471"
    elif track == "Yas Marina Circuit":
        laps = "58"
        length = "5.281"
        distance = "306.183"
    else:
        laps = "00"
        length = "0.000"
        distance = "000.000"

    return laps, length, distance
