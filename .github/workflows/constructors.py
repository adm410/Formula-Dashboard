import requests
import json

uri = 'http://ergast.com/api/f1/current/constructorStandings.json'

response = requests.get(uri).content
response = json.loads(response)
# print(response)
season = (response['MRData']['StandingsTable']['season'])

p1team = (response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][0]['position'] + " " + response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][0]['Constructor']['name'] + " " +  response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][0]['points'])
p2team = (response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][1]['position'] + " " + response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][1]['Constructor']['name'] + " " +  response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][1]['points'])
p3team = (response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][2]['position'] + " " + response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][2]['Constructor']['name'] + " " +  response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][2]['points'])
p4team = (response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][3]['position'] + " " + response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][3]['Constructor']['name'] + " " +  response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][3]['points'])
p5team = (response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][4]['position'] + " " + response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][4]['Constructor']['name'] + " " +  response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][4]['points'])
p6team = (response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][5]['position'] + " " + response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][5]['Constructor']['name'] + " " +  response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][5]['points'])
p7team = (response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][6]['position'] + " " + response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][6]['Constructor']['name'] + " " +  response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][6]['points'])
p8team = (response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][7]['position'] + " " + response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][7]['Constructor']['name'] + " " +  response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][7]['points'])
p9team = (response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][8]['position'] + " " + response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][8]['Constructor']['name'] + " " +  response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][8]['points'])
p10team = (response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][9]['position'] + " " + response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][9]['Constructor']['name'] + " " +  response['MRData']['StandingsTable']['StandingsLists'][0]['ConstructorStandings'][9]['points'])


print(f'F1 {season} Constructor Standings')
print(p1team)
print(p2team)
print(p3team)
print(p4team)
print(p5team)
print(p6team)
print(p7team)
print(p8team)
print(p9team)
print(p10team)