#!/usr/bin/python
from google.appengine.ext import db
""" Datastore models for planner
"""
class Week(db.Model):
  user = db.IntegerProperty(required = True) # ID of user who the week belongs to
  created = db.DateTimeProperty(auto_now_add = True) # When it was created, for admin purposes
  week = db.StringProperty(required = True) # The date of the monday of the week that is being represented
  assignments = db.StringProperty(required = True) # The JSON representation of the dictionary that contains the data for the week

class User(db.Model):
  username = db.StringProperty(required = True) # Username
  password = db.StringProperty(required = True) # Password
  created = db.DateTimeProperty(auto_now_add = True) # Date Created
  email = db.StringProperty() # Email (optional) for mailing list (coming soon)