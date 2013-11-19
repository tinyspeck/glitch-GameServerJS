//#include include/takeable.js

var label = "Memory";
var version = "1337965215";
var name_single = "Memory";
var name_plural = "Memories";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["mental_memory", "mental_item_base", "takeable"];
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

function canDrop(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function canPickup(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-23,"y":-47,"w":46,"h":48},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJxklEQVR42r2Ye1dTVxrG\/QZ8BD5C\nPkI+QqZr1vwx0+nCtghVqlhaRUCIoLaI1LSdTr21zaCIiGK84Q0wlPslF0ggBENyEhISQpKzcz8n\nxPaZvU8IJiSAVmfOWs9SD\/u8+\/c+77vfc2TfvpyLN3xaGpo5pIzOHS\/b93+64uZKWXSpTpNYaVXz\nuoqSXRcnnN+qN+IdSPFXQKbKldn7gqWqNGqpJ6nwVcTsZzl+7NPS9wUYs9ZXp0K\/IOFpR2jkE+Wu\ni6Pzx8vCphoQQxWIsWLLxZjloDxiqUXCfQFRqxJkslyx\/VliPFAdWaxXkpFPZAVxrc0KlljMfhpk\nprwAIjxXCV5XTshU4bOFGZkOyMOmCk10\/mBemek9NTFU0A0OGLeXIr5UKRPXL0HkLyJqOs0luHPK\nNGmUAw2lKdIoS9jOKcXgz0h6LiA0U64qALR8xsG+R3kLsrYdUmyHCJsrSdG11s\/UkYVj1PnDIPqj\n6mJ9Riui5PUHtOHZCmOBKcuHqt+6N8BXlAi+I0rx1VeKdLpFnXr1SBv3NJGoeFXLJ7\/T+hP1Gqk\/\n3YflLBmWgGC5IBcs7bv2Z8RaWR1frtqqjuA7LGfKbSfBe2bvHo+namXJ0BecmO7G778n8ccfG7SE\nvRDTLiREI8KJ7xDjvySCt6r0tcvfyt4k+VSkRpn0HzGKqe+1Yugot\/W843MZa4Pk2neaPYOEkye4\nROoWUulVpF\/x2NjgIEZuQ9xwIJEyISb0wx9rgyva8NoNrk3+BomrxPRlpMVxpDaWaSyabPKckUdt\nSZyrKgtbvlIRwxHFnoB8spU+bIZAg4jpFYjx61TdSKYsiIt6RIRhCvgLXJEm6VQSQ7lC8P2IiOUk\n2fEACnXymNhMY5ho4h4IqUXExBFEkp0Ih49p36oHg4l2+vC05BaD4pP1CCXbQGiwUOI\/8McvYiV6\nCly0Sco2ulCpCM9VG3lDFbdTzJBQrwwnL1P3J2iSBkREOnaSjQgmvoE\/0UBjNsp2HS+5B4Twx5CM\nnENUGJdAA4kzUhBf\/CRWYyfhjjbCGW4syJqB7jQyGEAwUU9YspmE6xGkyolbfFCHdFXGpLcdkfkj\nxqjloCbGHar2hutU\/tj31K0eCvfzFpiHakWCayIOoaHgtImvahW08TVC+r4ylrqpXEu05vXTWqJB\nsU6BslqLN8DL4tKYuf2c32\/TRyncCTrNKzj2WsvepyBq5lRWDIz2HLhwE+ybvZfnnlBXFhdbkRIG\n6aGyS726FlfCs610vnhDGYNajeVVg9jpQSkKGBj9RBWcLNeyRs+9zx6gMEYng6JyMDAqG1Eai\/dt\nnTYs3KAt0YOo2EXd\/0kCcBTpLZZ8JuFGKTZXJOE3uux8bcm4pZKbWKzEpLUSE1QG9xdFxwl1hazH\nG6XS+WnpGJwzfLLooWHtkU14mSgJ2+dPf3HcGfig7O7gX6Chon\/uOA5ckZNa1kuezbKxdrCHleqd\n1t\/XKvBgSIGxxQrlvne9zIFT3HywGebA6R2DcfQDgTmScUbJWoE4+J1fW33j\/9Q+nvwnHk9\/JH9n\nwFl\/i2p2vQXGXQDZtRg6paYCE01o1w9fU6BFRQUzaZG9M2DPi4\/k3doy3NLu3xVwylEjm3Yeg97b\noNor5hhXqxi21eK9fZ5f79+PnpHP1Hut65v4CP39f9uz6S\/1fiC7ovkreS9wOr61ZMx7FqOes3u+\nM0dXz+ZtauD5UkMgIJ8O+OTTPp9cx\/Nb8M8sJ7TvBXDY97X8N8\/XGPJ8s2vAu9OH5b1Tn2+tMZGg\nYjESIrY4wYoYg0uMwiVEMeX1akY9nrJht0r9XgDv6I6XdQwfxaWnBzn3RqTanY4oXamM7EmeW07w\neBnn0W\/t5K4Nfm60xAJyc8ivoXBY\/0Mo0AIJ4sniEp7br5KbU3plj05X8k6ATb\/8Q0kFJdVqOk4V\nk+TZiIETwrAxwFgI\/e7reOA4j2HnKD3xa3AKkaKAujUfemaMaFH\/HZ1jo+ia0JFOg+HP\/2\/xivYr\n48WBGjAthBbyNvPTL24bdW\/MNYOLL77EJaq2rg9x7lY3HszOUXAethihfxIsRXnMULh7s2Z0DA\/i\n5NUPcflZN25O6qhm3qzcZhIglnAQlnCAW4oTWZ+jvfQhdeXBpubCE3mALjGCJeqeNRqCRteLSW4M\nbiEEVl5jwA\/D+hp0fh\/oAcGYx4PHFiu6p\/TomnqK67om3Ji+IQH+PDCkfQM4v8zMByRHsgAGfhwa\ne7uku8vtuGf5NQ\/QniASnCUSpFDBrfvzJCAB6ikgc23K58Wk14txzypG3RTUcUeKeWehk7o4iB8e\nPtVcuPuorLWnZ+d+NJGAnMF5NuJbGx27UoNa9SFJNVcqUdFeBvWLG5h0u+iJzPSYl\/Yle45Bmfh1\nzIXW891jgBRuYnVVcnFw2YbzjxrQ1nccbQ\/rcEc\/h9s6plmoh0bJNzdvF74Q9P41jgVdzYFjemx6\ngfO9Knx87uM8nepQ48e+Z3iyYMHQ8rIEy\/qNwc0GKRw9JDRmUfd+eNyBT9v2Syo\/vx\/HL5\/HxSf9\nEiAr9\/nbGjR3dJXlDGK+hAVjGTPIeeoCa2jfq4QEObv2EtqlSViJh75jVyXop\/N6DFgXMWizSRpd\ncUruMbi1V0npORaD9d5r9zKAt2aGcW30GU782oyaS3X46el9\/Pvxc1wbmZD0dVcPTl+\/+drF5xab\nnGWaC8k2YhuyUZIZJxFwyQjcqZi0OWsDM\/15tqRzQf+WcwxsOR7OK23WvZEVN35zuqHlVvDC4cLA\nshMPzVa0XOvKUx4gm0G36Vy6N2uSRgDThMctbcgkAVCZNsXAWL9lyzntW93qOX1u3+WUdkyC82DY\n5caQMwM3aHehnwI+s3H418MnElhzxw0jlbblenf+Vw6b6Jl5pEOvYU7aKOtm1tHtYvfHVlxSQhmw\nTM9l4diBGN88GLlwzL3BTfee25y4b7Lg6sDQpns3is9D9rqhw5JjgBrqJNuIOaHfdMVQROx+37xF\nSuqZdSkDR8GyZX1hd0jwA8sO9L+04znVo3krPQxGZM3IKgvI3NtxzNCFWrb4Fh2kIy6X5EQWNFfD\nTmfBBkzPl15KJc323COzpei67fqJnuAznd3Z\/tv5dzO5ZWbqW1jEU\/pS35I1I9YCO212Rz+Lu0YT\n7hpMu0KxUbL9YGw6uPvvZq72a1VsvjF923tfCsQy7Byb2grOfpb777cVezYHSCsdimtdqj3hshc7\nQc3XuuTsqDOxk7UtS9J6q1eaWbk9xMqkuvcoD579fVsJc+Nw7+2T\/0xnZ2kWmL0v2WkrVqK3EQWs\n3ve\/vBg0c5qJQbPXEwNnzmSdZmvY2uy6rArmXJHrv6vHd74poFTqAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_memory-1312586725.swf",
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
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("mental_memory.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
