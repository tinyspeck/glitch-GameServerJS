var label = "Subway Map";
var version = "1313617325";
var name_single = "Subway Map";
var name_plural = "Subway Maps";
var article = "a";
var description = "Determine the lay of the land with this handy-dandy atlas of subterranean transportation destinations.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["subway_map"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.view = { // defined by subway_map
	"name"				: "view",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Direct your peepers at this here map",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		pc.apiSendMsg({type: 'map_open', transit_tsid: 'subway', itemstack_tsid: this.tsid});

		var pre_msg = this.buildVerbMessage(msg.count, 'view', 'viewed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"subway",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-48,"y":-159,"w":95,"h":160},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGEElEQVR42u2WyW8U2R3HrdxyiLjk\njuaYU\/6AKKpDDpFyYHIIaIhwmBkNmWEiZDkosjxASFgN3lhsbMDYLB7vvW\/upZaurqquXqsXu213\nGzzGBoyNbTYxM8rhm997JohjFEoTRnJJX71+r96vf5\/+vt97\/erq\/ovnu2eLDU+WiwvrDwrYeFjC\n05USnj2ewou1abxcq+DV+iy+3ZjFd0+r+P5ZDd9T++3GHF7R2MsnFT7vOc1\/ulLG5qPS5tqSNQBs\n7Kyz48G\/NoXV+3k8vGtg9M5FGNIY8kkPfI6ruHH1DLTYCIZudUAK3cHw7U5Y9E6eHEQlF+LjjuEu\npBMOpOITGP\/6Eia9\/VhZMLF23+q0DXC5phGgDpEgGKASHoSpTGBi6DJPHnBdhy6NcshKbhJ3pyXM\nT4lwjHQh4LwOv\/MaIr4BihlHrRwjwCTWH5Zk2wCXCHDGCuP+XAILNQOL8yaWFlJYW8pi82Eezx5Z\ntIQFvHhcxIvVIm+frxT4OHu\/sZzFymIay\/dMLNd0\/j22Alby5MqsimRehJZTkCwkkCobWP4mg1UC\nTUbdmC8qmC8pMGMelJKTqFG\/qIdQtSSsL2VQrZowKM7IyyikA1h\/ULQHcKmmCsW0H8lsFPF0DImc\nTIlUpEo6ZqoplCwFC9MqVr9J4Sm5xcRc23yQwyo5XC5pSCejKFUMGJbK4yOyC09sA6yoQiHlg0Su\nKOkoElkJuhWHWaTE5SQqcylkjTDSaogvJdN0KgJLC6KcFaFoUWhpcp3mszgWH5Kc9gEO3eq2CqYP\nRiYCtlkezOuYSoVxr2pwFzNTJrKVNPSUgmzZhCiGYM1mkZ\/J0HiK3idh0jzmOisPNSMiJDqwWE1a\ntgCODPbQ0eGFng5jqZpAyQxhJhfFXFHeqkVKniaI8oyJnOpHSvRgdTHFa46Ns\/dsnp7fck+hMgnG\nHBj7uht9fRdc7w54p4efe\/FkCLNTMsoEV5tRUaG6C0e8sMoJzMzomCdHs3E\/11JV4302ni9rr+Fk\nxDMxyGYE\/ug4Bq63McB3X+ZhAswZboQTPqodahUfZKoxlow5kqRaY0sueUaxSDv90T2DdrULs\/kY\nP9yn6IeweRyO4kSq5UnJgYFrrXYBXkFWdyMU98AbHEdUD\/IkLBlbrnJZeVOb\/9F8SeJlsDyv8fds\nHnOOxbF4NRlEx\/ljNgHeJkDNhQAdDR7\/KDnp34I0JiGZ4TegzCG2AcRECKFJF+9zMHrP5olGiOIC\nfCUUw28f4BABphNO+Gnn+ai4mZMsSUQLIBL3weUchts5gmDEjUDQgbDk5W4xKCkZ5q7F6Aex+bxM\nKF7SvAR4FDduXDxuC2BKdcAbG4c7NMqdnLIiMCUXcpQwm41wRxlEjFx6I+pH3wKbVL0IKR4eH1Pd\naD9nM+BsIcKVEJ2oluifIRWEZQSQTXi57k5JXKy+WBkwqLD6GoxcCyou+OmA9okTiCpOewENeewN\nYNQ9hBwt0VwxiqIZRIaSB0Zu06YI85uKovteA7m5mGNbYFur4CPl6OC3DbC3uxVdF05wFxkoa6Pe\nQS41MsKvW6xGmTIkja5hcWn8LdH1TGQa5dLkcX5fvNx5wh5Aj3Nw\/8Rw\/+bESB\/MhH+hkI7JuuLh\n6uttk692n5N7us7K3RdPyZc7T8oX2v4ht7cek1tbjsrnTjfLZ082yadJrG2hfhuNU3\/zyFd\/RX\/\/\nJcGWvztRDOzMpyWhVkkLrJUiTmFsqF9gCa5c6RAudZwRrvV2NGiKH19+8fHA3xoPCocOfiIcOFAv\n1NfvFur37ubtgU\/qhUOHDgjNzY1CS0vTjrof8omOje0w1CD2\/fEPx+ve18frHNwG3AbcBtwG3Abc\nBtwG3Ab8kQKeOnVkZ9\/VzvcTsKnpzzvOt\/yzYbqoYd++3a729hO\/fC\/ADjf+ZX9Pd5t17uxx\/P3o\nYTQ3NaCx4XN8+vFe7K\/fw671A7oe2Pl\/gfvoo9\/\/pre7Pd916Tzu3OyBY\/QmHGM3MXirF+2tJ3C4\n8SD27P6wumvX75pp+i9IPyf95Ifm\/CnpV6Q\/kT4nffb68x7SLtJvSb8mfUD62f8C+G8LxFFJkJBD\ntgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/subway_map-1313617325.swf",
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
	"subway",
	"no_trade"
];
itemDef.keys_in_location = {
	"v"	: "view"
};
itemDef.keys_in_pack = {};

log.info("subway_map.js LOADED");

// generated ok 2011-08-17 14:42:05
