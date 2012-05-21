#!/usr/bin/env python


import os
import re
from string import letters

import webapp2
import jinja2

from google.appengine.ext import db

import webapp2
import hashlib



SECRET = "imsosecret"
def hash_str(s):
  return hmac.new(SECRET, s).hexdigest()

def make_secure_val(s):
  return "%s|%s" % (s, hash_str(s))

def check_secure_val(h):
  val = h.split('|')[0]
  if h == make_secure_val(val):
    return val

def make_salt():
  return ''.join(random.choice(string.letters) for x in xrange(5))

def make_pw_hash(name, pw, salt=""):
  if not salt:
      salt = make_salt()
  h = hashlib.sha256(name + pw + salt).hexdigest()
  return '%s,%s' % (h, salt)

def valid_pw(name, pw, h):
    salt = h[h.find(',') + 1:]
    if make_pw_hash(name, pw, salt) == h:
        return True
    else:
        return False