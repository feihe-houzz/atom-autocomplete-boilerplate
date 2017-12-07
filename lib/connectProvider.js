'use babel';

class ConnectProvider {
	constructor() {
		// offer suggestions only when editing plain text or HTML files
		this.selector = '.js';

		// except when editing a comment within an HTML file
		this.disableForSelector = '';

		// make these suggestions appear above default suggestions
		this.suggestionPriority = 2;
	}

	getSuggestions(options) {
		const { editor, bufferPosition } = options;
		// getting the prefix on our own instead of using the one Atom provides
		let prefix = this.getPrefix(editor, bufferPosition);

        // console.log('service provider..', prefix);

		// all of our snippets start with "@"
		if (prefix.startsWith('@connect("')) {
            // console.log('goint into suggestion');
			return this.findMatchingSuggestions(prefix);
		}
	}

	getPrefix(editor, bufferPosition) {
		// the prefix normally only includes characters back to the last word break
		// which is problematic if your suggestions include punctuation (like "@")
		// this expands the prefix back until a whitespace character is met
		// you can tweak this logic/regex to suit your needs
		let line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
		let match = line.match(/\S+$/);
		return match ? match[0] : '';
	}

	findMatchingSuggestions(prefix) {
		return new Promise((resolve) => {
            const resolverMapEndpoint = atom.config.get('graphql-annotation-autocomplete.resolverMapEndpoint');
            fetch(resolverMapEndpoint).then(response => {return response.json()})
            .then(json => {
                const resolverQueries = json.query;

    			// filter (list of suggestions) to those matching the prefix
                const servicePrefix = prefix.replace('@connect("', '');
                // console.log('servicePrefix: ', servicePrefix);

    			let matchingSuggestions = resolverQueries.filter((val) => {
    				return val.startsWith(servicePrefix);
    			});

                // console.log('matching suggestions: ', matchingSuggestions);

    			// bind a version of inflateSuggestion() that always passes in prefix
    			// then run each matching suggestion through the bound inflateSuggestion()
    			let inflateSuggestion = this.inflateSuggestion.bind(this, prefix);
    			let inflatedSuggestions = matchingSuggestions.map(inflateSuggestion);

    			// resolve the promise to show suggestions
    			resolve(inflatedSuggestions);
            })
            .catch(error => {
        		atom.notifications.addWarning('autocomplete fails due to connection error: ' + resolverMapEndpoint);
            });
		});
	}

	// clones a suggestion object to a new object with some shared additions
	// cloning also fixes an issue where selecting a suggestion won't insert it
	inflateSuggestion(replacementPrefix, suggestion) {
		return {
			displayText: suggestion,
			snippet: suggestion,
			description: suggestion,
			iconHTML: `<i class="icon-link"></i>`,
			type: 'snippet',
            descriptionMoreURL: 'https://cr.houzz.net/w/api/graphql/annotations/'
		};
	}

	onDidInsertSuggestion(options) {
		atom.notifications.addSuccess(options.suggestion.displayText + ' was inserted.');
	}
}
export default new ConnectProvider();
