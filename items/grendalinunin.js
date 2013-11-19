//#include include/takeable.js

var label = "Grendalinunin";
var version = "1338860297";
var name_single = "Grendalinunin";
var name_plural = "Grendalinunin";
var article = "a";
var description = "A compound made out of red, green, blue and shiny.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 500;
var base_cost = 11.7;
var input_for = [166];
var parent_classes = ["grendalinunin", "compound_base", "takeable"];
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

// global block from compound_base
this.is_compound = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_alchemistry_kit", 1))) out.push([2, "Compounds are much easier to manage if you have an <a href=\"\/items\/497\/\" glitch=\"item|bag_alchemistry_kit\">Alchemistry Kit<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	if (pc && !pc.skills_has("alchemy_1")) out.push([2, "You need to learn <a href=\"\/skills\/51\/\" glitch=\"skill|alchemy_1\">Alchemy I<\/a> to use a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	return out;
}

var tags = [
	"alchemy",
	"compound"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-22,"w":22,"h":22},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKo0lEQVR42sVYe1BU5xW\/TmqT8ZFd\nloXdBRREEIHdvftedtFuNONM2+l0p20ymf5TJpPGNsk0NLVJGvPYJOaBD9zUxzREdH03UuH6QIwa\nvVGDD14XRF4iXFECEsELSojJtHN6zoULixoNDibfzDe7d7\/7+N1zzu\/3O98yzDiOovJGf9HpRr7m\nYhcvStd94WsFFS0qvk4MtXb38o0d3Xztpa7AzddHFIAqgYPAjEJgmfEee8qbgsWV52C\/0Axdff3Q\n3T8A1258w9Fa4ekmlitrkEpo7Vo\/9H\/zLVy8IkHeoQqVcr06R2IjP+iVdB\/2Q0zoa4jZdEOcvKp\/\n\/IAWnqjjS6qa4UitCJ0I8Nv\/\/g8uS9eB1vZVNHP7hfNwoLoFmjp7ZPC9X92AvP0ng6tKynwJS9uz\nfvLCBZj0WgdMXdIlzwde7QAmR8oeN4A7S8\/yh2tbobK1E8TuXvjy+ldQeb5dyvvkFL\/5cKUogz8r\nwtn2L+X15ss98PHRan7dgdOBn23pDDALm4H5xxcw4dVOYJ45D8yrl4HJvRYcN4AIQiipbIITTRcB\nawxq2i5DSXmj\/ABKZeHJOoxgM5Q2tkFbTx804TlFJ+pH6vTpZol5+QsCBUz2BWDeugLM6gFuXOtw\nw8Gy7OLyBqmtu08obWgL5B+uilfWtn9WHfxP6Rlh+1EBqls7xNL6jvhRFz9zjmf+fgmYpb3ABL4E\n5v2rPJMHKubHGC8X5Kn+9PFbfuV40pvvBiYu3hViFrXGM+9LArO8T2B+zDH3WIzffdDAL6iIy9bk\nmkJTc54YBosR5OUZPjjLrMAOdhbQ3GJKhmavK3C\/wNn26EM\/r4qDP3QlwGMt08G+VzfM1AhM6cMf\n9osP5w2MJkdNhjmr1mOTAR5zmuHSXI\/vfoAzrFHHmzk9zD8VC79pmg6\/qp0Gnk8NPPPyVdWkNzoD\n6pxuSbu6DwzrB2Dav78NoWCP1OkZj0UgcCddFqHemxpPc7wBqnPU7MxNUWAr1kPmkRjIOGSAmZtT\npAcXrxWY51rgpy9dgilvXgbV+1dg0hIkypKeQBhAk6\/KbZW2mpKDLZkuqcbNjmuhRuREqDS5mkBE\nbiQXnx8FyVuiIXFjlBj9oZqduGh3NvNcKzBvdMGEF5HJz7agDqIe5vaNAMxPnRG\/Lj0x2J6ZkVVi\nS4czGXaocZvvWcktu3TBX1THwRNt8ZC8LToUsSKSV+eqZeuaskztUy\/VBBkEPaSBPhngmxi117uA\nWYQg3+kBZu3XYQDTZ2ZtMCX4Gr0ucSfW4hFHOlS4WfFeUh29Ss1adutBATjnaIyorM07FeOffyom\nNPez2BEiPIXy8myLIAMkDXyNXKRPYjbACBcweqGGDJccvW3mZFBYXWSZlTVWgJOx1pI2R4PrEwPM\n\/SwG7MV6WTZs+\/QhAp11BRncGg8kN6MuXHIlwCzpRpHuEW8RaQQ4qubyjTM5iug9kQFTqV6uCU3\/\nSAszQlopFuuMGMwig+ediIVf102To5txUD9a73IQ1LJeGKWD69NnsOuNiQEEKCIonqIo\/46\/3QvA\nQXBqv0IM9Uq1T\/mdGGzdo5fZS9FN2xE94rUoNZOXdGWpg72gWz8gJRQNpXefdbZ4zGEEHmtuny0N\neLtZBrjflhZAbbyrWdsPRagWlMX5aBIYBZx1bzSbyRuC80\/GBudXGeJlBi\/XCNM+ipQIaMJ6LReR\nFzGSxj82+yc8L8LkNzohYsVV0OX1g+Zf1wNMrSudrfVYJAJXmWETKXKbjElCDbL4rMcOJD\/fydTd\nuuxHy+IkIgJN5359SFlzHTRI\/obp8GTPDNI8iQDe8U0XNgeYFy7KTH7gL60oN+3E5OCwkzSgk5Q6\nWf6q3a5CHRQKkCCH7UaUG0votrqGb8\/u0kmPois8jgVPE6MlabD2tEGNYNmlp2P4ZfU08B2Lle5a\nGwubObmbee8qMM9fGJScfw6MyNwxp8m3ESNHNbiDTYE91tlwwJYKx51G2Ge9VWq0mM6U7dGApi9b\nF036LqcZdS5hQxSYinRg3auHtILou\/d1JDUvfSEw7\/YMivSKPp7Jh9HPzTcmSuGyg6QBEu8i6+xb\n04wEiFkbKc3aFg1mBEIzeWvUMPseXqbJjvpAIxrWRnJqZPD3YliO5GfeQ4BLr\/K3XScWK65CMhNC\ngKSJx50sdHi9tzwEpSSgWaER9Gu0vGGNNkisnVem99EkQqhXqMcm8suu+yatvg6qvIHb22yJNZUn\n0hxypPnLXGaodLOyWNd7HdLNjrKgKs6XtGUkdbMLtL5HPo+VHhcHCWPfpw+NBdvERW3ZU9++LGlW\nSkA7u7jNNyTdhhsjNUgRujDHDTUZrFhgSvJhDYoNXjscQqKIc1xchcfErXksOWjfossmMvz+0iCQ\necdjZX9N3REVRIDwu\/PTZZdAQZbGFL2nz\/ET\/tYGDy1uhylvd8GDr3cQUUZSfXGuJ7jHmgrVGTY4\ngcQguUFtDDZnOlFqrHINLnpqRrxxi04kINTPkYw4SgwSpZNcA6MGPlx7pDQWJccAYwXIkLQQi\/9M\nO7yOEUchaal226QSZG2p0yihcEsETnEUmsp9EvK1HLnBHD5G7umMO3U8MVebqwkmhqLQHXSQXqDD\nVkobvCeAy\/uA+WsbMG\/Tru6rQYDUYhVaZsMQawUiy7q0BL8CkJhM3xORBJG5kfz0dVqJ+jlsCETy\nWeUZU3PUftTAQORKtX\/MBr6wRcW8eImTAb6C0VvWy93SMBCwm\/2Xjgl0XmKiauFv4wTb4ujAQ++o\n47UrNYJ2lXb8twbLr\/mZt7pv\/4KbTEl8hYsVWuyJMnKKYpgeiqSTBJTWcp9I4l95MuG+7F2+c5zx\nOIQWJIXSSSNZeHISqk1qYqkMqBxo7azHKt7Jp8d9KCw+5bIAbaAotcXWFKHJ64CtcgObgh22jeqU\nr3TZQo1eJ0kS\/wOBc\/tJ78h\/P3fKDQJgs8ARQRCsRMDKXVZpoykJaNIxAT6H4M+4TXckxKArJWYr\narDNnBQg1RgTwMPYDNDFSq19zCbzuy0p\/qFOJ9Ca6ZQUq7s4NyPEYaop9TRJkpS6VAYd0x6H7JJq\nuNxlFsrdZvjUngZHHWZpzADDWAw3s3iIKMOa9qndyNF59HBKNxFH6ca3IskK2GSJsvGJJc0fvqWl\nPwaohOj6e\/tnCoHRgzlLKtc+x8WGtWGhQusstsCcnF1oSUEAs8TNmGbeYR4Wb\/LpajfL1SGIvVgm\nVAIUxXp0IPJ2OqcW+8paj10ceiGBslbntnw\/vZRTghHZMcRU5a8PAnrO64JSh4njLClcI3ozbUeL\nrWlwwG7kKY01GbZAo8cmYi\/Jn3SZoAqt8qAtnSIK5E7nMh1SKTYfVIvhz6Io13vt0vfa1mJbJSrN\nKQFUXIUYTQympoHarlKnSY4O\/T1Cad04GEk6hv14\/TZTEnc2wyp35UQMAlFCWwnsinZZUiTFpYot\nqcEjDhPenyVC3l0JSp3pIUwBAnHKD9xtTRUoCvgpa+BxBEafvD0967zXMVxD9R4HtwtfhiKHkgPh\n0aAs7BzqzLebkyUCrETwtNsqUrbonjQVQt5x0M0RZIBSInqcvlMOi1+RBpnhmM6brzloN2aHn0Nb\nWGWtzuuQXUjx9PCxF2uaal6ZN6tA+Pg\/Opwpt7Yt3awAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/grendalinunin-1334267165.swf",
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
	"alchemy",
	"compound"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("grendalinunin.js LOADED");

// generated ok 2012-06-04 18:38:17 by kristi
