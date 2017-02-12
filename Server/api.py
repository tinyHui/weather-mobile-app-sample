from flask import Flask, send_file
from flask_restful import Resource, Api, abort, reqparse
import os

from weather_fetch import get_weather_via_city, get_weather_via_geo

app = Flask(__name__)
api = Api(app)


class CityWeather(Resource):
    def get(self, city):
        try:
            weather = get_weather_via_city(city)
            return {
                "temperature": weather.get_temp(),
                "description": weather.get_description(),
                "location": weather.get_location(),
                "icon": weather.get_icon()
            }
        except ConnectionError:
            abort(400)

class GeoWeather(Resource):
    def get(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('lat', required=True, type=float, help='Latitude required')
            parser.add_argument('lon', required=True, type=float, help='Longitude required')
            args = parser.parse_args()
            lat, lon = args['lat'], args['lon']
            weather = get_weather_via_geo(lat, lon)
            return {
                "temperature": weather.get_temp(),
                "description": weather.get_description(),
                "location": weather.get_location(),
                "icon": weather.get_icon()
            }
        except ConnectionError:
            abort(400)

api.add_resource(CityWeather, '/city/<string:city>')
api.add_resource(GeoWeather, '/geo/')

if __name__ == '__main__':
    ENV = None
    try:
        ENV = os.environ['Environment']
    except KeyError:
        pass

    debug = False
    if ENV == "DEV":
        debug = True

    app.run(debug=debug)
