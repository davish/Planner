#!/usr/bin/env python


import os
import re

import webapp2
import jinja2

from google.appengine.ext import db

# URL handelers
import user_interactions
import misc



template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                               autoescape = True)

assignments = {'eng': {'monday': '', 'tuesday': '', 'wednesday': '', 'thursday': '', 'friday': ''}, 
              'hist': {'monday': '', 'tuesday': '', 'wednesday': '', 'thursday': '', 'friday': ''},
              'math': {'monday': '', 'tuesday': '', 'wednesday': '', 'thursday': '', 'friday': ''},
              'sci': {'monday': '', 'tuesday': '', 'wednesday': '', 'thursday': '', 'friday': ''},
              'lang': {'monday': '', 'tuesday': '', 'wednesday': '', 'thursday': '', 'friday': ''},
              'other': {'monday': '', 'tuesday': '', 'wednesday': '', 'thursday': '', 'friday': ''},
              'notes': {'monday': ''}
              }
class Handler(webapp2.RequestHandler):
    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)
    def render_str(self, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)
    def render(self, template, **kw):
        self.write(self.render_str(template, **kw))
class MainPage(Handler):
  def get(self):
    self.render("planbook.html", assignments=assignments)
class HomePage(Handler):
  def get(self):
    self.write("Home page!")

app = webapp2.WSGIApplication([('/planner', MainPage), ('/signup', user_interactions.Signup), ('/', HomePage), ('/welcome', misc.WelcomeHandler), ('/login', user_interactions.LoginHandler)],
                              debug=True)