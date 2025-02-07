const secretMessages = [
	'William loves Elana',
	'Optimized sub-optimal code',
	'Marry me Chloe'
];
const messageChance = 1 / 1000;

export function getSecretMessage() {
	if(Math.random() < messageChance){
		return secretMessages[Math.floor(Math.random() * secretMessages.length)]
	}
}