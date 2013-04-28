#!/usr/bin/python
# coding=utf-8
# Findeco is dually licensed under GPLv3 or later and MPLv2.
#
################################################################################
# Copyright (c) 2012 Klaus Greff <klaus.greff@gmx.net>
# This file is part of Findeco.
#
# Findeco is free software; you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation; either version 3 of the License, or (at your option) any later
# version.
#
# Findeco is distributed in the hope that it will be useful, but WITHOUT ANY
# WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
# A PARTICULAR PURPOSE. See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along with
# Findeco. If not, see <http://www.gnu.org/licenses/>.
################################################################################
#
################################################################################
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
################################################################################
""" Django settings for Findeco project."""

###############################################################################
#                 Copy values to your local_settings.py file
#                                Start Here
#vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

# do not change the following three lines
from __future__ import division, print_function, unicode_literals
import datetime
from findeco.project_path import project_path

# You should turn debug off on public machines.
# This is helpful for development and setup
DEBUG = True

# We will send Exceptions created by the Api to this Email
ADMINS = (
    ('Your Name', 'your_name@email.com'),
)

# The password used for the auto-created 'admin' user on first database sync.
# Make sure to change your password after first login
ADMIN_PASS = "1234"

# You can define your database here. The default configuration (sqlite) works
# fine for testing and development environments
DATABASES = {
    'default': {
        # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'ENGINE': 'django.db.backends.sqlite3',
        # DBName of path to database file if using sqlite3.
        'NAME': project_path("Database.sqlite3"),
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        # Set to empty string for localhost. Not used with sqlite3.
        'HOST': '',
        # Set to empty string for default. Not used with sqlite3.
        'PORT': '',
    }
}
# Make this unique, and don't share it with anybody.
SECRET_KEY = 'MQ4DNT74V5FFRZNFKC01CI6DYERAXEJZO5DNURVV2G4NTZ5B6OFGFPGJGKRT'

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'Europe/Berlin'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'de-DE'

# Settings for sending registration and other mails to users 
EMAIL_HOST = ''
EMAIL_PORT = 25
EMAIL_HOST_PASSWORD = ''
EMAIL_HOST_USER = ''
EMAIL_SUBJECT_PREFIX = '[Findeco]'
EMAIL_USE_TLS = True

# This url is used in mails and similar things for pointing to
# your Findeco system
FINDECO_BASE_URL = 'http://127.0.0.1:8000'


# Drop activation keys and password recovery keys after the configured times
ACTIVATION_KEY_VALID_FOR = datetime.timedelta(hours=24)
RECOVERY_KEY_VALID_FOR = datetime.timedelta(hours=24)


# These strings are send on registration and Mail recovery
# (They will change their place in the near future)
REGISTRATION_TITLE = 'Your Findeco registration'
REGISTRATION_BODY = 'You have registred an Findeco Account with this E-Mail ' \
                    'address. You can activate it with the Link below. If you' \
                    ' did not register it you just need to ignore this Mail '
REGISTRATION_RECOVERY_TITLE = 'You requested a Password reset'
REGISTRATION_RECOVERY_BODY = 'You requested an Password reset on your Findeco' \
                             ' Account. You can request it with the Link ' \
                             'below. If you did not request it you just need' \
                             ' to ignore this Mail '
REGISTRATION_RECOVERY_TITLE_SUCCESS = 'Your new Findeco Password'
REGISTRATION_RECOVERY_BODY_SUCCESS = 'Your new Findeco password is'

###############################################################################
#                    End of Values for Local Settings File
###############################################################################

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = False

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = False

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = False

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    project_path('static'),
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

CSRF_COOKIE_NAME = str("XSRF-TOKEN")

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

ROOT_URLCONF = 'findeco.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'findeco.wsgi.application'


INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    'django.contrib.admindocs',
    'findeco',
    'microblogging',
    'node_storage',
    'south',
    'libs.django_cron'
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

APPEND_SLASH = False

CRON_POLLING_FREQUENCY = 300  # in seconds

# uncomment this if you don't want unittests to run migrations
#SOUTH_TESTS_MIGRATE = False

# try to import secret_settings and overwrite some of the default values
try:
    from local_settings import *
except ImportError:
    pass
