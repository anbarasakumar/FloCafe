export type PrinterCommandSet = 'escpos';
export type PrinterCutMode = 'full' | 'partial';

export interface SupportedPrinterProfile {
  id: string;
  make: string;
  model: string;
  aliases: string[];
  commandSet: PrinterCommandSet;
  defaultPaperWidth: '58mm' | '80mm';
  defaultPort: number;
  fontAColumns: number;
  fontBColumns: number;
  printWidthMm?: number;
  cutMode: PrinterCutMode;
  notes?: string;
}

export const SUPPORTED_PRINTER_PROFILES: SupportedPrinterProfile[] = [
  {
    id: 'xprinter-xp-v320m-v330m',
    make: 'Xprinter',
    model: 'XP-V320M / XP-V330M',
    aliases: ['xprinter xp-v320m', 'xprinter xp-v330m', 'xp-v320m', 'xp-v330m', 'v320m', 'v330m'],
    commandSet: 'escpos',
    defaultPaperWidth: '80mm',
    defaultPort: 9100,
    fontAColumns: 48,
    fontBColumns: 64,
    printWidthMm: 72,
    cutMode: 'partial',
    notes: '80mm ESC/POS receipt printer. Vendor specs list 72mm print width, 576 dots/line, Font A 42/48 columns, Font B 56/64 columns.',
  },
  {
    id: 'epson-tm-series',
    make: 'Epson',
    model: 'TM Series ESC/POS',
    aliases: ['epson tm', 'tm-t88', 'tm-t82', 'tm-t20', 'tm-m30'],
    commandSet: 'escpos',
    defaultPaperWidth: '80mm',
    defaultPort: 9100,
    fontAColumns: 48,
    fontBColumns: 64,
    cutMode: 'partial',
  },
  {
    id: 'generic-escpos-80',
    make: 'Generic',
    model: 'ESC/POS 80mm',
    aliases: ['generic 80mm', '80mm thermal', 'thermal 80'],
    commandSet: 'escpos',
    defaultPaperWidth: '80mm',
    defaultPort: 9100,
    fontAColumns: 48,
    fontBColumns: 64,
    cutMode: 'full',
  },
  {
    id: 'generic-escpos-58',
    make: 'Generic',
    model: 'ESC/POS 58mm',
    aliases: ['generic 58mm', '58mm thermal', 'thermal 58'],
    commandSet: 'escpos',
    defaultPaperWidth: '58mm',
    defaultPort: 9100,
    fontAColumns: 42,
    fontBColumns: 56,
    cutMode: 'full',
  },
  {
    id: 'rugtek-rp80',
    make: 'Rugtek',
    model: 'RP80 / RT80 Series',
    aliases: ['rugtek', 'rugtek rp80', 'rugtek rt80', 'rp-80', 'rp80', 'rt80', 'rt-80', 'rugtek thermal'],
    commandSet: 'escpos',
    defaultPaperWidth: '80mm',
    defaultPort: 9100,
    fontAColumns: 48,
    fontBColumns: 64,
    cutMode: 'full',
    notes: '80mm ESC/POS thermal printer by Rugtek. Standard ESC/POS command set, full cut.',
  },
  {
    id: 'rugtek-rp58',
    make: 'Rugtek',
    model: 'RP58 / RT58 Series',
    aliases: ['rugtek rp58', 'rugtek rt58', 'rp-58', 'rp58', 'rt58', 'rt-58'],
    commandSet: 'escpos',
    defaultPaperWidth: '58mm',
    defaultPort: 9100,
    fontAColumns: 42,
    fontBColumns: 56,
    cutMode: 'full',
    notes: '58mm ESC/POS thermal printer by Rugtek. Standard ESC/POS command set, full cut.',
  },
];

export function getSupportedPrinterProfiles(): SupportedPrinterProfile[] {
  return SUPPORTED_PRINTER_PROFILES;
}

export function matchSupportedPrinterProfile(...parts: Array<string | null | undefined>): SupportedPrinterProfile | null {
  const haystack = parts
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/[_]+/g, '-');

  if (!haystack) return null;

  for (const profile of SUPPORTED_PRINTER_PROFILES) {
    const tokens = [`${profile.make} ${profile.model}`, profile.model, ...profile.aliases].map((s) => s.toLowerCase());
    if (tokens.some((token) => haystack.includes(token))) return profile;
  }

  return null;
}

export function resolvePrinterProfile(printer: any): SupportedPrinterProfile {
  const explicit = printer?.profile_id || printer?.profileId;
  if (explicit) {
    const profile = SUPPORTED_PRINTER_PROFILES.find((p) => p.id === explicit);
    if (profile) return profile;
  }

  const matched = matchSupportedPrinterProfile(printer?.name, printer?.make, printer?.model);
  if (matched) return matched;

  const paperWidth = printer?.paper_width || printer?.paperWidth;
  return paperWidth === '58mm'
    ? SUPPORTED_PRINTER_PROFILES.find((p) => p.id === 'generic-escpos-58')!
    : SUPPORTED_PRINTER_PROFILES.find((p) => p.id === 'generic-escpos-80')!;
}
