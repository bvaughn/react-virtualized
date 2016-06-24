import parseSize from './parseSize'

describe('parseSize', () => {
  it('should parse numbers as pixels by default', () => {
    expect(parseSize(100)).toEqual({
      value: 100,
      unit: 'px'
    })
  })

  it('should parse numbers as the given default unit', () => {
    expect(parseSize(100, '%')).toEqual({
      value: 100,
      unit: '%'
    })
  })

  it('should parse number strings as pixels by default', () => {
    expect(parseSize('1')).toEqual({
      value: 1,
      unit: 'px'
    })
  })

  it('should permit a trailing decimal point', () => {
    expect(parseSize('1.')).toEqual({
      value: 1,
      unit: 'px'
    })
  })

  it('should permit a fractional part', () => {
    expect(parseSize('1.25')).toEqual({
      value: 1.25,
      unit: 'px'
    })
  })

  it('should parse number strings as the given default unit', () => {
    expect(parseSize('1.25', '%')).toEqual({
      value: 1.25,
      unit: '%'
    })
  })

  it('should parse pixel strings (ignoring default unit)', () => {
    expect(parseSize('100px', '%')).toEqual({
      value: 100,
      unit: 'px'
    })
  })

  it('should parse fractional pixel strings (ignoring default unit)', () => {
    expect(parseSize('12.5px', '%')).toEqual({
      value: 12.5,
      unit: 'px'
    })
  })

  it('should parse percent strings (ignoring default unit)', () => {
    expect(parseSize('100%', 'px')).toEqual({
      value: 100,
      unit: '%'
    })
  })

  it('should parse fractional percent strings (ignoring default unit)', () => {
    expect(parseSize('12.5%', 'px')).toEqual({
      value: 12.5,
      unit: '%'
    })
  })
})
