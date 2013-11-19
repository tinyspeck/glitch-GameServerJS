//#include include/takeable.js

var label = "Aquarius Party Pack";
var version = "1353015737";
var name_single = "Aquarius Party Pack";
var name_plural = "Aquarius Party Packs";
var article = "an";
var description = "Swim, float & drift your way around this quoin-laden party space. And, remember … quoining is always more fun with friends!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1000;
var input_for = [];
var parent_classes = ["party_pack_aquarius", "party_pack", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"party_id"	: "aquarius"	// defined by party_pack (overridden by party_pack_aquarius)
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

verbs.activate = { // defined by party_pack
	"name"				: "activate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Start party. GOOD NEWS: permit requirements temporarily lifted for parties",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.party_has_space()) return {state:'disabled', reason: "Your party already has a Party Space going."};

		if (!this.instructions_read) return {state:'enabled'};

		if (!pc.party_is_in()) return {state:'disabled', reason: "You must be in a party to activate. Didn't you read the instructions?"};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (!this.instructions_read){
			var can_activate = !pc.party_has_space() && pc.party_is_in();
			pc.prompts_add({
				title			: 'PARTY SPACE ASSEMBLY INSTRUCTIONS',
				txt			: "1. Assemble the desired group of party attendees by clicking on Glitches in person or in chat, and selecting \"Invite to Party\" to invite.\n\n2. Continue until your party has reached Maximum Fun Capacity Level. While waiting for party pack activation, the party chat channel can be used for smalltalk and metaphorical icebreaking. \n\n3. Once Party Participants are assembled, activate party pack. Do this by clicking 'Activate' on party pack. \n\n4. Every guest in party chat will be sent an offer to create a teleportation portal that will take them directly your private party space, regardless of their current location. Party Participants have a limited time to join, so ensure everyone is ready to party. \n\n5. PARTY HARD. \n\n<font size=\"10\">SMALL PRINT: \n* A single-activation party pack gives a party of limited duration. To extend party length, insert currants into the machine inside your private party space. CORRECT CURRANTS ONLY. NO CHANGE GIVEN. Parties limited to "+config.max_party_size+" participants.\n* Please note, due to physical funness capacity, individuals can only participate in one party at a time.\n* The giants and their representatives are not responsible for the level of fun experienced at parties. No refunds for bad parties.</font>",
				max_w: 550,
				is_modal		: true,
				icon_buttons	: false,
				choices		: [
					{ value : 'ok', label : (can_activate ? 'Activate' : 'Understood') },
					{ value : 'cancel', label : 'Nevermind' }
				],
				callback	: 'prompts_itemstack_modal_callback',
				itemstack_tsid		: this.tsid
			});
		}
		else{
			log.info("Activating party pack for "+pc);
			var ret = this.activate(pc);
			if (!ret.ok){
				failed = 1;
				self_msgs.push(ret.error);
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'activate', 'activated', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);


		return failed ? false : true;
	}
};

function activate(pc){ // defined by party_pack
	var template = this.getClassProp('party_id');
	if (!template) template = choose_one(array_keys(config.party_spaces));

	if (!config.party_spaces[template]){
		return {ok:0, error:'Bad template'};
	}

	var duration = 60*60;
	if (this.class_tsid.substring(0,18) == 'party_pack_taster_') duration = 10*60;

	var ret = pc.party_start_space(template, duration);
	if (ret.ok){
		this.apiDelete();
	}

	return ret;
}

function modal_callback(pc, value, details){ // defined by party_pack
	log.info("Party pack modal call back for "+pc);

	this.instructions_read = true;

	if (value == 'ok' && pc.party_is_in() && !pc.party_has_space()){
		var ret = this.activate(pc);
	}
}

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000008\/\" glitch=\"item|npc_streetspirit_toys\">Toy Vendor<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"party",
	"pack",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-30,"y":-35,"w":60,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKw0lEQVR42u2X+XMb9RnG\/R\/0T+BP\n6A\/MhKYJcRLfjnxfsiX5liVZ97FaHSvt6pasw7Z8ydixnTi2Yxzbwc5BQpIlgQFSkgAphDihMKXl\n6LTTFCi0QKdPX62dEIZppx2mM\/zg78w7uyvtaj\/7PO+xKijYXbtrd+2un97S2y8\/obNeLFQbzxWq\ndecKu3QbhXfufFC4tnGrMDV81ZxIi3y39jm+t3+Tn52\/zm9tfcDrbZcH3cLL4rWX74lvvvm+eHpj\nS\/SGbot87K4oxHcitjUYiN81BwbuF4ZT7z8h3ay2Xj\/YohJElfZZ0U0XPDw5fyH9AI4t3MF79z7E\nyMQN0E2wvHILt25uYf30DWSyl7Gy+hpGJy7hzNkbdM6L2Dz7Bly+DdSqcrD4lmDjlxEcOgt\/+jz6\nmFNIjG1iYPwskhPnMDh1AZMLl2EW1mD2naJYhdm\/CndkHYGBkxBiJ1Dw1H6zuGefCSWVZhjYVRi5\nUzDSydKWW4HB+yy07El0aY6jqXcYGmYKGuc0YnSDfPQYx9GmTUOhzUCpH0KHfhgdpixM1mlYHDOw\nOecwMnkBTs8C3ATsJWB\/cIXi1E6swuNfoO9nwIfWIITXMUwPNDu5inQih4LyKodIkNizz4gO7QyO\n1HhQ08SjWRlBbaMgRUNLENV1LlTXs6hpcKFJHoDWNIZ+8wTqm1g0NDnR2ZOBWjeGVgUHcgU2Rxh6\nUxA6Yx42jUhsBItLK1g5dRJ6A4\/VtWUEQkMS8MLSIt559xWYbVEJMJU+g4WZM9uAnCCIyUwQVgcn\nAVZUuSFXRdHYFkZdcwALa9eh6Axi+ugIXry6iqvX1jAymkH5ET3kyhiOzU\/i\/nsvoa6RQbcmC5cn\nir9+eQdvvyPij396C3YmTIBR\/P3r+\/j6m9\/g3v1X0dnNUUqcwudfbIFho\/jiy\/u4+tL5Ryom05tY\nOXFxG3BvoUOUK91o73ahQzeLcpkL5ZVG1NcpIJORqr1pVDd4MTWdxes3zqK5pQt3t0TwgQiq6hjc\neuMCPvr4OtQahs4dRE2dWQJ0ukKkxDCBLEPZKcDr24YMhNJk\/VH0Gwfx6msX8ekfbuOf+B3c3jQS\nmTOYOnYN2ZHzWFu6sg247yArtqrccHl5dOrmKBdZlFVYoHfUorK8myznIKvzIz0Yx7t3L+HpQhWG\nhpMYzqbISiP+8tmb8Pn9mDuek5SvqbeSMm\/DZveR0iN47fo5dPYmwPFJfPW3LfDBDKzMHOyuefRp\nffj2Hx\/gingGdnYK0cQGAV5FbuL57wAZlyA2yD0ExqC6KYHiCgY1tQy0RiVaO7thYacpJwNIZWL4\n84ObyEiglxGNRck+H37\/0au4ees87t57EbIaCz2QmQB\/LcUnn95EJBpFj3YEXi6BL7+6i6HsBEy2\nGZjt0\/DxEXzz7fuwWn2wmQPghO3iyY0\/BlhVx4nRRIhUYiXAw+UMFYEeZrcM7b3tUHQNoLzaS3kR\nxW8\/fBkLizmyice+AwqyfYRgr0i5mQft6LKgQmbAZ5\/fphQI4ONPXkdzqx292jHKzZhk\/czsJPSW\nabR3crhx8wU8f3ENGjWDyaPPIZu7SBW9jOV5ESsLL2wD7i\/iRDsrkPSBbcBSBxQqLYyuI2iUy1Fa\n6UaZzINkKoJLl09iz94W+syOolIDfvX6Jlg3fV9pkopoZnYMh0t6yPa3oNGaqSCuYmIyC2VXknIy\nLAFOH51AX\/84FYdfslyrc0CvdSMcysEvLFGqLWF1UcTi3Hmk4wTIB0KiEAoSjAftfRNk6RTkVJFG\nVyXURhlKDjWhpEyPgWRYAvzFPhVktX6UlPdKlrcqDdSKAlAq+yQ19zwlkypdodJhdGwQ5y8s02+b\nSF0ncpOjsFjd6OhJoU\/D0sO50K\/hwNhiELyjCPjGEQ7M4Ngzz2H+6BkkImMoqGngxaIyL6hY0No+\niJ4OH9T9cmraFWhV1aHoYCOKi9WQt1E+Wm3Yu0+Bimqf1GZ6+uykuBHVtS6UFjfjUFGn9DDFZVoq\nFg9qGzjI2+1gBS08YRMVSxZdfaOS5XbLIIJxK7xsCj5PEn53FvHQUYykFzAzsYbjUxuIBEZRoO4P\nPsiORZC3ubYpAkWTA+2kSr+jAlpbOQ4XNqCIAIsrqA21uaCQUxuq4giSQ2W1n3KXh6zKAVmFklqM\nG\/XNEVIshsbWOFoUCeispFSgH7lji8hMRtFvDVJDT5GVLEIpNSIZDXjBR6BDmJvYwLHJTUwOn5Qg\ng\/6hNwqO1ApwsEF0qX04VGyXANW6FgmwW1eH8pIWlJMiVdUs2lud6GilaVLLorS8H0J8BXxsGZUV\nGhwpU9A5NrI7BF\/oWcwuvQJV9yC1nghVMU+zlfJsiCaMhxq6dgD+aC9dr4abDWDuxBXKwWnMP3MW\nx3IbyMSmMT22CoFLiQX5aeHxBWlOBnCYANsIsKunA1pzNfqZUnR29kHZzEDZwqBd7iRIVoIsL25F\nYwuL+kYvPUQHhZz6Zhe1GhfGZy9heeMmjI4pymM7fAMK8EklhFQ7+nRqKFUmEsUKLqghFbU4vnwN\n8fhxUu8MZsbWEQuMYWpkBT5XQiw4WCLgQBGHMhpxeQVbG+zo6OyCxkJFom+EguAUO4D5UO1ANtTo\nUEz5WXK4GaVFzQQslyArShVoanbCxqRQJesjy13QGPrhjanAxdrBRXqh1znhDbXDH+sA67HDbkrA\nYRnALFk8PbqGCD+CyaFlcK64KFmsMQho6+BozHkhBOYkwD6TjBQs+Q6SlJUgm3cgKZrqDFTlzduV\nTqBlRS0SaEVpKyrL2iTb87lpcbfBHVLBl2iDycRCrwnCqA3B7mDgCXbD7SfrjXEcHTuNHIGFuGFk\nk\/NwO8JkMb255KaiiMZDaFalsLx5G07bEEzaCHSOYrK6HtouHrpuAQb6LDW8Dqslgx6VR1JS2eJA\nVUXnI8jH1VS0mahBZ2EwGeHwdpOKcnCJVlLXIh17wm30gqCHqT8M1pokW9cwmlqE4Mkg4h+Fy0qA\nB4p92H\/Yg7Z2yiVqyh52FE5TCk5zClpHEQy2JtpPgqVjl3UQqexp+L0TtJ8\/TkvhtqVh1oVg6OOl\n6Gln0KW0IzpwAjNLL8HpGIS+j3I92gxPQAuHOQEnWeokKE+wE1E+h5gwieHEPNKRGbhsEThMVLwW\nQSyoafTjcJkbvyxk6CXBtQ23Ezq7DEZbqwToNCW3tzuwrGU7tkG3YT32zKPwOjLgnMNIJBfh8dLL\niEBWhpQSoOAeQYAbQzw6SzmppgY9QHk3QZA5xAmUMdPrn8EPu5EnQGqm+R7o5ngCZL8HyOShdtT0\nSso+BvgDyO\/U\/D7oIDgmH0OU9Am4Io3gOA94aszpzEmECShEsKH8FPGPS2oyljDM\/RwsBp9YsP+Q\nW5rDap2Xetv3AX8Aa049UpPd2f9v1dwGHaJ2ZgTnjsDvGgbvykpqCp4RBB9C7oTflaEioTaTH3EH\nSxhE4gECdP5nwB01JSV\/pJo+dhj+fORBSc2Ah2YxzePH1YzwObFg79NM4d4Dtgd11D5Kyxz\/FvD\/\noaaPGXrgY4dEn2tI5F3DIqm5TmryBEkxwYe84x3SX88nn2R\/tme\/eb3kfwHMb82pB4wxKUphTooE\nve40pXmnZTtYa8rstmYKHwZrS\/\/8R\/0hP3LE2SHdYCcYU8rMGDOFD4M1\/Mgb7K7dtbt2109v\/Qso\n61ghXCZqSAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/party_pack_aquarius-1348171129.swf",
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
	"no_rube",
	"party",
	"pack",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "activate",
	"g"	: "give"
};

log.info("party_pack_aquarius.js LOADED");

// generated ok 2012-11-15 13:42:17 by martlume
