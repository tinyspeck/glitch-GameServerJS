//#include include/takeable.js

var label = "Fake Nose Made of China";
var version = "1348259954";
var name_single = "Fake Nose Made of China";
var name_plural = "Fake Noses Made of China";
var article = "a";
var description = "Initially worn on high days and holidays by the loyal supplicants to Humbaba, this fake nose was created in the mould (literally) of Dorothy the Mad Humbabarian Elder’s original falsenez. Painted with inks made by mixing the dyes of various flowers, leaves and spices with donated piggy spittle, the faded scene on this chipped but magnificent nose is intended to portray the birth of Humbaba herself. It is a somewhat messy scene.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_nose_of_china", "takeable"];
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
	return out;
}

var tags = [
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-21,"w":21,"h":22},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIH0lEQVR42s2Y+1OTZxbH\/Q\/8E2zt\nbDvraqkI3aKuAUUFQUEQuYSYEBAIIQn3CAETAoQ74S4oEC4i5SYCKuCFAF6YtVxGW9yxO5aurd2x\n7srsZXa7uz989z0PvG+TEoXpAu4z8503eQnP+3nPOc95znk2bVqH8WTmU6eqomSLOU9jLdArrKmq\nMEuqKlS06f9hPBxv0d8fqsfd63WCbvSUIycjGgSqjQ7a\/NbgRmO9rUOR+3E7PRTD2mBYK5PBw5qy\nYjlAMZKVYulbgfvmcb\/my5FakB426TCm8sFozEE8KFPiZpMBKbJjUB4XQXXygGXD4f76bMLv1ddW\nkL773VV8O9ePP8x0YapcxSDLj7kgwvU9pih3p\/kNhXv19Obmf7x4MP+vl9Mg\/e35fQbI64ZOjDT3\nbT8CinZgQwE5KDMPx+v7348IgAMNBiQGeyJBelTQhq3o\/7ycEf0UjkSuJrivH\/aioSKdLQ47xYdp\n1h0Or6Y2\/\/D91PybAO\/YrF5bpcSH6TfAtVN9juB4F5P1uppyGZBBG4UiYyKi5eEQBx+HNDxs9q24\nlvTPF58x6z2804oSowpZqRHI1GoQHn4aISER2L\/fCx4eXtZ1BXyda23dO8LtHgRXaExhcLyOHDmO\ng57eWM9Vq3+T9Z4\/HsBXsz2oKU5BbmY8ZNJoO0B\/\/xBmxXVaGDNbfng5vbCS9WbHW5B\/VrkMjhQU\nJGGA9fVTmzd0YfDWI8D+9iIoohfhCFKlVAoKC4tkgApVkWjDFoat9Z593oeczCQGl6RWobXOgG5L\nHjobc9BWp0dTdRaO+fpyC8VbtNYLw7oa601cvyC4tqkmh1UyVaUm5BgMHKyJQVLaycgoWLtk\/e8\/\nTUlXYz1SdakBEkk0YmOTGFzbhRKo1emCyJIEmJ6sXpuyi4qBN6UV2+Lg83sXYdAlQ6lMYxYjwLLC\nXNRXFgiAlxpMDHDNdpOV0gpfXpEGO4pRWZLDQHjAkd5qduUBq4p1i4AqsXlt9ts3pJWXT2\/aWW+o\nq8zOWqP9tQyOrvQ9TpEoxGCC1Ne6Bgtj2vI6uD9\/dduu7pu2WhhMU22RAHhGm8ksSdeYmEToM5IY\nIO0wam\/Xhf8J7u\/f3nFajeX4sopvkMiltouCZAvXXJPJCojIvdvQK\/d1+tmAf3k2YXUUcy++HLaD\n48sq2y6u07LoalJpvh4leWkMjkQFBBWtVF0bDzubHzWliwYkHqKsgztWnxefz\/X7EYgtmG2\/YavP\nRptw83KFHSAvikmCashVokoZiHzJIahCDsGUJsO1ZiPmJ9swaZThitQdKaJtkLlsXeBkXjGtPL3b\nMk8P\/+OT68xijsBI85xrOy4YMX611iFcS1UGysI9UR7hjcbCBG4XycT0WCubk9cXV6vQro9GnM8n\nQt8ic936+s5vuiJeT2\/lCMhW1F62a8PR22JaBkelFgGVBotwnnv4rStV+GZuSPDIxK1hdLT3Ym5q\nFGPXW2FIj4Pu+F5mRdWeD5ZA31nu8scNui1jat8FahVnzqUwF9hZjPs+113A2klyS4H3TnQaouzg\nbnUU4VxSKLNcEVfujw5U47snY\/jtxA08nrYKgIMWrqE3p8By2pvNYyvd\/u3k7uXt6b2M4D6CW0nD\nUQdQzE1UfMQZbSF77FTq44z8gD3QJYRzLtWx8GhubIEp\/xzaW9rwbLwZ97PEGIzwwKXQvcL\/NZz4\nBOVHXQRIsmLkzne3CHADqaGiXsm+VcGd93dlk9QF\/NoOrsb\/Y5h8diFdFcaV+WoMdDfZhcRdwylm\n+Yvcb7s1AejPjsRgvoJdOyIPoTHIzQ6Qi8UfC4r+s7JZesiAzP21cDR5wxLcT61nObk4uVbijeqi\nVBiyS2AylbETBmtWOLrD9zEIAmotS0VlQSIK9HGCOuv1aJe4I9\/rI+Qd\/mgR0GXr4n7NVcBSip9r\nJRr2sE7xbxgMiaz6adiiK2iC88mhLG1cay+EtasEnQpf9rfKYy4syLUxQXh07xImb13E9GAVelV+\nGKpMZfFJUMt65CVln4nCtQIl9J472Dx2FuxuMc8KK7Aug70lidzAq08nQd85nZBw7RKzlmstD37I\nJq3lehH+fm9qCMavVMLaX43SHDUDYY0UZzFK2KTFYzkxerhsMFqZLKxiyonRu7YutgVn0rQoyDUK\nlYcj3eZSRXu9gcFRhczfpxxIuTBOtJ1NTL0wu8+B2Z4NUgN\/3nxGeEFeNNflJiMe9ZUi96grWW02\nYtd7UgGOBlW\/cnk8khLTWfVLW9Tli+WCelpKUVOiY1uWNikO2ZkprEIhOHoAWYKO1giwtyFbgKcd\nJi8zBhX5iex3Q91lmOgpxYOuQnxxuYSlspHUIJi58FC4vd8n3\/mu4705RS2flcuicepUDE6f1rBq\nWKFIYaKNnu7TS1DD4+Xlxz5HRcayAqCxMgNajUQANIk9Gdz9kfPosuRi8sYFTLYZWe6kM8NuLqab\ng3dzULvmC32czZSQ7azlaFQki6WaIE\/knU2GLi3BYbuoiFEgKPAEAvz9IRFLWfsYGCiGIjKMxRAP\nSGo2xmK424yOTBkqTuxG7mEnpHtsn1W4\/cIc4fKO34pAjoYl45RFwcWRJsAdxdxmTpbh44Q+88HM\ny+eID2sf6ZRAHRNiByh3e39B6S+yUppwuGX93NEY\/LGTfM8vzdwDZlkm52q2mEMu7OFqsffS2d4i\nIB0CESDpZNBJJMj9++J83TRJ8eFOmzZiKAN2b4nc9ytp9AHnvki3D6w8NMESYJT0hDUgUG5RqAul\n63JKsDT+C1pGzIg0asDXAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_nose_of_china-1348197685.swf",
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
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_nose_of_china.js LOADED");

// generated ok 2012-09-21 13:39:14 by martlume
