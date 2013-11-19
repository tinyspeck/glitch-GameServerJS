//#include include/takeable.js

var label = "Copper Ingot";
var version = "1345780552";
var name_single = "Copper Ingot";
var name_plural = "Copper Ingots";
var article = "a";
var description = "Pliable yet strong, malleably magnificent, copper is a much-prized material for building. A glitch bearing good, strong copper will always be welcome on a building project.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 70;
var input_for = [183,184,187,196,201,202,204,206,209,212,222,251,280];
var parent_classes = ["copper", "takeable"];
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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with an <a href=\"\/items\/621\/\" glitch=\"item|alchemical_tongs\">Alchemical Tongs<\/a>."]);
	if (pc && !pc.skills_has("alchemy_2")) out.push([2, "You need to learn <a href=\"\/skills\/81\/\" glitch=\"skill|alchemy_2\">Alchemy II<\/a> to use an <a href=\"\/items\/621\/\" glitch=\"item|alchemical_tongs\">Alchemical Tongs<\/a>."]);
	return out;
}

var tags = [
	"metal",
	"advanced_resource",
	"nobag_advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-17,"y":-17,"w":34,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFVElEQVR42u3Y20\/TZxzHcf4DNp1O\nKNBSQUDQFpGTKIXSlkOBnkBOahUVp4CITqFCbSlQilCgUgUF7NBtzBFDPOBEN3Qn5za1mzM6FxxZ\nvFmyLL3fzWfPr\/ADZEgPgGKyb\/LckFBeed7P70A9PP6fN2TMaV7MtnSvgZaUZcpFhzuTzeJ1ypm2\nDpkvTkp8cCLTa9QkXrE4oOfzA8t68wNhyV2Jns1sdGWzcFrBBIU1Sxij5szXBP20iO3ZXxhqubAj\nFH3KEHy0NRjnC1ahNy8AlhwK64+uLIKV+6FD6kugjFcHHSwOZ17eG269tIeLgd0cXNy1Bv2FYbiw\nfTX6tlHYoBmxnTK\/UbOMJVlQ3HB5LO\/mgWjb0P4ofFYSicF9Ebiydx2cwXbmBKNNEWIzy0OYC4K7\nUxFf9nVFPL48vBG3DsXhi\/JY3DwQA0fYT5SrcSYvFAYxGw1ifwo5MK+wewaB532N0PKjWoDvq\/n4\n7mgivq3kYSbs9dIoXCtZj6sEe\/m9cALlomsr1w6rTfGDVuSDulQmTFlB85P6cV0a81F9mvVhXSp+\n0qXggVaEexohflAn4W4VH3dUCfiGYL86sgm339+I4UMb8DnB3iiLxtWSaHRu4cKQzkZdChM1Il8c\nEzBQxV8BrdDHdjqb7Tkn3GiLjPfMKLX91iTBr42ZeNyQjkd6MZzBXi+Px+kt69BAcPWpLOiSfaER\nMlDN94Iq4V0c3LgMpRuWWtzGjTTLlM+MMkxfzmBvVgjQnrvWvnP6NNZEWnWSN44mrsDh+OUojV2K\nnRFvuQcku2aZCecMdqgiGS3y4DEcOXfT01bylqNswzsoinQD98yQ7TnSLLU6g5u6yO\/gSaMEl8qT\nYMhYacfNlnZf1BLXcb8bZRzqvLmKo9bjJjn6SxPsOamrlQLW02mFU9JuWoaSmCWaeTtvzqwnzQqc\n3RljB9G4l6XdH7NUuWDnbaZlNShwglwMFE4\/jqOQ1H1uetryOBdx7p43et3VZ6FJusqOcZT2kKu4\nuZy3EaMCtzRS6KmbL8E5Snsk3sUX2Lmct5EWBQYrxfZ81C45Tusibi7nbcSUi4+LE1EzjnOUVpXg\n4ovqz\/Vit8\/bE9MWdO+IJul8oBvHTU9bS6dN8rapE5dzXMIdE\/kp9RkBGDqcSO7+ruEeGvNhIlcq\n9ahymFbAcB1HTbXIZ0CX5o+GzAD07o7DA72Tt5FWpf1ioHD\/SUt+TqfVJZO0Ah\/3cFV8L2YVORda\n8tjRk8dQkywIpwq4GNYq8LQ1Z2Zcaxbum3ZP4hyk1Qp93cNRU5HkVXY0iQFNMhN15EMbpYFozQqB\nOTcMFw8m45G5CCNtmydwf3Tvwe26XDuMXrOl1YooHIPj9mtTJd97VEWAapEf6MxGRTBO5ISio4CD\nvmIeHnaV48\/r7fhruAe\/nNe+gJstbY3Iz6abC86+g4neEhWfYaMy10zJ3Ja9Gqfy16JrWzg+LIrF\n03Mq\/PP3c3QVxkziZkmrS2ZadaI54iaRDI6K7KQmZSzzcfKIGsu8hrz1cmHZsR43mvbi+d0rzqa1\nGgRve3rM51SQD6wW+t6qpf6QJHA8cxg6SeYeZQTO7YzC5cp0Z9LOP27qaFNYFuqeSGU2bZ7M\/EFh\nJIbUsgncTGkXHEdPrZilnMictwZnto5lvqbKeGla\/avC0XM8I4BnlAfZ2qdm3hWFk+Q\/selpyQ4S\nHPvV4ehplvszydVsHcu8Dr0kc3se54W0rw1Hj4H883wyL2yAznx2V+xkWjHb4rFYpqOA29qzPQLt\n5MIZe41aRDh6urdxld3bI2wNaazFh5v4rnmhvhp7U+dfDLMvUpdI5m8AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/copper-1334275141.swf",
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
	"metal",
	"advanced_resource",
	"nobag_advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("copper.js LOADED");

// generated ok 2012-08-23 20:55:52 by martlume
