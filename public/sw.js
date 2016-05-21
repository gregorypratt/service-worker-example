// The files we want to cache
var urlsToCache = [
	'/',
	'/favicon.ico',
	'/messages',
	'/socket.io/socket.io.js'
];

var CACHE_NAME = 'demo-v1';

self.addEventListener('install', function (event) {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function (cache) {
				console.log('Service Worker:', 'Installed!');
				return cache.addAll(urlsToCache);
			})
	);
});

/*
 After a service worker is installed and the user navigates
 to a different page or refreshes, the service worker will
 begin to receive fetch events.

 If they are cached then return them.
 */
self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request);
		})
	);
});

/*
 We want to utilise the Service Worker to de-couple our app
 from the network. So it needs to be able to handles events
 sent from the app.
 */

var messageQueue = [];

self.addEventListener('message', function (event) {
	var msg = event.data;
	messageQueue.push(msg);
	postMsgs();
});

function postMsgs() {
	console.log(messageQueue);
	if (messageQueue.length > 0) {
		fetch('/messages', {
			method: 'post',
			headers: {
				"Content-type": "application/json;charset=UTF-8"
			},
			body: JSON.stringify(messageQueue)
		})
			.then(function () {
				messageQueue = [];
			});
	}
}

/*
 For every 3 seconds check queue and send outstanding messages.
 */
self.addEventListener('sync', postMsgs);
