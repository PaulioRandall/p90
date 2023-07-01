import { newScanner } from './scanner.js'

describe('newScanner(...).accept', () => {
	test('#1', () => {
		const sr = newScanner('abc')
		const act = sr.accept(/a/)

		expect(act).toEqual('a')
		expect(sr.index()).toEqual(1)
	})

	test('#2', () => {
		const sr = newScanner('abc')
		const act = sr.accept(/b/)

		expect(act).toEqual(null)
		expect(sr.index()).toEqual(0)
	})

	test('#3', () => {
		const sr = newScanner('')
		const act = sr.accept(/a/)

		expect(act).toEqual(null)
		expect(sr.index()).toEqual(0)
	})
})

describe('newScanner(...).expect', () => {
	test('#1', () => {
		const sr = newScanner('abc')
		const act = sr.expect(/a/)

		expect(act).toEqual('a')
		expect(sr.index()).toEqual(1)
	})

	test('#2', () => {
		const sr = newScanner('abc')
		const f = () => sr.expect(/b/)
		expect(f).toThrow(Error)
	})
})

describe('newScanner(...).seek', () => {
	test('#1', () => {
		const sr = newScanner('abc')
		const found = sr.seek(/b/)

		expect(found).toEqual(true)
		expect(sr.index()).toEqual(1)
	})

	test('#2', () => {
		const sr = newScanner('abc')
		const found = sr.seek(/d/)

		expect(found).toEqual(false)
		expect(sr.index()).toEqual(3)
	})
})

describe('newScanner(...).readWhile', () => {
	test('#1', () => {
		const sr = newScanner('abc')
		const s = sr.readWhile(/[a-z]/)

		expect(s).toEqual('abc')
		expect(sr.index()).toEqual(3)
	})

	test('#2', () => {
		const sr = newScanner('abc')
		const s = sr.readWhile(/[ab]/)

		expect(s).toEqual('ab')
		expect(sr.index()).toEqual(2)
	})

	test('#3', () => {
		const sr = newScanner('abc1abc')
		const s = sr.readWhile(/[a-z]/)

		expect(s).toEqual('abc')
		expect(sr.index()).toEqual(3)
	})

	test('#4', () => {
		const sr = newScanner('abc')
		const s = sr.readWhile(/[0-9]/)

		expect(s).toEqual('')
		expect(sr.index()).toEqual(0)
	})

	test('#5', () => {
		const sr = newScanner('abc123')
		sr.readWhile(/[a-z]/)
		const s = sr.readWhile(/[0-9]/)

		expect(s).toEqual('123')
		expect(sr.index()).toEqual(6)
	})
})

describe('newScanner(...).skipSpaces', () => {
	test('#1', () => {
		const sr = newScanner('')
		const s = sr.skipSpaces()
		expect(sr.index()).toEqual(0)
	})

	test('#2', () => {
		const sr = newScanner('   ')
		const s = sr.skipSpaces()
		expect(sr.index()).toEqual(3)
	})

	test('#3', () => {
		const sr = newScanner(' a ')
		const s = sr.skipSpaces()
		expect(sr.index()).toEqual(1)
	})

	test('#4', () => {
		const sr = newScanner('\t\f\v\r')
		const s = sr.skipSpaces()
		expect(sr.index()).toEqual(4)
	})
})
