from django.shortcuts import render

def index(request):
    return render(request, 'website/about/index.html', {})

def resume(request):
    return render(request, 'website/about/resume.html', {})