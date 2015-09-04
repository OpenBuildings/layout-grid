/*jshint curly: true, eqeqeq: true, immed: true, indent: 4, browser: true, jquery: true, evil: true, regexdash: true, browser: true, trailing: true, sub: true, unused: true, devel: true */

var canIUse = (function () {


	/*  CONFIGURATION =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

	//  URL to the data feed
	var SOURCE_DATA_URL = 'https://raw.github.com/Fyrd/caniuse/master/data.json';

	/*  Turn auto run on page load on or off with AUTO_RUN.
		If you turn it off, just use canIUse.render() to kick it off again.
		If you don't want the WhenCanIUse data to load in the background, turn BE_READY to false.
	*/
	var AUTO_RUN = true,
		BE_READY = true;

	/*  Configure the browsers you want to show here.
		The order defines the order they will appear on the page.

		Browser options are:
		* android   - Android
		* and_ff    - Android Firefox
		* and_chr   - Android Chrome
		* bb        - Blackberry
		* chrome    - Google Chrome
		* firefox   - Mozilla Firefox
		* ie        - Internet Explorer
		* ios_saf   - iOS Safari
		* opera     - Opera
		* op_mini   - Opera Mini
		* op_mob    - Opera Mobile
		* safari    - Apple Safari
	*/
	var BROWSERS = ['chrome', 'firefox', 'ie', 'opera', 'safari'];

	//  Customise HTML here
	var TMPL_TITLE = '', // feature title {title}
		TMPL_STATUS = '', // feature status (W3C Recommendation) {status}
		TMPL_DESCRIPTION = '', // description to user
		TMPL_DESKTOP_TITLE = '', // desktop header
		TMPL_MOBILE_TITLE = '<h2>Mobile / Tablet</h2>', // mobile header
		TMPL_SUPPORT_WRAPPER = '<ul class="agents">{items}</ul>', // support wrapper {items}
		TMPL_SUPPORT = '<li title="{browser} - {support}" class="icon-{browsercode} {supportcode}"><span class="version">{version}{prefixed}</span></li>',
		TMPL_PREFIX_NOTE = '<p>* denotes prefix required.</p>',
		TMPL_LEGEND = '<ul class="legend"><li>Supported:</li><li class="y">Yes</li><li class="n">No</li><li class="a">Partially</li><li class="p">Polyfill</li></ul>',
		TMPL_FOOTER = '<p class="stats">Stats from <a href="http://caniuse.com/#feat={feature}" target="_blank">caniuse.com</a></p>',
		TMPL_LOADING = '<h1>Loading</h1>',
		TMPL_ERROR = '<h1>Error</h1><p>Feature "{feature}" not found!</p>';

	/* END CONFIGURATION =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

	var canIUseData, // store data for multiple uses.
		storeElementId, // temp storage for elementId if we need to JSONP request
		populateOnLoad; // temp storage for if we should populate



	// get feature data based on feature name
	function getFeature(featureName) {
		featureName = featureName.toLowerCase();
		if (canIUseData.query) {
			return canIUseData.query.results.json.data[featureName];
		} else if (canIUseData.data) {
			return canIUseData.data[featureName];
		} else {
			return null;
		}
	}

	// get the full text description for the support status
	function getSupportStatus(key) {
		var status = {
			"y": "Yes",
			"x": "With Prefix",
			"n": "No",
			"a": "Partial Support",
			"p": "Polyfill",
			"u": "Unknown"
		};

		return status[key];
	}

	// get the specification status
	function getSpecStatus(key) {
		var status = {
			"rec": "W3C Recommendation",
			"pr": "W3C Proposed Recommendation",
			"cr": "W3C Candidate Recommendation",
			"wd": "W3C Working Draft",
			"other": "Non-W3C, but Reputable",
			"unoff": "Unofficial or W3C 'Note'"
		};

		return status[key] || "Unknown";
	}

	// find the first version that had this status
	function find(needle, haystack) {

		var result = {
				"version": -1,
				"prefixed": false
			},
			compare = -1;

		for (var item in haystack) {
			if (haystack.hasOwnProperty(item) && haystack[item].indexOf(needle) > -1) {
				// some browser versions are formatted n-n, take the first number for comparison
				compare = parseFloat(item.split('-')[0]);
				// is this version lower than the current version we have stored?
				if (result.version === -1 || result.version > compare) {
					result.version = compare;
					result.prefixed = (haystack[item].indexOf('x') > -1);
				}
			}
		}
		return result;
	}

	function findSupport(browserData) {
		var status = ['y', 'a', 'p'],
			result = {};
		// find what support is available for this browser
		for (var i = 0; i < status.length; i++) {
			result = find(status[i], browserData);
			if (result.version !== -1) {
				return {
					'result': status[i], // what type of support
					'prefixed': result.prefixed,
					'version': (result.version !== '0') ? result.version : '0' // the version with that support
				};
			}
		}
		return {
			'result': 'n',
			'prefixed': false,
			'version': 'No'
		};
	}

	/* put the data in a more platable format */
	function generateResults(feature) {
		var agents = {},
			results = {},
			currentBrowser = '',
			support = {};

		agents = canIUseData.agents || canIUseData.query.results.json.agents;

		results.title = feature.title; // feature name
		results.code = feature; // feature code?
		results.status = getSpecStatus(feature.status); // feature specification status
		results.agents = [];

		for (var i = 0, l = BROWSERS.length; i < l; i++) {

			currentBrowser = BROWSERS[i];

			if (agents[currentBrowser]) {

				support = findSupport(feature.stats[BROWSERS[i]]);

				results.agents.push({
					"browsercode": currentBrowser,
					"prefixed": support.prefixed,
					"supportcode": support.result,
					"support": getSupportStatus(support.result),
					"title": agents[currentBrowser].browser,
					"type": agents[currentBrowser].type.toLowerCase(),
					"version": support.version
				});
			}
		}

		return results;
	}


	function generateHtml(results) {

		var html = '',
			resultHtml = '',
			desktopHtml = '',
			mobileHtml = '',
			prefixes = false,
			result = {},
			i = 0,
			l = 0;

		resultHtml = TMPL_TITLE.replace('{title}', results.title);
		resultHtml += TMPL_STATUS.replace('{status}', results.status);
		resultHtml += TMPL_DESCRIPTION;

		for (i = 0, l = results.agents.length; i < l; i++) {
			result = results.agents[i]; // simply things

			// we need to show that prefix notice, captain
			if (result.prefixed) {
				prefixes = true;
			}

			html = TMPL_SUPPORT.replace(/\{browsercode\}/g, result.browsercode)
									.replace(/\{prefixed\}/g, (result.prefixed === true) ? '*' : '')
									.replace(/\{supportcode\}/g, result.supportcode)
									.replace(/\{support\}/g, result.support)
									.replace(/\{browser\}/g, result.title)
									.replace(/\{version\}/g, result.version);

			if (result.type === 'desktop') {
				desktopHtml += html;
			} else if (result.type === 'mobile') {
				mobileHtml += html;
			}
		}

		// only show if we are including desktop browsers
		if (desktopHtml !== '') {
			resultHtml += TMPL_DESKTOP_TITLE;
			resultHtml += TMPL_SUPPORT_WRAPPER.replace(/\{items\}/g, desktopHtml);
		}

		// only show if we are including mobile browsers
		if (mobileHtml !== '') {
			resultHtml += TMPL_MOBILE_TITLE;
			resultHtml += TMPL_SUPPORT_WRAPPER.replace(/\{items\}/g, mobileHtml);
		}

		if (prefixes) {
			resultHtml += TMPL_PREFIX_NOTE;
		}

		resultHtml += TMPL_LEGEND;
		resultHtml += TMPL_FOOTER.replace(/\{feature\}/g, results.featureCode);
		return resultHtml;
	}

	function generate(elementId) {
		var $canIUse = [],
			$instance,
			featureCode = '',
			feature = {},
			result = {},
			i = 0,
			l = 0;

		if (typeof elementId === "undefined") {
			$canIUse = document.querySelectorAll('.caniuse');
		} else {
			$canIUse.push(document.getElementById(elementId));
		}

		l = $canIUse.length;

		for (i = 0; i < l; i++) {
			$instance = $canIUse[i];
			featureCode = $instance.getAttribute('data-feature') || 'unknown';
			feature = getFeature(featureCode);
			if (feature) {
				result = generateResults(feature);
				result.featureCode = featureCode;
				$instance.innerHTML = generateHtml(result);
			} else {
				$instance.innerHTML = TMPL_ERROR.replace(/\{feature\}/g, featureCode);
			}
		}
	}

	function showLoading(elementId) {
		var $canIUse = [],
			$instance,
			i = 0,
			l = 0;

		if (typeof elementId === "undefined") {
			$canIUse = document.querySelectorAll('.caniuse');
		} else {
			$canIUse.push(document.getElementById(elementId));
		}

		l = $canIUse.length;

		for (i = 0; i < l; i++) {
			$instance = $canIUse[i];
			$instance.innerHTML = TMPL_LOADING;
		}
	}

	/*
	 * Load the data that will be used to display information.
	 */
	function loadData(elementId, populate) {
		var url = '',
			script = document.createElement('SCRIPT');

		url = 'https://query.yahooapis.com/v1/public/yql?q=' +
			'select * from json where url = \'' + SOURCE_DATA_URL + '\'' +
			'&format=json&jsonCompat=new&callback=canIUseDataLoaded';

		// remember these for when our JSONP returns
		storeElementId = elementId;
		populateOnLoad = populate;

		script.src = url;
		document.body.appendChild(script);
	}

	function populate(elementId) {
		if (typeof canIUseData === 'undefined') {
			showLoading(elementId);
			loadData(elementId, true);
		} else {
			generate(elementId);
		}
	}

	/*
	 * Public Methods
	 */
	return {
		render: populate,
		dataLoaded: function (data) {
			canIUseData = data;
			if (populateOnLoad) {
				generate(storeElementId);
			}
		},
		init: (function () {
			if (AUTO_RUN) {
				populate();
			} else if (BE_READY) {
				loadData(undefined, false);
			}
		})()
	};
}());

function canIUseDataLoaded(data) {
	canIUse.dataLoaded(data);
}
