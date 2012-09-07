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

DATE_REGEX = re.compile(r'(\d{4,})-(\d{2,2})-(\d{2,2})') # Using {4,} instead of {4,4} we eliminate any Y10K bug!

class MainPage(Handler):
  
  def get(self):
    usr = self.validate_cookie('user_id')    
    if usr:
      usr = int(usr)
    else:  
      self.redirect('/signup')
      return
    
    y = datetime.now().isocalendar()[0]
    w = datetime.now().isocalendar()[1]
    starting_date = week_start_date(y,w).isoformat()

    result = db.Query(database.Week).filter("user =", usr).filter("week =", starting_date).fetch(limit=1)

    if result:
      result = result[0].assignments
      logging.error(result)

    else:
      result = assignments
      result['date'] = starting_date # use the starting date as the date
      result = json.dumps(result)

    assn = json.loads(result)

    self.render("planbook.html", assignments=assn, user = database.User.get_by_id(usr) if usr else None)

  def post(self):
    # Get the JSON from the POST request
    assn = {}
    for i in self.request.arguments():
      assn[i] = self.request.get(i)

    # logging.error(assn)
    week = assn['date']
    usr = int(self.validate_cookie('user_id'))
    action = assn['action']

    del assn['action']

    # Check if week already exists in the datastore
    result = db.Query(database.Week).filter("user =", usr).filter("week =", week).fetch(limit=1)
    
    assn = json.dumps(assn)
    # Save to datastore
    if result:
      logging.error("We got a hit!")
      result = result[0]
      result.assignments = assn
      result.put()
    else:
      logging.error("We don't got a hit")
      a = database.Week(user = usr, week = week, assignments = assn)
      a.put()

    # Response

    d = ""
    if action == "save":
      d = week

    elif action == "back":
      m = DATE_REGEX.match(week)
      new_date = date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
      new_date_isocal = new_date.isocalendar()
      d = week_start_date(new_date_isocal[0], new_date_isocal[1]-1).isoformat()

    elif action == "next":
      m = DATE_REGEX.match(week)
      new_date = date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
      new_date_isocal = new_date.isocalendar()
      d = week_start_date(new_date_isocal[0], new_date_isocal[1] + 1).isoformat()

    result = db.Query(database.Week).filter("user =", usr).filter("week =", d).fetch(limit=1)
    assigns = {}
    if result:
      result = result[0]
      assigns = result.assignments
    else:
      assigns = assignments
      assigns['date'] = d
      logging.error(assigns)
      assigns = json.dumps(assigns)

    logging.error(assigns)
    self.response.headers['Content-Type'] = "text/json"
    self.write(assigns)

class HomePage(Handler):
  def get(self):
    self.write("Home page!")

app = webapp2.WSGIApplication([('/planner', MainPage), ('/logout', user_interactions.LogoutHandler), ('/signup', user_interactions.Signup), ('/', HomePage), ('/welcome', misc.WelcomeHandler), ('/login', user_interactions.LoginHandler)],
                              debug=True)

"""

you can just make a string template.... and use a regex!
"""