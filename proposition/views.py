from django.shortcuts import render
from django.template import RequestContext
from django.views.generic import TemplateView

from django.http import HttpResponse
import django.http
import json
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt

from proposition.models import Proposition, Entailment, Property, Discussion, ArgumentPoint, Argument
from proposition.forms import EntailmentForm

from django.core import serializers
from django.utils import timezone

#PROPOSITION_TEMPLATE = 'prop2.html'
PROPOSITION_TEMPLATE = 'project.html'
CONSEQUENCE_TEMPLATE = 'cons2.html'

def index(request):	
	scope = {}
	propositions = Proposition.objects.all()
	scope["propositions"] = propositions
	if request.method == "POST":
		return process_proposition(request, scope)
	else:
		return render(request, PROPOSITION_TEMPLATE, scope)

def index2(request):	
	scope = {}
	propositions = Proposition.objects.all()
	scope["propositions"] = propositions
	if request.method == "POST":
		return process_proposition(request, scope)
	else:
		return render(request, 'prop2.html', scope)

def process_proposition(request, scope = {}):
	prop = Proposition.objects.create(creation_date = timezone.datetime.utcnow(),
									  name 		    = request.POST['prop'][:120], 
									  text 			= request.POST['prop'], 
									  truthiness    = 1.0,
									  vote 			= 1)
	return render(request, PROPOSITION_TEMPLATE, scope)


def cons(request):
	scope = {}
	propositions = Proposition.objects.all()
	scope["propositions"] = propositions

	if request.method == "POST":
		return process_cons(request, scope)

	return render(request, CONSEQUENCE_TEMPLATE, scope)


def process_cons(request, scope):

	scope["numberPremises"] = int( request.POST["numberPremises"] )
	scope["premises"] 		= []

	scope["consequence"] 	= request.POST["consequence"]
	scope["reason"] 		= request.POST["reason"]

	print("numberPremises:", scope["numberPremises"])

	for index in xrange(  0, scope["numberPremises"] ):
		scope["premises"].append( request.POST[ "premise" + str(index) ] )
		print("premise")

	sid = transaction.savepoint()
	try:
		conclusion = Proposition()
		conclusion.name = ""
		conclusion.text = scope["consequence"]	
		conclusion.modifier = ""
		conclusion.truthiness = 1.0
		conclusion.vote = 0

		conclusion.save()

		entailment = Entailment()
		entailment.conclusion = conclusion
		entailment.reason = scope['reason']
		
		entailment.save()

		for index in xrange( 0, scope["numberPremises"] ):
			entailment.premises.add( scope["premises"][index] )
	except Exception as e:
		print("ERROR")
		transaction.savepoint_rollback(sid)
	else:
		transaction.savepoint_commit(sid)


	return render(request, CONSEQUENCE_TEMPLATE, scope)

# Time for topological sort yum