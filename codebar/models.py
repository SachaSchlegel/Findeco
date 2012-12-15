#!/usr/bin/python
# coding=utf-8
# CoDebAr is dually licensed under GPLv3 or later and MPLv2.
#
################################################################################
# Copyright (c) 2012 Klaus Greff <klaus.greff@gmx.net>
# This file is part of CoDebAr.
#
# CoDebAr is free software; you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation; either version 3 of the License, or (at your option) any later
# version.
#
# CoDebAr is distributed in the hope that it will be useful, but WITHOUT ANY
# WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
# A PARTICULAR PURPOSE. See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along with
# CoDebAr. If not, see <http://www.gnu.org/licenses/>.
################################################################################
#
################################################################################
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
################################################################################
"""
This file contains models for the basic Project structure:
  * Add a UserProfile to every User
  * automatize admin creation for every syncdb
"""
from __future__ import division, print_function, unicode_literals
from django.conf import settings
from django.contrib.auth import models as auth_models
from django.contrib.auth.management import create_superuser
from django.contrib.auth.models import User
from django.db import models
from django.db.models import signals
try:
    from local_settings import ADMIN_PASS
except ImportError :
    ADMIN_PASS = "1234"

####################### Add profile to each user ###############################
class UserProfile(models.Model):
    """
    Contains a textual description and a list of Users this User follows.
    """
    # The user this profile belongs to
    user = models.OneToOneField(
        User,
        related_name='profile')

    description = models.TextField(
        blank=True,
        help_text="Self-description")

    following = models.ManyToManyField(
        'self',
        related_name='followers',
        symmetrical=False,
        blank=True,
        help_text="Profiles of users this user follows.")

    # Override the save method to prevent integrity errors
    # These happen because both teh post_save signal and the inlined admin
    # interface try to create the UserProfile. See:
    # http://stackoverflow.com/questions/2813189
    def save(self, *args, **kwargs):
        try:
            existing = UserProfile.objects.get(user=self.user)
            self.id = existing.id #force update instead of insert
        except UserProfile.DoesNotExist:
            pass
        models.Model.save(self, *args, **kwargs)

    def __unicode__(self):
        return '<Profile of %s>' % self.user.username

# Use post_save signal to ensure the profile will be created automatically
# when a user is created (saved for the first time)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)
    else:
        # also save the profile when the user is saved
        instance.profile.save()

signals.post_save.connect(create_user_profile, sender=User)


############################ Automatic superuser creation ######################
# From http://stackoverflow.com/questions/1466827/
#
# Prevent interactive question about wanting a superuser created.
signals.post_syncdb.disconnect(
    create_superuser,
    sender=auth_models,
    dispatch_uid='django.contrib.auth.management.create_superuser')

# Create our own admin user automatically.
def create_admin(app, created_models, verbosity, **kwargs):
    if not settings.DEBUG:
        return
    try:
        auth_models.User.objects.get(username='admin')
    except auth_models.User.DoesNotExist:
        print('*' * 80)
        print('Creating admin -- login: admin, password: '+ADMIN_PASS)
        print('*' * 80)
        auth_models.User.objects.create_superuser('admin', 'a@b.de', ADMIN_PASS)
    else:
        print('Admin user already exists.')

signals.post_syncdb.connect(create_admin,
    sender=auth_models, dispatch_uid='common.models.create_admin')
