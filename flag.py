def flagData(country, nationality):

  flag = ""

  if nationality == "Austrian" or country == "Austria":
    flag = "🇦🇹"
  elif nationality == "Australian" or country == "Australia":
    flag = "🇦🇺"
  elif nationality == "Azerbaijani" or country == "Azerbaijan":
    flag = "🇦🇿"
  elif nationality == "Bahraini" or country == "Bahrain":
    flag = "🇧🇭"
  elif nationality == "Belgian" or country == "Belgium":
    flag = "🇧🇪"
  elif nationality == "Brazilian" or country == "Brazil":
    flag = "🇧🇷"
  elif nationality == "Canadian" or country == "Canada":
    flag = "🇨🇦"
  elif nationality == "Chinese" or country == "China":
    flag = "🇨🇳"
  elif nationality == "Danish" or country == "Denmark":
    flag = "🇩🇰"
  elif nationality == "Finnish" or country == "Finland":
    flag = "🇫🇮"
  elif nationality == "French" or country == "France":
    flag = "🇫🇷"
  elif nationality == "German" or country == "Germany":
    flag = "🇩🇪"
  elif nationality == "Hungarian" or country == "Hungary":
    flag = "🇭🇺"
  elif nationality == "Italian" or country == "Italy":
    flag = "🇮🇹"
  elif nationality == "Israeli" or country == "Israel":
    flag = "🇮🇱"
  elif nationality == "Japanese" or country == "Japan":
    flag = "🇯🇵"
  elif nationality == "Mexican" or country == "Mexico":
    flag = "🇲🇽"
  elif nationality == "Monegasque" or country == "Monaco":
    flag = "🇲🇨"
  elif nationality == "New Zealander" or country == "New Zealand":
    flag = "🇳🇿"
  elif nationality == "Dutch" or country == "Netherlands":
    flag = "🇳🇱"
  elif nationality == "Portuguese" or country == "Portugal":
    flag = "🇵🇹"
  elif nationality == "Qatari" or country == "Qatar":
    flag = "🇶🇦"
  elif nationality == "Russian" or country == "Russia":
    flag = "🇷🇺"
  elif nationality == "Singaporean" or country == "Singapore":
    flag = "🇸🇬"
  elif nationality == "Spanish" or country == "Spain":
    flag = "🇪🇸"
  elif nationality == "Saudi" or country == "Saudi Arabia":
    flag = "🇸🇦"
  elif nationality == "Thai" or country == "Thailand":
    flag = "🇹🇭"
  elif nationality == "Turkish" or country == "Turkey":
    flag = "🇹🇷"
  elif nationality == "Emirati" or country == "UAE":
    flag = "🇦🇪"
  elif nationality == "American" or country == "United States" or country == "USA":
    flag = "🇺🇸"
  elif nationality == "British" or country == "UK":
    flag = "🇬🇧"
  else:
    flag = ""

  return flag