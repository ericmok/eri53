from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'eri5_website.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    
    url(r'^/?$', 'website.views.about.index', name='about'),
    url(r'^resume/?$', 'website.views.about.resume', name='resume'),
    
    url(r'^projects/?$', 'website.views.projects.index', name='projects'),
)
