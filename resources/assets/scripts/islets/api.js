export default class {
	constructor(baseUrl) {
		this.baseUrl = baseUrl;
	}

	getModules() {
		return this.call('GET', 'modules', {});
	}

	call(method, target, body = {}) {
		var headers = new Headers();
		var request = {
			method: method,
			headers: headers.append('Content-Type', 'application/json')
		}

		if (method != 'HEAD' && method != 'GET') {
			request.body = body;
		}

		return fetch(new Request(this.baseUrl + target, request))
			.then(function(response) {
				return response.json();
			})
			.catch(function(error) {
				return console.error(error);
			})
	}
}
