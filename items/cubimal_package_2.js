//#include include/takeable.js

var label = "Cubimal Series 2 Box";
var version = "1347677204";
var name_single = "Cubimal Series 2 Box";
var name_plural = "Cubimal Series 2 Boxes";
var article = "a";
var description = "Contains one (1) Series 2 Cubimal. Open it up to find out which one is inside. Collect 'em all!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 5000;
var input_for = [];
var parent_classes = ["cubimal_package_2", "cubimal_package_base", "takeable"];
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

verbs.open = { // defined by cubimal_package_base
	"name"				: "open",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "What's inside the boooooxxxxx????",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var chance = (randInt(0, 10000) / 100);

		for (var i in this.cubimals){
			if (chance <= i){
				var s = this.replaceWith('npc_cubimal_'+this.cubimals[i]);
				self_msgs.push("You got a "+s.label+"!");
				break;
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'open', 'opened', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

// global block from cubimal_package_2
// The cubimals and their relative chances
var cubimals = {
	'14.5': 'fox',
	'29': 'sloth',
	'37': 'emobear',
	'45': 'foxranger',
	'54': 'groddlestreetspirit',
	'61': 'uraliastreetspirit',
	'69': 'firebogstreetspirit',
	'77': 'gnome',
	'81': 'butler',
	'85': 'craftybot',
	'89': 'phantom',
	'93': 'ilmenskiejones',
	'94': 'trisor',
	'95': 'toolvendor',
	'96': 'mealvendor',
	'97': 'gardeningtoolsvendor',
	'98': 'maintenancebot',
	'99': 'senorfunpickle',
	'99.5': 'hellbartender',
	'100': 'scionofpurple',
};

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000008\/\" glitch=\"item|npc_streetspirit_toys\">Toy Vendor<\/a>."]);
	return out;
}

var tags = [
	"npc",
	"toys",
	"cubimal",
	"rube_special"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-26,"w":30,"h":26},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMvklEQVR42u2Y2VJbWZaGeYN6BD9C\nPQKXfdMRWV12lm1sJgMGzDwLBAgwYDAYzCBGM0toQEhCAwiEdIQkRgnEKAYhxGDAmMHO7Ii6qYu\/\n19kCbBJnV1RHdEd0RO6IPw4Quvj0rbX23oeQkD\/WH+vu8i7tPdhwbYtW5za4lZkNbtm5zi3ZV7nF\nqRXObVvmFiyennmLRzRvXhTNji+KpsdclHmRQz+XZtfNhPKxqmdC\/xfAvA9WZzd6lqc34HGsYd6x\njAnnPHTOaagcUxiy26CwWSGzWiC1mDEwOYHeCRN6xkfRZTKiY9SANqMOA9pRSNSjMMmsGJNaYJRM\nwtA3wel6TdxIj4nTdo3WazrHRIrWEVF5Vu2Dfwq2OuMN9dhXe8gS3LYVuKzLMNvmMOiwotdhRpd9\nHJ22MbRzo2i1GtA8qUejeQTvxzWoM6lRM6pCtVGJSr0c5ToZ6oaVkEmN0PeOQ9djgrZrDJrOUQx3\nGNjzw9suVAsrkR6diej\/SPx900uOtT\/zJeOBqGygksFkmUa\/zYxOkwLtBsl\/C\/TGoEC5tAGvW\/JR\nMtSNGqUckn5dEOjDKNQdRqja9Bhq1dHvYxholECQkoa85FQUJBUj5mEiYh+9Et0Hs3gfsD4ioNkJ\nN2ZMLpjGnei2mBiQ2PINSKxsQudgNdoG3qCBUiVrQoVcjBKNBMXqfghVfaiUSdHXo70DpBSPQN6k\nxZjEiv7GfiQ8f4bIR39BY0U9hEkliA3C3QV0m91\/mhl31fNA06MLcBjnYNfPYko3g1HdFCQGKqNR\nj1bDCMQ6LZq0ajRohlE\/PIR3QwpmqFohY0C1Ehk+dA+jr1NzC6Ro1kLWqIaCwCYVDgw09yH+eRge\n\/\/u\/0fMZmivFSAnPZGBxLEmI+zmph8FNG10\/2Q1zX26AbNppWNVOWIbtFAecRgLWz2NS5cAoNbah\n3wx93wT10Di03d+VrN3wGyANBt8PQ1qvwpBYB7PchpaqBmaLB8tJTCJrDXgrrEfik9RruCS8So1G\nUtoLxP+czIXQVGpc1GMLkx7Mmtxkz0WQsxiXcxgbtDIg48A3oJFuE8yKKUzIpjAus8Ek5eDULTAr\nhr5Jan4zLPSzbXj2NnbtLCoERQwq9uljVOSXoLG8CaL0imCvUW6spb0OQ077X5FZ\/RQJj1O4kKvT\nr7ibLzg\/usTZwQU+H1zixHdG+YyjzRNsL+5h272HzYVdrE9vw21ZxbTBBad+ATb1DAGaoesaZ5E1\naCCpU7GUphcyW+\/L6\/FO1Iik5+mI+WvCzSAwuPSoWAJ6hcx3j5Hb8RBZb8OQ8CTtLuDlyRdcHn\/B\nxccrnPMh0M+HPOgFzvbP8SlA2fuMUwp7+vkn\/c1\/Hnyy0GcDl+z5yX+B091z2AzTKE57TdtGPF7w\nYJSbQciPj0SD6CHEZWQt+iVyOx8ir+sRsmvCqOzpXMjlyVeOBzs5Psf6xyPMHvnhOPRh6mAHtv1t\nWPe34AzsYHrPB6d\/B47dLcz6drDo28XezjE+7pzi4\/YpjrZOmOXDzWMceCkbH6+fxxhTmgnsGu47\na3xJq3KfoOX1Q5bsF\/EMLr\/7Z2QUvsCrsHRPyMXxFXdB1haOAnASmP2QwA62wRGYJbAJ854X4\/4N\nmHbXMbq7BoNvFfqdFYxsL8O4tYLA1jGD48EOr8H21ylrRwjwWT0kwMlba1kZkahofgih6Ble\/i0Z\nTSWP0Fr+EG0Vj5ATk4DsqnCkvnqFpLAMJIdlIuTi4yXHl\/SONQKbpExcw40RmPE7MO22B+qtJag2\nFzHj3Q6C3cIdBeEIbG+FzwFMBMjD5eaGo4oGoJp6rJSGIP5vKbdw7ZWPkBVNYE+DYHxSnmUhhHqM\n43vtd635gtZ0O0EwDYENE9iQ1w3FhgvG9eUfWuPh\/MsH8Ht4QAsraV5eBIOroT4r44fgcSqDqxM+\nQ3pEMrOW8yKZoMPQKIpA6vNshNC0cvwQ3Frjwfzr96xptr5ZUxKcnOAG1+dhWPPct8aDUXY9+9hd\n2meAL39OhkAQyeBqqc\/Ka5\/REKQhK+qutYbiCPTUPEFzSRTSwnN4wEsRP6Hm23JeWyOwG2vq31iT\nrS8wOMnaHEZWl5i1vTvWgmC+xQALD8iXMz8\/CrU0AFXiJ0iPow35aTqzVpoTj9bGCOQlplCpn6Hv\n3VOIS6PIai4BBs5FnwKfWTlVyloMyavvWBvevG9NSmADq7PoW5mBZsX9zZrnmzUebMdNce1hTD7J\nypmREI\/8vBgkP09l1ni4mtcxkEqfYHDwKQpTUxhcf91TNIlikBGRh5BTAjz1n7FyqgydUCje\/q41\n6VrQWqe2BU3vE9HlskLlWbhTzhtrO7Sh83DbC34GyJeTD28tJaYAKdECVtLO1nAGJ5eHoSg9FQN1\nYWgpi0ZBQiYyIwUE6D8TneyeMWvajQUMLzu\/WSMw+ca3ct5Y65gYxPvqSLRNaaBcmv+hNR6Mz9b8\nLgN89YTKGZWLrNIm5DVLkF0mZkMgkwXhFIowFGekoSA+AxkElhmVT\/2ZHwQ89n26s3Xw1uQOOuxN\n3ZCOdmGAU6LfoUHv1DC66Qt88DjQu8yhfXEKcvdc0Jo7aO1oy3ENRpnbxeasjwAtrKQZeTUQEJxA\nLEXum3akPc9hYErlM\/R8iEJ2TC6zVpqRiaqCNGRHCxFysvMpjT8JeGs8mPJmCNx0fZdXQtuZAU1H\nKiRiKmlvIToJrmPJTieLhk6WYbTr9BjpN0LaosSIRInVhXZmbfMazjvjg8Mwx8qZKahFfssgClpl\nyKvqpCnNpRJHo6488dZaTXEy1IMR6BXHEWAhF3LqOw3lTwKTd\/XeEPSvzqB3ZfrWGg\/GW2t129Bt\nG6GrUz0kLXI6a51wmuZg1dlRJ2qCpElOgF4c+9TYmN7BErfGNt2s\/HcMTtimQF5lO01pHhsE3lpu\nZgayYwXoaY6DRh6JvpaXdLIQ4BEB8seUdyOA4XU367X+616jNyR0eZzMGg\/Wtkj3OTeHpmkzqsua\n4F87wD\/+E9\/yazBNZa3Y36qji0Y31p3bBLjO+i07vw4FzVLklbXQO0cBs5abkY6Srmi8VoVDkJ3F\n4EYUkehvo3M5togAvaeh7GCnbK3RnrWyjAGC+95a27U1sYvgFqyootvvjNl1D+wm4yor9PIyurJ1\nYs2+BQ8B8v2WHlsYBOPNXZdU1B6D8uFwVKjDkZ+TzeB0yiiqThoEsaIg4O0xtXp\/w11Y3MK8exNO\nN23grkUojJNofN16C6fqHkFhUhkKEkX49ezvDHB70Y+GMiE+7bdjzbGCNXo95TddvqSChGzUlCbR\nBTadprQAZZIogotApTYCBbk5kLQn4G1BNvLjRARYwgMehQZ+e0z9zobLT6fDMIueBgkDOdo6hfBV\nCfITiiFKrcDnwBX+8QswKjdDM1CIr+dllFJqBTmz9kaYAjWZ4tP3IY5NaaUmCPdmJBIFmQLeGoMr\niCv5Iowt\/SmErIXe3Dq8i\/uYng2Ac9HRt3AO0+wnWKZ2MWnbhdUewNzMAZyT66gS1KGztheN1GuC\nl0XIjRVizuxmcL+e\/h2ilApseooZHJ+9dQUbhPdvkqDRhENLQP1dNAQvChlYpSoKRYXZ13AlPJxH\nGFMefGlXWwOhOtseZJN7kFv3oZ27hHb+K1TT5+gd20W3cQcT83PYP1QgcCjH7r4E+7sdcE5UoiKn\nCBXZb9lVi4fj098og7RNcAvHJ7ChZJtuAwGOjERQIjHQTbfnmCII83KpAoXMGg+X\/7Kk\/s578NvB\n1dDBST9kFh7uCpq5LxhynqNnzIcugpNYT6BwXsHi8eD8rBG\/XNRiZ7UKhclCjCkmmbEbc32Ng3Qr\nzoRnpojlBnDfO0TlLEBjdTJ0ukjo9ZF4V5pJxorvl\/S3q1bifSC3HRFYEE5uO2XWPhi2IbGc0Ily\nBSl3jna9D71GNwL7bdDLSiGu6Li1xg\/ZpHoKeqmJRUnvw5U55RBX5jLAg00VlVOI2pIM9HQkoixL\nwOBurN0p6Y8WD6ae\/QIZwXUZdtBJGbAcQ0ZwcvsxnEs62Be1mHJrsLCugaq\/Ap01vbeAP8qp34\/k\np5k4PSih14Fh5FK\/5VFJ87639rL0fkl\/tFTOi0ip9ZjjrXUQnJQ7g8x+hQHrGcSaTUhMs\/j4sYFs\nVFIqENgupV0+iwG0VXUze5su353w5X5XlMMMHm6pGdy3kpbw4fLjSv\/1f8NJLFcPBu1fQvusn34S\na7ZFjUPr9Q0qL2ddtHI+f2vg6LD2trf4SbUahOiqz2Mw34cfFN4e\/zmXrfW2pPze9j8C+1fXO\/na\nn72+llBu7kOaa6VH9Mt5iWh5o1FzcvyG+\/q5hNvfrwncfBGboZY3pvk\/Aftj\/X9b\/wWrPljfICvX\nLwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/cubimal_package_2-1339206386.swf",
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
	"npc",
	"toys",
	"cubimal",
	"rube_special"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"o"	: "open"
};

log.info("cubimal_package_2.js LOADED");

// generated ok 2012-09-14 19:46:44 by martlume
