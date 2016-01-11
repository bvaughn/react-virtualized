/**
 * Generate random data for use in examples.
 */
export function generateRandomList () {
  const list = []

  for (var i = 0; i < 1000; i++) {
    list.push({
      color: BADGE_COLORS[i % BADGE_COLORS.length],
      index: i,
      name: NAMES[i % NAMES.length],
      random: loremIpsum[i % loremIpsum.length],
      size: ROW_HEIGHTS[Math.floor(Math.random() * ROW_HEIGHTS.length)]
    })
  }

  return list
}

const BADGE_COLORS = ['#f44336', '#3f51b5', '#4caf50', '#ff9800', '#2196f3', '#374046', '#cddc39', '#2196f3', '#9c27b0', '#ffc107', '#009688', '#673ab7', '#ffeb3b', '#cddc39', '#795548']
const NAMES = ['Peter Brimer', 'Tera Gaona', 'Kandy Liston', 'Lonna Wrede', 'Kristie Yard', 'Raul Host', 'Yukiko Binger', 'Velvet Natera', 'Donette Ponton', 'Loraine Grim', 'Shyla Mable', 'Marhta Sing', 'Alene Munden', 'Holley Pagel', 'Randell Tolman', 'Wilfred Juneau', 'Naida Madson', 'Marine Amison', 'Glinda Palazzo', 'Lupe Island', 'Cordelia Trotta', 'Samara Berrier', 'Era Stepp', 'Malka Spradlin', 'Edward Haner', 'Clemencia Feather', 'Loretta Rasnake', 'Dana Hasbrouck', 'Sanda Nery', 'Soo Reiling', 'Apolonia Volk', 'Liliana Cacho', 'Angel Couchman', 'Yvonne Adam', 'Jonas Curci', 'Tran Cesar', 'Buddy Panos', 'Rosita Ells', 'Rosalind Tavares', 'Renae Keehn', 'Deandrea Bester', 'Kelvin Lemmon', 'Guadalupe Mccullar', 'Zelma Mayers', 'Laurel Stcyr', 'Edyth Everette', 'Marylin Shevlin', 'Hsiu Blackwelder', 'Mark Ferguson', 'Winford Noggle', 'Shizuko Gilchrist', 'Roslyn Cress', 'Nilsa Lesniak', 'Agustin Grant', 'Earlie Jester', 'Libby Daigle', 'Shanna Maloy', 'Brendan Wilken', 'Windy Knittel', 'Alice Curren', 'Eden Lumsden', 'Klara Morfin', 'Sherryl Noack', 'Gala Munsey', 'Stephani Frew', 'Twana Anthony', 'Mauro Matlock', 'Claudie Meisner', 'Adrienne Petrarca', 'Pearlene Shurtleff', 'Rachelle Piro', 'Louis Cocco', 'Susann Mcsweeney', 'Mandi Kempker', 'Ola Moller', 'Leif Mcgahan', 'Tisha Wurster', 'Hector Pinkett', 'Benita Jemison', 'Kaley Findley', 'Jim Torkelson', 'Freda Okafor', 'Rafaela Markert', 'Stasia Carwile', 'Evia Kahler', 'Rocky Almon', 'Sonja Beals', 'Dee Fomby', 'Damon Eatman', 'Alma Grieve', 'Linsey Bollig', 'Stefan Cloninger', 'Giovanna Blind', 'Myrtis Remy', 'Marguerita Dostal', 'Junior Baranowski', 'Allene Seto', 'Margery Caves', 'Nelly Moudy', 'Felix Sailer']
const ROW_HEIGHTS = [50, 75, 100]

const loremIpsum = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Phasellus vulputate odio commodo tortor sodales, et vehicula ipsum viverra.',
  'Cras tincidunt nisi in urna molestie varius.',
  'Curabitur ac enim dictum arcu varius fermentum vel sodales dui.',
  'Ut tristique augue at congue molestie.',
  'Cras eget enim nec odio feugiat tristique eu quis ante.',
  'Phasellus eget enim vitae nunc luctus sodales a eu erat.',
  'Nulla bibendum quam id velit blandit dictum.',
  'Donec dignissim mi ac libero feugiat, vitae lacinia odio viverra.',
  'Praesent vel lectus venenatis, elementum mauris vitae, ullamcorper nulla.',
  'Quisque sollicitudin nulla nec tellus feugiat hendrerit.',
  'Vestibulum a eros accumsan, lacinia eros non, pretium diam.',
  'Donec ornare felis et dui hendrerit, eget bibendum nibh interdum.',
  'Donec nec diam vel tellus egestas lobortis.',
  'Sed ornare nisl sit amet dolor pellentesque, eu fermentum leo interdum.',
  'Sed eget mauris condimentum, molestie justo eu, feugiat felis.',
  'Sed luctus justo vitae nibh bibendum blandit.',
  'Nulla ac eros vestibulum, mollis ante eu, rutrum nulla.',
  'Sed cursus magna ut vehicula rutrum.'
]
