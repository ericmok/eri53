
/* 
 * Compiled 09/249/2013 06:58PM EST 
 * Author: Eric Mok
 */
            
tacowrap.prop = {}

tacowrap.prop.URL = "http://eri5.com/proposition/";

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



tacowrap.prop.PropositionWidget = function() {

	this.selected = [];	
	this.SELECTION_LIMIT = 1000;
	this.propositions = []; // List of propositions
	this.domElement = null;
	this.CLASS_NORMAL = "prop";
	this.CLASS_HOVERED = "propHovered";
	this.CLASS_SELECTED = "propSelected";
	this.idNameSpace = "widget" + (  Math.floor( Math.random() * 100000 )  );
	this.widgetId = this.idNameSpace;

}

tacowrap.prop.PropositionWidget.prototype.idNameSpaces = [];

tacowrap.prop.PropositionWidget.prototype.getNewIdNameSpace = function () {

	var i;
	var ret = "widget" + (  Math.floor( Math.random() * 100000 )  );
	var exists = false;

	while ( exists ) {

		for (i = 0; i < this.idNameSpaces.length; i++) {

			if ( ret == this.idNameSpaces[i] ) {

				exists = true;
				ret = "widget" + (  Math.floor( Math.random() * 100 )  );
				i = 0;

			}

		}

	}

	return ret;

}

tacowrap.prop.PropositionWidget.prototype.getDomElement = function() {
	return this.domElement;
}

tacowrap.prop.PropositionWidget.prototype.generateHTML = function() {

	var self = this;
	var i;	
	var $div;
	var $prop;
	var $text;
	var id;

	$div =  $("<div id='" + this.idNameSpace + "'></div>");

	for (i = 0; i < this.propositions.length; i++) {

		id = this.idNameSpace + "Prop" + this.propositions[i].pk;

		$prop = $("<div id='" + id + "'></div>");
		$prop.attr("pk", this.propositions[i].pk);
		$prop.attr("index", i);
		$prop.addClass( this.CLASS_NORMAL );

		$prop.on("mouseover", function(ev) {

			$(this).addClass( self.CLASS_HOVERED ).removeClass( self.CLASS_NORMAL );

		}).on("mouseout", function(ev) {

			$(this).addClass( self.CLASS_NORMAL ).removeClass( self.CLASS_HOVERED );

		}).on("click", function(ev) {

			var closureThis = $(this);
			(function(closureThis) {

				var index = closureThis.attr("index");
				var prop = self.propositions[ index ];

				if (  self.isSelected( prop )  ) {

					closureThis.removeClass( self.CLASS_SELECTED );
					self.deSelect( prop );
					console.log( self.selected );

				} 
				else {

					if (  self.select( self.propositions[ index ] )  ) {
						closureThis.addClass( self.CLASS_SELECTED );
					}
					console.log( self.selected );

				}

			})(closureThis);

		});

		$text = $("<span>" + this.propositions[i].text + "</span>");
		$prop.append($text);

		$link = $("<span id='propLink> Axiom | Hypothesis | Conjecture | Observation </span>");
		$link.hide();
		$prop.append($link);

		$div.append($prop);
	}

	this.domElement = $div;
	return $div;

}

tacowrap.prop.PropositionWidget.prototype.populate = function(callback) {
	
	var self = this;
	var i;
	var temp;

	$.ajax({

		url: "http://localhost:8000/proposition/rest/prop"
		
	}).done(function(data) {
		
		for (i = 0; i < data.length; i++) {

			temp = new tacowrap.prop.Proposition();
			temp.pk = data[i].pk;
			temp.name = data[i].fields.name;
			temp.text = data[i].fields.text;
			temp.modifier = data[i].fields.modifier;
			temp.truthiness = data[i].fields.truthiness;
			temp.vote = data[i].fields.vote;
			self.propositions.push(temp);

		}	

		console.log( self.idNameSpace + " Finished Loading Propositions: " );
		console.log( self.propositions );
		self.domElement = self.generateHTML();
		callback();

	});

}

/**
Takes a proposition, adds it to selected premises
@returns: Whether selecting of proposition was successful. 
**/
tacowrap.prop.PropositionWidget.prototype.select = function(prop) {
	
	var isSelected;

	// Is there space?
	if ( this.selected.length < this.SELECTION_LIMIT ) {

		 isSelected = this.isSelected(prop);

		if (!isSelected) {

			this.selected.push(prop);

			return true;

		}

	}

	return false;

}

tacowrap.prop.PropositionWidget.prototype.deSelect = function(prop) {

	var i;
	var isSelected = this.isSelected(prop);

	if (isSelected) {

		for (i = 0; i < this.selected.length; i++) {
			
			if ( this.selected[i] == prop ) {

				this.selected.splice(i, 1);

			}

		} // end for

	} // end if

}

tacowrap.prop.PropositionWidget.prototype.isSelected = function(prop) {
	
	var isSelected = false;
	var i;

	for (i = 0; i < this.selected.length; i++) {

		if ( this.selected[i] == prop ) {

			isSelected = true;

		}

	}

	return isSelected;

}



tacowrap.prop.HTML = {

	element: function(htmlTag, kwargs) {

		var element = document.createElement(htmlTag);

		for ( prop in kwargs ) {

			if ( kwargs.hasOwnProperty(prop) ) {

				element.setAttribute( prop, kwargs[prop] )

			}

		}

		return element;

	}

}

tacowrap.prop.PropositionMakerWidget = function() {
	this.name = "";
	this.text = "";
	this.domElement;
	this.idNameSpace = "makerWidget" + Math.floor( Math.random() * 100000 );
}

tacowrap.prop.PropositionMakerWidget.prototype.getForm = function() {
	
	var $div = $("<div></div>");
	var $input = $("<input type='text' />");

	$div.append($input);
	return $div;

}


tacowrap.prop.PropositionExplorer = function(elementId) {

	this.$parentElement = $("#"+elementId);
	this.previousSet = [];
	this.currentSet = [];
	this.entailmentObject = new tacowrap.prop.Entailment();
	this.domElement;
	this.id = "explorer" + Math.floor( 10000000 * Math.random() );

	this.styleClass = "propositionExplorer";

}

tacowrap.prop.PropositionExplorer.prototype.initialize = function() {

	var p = new tacowrap.prop.Proposition();
	this.currentSet =  p.getPremises();

}

/**
Changes the currentSet. Finds conclusions using the proposition as a premise.
**/
tacowrap.prop.PropositionExplorer.prototype.explore = function (propPK) {

	var i;
	var e = new tacowrap.prop.Entailment();
	var openSet = e.getEntailmentsContainingPremises( [propPK] );
	var openSetPropositions = [];
	var prop;

	console.log("PROP:");
	console.log(propPK);
	console.log("Open set: ");
	console.log(openSet);
	
	this.previousSet = this.currentSet;
	//this.currentSet = openSet;

	for (i = 0; i < openSet.length; i++) {

		prop = new tacowrap.prop.Proposition();
		console.log("Loading conclusion: " +  openSet[i].fields.conclusion );
		prop.load( openSet[i].fields.conclusion );
		openSetPropositions.push( prop );

	}
	
	console.log("Current set = Open set propositions: ");
	console.log(openSetPropositions);

	this.currentSet = openSetPropositions.slice(0);

	console.log("Explore ending");
}

tacowrap.prop.PropositionExplorer.prototype.goBack = function() {

	var temp;
	this.currentSet = this.previousSet;

	temp = this.currentSet;
	this.previousSet = temp;

}

tacowrap.prop.PropositionExplorer.prototype.handleClick = function(ev, self) {

	var evThis = this;

	var targ = ev.target;
	var id;

	if (ev.target.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;

	console.log("click: " + targ.getAttribute("pk")); 
	//console.log("explore: currentSet[" + el.index + "]"); 
	//console.log(self.currentSet[el.index]); console.log( evThis ); console.log( targ.getAttribute("index") ); 
	
	//id = targ.getAttribute("id");

	var toExplore = self.currentSet[ targ.getAttribute("index") ];
	self.explore( toExplore.pk );

	self.generateElement();
	self.updateDOM();
}

tacowrap.prop.PropositionExplorer.prototype.generateElement = function() {

	var self = this;
	var div = $("<div id='" + this.id + "explorer" + "' class='" + this.styleClass + "'></div>");
	var prop;
	var i;
	var id;
	var conc;

	//this.$parentElement.remove(this.domElement);
	this.domElement = null;

	/**
	Generate HTML for each proposition in currentSet and add it to div
	**/
	for (i = 0; i < self.currentSet.length; i++) {
		
		(function(i) {
			
			var propDiv = $("<div style='margin: 10px;'>P</div>");
			var id = self.id + "prop" + self.currentSet[i].pk;
			var propPK = self.currentSet[i].pk;

			//propDiv.attr("propEx", self);	
			propDiv.attr("propId", id);
			propDiv.attr("index", i);
			propDiv.attr("pk", propPK);
			propDiv.html( 
				"<span style='color: #BBB'>" + moment(self.currentSet[i].creationDate).calendar() + " " + "</span>" + 
				"<br/>" + 
				self.currentSet[i].text);

			propDiv.on("click", function(ev) {
				self.handleClick(ev, self);
			});

			div.append( propDiv );

		})(i);


	}

	this.domElement = div;
	//this.$parentElement.append(this.domElement); 
	//this.$parentElement.append("TEST");
	this.updateDOM();

	return div;

}

tacowrap.prop.PropositionExplorer.prototype.updateDOM = function() {
	this.$parentElement.children().replaceWith( this.domElement );
	//this.domElement.parentNode.removeChild(this.domElement);
}


tacowrap.prop.ConclusionView = function() {
	this.entailments = [];
	this.premises = [];
	this.conclusion = new tacowrap.prop.Proposition();
	this.reason = "";
	this.truthiness = 1.0;

}

tacowrap.prop.ConclusionView.prototype.load = function(pk) {
	
	this.conclusion = new tacowrap.prop.Proposition();
	this.conclusion.load(pk);

	var entailments = new tacowrap.prop.Entailment();
	var es = entailments.collection.havingConclusion(pk);
	this.entailments = es;

	var i;

	for ( i = 0; i < es.length; i++ ) {
		this.premises[i] = [];
	}

	for ( i = 0; i < es.length; i++ ) {
		for (var j = 0; j < es[i].premises.length; j++) {
			var a = (new tacowrap.prop.Proposition()).load( es[i].premises[j] );
			this.premises[i][j] = a;
			console.log(a);
		}
	}


}



