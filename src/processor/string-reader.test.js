import { newStringReader } from './string-reader.js'

describe('newStringReader(...).accept', () => {
	test('#1', () => {
		const sr = newStringReader('abc')
		const act = sr.accept(/a/)

		expect(act).toEqual('a')
		expect(sr.runeIndex()).toEqual(1)
	})

	test('#2', () => {
		const sr = newStringReader('abc')
		const act = sr.accept(/b/)

		expect(act).toEqual(null)
		expect(sr.runeIndex()).toEqual(0)
	})

	test('#3', () => {
		const sr = newStringReader('')
		const act = sr.accept(/a/)

		expect(act).toEqual(null)
		expect(sr.runeIndex()).toEqual(0)
	})
})

describe('newStringReader(...).expect', () => {
	test('#1', () => {
		const sr = newStringReader('abc')
		const act = sr.expect(/a/)

		expect(act).toEqual('a')
		expect(sr.runeIndex()).toEqual(1)
	})

	test('#2', () => {
		const sr = newStringReader('abc')
		const f = () => sr.expect(/b/)
		expect(f).toThrow(Error)
	})
})

describe('newStringReader(...).seek', () => {
	test('#1', () => {
		const sr = newStringReader('abc')
		const found = sr.seek(/b/)

		expect(found).toEqual(true)
		expect(sr.runeIndex()).toEqual(1)
	})

	test('#2', () => {
		const sr = newStringReader('abc')
		const found = sr.seek(/d/)

		expect(found).toEqual(false)
		expect(sr.runeIndex()).toEqual(3)
	})
})

describe('newStringReader(...).readWhile', () => {
	test('#1', () => {
		const sr = newStringReader('abc')
		const s = sr.readWhile(/[a-z]/)

		expect(s).toEqual('abc')
		expect(sr.runeIndex()).toEqual(3)
	})

	test('#2', () => {
		const sr = newStringReader('abc')
		const s = sr.readWhile(/[ab]/)

		expect(s).toEqual('ab')
		expect(sr.runeIndex()).toEqual(2)
	})

	test('#3', () => {
		const sr = newStringReader('abc1abc')
		const s = sr.readWhile(/[a-z]/)

		expect(s).toEqual('abc')
		expect(sr.runeIndex()).toEqual(3)
	})

	test('#4', () => {
		const sr = newStringReader('abc')
		const s = sr.readWhile(/[0-9]/)

		expect(s).toEqual('')
		expect(sr.runeIndex()).toEqual(0)
	})

	test('#5', () => {
		const sr = newStringReader('abc123')
		sr.readWhile(/[a-z]/)
		const s = sr.readWhile(/[0-9]/)

		expect(s).toEqual('123')
		expect(sr.runeIndex()).toEqual(6)
	})
})

describe('newStringReader(...).skipSpaces', () => {
	test('#1', () => {
		const sr = newStringReader('')
		const s = sr.skipSpaces()
		expect(sr.runeIndex()).toEqual(0)
	})

	test('#2', () => {
		const sr = newStringReader('   ')
		const s = sr.skipSpaces()
		expect(sr.runeIndex()).toEqual(3)
	})

	test('#3', () => {
		const sr = newStringReader(' a ')
		const s = sr.skipSpaces()
		expect(sr.runeIndex()).toEqual(1)
	})

	test('#4', () => {
		const sr = newStringReader('\t\f\v\r')
		const s = sr.skipSpaces()
		expect(sr.runeIndex()).toEqual(4)
	})
})
