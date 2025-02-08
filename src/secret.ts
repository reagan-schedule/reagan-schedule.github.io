const secretMessages = [
	'William loves Elana',
	'Optimized sub-optimal code',
	'Marry me Chloe'
];
const messageChance = 1 / 1000;

export function setSecretMessage(handler: { ready: boolean, message?: string }) {
	if(handler.ready&&Math.random()<messageChance){
		handler.message = secretMessages[Math.floor(Math.random()*secretMessages.length)];
		handler.ready = false;
		setTimeout(() => {
			delete handler.message;
		}, 1000);
		setTimeout(() => {
			handler.ready = true;
		}, 10000);
	}
}