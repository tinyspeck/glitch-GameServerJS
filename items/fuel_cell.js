//#include include/takeable.js

var label = "Fuel Cell";
var version = "1342643724";
var name_single = "Fuel Cell";
var name_plural = "Fuel Cells";
var article = "a";
var description = "Hundreds of tiny power-pellets in each capsule provide gigajoules of energy to fuel the machines.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 380;
var input_for = [190,192,253,277,278,279,280,281];
var parent_classes = ["fuel_cell", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/714\/\" glitch=\"item|fuelmaker\">Fuelmaker<\/a>."]);
	if (pc && !pc.skills_has("fuelmaking_1")) out.push([2, "You need to learn <a href=\"\/skills\/91\/\" glitch=\"skill|fuelmaking_1\">Fuelmaking<\/a> to use a <a href=\"\/items\/714\/\" glitch=\"item|fuelmaker\">Fuelmaker<\/a>."]);
	return out;
}

var tags = [
	"fuel",
	"machineparts_products",
	"advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-18,"w":33,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKFElEQVR42u2YaVTTZxbG09a2VgHZ\nIhDAsEYSQggkJIQlJAQkLAkgRHYFpGENhF3UgDqIiBUG7WGpSC1FRCoiWBEkbKXtYEvtbhfrVDt2\nOp22H+acacucnvaZN9GpM47TM4PifOk95z3kAx9+53nuc9\/7\/imU\/1BubpTHWUITFkds2cKVWs76\nhFnP8OXkRFrrBYq1Hf6x1go\/FdWW\/OvDlAdcD9E5FGcPP7NjLH9zePDXwEOwBlyZFYSxNghIsEXw\nJhrEKfZ\/EyfbveSfSI2kqCiPPDA6Z2eKjSvHRO\/ONYUz2xSsAAtww6zgr7RFZLYrNlV4Ib8hGGXN\n4Ugs9URIuv11Aqzh8SiPLjucgwPFks40Oe3kaQInArdeYA7PIAtwJJbwi1oLaaojYtTuUO8KxqF+\nNeqPJiOuiAlJusPH4gzaVrdIyuPLyfeovduqvY4ME6zzMIEr1wwMvzVgEps9gy2MFouUdghNXQdl\nngeKG8LQ9kIB6ruTEavxQEia\/UeSNPsty6akgwvFne5h8hcjINMELhxTuPnchPS4BUmCQiBtEZpG\nR3whC2VNcrSdKkRdeyKic92JkvZTIam20uWAXOHitbrFoJwB0HG9Ceisf4dkGyGpEMXaQZbuhAQN\nG1XNMegY1KCuTYWYXAakGfaT4gybUJaK8tj9w2NRHnPjmnxEFMQvQopuQvqGUxEQS0NYmhNUxWxs\n+60CnUMEsl0FRR7DoKQ+OM1Gdt960smJstKTKEQCAkNA7oR0vgskj0AGxhHIDCckGiGVRsjatgQj\nZEgabcIAKZFQVt4zoGEo+4RQ4UzgXLx+AdL3NqSX2BK8DVQExdMQvplAlrBR\/lQknh7IQ3WLEvKt\nLmQE0cbFqVTxPfekwQqRnAaGjyncfe6AXH93JZkGyODbkBs2OyOh2BMljeHY1aFCRo3AYDXEqbST\n4mSqD1FyxdJbkDS0WOn4B7a\/JVjCNf8TJFtM7I4gPUnsDk50QIhqHcJSXRCeThRUOSIw3u57fyW1\nix9twV4ypIpcVZIE+g6e1Aa+Eio8\/xtI39vpZgWYgxNkDaHUERtimNiYxMOmNCGS0wPIXxFkCvdF\nvsymy0dmyVry3R2otKYJwmlX\/CNo8JWuhSE07r6GFBtulZuz8U5IwzB3J6DeIlso4r1RWa5AW2su\n+p6rwmB\/Hc4NHcDkaBsONRchWx34fUq217bUfC+LpTr9CD\/MJlu4gfaeSG5PlDRAWtwV0qCoi5eZ\n8XAENkjPCEBLUyaOd5di8MR2nB+ux\/SFg7h0sQvXPh7G1cvDeGmyEX0ncqY6jibzDQvJ0hBJj3BE\n1in+EQ5XjZDE8jshjeqxzeDKMQfTxwrxG7nYo0tExyE1eo4Uo7+nHGcGdmLsbD3mpppx6bV2fHZ1\nGJ9fPUt+tyzOzlTvHx8vcASWCGkYOVzx2gKR3OETcn62m3EL0tWbLBG+FljPtUJ4xHoU5oZiR6UC\nrU1b8GyHBj1dJTj5fCVGBnWYHGvA\/FwLLr\/bjT\/fuIAvrp3Dpdebv5qerqzU6wutlpxqOx5llXeI\ndZko0uEbAyTvnyAZPDMSImsEh7qipCgCNeUxqN0Wj9YDmejuKMKxZ4rR263Fqb4qjI3U4eXpRry5\ncAi\/\/+Q4vv5iCjc+HcHCa00fzsxUZQwPZ5sufS9kr7bhhdo2EsCv\/YndRkgRUY4ssExfK0RGcaDb\nloB9e1JwoCEDh5tz0NVeiKMd5LTnEcgiomI1ZvS7sXDxAN57rw3XPh3AN3+axmdXTuG1+caFmckK\nxcCA6omlX4F+q235MtumALnj4j8gmQILuHlaIDCAgZxMGfbWpWJnVRzqajaiZf8WHHoqE417VGhp\nTCH9WIjJ8R343at7cenNZrx\/uQPXrr1wE\/KTQbx+cd\/49HQpf3pasuQh\/hDTx5zOD7XrCYh0XBRF\n2oMTSIUbyxJ8Hrk54oSoLlUgK9UfW8m801UqsXeXChUlEdBVx+DYkWyMjZZjdlaH+YsNP0NeN0B+\nOY1rVwYW5+f39E1Pa52WnmwyfrxEFl6CMLvnAqIcF3lSOzCY5AkgcEVachDKi6OQmSzElmQBtlfE\nYH99MnZWK9CwOwHHe9Q4P1oGvb4aL83VYX5+L964dBCXL3fi+vUBfPXFBK5+1Lv4ypzu4D2FxrAv\nsgXWfAJ5nk8AuXw7op4v8tUyVJbGoFwjR3VZFJoaUtB+KBsdT2fi2aM5GBwsxjmi4NhYBcbHKoma\n1dBfIGrO77+lJIH84wTeeOPgN7OzVRtHRzVLX8\/Ie+UJLyE1iiWgvurJpSJUwkCyyg9F+TIUqqXQ\n1SjR2pyB9sMErisH\/f2FOH26BCNny4yQQ6c16D2Wg+PH8nD+XI0BCh9+2InPbwzjgw+6MDe349l7\nVZFCZVFMyAqW7Ohi8q6rqzmxmY7YGDYUciYJTCBqtytQWx2Nel0snmnPxMmTRQRSa4QcPEVGUFcW\nujuzcOZ0qTE4b7\/Tio+vdBPATrzysu7G5GQ5\/Z53R3NzijnNcVWWo7PpnLub5VdCvgOkQU5ISvCB\nJleCfAJa\/KSY2K3C8z15BFKD00NanDmjxcDJAgz052P0XDlRbBdeX2jCW2+3YmGhkQSp6qepqULP\newnLz7VmHcXC1n6l1INhcTgogP5dtNwDW9KF0BRIkUcAS9QSEpZEHCV92Nubj4GBW5DDWpw9qzX2\n5ORUDQlOLV5+ZRdmZrdBP1mKiQlNdGen+r49uFZ4e1t6ykJdj8THeX2XlSlCUZEU5aXh0G2PwYGm\nJLQRm7u7nzRCnugrID2oxomeXIwMlxghJ\/RVBKyKwFYYAfV6TTAZ3Pf1K8UKicSFr1B4nkpK8vkx\nM9MfiQm+kEewUVggQ2PjJhw+vBldJDRPN6dhX20cGmuVOHI4DWeGijE2XoELE5UElCg6WXp9YiLf\n5b6\/pw3LRUgIXRoV5TEeHub+o7cXDWwWDQpyFRbkhqCmKgoHGpOwZ4cSVYWhxrNPp8DJvjyS7rJb\nkERBvbb1xRfzLSjLUYZXoUzmmiTwc3iH4W71E8OdvFNEzognCc\/JCsTuujiyUESjPE+KCtKnDTuV\n6OvNw9kXb46g8QtlH5y7UMS\/3\/b+SwmFlmZCIS3Lj0d7P1BER3ioGxSRTGRt9odOp0T97o2oKYtA\npUaG\/b\/ZiN7n80hwSghk6V9Hx7XZIyPqVcv+8UkkMrMMCaZvl0cwvoyJZv4UH+sFtToY20lodu5Q\nQEvgkhL4KHwyBC1PpeBEf8G3Q0MlBctm7d2KyzU3l0ickuVyxsXERO8ft24NhFYbhpKSMChiuAgU\nMSARM1GzLfr9o89kZw4Nac0f9AdQ0pNOK4OCnL3DZYxaouJbWzYLvy3Il\/ywOV30Q1QE59N4Je+g\nRhPm09wseoLyf6yHORyb1Rs2uK5Vqbztc3KEDmlpQgel0tlGqVxvWlf34D8d\/1q\/1lLq74wAvxtw\nQ2IVAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/fuel_cell-1334969527.swf",
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
	"fuel",
	"machineparts_products",
	"advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("fuel_cell.js LOADED");

// generated ok 2012-07-18 13:35:24 by martlume
