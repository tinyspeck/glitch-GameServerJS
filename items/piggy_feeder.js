//#include include/takeable.js

var label = "Piggy Feeder";
var version = "1354648402";
var name_single = "Piggy Feeder";
var name_plural = "Piggy Feeders";
var article = "a";
var description = "A piggy feeder is a must-have device for lazy farmers. It will feed your pigs while you are away.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 200;
var input_for = [];
var parent_classes = ["piggy_feeder", "takeable"];
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

verbs.deposit = { // defined by piggy_feeder
	"name"				: "deposit",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Stock with food for the piggies",
	"is_drop_target"		: true,
	"drop_many"			: true,
	"drop_tip"			: "Add {$stack_name} to the {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		if (stack.is_food) return true;
		return false;
	},
	"conditions"			: function(pc, drop_stack){

		if (!pc.skills_has('remoteherdkeeping_1')) return {state:'disabled', reason: "You need to know Remote Herdkeeping to use this"};

		return {state:'enabled'};
	},
	"requires_target_item_count"	: true,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		//
		// Full?
		//

		if (this.food_inside >= this.capacity){
			pc.sendActivity("It's full!");
			return {
				'ok' : 0,
				'txt' : "It's full!",
			};
		}

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (it.is_food){
				uniques[it.class_tsid] = it.tsid;
			}
		}

		var possibles = [];
		for (var i in uniques){
			possibles.push(i);
		}

		if (possibles.length){
			return {
				'ok' : 1,
				'choices' : possibles,
			};
		}else{
			pc.sendActivity("You don't have any food to deposit!");
			return {
				'ok' : 0,
				'txt' : "You don't have any food to deposit!",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		//
		// Full?
		//

		if (this.food_inside >= this.capacity){
			pc.sendActivity("It's full!");
			return false;
		}

		//
		// have we been passed a food item?
		//

		if (msg.target_item_class){
			if (msg.target_itemstack_tsid){
				var stacks = [
					pc.removeItemStackTsid(msg.target_itemstack_tsid, msg.target_item_class_count)
				];
			}
			else{
				var stacks = pc.takeItemsFromBag(msg.target_item_class, msg.target_item_class_count);
			}
			if (!stacks){
				log.error('failed to find other stack - wtf');
				return false;
			}

			var amt = 0;
			var original = this.food_inside;
			for (var i in stacks){
				if (this.food_inside > this.capacity) break;

				var stack = stacks[i];

				// is this really food?
				if (!stack.is_food){
					stack.apiPutBack();
					log.error('chose something we can\'t eat...');
					return false;
				}

				// destroy food
				amt += stack.count;
				this.food_inside += stack.count;

				var food_plural = stack.name_plural;
				var food_single = stack.name_single;

				if (this.food_inside > this.capacity){
					var diff = this.food_inside - this.capacity;
					this.food_inside = this.capacity;

					amt -= diff;
					stack.apiConsume(stack.count - diff);
					pc.items_put_back(stack);
				}
				else{
					stack.apiDelete();
				}
			}

			if (!original && this.food_inside) this.apiSetInterval("onInterval", 20);
			this.updateLabel();

			if (amt > 0) { 
				if (amt > 1) {
					pc.sendActivity("You deposited "+amt+" "+food_plural+" in a Piggy Feeder.");
				}
				else { 
					pc.sendActivity("You deposited 1 "+food_single+" in a Piggy Feeder.");
				}
			}

			return true;
		}

		return false;
	}
};

function canPickup(pc, drop_stack){ // defined by piggy_feeder
	if (this.dropper && this.dropper == pc.tsid) return {ok: 1};

	if (pc.location.pols_is_pol() && !pc.location.pols_is_owner(pc)){
		return {ok:0};
	}

	return {ok: 1};
}

function findPiggies(){ // defined by piggy_feeder
	this.piggies = {};

	for (var tsid in this.container.items){
		var item = this.container.items[tsid];
		if (item.class_tsid == 'npc_piggy'){
			this.piggies[item.tsid] = item;
		}
	}
}

function onContainerChanged(oldContainer, newContainer){ // defined by piggy_feeder
	if (!newContainer.pols_is_pol || !newContainer.pols_is_pol()) return;

	this.findPiggies();

	if (!this.food_inside) return;

	this.apiSetInterval("onInterval", 20);
}

function onContainerItemAdded(item, oldContainer){ // defined by piggy_feeder
	if (item.class_tsid == 'npc_piggy'){
		if (!this.piggies) this.findPiggies();
		this.piggies[item.tsid] = item;
	}
}

function onContainerItemRemoved(item, newContainer){ // defined by piggy_feeder
	if (item.class_tsid == 'npc_piggy'){
		if (!this.piggies) this.findPiggies();
		delete this.piggies[item.tsid];
	}
}

function onCreate(){ // defined by piggy_feeder
	this.food_inside = 0;
	//this.apiSetInterval("onInterval", 20);

	this.updateLabel();
}

function onInterval(){ // defined by piggy_feeder
	//
	// Have to be in a POL
	//

	if (!this.container.pols_is_pol()){
		this.apiClearInterval('onInterval');
		//log.info(this+' is not in a pol');
		return;
	}


	//
	// Are we full?
	//

	if (!this.food_inside){
		this.apiClearInterval('onInterval');
		//log.info(this+' is empty');
		return;
	}


	//
	// Scan for piggies
	//

	if (!this.piggies) this.findPiggies();

	for (var tsid in this.piggies){
		var item = this.piggies[tsid];
		if (!item){
			delete this.piggies[tsid];
			continue;
		}

		if (item.instanceProps.hunger != 0 && !item.isSad()){
			this.food_inside--;
			item.instanceProps.hunger = 0;

			this.updateLabel();

			if (this.food_inside == 0){
				this.apiClearInterval('onInterval');
				return;
			}
		}
	}
}

function onPickup(pc, msg){ // defined by piggy_feeder
	this.apiClearInterval('onInterval');
}

function updateLabel(){ // defined by piggy_feeder
	this.label = this.name_single + ' (' + this.food_inside + '/' + this.capacity + ')';
}

// global block from piggy_feeder
this.capacity = 80;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("remoteherdkeeping_1"))) out.push([1, "You need the skill <a href=\"\/skills\/22\/\" glitch=\"skill|remoteherdkeeping_1\">Remote Herdkeeping<\/a> to use this."]);
	out.push([2, "This tool only works in your yard or on your home street."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a> or purchased from an <a href=\"\/items\/1000002\/\" glitch=\"item|npc_streetspirit_animal_goods\">Animal Goods Vendor<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
	if (pc && !pc.skills_has("tinkering_1")) out.push([2, "You need to learn <a href=\"\/skills\/72\/\" glitch=\"skill|tinkering_1\">Tinkering I<\/a> to use a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a>."]);
	if (pc && !(pc.skills_has("remoteherdkeeping_1") && pc.skills_has("tinkering_5"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/22\/\" glitch=\"skill|remoteherdkeeping_1\">Remote Herdkeeping<\/a> and <a href=\"\/skills\/76\/\" glitch=\"skill|tinkering_5\">Tinkering V<\/a>."]);
	return out;
}

var tags = [
	"herdkeeping",
	"herdkeepingsupplies",
	"animals"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-43,"y":-92,"w":85,"h":92},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIdUlEQVR42t2Ye0xTWR7H\/WP\/cAZ3\nwHUms27GsBmz4zq6S2bMJJvMHyS7m8wm8wd\/bHaZjHEQFQQBy6tiH7Q8S1sq7S0ttKWlLY9SyqNQ\neRQQqiii66MiiiMC5aUiQgsom43Z5Lv3XAbUERVnrW72JN\/cR88953O+v98599yuW\/f\/XrzajYHj\n1IdhHvUn9ru637gn1VswIgtyneUHuq6JgiLeDlTd5mAHe33oOcHPw8bk77tHNDsxoQ\/BlPEz3NZu\nw6TiF7iUGYjT3PdwJStIXhb5s9CzoqBQv0JNWT9iXSrYBFvselREr4ft0LtwpmzAQF4Qrok2oi9v\nMy5mf4jzgvdwgh2A+vh30Xh4AxysDSjZ+w4MkethjXkHDUkBGC\/bbH\/tgHRnwp78j3Gt+NcYt2zH\nQOEH6Fe8j2varRiy7FpVV4q24oxoE6NLBR\/gnHgTmrlBMEUFuF47oCNhQ2h7wR\/\/dSbzl+jgb0aH\n4COcEG5Bu2ALmnlLqkv9FSxxG2GJCUDFwQBYYx\/Ldoh2NSEAuviPH5Uf\/dzolzCfHJqccN\/xjg6M\nj01dOu+YvtDbcLf7dN3E8+Q69fi8p6d+8rLHM947MTPU2tcn9Auga3Ds7s3puTv3HywuEI17H8yc\nGZsZXIsu3PaOeLwPpsnRb4BdN0cvEgd\/AJwf9c7fXzPg5OzwyOzDqVPDk5MtV6\/6Z0Z3fD9UfvmO\n1zO9sDg3tbDo88w+uPcqDg7S7pM06RgeDvQLYPv1G1w6h27dnV\/03p576B2emZ9aK6D7jm\/06tTc\nOJ0m\/\/DbWtjS1xfRMzbTNTq7MD3ufTgzNvdwzQ5eoZ0nLrpujcv9Btg8MBDsujVx7ub9hdtjdMJ7\nvAvTawXsuzs32jMxM3jipucbv75ROm4MnSJ5ODK7cG9kdn6KJP\/aQuwd7fZMD5FB+hWQ5CHpcGBk\ncPbKxfZFp536Z2Nl5mJ9WTot4aKtgpYu4ZFFG\/+oplyw2NRsmunodtwjA6EniNPvGwXiQH2Ldayr\nLg89TRTaajPh0MfCrjuImpIYNNKy62PQWZWKM3Vc+shGY2kS6uvU83R6HHgjuxk6j8waOetRrSkL\nVj0fioxvnpJcGI5jgnDmXMIPR5F4P2pbbEN+W15+XJz9\/SG1rbUzBioRZUVpKBbvewZyWVTmtzBq\nBYtdg2PUG90TkkVbWxD\/yKhkoVgWh2xOOKS0W\/np4U8DZu2Go7tr2u+TY7VctHc4RgpzI6GVRkOZ\nE8GEdhmMhDiP93eYTZL59uvfa97Kzrq1v39P143h\/qr60hmDhr+4DEdcLBTt\/bfNUTHjvDbgfOPu\nPVnqnMdDGpprPLaGKjSeOrkii92Khm6XfN3\/QjluVYZ0O80+p12Lhiol6isV0CmExrcKpZLxgmW5\nbFY2\/7CQqK1B6yJwRJV6Ccjvl3uag8t0olCllBP6RqA0GmWIrkgZ2mgzs9TybGQL2S5Oapw8NTHK\nVaQQorm2aBnQbdbLIvRFYrpOKgTcJAj5ychIT3VlClJe\/6eotVzPMhvUPpk0F9mZghXlS0QokInJ\n0X39QpOvsUaPziYzrvbaUaRS+LTFhdBr1YzIOVG5UQtbZYlbnJMZ9trgdMWU+3BcbMRSaNNd7KQo\nJmTx8QdDyP3sDK7x0ukGX221CeIsDk47y9Ddbl01B9PSogMV0gxPuVHl47DZ\/13oay2lEZRc6iMg\n5JrklCgj2b3q90pbjTudywY7IZLRi9pNTToQls5JdFEFUl9CQuxPg9RqtYH6YsUKHCndHdawo6kx\nq37wtDdXQ8hJRF46C9zkKLysfTpvfRoNFZaRzvP8tN1zQ4Wcd5T9VJiqzZRwObxPFptNG1hWWoRj\nuVyIBYkQsGOQHL8v5EXtsxOj3Ckp+4PlMslK+rxSqTBrPU+6R0p+7pFVAS2W0lACqJIKcCw7FVmc\nOKTERUa8GDDaTtrSaApZnDT22v8KudzTGXz5bHuoWilDW2OlsNIgX5FJm++mJ4lHfSzDRaRT5tDX\nAqgKsrAMmJ+ZghxeAjI58ZDnHYVCzPUt1ycyqPNcVpPCaFDluIzFErlRpzCSMJM+iVaFcve2RZxz\nOewWI+UjHcpyOVApJOCydiN9\/5cQ7N2F9AOh4MX\/FfyDX0G4e9vSveg\/QfBdCKSJXzOAVB6PyUGi\nI\/F7mDqkrnDPDqbusvixXzNt8RLCkcljMUsWN3k\/JPTgyKDMtBFnOxvkxKwlwLPtPvIjqUSgcpLD\noZTwmIYzvt0KdeynkEZ+Qh+3Myo6tB3GpN9BF\/8pVId2Qsw\/hEJKhizuEhzJQTKTs2P\/DHnUNpiS\nfg8q+rfMs8VxO1BwYNuKFClfMYBkMMuDJpDnTzXB3duxNCF1VDar1V6G+iotLGouSrL3QiEVgjr8\nJSxHv4CetQRTlfYZc9Qf3oHy1BDoEnZAk\/QHSNl\/g1ScA1FaJKRpuyFKCWckS\/wLA0Xq13B3MZAG\n1k7mWTJIct\/EpwHTj8CUtw8tFVL0tFXB1WoDnVK+x0uKOC2Q5IpZJ0e5nkK9pQQ2E\/1etajRVGNA\nq1WJVosMLkcpOqoLmHMip4mHZl0yIz43Dce438GpT0KbIXXl\/nKdlvJc5pnORgPaa1QrbbTQxtSW\nUTBppNAoskBJuD+I8\/QkU4rTQnTKXF9lqRIt9UacbLOhs8WKdkclWu1m2K061Fk0jKxm1QtVYaCY\nga5FRo3sCaglKSQc+XN3KMbifLfFWIjOZgt6Tx7H+e7m56qnq5Ge6WY4G0zPiAySwL4MkDblMRgd\nxWece+YNQoe7VC1lmUvkvrpKDd1ZGZ0T1YyjPxYZxGpwRMTpl8GVFIqeco0Y9GqvO0oUYdYVuK0m\nFRptpfQkehzm5+llIa42F0GvEqMwn\/5clXDdlJjLIqY8j+E\/AeUicJIJWz0AAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/piggy_feeder-1334271709.swf",
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
	"herdkeeping",
	"herdkeepingsupplies",
	"animals"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "deposit"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "deposit",
	"g"	: "give"
};

log.info("piggy_feeder.js LOADED");

// generated ok 2012-12-04 11:13:22 by martlume
