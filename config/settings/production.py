"""
Production Django settings for eri5_website project.
Overwrites some development variables, imported by settings/__init__.py
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

SECRET_KEY_FILE = 'secret.key'

try:
    f = open(SECRET_KEY_FILE, 'r')
    SECRET_KEY = f.read().strip()
except IOError:
    import random
    import string
    new_key = ''.join([random.choice(string.ascii_lowercase + string.digits) for i in range(64)])
    SECRET_KEY = new_key
    f = open(SECRET_KEY_FILE, 'w')
    f.write(SECRET_KEY)
    f.close()
    
ALLOWED_HOSTS = ['.eri5.com']

DEBUG = False

TEMPLATE_DEBUG = False

STATIC_URL = '/static/'

STATIC_ROOT = '/home/tacowrap/webapps/eri53_static'