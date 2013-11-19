//#include include/takeable.js

var label = "Girder";
var version = "1338998342";
var name_single = "Girder";
var name_plural = "Girders";
var article = "a";
var description = "A solid metal material used for correctly shafting mines and supporting structures. There's some crazy rumour that if you can find a way to boil these down, you can magically create a sparkling bright orange drink out of them. But this has never been proved, and their use in construction is by far the more popular one.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 4;
var base_cost = 1500;
var input_for = [];
var parent_classes = ["girder", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/995\/\" glitch=\"item|metalmaker\">Metal Machine<\/a>."]);
	if (pc && !pc.skills_has("metalwork_1")) out.push([2, "You need to learn <a href=\"\/skills\/126\/\" glitch=\"skill|metalwork_1\">Metalworking<\/a> to use a <a href=\"\/items\/995\/\" glitch=\"item|metalmaker\">Metal Machine<\/a>."]);
	return out;
}

var tags = [
	"metalproduct",
	"advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-45,"y":-23,"w":89,"h":24},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGL0lEQVR42u2YeVJaWRTGswOX4BKs\nyoCzKMYpGhWVMIsGB1AUxAFEZZBRZgQMqIg4ZLCTspOudFLd6aJ34BKyBJZw+pxLHm1IV1d1Q\/Sf\n3Kpbj\/f+8ed3vu+c+96dOz\/Wj1X9NTs7W6fTGWwazZxtZkZjm57W5Itbe7W6aoaJCbX+1uAWF5eG\n5uYWCggEWq0OZmfnYGZGyzb9Vo5PgEwxfjuABoPRhoCwsGCA+flFQFDQaOYZGF3HVZO3A6dWz9ca\njauXS0sroNcbgSB1Oj1TkDaWGxRKVUEmGx+6cTiTyVRnXt8Eg2EZEJJdCZJUZErqFkEilUNbuyB7\n43Dr6xsqk2kDVtfWYWXFDMblNSAVOVgq8ejYE+DxGqC5ubVwo3AWy1YWN5jNG2AyWYDSubJiQrA1\ndq9FOOHIGIPj8zugt\/cRCIXC719ibBX82G7y8+amHSwbVlhfL0ISYCAQYXBTU7Mw8HgIHjyoh46O\nTnjU\/5jBDgwM5e\/e5dm4jYGxVRXO4XCqrNbtAnlua8sBG5s2sFisQPdmBN2yOmDy6RT0oFqNjc3w\n8GE3PEbQkVERDA4JEbgB7t3jsT08PAoy+fhVVcB8Pl+N0+nLbjs94HC4wWZ3AoIipB02UMVNBLXa\nnKyNCDq7oKWlDbq7e2FoeATGRGIGfP9+fQlOKBxjcCKRqKYKcKE6t8d\/5XbvgNPlhe1tD9gdLrDZ\nCNKB916w210sqa1t7SW\/DQtHQfREwuA4sPr6JhgZEVUPDkuq93gCBa8vAB6PH1xuHzidXua97PEZ\neH1BWMZgEFxLKx86BA9LfmNwPX\/DNTQ0g1yhqh5cKBSzkafIa76dIHi9AXB7dsDl8pUUXMa2Qm0E\nW8hXfiO4dgwHB9fY2ML+iarApdPpmkg0ng+HdyEYirJk7vhD4EO1PF4\/UKkjkTjMzRfbCJX1ut9o\n0zMOrqmpFeEU1YHb3U3VxWLJQjSWYBChcAyCwSj4A2HY2QkBlToYisHEpJq1Eea3vv6S3xgclpqD\na25uA6msSnDJ5L4+kUxBPP4MsM9BNJqAMEEiUCAYYdcIPiM4guL8xpWUkklqERgltqWFj3DKyuFc\nLldtKn14uffsAJJ7+5BIpGA3vgeoJFPQ7w8jWBxIVbliHLqwnMxvg8PMfwRHCtbXNzI46nWtre0I\nVgW4dPqiBr1WoPaRSh0Cg0ymIY6QVGLqcy70HHmRTN6JYOV+G0RQHq8IR9fu7r7isapSuEzmtC5z\nlCuEUSUqaTqdgWepA9gjFQkSS3169oo1ZoIj1cr91tvbX5oO1OOorTxVT1cOl8ud66mPHWVP4TCT\ng4PDY0jvH0GKIL+U+sXL12yEjWEZO3E69F\/zG5W2u6fvqx5HsOqpmcrgLi4uak5PX16enL6A49w5\na7ZHRydFyINsERJL\/euHT7CExyUC6urq+cpv9IzU5MJAPY6Um3xaoXLoNf7584urs\/NXWLqXcHLy\nvAiJKu4jHJWUFP3w8ROWaYb5jFS67rdh\/M3nC0phoNT2oHLsPaMSODw8ZimJsd09QEggSFIxh5CH\nmWPWgEm9d798ZGUixcr9Rs+amlpKYaAe1\/dooPJA2LfdWdbXsE1QCEilDJaV1Hv95i389PpnePvu\nA\/z2+5+sjZDXyv1G91wboTBQjxPi0K9KWk1mSxY3cHt1DU++q3jyXcb3hyV6f8C3sEUD63WkSLnf\netlRqeg3CgMdCsQSWXXSWr4SiUQtgn1eMq4wPxX\/MI+Np3\/yG6WXheFBMQw0Y8USeeVp\/bcVCEUj\npFofeozg2tsFzG\/cEYnUIxVpzl4PQxveS2XfGY7W+\/d\/1FJpZTjEBThP+wcGv\/FbeRj4+E\/QXFXj\nu8Z3heMWHtOvNNp59p5Q7rfrp18KA8HJFUqYmr4hOPbKuGmljzogxRH2jd\/uFycDDXw6dIpEkuqk\n9b8snCZ15CUFthU6Bbd9OWASHBcGgtPO6W4erniKOVTpFvSgVKpKfqOkcmHoEHSyE\/OtwOGIi5zh\nqHNsuxkgpZnU4sJAB1H6nnIrcJlMLk+vimR4Ki8lWYJNVyyW4m8l+4ZHX6ZuBY59XDQYbQqFKi+X\nK\/ISiRy3NC8WS77ZUqni8sbhfqz\/uf4CqnpgKuKK70MAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/girder-1334351931.swf",
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
	"metalproduct",
	"advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("girder.js LOADED");

// generated ok 2012-06-06 08:59:02 by justinklemsz
