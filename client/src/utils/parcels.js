export const zoningSimToColor = {
  // Commercial (Blue Gradient)
  'C-2': '#0000FF',
  'C-3-G': '#0000E5',
  'C-3-O': '#0000CC',
  'C-3-O(SD)': '#0000B8',
  'C-3-R': '#0000A4',
  'C-3-S': '#000090',
  'CCB': '#00007C',
  'CMUO': '#000068',
  'CRNC': '#000054',
  'CVR': '#000040',

  // Industrial (Green Gradient)
  'M-1': '#008000',
  'M-2': '#007000',
  'MB-O': '#006000',
  'MB-RA': '#005000',
  'MR-MU': '#004000',
  'MUG': '#003000',
  'MUO': '#002000',
  'MUR': '#001000',

  // Residential (Red Gradient)
  'RH DTR': '#FF0000',
  'RH-1': '#E60000',
  'RH-1(D)': '#CC0000',
  'RH-1(S)': '#B30000',
  'RH-2': '#990000',
  'RH-3': '#800000',
  'RM-1': '#660000',
  'RM-2': '#4D0000',
  'RM-3': '#330000',
  'RM-4': '#1A0000',

  // Planning (Yellow Gradient)
  'P': '#FFFF00',
  'P70-MU': '#E5E500',
  'PDR-1-B': '#CCCC00',
  'PDR-1-D': '#B2B200',
  'PDR-1-G': '#999900',
  'PDR-2': '#7F7F00',
  'PM-CF': '#FF8C00',
  'PM-MU1': '#FFA500',
  'PM-MU2': '#FFD700',
  'PM-OS': '#FFC0CB',
  'PM-R': '#FFB6C1',
  'PM-S': '#FF69B4',

  // Neighborhood (Purple Gradient)
  'NC-1': '#800080',
  'NC-2': '#700070',
  'NC-3': '#600060',
  'NC-S': '#500050',
  'NCD': '#400040',
  'NCT': '#300030',
  'NCT-1': '#200020',
  'NCT-2': '#100010',
  'NCT-3': '#000000',

  // Special Districts and Public Spaces (Cyan to Dark Blue Gradient)
  'HP-RA': '#00CED1',
  'Job Corps': '#4682B4',
  'PPS-MU': '#40E0D0',
  'RC-3': '#5F9EA0',
  'RC-4': '#6495ED',
  'RCD': '#7FFFD4',
  'RED': '#00BFFF',
  'RED-MX': '#1E90FF',

  // Transitional and Other (Greys and Earth Tones)
  'RTO': '#808080',
  'RTO-M': '#A9A9A9',
  'SALI': '#C0C0C0',
  'SB-DTR': '#D3D3D3',
  'SPD': '#778899',
  'TB DTR': '#708090',
  'TI-MU': '#2F4F4F',
  'TI-OS': '#696969',
  'TI-PCI': '#8B4513',
  'TI-R': '#A0522D',

  // Unique Mixed-Use (Vibrant and Miscellaneous Colors)
  'UMU': '#FF4500',
  'WMUG': '#DA70D6',
  'WMUO': '#EE82EE',
  'YBI-MU': '#DDA0DD',
  'YBI-OS': '#BA55D3',
  'YBI-PCI': '#9400D3',
  'YBI-R': '#9932CC',
};

export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  let color = (hash & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
  return "#" + "00000".substring(0, 6 - color.length) + color;
};
