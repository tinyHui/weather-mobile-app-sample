from flask import Flask
from flask_restful import Resource, Api, abort
import os

from weather_fetch import get_weather

app = Flask(__name__)
api = Api(app)


class Weather(Resource):
    def get(self, city):
        try:
            weather = get_weather(city)
            return {
                "temperature": weather.get_temp(),
                "description": weather.get_description(),
                "location": weather.get_location(),
                "icon": weather.get_icon()
            }
        except ConnectionError:
            abort(503, "not able to get weather for %s" % city)

api.add_resource(Weather, '/weather/<string:city>')

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
