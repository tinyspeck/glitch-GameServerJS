var label = "Alphabet Sauce";
var version = "1352505227";
var name_single = "Alphabet Sauce";
var name_plural = "Alphabet Sauce";
var article = "an";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["alphabet_sauce"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

function destroy(){ // defined by alphabet_sauce
	this.apiDelete();

	// TODO: Remove all letters unless some sauces remain
}

function getLabel(){ // defined by alphabet_sauce
	return this.name_single + ' spelling '+this.word;
}

function onContainerChanged(oldContainer, newContainer){ // defined by alphabet_sauce
	if (newContainer){
		// letterify all players in our radius, if they don't have one
		var location = this.getLocation();
		if (!location) return;
		
		var players = location.activePlayers;
		
		for (var i in players){
			var it = players[i];
			if (it.has_letter) continue;

			var dx = it.x - this.x;
			var dy = it.y - this.y;
			var d = Math.sqrt(dx*dx+dy*dy);

			if (d <= 450){
				this.onPlayerCollision(it);
			}
		}
	}
}

function onCreate(){ // defined by alphabet_sauce
	this.apiSetPlayersCollisions(true);
	this.apiSetHitBox(450, 450);

	// Set timer for destruction
	this.apiSetTimer('destroy', 5*60*1000);
}

function onPlayerCollision(pc){ // defined by alphabet_sauce
	var weight=[1,1,1,1,1,1,1,1,1,1,2,3,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,6,7,8,8,8,8,8,8,9,9,9,9,9,9,9,9,10,11,12,12,12,13,14,14,14,14,14,14,14,14,14,15,15,15,15,15,15,15,15,15,16,17,18,18,18,18,18,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,21,21,22,23,24,25,26,27,27];

	var random = weight[randInt(0, weight.length)];
	var ran = '1';

	switch (random){
		case 0:
			break;
		case 1:
			ran = 'A';
			break;
		case 2:
			ran = 'B';
			break;
		case 3:
			ran = 'C';
			break;
		case 4:
			ran = 'D';
			break;
		case 5:
			ran = 'E';
			break;
		case 6:
			ran = 'F';
			break;
		case 7:
			ran = 'G';
			break;
		case 8:
			ran = 'H';
			break;
		case 9:
			ran = 'I';
			break;
		case 10:
			ran = 'J';
			break;
		case 11:
			ran = 'K';
			break;
		case 12:
			ran = 'L';
			break;
		case 13:
			ran = 'M';
			break;
		case 14:
			ran = 'N';
			break;
		case 15:
			ran = 'O';
			break;
		case 16:
			ran = 'P';
			break;
		case 17:
			ran = 'Q';
			break;
		case 18:
			ran = 'R';
			break;
		case 19:
			ran = 'S';
			break;
		case 20:
			ran = 'T';
			break;
		case 21:
			ran = 'U';
			break;
		case 22:
			ran = 'V';
			break;
		case 23:
			ran = 'W';
			break;
		case 24:
			ran = 'X';
			break;
		case 25:
			ran = 'Y';
			break;
		case 26:
			ran = 'Z';
			break;
		case 27:
			ran = 'heart';
			break;
	}

	if (pc.has_letter) pc.announce_remove_indicator('letter'+pc.letter);

	pc.announce_add_indicator('letter'+ ran, 'letter_'+ran+'_overlay', false, '1', {width: 42, height: 60});
	pc.letter = ran;
	pc.has_letter = true;
}

function onPlayerExit(pc){ // defined by alphabet_sauce
	if (pc.has_letter){
		pc.announce_remove_indicator('letter'+pc.letter);
		delete pc.letter;
		delete pc.has_letter;
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-100,"y":-128,"w":200,"h":128},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEiElEQVR42u2UfUwbZRzH2YApYWEz\nJDNu7o1FTUw0EqfGP9ww+1M0YQozzsn0D8KYDudM3IbYGDYFxotBXsaatkJhZSdQKFDW0vZoS4+3\n6xuUAyqlwBHaQl\/ueq8UzHn48q9\/QTGxn+Sbuyf3PPd8831+zy8uLkaMGDFixIjxb+S9GpdYW3Hj\nuKj61pv1JYUvNAjyD\/2nDP4s+Pywo\/9MyaLhLRBDsq0aZXsu6JYcBLgX93Fc3J5dNcdx3B6J9OZr\nvxnPPqLsJ1wRW9qcqqdJoHFpnq9bzdifDcTF73qC7eo7p2dGsqRz0Jkh1nIS0WvlX3bBwEvVhrxn\nLt27lMxP2b0UG4qKjgDA9ayux+W3tYOSGqNOVaBW979X2aK8kF9tKiuqhbIUCvjYrphTtihTOurv\nvoPKs+B5dQGsG226rZ1UnmpSNqV\/VT9Yn1tm1lRLbMVm8+K7IAgmRL32BhTGYxbxFyX+3veRBdUn\ndt3ogxrQKX\/l0VDT28UiXevVSkjX2DxSMayfyoEgNCnqCXbJVEetXVXX0f7PLG4wf9KISOtAjzBD\ngTzIFHb1iBV1InBCWNM3pjMVjE4vp0bdoMPh2Gc0arO0tg55n7XNIJ+Uyjud4muPV+\/l9BuE5fZa\ngdpeWtg20N56BZy2ntiNFrNvdEl9ugFu7r5sLKevGStWu2c6O8A18dcaa93dsfILwNj358VD+oe5\nJsR0POoGUZRLGnL1n5daZYMFQz+RJfB9vH0KAKE1WYUJlZQap1sq9WZR0fDUwxzVXPOh3UjwSbOn\nL6fb2WX4blyIVdtEPt2iQjOOyRvHg7IqOCQrHgu05kF4Q+ZA8JsDUTc4zWlSbcSvHw57VT2jK8YJ\nyKO2QquKdnO4U2wl5CIL2VFhwdtumILCjzuXb0X\/kowxojSE6LmKELqOOWpEiRAGlT3cL7XhfYCd\n6OuYIPokdqL7xzFCWqgiBNE\/4nGqKX2W0QrmKEjjpiyGBcoKu2mLHgmDKoQCB2YoY6+TGpQ4KfC+\nek1wOCqmBAJu7z+N2oYrMpcYa\/MibYeXmBmbm7FPzNEjQ7xG5mkYXqYd4x7WaXDRphYHBb0OoGiS\ngG9NW2u38yb8+bMqCEra2qDZ603umUWPYCx7yscuiMhNfMEf9hJ+yhfw0O7lJRaZWKDtU25qYtbL\nzM8HIytOP4s6Auu+O1Qkks4wzEne4N4dSQ8AuPi\/0ztA0vRHBBvSsxu0h1ongziJYQHcHw6z2Bq5\nEUJxNuClIoSPiRAech1zMetk2+8cV7zJcRf59U\/zStyp1vIUr5c3N7krFMPIeOkikcg4SZKzGIat\nBINB1O\/3u3i5KYpC+MRM\/HeAf\/+BWV\/\/NhQKfUowGxksxz0XoOln5e7Qwe02mEDT3FGG4875sHA+\nQVCCcDhcxhspZlm2xufz9S6hqMXj8QyGcPwX3njpxsbGTX5OPkHTH3hCxFkvw6Qth7lUZSCQUudw\n7G+E4UTBdh57NgDEAxwXv1Xs3F\/PZF5P8EohCOKcPxS67MfxN\/hxqnER20o8YcfqLkaMGDH+B\/wB\n+OMT4ZGKEa4AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/alphabet_sauce-1352315354.swf",
	admin_props	: false,
	obey_physics	: true,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 0;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("alphabet_sauce.js LOADED");

// generated ok 2012-11-09 15:53:47 by mygrant
