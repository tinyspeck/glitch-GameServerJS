var label = "Teleporting with Followers";
var version = "1332472922";
var name_single = "Teleporting with Followers";
var name_plural = "Teleporting with Followers";
var article = "a";
var description = "To teleport with followers, ask other Glitches to follow you and then teleport as usual.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["quest_req_icon_teleport_with_followers"];
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
	"no_rube",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-32,"y":-77,"w":64,"h":76},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANQklEQVR42rWYaVRb55nHM\/3QD\/Oh\nmWnnnNhpG6d1l7Rp7ePEzWoPdWynJ05T1x7TeMfG7PsiiUUSAiSBEAIJJHaQxA62WIzYN2HAYrEj\njHccG4iB2CYGvCV1iLn\/Pu81TnGbeikZnfM\/9yJx7\/3dZ3uf93nmmUV8VKqwZ9VxEU5PKvb\/z\/x\/\nftgDVPLIQNKISiFGXKIcSn0i2PnTKF4ROUDHzd8qWLxCrI2Xi2cYUCg4Hiy2IAeHz595asCvxV6U\nXnjxgAqxjd0w8sRx\/sZJXe3QJMchMT4KGlUUHaVIUEruW0ceibjYCCiiwyCXiRAbJUS0VACZOBQx\ndM7+Zr8vBE1QRsq+FUCdJhZpujhkGhIIJIIeGoIwgS+C\/N0R6OeGoKgwBKWoESwVwc\/b9SH5+7gi\nwPcAfDxc4OPpgnCBH8GKvh3ApIRomylbi+w0NXSJsQgX+iFEr0GoTg1FsgrxmjgI1Qp4+HvAw203\n\/MOCKD6VUCfFQ6JNQFCqBoK0ZEhU0fSdEvL4aAiCveHtsReBvm6QR4kWB1ho0o\/kZGgQTW6NS1VD\nmhSH4AAP+DOLkDUYlMeB3XA\/sAvurrv4I\/vOiwB8vffz1g0N8kKEyJ93tTImHJoMLZIKcyAOC6Br\ndpoWB5inl2WnJSImTgpJeBCEIT4IYoDkNmYFBsOg3Fx3wm3\/Th6SAXu674GP1z4EEGBIoCdv+SgK\nCwaYlCBDegpZmNzsvn+H06ITpSw\/c3NMlGBGEhGMcJJAFEjHEEhlYfxDxBR\/Yhk7iiCRhUMaHUEK\nhyxWjBiFFAp6uViKtxg5JYZKhiR1NIvnGU\/X3SufGgbA90gvk1aQVpFWk94oKzYeMZsyYW6pR\/H4\nJ6ibmUI7yT71GRp77Sg7VI6K6irU1NfC2lCHzuPH0PfxEI5fn4T96qewjV5E3SkHKlvrUXGoCI21\nlk6671vs3qTfkV4h\/fhJAH9F+pC0i7Sf5EHy\/WT0UnFfbydqWhrRMDGGDvqyl1TT14esrCwUFBTg\n4MGDqKqqQm1tLZqbm9Ha2orahgb0TE3hGP3v0Xtf4ejlYQwM9GH88kg5fRVC8id5kVxJ7z4WUJOZ\ntrW1uzOyw26P6u7vjY2KiTkeGBryebBQgBRDKkqrDqHB1oyaI20o7+xARkYGcnNzUVRUhEOHDsFi\nsaCBoNrb22Gz2dDU1ITDdN5xeQT204NwnDs1OnFlzEgwfvNgbiSXeYO8\/Ui4Ddu3yd7d+SH+4u2O\nnf7eeHOdE1a\/+QZeX\/M23li7Fk7vbsRWFxfsF4ZCnKpDam420tLSvgYsLS3lIa1WKw\/Z0tKCmpoa\n3qLtQ2fri\/qPdpm7j1Qq8nOOa4pMaZoio0FXVhTe0tP1e4JbTvrPfw3n7Pzs+h3bZjbscAbTWx+8\nhx8sXfKQnv\/pT7Bm82ZscjuA7UIhJAoF9Ho9MjMzkZ+fj8LCQpSVlaGiooIHY2IuZ1Y11NfcUFQf\ngrjEDHe1HHsooR5ot1Q48qfAwOcea70HcEyvv7fxnwB\/uuK3eG\/\/PoITwFMVD7FCjpSUFB7QbDbD\nZDKhqa4S3bZa3poMrqSkBNVVFmRRciU21UFZbYG\/IQkuMRHzgELsZpIKbY8DtC0EXLH2rX8C\/A25\n2jk4CB5KBYQUe+KEBCobKt6KBoOBB22ypMF\/+0paEhNRXFzMJ49S9CEqHT0wdNqgIcjQ3HS4JcRi\nj5SB\/d2SzmGPaMkeB\/j88uVY\/Yc\/YF+UFMEEFFtSDA25MyIigrcig2QqNGWgoigFJmMe8vLykJOT\nQ0U5DiX9duQe64Wekiu8yAgfWrf3Uq1c6GoC\/tdFe\/0O56qFgGu3fPAQ4PKVK7B261b4qtWQmE1I\npkTI6+qCzmyei4yMRGJiIpKSknhLPrAoKz8JZOVscn3VpQsoOnUCWb3dkB0sRkC6DgfiZU8D+H8u\nCwGZVq37Xx7uf55fipdefw0bdu+iRiEVivJypFOGljkcsM\/MTJa1tf2VQSooaVJTU6HT6WilUCEt\nWY6sTD3XRAW7\/vIoDlH\/aPyoH\/LDFoTkpMFDo3wI8JEu\/iY3P4D80c+X4zdUZja5uiIsOwtqCv7c\nzk40j41NnwUmLgB3P5qYmE02GHhryuXUbSuVSNbpOPvly1\/23ryBlk8nUHlxCIWDDqhqqyA0ZcFb\nq1povcc3DazUfBPkJte9WLN1C\/7k5Qmx0YiU+vpZ68WL4yeB8+eA6RECvHT79qwyLo4LCAjAyGef\n3ZsCvpoAZofpN8cXn9\/rmLwK68glFFOxTmiwIqwgF77UirE4ZGXmsdZb+Fn34ZaVCwGdtm258crG\nDdjs44PGqamC40DVAMfZT3LcxfMcd+vi3bt3yy0WjiUEy9z2I0e4m8C9KwQ4SoDngRvd01N3raPD\nKDlzEomNtXyi+FG52Rsjrn4qON6SO7ZpeTiy5n8tXbrsxy\/9kgf8MwFqGxrO0bpadYIATwOXhjju\ntqWu7h6recytLHPLKUanZ2fvXSUrMsAhAjw5N3ex7fpn45aPhyZ17c3XIotNEBXlpR0Evvt0cP9Q\nsJf+5MWRH\/3yF1i1\/h18QC6WFRbe7AMsA0D3KeBCy7lzd9gyl5mVxclkMj6DmRX7T5269ylZkLmf\nhcEpjjtH1xzpB8ozjvV0hBfmwT9dO+5rMPzgqVy7cLlbvXEdn8U\/\/NnymRW\/d8L77m4QZGYg5+jR\nix8B7RSDZ7KNxrnq+vo5pUrFseRgcGwVMZnNnP38+dmPCfAsx10Z5LiTdE0rdUCF8XXVc6L8XPik\nJmK3TDTwxC4mqIGF1mPZu+TFF\/Dcshfw8ttv4d29exBIJUReVgrr6OgJ2\/j4WRZ3FQ0NcyIR7eJi\nY79uGtiqklNQMHeO426SpYcdHNdHoWE9PD7WoaypgCAvA14Pslgq0j4WbuMOZycGtX77thF2XLPl\nj\/j+kiX4+aoV5OZl+Nmrr8DpL85wj4+DhNxsuXCh7\/Dg4CmCu3NkeHg6QaPhjJThrLtJNRi4ivb2\nr5rPnPmCrDd2Ahgk67X1clypceD4mMxSiqAsPdxUMay8zLIlb6c4dNkjAddvdzbNJ4aMIPEO6U3q\naGiFwUuvreZeePnX+N37mxBVXm7pApTdQF4\/x1U7KBbJfafzrdY7rGHIoSTpvXbtFllukiw3ylzr\nuB97FfmnBye0thZEUkfjyzI4NpIvMcyKu6TCrkcCvrNz6zJmxVc3bHiWAOcYGEGOrHpvo9N\/L3nu\n0+deXAYWhwevXvVovX0rrv3albqOySsD3dPXh6pPDIxGKxRfsaWOZXHrmdM3j9+5M9l\/5\/aE\/eaN\nka7p6+darl3tze7t\/FLdVPuFgIq0Z3I8dTF8q2WjbmaAgT5RHLoLQ\/64J9Dv5t5gf\/hFiSvzy8s3\nrHlnHd7f8uexCLkMKcX5s6amuukSexcs1PpbqQCXDJ7guxoTNaYs9soqK1FvPwobW0FuTKN+6jrq\nhz9G89mTN+sHHZfNjdZbsRSDkgwdars6nKlR\/e3Q8PBrT7QncQ8XOJR63TVVmn5Sk5Ux2eNwqAyZ\nma01tYf7O7vaUEmLfe2NGTSCQzuJ7Xx6SCXUODReugQ9tWFarRZljY38PoRKEigccITUMvslOsY+\nQd+JY7C2NSK\/rhq2j\/rZ3uTAfNu\/\/rGAsiT1puSsjNMGs\/GYKl2PxMx0tHR1mnqOdvQ0NVrRYu9E\n2yfD6KDdnP2vX4BiCxRjGCRRzOH0vNj5wN27cHx5F+Rq9ExPofvKODqHzqCrqx1N7U0ob2kYK6ir\n\/nx+X7KP9OqTbj1\/6Dh\/fnV6Ub5LqbV6W5+9I9iYY5jIoMA2pCRCn5YMQy5tlsoKkU+dSUF9DYqb\n61Ha1oxSSoJSWyt\/XtLaCBOVFGNFOUzUYplL8mE2ZqCkMBclpSYuNiP1TLqlRE3PW0l6ifSdp9kg\n\/wdTQV6qNiddw0+mFk4WAgI9EUwb+FDatItocx6hioU4MQ7S5AREadV0VEGqob8T5JDEySChjI2S\nhD40WRAEebFpxL85K5wHNGfrbhmzkvmJFgMULRx9eO2DLzsX+CMwPBghYiEBh0MgiyCFQygNg1Ai\nhEDoj3DSwtGHNjEGQX7uCPBx7VgUoF6vdtAOEQwyjm7OJlNslMaP0wiQzWD4WYznPnh5u8LL1w3e\n9GBfkh+d\/314FABxeCDCQn0RQi\/lcWAX\/OglNaqonkUBJiglYwVFucjL0cGYrUMegbLBJRtWRgj9\n+Pmgn\/f++9OtBfJ028NPuLz5mSBZmlmbjuzFwui6aIkAMnJ5jEQwsihAuUzk0MRHEaAB+aZM2vOW\nIis9CSnJ1N5rlUilIxtuJquj+akrm7YyeOZKNqSMJgg2ZX3wfQwta8zdIrKkOCyQfgs9vChAJplY\n4IgkF0kigughYrJiKnUtRhSX5iOflq0c6o4zSWmkVJKWlFSUh6RMHTT0UjKFhI9Z5tLA+XEci2WK\n6cZ\/f+a2AJBJHOq7LEzkdzgkyHOSzfyYW9kDQ4O97ovijD04JOC+GMiDYSaLU29PF\/6a4ACPyZBA\n78JQuh9\/70d8\/ga1ibxi7HBrOAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-12\/quest_req_icon_teleport_with_followers-1324496078.swf",
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
	"no_rube",
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("quest_req_icon_teleport_with_followers.js LOADED");

// generated ok 2012-03-22 20:22:02 by martlume
