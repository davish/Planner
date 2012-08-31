#!/usr/bin/env python


import os
import re
from string import letters

import jinja2

from google.appengine.ext import db
from datetime import date, timedelta, datetime

import webapp2

# Local dir files
from hashing import *
from database import *

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                               autoescape = True)


class Handler(webapp2.RequestHandler):
    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)
    def render_str(self, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)
    def render(self, template, **kw):
        self.write(self.render_str(template, **kw))



class WelcomeHandler(Handler):
  def get(self):
    name = ''
    name_cookie_str = self.request.cookies.get('user_id')
    if name_cookie_str:
      cookie_val = check_secure_val(name_cookie_str)
      u = User.get_by_id(int(cookie_val))
      if cookie_val:
        u = User.get_by_id(int(cookie_val))
        self.write("<h1>Welcome, %s!</h1>" % str(u.username))
        return
      else:
        self.redirect('/signup')
    self.redirect('/signup')