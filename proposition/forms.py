from django import forms

class EntailmentForm(forms.Form):
	premises = forms.IntegerField()
	reason = forms.CharField()
	conclusion = forms.IntegerField()

	def clean_premises(self):
		premise = self.clean_data["premises"]
		return premise