//#include include/takeable.js

var label = "Crying Gas";
var version = "1347906632";
var name_single = "Crying Gas";
var name_plural = "Crying Gas";
var article = "a";
var description = "A flask of crying gas, saltily infused with real tears.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 20;
var input_for = [79,238,298,308,313];
var parent_classes = ["crying_gas", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "gasses"	// defined by takeable (overridden by crying_gas)
};

var instancePropsDef = {};

var verbs = {};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
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

verbs.sniff = { // defined by crying_gas
	"name"				: "sniff",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Certainly inadvisable",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.achievements_has('mad_gasser')) return {state:null};
		if (pc.metabolics_get_mood() <= 2) {
			return {state: 'disabled', reason: "You are too depressed to do this."};
		}
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("Just a tiny sniff of crying gas makes you sniffle. *sniff*");
		var val = 2;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("Just a tiny sniff of crying gas makes you sniffle. *sniff*");
		var val = pc.metabolics_lose_mood(2);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'sniff', 'sniffed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/290\/\" glitch=\"item|gassifier\">Gassifier<\/a>."]);
	return out;
}

var tags = [
	"gas",
	"gassesbubbles"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-33,"w":29,"h":33},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJYklEQVR42s3Y2XNT1x0HcJ7y1slb\n3jL5CzJ96TLTaSbTTtJ0MqFJSZi0aVLSlLSE5LKPIcFU7DY2hRojGwuw8YIX2cbYkoWELGvf777o\n3qvV2mVtlm1hbIfk13tNnSFgGrJhzsx9uaPRfOb7O79zzj0bNnzPgRo3P80at54N2j4xR5y7zBm8\n1pxnj5kLzLGR5VTLlg3rPaLOj59LovsgQxyEEncCitIzTR+BFPophGw7zm54EkaGOABl4QR8mb0E\n1chZyFEK4M3bgBh\/d+e644xC8fUoq5opcEdWgEn0wApQtGwHK2YmJsWZn64rcEIoABEkIBPuhnxs\nEKYC7RCmLgDtbgQzTcKEkDevK9AeLu2Ml2\/NFKpLkCgvrDxEsgKWYFF6CrF1T1AeJrGg8PORM1ws\n47XT4gjOR+39RtcB+f0T0SQyxMmG6uPJlMGDEUqW43vbtbbdTxTQzkaPJZNJmw\/DVIFAYFDvROuf\nKCDBhy9KCd7wE6QqEg4ZHCjZ+sQAjYHpFiYY6piKp8blEtMs22X0YI0G6f264+Qu1ZFJXTyd04Qi\nU8MyUCqxWuvAj1z3R3R9VubZdQXe5LJqBxWqK5XLuA+jlDIQJ6iLwWBovMfgrtWzmeH1Ky2f+4eZ\njl3JFwrOVCZrWAV6UEwZEIQxows\/PWBlVBosvvHx4yLlpw1MZiQ6lRyamZkJ8ILQ68Op1lUgyTBX\nWZ4fvnTdsltLTFkVavVTj7e0gdxlBxNtKJVKeL5UcmIUrbw3QSeKt4gir7P6iPNtGqtCgyeOP77G\nCBVevMmmumPp\/MBMpYJG4vGh+4EuP6YKifxNUQzoO7WTn6mdwpDaxT\/\/o+NYFp4yBrKjJiq6T8LR\nc7MzwUiQHw9wzABNkwPyQu1D8VaGYUZ9OHGR5rghpx9vb+wa36El4urHcHqZrjFQcUW2UByfr1T4\ndDZ7A6NZ5b0JEiTZQdH0kN3jU6IU3UXS9Khq2Ly\/3eBrGsPi7\/1oOEM498wEnxvCg6nj83NzodlK\nhQtFoz1SSh00S3f6MVIlAymK6iQoqlcGelH8shBgzRMO7Pzpbs3OPjvXKzfYj5MeX1BZuZgil8tZ\nJWBwTureRCQ8yfPcEE4xrasJ+jFCZfehShlo9\/papBR7BY6dnLC5L9R3aWq0VPLfP\/x+yxc2TgZy\nTSzpM8co551MhJvPZxJiNCw+UGIUxy+SJDZCYOgIgXp1QQYNiBTKiBzr0BnNrR0Gn0pDJn7xgzaG\nSZge8dFifTEuQJlFYX46DrPZGFTSESgnQ1BKiFCY4iEf5SAXpiEbJCEt4JAKoJBgfdLjhWCAdvMM\n6WhXjx255g13\/oCNkT9kE7I1sQCWrBYSIBz9FGIdLZC16qEc4R4AphkvcOfrIWoa+woYZzwQYTE2\nQFNWh9060Hh1XDHsDW393jhrpPy8JVTsZmlqaE5KreCaBHbvdmB2\/xOoTz4AYtt7gP39T+D\/6ybw\nvrMR3JtfAecffwv2116ABO74GjArYksogQ0whN92\/MLVPT0WurfLST3zvYDmYLETC8UVhSnh1u2Z\nHCT6O1aAwolaCBzZD\/iH7wD6t83ge\/d18Lz9KrjefBkcf3gRbK\/+6mslloEJ1gNTIuMiCVx3Y8J0\naX9TJyKVuuG740Klt5yRYn0qJlJLlTzIwHBTPWRNWiiLFOTck1J6b6+kxx4\/ADGtGqKjfeDc\/Dvw\nfPDmA8AY5YLpEFn2YFh\/gPK5z3UN1p67ZmmSd6ZvjZO+Jn9iDRd7+XBYtViZhlWgnB69YyuQ27fc\nTe\/9u+kJzfUgtJ2BhF0PXPNJQPd+uDZQRIGmCR1FoEa306rbf6Z95xUj\/u0PtpZwuQGLFxS3Srni\n8nzxK+Dq3ItKTRK7ehEina0Qaj8P+M4PwPnG3blnfeWXIHSeXxMYI51SQ\/ERDEOvc5TP09w9ePTT\n5p4aPZuueWScI1L5mSc+21QqFc13qmW4Fyinl1B3rrnMYHs+XJl7lpd\/DinStSYwSjigEqMAw7BB\nhvR5e0b1p3c1qJBzQxMNpmj5uW9e8wCesoXL\/fFitf6LhQrcD2T2bYectLxMS\/Mv6zBCxqaHjMe8\nAqSP1aykhx\/c8cA6eC8wx\/sgF2FFCejuGZs4VXu+a++OE0pkwBloeoT0yn8hsrcVlUrZvBYwqmr6\n39x7657OfQm8728C\/MDHYJM6OOEx\/V9gJuCFxay46HK7r10ZnTip7BtXyMDatgFFn4N74aE4X3rh\nWU98rpsrLiPh0u1Ds3NzD5R4PhUG9uDuu+ven1+7u+6tzL1fg\/2N30DcoltzJ7l3Di6kAnAnH4Ip\ngUa7NJMn20dunjzU3LXvo2PNyCW9t+Whhwl7ZKaJnV6sEYrLu5KVpcap8uLpwsxcf3W2FFoFLpTS\nMJsIgvifE4B99C64Nr0Errd\/D2yjAnIS5mFbnQzM8P4V3HIuuJQOsSxLog4ZKKfYNqA9KgN3NbTV\n9DsCa+8wvtQtFV+8g8RnPz8sAU\/FyrdPRQvVhnC+2hjNFpXS2U9XLSSL1XziUffixSjjT6VFIpUS\nST7GE3bM7+l3+fzdXhRVa0y2C10aU92VUVNd+zVD3fG2vs+2\/usM0qJxnFwTaItWPguX7uxLV784\ntbD8hT89u9waK946FcpXT3lDuT0WLo2YuCRioaM1TDDSxIaiF7PJuCsWFg2iwI1Ip+oRjqXGBI4y\nsDSp8fn9HU6PR6U1WRpvTtqVhkmLcuzmZJPe5m1WGxx1vTdsdT0ac90KcsRY19qvPbHt6LkdapfQ\n8NAvNSwx1xGrLLeuJnj78zv00udfxrMzt7rdwWyNDDTgUUSHh5Exr4hoXYFdhBBqIXmhDaP5Npzh\n2jGSaTe5sbP9evvB5kEjcrpXizR0apG6jhHkTI9m78nLw7tqm3sQeas73Na7dxV4VW9v0aAR1zde\n2fljlW1MZn40VFhoTc8uthbml4aK84u6cnXRnKssDNnYZM0qcMTBIYM2Eum34EiP0Y90GNzIZa0D\nuTBmQZTDJuR+4GHVIHL4Qj+yCjzU3L2n74bt7AQV85n43IFHWgtX05QvJ93R8oAlWLhhFfJNZi6r\nuD\/B7wKsvzJac1nnUfXaOJ0Oj\/Wbg4WOR4Y9DCtv6NK5cKd8Y2UUCmeN\/LTKyGVVejo9It\/N6Mi4\nTvpq02nwKd0YGtVdRyM6+W5GSyYpHZUKSr\/xjRFxlXwlLP\/HhFjc8ii3r\/8F5zFXxBmKutAAAAAA\nSUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/crying_gas-1334268720.swf",
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
	"gas",
	"gassesbubbles"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"n"	: "sniff"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"n"	: "sniff"
};

log.info("crying_gas.js LOADED");

// generated ok 2012-09-17 11:30:32 by martlume
