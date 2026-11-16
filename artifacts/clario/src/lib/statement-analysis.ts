export type TransactionCategory =
  | 'housing'
  | 'food'
  | 'transport'
  | 'utilities'
  | 'payroll'
  | 'shopping'
  | 'business'
  | 'other';

export type StatementTransaction = {
  date: Date | null;
  description: string;
  amount: number;
  category: TransactionCategory;
};

export type ParsedStatement = {
  transactions: StatementTransaction[];
  notices: string[];
};

export type CategoryTotal = {
  category: TransactionCategory;
  amount: number;
};

export type StatementAnalysis = {
  transactions: StatementTransaction[];
  income: number;
  expenses: number;
  net: number;
  periodMonths: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySurplus: number;
  savingsRate: number | null;
  score: number | null;
  categories: CategoryTotal[];
  reasons: string[];
  notices: string[];
};

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_PDF_PAGES = 50;

const incomeTerms = [
  'salary', 'payroll', 'income', 'deposit', 'refund', 'credit', 'received',
  'راتب', 'دخل', 'ايداع', 'وارد', 'مبيعات', 'استرداد', 'مكافاه', 'تحويل وارد',
];
const expenseTerms = [
  'debit', 'withdraw', 'purchase', 'payment', 'bill', 'fee', 'debit card',
  'خصم', 'سحب', 'مدفوع', 'شراء', 'فاتوره', 'رسوم', 'صادر', 'حواله',
];
const excludedPdfLineTerms = [
  'opening balance',
  'closing balance',
  'الرصيد الافتتاحي',
  'الرصيد الختامي',
  'اجمالي',
  'total',
];

const headerAliases = {
  date: ['date', 'transaction date', 'posting date', 'التاريخ', 'تاريخ العملية'],
  description: [
    'description', 'details', 'narration', 'transaction details', 'merchant',
    'البيان', 'الوصف', 'تفاصيل العملية', 'تفاصيل', 'اسم التاجر',
  ],
  amount: ['amount', 'transaction amount', 'المبلغ', 'قيمة العملية', 'قيمة'],
  debit: ['debit', 'withdrawal', 'withdrawals', 'مدين', 'سحب', 'خصم'],
  credit: ['credit', 'deposit', 'deposits', 'دائن', 'ايداع', 'إيداع'],
  type: ['type', 'transaction type', 'نوع العملية', 'نوع'],
};

export const sampleTransactions: StatementTransaction[] = [
  transaction('راتب شهري', 4200, 'payroll', 27),
  transaction('إيجار السكن', -1050, 'housing', 24),
  transaction('سوبرماركت', -450, 'food', 19),
  transaction('بنزين', -320, 'transport', 16),
  transaction('اتصالات وإنترنت', -220, 'utilities', 12),
  transaction('مشتريات منزلية', -600, 'shopping', 6),
  transaction('مطعم', -320, 'food', 4),
  transaction('مصروفات متنوعة', -340, 'other', 2),
];

const sixMonthEmployeeTransactions: StatementTransaction[] = [
  { monthsAgo: 6, shopping: 500, other: 300 },
  { monthsAgo: 5, shopping: 650, other: 380 },
  { monthsAgo: 4, shopping: 400, other: 330 },
  { monthsAgo: 3, shopping: 800, other: 450 },
  { monthsAgo: 2, shopping: 550, other: 380 },
  { monthsAgo: 1, shopping: 900, other: 500 },
]
  .reverse()
  .flatMap(({ monthsAgo, shopping, other }) => [
    transactionInMonth('راتب شهري', 4200, 'payroll', monthsAgo, 27),
    transactionInMonth('مصروفات متنوعة', -other, 'other', monthsAgo, 24),
    transactionInMonth('مشتريات منزلية', -shopping, 'shopping', monthsAgo, 20),
    transactionInMonth('اتصالات وإنترنت', -220, 'utilities', monthsAgo, 16),
    transactionInMonth('بنزين', -320, 'transport', monthsAgo, 12),
    transactionInMonth('مطعم', -320, 'food', monthsAgo, 8),
    transactionInMonth('سوبرماركت', -450, 'food', monthsAgo, 5),
    transactionInMonth('إيجار السكن', -1050, 'housing', monthsAgo, 1),
  ]);

export const sampleStatements = [
  {
    title: 'موظف بدخل ثابت · ٦ أشهر',
    transactions: sixMonthEmployeeTransactions,
  },
  {
    title: 'مستقل بدخل متغير',
    transactions: [
      transaction('دفعة مشروع أول', 1800, 'payroll', 27),
      transaction('دفعة مشروع ثاني', 1350, 'payroll', 20),
      transaction('إيجار السكن', -850, 'housing', 24),
      transaction('اشتراك أدوات العمل', -310, 'business', 17),
      transaction('مشتريات البقالة', -380, 'food', 12),
      transaction('تنقلات', -240, 'transport', 9),
      transaction('اتصالات وإنترنت', -150, 'utilities', 4),
      transaction('مصروفات متنوعة', -100, 'other', 2),
    ],
  },
  {
    title: 'مشروع بمبيعات ومصاريف',
    transactions: [
      transaction('مبيعات المتجر', 4700, 'payroll', 27),
      transaction('مبيعات إلكترونية', 2550, 'payroll', 19),
      transaction('رواتب الفريق', -2100, 'payroll', 25),
      transaction('إيجار المحل', -900, 'housing', 23),
      transaction('شراء بضاعة', -1550, 'business', 16),
      transaction('خدمات توصيل', -320, 'transport', 12),
      transaction('خدمات واتصالات', -240, 'utilities', 8),
      transaction('تسويق', -400, 'business', 2),
    ],
  },
  {
    title: 'شهر مصاريفه عالية',
    transactions: [
      transaction('راتب شهري', 2600, 'payroll', 27),
      transaction('إيجار السكن', -900, 'housing', 24),
      transaction('مشتريات البقالة', -530, 'food', 18),
      transaction('تنقلات', -340, 'transport', 14),
      transaction('خدمات واتصالات', -200, 'utilities', 8),
      transaction('مشتريات منزلية', -610, 'shopping', 5),
      transaction('مصروفات متنوعة', -330, 'other', 2),
    ],
  },
  {
    title: 'موظف بدخل ثابت',
    transactions: sampleTransactions,
  },
];

function transaction(
  description: string,
  amount: number,
  category: TransactionCategory,
  daysAgo?: number,
): StatementTransaction {
  return {
    date: daysAgo === undefined ? null : sampleDate(daysAgo),
    description,
    amount,
    category,
  };
}

function transactionInMonth(
  description: string,
  amount: number,
  category: TransactionCategory,
  monthsAgo: number,
  dayOfMonth: number,
): StatementTransaction {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(1);
  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(dayOfMonth);
  return { date, description, amount, category };
}

function sampleDate(daysAgo: number) {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date;
}

export function analyzeTransactions(
  transactions: StatementTransaction[],
  notices: string[] = [],
): StatementAnalysis {
  const income = transactions.reduce(
    (total, item) => total + Math.max(item.amount, 0),
    0,
  );
  const expenses = transactions.reduce(
    (total, item) => total + Math.max(-item.amount, 0),
    0,
  );
  const net = income - expenses;
  const dates = transactions
    .map((item) => item.date?.getTime())
    .filter((value): value is number => Number.isFinite(value))
    .sort((a, b) => a - b);
  const periodMonths =
    dates.length >= 2
      ? Math.max(1, (dates[dates.length - 1] - dates[0]) / (30 * 24 * 60 * 60 * 1000))
      : 1;
  const monthlyIncome = income / periodMonths;
  const monthlyExpenses = expenses / periodMonths;
  const monthlySurplus = monthlyIncome - monthlyExpenses;
  const savingsRate = income > 0 ? net / income : null;
  const score =
    savingsRate === null
      ? null
      : Math.max(0, Math.min(100, Math.round(50 + savingsRate * 150)));

  const categoryMap = new Map<TransactionCategory, number>();
  for (const item of transactions) {
    if (item.amount >= 0) continue;
    categoryMap.set(
      item.category,
      (categoryMap.get(item.category) ?? 0) + Math.abs(item.amount),
    );
  }
  const categories = [...categoryMap.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const reasons: string[] = [];
  if (savingsRate === null) {
    reasons.push('ما لقينا دخلًا واضحًا في الكشف؛ راجع تصنيف الإيداعات والمدفوعات.');
  } else if (net >= 0) {
    reasons.push(
      `بقي لك ${new Intl.NumberFormat('ar-KW', { maximumFractionDigits: 0 }).format(Math.round(savingsRate * 100))}٪ من الدخل بعد المصاريف في فترة الكشف.`,
    );
  } else {
    reasons.push(
      'المصاريف تجاوزت الدخل في فترة الكشف.',
    );
  }

  if (categories[0]) {
    reasons.push(`أعلى فئة مصروفات هي ${categoryLabel(categories[0].category)}.`);
  }
  reasons.push(`اعتمدنا على ${transactions.length} حركة مالية من الكشف.`);

  return {
    transactions,
    income,
    expenses,
    net,
    periodMonths,
    monthlyIncome,
    monthlyExpenses,
    monthlySurplus,
    savingsRate,
    score,
    categories,
    reasons,
    notices,
  };
}

export async function parseStatementFile(file: File): Promise<ParsedStatement> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('حجم الملف أكبر من 10 ميغابايت. جرّب كشفًا أصغر.');
  }

  const extension = file.name.split('.').pop()?.toLowerCase();
  let parsed: ParsedStatement;

  if (extension === 'csv') {
    parsed = parseRows(parseCsv(await file.text()));
  } else if (extension === 'xlsx') {
    const { default: readXlsxFile } = await import('read-excel-file/browser');
    const sheets = await readXlsxFile(file);
    parsed = parseRows(sheets[0]?.data ?? []);
  } else if (extension === 'pdf') {
    parsed = await parsePdf(file);
  } else {
    throw new Error('نوع الملف غير مدعوم. استخدم PDF نصيًا أو Excel بصيغة .xlsx أو CSV.');
  }

  if (parsed.transactions.length < 2) {
    throw new Error(
      'ما قدرنا نتعرف على حركات كافية. جرّب كشفًا نصيًا أو صدّره إلى Excel أو CSV.',
    );
  }
  return parsed;
}

function parseRows(rows: unknown[][]): ParsedStatement {
  const header = findHeader(rows);
  if (!header) {
    throw new Error(
      'ما لقينا أعمدة التاريخ والوصف والمبلغ. رتّب الكشف بعناوين واضحة ثم جرّب مرة ثانية.',
    );
  }

  const transactions: StatementTransaction[] = [];
  let unsignedRows = 0;

  for (const row of rows.slice(header.rowIndex + 1)) {
    const description = cellText(row[header.descriptionIndex]).trim();
    const type = header.typeIndex >= 0 ? cellText(row[header.typeIndex]) : '';
    const date =
      header.dateIndex >= 0 ? parseDate(row[header.dateIndex]) : null;
    const debit =
      header.debitIndex >= 0 ? parseNumericAmount(row[header.debitIndex]) : null;
    const credit =
      header.creditIndex >= 0 ? parseNumericAmount(row[header.creditIndex]) : null;
    const rawAmount =
      header.amountIndex >= 0 ? row[header.amountIndex] : null;
    const amountText = cellText(rawAmount);

    if (!description && rawAmount == null && debit == null && credit == null) {
      continue;
    }
    if (isExcludedLine(description)) continue;

    let amount: number | null = null;
    if (debit !== null || credit !== null) {
      amount = Math.abs(credit ?? 0) - Math.abs(debit ?? 0);
    } else {
      const numericAmount = parseNumericAmount(rawAmount);
      if (numericAmount !== null) {
        const direction = `${description} ${type} ${amountText}`;
        if (numericAmount < 0) amount = numericAmount;
        else if (isIncome(direction)) amount = Math.abs(numericAmount);
        else {
          amount = -Math.abs(numericAmount);
          if (!isExpense(direction)) unsignedRows += 1;
        }
      }
    }

    if (amount === null || amount === 0) continue;
    transactions.push({
      date,
      description: description || 'عملية مالية',
      amount,
      category: classifyCategory(description),
    });
  }

  const notices: string[] = [];
  if (unsignedRows > 0) {
    notices.push(
      'بعض المبالغ ما كان لها تصنيف واضح؛ اعتبرناها مصروفات. راجعها قبل الاعتماد على النتيجة.',
    );
  }
  if (!transactions.some((item) => item.date)) {
    notices.push('ما قدرنا نقرأ التواريخ، لذلك اعتبرنا الفترة شهرًا واحدًا.');
  }
  return { transactions, notices };
}

function findHeader(rows: unknown[][]) {
  const maxRows = Math.min(rows.length, 20);
  for (let rowIndex = 0; rowIndex < maxRows; rowIndex += 1) {
    const headers = rows[rowIndex].map((cell) => normalizeText(cellText(cell)));
    const dateIndex = findHeaderIndex(headers, headerAliases.date);
    const descriptionIndex = findHeaderIndex(headers, headerAliases.description);
    const amountIndex = findHeaderIndex(headers, headerAliases.amount);
    const debitIndex = findHeaderIndex(headers, headerAliases.debit);
    const creditIndex = findHeaderIndex(headers, headerAliases.credit);
    const typeIndex = findHeaderIndex(headers, headerAliases.type);

    const hasAmountColumn =
      amountIndex >= 0 || debitIndex >= 0 || creditIndex >= 0;
    if (descriptionIndex >= 0 && hasAmountColumn) {
      return {
        rowIndex,
        dateIndex,
        descriptionIndex,
        amountIndex,
        debitIndex,
        creditIndex,
        typeIndex,
      };
    }
  }
  return null;
}

function findHeaderIndex(headers: string[], aliases: string[]) {
  return headers.findIndex((header) =>
    aliases.some((alias) => {
      const normalizedAlias = normalizeText(alias);
      return header === normalizedAlias || header.includes(normalizedAlias);
    }),
  );
}

function parseCsv(text: string): unknown[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const input = text.replace(/^\uFEFF/, '');
  const delimiter = detectCsvDelimiter(input);

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const next = input[index + 1];
    if (character === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === delimiter && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += character;
    }
  }
  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

function detectCsvDelimiter(text: string) {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
  const candidates = [',', ';', '\t', '،', '|'];
  const counts = new Map(candidates.map((candidate) => [candidate, 0]));
  let quoted = false;

  for (let index = 0; index < firstLine.length; index += 1) {
    const character = firstLine[index];
    if (character === '"' && firstLine[index + 1] === '"' && quoted) {
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (!quoted && counts.has(character)) {
      counts.set(character, (counts.get(character) ?? 0) + 1);
    }
  }

  return [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? ',';
}

async function parsePdf(file: File): Promise<ParsedStatement> {
  const [pdfjs, worker] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
  });
  try {
    const document = await loadingTask.promise;
    if (document.numPages > MAX_PDF_PAGES) {
      throw new Error('الكشف أطول من 50 صفحة. جرّب نسخة أقصر أو صدّره إلى Excel.');
    }

    const lines: string[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      let line = '';
      for (const item of content.items) {
        if (!('str' in item)) continue;
        line += `${item.str} `;
        if (item.hasEOL) {
          if (line.trim()) lines.push(line.trim());
          line = '';
        }
      }
      if (line.trim()) lines.push(line.trim());
    }

    const transactions = lines
      .map(parsePdfLine)
      .filter((item): item is StatementTransaction => item !== null);

    return {
      transactions,
      notices: [
        'قراءة PDF تعتمد على النص الظاهر في الملف؛ راجع المبالغ، خصوصًا إذا كان الكشف مصوّرًا.',
      ],
    };
  } finally {
    await loadingTask.destroy();
  }
}

function parsePdfLine(line: string): StatementTransaction | null {
  const normalizedLine = normalizeDigits(line);
  if (isExcludedLine(normalizedLine)) return null;

  const dateMatch = normalizedLine.match(
    /\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2})\b/,
  );
  if (!dateMatch) return null;

  const withoutDate = normalizedLine.replace(dateMatch[0], ' ');
  const tokens = [...withoutDate.matchAll(/[-+]?\(?\d[\d,٬]*(?:[.٫,]\d{1,3})?\)?/g)]
    .map((match) => match[0])
    .filter((token) => parseNumericAmount(token) !== null);
  if (!tokens.length) return null;

  const values = tokens.map((token) => parseNumericAmount(token) ?? 0);
  let amount: number;
  if (values.length >= 3) {
    const debit = Math.abs(values[values.length - 3]);
    const credit = Math.abs(values[values.length - 2]);
    if (debit > 0 && credit === 0) amount = -debit;
    else if (credit > 0 && debit === 0) amount = credit;
    else amount = values[values.length - 2];
  } else {
    amount = values.length >= 2 ? values[values.length - 2] : values[0];
  }

  const remainder = withoutDate.replace(
    /[-+]?\(?\d[\d,٬]*(?:[.٫,]\d{1,3})?\)?/g,
    ' ',
  );
  const description = remainder.replace(/\s+/g, ' ').trim() || 'عملية مالية';
  const directionText = `${description} ${normalizedLine}`;
  if (amount > 0 && isIncome(directionText)) amount = Math.abs(amount);
  else if (amount > 0 && isExpense(directionText)) amount = -Math.abs(amount);
  else if (amount > 0 && tokens.length < 3) amount = -Math.abs(amount);

  if (amount === 0) return null;
  return {
    date: parseDate(dateMatch[0]),
    description,
    amount,
    category: classifyCategory(description),
  };
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value;
  if (typeof value === 'number' && value > 20_000 && value < 80_000) {
    return new Date(Date.UTC(1899, 11, 30) + value * 24 * 60 * 60 * 1000);
  }
  const text = normalizeDigits(cellText(value)).trim();
  if (!text) return null;

  const yearFirst = text.match(/\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
  if (yearFirst) {
    return validDate(Number(yearFirst[1]), Number(yearFirst[2]), Number(yearFirst[3]));
  }
  const dayFirst = text.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})\b/);
  if (dayFirst) {
    let year = Number(dayFirst[3]);
    if (year < 100) year += year < 50 ? 2000 : 1900;
    return validDate(year, Number(dayFirst[2]), Number(dayFirst[1]));
  }
  const parsed = new Date(text);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function validDate(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

function parseNumericAmount(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (value instanceof Date || value == null) return null;

  const original = normalizeDigits(String(value)).trim();
  if (!original) return null;
  const isParenthesizedNegative = /^\(.*\)$/.test(original);
  let cleaned = original
    .replace(/[٬]/g, ',')
    .replace(/[٫]/g, '.')
    .replace(/[^\d,.\-+]/g, '');
  if (!cleaned || !/\d/.test(cleaned)) return null;

  if (cleaned.includes(',') && !cleaned.includes('.')) {
    const commaTail = cleaned.match(/,(\d+)$/)?.[1];
    cleaned =
      commaTail && commaTail.length <= 2
        ? cleaned.replace(',', '.')
        : cleaned.replace(/,/g, '');
  } else {
    cleaned = cleaned.replace(/,/g, '');
  }

  const number = Number(cleaned);
  if (!Number.isFinite(number)) return null;
  return isParenthesizedNegative ? -Math.abs(number) : number;
}

function normalizeDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));
}

function normalizeText(value: string) {
  return normalizeDigits(value)
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function cellText(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value == null ? '' : String(value);
}

function isIncome(value: string) {
  const normalized = normalizeText(value);
  return incomeTerms.some((term) => normalized.includes(normalizeText(term)));
}

function isExpense(value: string) {
  const normalized = normalizeText(value);
  return expenseTerms.some((term) => normalized.includes(normalizeText(term)));
}

function isExcludedLine(value: string) {
  const normalized = normalizeText(value);
  return excludedPdfLineTerms.some((term) =>
    normalized.includes(normalizeText(term)),
  );
}

function classifyCategory(description: string): TransactionCategory {
  const normalized = normalizeText(description);
  if (/rent|housing|lease|سكن|ايجار|عقار/.test(normalized)) return 'housing';
  if (/grocer|supermarket|restaurant|cafe|food|مطعم|قهوه|بقاله|سوبرماركت/.test(normalized)) {
    return 'food';
  }
  if (/fuel|gasoline|taxi|uber|careem|transport|بنزين|تاكسي|نقل|اوبر|كريم/.test(normalized)) {
    return 'transport';
  }
  if (/electric|water|internet|phone|utility|اتصالات|كهرباء|ماء|انترنت|جوال/.test(normalized)) {
    return 'utilities';
  }
  if (/salary|payroll|wage|راتب|رواتب|اجور/.test(normalized)) return 'payroll';
  if (/shop|retail|mall|shopping|شراء|تسوق|متجر/.test(normalized)) return 'shopping';
  if (/business|office|software|supplier|عمل|مكتب|برنامج|مورد/.test(normalized)) {
    return 'business';
  }
  return 'other';
}

export function categoryLabel(category: TransactionCategory) {
  const labels: Record<TransactionCategory, string> = {
    housing: 'السكن',
    food: 'الطعام',
    transport: 'النقل',
    utilities: 'الفواتير والاتصالات',
    payroll: 'الرواتب',
    shopping: 'التسوق',
    business: 'العمل',
    other: 'أخرى',
  };
  return labels[category];
}

