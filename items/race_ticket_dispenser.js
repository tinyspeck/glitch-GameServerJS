var label = "Race Ticket Dispenser";
var version = "1318630778";
var name_single = "Race Ticket Dispenser";
var name_plural = "Race Ticket Dispensers";
var article = "a";
var description = "Dispenses race tickets!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["race_ticket_dispenser"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.purchase = { // defined by race_ticket_dispenser
	"name"				: "purchase",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Purchase a race ticket",
	"is_drop_target"		: false,
	"store_id"			: 20,
	"handler"			: function(pc, msg, suppress_activity){

		return pc.openStoreInterface(this, "purchase");
	}
};

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-29,"y":-93,"w":58,"h":94},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIXUlEQVR42r2YWW9b5xGGjSBFEATI\nArfIjZvEm3YuIg\/3fd\/3VQtJSRQlWrtk7YpES6JkxZZDW06QOHJiBHbQIGmci6BogV4IBYqiyEXV\nm\/aiKOCf4J\/wdr7vSLTSy4AMgRc8PAIOHs3MN\/POOXfuZ34Gn0wVkncHasla4Tj7cQnJOwOI3cwh\nc28YuS\/G0fvZ6HH2k9IRU2Sv\/8i\/lfnevZ6RnfslPkO\/m6slannE7+QQ2+9H7HY\/oh\/0Inq7D9Fb\nTL2I0O\/QbhbmKR8MZXddumsuS1PhRp8uRShy2PisigePP8XT+zuY2BjH3P4ypm8toWdpAIHNJIez\nzwehH3VBPWCFss8ATdEGbcl51DS4kW+W3qDUPc\/tj+DhR3v4z94y\/jvdhwOvFuMrs1jcWYOz1wf7\nnB\/utSh0JQeEnAmytBbKfiOkCRW0RTuUI843mgI48NVMJVhNo\/LRDv64OIx\/xQSuP7ilKM6UUV6c\nhGHABs9GDMYxN4fp7jFAO+zg6s7qIPSboBq0NSfNqftDz1M7eazeuoGH5Qz+5Jbga7sEswYpRufH\nkR7pg2XSDddyBOpBK4SCmYul+FSSuApC3lxpSu35qbYGtkaxUF3D2PIMYl4rEgEHBidLPHqBXBTW\nGR8s0z6oChZKq4mn+KwkFHGh39h4wHgtX2F1lV7KIzOeQ3Yyj4HpEgoTRfRfG0LfaAGWrBM2AtSP\nirWn6NFD0Wugb4N4TZLEBbqnbzxgYCv9yLkUApP9eoAi5YVlygPzhBumMRf0JTuX\/bqfUmmBgk6t\nPKOFPP1C7LBIEmrIs00AjNzsObLPB8DkIFkmvLDNUbSG7LDO+kQRNJMyZ6TDoeenlknCFH8hgm08\nYGgne3QKYWGa9sI07hKjOOWGeVKUiSJ6GrnOiPJEirokHFoz3XBA70a8DmGhOjOOOTmgedwN47iT\n\/zaOOWC45oAspYEsqUF7UC4q8EI8mjFV49uM5\/3YTyB0JRt0RSv1OisdCqq\/URv0I3SPdJrSNr8M\nrV5JXW1+Kb\/fHu9+t+GArtXo87MQupIVGupx2mHriSw0ykhDZnRFBZISbT4prro6RDk70E7AncFu\nNKVJu1ejj85CaAYtULH5OmiGKm+kk2viUhWMHK4zrECrT4LLtra6OsLd6HDJmgNoWwhZOMCAkUMI\nOQOUKR01Yz2XkNPXr7tiCl57LMUXLS14z3wVVyiCHSECtEiPm2YWmL06tViitSJbtdeD8M0swrsZ\nhHYyYLOanWRWbyzFLZ4uXLa3ifVIo7FLkDTHzYT2MpEQh0hziMBWitsq\/40EfJU4vGQQvOtR\/ndZ\nUs0PBYOry92FDq0EEqWs8YD+zVjEV4k9P4XwrEXgXg3DtRIiYxCk6ULNezHA72uGLATTSQfjrCi9\nui6Ck0Ku6W4sIKXzqJ5WcsvMKbOU8nRui5FkUQzf7KGx5+G1xuVo57pqa0eHRgKpIINUJYdcq2ws\nIIPwUg\/UDjFXrOdS9Olo4OtonGnJ42n4qbaRSTWUnbzemK5Y29BllkGpFdCtVXLJ1d2NB2TmwFB2\n8CnARlVHiE0EGW8hYm11UvuQi71x2IZL1ha0m7qgMqigMWgg6FR1wG6NglKsqDUU0DDmeMYmB6st\ntlfIaYTJyJEwSWkqSGNMAjkUNRRRDRQGJQc7FQNUUBQVJxGUquWVc83+OP3uit3rgNVlg9Fmgt6s\nh45ksBrFa5OuDqgi8fRS9JQEK9cqmg8YzsYrJDCFMjEEUhE4vE44fC7YPY66LE6y\/QZ1PcVqo\/aX\nBWRwwXSUA4aSEcR6qCfGQ3CHfXCHvATsrEdQeVKLUkHafMBQJv79KVyQ4BhUJB2HJ+KHLxaENxrg\n1wxUbdJyMBnVH+uDQkL7rOmAwUz0KJQmwBRFjyLnT4bhZXBxgosRXJTgIr46IKs\/qUYONdtPqE3J\nM5pI0+DGv1t7N9ATORZhWLT8cIU8sLptcAZo5Qx6eXp5mkkqI51sh0CrgYVOuk7cS5KqWlPgrj1d\nsRS\/mXtWeDKB\/JdjyBwUEd\/pR2y7F4FVqr+FCDxzVIOzQbhnSNO0XI17oC\/b+BogpRbFzGxnVGiO\noxn+ev4oUSsgdW8Q7P1M4sM8jcAc\/JsJeNZjNJfDcC6G+GJlnfXCOOHiK8IpWBf1y07yih3kFS85\nlY1\/\/ZF\/NHGcOhjklovNZP+NJJ\/FbF9hOzNfSefFldREcELewNeEs2DijiIjKyZp\/F7S+2AUDJDB\n9WwVsXJQRfHOFDmbCIebqi3DP5uAk1LMxiOb2WxfYWDMrIpgUm7FaAWo0iNfauibrcSHBfTdGUF+\nvYwvfvg99h8\/wPLdLZ7WfLWMpU+2+b3q53fhv56ENKXi7vssGPOFzH5dVrfa6bGXSa837IAEqxmk\nbg9g+2EN0x+sovL5Pgb3JlDcnUL1qwNUHu9j+7CG3S\/vo\/rkAGraVxRZ7U\/AmAV7R3\/lB3qkjtRC\nerMhgKVvF2YDmyled+ndIZTuzoCtopZpD2ara\/Atx2k\/dqFvdwTLn1aR2y7T\/qvk7pqZVgbGbNhF\na8vxW+\/9OkuPVJDeJr3cEMDkveKhdz3OoVwrYTgWgvx1R+r9PCIrPShslPnGx1LKrBfziWx56qJN\njoFdsrbikrHlO3rU+ZPIvdPIGmz1b6Z\/dC2HeCsR24hPfNMw5eZA7C0Dg1PSwZATnDQpUGsR0BEQ\nN7vfai7+8+XXXnGdwJ1v5OF9lfQb93zoWwL6q3HM8XfdsPUfdEr\/Yhx2\/E2R0f0oT6v\/zdw1fbMx\nRmll718E\/qqtnbY7gvvzr15\/VdPQmvv\/D4BXTmDZf\/8W\/X6JdD6fz7PfF9iJnJmZeZPuvUa6cHh4\n+PZJjV040c+qt\/8BeTNqLmyR+VcAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-07\/race_ticket_dispenser-1310676884.swf",
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
	"no_trade"
];
itemDef.keys_in_location = {
	"u"	: "purchase"
};
itemDef.keys_in_pack = {};

log.info("race_ticket_dispenser.js LOADED");

// generated ok 2011-10-14 15:19:38 by cwhitman
