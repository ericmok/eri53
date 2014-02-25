
tacowrap.prop.Entailment = function() {
	
	// Text
	this.reason = ""; 			// uploadable

	// List of PKs
	this.premises = [];			// uploadable

	// Either a PK or text
	this.conclusion = null;		// uploadable	

	// Datetime
	this.creationDate = "";

}

tacowrap.prop.Entailment.prototype.reset = function() {

	this.pk = -1;
	this.reason = "";
	this.premises = [];
	this.conclusion = null;
	this.createDate = "";

}

tacowrap.prop.Entailment.prototype.collection = {

	all: function() {

		$.ajaxSetup({async: false});

		$.ajax({
			url: tacowrap.prop.URL + 'rest/prop/',
			type: 'GET'
		}).done(function(data) {
			console.log(data);
			return data;
		});

		$.ajaxSetup({async: true});

	},

	deserializeMultiple: function(data) {

		var ret = [];

		for (var i = 0; i < data.length; i++) {
			
			var e = new tacowrap.prop.Entailment();
			e.pk 			= data[i].pk;
			e.reason 		= data[i].fields.reason;
			e.premises 		= data[i].fields.premises;
			//e.premises = [];
			//for (var j = 0; j < data[i].fields.premises.length; j++) {
			//	 var p = new tacowrap.prop.Proposition();
			//	 p.load(data[i].fields.premises[j]);
			//	 ret.premises.push(p);
			//}

			e.conclusion 	= data[i].fields.conclusion;
			e.creationDate 	= new Date( data[i].fields.creation_date );

			ret.push(e);

		}		

		return ret;

	},

	havingConclusion: function(conclusionPK) {

		var self = this;
		var ret = null;

	    $.ajaxSetup({ async: false  });

		$.ajax( {
			
			url: tacowrap.prop.URL + "rest/entailment/?conclusion=" + conclusionPK,
			type: "GET"

		} ).done( function( data ) {
			
			data = self.deserializeMultiple( data );
			console.log("Finished Loading:");
			console.log(data);

			ret = data;
			//return data;

		} );

	    $.ajaxSetup({ async: true });

	    return ret;
	},

	getEntailmentsContainingPremises: function(listOfPKs) {

		var i;
		var semaphore = false;
		var ret;

		var payload = "numberPremises=" + new String ( listOfPKs.length ) + "&";

		for (i = 0; i < listOfPKs.length; i++) {
			if ( (listOfPKs[i]).constructor !== Number ) {
				listOfPKs[i] = listOfPKs[i].pk;
			}

			payload += "premise" + i + "=" + listOfPKs[i] + "&"
		}

	    $.ajaxSetup({ async: false });

		$.ajax({

			url: tacowrap.prop.URL + "rest/entailment/?containingpremises=1&" + payload,
			dataType: "json",
			async: false,
			type: "GET",

			success: function( data ) {

				console.log("Return data:");
				console.log(data);
				ret = data;
				return ret;

			}

		});

	    $.ajaxSetup({ async: true });

	}

}

tacowrap.prop.Entailment.collection = tacowrap.prop.Entailment.prototype.collection;


tacowrap.prop.Entailment.prototype.deserialize = function(data, index) {

	if (!index) {
		index = 0;
	}
	
	if (data.length) {
	
		var e = new this.constructor();

		e.pk = data[index].pk;
		e.reason = data[index].fields.reason;
		e.premises = data[index].fields.premises;
		e.conclusion = data[index].fields.conclusion;
		e.creationDate = new Date( data[index].fields.creation_date ); // Server output datetime standard
		
		return e;

	}
	else {

		return null;
		
	}
}

tacowrap.prop.Entailment.deserialize = tacowrap.prop.Entailment.prototype.deserialize;


/**
Rather shallow copy. Used for copying deserializations.
**/
tacowrap.prop.Entailment.prototype.copy = function(other) {

 	if (other != null ) {

 		this.pk = other.pk;
		this.reason = other.reason;
		this.premises = other.premises.slice(0);
		this.conclusion = other.conclusion;
		this.creationDate = other.createDate;
 	}

}

tacowrap.prop.Entailment.prototype.load = function(pk) {
	
	var self = this;

	$.ajax( {
		
		url: tacowrap.prop.URL + "rest/entailment/" + pk,
		type: "GET",
		async: false,
		dataType: "json",
		success: function(data) {

			//this.reason 		= data[0].fields.reason;
			//this.premises 		= data[0].fields.premises;
			//this.conclusions 	= data[0].fields.conclusions;
			//this.creationDate 	= new Date( data[0].fields.creation_date );
			//console.log("Finished Loading:");
			console.log(data);

			self.copy( self.deserialize(data) );

		}

	} );

	return this;

}


tacowrap.prop.Entailment.prototype.createUploadPayload = function() {

	var self = this;
	var payload = {};
	var i;

	payload.numberPremises = this.premises.length;

	for (i = 0; i < this.premises.length; i++) {

		payload["premise" + i] = this.premises[i];

	} // end for

	payload.reason = this.reason;
	payload.conclusion = this.conclusion;

	return payload;

}


tacowrap.prop.Entailment.prototype.create = function() {

	var self = this;
	
	var payload = this.createUploadPayload();

    $.ajaxSetup({
        async: false
    });

	$.ajax( {

		url: tacowrap.prop.URL + "rest/entailment/",
		type: "POST",
		data: payload

	} ).done( function( data ) {

		self.copy(  self.deserialize( data )  );
		
	} );

    $.ajaxSetup({
        async: true
    });
}

/**
Returns true or false depending on success
**/
tacowrap.prop.Entailment.prototype.update = function() {

	var self = this;
	
	var payload = this.createUploadPayload();
	payload.pk = this.pk;

    $.ajaxSetup({async: false});

	$.ajax( {

		url: tacowrap.prop.URL + "rest/entailment/" + self.pk,
		type: "POST",
		data: payload

	} ).done( function( data ) {

		console.log("Update: ");
		console.log(data);
		self.copy( self.deserialize(data) );

	} );

    $.ajaxSetup({async: true});
}
