/**
For cons.html
Set type of script: Javascript 1.7+
**/

		tacowrap.cons = {};
		
		/**
		Handles selected premises
		**/
		tacowrap.cons.Premises = {

			selected: [] // Array of ids

		}

		tacowrap.cons.Premises.getFormElements = function() {

			var i;
			var input; // Used in for loop
			var elements = []; // For holding inputs??? 

			var div = document.createElement("div");

			var numberElements = document.createElement("input");
			numberElements.setAttribute("type", "hidden");
			numberElements.setAttribute("name", "numberPremises");
			numberElements.setAttribute("value", this.selected.length);

			div.appendChild(numberElements);

			for (i = 0; i < this.selected.length; i++) {

				input = document.createElement("input");
				input.setAttribute("type", "hidden");
				input.setAttribute("name", "premise" + i);
				input.setAttribute("value", this.selected[i]);

				div.appendChild(input);

			}

			return div;

		}

		/**
		Takes a proposition, adds it to selected premises
		**/
		tacowrap.cons.Premises.add = function(prop) {

			var exists = this.exists(prop);

			if (!exists) {

				this.selected.push(prop.id);

			}

		}

		tacowrap.cons.Premises.remove = function(prop) {

			var i;
			var exists = this.exists(prop);

			if (exists) {

				for (i = 0; i < this.selected.length; i++) {
					
					if ( this.selected[i] === prop ) {

						this.selected.splice(i, 1);

					}

				} // end for

			} // end if

		}

		tacowrap.cons.Premises.exists = function(prop) {
			
			var exists = false;
			var i;

			for (i = 0; i < this.selected.length; i++) {

				if ( this.selected[i] == prop.id ) {

					exists = true;

				}
			}

			return exists;

		}

		tacowrap.cons.Proposition = function(id, text) {

			this.id = id;
			this.text = text;
			this.selected = false;

		}

		tacowrap.cons.Proposition.prototype = {

			constructor: tacowrap.cons.Proposition,

			STYLE_CLASS_NAME: 'prop',
			STYLE_HOVERED_CLASS_NAME: 'propHovered',
			STYLE_SELECTED_CLASS_NAME: 'propSelected',

			domElement: null,

			/**
			@param self: Points to proposition object
			@param evThis: The "this" when event handler called. Should be same as domElement
			@param ev: Event object
			**/
			mouseover: function(self, evThis, ev) {
				
				//evThis.style.border = "solid 1px black";
				evThis.className = self.STYLE_HOVERED_CLASS_NAME;
				this.highlightIfSelected();

			},

			mouseout: function(self, evThis, ev) {

				//evThis.style.border = "solid 1px #DDD";
				//evThis.className = self.STYLE_CLASS_NAME;
				this.highlightIfSelected();

			},

			highlightIfSelected: function () {

				if (this.selected === true) {
					this.domElement.className = this.STYLE_SELECTED_CLASS_NAME;
				}
				else {
					this.domElement.className = this.STYLE_CLASS_NAME;
				}

			},

			select: function(self, evThis, ev) {

				if (self.selected === false) {

					tacowrap.cons.Premises.add(self);
					self.selected = true;
					evThis.className = self.STYLE_SELECTED_CLASS_NAME;

					console.log(tacowrap.cons.Premises);
					
				}
				// if selected is true
				else {

					self.selected = false;
					tacowrap.cons.Premises.remove(self);
					evThis.className = self.STYLE_CLASS_NAME;

					console.log(tacowrap.cons.Premises);

				}

			},

			createHTML: function() {

				var div = document.createElement("div");
				this.domElement = div;

				div.className = this.STYLE_CLASS_NAME;
				div.setAttribute("for", this.id);
				
				div.innerHTML = this.text;
				
				var self = this;

				div.addEventListener("mouseover", function(ev) {
					self.mouseover(self, this, ev);
				}, false);	

				div.addEventListener("mouseout", function(ev) {
					self.mouseout(self, this, ev);
				}, false);

				div.addEventListener("click", function(ev) {
					self.select(self, this, ev);
				}, false);

				return div;

			}

		}
	

		/**
		When Server Ready
		Translate server variables 
		**/
		tacowrap.cons.setupModels = function(serverObj) {

			var i;

			tacowrap.cons.propositionArray = serverObj["propositions"];

			for (i = 0; i < tacowrap.cons.propositionArray.length; i++) {

				tacowrap.cons.propositionArray[i] = new tacowrap.cons.Proposition(
					tacowrap.cons.propositionArray[i].id, 
					tacowrap.cons.propositionArray[i].text);

			}

		}


		tacowrap.cons.EntailmentForm = function() {

			this.premisesDiv = null;

		}


		tacowrap.cons.setupModels(tacowrap.server);

		/**
		When DOM ready
		**/
		tacowrap.cons.ready = function() {
			
			var i;			
			var el;

			for (i = 0; i < tacowrap.cons.propositionArray.length; i++) {

				el = tacowrap.cons.propositionArray[i].createHTML();
				document.getElementById( "premises" ).appendChild( el );

			}

			$("#submitButton").on("click", function(ev) {
				$("#premises").append( tacowrap.cons.Premises.getFormElements() );
				console.log("Submit");
				$("#entailmentForm").submit();
			});
		}

		$(document).ready(tacowrap.cons.ready);

