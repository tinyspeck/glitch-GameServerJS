//#include include/takeable.js

var label = "Spriggase";
var version = "1347907577";
var name_single = "Spriggase";
var name_plural = "Spriggase";
var article = "a";
var description = "A compound made out of red, green and blue.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 500;
var base_cost = 9.2;
var input_for = [169,236];
var parent_classes = ["spriggase", "compound_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

// global block from compound_base
this.is_compound = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_alchemistry_kit", 1))) out.push([2, "Compounds are much easier to manage if you have an <a href=\"\/items\/497\/\" glitch=\"item|bag_alchemistry_kit\">Alchemistry Kit<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	if (pc && !pc.skills_has("alchemy_1")) out.push([2, "You need to learn <a href=\"\/skills\/51\/\" glitch=\"skill|alchemy_1\">Alchemy I<\/a> to use a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	return out;
}

var tags = [
	"alchemy",
	"compound"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-19,"w":21,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKIklEQVR42u1XCXAT1xneFJpCCbUs\nyZIsyZZ8gg9dlixZNkSQNgcJrUjaTjqTdtROIemkpQoNoZxRwmmDjcIZXGxkMAlXsFIKSTnKkhCu\nBFjAXDHHhsMGB+PlCkeg8\/f\/n5BvMhhnMp1Od+aN5d23733\/8X3fW477\/3Xvy7le4xu0Tx8ecjSB\nH7hT6\/2vApdUqbL026KF544lgu9CEiBQyb4xNqZLi6rKb1n0y24Hk1aDoasAjYvi\/LkfxsPjn+nh\nmQMJ4PlEB6YqpeeeL8SWQow2dCOQsPxO2FgFrSb2GHfW13tyPa8ISqAuvQb6yq8lnNOlkihmKXzp\nS1Vg+4cGHB\/EQ\/ZqtXjPyT3GIIBJ9aK8pBFU86+CtuImJCy\/HWrK1EvH4OFRZ+CRN89D7IyLEDfv\nCmAwoCq\/EXhQgLIZMq+8RB7ULVDyugUKUT1X8Q0Bv3gMuo88DT8cXwc\/mvIlyDFTvaY1ADdNCnDD\njnm4PxwH7rWz0P21M2xOj3G10H38OeAmNYQ7C6z\/x1rv0\/v1Acc6tRDtOQKrniP3Dzqg99wTIPfX\nWuBw0+6vnoKHRpwCLvAlcDMui1ygXuBePgHcOARUdAnY3L+cjjwvudqpDNrWqIUn9ujhhVoj\/Oq0\nAR7bpQvS\/dx\/qv1P70+AX58zws+PJ4oDPtH5OgY4HQGMOgvcaPw9tRG4Wdd4bsQpnvvTSeAm1AM3\n8ypwfxYjYAsl4Obd9N8vOM18pcfyvgZ+vFPHmDvk80QYsE0HyaWxMfZ18dKTCPyXogGGHE2ERz\/S\nSm0A1ohNAGlzyg6BWXTHx714IoYb\/kXobkYxgFoqLXBvXZW4crDcL0DlTJmHSEHMfXSrFh79WAs5\nazVi\/FyZIWulGtybtDBwuw48W3VgX6uBNgARxJi6IAP45gXsvUaRm3870g+FEIP3BW7KRYk9j5YW\nWd9pmZotF1IWqyBzhRoycOhLlazEurcVfJ93VWBarYasVWpIrogLtX87AgT7TAq0uSdg7wXZ78mN\nBq6oUeyKvMimy\/yKmQpQzEQWz5CHZMVyv2y63K+cKRfUs5WCepbcH1t4L8EuutS8efENAwNGf1tc\n3Usu88kroUuKT8AYWCx7bLGCJ0CyYoWP\/v\/GFx8uviRoF98KKBbd9HLTrzZPfrXO0PP1835Z0QWB\naWDFDQE10tJZYO5N8eFn9ut5lBnBHNaEWAYRVMoSlYgsFp8\/ZYDBB\/V8O8vrNvwkT\/oWU9gAcXNJ\nhK9L+pUt3GRYTeh7yN6eqH8x0y6Acs5l0C66LiWsun83yVyhCvT\/SMvY+7vGJHiuJpHIEkhaKjMg\ncPjpoQT4zXkjY3EBHx9sfpOEGGWm2ytftAaATpH43h3fXYACyg08hBKErsPEvNfEevjBlAbpfgGm\nLY3jXRvigXTwZ4cT4Km9esjboOETFyoDtjUaGIiS85Sgh8d2MBbzLTUwwHRu7Dnohm7Sc2wt9MbN\nH5l6AXoWXRSbdBKdhGnj+PPA\/fFkRDcnN\/D3C1CPlkYMda6Ph4LNWiCw2e+peSSML2VxHFjCGrCv\n04AVtTK1UtXCAIbV8Nwr6BxvoLzMQBa\/dNcpJiCQQmTsmHM+dm90XUQn0e4Y2Ik4v+RK8L7ZWyjz\nIkjaHEhS0vBvwoKI\/6InB3RvKyFxYRxJTxt3ovLRhlMuRgSYbI6yNE0iACEU5wA38nSQ3Su5EgH6\nBmphMf4u\/drXGZL0KpRZCAwOsa2URJgs78CZSKRH14rMZ0mEyUmolLO\/aq3mE+st6C4S93o9eTLP\nzUdwnZQbxzpN4Cef6nkc0uBqfdNBw1Sl9pLtPYvE+YVokB7f2\/bQMIE2vyKxLE1ulNDGwlzZndbZ\nKbxm4aZLfq648YEOq6lLlJ68jfEwuDoBftuQxHx3wDYtk5nMlaowkYPuvVBnhCcFfQfkK5S83FSp\n45IxR7ns74o4G0PKAJEAswfeI4nsFN2P14K8WAF9l6mYFz+xWw+DkMnk050DQX1Y2DX3oPMeAaHD\nAgEj7UPmihGGK6RMPDBQAHS6Nlep2mdQ9rcbHlXFTdG46t\/N3xwEqgO7e6ALSRA\/VymQpERYHCfp\nymWWKHnUcxSSoSwOjOVxoJuvaF3J3lMbfLEzJYlcRLPwK9AtvgmqsusCyorEFV3xcd\/WRUwtkgeU\nQYUkK5G1skrlbKVH9ZaigxP6y8f937973MfvEpAVNUCvSchmYuv0S6Fv+3Nzkcno8YyIF37\/vN5P\nv2nQ\/WeHaTxDhmo7OKEPPeZlTjKmDrrhkR99GbiRZyKaOPuGp6uATvZzWg64TEyQNzoyvR\/kZEB0\nvGNOg432bBBcdv82fLY3zyo22u1tep28mH1z3BXi4SIDy3RxwU1\/VwGe7pfHH3TbpEpzmj9kSpH2\nuMzweX4urLCkQ6UpDQ65HVBhSoVN9kyodtvheIGLby\/UZGUEio70Y6NHftTFRXe69O17pp\/Lv8aW\ngSDssM9lZra4P8\/sO1aQixnMgt2uHNjttPqWm1K8R9w57B6NM\/3yAu3LPKo2zD6EyMYmNwjc7FuW\nroCrsvX1bM+1SlRG3pENB\/KscDg\/g6nBfpdFOFHgQiDucBR0NT7fmpsN67H0vMMMZ\/q7O2iv0bUB\nPAQEH0TzSpOTYxZmGr0Ls5KDZdkp\/Ga7WaQStuy5VZZ0geYecJs8NQUOPtpvyyxpApW8IjtVwPfF\n8uzkwF6nrX2CjEPXB4zDNng6A4gWo1GWnewvz0pqWrQsI8kQZSk9I9A4gN5puxaBavFboLU7pP88\nc5ZQmp1OUbQ7RtHmZVkpPnpGi6yw9IHPXNZ283bkWkN3wbCBc0OtgsL3V5n6eKPB0L4t99viMAu7\nck3N6x7Jc\/poszW2vlj7LNiOfbAPe4SeUQmqXVbG5JWWdJHKRM+JcVtzLVCXn2+gOYfcOeET9kjU\n1ODLzemsn6qx8fflWfjoWtRrBPJovlMMYTapPyl7FARlnNaryXcCESbar+zFEwVO4V2cXGXtCzX5\nDvgwJ0OgCGkzYhwtvNWRHaBG\/tRlBSoVMZBKu9lh4qnhd7ssYfp\/sSmVJ\/DERgJYZU33RffAQNgh\nANcM\/h3ZTUFgACxoTECYJGYp4jhe4MR9TM1yQwsczHdItCktUpmdGsDopJ1OK8vUkfwcaQlqVdja\nh0W3P8\/OBDYKlHRsF85da8uQqFwE4Ei+Hf6VkxmgdiBW0hwK\/n1rHyG69mpMyAlMwBZHlrAhJ0sk\nSaKs7nRaALUTiExNIM+i4p\/u75awvOGowFKpdjhNQJnb6TRJVAbKJoGkctCgAKjk1B7UAutsGazs\nh902tvgeZ04Is8Oe7XXZYLM9SyLS0PpUHZSfEM3f58phkkRZjY7NjqzWon0y32ag2tMLFCH1CdGf\nxkpLmhTtsyaX6O\/yLrP04SPSkuyP+mrL6x1zKjI8JYwVkKjPMRgx+m6128p6l\/ajdVqSqy3BvpOL\nKtBSiv4nrv8ABncDd7fesP8AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/spriggase-1334267358.swf",
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
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"alchemy",
	"compound"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("spriggase.js LOADED");

// generated ok 2012-09-17 11:46:17 by martlume
