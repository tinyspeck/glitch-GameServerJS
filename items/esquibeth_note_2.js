var label = "Esquibeth Note 2";
var version = "1347561068";
var name_single = "Esquibeth Note 2";
var name_plural = "Esquibeth Note 2";
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
var parent_classes = ["esquibeth_note_2"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.event = "";	// defined by esquibeth_note_2
}

var instancePropsDef = {
	event : [""],
};

var instancePropsChoices = {
	event : [""],
};

var verbs = {};

verbs.note_broadcast = { // defined by esquibeth_note_2
	"name"				: "note_broadcast",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var val = this.getInstanceProp("event");

		if (val)
		{
		   var events = val.split(',');
		   for (var i=0; i<events.length; i++)
		   {
		       log.info(")))))))))))))))))))))))))))))) RUNNING EVENT", events[i])
		       this.container.events_broadcast(events[i]);
		   }
		}
		return true;
	}
};

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"no_click_sound"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-29,"w":17,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIY0lEQVR42r2YaWyVRRSG6YZUBLFs\ntUjAuCQqmhC3SCQxioIx7onRRI1RowkafukP45a4\/jBgjIoGEn+5kGiB0pZ9K0uBQoGWvS1tWVpa\n2l7oXrjtHZ93Mqf5JFVAb23y5rvfNzPnvGeZOWc6ZMgl\/DnnUsFQMBxcA7LBneAN8BGYD364AN+B\nT8FrYBoYD7LAVeAKkDbkv\/5FiEnoaHBLb2\/vmzwLwOFEIlEPmkF7QEcE7cyJgTpQwfsKnu+Au8FY\nMOI\/EQ3kJOBqcG1PT88cUBSPx0+irNtd\/l8P6xpYXwze431K8GjmZZMM5LQwq6ur6\/6zZ8\/mdXR0\nNHZ3d5\/nz\/X19V02O8g5vO8kADlN7e3tRZ2dna8ylBNSJ\/1SyaUFcqPPnDnzQFNT0xaeXQhMINCd\nO3fO4QFPUgrxqmNsQGCcn2sE9VvzJaetre08hpci+3XmXXdJJAO5K8GY06dPP1dXV1fOs6elpSWB\nMIcXvVKEOr67U6dOXRQNDQ2uubnZtba2+rWCyEsecs83NjZWgnfx6vUh19MvFtYxJ0+efOXYsWO1\nEIyjICEyIsV3V11d7Y4ePepqa2v9e319\/T8CGe7EiRMOee748ePeMJGLxWJmZC\/fa5AlkpODJ9MG\nIjhMOceCByorK6sg0icSUiAv8M2Vl5e7Q4cO+d8iKoWXQlDkNL+iosIdOXLEryN1vFwZyXgfRtfW\n1NTMJvzXBi4pUXLp2q1YNHX\/\/v07IRGPkhCxkpISt3fvXse4V1JVVeW9KO9czHso9kYdPnzY7du3\nz5WVlfUTFaSH8T7Gy5D5LFxGgYwoQYU2GwK\/sLjjwIEDCQkTiV27drnNmze7bdu2udLSUk\/24MGD\n3hsWaimJhlvE9K7vGpccEUKuJyeZ27dv9781ZuQZ70P2fDw7JYQ6xQhezaQnWVgtElooYRKyZs0a\nt2HDBrdlyxa3Y8cOt3v37n6SUmqelpdExqB3GRBR7uVKvuRK3qZNm7w8pY0io\/E9e\/bEkP0WGzK7\nPxd5Gc+iRXipY+fOnZrkQ7p8+XK3cuVKt3btWldUVOSKi4v9dwlVqCTYSMoTRlTE9C4vi5wp1zqt\n37p1q5cnuTJeHpXRGpd+jFjE2nv7w4x10wljhaySdVqQn5\/vli5d6goKCtyqVavcunXrnI1LiDxi\nm0gJr6PEYMkvojIiSk5GynPr16\/3ciVfvyXTQo8BMQi\/os3iCWLN+1jSrIWyTgsWL17scnNz3bJl\ny9yKFSu8tVKg0Eqx5Z0IRs88g96Vj5ojr2qdSEr+xo0bfeooQnl5ed4Z0q0UMu\/yXIAxEzxBvDMf\nAu0ipomySgQFkdM35Y7CpbBZOOVBHSHaqYLICPYuIzQugpqvdZIhj8qTq1ev9g6QHv22vBQPSBYy\n58Z+gkxotw2hyfKYhMjtykkJVS4pZFGieDMBgR7QCuFGUA9OgxikOsB55ajlozwZzUl5TR6VXnlO\nT\/Hg2zK8eIMRnAupVhEzkhZuyzl5UOcguZEg\/86hqBWFDSiugEQB3vqUkvUUVeJBQvwCnnwHkgsx\nopiNdBzDYhDr1maQHNsQIee8PiNHbvZB9kc8muMJ4qmnGajQgJEM4e5kUie7uxNhbZBsQHglitZD\n7hsIvMoJcAfJfFPAzeGpujpJoDm4gTydAcmPWbeU9TVEJYY8LxdyXeiJS5\/0Sj+oh9PLpElm\/zkI\n+68IawkoA+V4tQxyvyNgEWH4FaEL8dwckl8Np7qPCQGTKE9TIfoojcAz\/H4KUg\/T9UwJXfSY0OyO\nU60lFWYS3i8h+Ctyf0N+Lt7aDEHpLYPkXrh8hjG39jcOoZKMCgInBhiJnNDijwsNphrYkWF+NiF9\nCHwN6tQEgF5wjHZqLq3f3TzHhA4pM1SHUYH0+CDbDDWd2eFaoTWp0TZraCjSwyMwwcPCeJrNRfFo\niMzg3NtI2+S7kwvQDv5g3rRgUEbomFJD7R8aZF8ZYDozw1jqv70KpEigcovmIk8tkw5qgw7qyPtZ\n3r8n7BOC4pQhg\/0XrB9NAzqTfIzZAW0HsxA9sNnZJXj64ZAa6f8HwUySfRJEFlolsc7FarIOZ+tq\nQAtEv2YDTRx0L4b8G0VYp0OixrpkVRRrp6zLsTYslMTtrJkVNkj6YBIcRj7lcD59otJlsG7boE5H\nVUMlLqAFkvMG1Yth943UwUwYyy2ceoqQKkMUKmVWDjWHklhM2GeFXEwbDILa+mPx3pvyjsJotVUl\nS51OFPom4poX5jbhyS8GvHMkgVxKOKMmQqjIck1PNRJqKgRdC6JQo6F5AXFI5rPb7wn\/9khN9tGS\nRR49Ro71yDN2+bFCL+juYrBmQwaoe9F8DKog3LND6ctIJkGd9DkoWSKF6kb0VCeiTltQsR8I8qwM\n0RrQhYwF4f6bnM1iRwvHxXS6mTaFTa2XniKmtj10IL4bMdg3u3NojYBhm8jJR5O2WUINHYv1c9Vc\nagPoKc8UFhZ6qHUX1H0b7JsMUMgjG6kRWR+ExiM9Wbs3m3BuiG4EdcFq1w26V1wI+y5PKx0E1vbi\nye\/D\/wgzkkVwHIJz5QndG+zuIO+IhC4+S5Ys+Qv0zS5cMkYbRmBtnAh8G1qujGTt4GsIy0tSpHuD\nyOmpd91dhGj+CfomzykHbVeHnV5NuN9OWtmzM5DzazLW\/6ydKaWCCBrpgWDjdikCjURiHkfNbX9p\nSJO0UUZw0N5FmD6HZJV5zjz1dwhz4pA7QA5+yFk4NRzUGcmuJMrFkZS6G6m1zxKun1BaCNkdEKgm\nrF2R46YbcrWMleK9fMI6n43xjNaGf1JmDFbDkBFCk8U18nYO3WlUlhnk5+OQfp7cegkiL+o3h\/MT\njD\/C+H2E9FYa3KywNv1yyP0JFWjv7Z15nKIAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/esquibeth_note_2-1346982150.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

itemDef.oneclick_verb	= { // defined by esquibeth_note_2
	"id"				: "note_broadcast",
	"label"				: "note_broadcast",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
};

;
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
	"no_auction",
	"no_click_sound"
];
itemDef.keys_in_location = {
	"n"	: "note_broadcast"
};
itemDef.keys_in_pack = {};

log.info("esquibeth_note_2.js LOADED");

// generated ok 2012-09-13 11:31:08 by ryan
