from django.db import models

class Definition(models.Model):
	"""
	Definitions to use in arguments
	"""
	name = models.CharField(max_length = 1024)
	desc = models.TextField()

	vote = models.IntegerField(default = 0)


class PropositionTag(models.Model):
	name = models.CharField(max_length = 512)
	desc = models.TextField()


class EntailmentTag(models.Model):
	name = models.CharField(max_length = 512)
	desc = models.TextField()


class PropositionManager(models.Manager):
	def get_premises(self):
		inner_qs = Entailment.objects.all().values('conclusion')
		qs = Proposition.objects.exclude(pk__in = inner_qs)
		return qs


class Domain(models.Model):
	"""Domains of discussion. ie. Biology vs Stuff"""
	name = models.CharField(max_length = 512)
	desc = models.TextField()


class Proposition(models.Model):
	"""
	Random statement that is either true or not
	"""
	objects = PropositionManager()

	creation_date = models.DateTimeField()

	name = models.CharField(max_length = 1024)
	text = models.CharField(max_length = 2048)

	# Statistical? Conjecture? Assumption?
	# FrontierFlag
	frontier = models.BooleanField()

	domain = models.ForeignKey("Domain")
	
	truthiness = models.FloatField()

	# Popular vote
	vote = models.IntegerField()

	tags = models.ManyToManyField("PropositionTag")
	discussions = models.ManyToManyField("Discussion")

	rest_fields = ["creation_date", "name", "text", "frontier", "tags", "domain", "truthiness", "vote", "discussions"]


class Discussion(models.Model):
	"""
	AKA Explanation, Comment
	A random comment added to a proposition explaining its 'truthiness'
	"""
	text 				= models.TextField()
	truth_judgement		= models.FloatField()

class Property(models.Model):
	"""A priori property"""
	name = models.CharField(max_length = 256)
	text = models.TextField()

	discussions = models.ManyToManyField("Discussion")


class Entailment(models.Model):
	"""
	AKA Argument, Thought, Consequence, Entailment
	Logical consequence given some input proposition.
	"""
	creation_date = models.DateTimeField()

	reason 		= 	models.TextField()
	premises    = 	models.ManyToManyField(Proposition, related_name = 'premises')
	conclusion  = 	models.ForeignKey(Proposition, related_name = 'conclusion')

	domain = models.ForeignKey("Domain")
	
	tags = models.ManyToManyField("EntailmentTag")
	discussions = models.ManyToManyField("Discussion")


class ArgumentPoint(models.Model):
	entailment = models.ForeignKey(Entailment)
	order = models.IntegerField()


class Argument(models.Model):
	models.ManyToManyField(ArgumentPoint)