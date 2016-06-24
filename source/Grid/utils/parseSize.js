export type SizeUnit = 'px' | '%'

export type ParsedSize = {
  value: number,
  unit: SizeUnit
}

const sizeRegex = /([0-9]+(?:\.[0-9]*)?)(px|%)?/

/**
 * Converts a size represented as a number or string into a ParsedSize, which
 * consists of a numeric value and a unit ('px' or '%'). If the size argument
 * is invalid, undefined is returned.
 *
 * @param size A number of pixels or a string containing a number and a unit
 * @param defaultUnit The default unit to return if the size is a bare number
 */
export default function parseSize (size: any, defaultUnit: SizeUnit = 'px'): ?ParsedSize {
  switch (typeof size) {
    case 'number':
      return { value: size, unit: defaultUnit }
    case 'string': {
      const match = sizeRegex.exec(size)
      if (match) {
        return { value: Number(match[1]), unit: match[2] || defaultUnit }
      }
    }
  }
}
