import django.db.models 
from django.contrib.auth.models import User

class Point2d(django.db.models.Model):
    x = django.db.models.FloatField()
    y = django.db.models.FloatField()
    label = django.db.models.IntegerField()
    
