from django.shortcuts import render_to_response
from django.template import RequestContext

import models

points = models.Point2d.objects.all()

def index(request):
    return render_to_response("learn/index.html",
                              {'points': points}, 
                              context_instance = RequestContext(request))