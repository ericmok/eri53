from django.shortcuts import render

def index(request):
    return render(request, 'website/about/index.html', {'page_about': True})

def resume(request):
    return render(request, 'website/about/resume.html', {'page_resume': True})