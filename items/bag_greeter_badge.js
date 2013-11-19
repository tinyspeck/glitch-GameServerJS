var label = "Greeter Badge";
var version = "1352678798";
var name_single = "Greeter Badge";
var name_plural = "Greeter Badges";
var article = "a";
var description = "Your genuine fondness of Glitchkind makes you uniquely qualified to greet new players as they enter the world of Glitch. And, this badge proves it. You are a unique snowflake!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["bag_greeter_badge"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.reset_location = { // defined by bag_greeter_badge
	"name"				: "reset this location",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Resets trees, patches, and coins in this location",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.location.isGreetingLocation()){
			return {state:'enabled'};
		}
		else{
			return {state:null};
		}
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		// effect does nothing in dry run: player/custom

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

		pc.location.resetGreetingLocation();

		var pre_msg = this.buildVerbMessage(msg.count, 'reset this location', 'reset this location', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.top_up = { // defined by bag_greeter_badge
	"name"				: "top up",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Replenish your greeting items",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		// Performing it looks for stacks in the Greeter’s bag, increasing them if they are below a specified size and creating them if they do not exist:

		// Gives the 5 spinach in their pack
		var class_id = 'spinach';
		var spinach_count = this.countItemClass(class_id);
		if (spinach_count < 5){
			this.createItem(class_id, 5-spinach_count);
		}

		// 5-stack of a fancy drink item
		var class_id = 'fruity_juice';
		var drink_count = this.countItemClass(class_id);
		if (drink_count < 5){
			this.createItem(class_id, 5-drink_count);
		}

		// 5-stack of a seasoned bean
		var bean_count = this.countItemClass(function(it){ return it.is_seasoned_bean; });
		while (bean_count < 5){
			// Fruit tree beans are the only beans that can be planted in all starter streets, so just give those.
			var class_id = 'bean_fruit';
			this.createItem(class_id, 1);
			bean_count++;
		}

		// 1 randomly chosen music blocks 
		var mb_count = this.countItemClass(function(it){ return it.is_musicblock; });
		while (mb_count < 1){
			var class_id = choose_one(['musicblock_d_blue_01','musicblock_d_blue_02','musicblock_d_blue_03','musicblock_d_blue_04','musicblock_d_blue_05','musicblock_d_green_01','musicblock_d_green_02','musicblock_d_green_03','musicblock_d_green_04','musicblock_d_green_05','musicblock_d_red_01','musicblock_d_red_02','musicblock_d_red_03','musicblock_d_red_04','musicblock_d_red_05','musicblock_x_shiny_01','musicblock_x_shiny_02','musicblock_x_shiny_03','musicblock_x_shiny_04','musicblock_x_shiny_05']);
			this.createItem(class_id, 1);
			mb_count++;
		}

		// 1 butterfly lotion 
		var class_id = 'butterfly_lotion';
		var lotion_count = this.countItemClass(class_id);
		if (lotion_count < 1){
			this.createItem(class_id, 1-lotion_count);
		}

		// 1 gameshow tickets
		var class_id = 'gameshow_ticket';
		var ticket_count = this.countItemClass(class_id);
		if (ticket_count < 1){
			this.createItem(class_id, 1-ticket_count);
		}

		// 2 awesome stews
		var class_id = 'awesome_stew';
		var stew_count = this.countItemClass(class_id);
		if (stew_count < 2){
			this.createItem(class_id, 2-stew_count);
		}

		// 2 cosmapolitans
		var class_id = 'cosmapolitan';
		var cosma_count = this.countItemClass(class_id);
		if (cosma_count < 2){
			this.createItem(class_id, 2-cosma_count);
		}

		// A note
		var class_id = 'note';
		var note_count = this.countItemClass(class_id);
		if (note_count < 1){
			var s = apiNewItemStack(class_id, 1);
			if (s){
				s.setInstanceProp('initial_title', "Welcome to Glitch!");
				s.setInstanceProp('initial_text', "Hi!\n\nIt seems you had to step away as you joined the game, so I thought I'd leave you a note and a few things that might help you on your journey through Ur :]\n\nGlobal Chat - where you can talk with other players and ask general questions.\n\nLive Help - where you can report bugs and problems to the Staff and guides.\n\nAND you can click on your Glitchy face to get lots of helpful links, including wardrobe and vanity (where you can change your appearance). Don't forget to try everything, explore, and experiment. You can't really do anything wrong in Glitch, so HAVE FUN!\n\nYour Greeter :-)\n\nP.S. Here are some goodies!");
				this.addItemStack(s);
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'top up', 'topped up', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.mute = { // defined by bag_greeter_badge
	"name"				: "mute",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Shut up, shut up, SHUT UP!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.greeting_muted === undefined) pc.greeting_muted = true;
		if (pc.greeting_muted) return {state:null};
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		// effect does nothing in dry run: player/custom

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

		pc.greeting_muted = true;

		var pre_msg = this.buildVerbMessage(msg.count, 'mute', 'muted', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.unmute = { // defined by bag_greeter_badge
	"name"				: "unmute",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Bring it on",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.greeting_muted === undefined) pc.greeting_muted = true;
		if (!pc.greeting_muted) return {state:null};
		if (pc.isGreeterTrainee()) return {state:'disabled', reason: "You can't do that yet."};
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		// effect does nothing in dry run: player/custom

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

		pc.greeting_muted = false;

		var pre_msg = this.buildVerbMessage(msg.count, 'unmute', 'unmuted', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.teleport_out = { // defined by bag_greeter_badge
	"name"				: "teleport out",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Return to where you were",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.location.isGreetingLocation() && pc.instances_has(pc.location.instance_id)){
			return {state:'enabled'};
		}
		else if (pc.greeting_previous_location){
			return {state:'enabled'};
		}
		else{
			return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (pc.greeting_previous_location){
			pc.teleportToLocationDelayed(pc.greeting_previous_location.tsid, pc.greeting_previous_location.x, pc.greeting_previous_location.y);
			delete pc.greeting_previous_location;
		}
		else{
			var prev = pc.instances_get_exit(pc.location.instance_id);
			if (prev.tsid) pc.teleportToLocationDelayed(prev.tsid, prev.x, prev.y);
			pc.instances_exit(pc.location.instance_id);
		}

		return true;
	}
};

verbs.request_backup = { // defined by bag_greeter_badge
	"name"				: "request backup",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Ask other greeters to help you here",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.location.isGreetingLocation()){
			return {state:'enabled'};
		}
		else{
			return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var uid = 'greeter_alert-'+pc.location.tsid;
		// Fake a prompt
		var msg = {
			type		: 'prompt',
			uid		: uid,
			txt		: '<span class="prompt_greeter"><span class="prompt_greeter_name">'+pc.label+' needs greeter backup in <span class="prompt_greeter_loc">'+pc.location.label+'</span>. Can you help?</span>',
			icon_buttons	: true,
			choices		: [
				{ value : pc.location.tsid, label : 'I am eager!' },
				{ value : 'no', label : 'I am busy!' }
			],
			timeout		: 30,
			is_modal	: false,
			escape_value	: 'no',
			timeout_value	: 'no',
		};

		apiSendToAllByCondition(msg, 'isFreeGreeter');

		var pre_msg = this.buildVerbMessage(msg.count, 'request backup', 'requested backup', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function canContain(stack){ // defined by bag_greeter_badge
	return stack.getProp('is_bag') || stack.getProp('is_element') || stack.hasTag('no_bag') ? 0  : stack.getProp('count');
}

function createItem(class_id, num){ // defined by bag_greeter_badge
	var s = apiNewItemStackFromFamiliar(class_id, num);
	if (!s) return num;
		
	var size = s.count;
	var remaining = this.addItemStack(s);
	if (size < num){
		remaining += this.createItem(class_id, num-size);
	}
		
	return remaining;
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"greeter",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-23,"y":-46,"w":46,"h":46},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALQ0lEQVR42s1Y+VPbxxX3f+C\/IU4c\nXzEYMDaSEIdB6EYSp8QlDBiZS0LiMpcESEgCCQmQuAwCcRmDHRPjIzauQ1zXuZrEmbaTTDJNnEk7\n\/alTpp3pz5++XR9jJs206qQTa+aN9ru77+3nHbvv7e7b9zP+\/vFkUfPPHy5r9r2Kv92vI\/FfPvTt\nfvUb\/+7ud8vxrxS4v307s\/\/7T8efLI8ZMGpX4IfPwk9Y3ysD8PtPQzu3lq24vVyNyLAG1yIN+PMX\nEzuvBLivP\/AF16fOYTFQgOVRFUa7RVifKsXSmBHffhwI\/qLg\/rDjNr672ozlcSM2pvKwNadBxHuG\nt+dHDLi7ZsVXD4aM\/5fFN8LGnWvTNTs3IqbNu8uNjvtrzY4HGy2WD7Y60z8h+u0du+bdFQu2Fs1Y\nHivDtYslWAwWYWGkEJuzZQg7c3FjyYJtAvn5vX7N57d7Od\/DzQ7LgyutJM\/suLPUuLk1Z9p5e7o6\n9nCYduqeuGwi9DaIMDWYTwuXYsyhwc1oAzbnTFgKlmHaXYhrs+fx8LoTwcAsJsKLmJlZw9TUKr58\nFMb9jTZEfCVYGavA9fk6itEmDLZKMO8rxuWwkcYK4bSmYtZT8CRmgIv+4p0Jpwo7V03wtIpxa6kK\nUYqzlbFSBHpUWJ9pgaPHg\/yyMATKCETqRdjqa7G2EEJ63mWINSswVEfgGRzDzVU7KVSOS6EKAqUl\nBUsw5ZKRsgYMtWdjNVgauwVX\/PqdmUENCcrBRzfrcWM+DxNOJS1Uhe62DgilPiRnj+O0dArCHB9S\npQ7I1U3IltUiTeFEqnIMQuU8UmQzSFeH4HL0YzVsxsSADPcvl+HhNSP6zSmksAFro2WxA4wOFy4E\nelWYH5bj+qya3JALd0cVxBI7Tog9SMzw41RGF0wVCgx1FyI6XodHt734aDuA1elmjPSVoP5sLlKy\n+0iREJLOBCCQeOHsbCCllbi3kodH16sxZpdheUS\/EDPAiCfP4W7NIYvpEPXJ0WvWo9qgQ2eHGydE\nDujzlNiKNiEabkXA0wWr1YG6RhfqzV60trkQ8pPFLvbgs203+glUYvogSkutmB4lkO1nEe6TcDd7\n2qRY9BU5YgY4O6h1LAeKsOjPw6A1B8miZhiKa6CUFiBgL8KMxwCFPB\/JWT6kyC9CpIpCrF1Fmm6N\nx59QtcDdq9TSRgmYcOdSOzpbGlGer4Eg8wJGe7QY6ZJiJagHM0bsu7hfrQk5lHBb06GQVuBQQiuO\nnrQh2GdEyKlHYkoNudmHk1ljPA4FijkOkm0WEYETKGapf5KPJ4nbMe01Iuw5j+MpnTia3A2joZJk\nZ2Kin8LHpYu9wBjrlmoGSYDNKMIbx814M94Kgy4bwR4FTiQbESdyIiFtiMcWizEGkllSIJ\/l\/+yb\nx15mACfSvEhIqUJ4IA9lBXIcOXmBK9xTJ4G3JQvhfkVsAP0tGUa3LWO323QaWekFeP1YA44nFGHZ\nr4VQIMWRpCYU6dS4YC5Hb9s5OLub4O1vw4inF2N+JwJeO4YG2uHqscDRbkJnsxEadTlEIgXWQ3rE\nJ5VwhWWSEnTWnoK\/LXs30Jn132UcV5Mo6LKkYdqlQn9DCgGrwoGjdSjNV8PeJMWbJ2w4k6HDeyuV\n+HDTjC+2e\/DNo2H86fEU\/vrNCv7+\/VV8vO3DX343iz9+NILf33fg4y0r3l+rIcU6MGDLRU1ZAQ6S\nV+ISq9FZnYSZQTU81gx4mtN+Ond31Cbt7609udnXyDJHLiYHpOity+TgXj9agx7KKJXFGhyMs1BM\nFuBXS+UYd+Si1nAaXz5w4btPRuFs02B1qgHFqrfw\/jt2XKjPQsRfzhV5b\/Usd2tVST7Ge7LxxrFa\nLrvtbCqmnFK427PgsojRV3d6k2HZA27AdCq+uybxcU+dAON9UqpK8jHrlsCgzSchFNjxaoTsEqjl\nOrz+VgPkOXm4O29AnyUTWsmb3Ipf\/XoQLefSERmtgaNFjQ9v9qK5KhUzw+V4uHEe96JlXDm1PA+X\nRzVcJgNYoNJh3J7J1xylNez1AnRVJTzuNSU8LXq9VqGmv+H0br9ZhMshSvDRStxbM9IRkEFuLUTD\nWSNSktOwEdIiIamAC5VJNHh3rgi9jWIOUCo+wEmddRCzI5W8vb3eCkulAFPeUh4ObD6LZSbjznwx\nTsSnw3yuChUFWvg60nFrXoONCQ3H0EdY7KbkXZf5tGafzyYKOupT4G4RItAlpn8BZY9sYkqjLFEI\ns1EC0alTuDFbiMNvFb4AyBbprhNygDeidbhFhUBdeQq3GAPIvltqhJhw6wlcMZ\/PeJmMu1E9BKdE\nsFVLcb5MQ+esiM5bCV97uF0Et02IvobTFJOC4LNdKzI6zYJdlzUNc0NqvBOhSsUlQaVBj9eOmHA8\nTkV1nhK55GLmcgZwmxbprn8KcHuhhFupsTwZk3SAM4DX501Y8OXRrn0KjoFiAJmMrYuFXOaBI+dR\nXlBE8Z7N14wG8uFtywDz6JA1Ze+uHrGlxnuaRbueljT4uhQIOSho2\/I5wEPHDHCYU1Gs03KhcgJ4\nb8mAqxM6uDrzcCdSxF3oacvC5kI9539vo4l\/X7l4jivD5jNeJmPOqyCZJVy23aKhGMyCr1MCX3sG\nXE2CXS9h+bc72duRtN\/TLHwc7Myk9KMgq9GhGneOC6qryILDqubt9PRSTLorMOEqR9hFxelAGUL9\npbg0auDWWg0a+DfrDzvL+Bx\/bwUHaLeoYK3J4XIOx5+jLCJFxK1A8EIm3BbBY4bhP56FwzbRQn+T\nkDSTQKUw4rXDJghFegrkYsQnPHU7I7bgy2Sppipl0QCZtOZHY2x+fKIeNyPFXBb7VsgqaI1s9DUK\n4G0WxlbR+NtSLYNU7QYdBgJYy6mrSQlnSzYOHK7ioJ8D5XRQhUlXPmSymheAXibGM2DLRmej4ikv\n0XBXEaU6MYZbBJaYc\/F4Z2b6UGsaFoaVMBRWcoBxiXT3mDHAVJaJN46UPQNu+jHY5\/RsjM2tJZ63\nZ\/RcBuNTKyuxEsjlAANt4vSYAU7YzzgmHBLu5vXJshdWTMuowaXxQvi75Th6TPGi\/6fo4BE9fN0y\nzsN4n\/evUiV9cVCOGcpYoZ6M2Mutmb5sxxBt+cXRAszSrutqrnwh\/NAxPWy1UqyFdKgpVUKj0CEh\nMQ+HjuZzYm3WV1VC94+LBRjuzuc8z\/kvmI1UT6oQ6suhs08Mttb\/UFHnOII9Wbi9VMpL\/tUxDZrP\nn91jnTRxLnrMOZgmS7y\/Xr6HWB8bY3Ne5mEyrkwVYStSgAdv11D5Rrt4MCd2gItD8p2Rriyynhx3\nlnS4MqGg6leNq9MVyNNW73Xj0XIknDiD+DgxJ9ZmfS\/PYTyMd2NCyy\/47BI2SBmDrRH1ymK\/NK0G\nVTv+zjMcnK9DiBsLpXTS59EBnk0WLUSAKmuZbC\/QunINQm7bnj42h81lPOH+HLpfa7EclPNnkkfX\n6+GyibHiV8UOcMaV83jccYbuxKlcywC5ordRiCW\/iu4TWZQKZViiXXh1Ws8BMNe5LlTC2fG0zUHN\nlfI501ROjXZncV5b1SmKu3Qug5VZ3nYxpgZyHscM8EpYi3naHHNu+e7qiGrn8qh651JQtbkWVDno\n27EyogwOd2SQcBldHSVYJCCTzhyeIiNDcswOafnYMKWvJZ8yuDqi4HzPZOwsk9Uoi+zOeeRYH9fg\n\/\/J+Q6AXwnQUzQ7p9jwevRMpoQu6nMBKwOb8oi9ca2RZ5u61cOGL57eoX0H33hzKyepf\/o3w3kzh\nfgqHJ972TL5DhztEPGavhLRP2Ngr8Yh5I1Icvzam2Z2koPdQerw0lrvL+l6pd+q7iwbjPOVtRqz9\nSr70318rcTD6OWX+C3k9DQGh6aJyAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bag_greeter_badge-1334252399.swf",
	admin_props	: false,
	obey_physics	: false,
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
	"greeter",
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {
	"q"	: "mute",
	"k"	: "request_backup",
	"x"	: "reset_location",
	"o"	: "teleport_out",
	"t"	: "top_up",
	"u"	: "unmute"
};

log.info("bag_greeter_badge.js LOADED");

// generated ok 2012-11-11 16:06:38 by mygrant
