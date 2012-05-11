#!/usr/bin/env python


import os
import re
from string import letters

import webapp2
import jinja2

from google.appengine.ext import db

import webapp2
import hashlib
template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                               autoescape = True)


def hash_str(s):
  return hashlib.md5(s).hexdigest()

def make_secure_val(s):
  return "%s,%s" % (s, hash_str(s))

def check_secure_val(h):
  val = h.split(',')[0]
  if h == make_secure_val(val):
    return val

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
    self.write("Check out this AWESOME planner!")



app = webapp2.WSGIApplication([('/', MainPage)],
                              debug=True)
