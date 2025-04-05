const secretMessages = ['William loves Elana', 'Optimized sub-optimal code'];
const messageChance = 1 / 1000;

let ready = true;

export function setSecretMessage(handler: { message?: string }) {
	if (ready && Math.random() < messageChance) {
		handler.message = secretMessages[Math.floor(Math.random() * secretMessages.length)];
		ready = false;
		setTimeout(() => {
			delete handler.message;
		}, 1_000);
		setTimeout(() => {
			ready = true;
		}, 10_000);
	}
}
