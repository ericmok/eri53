from django.conf.urls import patterns, include, url
from django.conf import settings

from proposition.models import Proposition

from django.views.generic import TemplateView

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

JAVASCRIPT_TEMPLATES = ['prop.js', 'cons.js']


urlpatterns = patterns('',
	url(r'rest/prop/$', 'proposition.rest.prop'),
	url(r'rest/prop/(?P<id>[a-z0-9]+)/$', 'proposition.rest.prop'),
	url(r'rest/entailment/$', 'proposition.rest.entailment'),
	url(r'rest/entailment/(?P<id>[a-z0-9]+)/?$', 'proposition.rest.entailment'),
	url(r'rest/propositiontag/(?P<id>[a-z0-9]+)?/?$', 'proposition.rest.proposition_tag'),

	url(r'project/$', 'proposition.views.index'),
	url(r'prop/$', 'proposition.views.index'),
	url(r'prop2/$', 'proposition.views.index2'),
	url(r'cons/$', 'proposition.views.cons'),
	url(r'add/$', 'proposition.views.index'),
	
    url(r'/?$', TemplateView.as_view(template_name='guide.html')),
	url(r'guide/$', TemplateView.as_view(template_name='guide.html')),
	url(r'vision/$', TemplateView.as_view(template_name='vision.html')),
	)