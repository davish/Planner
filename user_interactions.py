#!/usr/bin/env python

import os
import re
import string
import webapp2
import jinja2
import random
from google.appengine.ext import db
import webapp2
import json
import logging
from datetime import date

# files in __dir__
from database import *
from hashing import *


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


USER_RE = re.compile(r"^[a-zA-Z0-9_-]{3,20}$")
def valid_username(username):
    return username and USER_RE.match(username)

PASS_RE = re.compile(r"^.{3,20}$")
def valid_password(password):
    return password and PASS_RE.match(password)

EMAIL_RE  = re.compile(r'^[\S]+@[\S]+\.[\S]+$')
def valid_email(email):
    return not email or EMAIL_RE.match(email)

class Signup(Handler):

    def get(self):
        self.render("signup-form.html")

    def post(self):
        have_error = False
        username = self.request.get('username')
        password = self.request.get('password')
        verify = self.request.get('verify')
        email = self.request.get('email')

        params = dict(username = username,
                      email = email)

        if not valid_username(username):
            params['error_username'] = "That's not a valid username."
            have_error = True

        if not valid_password(password):
            params['error_password'] = "That wasn't a valid password."
            have_error = True
        elif password != verify:
            params['error_verify'] = "Your passwords didn't match."
            have_error = True

        if not valid_email(email):
            params['error_email'] = "That's not a valid email."
            have_error = True

        if have_error:
            self.render('signup-form.html', **params)
        else:
          result = db.Query(User).filter("username =", username).fetch(limit=1)
          if result:
            params['error_exists'] = "This user already exists"
            self.render('signup-form.html', **params)
          else:
            hashed_pwd = make_pw_hash(username, password)
            u = User(username = username, password = hashed_pwd)
            u.put()
            userid_cookie = make_secure_val(str(u.key().id()))
            #self.response.headers.add_header('Set-Cookie', 'user_id=%s' % userid_cookie)
            response.set_cookie('user_id', userid_cookie)
            self.redirect('/welcome')

class LoginHandler(Handler):
  def get(self):
    self.render("login.html")
  def post(self):
    logging.error("LOGIN_POST")
    have_error = False
    username = self.request.get('username')
    password = self.request.get('password')
    logging.error("USERNAME IS %s" % username)
    result = db.Query(User).filter("username =", username).fetch(limit=1)
    if result:
      if valid_pw(username, password, result[0].password):
        userid_cookie = make_secure_val(str(result[0].key().id()))
        self.response.headers.add_header('Set-Cookie', 'user_id=%s' % userid_cookie)
        self.redirect('/welcome')
