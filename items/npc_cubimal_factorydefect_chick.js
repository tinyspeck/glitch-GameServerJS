//#include include/takeable.js

var label = "Factory Defect Chick Cubimal";
var version = "1345785390";
var name_single = "Factory Defect Chick Cubimal";
var name_plural = "Factory Defect Chick Cubimals";
var article = "a";
var description = "This Factory Defect Chick Cubimal was hand-picked straight out of the garbage bin by an assembly line worker.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1511000;
var input_for = [];
var parent_classes = ["npc_cubimal_factorydefect_chick", "rare_item", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"quantity"	: "171"	// defined by rare_item (overridden by npc_cubimal_factorydefect_chick)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.owner_id = "";	// defined by rare_item
	this.instanceProps.sequence_id = "0";	// defined by rare_item
}

var instancePropsDef = {
	owner_id : ["TSID of the owner player. If empty, it has never been sold."],
	sequence_id : ["Which sequence in the rare item catalog was this one?"],
};

var instancePropsChoices = {
	owner_id : [""],
	sequence_id : [""],
};

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

verbs.race = { // defined by npc_cubimal_factorydefect_chick
	"name"				: "race",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Race it against another Cubimal",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.is_racing = true;
		this.racing_owner = pc;

		this.former_slot = this.slot;
		this.former_container = this.container;
		pc.location.apiPutItemIntoPosition(this, pc.x+50, pc.y);
		pc.announce_sound('CUBIMAL_WIND_UP');

		this.apiSetTimer('onRaceStart', 2000);

		var pre_msg = this.buildVerbMessage(msg.count, 'race', 'raced', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function onRaceEnd(){ // defined by npc_cubimal_factorydefect_chick
	this.racing_owner.sendActivity("Oh! It's broken!");
	this.setAndBroadcastState('1');

	this.racing_owner.announce_sound_stop('CUBIMAL_RACE');
	this.racing_owner.announce_sound('CUBIMAL_WIND_DOWN');

	this.apiSetTimer('returnToPack', 3000);
}

function onRaceStart(){ // defined by npc_cubimal_factorydefect_chick
	this.start_point = this.x;

	this.setAndBroadcastState('race');

	this.apiSetTimer('onRaceEnd', randInt(2, 10)*1000);
	this.racing_owner.announce_sound('CUBIMAL_RACE');
}

function returnToPack(){ // defined by npc_cubimal_factorydefect_chick
	delete this.is_racing;

	var remaining = this.former_container.addItemStack(this, this.former_slot);
	if (remaining){
		remaining = this.racing_owner.addItemStack(this);

		if (remaining){
			this.racing_owner.createItemFromFamiliar(this.class_tsid, 1);
			this.apiDelete();
		}
	}
}

function canPickup(pc, drop_stack){ // defined by rare_item
	if (this.is_racing) return {ok: 0};

	var owner = this.getInstanceProp('owner_id');
	if (!owner) return {ok: 0};

	if (owner != pc.tsid) return {ok: 0, error: "This does not belong to you!"};
	return {ok: 1};
}

function getLabel(){ // defined by rare_item
	var sequence_id = intval(this.getInstanceProp('sequence_id'));
	if (sequence_id){
		return this.label + ' (#'+sequence_id+')';
	}

	return this.label;
}

function onContainerChanged(oldContainer, newContainer){ // defined by rare_item
	if (newContainer){
		var root = this.getRootContainer();
		if (root && root.is_player){
			this.setInstanceProp('owner_id', root.tsid);

			if (root.is_god) this.no_sequence = true;
			if (!this.no_sequence){
				var sequence_id = intval(this.getInstanceProp('sequence_id'));
				if (!sequence_id) this.setInstanceProp('sequence_id', getSequence(this.class_tsid));
			}
		}
	}
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "There will only ever be 525 of these in the game."]);
	return out;
}

var tags = [
	"no_rube",
	"no_donate",
	"no_vendor",
	"rare",
	"collectible"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-28,"w":31,"h":29},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJLUlEQVR42u2Y+VOTdx7H+x+4O+tu\nRzlyEEg4I4d2mVk2tq6d6ehCZ9tq23FLu7XdbscuolYFq0FFQBRpqUJAjohCCAQSrnAFknBfcoVA\nkLNyeBstan987\/f7hHAUEqGrnf1hn5nXPEMO8sr78\/l8n+ebV175\/2E5cr9mi+QRbKXiG45WFcXT\nlkXztFUxbsracwKxJp4fVhcvEFH6knmiX11Oss9BmHnACdlfs5B7lI38YxwUnXBByUke1GdcUR3H\nR228AHXxPHPXRZeQX13wxIe\/D5OEsZF9mAtZpCuuHmZBFsFGwTdcKMUuKD3tioZvfVB\/gW\/OP\/Lb\ndS9FouQkW0QSEaljeKLKODfh4ueOffgbVvynryol+zbiyiFHRkp53BnKEyyUn+KgKoaL3COO3ZfD\nN7749DIPOofmHWWP0zRo2YqjeCgjiVSccUNVHH9cc1agpX3WlMgTZx5kQRzqiKiPHaE+6SiqiWWL\nGxLY4qozzmLJvj8IX7hc\/GeOIukhlpn2Vg7pLXkkB4q5stH+Ko92RWWMG2pIj9E+q4zmQ3HMCSlH\nvTA7vF1kHvAVmQ2+wpfWW8c\/WC\/67l+OkHzlQEpnkaRDICdDoDjOhYr21ykeas97oT7RA80JXBRE\n8TE7tht3DW+ip9IbnaUueDjgy3ppknGfvBoijXAaT9\/vgJwjTiQ9Lipi+CgnJS455YKyU1xSdjfU\nx5NJjeUiJ4KD231vw6DxR6uSwzDVtRP9ta\/BpPXJeqFyT4b8Q5+YArRPhjZDHuOCM586ImmfE\/QS\nV7RfJpN5noOWRC7avuVhokGIkhgB1In+mGgLJjILgr1Vfsy5R80zPx0KEDOYAn75wPw05suyilkZ\nznNH\/TkOYvc6or\/Kh3nsUb8\/bjdvwrBGiI4yL9ztexdm8thwk4hJzCpoxVQnmP9\/T4bfwIDGPWzN\nYrNDAcrFYosFaVqZBxYEFzPV4YtHpu241+O3ohxlosWbvDYQ5hu70FkZiDoZ17xqORr7SmI\/F7x2\neLngzHU\/3KgXktIGMQn2VHgsk+tW8\/F4+B3caNmBujyXeZ6f2vBm0awpYNye3AODP4xX+fOCOpkH\nI2V9\/naXH0ZID\/bV+GJI57dEsKXIBWOtIkz37UaTyoeRqpVx57GfGmlU+gFPR960KfeQyA1qfdCU\nQ9a5JBdciWGjIpuP6xVemCZltb7u8UAAIzqk94G+wB2dZQKmF+8OfIDWMv9lYqsSJMmZF2QCGdGn\nozuY87OJ9\/F0LIQ5z46E4FbPNky0v4FxUsaZTl+YjQE2vxR936OxLzDY+NaKUhRNrgU7S4iv0F5Z\nlxKIJzRl+gXG37dw8zM8m\/wSz8j5p6kvF5g5iGlDKHQF\/CVCjbkCdCsCGVplPqjNeY6gtbz2IAkz\n\/DhogZbx8YA\/HlGM\/iRFf2YoHjJswbOpf2Os491lSdVd42K8aCfuN4ThQVM4HjQfhDEvCJpr9gRt\nTO2apAx+ZIDm6PPDj6O7yZSGLCkhRZ9GFvMkNxgyN+OGbCtZEbZhWP4XtGQIVidoU8r4fKn7lF4\/\n3Ov1xeORXYzgYjmKOoVNLoksqE+zUBHNJjcVbFSTYash2B4QIrhmqb7lUvd6fHGX0k0W6uEFwZqc\nBSqvcpB20gGJ4RvInc5G5MU5Q5XEQpnEnuBggHi1UvftSN1h2ESWmE2MYG\/dtiVyVqQJTkg8sRFp\nseReUUoSJP1Xba8HHxv9xFapacNe\/NAfjRlTHKZNsWTt+mheihHqnRNaQYpy67oFeglrL\/\/jvJRV\ngpJ\/iYX0eEdc+84ZVSRRSmU2Z0EQo\/7rZk2bsx4Z\/bofzKVBk5rs3oXm5mb09PRAr9dDrVajoqIC\nk+QWySp1x47UTCdFiGnCw6H3YNS\/xQhlnXdC5vmNKJ9LqyyLbKaSSWnTWYxYLilxWqwz5sVMlULc\nISv9ILmOmjQ+zIdQ0TbtabS0tKC0tBTt2ghIM84iOzsbreRxRqrLjlSHhSlKuxAPiOBQcwiKJFzs\n2cHHP3e7QCFxnE+r4gq9CtEzBwc+ccVHfyVTTBfkzgJvtMu9MNkqhOqcgLmr6CjwYkpXoYpjBBUK\nBSOUlRqO5ORklBXGQCd3h6HGy67UZLsPJtt8cJNwq+d1RvBkGAs7\/uSEnUHOkF10mJdSz1Eu5WDv\ne87M8\/MlvtXlLdJnCkJ1UndlR5E7rqs8mPKp8o5Ap9MhJyeHSalQJoZcLkdmhgTFxcUoVWVhpN7L\nptTNVh\/8MMdM91aYmoKR9z0L2wPX4+9vr0ehxMkiJrWIlWdxSLk5OLR3A\/YE\/27lIRmt4a4bbfIS\nU6FuzXampBkZGZDJZMjPz4dUKkV6ejqSkpLwbdwX6Cz3sClFq0EZb\/bGdNdWDBJBmpaCiOVdckBp\nJpsRK5sTo39TSgj0NTan+FaXr4gpHUFf9jnTgxKJBPHx8bhw4QISEhIQfcgXF46x0aQULEi1LJVi\naPLGGGHqOhFsDF6W1hKxDAvFlHS2fUFrTw0PVEGlUiE9JRIF0j2MaEbyflIeHq4kkvu6YoENKS+M\nNXphdI7Jzq0YIIIrpbVYSmXlsj3Bdm8R7SdTy+fMkMTGxmKk0R+ZabFISUmBMnsXGgrJ7k3Kg7HW\n06bUSIOF4XpP3OwQYaAh2GZaViklJY2NojQ7gpNEkPZUS\/VXzARHRUWhufIfKCkpQXR0NPo0W8gE\ne6CtRMBIjdqQotzQW5hoF8FYH2xb6rJFilKYyiI4J9oUnGrzFNKeqi78GKmpqYiIiGB6LzIyEleS\n31kiNS+0gtSQzoJJ50H2JH9GPxG0lZZVTJHCMitSnUOfux+ZIGVrLt2K82cPIzw8HPv370fWxb+t\nScqk9SBbAkKdB9l7EEF98IppKSQW8lNY43kSh9X9HEKWmu5fktRiqQFKrTvpU3eMtgTBQAR\/LlaQ\nwohBnsxS5qeu4ee3kUbP0P9WitKvsTDSHIQ29esWKatYMoushyyz\/OIqSrrSMdbkzhrSe4YO6z3E\nQzoPpUnnqWWktHakNAtShhqKAH3VdBcXhLqCLUxaVEx+ico5Z127uOHF\/3hErzYDdQKRsY4fYqwV\niI01gqx+jUBr0LibF0tReqssGLWvMVKyS6zuvO+dw9ZUzpd1EEHRAoGi\/wmpF3n8B52YB6+B\/nEn\nAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/npc_cubimal_factorydefect_chick-1345077500.swf",
	admin_props	: true,
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
	"no_rube",
	"no_donate",
	"no_vendor",
	"rare",
	"collectible"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"c"	: "race"
};

log.info("npc_cubimal_factorydefect_chick.js LOADED");

// generated ok 2012-08-23 22:16:30 by martlume
