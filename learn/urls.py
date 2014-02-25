from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^$', 'learn.views.index'),
    url(r'^ajax/$', 'learn.ajax.handle_requests'),
    )