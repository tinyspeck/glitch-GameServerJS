var label = "Game Crown";
var version = "1313026181";
var name_single = "Game Crown";
var name_plural = "Game Crown";
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
var parent_classes = ["game_crown"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"crown",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-30,"y":-49,"w":49,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIAElEQVR42u2X+VOURxrH+Q8WGBhA\nQE5BhIQVl2g0heuFCsqloMBwDXIICMMhCCgMCggBuRwO5TIci0c4DFERI4NoFqPh8sADAyQr6HhN\nVjcl2WzVd7t7mIksl5Uya36gq7qmZt6etz\/P83y7n+dRUpobc2NuvLvhtVF5JZ2ua1X+NNtanp1y\nMm+jsnh8Nv6uYJ4blH1CtqkPHYozQn6CMWbbkBrBd1SF+G\/Lca\/dFiVCE1Dg3w0waCtH+u0XNnjc\n54IHlzcgI1KPQkbM5L2CRGOMdDvhWb8rOuo+puvF0xmzw0m1J5Y\/D2Qf0O9Te8lOuSfCg4vdPpqT\nrI320sDNllUywI4NyI0znNEjFF601wj9F9bgntgWrRVLpvX6Tjf1IbpmpMsR1VkW8NyoPDQVXGVq\nuB6GO+0xcGk9gl3VwLNVtnxjQ3Eh2bCr6RO0V\/8FQVs47DmbU+iMapQYIBXu1MbpI6sQ6PKrZ+gn\n06dMoxGHYvQxQIyW3HBB35mV1HAWHbrOw05Zj+mLvqyx8M941OuM4aubmIeoJfSZYkMCcTLHGNWZ\nxorw0k2ivbjIFOggxJUzwav0vwVCG\/SKo0AdIIfzd1RB4g5N7NquRtf3BLqoSs+VLsa3jStwOMGQ\nhVm0zwSxflqUIVeJ76AircsyYwvo7Kj9CHv8NJAdrYtQN7VfYQhg61Ez9DZZYZeHOguDt72yNIPA\nlR8wQhz5z5s6owbe7gjFyA0BwnkGGDeyMYoYVLrfkL3fd7MKqCElWT7IFTogmMDVZJnj+R03Fkka\nKSVy2qTffP4xRomgW0oWIUugiXi+JkqSDRBDXib3Sug2DtorLXCx\/EPUFyxkL2a6dVeDMHgeApxV\nZRaPey8\/eQWGr\/PxQ5cvyrLsZOvJcz8HFSQHayHWh8uiRI16NNiI88e9cVRoiLL9xuzkd9avAFkr\nZfpL5GuhgjyM2K6O8n068N2kjIhtXHiTT\/ndlxmpjbOFi3D+yIfoO21NvMgdohqhm0TxdJj35Pcj\nBb\/ZFoChb3gM8N7VOBrmHrkXQ1w04W2vwqJT\/CkPPz8ToanCFum7tBHN42JvsDGDI+93lAs6Oc5H\njYSUA2GABtJCNRDkwIXfJpm46fNSob4CsP0zK9SLPmAb+DlwkBG+kHpaKtdZftIyfPd3ngJQ0h+L\nuEALUIOoIXE8Pfg7MA1KR787gbHHCTh5ZB1KsvkQ+JqzgzLpJAvcOUP1WfOx01kNzbn6DDDYQYMJ\nnL60Kc9EAfhVuRVunlmBMHcNYrEOCuMtiV64LIx07Y2Lfhi4sk0BONq3A42Vfuxdgc7qSPI3QthW\nLRRlumPsaQEDHB0oRn11EhJCp7kz6Y\/1GfoIcOSgPEEPmaHkkDhpwcdelXn2jGjhBMDLtUvRWLQE\nB8NNcTRpMVLDFjBN5e2zxoOvvSYBPrydxjwT46WLlEBjxPLmY6C3hMHR+cvLZlQVC3CqMlhx6iff\nhTu0wd+sioOBuqjeb8AAAzar40CoFhoOmU4AbK\/6CLdbVqMq3RrlKUtQlmJFTqUq+i544W77lkmA\nT+\/FIStxNdJCFiB1pwlOFfth7EmeAvDnF+UM8GTplqmTANOhuxbzYJKPNr7MM0acpzaDLE7QnxLw\nSt1yXGuwxbFUa9RkLCWX8lpyArdPCSjpD0bXV4k4FGWO9FBTPH5wTAHHAJ8XYfDuGWQnLp463VHB\nywFjPTQhitLHiQwjBlifbTIl4GVSDNxqWY8vimxwIocUBpd4uHXBcVpA6WAaqjLXoaUmBK8lhyYB\n\/vKqFQciF00NSH8M38plhyTCjYvsUD20FJrgYqkp6tIXTAvYedIGw1+7kVzKx5021xkBn98X4F+S\nL\/HTkwa8fhQ\/EfBpLpsUcNoSiQLSKQcsjTfEOZEpalNnBuxuXo+7bSSXnrOfBTAM\/\/z+IF79ED8J\nUD7fCjDAicMARdEGKCdFwmyA1xrXMMi3AfxxMJIA7v5tgFR\/Atc\/KCAdFJAdlPcKaCaeFZBeqO8L\ncLrKmw3fTSp\/XECqQQoo9NFhgEK+9nsBTIu2kMoLZaU3S\/QgJ45Ufg9SwAAnVeQJ9P7vgPKD8mbL\nobhiqAdZTzA+\/UnrGMPTQGY4yc2pxu8MUHI3nLQC3uhr98H9a4F4MRgtg5OksMu68+z2idmE1mm0\nSKCHhILRVJdOCoZk\/3nYS4pZYdA8CDzUSSugSaoWXVKuGyAn1gi5exaQPtkUh\/eaoTDJHEXCD1Cy\n3xJH0xbjQu061OYvR2UWydEVa9H8mS1q8m3QUGZLcrInesYBxyRppOQ6TNKcGP953YsXQwksH0\/w\n4DikIyvBCaA8k1ANliXKQ2yCc4VmaCszx6VjlrhSswSdx5fiOinNu0\/bkI5sDW632pF050i6NFdS\nsHpi+JofHnYHYvRGGCR3ovB8YA9+HM7AqxERfpJU47VUjLGXXfj3SzHJxWV4eCsMEaQcm7alpVqk\nfQNphhDjoYH0YB2ISFtIAeuzZRpsPWIxAbC7aRkrXvvPr8L9to0YvOKM76964B\/X\/THSswuPb+7G\nkztJeDaQQUKZQwCzZYCPMnH\/egzzYnOVvUx35ARP27j\/jzf1xqvjRlqW04ZotzfRYoQuPo2cj4oD\nJqgjTfaJHEt8XmCFhkJrNJUsQ3PpJzhbsRLnq1azEF88vgHtp+zR0eCA5mOyENce\/itSBGYI2MIa\nMtarUKe8FdhMg3qX9SekLFM03r9hKhryuTE35sa7Gf8FUursfJL0718AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/game_crown-1313025597.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 0;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"crown",
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("game_crown.js LOADED");

// generated ok 2011-08-10 18:29:41 by mygrant
