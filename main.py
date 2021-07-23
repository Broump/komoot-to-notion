import requests
import json
import math
import time

#Your Komoot Data
password = 'YOUR_PASSWORD' #enter your password
email = 'YOUR_EMAIL' #enter your email
client_id = YOUR_CLIENT_ID #enter your clientID (komoot.com/user/{number})

tour_url = f'https://www.komoot.de/api/v007/users/{client_id}/tours/' #URL to get tourdata from the komoot API
login_url = "https://account.komoot.com/v1/signin" #URL to sign into your komoot account

token = "YOUR_API_TOKEN" #enter your integration token from the Notion API (don't forget to share your database to the integration)
 
databaseID = "YOUR_DATABASE_ID" #enter your databseID (notion.so/{number}?v=05ec34ed86cf48909d9e38f2e75af478)
 
#creating a session to login into your kommot account
s = requests.Session()
res = requests.get(login_url)
cookies = res.cookies.get_dict()


payload = json.dumps({
	"email": email,
	"password": password,
	"reason": "null"
})

#headers for s.post
headers = {"Content-Type": "application/json"}

s.post(login_url, headers=headers,
	   data=payload, cookies=cookies)

url = "https://account.komoot.com/actions/transfer?type=signin"
s.get(url)

#getting the tour data
#headers for s.get
headers = {"onlyprops": "true"}

response = s.get(tour_url, headers=headers)
data = response.json()

#shortening the tour dictionary
alltours = data["_embedded"]["tours"]
#remove all planned tours to only have the recorded tours
recordedtours = [x for x in alltours if not ('tour_planned' == x.get('type'))]

# 0 = the newest tour, 1 = the second newest tour ... , if you remove [0] you get every tour
tourconfigurator = recordedtours[0]

#formatting data into variables
Name = f'https://www.komoot.de/tour/{tourconfigurator["id"]}'
Distance = tourconfigurator["distance"]
Sportmode = tourconfigurator["sport"]
Date = tourconfigurator["date"]
Duration = tourconfigurator["duration"]

#formart JSON data

#function to round_up the distance
def round_up(n, decimals=0):
    multiplier = 10 ** decimals
    return math.ceil(n * multiplier) / multiplier

Distance = round_up(Distance/1000 , 1)
Duration = Duration/60

#headers for notion API
headers = {
  "Authorization": "Bearer " + token,
  "Content-Type": "application/json",
  "Notion-Version": "2021-05-13"
};

#creating the notion page
def createPage(databaseID, headers):
  createUrl = 'https://api.notion.com/v1/pages'
  
  parent = '{ "parent": { "database_id": "' + databaseID + '" },'
  NameofEntry = '"properties": { "title": { "title": [ { "text": { "content": "'+ Name +'" } } ] },'
  Sports = '"sportart": { "select": { "name": "'+ Sportmode +'" } }, '
  Dates = '"date": { "date": { "start": "'+ Date +'" } },'
  Distances = '"distance": { "type": "number", "number": %s }' %Distance
  End = '} }'

  result = parent + NameofEntry + Sports + Dates + Distances + End
 
 
  
  res = requests.request("POST", createUrl, headers=headers, data=result)
  print(res.status_code)
  print(res.text)
 
 
createPage(databaseID,headers)


