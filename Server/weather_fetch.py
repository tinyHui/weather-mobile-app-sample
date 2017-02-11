import requests
import json

URL = 'http://api.openweathermap.org/data/2.5/weather'

with open("appid", "r") as f:
    APP_ID = f.read().strip()


class WeatherRes:
    def __init__(self, res):
        self.res = json.loads(res)

    def get_temp(self):
        return round(self.res["main"]["temp"])

    def get_icon(self):
        icon_map = {
            '01d': '\uf00d',
            '02d': '\uf002',
            '03d': '\uf041',
            '04d': '\uf013',
            '09d': '\uf019',
            '10d': '\uf008',
            '11d': '\uf016',
            '13d': '\uf064',
            '50d': '\uf014',
            '01n': '\uf077',
            '02n': '\uf086',
            '03n': '\uf041',
            '04n': '\uf031',
            '09n': '\uf028',
            '10n': '\uf028',
            '11n': '\uf016',
            '13n': '\uf016',
            '50n': '\uf014'
          };

        icon = self.res["weather"][0]["icon"]
        return icon_map[icon]

    def get_description(self):
        return self.res["weather"][0]["description"]

    def get_location(self):
        city = self.res["name"]
        country = self.res["sys"]["country"]
        return "%s, %s" % (city, country)

def get_weather_via_city(city):
    q = {"q":city,"units":"metric","appid":APP_ID}
    res = requests.get(URL, params=q)
    if res.status_code != 200:
        raise ConnectionError("Not able to get weather data from openweathermap.org")

    return WeatherRes(res.text)

def get_weather_via_geo(lat, lon):
    q = {"lat":lat,"lon":lon,"units":"metric","appid":APP_ID}
    res = requests.get(URL, params=q)
    print(res.url)
    if res.status_code != 200:
        raise ConnectionError("Not able to get weather data from openweathermap.org")

    return WeatherRes(res.text)
