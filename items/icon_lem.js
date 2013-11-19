//#include include/icon.js, include/takeable.js, include/npc_conversation.js

var label = "Icon of Lem";
var version = "1354842526";
var name_single = "Icon of Lem";
var name_plural = "Icons of Lem";
var article = "an";
var description = "Though looking too long at the Icon of Lem is rumoured to cause brain-melting, supplicants who adore it with due caution can expect many glorious benedictions of Lem. Or 'Blemedictions'.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["icon_lem", "icon_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"actions_capacity"	: "20"	// defined by icon_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.actions_remaining = "20";	// defined by icon_base
	this.instanceProps.testing = "0";	// defined by icon_base
}

var instancePropsDef = {
	actions_remaining : ["The number of actions remaining before tithing is necessary"],
	testing : ["Set to 1 to cause a bestowment check every 6 seconds which will always result in a bestowment"],
};

var instancePropsChoices = {
	actions_remaining : [""],
	testing : [""],
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

verbs.furniturize = { // defined by icon_base
	"name"				: "furniturize",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Turn into a lovely wall decoration",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (config.is_dev && pc.is_god) return {state:'enabled'};
		return {state:null};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];


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


		var pre_msg = this.buildVerbMessage(msg.count, 'furniturize', 'furniturizeed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.tithe = { // defined by icon_base
	"name"				: "tithe",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Insert $cost currants to support the Icon",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		return this.icon_tithe_conditions(pc, drop_stack);
	},
	"effects"			: function(pc){

		return this.icon_tithe_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.icon_tithe(pc, msg, suppress_activity);
	}
};

verbs.ruminate = { // defined by icon_base
	"name"				: "ruminate",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Soak up the happysauce emanating from the Icon",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		return this.icon_ruminate_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.icon_ruminate(pc, msg, suppress_activity);
	}
};

verbs.revere = { // defined by icon_base
	"name"				: "revere",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Let the Icon replenish you while you adore it",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		return this.icon_revere_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.icon_revere(pc, msg, suppress_activity);
	}
};

verbs.reflect = { // defined by icon_base
	"name"				: "reflect",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Dwell a while on the true meaning of the Icon",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		return this.icon_reflect_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.icon_reflect(pc, msg, suppress_activity);
	}
};

verbs.place = { // defined by icon_base
	"name"				: "place",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Place this Icon on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.icon_place_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.icon_place(pc, msg, suppress_activity);
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
	"sort_on"			: 57,
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
	"sort_on"			: 58,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.talk_to = { // defined by icon_base
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 59,
	"tooltip"			: "I have something to tell you!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var convos = pc.conversations_offered_for_class(this.class_tsid);
		if (convos.length) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 1;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var convos = pc.conversations_offered_for_class(this.class_tsid);
		for (var i=0; i<convos.length; i++){
			var conversation_runner = "conversation_run_"+convos[i];
			if (this[conversation_runner]){
				failed = 0;
				this[conversation_runner](pc, msg);
				break;
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'talk to', 'talked to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function onCreate(){ // defined by icon_base
	this.initInstanceProps();
	this.initInstanceProps();
	this.apiSetHitBox(300,250);

	this.tither = null;
}

function conversation_canoffer_icon_lem_1(pc){ // defined by conversation auto-builder for "icon_lem_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.stats.level >= 10){
			return true;
	}
	return false;
}

function conversation_run_icon_lem_1(pc, msg, replay){ // defined by conversation auto-builder for "icon_lem_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "icon_lem_1";
	var conversation_title = "Books of the Giants";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	if (!msg.choice){
		choices['0']['icon_lem_1-0-2'] = {txt: "Beep?", value: 'icon_lem_1-0-2'};
		this.conversation_start(pc, "Beep. Beep. Beep.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_lem_1', msg.choice);
	}

	if (msg.choice == "icon_lem_1-0-2"){
		choices['1']['icon_lem_1-1-2'] = {txt: "Created had?", value: 'icon_lem_1-1-2'};
		this.conversation_reply(pc, msg, "Prepare for Today’s extract from the Book of Lem is taken from Sector 314, Latitude 4.2, Node 6. “And so it did come to pass that Lemuel, son of Lemuel, did become the very first giant to lay down his world-sized tools and close his brobdingnagian eyelids, and slip from the greyness of the real world, and start to roam mindfullingly through the world the giants created had...”", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_lem_1', msg.choice);
	}

	if (msg.choice == "icon_lem_1-1-2"){
		choices['2']['icon_lem_1-2-2'] = {txt: "Ohhh...", value: 'icon_lem_1-2-2'};
		this.conversation_reply(pc, msg, "“...And roam he did until he knew every corner better than anyone imagining, imagined or imaginable - giant, critter, bureaucrat, spirit or world-liver. And thus did Lem become the Giant of knowledge, of directions, and of advice.”", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_lem_1', msg.choice);
	}

	if (msg.choice == "icon_lem_1-2-2"){
		choices['3']['icon_lem_1-3-2'] = {txt: "Wow.", value: 'icon_lem_1-3-2'};
		this.conversation_reply(pc, msg, "Thus endeth the extract. Time to leave. Beep. Beep. Beeeep.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_lem_1', msg.choice);
	}

	if ((msg.choice == "icon_lem_1-3-2") && (!replay)){
		var context = {'class_id':this.class_tsid, 'verb':''};
		var val = pc.stats_add_xp(111 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
	}

	if (msg.choice == "icon_lem_1-3-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"icon_lem_1",
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "Icons placed on the ground have a chance of bestowing blessings when you walk past."]);

	// automatically generated source information...
	out.push([2, "You can make this by combining eleven <a href=\"\/items\/587\/\" glitch=\"item|emblem_lem\">Emblems of Lem<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"no_vendor",
	"no_donate",
	"icon",
	"emblems_icons"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-48,"y":-103,"w":94,"h":93},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANe0lEQVR42tVYV1cbaZruf7C\/YW\/3\nZvdqL3pC7+ndPc4mtG1yEDlLSCAJSVgkSSQDAiGySSY3ySYIhCyByWBjMBkJgXICd0\/3nDNz5uKZ\nt8o9e92aPXMxOuc9VaWq+ur5nje\/X30VxO\/zYVHC7WGRkTn+7fzXyOfjom8+H0nk7Pkn0b9\/9Y\/6\n\/dk9Kf+TewJ\/uKjvZoQ5\/zXCgPv5qtPInP\/FPfHN\/xvIH262ja6rBaPnesnotb0lMRl9dDz9MGbd\nMbXDejKzZzme3tsxtWLLoMW2sRXMOXNvl2TH1Ibdlc7\/E69txXj28Xvr7koXrs\/n9wLONVpz2ehz\nrJCssoI\/f\/r1zP50uwPX5TxcVh18dhM812\/hd6wg4FyH3\/kOftsyfNcmeK+M8FgN8FsX4aZr+7kO\nAccqArYlOhroGcOXZ0kIEK2x+kWca7+stcb+77O\/A\/5y\/OuZ\/elmB24GHAHz2d\/Cc7VEH3lL\/xng\nYIDZ6WPOLx\/zXhpwYzdCN1iGPUMrVuaaMf9Kilt6JuBcgd++ihvXFiznBgTcW7hxb9P1Np1v\/iIb\ntNZ6cAB\/vt0lUIvEnIFY1BObi\/AS2MnZVmJtCZ5Lhp1lYk+Pq6M3mBlWYW5Iiak2CYaaRRjrLsXL\nuiw4zt\/AR+v4rmmDxPbMtBo33l0CuUOgGHAE1vsFbHAMkooZcJ4rPQF6ywLxkqqNq6\/Yj7ot88Qc\nqZPut1ZnolnNx3aHHCv9SoxWpuFjnwJNFZnorEmjzc3ixkbm4VjGyHg9Pnt2EXD9AtC1iRvPDsts\nkAzukG0skUrJtiwLxJiJmJrHcGcZHFcG1v5+dC1BnBmKOkkKKrufQ9rxHMoBKbqmhRiekaJZEYM6\nRTp+8izBdTqLlpdl6B2uxa1rl1Wzz7EBr2OdQG6xQIO2QZdZR+zpSTV6AqiH\/XQG9WouGrVFWDN2\nw3axjP1Pw5CM1yJXI4awTYCxzkTs6isxNsxD+xgfDQ25iLzzb9AvtqNCkYeWJik++\/YI3CYLjFE1\n4yyBYG2QwgxcpEafZZG1t8neYiwOV2CyQ4z2Wh74wngoqnLRNJCGxl4BwsviICiLh3W\/G\/bDVjg+\n1kL3Rgh5Cw\/V9QWoaRRDXMXHYBMfcwPlGGhK+6JeUi3jwQHHWvAMMs7gJ0\/2kK2NacUwjNRgoD4f\nyqIo8ETxGBkuJA\/dhv1TMwSSe0ivy4NzQwL7Xg3s22V43RWBAq0Q\/IZ0CIrj8ao1E+OtEhgHlHjz\nUk72bSAt0Po2PessQQH80b+Bq8MxeC\/mYTuZI4BCdBGAWlksUpv5iK3JgmE8HxerKlg35UhTZSOm\nPAUJZHM1rekYnytDVlUqeFoeOtrTMdQvgLqHj8O1fIyqUzGqoc05N3BLwLxkz0ED\/CmwRU4xhauL\nWWLoe9QRsM0dDRKrs8Gp4SGtWQaxthDF2nSUdggQV8nFU1k04pXpiChNQiwdo+iYXZkM64YM7rNp\n9FTfQ1tfHlbWZNCWJRJ7FBedjLNQ0CaHCc4G\/ZuwHPShtSQMZrKrvNwHyG8pQmQlB0XKZyhuKkRK\nvQg9r3JwTc+5VjPwRBiGyOeJeCaLR3RJEuIr0pBQGovKjhx499Uwb8nR01EAmTobss483F4vUqBf\nw831JjwWXbAMbsN5MQbHwRCq6hJgXuRD2RKLiUEJWmsEsB2qEVWfBXVNOCwbUlSoExFTFIkwURSi\n5Bw8kcQiRxkLST0HJc2ZdB6NTNpchCQE4tooXBnIZPSdZIcmOM\/1+MGzFTyDtuNx2Pe\/h5DYiiV7\nSmngY7SDC\/vHKpwZRIgqjEJYSQLCC8IRI0tEuCACT8QxdIxCkigMjVX3MDaQh2oCn6GMQ4o8DP1t\n8UhRJOOpMBIcQSxumDBmnqCgbwreBl1nUzDv9uDw3TieKZPBqcpCJmUM5sioL1LGQXlDArYW63Cw\nVoAkcTxCBJF4JopBoSoetg9aCjlaHJpk4KuioOrk4Wi9DFX1KXiU9wyXZ5QqT\/pgPx5hi42gATpP\nX+N8qxdXHwzQdikRIopEnCINEcUcREsTkF4Rj942DjTSb2HZUkBan46w\/AjczQwjdh7jRc0jXG7I\noe8NA1eZhMic+7jHj8bdhN\/ibvT\/EvgpnL3X4ops2GtZCg7gD95V2A\/GydZGiMVB7Bh7sLU8ikep\ndxEjjkMEsRSaex+NdbE4fMuDbV9J\/yUhJOc73M8Kx73kR4jiEtDnMQjjcfCY+xTh3Ce4R+ArKnMx\nN9UEz\/EQvKcD9J2X8F8HyeCP3jWcbXXCstcHx+E4LvfGMDfWRKHHgGRuJELzoxDKeYzv8kLBLb3P\nquxuwn18HfPf+JbzEF9H\/x53Yu\/icXIIHnHC8DApFN+E\/g7bG9OYHm3Alr6DDT0B6xQs+68oGcwH\n78XWTwPQjVRhbqICZWT4oqIEaDUliIz6FvoJLc42dNhfH8fq0jAsR3pUSNORnfwQCjEH+SmPcLAy\nhmXdILaMvfi4OYPR\/mpM96uRVxiL9oYC1JbG43nW\/6BR+gBesyFYgJu4fE87O2xEhyodA1oZatVC\nxCXeRzJ9fGdrCqdr3UjmPEBJcTrqS1LwojgNvZRz2+sErEj48fi0OQWBKBaJyQ8wNFCNNFJ\/FT0j\nI5D1xSkwfZ+FY1M1\/FSMBJmLKYmT4Q5p01AvT0aFKAEv1EWQlWRAXp6NlIxwFIij2Q8\/fPgbtFLh\nUCWNQntNOoUiERrLk9H5Ih8P7v0HsnLCCdgjlFfnIzOX4qA8DTnZ4chPCIU8LxLGmSb4rEvBq9h9\n9gaO40H4zubgOBlEFWWSbHIQZR0fFVV5GJjQQCxLQSTnDjTKBHTXcjDcmIL5nnyMaVIJYDYinv0G\ngoI4lFJoqnzBR4kiCyIKT4e7s3CcUp15Oo2rT5PwU7UdZKBeh\/VjH708TE4ygYvdlyhWpkBVz8OL\n5iKUkyfWNAuRL4yCUhiNXso2muL7GGpMQndlBJX+GRjUJCMp\/vcQUUAvVmQilx\/Bmgkj1sNeKkJe\ns+s6qRi5tZmCBbhBAIdhfj+E\/XctuNjpg3GhHaXEgKJWgLLqPNRRCZae\/Rh18jhoFQ\/RXvkUe0sZ\n2NHloV+TgcmuLPBS\/wsV5YmQyFMgoBpSTe90d4uxPcuF83gYtoMRylhT1HQFCfBHHzFIac5+NInr\no3FcmyfhoNIrLfcJSqt5EJemo0otAJcfDpUoFK\/qE\/DJkIoPy1QTHjThTf936KqNATf5P6GkNMds\nSFaRgVJlKmopbbovJqicG6L4SSZkoa7w2hB8wWo3v4aLXrQftlPAHobfMgt1kwiarnLwpRzIVZkQ\nSaLRokrEy+rvsK\/j4f1CNi62lJh+mcACrH4ehuLiJ9B0lqCSQguXUuGSrhX2k1HKHtOUBHrhOl8g\nG1wKvu30XS3AR+W+i5pxph9m+l\/HpRHPqbeoVIug7iqDUBoHseAhtBUhGNKkY3uxFIPNseQgHKoh\nQ6AoeYoiyiaFlB7lylxk58VSjqeNn1OWOholJqeo1xmhcut1cAD\/yAAkUG6m\/zXPsU2T22yElTq7\nXF4kWnqUKFflQ9NbDpkwBMKMu1AV3cFgSyZMr2VQSR+jNP8B+vqKUNvIBV8Sj+Y2GfbW+3D5YYhA\nTlPsmyeAs1RuTVGq0wXPoJP6Bef5BNznA3CcTVJ\/S+2jmfoH6nGLVRmwWVbQTmmruZkHQd49nKwo\nUSa8gyODBIKc3yEr6l\/R1p4LVV06xcGHkBKLezoFrOsS2jRt\/mKGrWI81D36r\/TB98XMXMVzuUDM\nMe2nifpjA8ui+\/ItGqhGNB\/PorGjFM2tBWQOsywrPG4ohSaKmeVpUBTFo61bAlVtHgtuRSeFnVRq\nPewh+yPbpjDDDAeclkV27vN3jD6WfhkQ6dlAessMe2zv4LQaUd8kpG5sBc3dpSgsDCfVz2KguwQ8\nQQzZ1xgOlhRITfotisuTUEZ9yQ9+EwwzGvJYHatW1\/kc7OczpKV5Uq+JusPlYAG+JzAm6o0XSGZx\n62L65EX4bGSTBNJDgO3mVbS0SqFoEdFHxzEzpkC9kku2NUuVsgkzwyVQNeQgYF7ENZVWn62v2TGK\n83ySgL2m2LcCr5XRCBHgCDIO\/vz5PdFvZEH6r5cJ3AwC9lV2Qc\/lDKl0mVQ8B+fZPFqox\/XSfQ\/d\ns59Q5qEYF3Asortfhq5OKbWVBvY5H\/XBAVrPcTZBDqhnx3KsMFMwV9CN+zY7l2Hmgi5SC9NkMxMA\nhr0A2QszivPRBpwW8kRqvF\/2lrDzQevB5JdN0LuaFjGB1ePGuUmAjHRkZI2ALtGm38Frp2sXM+H6\nMnMM2gaZ4SVjZ14CduMi9kglblIdM3ZjBpIBumamXy6LnuKYnsDMErC37GYYxvfX2wmInrVh5h4z\ngnOaZ1iT8dLm2I3av8jf5SQ+UoeHhF3EscqyGWCmrcxUlQFKIN3MrJCu3QxIUhs7M2TGdZc6dkTn\nvnhD\/5MpnI6zduewMHZIQd9mZFXPCOPJfmeQAD971kKcZ+Ny78W83H42K6ePyb1Wg9x9sSD30rn1\nqE1+c70sd17MkryROy2T7H37yYjcftRLz+jZe37m3tm03LLfL3eeDMmt+0N0PUlCa9I9y\/4AuzZl\nKy5g+Zev\/hl\/fwX+LHHzOS7OUAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/icon_lem-1318971778.swf",
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
	"no_vendor",
	"no_donate",
	"icon",
	"emblems_icons"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "reflect",
	"v"	: "revere",
	"n"	: "ruminate",
	"t"	: "talk_to",
	"h"	: "tithe"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"u"	: "furniturize",
	"g"	: "give",
	"c"	: "place",
	"e"	: "reflect",
	"v"	: "revere",
	"n"	: "ruminate",
	"h"	: "tithe"
};

log.info("icon_lem.js LOADED");

// generated ok 2012-12-06 17:08:46 by martlume
