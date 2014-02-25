

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

