#!/usr/bin/env python


import os
import re

import webapp2
import jinja2

from google.appengine.ext import db
import logging
# URL handelers
import user_interactions
import misc
import database
from hashing import *




template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                               autoescape = True)

assignments_old = {'eng': {'monday': '', 'tuesday': '', 'wednesday': '', 'thursday': '', 'friday': ''}, 
              'hist': {'monday': '', 'tuesday': '', 'wednesday': '', 'thursday': '', 'friday': ''},
              'math': {'monday': '', 'tuesday': '', 'wednesday': '', 'thursday': '', 'friday': ''},
              'sci': {'monday': '', 'tuesday': '', 'wednesday': '', 'thursday': '', 'friday': ''},
              'lang': {'monday': '', 'tuesday': '', 'wednesday': '', 'thursday': '', 'friday': ''},
              'other': {'monday': '', 'tuesday': '', 'wednesday': '', 'thursday': '', 'friday': ''},
              'notes': {'monday': ''}
              }
assignments = {'mondayeng': '', 'tuesdayeng': '', 'wednesdayeng': '', 'thursdayeng': '', 'fridayeng': '',
              'mondayhist': '', 'tuesdayhist': '', 'wednesdayhist': '', 'thursdayhist': '', 'fridayhist': '',
              'mondaymath': '', 'tuesdaymath': '', 'wednesdaymath': '', 'thursdaymath': '', 'fridaymath': '',
              'mondaysci': '', 'tuesdaysci': '', 'wednesdaysci': '', 'thursdaysci': '', 'fridaysci': '',
              'mondaylang': '', 'tuesdaylang': '', 'wednesdaylang': '', 'thursdaylang': '', 'fridaylang': '',
              'mondayother': '', 'tuesdayother': '', 'wednesdayother': '', 'thursdayother': '', 'fridayother': '',
              'notes': ''}
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


class MainPage(Handler):
  def get(self):
    self.render("planbook.html", assignments=assignments, user = database.User.get_by_id(int(self.validate_cookie('user_id'))) if self.validate_cookie('user_id') else None)
  def post(self):
    logging.error(self.request.headers)
class HomePage(Handler):
  def get(self):
    self.write("Home page!")

app = webapp2.WSGIApplication([('/planner', MainPage), ('/signup', user_interactions.Signup), ('/', HomePage), ('/welcome', misc.WelcomeHandler), ('/login', user_interactions.LoginHandler)],
                              debug=True)