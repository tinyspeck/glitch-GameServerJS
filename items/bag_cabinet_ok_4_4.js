var label = "OK 4x8 Cabinet";
var version = "1351897052";
var name_single = "OK 4x8 Cabinet";
var name_plural = "";
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
var parent_classes = ["bag_cabinet_ok_4_4", "bag_cabinet_base"];
var has_instance_props = false;

var classProps = {
	"style"	: "ok",	// defined by bag_cabinet_base (overridden by bag_cabinet_ok_4_4)
	"width"	: "4",	// defined by bag_cabinet_base (overridden by bag_cabinet_ok_4_4)
	"height"	: "8",	// defined by bag_cabinet_base (overridden by bag_cabinet_ok_4_4)
	"rows_display"	: "4"	// defined by bag_cabinet_base (overridden by bag_cabinet_ok_4_4)
};

var instancePropsDef = {};

var verbs = {};

verbs.open = { // defined by bag_cabinet_base
	"name"				: "open",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Inspect your storage",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.isOwner(pc)) return {state:null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!this.isOwner(pc)){
			log.error(this+" not owner and has no key. Bailing.");
			return false;
		}

		if (this.capacity != (intval(this.classProps.width) * intval(this.classProps.height))){
			log.error(this+" capacity mismatch. Deleting.");
			delete this.capacity;
		}

		if (this.capacity != (intval(this.classProps.width) * intval(this.classProps.height))){
			log.error(this+" capacity mismatch. Bailing.");
			return false;
		}

		pc.apiSendMsgAsIs({
			type: "cabinet_start",
			itemstack_tsid: this.tsid, // the tsid of the cabinet that was opened
			cols: intval(this.classProps.width),
			rows: intval(this.classProps.height),
			rows_display: intval(this.classProps.rows_display),
			itemstacks: make_bag(this),
		});

		return true;
	}
};

// global block from bag_cabinet_ok_4_4
var capacity = 32;

function canContain(stack){ // defined by bag_cabinet_base
	if (stack.class_id == 'contraband') return 0;
	if (stack.getProp('is_element')) return 0;
	if (stack.getProp('is_trophy')) return 0;
	if (!stack.is_takeable || !stack.is_takeable()) return 0;
	if (stack.hasTag('no_bag')) return 0;
	return stack.getProp('count');
}

function isOwner(pc){ // defined by bag_cabinet_base
	if (!this.container.owner) return true;

	var is_owner = this.container.owner.tsid == pc.tsid ? true : false;

	if (is_owner) return true;

	return this.container.acl_keys_player_has_key(pc);
}

function onCreate(){ // defined by bag_cabinet_base
	this.capacity = intval(this.classProps.width) * intval(this.classProps.height);
	this.is_pack = false;
	this.is_cabinet = true;
}

function onLoad(){ // defined by bag_cabinet_base
	if (this.label != this.name_single) this.label = this.name_single;
}

function onPrototypeChanged(){ // defined by bag_cabinet_base
	this.onLoad();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"cabinet",
	"ok",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-123,"y":-230,"w":256,"h":229},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHJElEQVR42u1Y22+URRQnakzkQYkx\n4UXa7e62iZHWezQUQsGWAm23Ldt2y8VYFDTERMAbgoFy22633XbbbumdtgIqpUApiQkgWiUxkSdA\niA+CCkbEywMP\/AHj+Z0559uvBBPY7SOb\/DLfN9+ZOb\/5zZkzMztt2v3fFP+uHKh5\/ecD1RO348oX\noYlfDtZO\/Eq4OlI7ce1Q7cTvhD8OL5+4fmTlHYFvAGzR5iq1RR\/o68pnoUn9Xz5QHb8rgvV1z87o\n3\/jyuc+3zLs6snX+GcWhrfO\/U4xuK\/hWcbi+YMKNU23lN7\/uXGbGw0XntM5tr324+96\/Kf9M85q8\nhXet4o2xFfU\/NC4wkbJMU794lgmXZJodSzK4RN2upRlmJwEl3ndK2VKR5TxvLZ7F3xvpeXdJhmmp\n9Jht1FdrZRbXqf3xT+YaqH1P0wyCZ2NljnMltlMcNgrJhtJMBr4De6p9PCDYbsfASjNMc7nHsdu+\nZJZpCiTbR8s85ujm\/NQIjkfXMSEFRg4louQATvV5l8sGBKF0RFRDCdsIkQN2L7WEQVK\/t364On2C\nSgYqNAU8jiqNVOcm2VXjc1SOlln7lgqP8w5bfqc+wiXWLmWCx7aVO86aAkklYlSqUzyjHs5AspsI\nwia+LItJMAGyjQas4rBvlbYgz4TXFadG8EJLIXeq5EAqwp16TJymGwEOZ25Fumv87Lw96GWloVob\nkbWDsP0kqrzcZ1Smf2zz3NQJaryh07jEIOKmnZyqY9RHy+zUd4f83AYE0Qb2sI2p4hXWPsaq2jYp\nE\/yxtdCOlDrpCFpC4dJMZ9pQB4Koj8p099Zms5Kos0pZhZtEdSw0EAZQh2lOiyAINMo0oVM4Uyed\nRKCtMukM3wZWZEt+s3ZoB2KIya4aL5fcDm2wmglHPk4xzVxsLWJVoCCCPxG0CrCzai+lFAuup3iE\n3d4VOTZ1VNjFk5CpxgCQgkAObRC\/usAOb0qR4KV4kTM9cAKSVkmv6aFnvIOoKgJnrCBWscSZfusi\ncnvouQOECRgoFEXfhz6akzrBpBJZHHMgBycgpiStIh6e6v7l2U5IoK4n5HPs+0I+JtcbsgNFn2lN\nMQhCCRCEEugcKuC5v9Zn+gg9oiIUAZGBSQSz6N3P9SC6l55RDpLKXdW2PxA8mi5BAKSgHlRALMEx\nHOEdKkI9KAyCuyS1JJiw3w6M2kC5\/lo\/xanfIdg8FQThGCXUgmqIJzjZ\/1qOoyJUgt3gyhxOM5aw\nJWgV9\/MztwklY5cJbp4CgphCOFGCQyuzJxFskzQyRASjkshBYC+pjHKQBoQ2SlhXNPof3zI3PYKa\n07pFQTiHgnCK946gTR0gOLwqx251QhDTinIfDQZtQFC\/2bCZAoKYBl2JcIiFMrwK8WcdNnOOs2kI\nCuqKTrjaIF6hIGZB61HCLuWdZHKasZ1hOjuFIEq8Q118B0EkahBsk70aRDA4VU8VTwSnaBVzopY8\niB2kWxYE1IiJsnHJefiGPAjCiDG0QVrh1V\/r45Dolfe45kFSfzSdRN0ipw8sFFZMkiyCPy57LYhh\n18BuA4J2RXu5ro+mlBN2jU0z2oZVJ\/toOjvJRTosxOQ41S4jBpk47xh+Z+OHY4QBVOuj00xcDhbY\nn3tDfmfv1h0kvix5qsGKT5mgnmYaZG+1sWZ3CCip7yAJMqogzoLtcjzrEHs9JLTKQRfP+N6YLkGc\nB\/nCVJFUUheA3ZvJebXXWekgqOdDENFjGOIOi4JPMRKv8co0CeLSpBclzoWMZAxpfEIdhAKU6yOC\negrnu2+pfY7JAbelwiN508fP6Dv2fl3qBOEEd1slyRcmOUXrfaRFUpFVxu9cskAONmjfJLGsSvNx\nTC5bKRM82VTHh8+IXLhBsjmQPGG7FYrKZZxvdTIoTC9iMSJXVb67BOydOCH7MNokPqhJ\/dKEmNF\/\nBXABaq20B1i9T4Tlvqx\/ZXRW+5xLO6so\/0K4r6qquP7DMLppTnoE3f\/HIEXAORRSROUi7yYYkUs6\n\/gbRwcTEJiIhoDfElAleTCwx+99+xnTXzTaDa\/JM\/5u5\/I6yd3Wu6Xsj1wzQ89DaPAcj7zznPH\/6\nVp4ZWJNrhqkcpBLvw2uTdf3S9nTDq\/dO8PrJjb\/9eeJd48aNk+sZf52y+PurDeYfwb+nN94R+h22\n2k77cfd9\/cSGm\/dE8MJgcP2xcJGZhIYiM96wyMHojsLLB+sXnh8Bti88PxYuPPtlU\/GZ442Lvsc7\ng77BZixcdMvdFn25+z7RvHjobng9RJhOeOzScPDaT\/uqzO0Y211s1gVmfzNzxvRyssMfjsWEEkKA\nUEkIEqoEQanDt5LVi5\/a1\/Pe\/Ft36hcIFngqyC6D8AQ4CJcH\/4\/ow4RHCTOlkZeQTcgRPE14ifAK\nIZ8wj1BAWHAbCuRbvtiizYuEFwjPE2ZL308SHic8Ir4fuP9n\/FT9\/gNA+XN5Y3cDtQAAAABJRU5E\nrkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/bag_cabinet_ok_4_4-1304533768.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: true,
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
	"cabinet",
	"ok",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "open"
};
itemDef.keys_in_pack = {};

log.info("bag_cabinet_ok_4_4.js LOADED");

// generated ok 2012-11-02 15:57:32 by tim
