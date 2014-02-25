from django.shortcuts import render

def index(request):
    return render(request, 'website/projects/index.html', {'page_projects': True})
