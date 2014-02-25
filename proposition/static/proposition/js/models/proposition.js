
/**
Javascript Model 
Django Model: proposition.models.Proposition
**/
tacowrap.prop.Proposition = function() {
	
	this.pk = -1;			
	this.name = "";			// uploadable
	this.text = "";			// uploadable

	this.domain = 1;		// uploadable
	
	this.truthiness = 1.0;	// NOT uploadable
	this.frontier = true;
	this.vote = 0;
	this.creationDate = "";

	this.tags = [];
	this.discussions = [];

}

tacowrap.prop.Proposition.prototype.collection = {
	
	deserializeMultiple: function(jsonData) {
		
		var ret = [];
		for (i = 0; i < jsonData.length; i++) {
			ret[i] = new tacowrap.prop.Proposition();
			ret[i].pk = jsonData[i].pk;
			ret[i].name = jsonData[i].fields.name;
			ret[i].text = jsonData[i].fields.text;
			ret[i].frontier = jsonData[i].fields.frontier;
			ret[i].domain = jsonData[i].fields.domain;
			ret[i].truthiness = jsonData[i].fields.truthiness;
			ret[i].vote = jsonData[i].fields.vote;
			ret[i].creationDate = new Date( jsonData[i].fields.creation_date );
			ret[i].tags = jsonData[i].fields.tags;
			ret[i].discussions = jsonData[i].fields.discussions;
		}
		return ret;
		
	},
	all: function() {
		//console.log("ARRGH! this feature not available: implementation problems.");
		//TODO: :(((((((((((((((((
	
//		$.ajaxSetup({async: false});
//		
//		$.ajax({
//			url: tacowrap.prop.URL + 'rest/prop/',
//			type: 'GET'
//		}).done(function(data){ 
//			console.log(data);
//			return data;
//		});
//
//		$.ajaxSetup({async: true});
		
//		var self = this;
//		var ret = null;
//		var req = new XMLHttpRequest();
//		req.open("GET", tacowrap.prop.URL + 'rest/prop/', false);
//		req.onload = function(event) {
//			ret = this.responseText;
//			ret = self.deserializeMultiple( $.parseJSON(ret) );
//			return ret;
//		}
//		req.send(null);
		var self = this;
		
		return $.getJSON(tacowrap.prop.URL + 'rest/prop').done(function(data) {
			var jsonData = self.deserializeMultiple(data);
			console.log(jsonData);
			console.log("Promise returned: Use deserializeMultiple to parse jsonData");
		});
		
	},
	
	premises: function() {
		//console.log("ARRGH! this feature not available: implementation problems.");
//		var data = $.parseJSON( 
//				$.ajax({
//					url: tacowrap.prop.URL + "rest/entailment/?onlypremises=1",
//					dataType: "json",
//					async: false
//				}).responseText
//		);
//		
//		var i;
//		var prop;
//		var ret = [];
//		for (i = 0; i < data.length; i++) {
//			ret[i] = new tacowrap.prop.Proposition();
//			ret[i].pk = data[i].pk;
//			ret[i].name = data[i].fields.name;
//			ret[i].text = data[i].fields.text;
//			ret[i].frontier = data[i].fields.frontier;
//			ret[i].domain = data[i].fields.domain;
//			ret[i].truthiness = data[i].fields.truthiness;
//			ret[i].vote = data[i].fields.vote;
//			ret[i].creationDate = new Date( data[i].fields.creation_date );
//			ret[i].tags = data[i].fields.tags;
//			ret[i].discussions = data[i].fields.discussions;
//		}
//		return ret;
		
		//return tacowrap.prop.Proposition.prototype.collection.deserializeMultiple(data);
		var self = this;
		
		return $.getJSON(tacowrap.prop.URL + 'rest/entailment/?onlypremises=1').done(function(data) {
			var jsonData = self.deserializeMultiple(data);
			console.log(jsonData);
			console.log("Promise returned: Use deserializeMultiple to parse jsonData");
		});
	}
	
}

// Each instance has a pointer to prototype method - which is constructed only once!
tacowrap.prop.Proposition.collection = tacowrap.prop.Proposition.prototype.collection;

tacowrap.prop.Proposition.prototype.createUploadPayload = function(name, text , domain, truthiness) {

	var payload = {};
	payload.name = (typeof name === 'undefined') ? this.name : name;
	payload.text = (typeof text === 'undefined') ? this.text : text;
	payload.domain = (typeof domain === 'undefined') ? this.domain : domain;
	
	// truthiness is no longer uploadable by user
	// payload.truthiness = (typeof truthiness === 'undefined') ? this.truthiness : truthiness;	

	return payload;

}

tacowrap.prop.Proposition.prototype.copy = function(other) {
	this.pk = other.pk;
	this.name = other.name;
	this.text = other.text;
	this.frontier = other.frontier;
	this.domain = other.domain;
	this.truthiness = other.truthiness;
	this.vote = other.vote;
	this.creationDate = other.creationDate;
	this.tags = [];
	for (var i = 0; i < other.tags.length; i++) {
		this.tags[i] = other.tags[i];
	}
	this.discussions = [];
	for (i = 0; i < other.discussions.length; i++) {
		this.discussions[i] = other.discussions[i];
	}
}

tacowrap.prop.Proposition.deserialize = function(json) {
	if (json.length) {
		var p = new this.constructor();

		p.pk = json[0].pk;
		p.name = json[0].fields["name"];
		p.text = json[0].fields["text"];
		p.frontier = json[0].fields["frontier"];
		p.domain = json[0].fields["domain"];
		p.truthiness = json[0].fields["truthiness"];
		p.vote = json[0].fields["vote"];
		p.creationDate = json[0].fields["creation_date"];
		p.tags = json[0].fields["tags"];
		p.discussions = json[0].fields["discussions"];

		return p;
	}
	else {
		console.log("Deserialization failed.")
		return null;
	}
}

tacowrap.prop.Proposition.prototype.deserialize = tacowrap.prop.Proposition.deserialize;

tacowrap.prop.Proposition.prototype.load = function(id) {
	
	var self = this;
	var ret;
	var p;

    $.ajaxSetup({ async: false });

	var response = $.ajax({

		async: false,
		url: tacowrap.prop.URL + "rest/prop/" + id,
		success: function (data) {

			if ( data.length < 1 ) {

				ret = null;
				console.log("Proposition " + id + " not found.");

			}
			else {

				console.log(data);

				p = self.deserialize(data);
				ret = p;
				self.copy( p );

			}
			
			ret = p;
		
		}

	});


    $.ajaxSetup({ async: true });

    return ret;
}

tacowrap.prop.Proposition.prototype.create = function() {

	var self = this;
	var payload = this.createUploadPayload();

	$.ajax({
		type: "POST",
		url: tacowrap.prop.URL + "rest/prop/",
		data: payload
		//data: { 
		//	name: self.name,
		//	text: self.text,
		//	//modifier: self.modifier,
		//	frontier: self.frontier,
		//	domain: self.domain,
		//	truthiness: self.truthiness,
		//	vote: self.vote
		//}
	}).done(function ( data ) {
		
		console.log( data );
		self.copy( self.constructor.prototype.deserialize(data) );

	});	

}

tacowrap.prop.Proposition.prototype.update = function() {

	var self = this;
	var payload = this.createUploadPayload();

	$.ajax({
		type: "POST",
		url: tacowrap.prop.URL + "rest/prop/" + self.pk + "/",
		data: payload
	}).done(function ( data ) {

		console.log( data );
		self.copy( self.constructor.prototype.deserialize(data) );

	});

	/*
	{ 
			//pk: self.pk,
			name: self.name,
			text: self.text,
			frontier: self.frontier,
			domain: self.domain,
			truthiness: self.truthiness,
			vote: self.vote
		}
	*/

}


tacowrap.prop.Proposition.prototype.getPremises = function () {
	
	var ret = [];

    $.ajaxSetup({
        async: false
    });

	$.ajax({
		url: tacowrap.prop.URL + "rest/entailment/?onlypremises=1",
		dataType: "json"
	}).done(function (data) {
		var i;
		for (i = 0; i < data.length; i++) {
			ret[i] = new tacowrap.prop.Proposition();
			ret[i].pk = data[i].pk;
			ret[i].name = data[i].fields.name;
			ret[i].text = data[i].fields.text;
			//ret[i].modifier = data[i].fields.modifier;
			ret[i].frontier = data[i].fields.frontier;
			ret[i].domain = data[i].fields.domain;
			ret[i].truthiness = data[i].fields.truthiness;
			ret[i].vote = data[i].fields.vote;
			ret[i].creationDate = new Date( data[i].fields.creation_date );
			ret[i].tags = data[i].fields.tags;
			ret[i].discussions = data[i].fields.discussions;
		}
	});

    $.ajaxSetup({
        async: true
    });

	return ret;

}
