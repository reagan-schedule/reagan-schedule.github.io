export function label(digit: string) {
	const A = 1;
	const B = 1 << 1;
	const C = 1 << 2;
	const D = 1 << 3;
	const E = 1 << 4;
	const F = 1 << 5;
	const G = 1 << 6;
	switch (digit) {
		case '0':
			return A | B | C | D | E | F;
		case '1':
			return B | C;
		case '2':
			return A | B | D | E | G;
		case '3':
			return A | B | C | D | G;
		case '4':
			return B | C | F | G;
		case '5':
			return A | C | D | F | G;
		case '6':
			return A | C | D | E | F | G;
		case '7':
			return A | B | C;
		case '8':
			return A | B | C | D | E | F | G;
		case '9':
			return A | B | C | D | F | G;
		case ':':
			return G << 1;
	}
	return 0;
}
