
/**
Proposition Tag Javascript Model
model: proposition.models.PropositionTag
**/
tacowrap.prop.PropositionTag = function() {

	this.pk = -1;
	this.name = "";
	this.desc = "";

}

tacowrap.prop.PropositionTag.prototype.createUploadPayload = function() {

	var payload = {};

	payload.pk = this.pk;
	payload.name = this.name;
	payload.desc = this.desc;

	return payload;

}

tacowrap.prop.PropositionTag.prototype.copy = function(clone) {

	this.pk = clone.pk;
	this.name = clone.name;
	this.desc = clone.desc;

}

tacowrap.prop.PropositionTag.prototype.deserialize = function(data) {
	
	var p = new this.constructor();
	p.pk = data[0].pk;
	p.name = data[0].fields.name;
	p.desc = data[0].fields.desc;
	return p;

}

tacowrap.prop.PropositionTag.prototype.load = function(pk) {

	var self = this;

	$.ajaxSetup({ async: false });

	$.ajax({
		
		url: tacowrap.prop.URL + 'rest/propositiontag/' + pk,
		type: 'GET'

	}).done( function( data ) {

		console.log( data );
		self.copy( self.deserialize(data) );

	});

	$.ajaxSetup({ async: true });
}

tacowrap.prop.PropositionTag.prototype.create = function() {
	
	var self = this;

	var payload = this.createUploadPayload();

	$.ajaxSetup({ async: false });

	$.ajax({

		url: tacowrap.prop.URL + 'rest/propositiontag/',
		type: 'POST',
		data: payload

	}).done( function( data ) {

		console.log( data );

	});
	
	$.ajaxSetup({ async: true });
}

tacowrap.prop.PropositionTag.prototype.update = function() {
	
	var self = this;

	var payload = this.createUploadPayload();

	$.ajaxSetup({ async: false });

	$.ajax({

		url: tacowrap.prop.URL + 'rest/propositiontag/' + self.pk,
		type: 'POST',
		data: payload

	}).done( function( data ) {

		console.log( data );

	});
	
	$.ajaxSetup({ async: true });

}
