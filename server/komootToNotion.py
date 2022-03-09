import requests
import json
import math
import time


class KomootToNotion:

    def __init__(self, komoot_id, komoot_email, komoot_password, notion_api_token, notion_database_id):
        self.komoot_id = komoot_id
        self.komoot_email = komoot_email
        self.komoot_password = komoot_password
        self.notion_api_token = notion_api_token
        self.notion_database_id = notion_database_id

    def getTourDataANDsendToNotion(self, queryTourID, addAll):

        if (addAll == False):
            # try is used for the KeyError when to many requests are made
            try:
                # define the Komoot API URL's for login into the Komoot Session and getting the TourData
                tour_url = f'https://www.komoot.de/api/v007/users/{self.komoot_id}/tours/'
                login_url = "https://account.komoot.com/v1/signin"
                signin_url = "https://account.komoot.com/actions/transfer?type=signin"

                # creating a session to login into your kommot account
                s = requests.Session()
                res = requests.get(login_url)
                cookies = res.cookies.get_dict()

                # Payload for HTTP request
                payload = json.dumps({
                    "email": self.komoot_email,
                    "password": self.komoot_password,
                    "reason": "null"
                })

                # headers for s.post
                headers = {"Content-Type": "application/json"}

                # make login request
                s.post(login_url, headers=headers,
                       data=payload, cookies=cookies)
                s.get(signin_url)
                # getting the tour data
                # headers for s.get
                headers = {"onlyprops": "true"}

                # storing the respone Data and formatting it into JSON
                response = s.get(tour_url, headers=headers)
                data = response.json()

                # shorting the dictionary
                ListOfTours = data["_embedded"]["tours"]

                # function to round_up the distance
                def round_up(n, decimals=0):
                    multiplier = 10 ** decimals
                    return math.ceil(n * multiplier) / multiplier

                # iterating throw the dictionary and for each tour get the specific data and storing it into the Table

                TourData = data["_embedded"]["tours"][0]
                TourDate = TourData["date"]
                TourDistance = TourData["distance"]
                TourDistance = round_up(TourDistance/1000, 1)
                TourDuration = TourData["duration"]
                TourDuration = TourDuration/60
                TourElevation_down = TourData["elevation_down"]
                TourElevation_up = TourData["elevation_down"]
                TourMap_image_long = TourData["map_image"]["src"]
                TourMap_image_short = TourMap_image_long[:-42]
                TourName = TourData["name"]
                TourSport = TourData["sport"]
                TourStart_point_lat = TourData["start_point"]["lat"]
                TourStart_point_lng = TourData["start_point"]["lng"]
                responseGeoCodingAPI = requests.get(
                    f"https://api.bigdatacloud.net/data/reverse-geocode-client?latitude={TourStart_point_lat}&longitude={TourStart_point_lng}&localityLanguage=de")
                GeoCodingAPiData = responseGeoCodingAPI.text
                jsonGeoCodingApi = json.loads(GeoCodingAPiData)
                TourStart_point = jsonGeoCodingApi["locality"]
                TourType = TourData["type"]
                TourID = TourData["id"]

                if (queryTourID != TourID):

                    headers = {
                        "Accept": "application/json",
                        "Notion-Version": "2022-02-22",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + self.notion_api_token,
                    }

                    url = "https://api.notion.com/v1/pages"

                    payload = {
                        "parent": {"database_id": "a1598dbcf93f4801bd35e9c905b12e18"},
                        "properties": {
                            "tourname": {
                                "title": [
                                    {
                                        "type": "text",
                                        "text": {
                                            "content": "{0}".format(TourName)
                                        }
                                    }
                                ]
                            },
                            "date": {
                                "date": {
                                    "start": "{0}".format(TourDate)
                                }
                            },
                            "distance": {
                                "number": TourDistance
                            },
                            "sporttype": {
                                "select": {
                                    "name": "{0}".format(TourSport)
                                }
                            },
                            "startpoint": {
                                "select": {
                                    "name": "{0}".format(TourStart_point)
                                }
                            },
                            "elevationup": {
                                "number": TourElevation_up
                            },
                            "elevationdown": {
                                "number": TourElevation_down
                            },
                            "duration": {
                                "number": TourDuration
                            },
                            "toururl": {
                                "url": "https://www.komoot.de/tour/%s" % TourID
                            },
                            "tourid": {
                                "number": TourID
                            },
                            "tourtype": {
                                "select": {
                                    "name": "{0}".format(TourType)
                                }
                            },
                        },
                        "icon": {
                            "type": "emoji", "emoji": "🚴‍♂️"
                        },
                    }

                    response = requests.request(
                        "POST", url, json=payload, headers=headers)

            except KeyError:
                print("fetched to quickly!")

        else:
            try:
                # define the Komoot API URL's for login into the Komoot Session and getting the TourData
                tour_url = f'https://www.komoot.de/api/v007/users/{self.komoot_id}/tours/'
                login_url = "https://account.komoot.com/v1/signin"
                signin_url = "https://account.komoot.com/actions/transfer?type=signin"

                # creating a session to login into your kommot account
                s = requests.Session()
                res = requests.get(login_url)
                cookies = res.cookies.get_dict()

                # Payload for HTTP request
                payload = json.dumps({
                    "email": self.komoot_email,
                    "password": self.komoot_password,
                    "reason": "null"
                })

                # headers for s.post
                headers = {"Content-Type": "application/json"}

                # make login request
                s.post(login_url, headers=headers,
                       data=payload, cookies=cookies)
                s.get(signin_url)
                # getting the tour data
                # headers for s.get
                headers = {"onlyprops": "true"}

                # storing the respone Data and formatting it into JSON
                response = s.get(tour_url, headers=headers)
                data = response.json()

                # shorting the dictionary
                ListOfTours = data["_embedded"]["tours"]

                # function to round_up the distance
                def round_up(n, decimals=0):
                    multiplier = 10 ** decimals
                    return math.ceil(n * multiplier) / multiplier

                tourcount = 0

                print("started")
                # iterating throw the dictionary and for each tour get the specific data and storing it into the Table
                for tours in ListOfTours:

                    TourData = data["_embedded"]["tours"][tourcount]
                    TourDate = TourData["date"]
                    TourDistance = TourData["distance"]
                    TourDistance = round_up(TourDistance/1000, 1)
                    TourDuration = TourData["duration"]
                    TourDuration = TourDuration/60
                    TourElevation_down = TourData["elevation_down"]
                    TourElevation_up = TourData["elevation_down"]
                    TourMap_image_long = TourData["map_image"]["src"]
                    TourMap_image_short = TourMap_image_long[:-42]
                    TourName = TourData["name"]
                    TourSport = TourData["sport"]
                    TourStart_point_lat = TourData["start_point"]["lat"]
                    TourStart_point_lng = TourData["start_point"]["lng"]
                    responseGeoCodingAPI = requests.get(
                        f"https://api.bigdatacloud.net/data/reverse-geocode-client?latitude={TourStart_point_lat}&longitude={TourStart_point_lng}&localityLanguage=de")
                    GeoCodingAPiData = responseGeoCodingAPI.text
                    jsonGeoCodingApi = json.loads(GeoCodingAPiData)
                    TourStart_point = jsonGeoCodingApi["locality"]
                    TourType = TourData["type"]
                    TourID = TourData["id"]

                    headers = {
                        "Accept": "application/json",
                        "Notion-Version": "2022-02-22",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + self.notion_api_token,
                    }

                    url = "https://api.notion.com/v1/pages"

                    payload = {
                        "parent": {"database_id": "a1598dbcf93f4801bd35e9c905b12e18"},
                        "properties": {
                            "tourname": {
                                "title": [
                                    {
                                        "type": "text",
                                        "text": {
                                            "content": "{0}".format(TourName)
                                        }
                                    }
                                ]
                            },
                            "date": {
                                "date": {
                                    "start": "{0}".format(TourDate)
                                }
                            },
                            "distance": {
                                "number": TourDistance
                            },
                            "sporttype": {
                                "select": {
                                    "name": "{0}".format(TourSport)
                                }
                            },
                            "startpoint": {
                                "select": {
                                    "name": "{0}".format(TourStart_point)
                                }
                            },
                            "elevationup": {
                                "number": TourElevation_up
                            },
                            "elevationdown": {
                                "number": TourElevation_down
                            },
                            "duration": {
                                "number": TourDuration
                            },
                            "toururl": {
                                "url": "https://www.komoot.de/tour/%s" % TourID
                            },
                            "tourid": {
                                "number": TourID
                            },
                            "tourtype": {
                                "select": {
                                    "name": "{0}".format(TourType)
                                }
                            },
                        },
                        "icon": {
                            "type": "emoji", "emoji": "🚴‍♂️"
                        },
                    }

                    response = requests.request(
                        "POST", url, json=payload, headers=headers)

                    tourcount = tourcount + 1

                print("finished")

            except KeyError:
                print("fetched to quickly!")

    def QueryNotionDatabase(self):
        url = "https://api.notion.com/v1/databases/{0}/query".format(
            self.notion_database_id)

        headers = {
            "Accept": "application/json",
            "Notion-Version": "2022-02-22",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + self.notion_api_token,
        }

        payload = {
            "page_size": 1,
            "sorts": [
                {
                    "property": "date",
                    "direction": "descending",
                },
            ],
        }

        response = requests.request("POST", url, json=payload, headers=headers)

        return(response.text)


KN = KomootToNotion(673338137185, "DanielMuenstermann18@gmail.com", "DPrQh5bqv1TPutMU5uCP",
                    "secret_WdntPIWViLSP8jfpvEBzV38avPrMSCXlqTCCdl0b1uB", "a1598dbcf93f4801bd35e9c905b12e18")

query = KN.QueryNotionDatabase()

queryJSON = json.loads(query)

try:
    queryTourID = queryJSON["results"][0]["properties"]["tourid"]["number"]
    KN.getTourDataANDsendToNotion(queryTourID, addAll=False)
    print("newest Tour was added!")
except IndexError:
    print("Database is empty! Adding All Tours")
    KN.getTourDataANDsendToNotion(0, addAll=True)
finally:
    print("everyting is uptodate")
