var label = "DCPU-16";
var version = "1334340959";
var name_single = "DCPU-16";
var name_plural = "DCPU-16";
var article = "a";
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
var parent_classes = ["dcpu16"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.run = { // defined by dcpu16
	"name"				: "run",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.contents) return {state:'disabled', reason: "I need a program to run"};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		pc.prompts_add({
			title			: 'DCPU-16 OUTPUT',
			txt			: this.assemble(),
			max_w: 550,
			is_modal		: true,
			icon_buttons	: false,
		});

		var pre_msg = this.buildVerbMessage(msg.count, 'run', 'runed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.program = { // defined by dcpu16
	"name"				: "program",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var rsp = {
		    type: "note_view",
		    title: "DCPU-16 IDE",
		    body: this.contents,
		    start_in_edit_mode: true,
		    itemstack_tsid: this.tsid,
		    pc: this.last_editor ? getPlayer(this.last_editor).make_hash() : {},
		    updated: intval(this.last_edited),
		    max_chars: 10000
		};

		pc.apiSendMsg(rsp);

		return true;
	}
};

function assemble(){ // defined by dcpu16
	var output = [];
	var lines = this.contents.split(/\n/);
	var line_positions = [];
	var labels = {};
	var current_line_pos = 0;

	// Assemble lines
	for (var line_num in lines){
		var line = lines[line_num];
		log.info(line);
		line_positions.push(current_line_pos);

		line = line.toUpperCase(); // for consistency
		line = line.replace(/^\s+|\s+$/g, '').replace(/\s*;.*/, ''); // trim whitespace and comments
		if (line != '') {
			var parts = line.split(/,?\s+/);
			log.info(parts);
			if (parts[0][0] == ':') {
				labels[parts[0]] = line_num;
				parts.shift();
			}

			var op = parts[0];
			var values = parts.slice(1);

			var bytes = [];
			var op_byte = 0;

			if (basic_opcodes.indexOf(op) > -1) {
				op_byte = basic_opcodes.indexOf(op);
			} else if (op == 'JSR') {
				values.unshift(0x01);
			} else {
				throw 'Invalid operation exception: ' + op;
			}

			for (var i in values){
				var val = values[i];

				var pos = (6 * i + 4);

				if (!isNaN(parseInt(val))) {
					// literal
					if (parseInt(val) <= 0x1f) {
						op_byte += ((parseInt(val) + 0x20) << pos);
					} else {
						op_byte += 0x1f << pos;
						bytes.push(parseInt(val));
					}
				} else if (registers.indexOf(val) > -1) {
					// register
					op_byte += registers.indexOf(val) << pos;
				} else if (special_registers.indexOf(val) > -1) {
					// special register
					op_byte += (special_registers.indexOf(val) + 0x18) << pos;
				} else if (val[0] == '[' && val.slice(-1) == ']') {
					// memory location
					var loc = val.slice(1, -1);
					if (loc.indexOf('+') > -1) {
						// [literal+register]
						var loc_parts = loc.split('+');
						op_byte += (0x10 + registers.indexOf(loc_parts[1])) << pos;
						bytes.push(parseInt(loc_parts[0]));
					} else if (!isNaN(parseInt(loc))) {
						// [literal]
						op_byte += 0x1e << pos;
						bytes.push(parseInt(loc));
					} else if (registers.indexOf(loc) > -1) {
						// [register]
						op_byte += (0x08 + registers.indexOf(loc)) << pos;
					}
				} else {
					// label
					op_byte += 0x1f << pos;
					bytes.push(':' + val);
				}
			}

			bytes.unshift(op_byte);
			output.push(bytes);

			current_line_pos += bytes.length;
		}
	}

	// Fill in positions for labels
	output = output.map(function(bytes) {
		return bytes.map(function(b) {
			if (b[0] == ':') {
				return line_positions[labels[b]];
			} else {
				return b;
			}
		});
	});

	// And return output
	return output.map(function(bytes) {
		return bytes.map(function(b) {
			return this.zeroFill(b.toString(16), 4);
		}).join(' ');
	}).join('<br>');
}

function onCreate(){ // defined by dcpu16
	this.contents = '';
	this.last_editor = null;
	this.last_edited = 0;
}

function onInputBoxResponse(pc, uid, body, title, msg){ // defined by dcpu16
	body = str(body);
	if (this.contents == body) return;
	body = body.substr(0, 1000);

	this.contents = body;
	this.last_editor = pc.tsid;
	this.last_edited = time();
}

function zeroFill(number, width){ // defined by dcpu16
	width -= number.toString().length;
	if (width > 0) {
		return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
	}
	return number;
}

// global block from dcpu16
var registers = ['A', 'B', 'C', 'X', 'Y', 'Z', 'I', 'J'];
var special_registers = ['POP', 'PEEK', 'PUSH', 'SP', 'PC', 'O']; // start at 0x18
var basic_opcodes = [null, 'SET', 'ADD', 'SUB', 'MUL', 'DIV', 'MOD', 'SHL', 'SHR', 'AND', 'BOR', 'XOR', 'IFE', 'IFN', 'IFG', 'IFB'];

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-49,"y":-36,"w":98,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADt0lEQVR42u2VS08bVxiG+QdVlgjf\noNzMzSGJwdeZ8X2MbXzDt\/EN3zA2CaYYIqWNZCK1y8qVqq6qlv6Dbrubn8Cme34Cq6qLSn3znXGM\nbAUaVyGLSPNKr3TG1tE85\/2+883UlCpVqlSpUqVK1adWKh7hk7HIZTIalmORkBwLB+VoSJTDwYAc\nFn1yKOCVRR\/Z65F9HkH2usgC13dzXE\/gHD3BYetxNlvPYd3uWK1W3mo2K97a3DR9FFguGS+nE7Gr\ndCKKvXgEBIj4bgixyA6ioSAiOwGERT9CAR+Cfi9Enwd+jws+twCvwMPNc3BxTggOOzi7DU6bFXaL\nBRazGWsrRswa9PL\/hipk4qZ8KtGXUvGbbCqOTDKGhwK0bpmxalTAYNDryNrJAGuSpC9J6V5JSl0V\ncnvIZ5KQ0gk8FKDDsk1gy++gxn0\/VE3S1yr5cqWYlcko5zMgSDwkoJNSW1leuhPsXsBmvRRtVIuX\njUoBtf08qqUcHhrQzTthWl\/7T7AxwHazEm039i9b9fINAeKgWsSnAny6acLcrGESuBuDVhud+vbi\nlfzdxSsw9745w9fnnXv95vU5zk7aOOu00CWf07rTbuCoWUX7oAI6JI5bdZQLdCApg2IuhUKWnNmD\nR+Cw8OXcRKkZdNrLuUePvlDS63YO5e67F\/70689482Mfw2fm1sE+MntR1CnNfHYPJ88P0CKQfUq1\nWSvdrkf3jPrl6XOcHh9Sry1OAndt0Gj4sZ4bBfzzr7\/xxz\/\/4uzlye0LKlTijfUVKnEaOwEPrNvP\n0KgW4PcKcPEOhEQvUold2K1bVPIYRL8bO\/TbY9MakrGw0iLsEMalhQ+kpunfeVtPO62bIczrH77H\nxW+\/jCVQlFII+FzU3AL1pKTAMgjWl2zNwKRMQvl\/Y32VYCPUj2GsrS4roGw\/A1xemr8P7uq91MbG\nCb302dPHCFI6oy5RYgwwl44rALzTpqRWyCbxZHMDXjePWnmwd8W4RElnqRViyn+RUEBJ2Wm3YDcs\nDgAX56HTaqDXDTxITdf74BBmIOxWGWkeMa\/SJ2ZxYV6BHAKyZIYlZmVkpd0yP1HWDJ4BslKzZwbF\noEXfIGW2fwiomZmGVjPDvhC\/z05P6yf6SlAD9+jkfbIsZZPXDJj5sFFWAI\/bdeWZ9VKe0mMpsTEU\nEn1w2LZplPiVXmOJCpwd4aCPDmBXoBlsuZAZSXDmWhkdH6vu0ZH+qxct\/i53j5sddqi7PLhw75tm\nqky3uHc7OlSpUqVKlSpVn43eAqgKTkVO1GwhAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/dcpu16-1333651025.swf",
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
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"o"	: "program",
	"u"	: "run"
};
itemDef.keys_in_pack = {
	"o"	: "program",
	"u"	: "run"
};

log.info("dcpu16.js LOADED");

// generated ok 2012-04-13 11:15:59 by martlume
