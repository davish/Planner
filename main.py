#!/usr/bin/env python


import os
import re

import webapp2
import jinja2

from google.appengine.ext import db
from datetime import date, timedelta, datetime

import pickle
import logging
import json
# URL handelers
import user_interactions
import misc
import database
from hashing import *




template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                               autoescape = True)

assignments = {'mondayeng': '', 'tuesdayeng': '', 'wednesdayeng': '', 'thursdayeng': '', 'fridayeng': '',
              'mondayhist': '', 'tuesdayhist': '', 'wednesdayhist': '', 'thursdayhist': '', 'fridayhist': '',
              'mondaymath': '', 'tuesdaymath': '', 'wednesdaymath': '', 'thursdaymath': '', 'fridaymath': '',
              'mondaysci': '', 'tuesdaysci': '', 'wednesdaysci': '', 'thursdaysci': '', 'fridaysci': '',
              'mondaylang': '', 'tuesdaylang': '', 'wednesdaylang': '', 'thursdaylang': '', 'fridaylang': '',
              'mondayother': '', 'tuesdayother': '', 'wednesdayother': '', 'thursdayother': '', 'fridayother': '',
              'notes': '', 'date':''}



def week_start_date(year, week):
    d = date(year, 1, 1)    
    delta_days = d.isoweekday() - 1
    delta_weeks = week
    if year == d.isocalendar()[0]:
        delta_weeks -= 1
    delta = timedelta(days=-delta_days, weeks=delta_weeks)
    return d + delta



class Handler(webapp2.RequestHandler):
    def validate_cookie(self, cookie_name):
        name_cookie_str = self.request.cookies.get(cookie_name) # Get the cookie
        if name_cookie_str: # If there is a cookie
          cookie_val = check_secure_val(name_cookie_str) # Make sure that it's a valid cookie
          # u = User.get_by_id(int(cookie_val))
          if cookie_val: # If it's valid
            return cookie_val # Return the value of the cookie
          else: # If not
            return None # Return None

    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)
    def render_str(self, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)
    def render(self, template, **kw):
        self.write(self.render_str(template, **kw))

DATE_REGEX = re.compile(r'(\d{4,})-(\d{2,2})-(\d{2,2})')

class MainPage(Handler):
  
  def get(self):
    y = datetime.now().isocalendar()[0]
    w = datetime.now().isocalendar()[1]
    starting_date = week_start_date(y,w)

    assignments['date'] = starting_date.isoformat() # use the starting date as the date
    self.render("planbook.html", assignments=assignments, user = database.User.get_by_id(int(self.validate_cookie('user_id'))) if self.validate_cookie('user_id') else None)
  def post(self):
    # Get the JSON from the POST request
    assn = {}
    for i in self.request.arguments():
      assn[i] = self.request.get(i)

    # Check if week already exists in the datastore
    week = assn['date']
    usr = self.validate_cookie('user_id')
    action = assn['action']
    del assn['action']
    del assn['date']
    result = db.GqlQuery("SELECT * FROM Week WHERE week = :week AND user = :user LIMIT 1", week = week, user = usr)
    
    # Save to datastore
    if result:
      result = result[0]
      result.assignments = assn
      result.put()
    else:
      a = database.Week(user = usr, week = week, assignments = assn)
      a.put()

    # Response


    self.response.headers['Content-Type'] = "text/json"
    assn['date'] = sdates.current_date.isoformat()
    self.write(json.dumps(assn))

class HomePage(Handler):
  def get(self):
    self.write("Home page!")

app = webapp2.WSGIApplication([('/planner', MainPage), ('/signup', user_interactions.Signup), ('/', HomePage), ('/welcome', misc.WelcomeHandler), ('/login', user_interactions.LoginHandler)],
                              debug=True)




"""
So... Have the isocalendar() of the date stored as a string in the HTML... then eval() it when it gets
back and feed it through week_start_date again but with strdate[1] + 1... voila! You have a date obj
one week ahead! or... 

you can just make a string template.... and use a regex!
"""