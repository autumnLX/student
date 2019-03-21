/**
 * 易混淆的音素
 */
const symbols = new Map()

symbols.set('iː&ɪ', 1)
symbols.set('e&æ', 2)
symbols.set('ɜː&ə', 3)
symbols.set('ʌ&ɑː', 4)
symbols.set('ɒ&ɔː', 5)
symbols.set('ʊ&uː', 6)
symbols.set('ɑː&æ', 7)
symbols.set('e&eɪ', 8)
symbols.set('e&ʌ', 9)
symbols.set('e&aɪ', 10)
symbols.set('aʊ&ɔː', 11)
symbols.set('aʊ&ʌ', 12)
symbols.set('p&b', 13)
symbols.set('t&d', 14)
symbols.set('f&v', 15)
symbols.set('θ&e', 16)
symbols.set('s&z', 17)
symbols.set('θ&s', 18)
symbols.set('e&z', 19)
symbols.set('r&l', 20)
symbols.set('h&w', 21)
symbols.set('n&ŋ', 22)
symbols.set('ts&dz', 23)
symbols.set('tʃ&dʒ', 24)

export default symbols
