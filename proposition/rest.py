from django.shortcuts import render

from django.template import RequestContext
from django.views.generic import TemplateView

from django.http import HttpResponse
import django.http
import json
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt

from proposition.models import Proposition, Entailment, Property, Discussion, Domain, PropositionTag, EntailmentTag
from proposition.forms import EntailmentForm

from django.core import serializers
from django.utils import timezone

from django.db.models import Q


def JSONResponse(data, status = 200):
	response = django.http.HttpResponse(content_type = 'application/json', status = status)
	response.write(data)
	return response


@csrf_exempt
def prop(request, id = None):
	if request.method == 'GET':
		print("REST GET")
		if id is None:

			if request.GET.get('premises', None) is not None:
				entailments = Proposition.objects.get_premises().order_by('-creation_date')
				data = serializers.serialize('json', entailments, indent = 2)

				response = HttpResponse(content_type = 'application/json')
				response.write(data)
				return response

			else: # Regular GET with no flags
				print("PROP GET")
				props = Proposition.objects.all().order_by('-creation_date')	

				data = serializers.serialize('json', props, indent = 2)

				res = HttpResponse(content_type = 'application/json')
				res.write(data)

				return res

		else:
			print("REST GET id is not none")

			try:
				prop = Proposition.objects.get(pk = id)
			except Exception as dne:
				print("Exception: " + str(dne))
				prop = []
				
			#data = serializers.serialize('json', [prop,], indent = 2)
			data = serializers.serialize('json', [prop,], indent = 2)

			res = HttpResponse(content_type = 'application/json')
			res.write(data)

			return res

	elif request.method == 'PUT':
		print("PUT")


	elif request.method == 'POST':
		#Create new Prop

		pk = request.POST.get("pk", None)

		# If user supplies pk then use it, otherwise use URL provided pk
		if pk is None:
			pk = id

		text = request.POST["text"]
		
		if len(text) < 1: 
			return JSONResponse('{error: "Proposition must contain text."}', 400);

		name = request.POST.get("name", text[:120])

		#domain	= request.POST.get("domain", 1)
		try:
			domain_pk = request.POST.get("domain", 1)
			domain  =   Domain.objects.get( pk = domain_pk )
		except:
			return JSONResponse('{ error: "Domain ' + domain_pk + ' does not exist." }', 400); 

		#try:
		#	truthiness 	= 	float( request.POST.get("truthiness", 1.0) )
		#	if truthiness < -1.0 or truthiness > 1.0:
		#		raise ValueError
		#except ValueError as ve:
		#	return JSONResponse('{ error: "truthiness value not provided or incorrect (needs to be between -1 and 1)"}', 400)

		truthiness = 1.0
		frontier = True
		vote = 1 # Initial Vote


		sid = transaction.savepoint()
		response = {}
		response["status"] = ""

		if pk is None:
			
			# This is a create operation since no pk is spec'd
			try:
				prop = Proposition.objects.create(creation_date = timezone.datetime.utcnow(),
												  name 			= name,
												  text 			= text,
												  frontier		= frontier,
												  domain		= domain,
												  truthiness 	= truthiness,
												  vote 			= vote)
			except Exception as e: 
				return JSONResponse('{error: "Creation failed with exception: ' + str(e) + '"}', 400)

			else:
				json = serializers.serialize('json', [prop,], indent = 2)
				return JSONResponse(json, 200)

		else:

			# This is an update operation since pk is provided either via 
			# URL or payload
			try:

				prop = Proposition.objects.get(pk = pk)
				
				# If name is not provided, stick to previous name...
				# Should I provide these defaults though?
				if len(name) < 1:
					name = prop.name

				prop.name = name
				prop.text = text
				prop.domain = domain
				prop.truthiness = truthiness
				#prop.frontier = frontier
				#prop.vote = vote
				prop.save()
			except Exception as e:
				return JSONResponse('{error: "Failed update with exception: ' + str(e) + '"}', 304)
			else:
				json = serializers.serialize('json', [prop,], indent = 2)
				return JSONResponse(json, 200)
		
		# Post finishes but what's this? Still here?
		return JSONResponse(r'{error: "POST request not processed..."}', 501)

	elif request.method == 'DELETE':
		return JSONResponse(r'{error: "..."}', 501)


@csrf_exempt
def entailment(request, id = None):

	if request.method == 'POST':
		return post_entailment(request, id)

	if id is None:
		
		if request.GET.get('conclusion', None) is not None:
			entailments = Entailment.objects.filter(conclusion = request.GET['conclusion'])
			data = serializers.serialize('json', entailments, indent = 2)

			response = HttpResponse(content_type = 'application/json')
			response.write( data )
			return response

		elif request.GET.get('onlypremises', None) is not None:
			print("ONLY PREMISES")
			entailments = Proposition.objects.get_premises().order_by('-creation_date')

			data = serializers.serialize('json', entailments, indent = 2)

			response = HttpResponse(content_type = 'application/json')
			response.write(data)
			return response

		elif request.GET.get('containingpremises', None) is not None:
			# TODO
			numberPremises = request.GET.get('numberPremises', None)
			try:
				numberPremises = int( numberPremises )
			except ValueError:
				return HttpResponse("{error: 'numberPremises must be int'}", content_type = 'application/json')

			premises = []

			for index in xrange(0, numberPremises):
				premises.append(  int( request.GET.get('premise' + str(index), None) )  )
			

			entailments = Entailment.objects.filter(premises__in = Proposition.objects.filter(pk__in = premises))
			data = serializers.serialize('json', entailments, indent = 2)

			response = HttpResponse(content_type = 'application/json')
			response.write(data)
			return response
			

		else:

			entailments = Entailment.objects.all().order_by('-creation_date')
			data = serializers.serialize('json', entailments, indent = 2)
			return JSONResponse( data );

	else:
		# id exists
		try:
			entailments = Entailment.objects.filter(pk = id)
			data = serializers.serialize('json', entailments, indent = 2)
		except Exception as e:
			return JSONResponse(e)	
		return JSONResponse(data)


def update_entailment(request, id):
	"""
	Update Branch of a post request. See post_entailment.
	Only supports updating resaons
	"""
	try:
		to_update = Entailment.objects.get(pk = id)
	except Exception as e:
		return JSONResponse('{error: "Exception: ' + str(e) + '"}', 400)

	to_update.reason = request.POST.get("reason", to_update.reason)

	json = serializers.serialize('json', [to_update,], indent = 2)
	return JSONResponse(json, 200)


def post_entailment(request, id = None):
	
	if id is not None:
		return update_entailment(request, id)

	numberPremises  = int( request.POST.get("numberPremises", -1) )
	premises = [] # Stores ids of premises to be searched for in request

	print("numberPremises:", numberPremises)

	try:
		if int(numberPremises) < 1:
			return JSONResponse('{error: "Too few premises!"}', 400)
	except Exception as e:
		return JSONResponse('{error: "numberPremises needs to be a number"}', 400)

	try:
		for index in xrange( 0, numberPremises ):
			premises.append( Proposition.objects.get(pk = request.POST.get("premise" + str(index)) ) )
			print("premise")
	except Exception as e:
		return JSONResponse('{error: "1 or more premises not valid."}', 400)


	domain = request.POST.get("domain", 1)
	try:
		domain = Domain.objects.get(pk = domain)
	except Exception as e:
		return JSONResponse('{error: "Domain not valid. Exception: ' + str(e) + '"}', 400)

	reason = request.POST.get("reason", "")

	
	conclusion = request.POST.get("conclusion", "")

	try:
		# If conclusion is a pk
		conclusionPK = int( conclusion )
		conclusion = Proposition.objects.get(pk = conclusionPK)
	except:
		conclusionText = conclusion

		try:
			conclusion = Proposition.objects.create(creation_date = timezone.datetime.utcnow().replace(tzinfo = timezone.utc),
													name 		  = conclusionText[:120],
													text 		  = conclusionText,
													frontier	  = False,
													domain		  = domain,
													truthiness 	  = 1.0,
													vote 		  = 1)
		except Exception as e:
			return JSONResponse('{error: "Exception: ' + str(e) + '"}', 400)

	try:
		newEntailment = Entailment.objects.create(creation_date = timezone.datetime.utcnow().replace(tzinfo = timezone.utc),
												  reason = reason,
												  conclusion = conclusion,
												  domain = domain)
	except Exception as e:
		return JSONResponse('{error: "Exception: ' + str(e) + '"}', 500)

	for index in xrange( 0, numberPremises ):
		newEntailment.premises.add( premises[index] )

	#serialized = "{pk:\"" + str(newEntailment.pk) + 
	#				"\", creation_date:\"" + str(newEntailment.creation_date) + 
	#				"\", reason:" + str(newEntailment.reason) + 
	#				"\", conclusion:\"" + str(newEntailment.conclusion) + 
	#				"\", domain:\"" + str(domain) + "\"}"
	#return JSONResponse('{status: "OK"}', 200)

	json = serializers.serialize('json', [newEntailment,], indent = 2)
	return JSONResponse(json, 200)










def post_entailment2(request, id = None):
	#TODO
	error = ""

	numberPremises  = int( request.POST.get("numberPremises", -1) )
	premises = []

	print("numberPremises:", numberPremises)

	if int(numberPremises) < 1:
		error += "Too few premises! "

	for index in xrange( 0, numberPremises ):
		premises.append(  request.POST.get( "premise" + str(index) )  )
		print("premise")


	conclusion = request.POST.get("conclusion", "")
	
	try: 
		# If conclusion is a pk
		conclusion = int( conclusion )
		conclusion = Proposition.objects.get( pk = conclusion )
		conclusion.frontier = False
	except:
		# If conclusion is text
		if len(  str( conclusion )  ) < 1:
			error += "conclusion too short! "
		else:
			name = request.POST.get("name", conclusion[:120])
			try:
				conclusion = Proposition.objects.create(creation_date = timezone.datetime.utcnow(),
														name = name, 
													    text = conclusion, 
										   				#modifier = "", 
										   				domain = 1, ##### TODO ######
										   				frontier = False,
										   				truthiness = 1.0, 
										   				vote = 0)
			except:
				error += "Failed making conclusion! "

	if len( error ) > 0:
		response = django.http.HttpResponse(content_type = 'application/json')
		response.write( error )
		return response

	reason = request.POST.get("reason", "")

	newEntailment = Entailment.objects.create(creation_date = timezone.datetime.utcnow(),
											  reason = reason,
											  conclusion = conclusion)
	for index in xrange(  0, numberPremises ):
		newEntailment.premises.add( premises[index] )

	return JSONResponse("{status: 'OK'}")

#	sid = transaction.savepoint()
#	try:
#		conclusion = Proposition()
#		conclusion.name = ""
#		conclusion.text = scope["consequence"]	
#		conclusion.modifier = ""
#		conclusion.truthiness = 1.0
#		conclusion.vote = 0
#
#		conclusion.save()
#
#		entailment = Entailment()
#		entailment.conclusion = conclusion
#		entailment.reason = scope['reason']
#		
#		entailment.save()
#
#		for index in xrange( 0, scope["numberPremises"] ):
#			entailment.premises.add( scope["premises"][index] )
#	except Exception as e:
#		print("ERROR")
#		transaction.savepoint_rollback(sid)
#	else:
#		transaction.savepoint_commit(sid)


class PropositionTagValidator(object):
	def __init__(self):
		self.valid_name = True
		self.valid_desc = True
		self.errors = {}
		self.name = ""
		self.desc = ""

	def validate(self, request):
		
		#if request.method == "GET":
		self.name = request.REQUEST.get("name", None)
		self.desc = request.REQUEST.get("desc", None)

		if self.name is not None:
			if len(self.name) < 1:
				self.valid_name = False
				self.errors['name'] = "Name too short."
		else:
			self.valid_name = False
			self.errors['name'] = "Name not provided"

		if self.desc is None:
			self.valid_desc = False
			self.errors['desc'] = "Description not provided."

		return (self.valid_name, self.valid_desc)			


@csrf_exempt
def proposition_tag(request, id = None):
	
	if request.method == "GET":
		
		if id is not None:

			try:
				id = int(id)
			except ValueError as ve:
				return JSONResponse('{ error: "id not valid format" }', 400)

			try:
				tag = PropositionTag.objects.get(pk = id)
			except Exception as e:
				return JSONResponse('{error: "tag not found. Exception: ' + str(e) + '"')
			else:
				json = serializers.serialize('json', [tag,], indent = 2)
				return JSONResponse(json, 200)
		
		else:
			tags = PropositionTag.objects.all()
			json = serializers.serialize('json', tags, indent = 2)
			return JSONResponse(json, 200)

	if request.method == "POST":
		if id is not None:
			# This will become an update
			
			try:
				id = int(id)
			except ValueError as ve:
				return JSONResponse('{ error: "id needs to be a number" }', 400)
			
			try:
				tag = PropositionTag.objects.get(pk = id)
			except Exception as e:
				return JSONResponse('{error: "Tag of id ' + id + ' not found. Exception: ' + str(e) + '"}')

			ptv = PropositionTagValidator()
			ptv.validate(request)
			
			if 'name' in ptv.errors:
				return JSONResponse('{error: "' + ptv.errors['name'] + '"}', 400)

			if 'desc' in ptv.errors:
				return JSONResponse('{error: "' + ptv.errors['desc'] + '"}', 400)

			try:
				sid = transaction.savepoint()
				tag.name = ptv.name
				tag.desc = ptv.desc
				tag.save()
			except Exception as e:
				transaction.savepoint_rollback(sid)
				return JSONResponse('{error: "' + str(e) + '"}')

			# 200 OK
			json = serializers.serialize('json', [tag,], indent = 2)
			return JSONResponse(json, 200)

		else:
			# Since id is none, we create new
			ptv = PropositionTagValidator()
			ptv.validate(request)
			
			if 'name' in ptv.errors:
				return JSONResponse('{error: "' + ptv.errors['name'] + '"}', 400)

			if 'desc' in ptv.errors:
				return JSONResponse('{error: "' + ptv.errors['desc'] + '"}', 400)

			try:
				print("params:", ptv.name, ptv.desc)
				new_tag = PropositionTag.objects.create(name = ptv.name, desc = ptv.desc)
			except Exception as e:
				return JSONResponse('{error: "Exception raised: ' + str(e) + "'}")
			else:
				json = serializers.serialize('json', [new_tag,], indent = 2 )
				return JSONResponse(json, 200)

	if request.method == "DELETE":
		pass
