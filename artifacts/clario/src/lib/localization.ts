export type ClarioLanguage = 'ar' | 'en';

const englishTranslations: Record<string, string> = {
  'كلاريو، بداية الصفحة': 'Clario home',
  'كلاريو': 'Clario',
  'التنقل الرئيسي': 'Main navigation',
  'حلّل كشفك': 'Analyze your statement',
  'كيف الفكرة': 'How it works',
  'هدفك الأول': 'Your first goal',
  'لوحة التحكم': 'Dashboard',
  'Switch to English': 'Switch to English',
  'التبديل إلى العربية': 'Switch to Arabic',
  'فلوسك بشكل أوضح': 'Your money, made clearer',
  'قراراتك المالية': 'Your financial decisions',
  'تصير ': 'become ',
  'أوضح وأسهل.': 'clearer and easier.',
  'كلاريو يساعدك تفهم وضعك المالي بكلام بسيط، وتعرف وش تعني أرقامك لقراراتك اليومية.':
    'Clario helps you understand your finances in plain language and see what the numbers mean for everyday decisions.',
  'ارفع كشفك وشوف النتيجة': 'Upload a statement and see your results',
  'عن كلاريو': 'About Clario',
  'كشفك ما يغادر جهازك': 'Your statement never leaves your device',
  ' — نحلّله داخل متصفحك فقط.': ' — it is analyzed only in your browser.',
  'معلومة مفهومة. قرارك يظل لك.': 'Clear information. The decision stays yours.',
  'تصوير توضيحي لطريقة كلاريو في تبسيط الأرقام':
    'An illustration of how Clario makes financial numbers easier to understand',
  'مثال توضيحي لملخص مالي': 'Sample financial summary',
  'مثال توضيحي': 'Illustrative example',
  'ملخص وضعك': 'Your financial snapshot',
  'نظرة بسيطة على الشهر': 'A simple monthly overview',
  'الدخل': 'Income',
  'المصاريف': 'Expenses',
  'باقي لك مبلغ بعد مصاريفك. تعرّف وين يروح قبل خطوتك الجاية.':
    'You have money left after expenses. See where it goes before your next step.',
  'بهدوء ووضوح': 'Calm and clear',
  'خطوة بخطوة': 'One step at a time',
  'على راحتك': 'At your own pace',
  'كمّل واكتشف': 'Keep exploring',
  'الفكرة ببساطة': 'The idea, simply',
  'من صورة متفرقة، لفهم يطمّنّك.': 'From scattered numbers to a clearer picture.',
  'كلاريو في بدايته يركز على تبسيط المعلومات المالية الأساسية. خطوة صغيرة، وصورة أوضح.':
    'Clario makes essential financial information easier to understand. One small step toward a clearer picture.',
  'نجمع لك الصورة': 'Bring the full picture together',
  'تشوف المعلومات المهمة في مكان واحد بدل ما تظل متفرقة في بالك.':
    'See the important details in one place instead of keeping them scattered in your mind.',
  'نشرحها بلغة قريبة': 'Explain it in plain language',
  'المعنى يجيك بكلام واضح، مو مصطلحات مالية تزيد الحيرة.':
    'Get clear explanations, not financial jargon that adds confusion.',
  'تقرر وأنت أهدى': 'Make decisions with confidence',
  'تفهم وضعك أكثر، وتختار بنفسك وش الخطوة المناسبة لك.':
    'Understand your situation and choose the next step that works for you.',
  'مصمم للمستقلين وأصحاب الأعمال والموظفين':
    'Made for freelancers, business owners, and employees',
  'عشان تفهم أرقامك وتختار خطوتك الجاية بوضوح.':
    'Understand your numbers and choose your next step with clarity.',
  'أدوات إضافية': 'More tools',
  'قرار التوظيف': 'Hiring decision',
  'جرّب أثر توظيف شخص على ميزانيتك.':
    'See how hiring someone could affect your budget.',
  'هدفك المالي الجاي': 'Your next financial goal',
  'اختر هدفًا وشوف وش تحتاج له.': 'Choose a goal and see what it takes.',
  'قارن بين أي شهرين': 'Compare any two months',
  'مقارنة المصاريف بين شهرين': 'Compare spending across two months',
  'مقارنة حسب الحركات المؤرخة': 'Comparison based on dated transactions',
  'قارن بين شهرين': 'Compare two months',
  'اختر أي شهرين متاحين في كشفك، حتى لو ما كانوا متتالين.':
    'Choose any two months in your statement, even if they are not consecutive.',
  'الشهر الأقدم': 'Earlier month',
  'الشهر الأحدث': 'Later month',
  'نحتاج شهرين مختلفين للمقارنة': 'We need two different months to compare',
  'ارفع كشفًا فيه معاملات مؤرخة من شهرين مختلفين لتظهر المقارنة.':
    'Upload a statement with dated transactions from two different months to see a comparison.',
  'تعذر تحويل العملة المختارة لعرض المقارنة.':
    'The selected currency could not be converted for this comparison.',
  'وين تغير صرفك؟': 'Where did your spending change?',
  'ما ظهر فرق واضح في فئات الصرف المتغيرة.':
    'There was no clear change in flexible spending categories.',
  'لا توجد إيداعات مسجلة': 'No deposits recorded',
  'الدخل والسكن مستبعدان من فروقات الفئات.':
    'Income and housing are excluded from category changes.',
  'المقارنة مبنية على الحركات الموجودة في كل شهر وقد يكون أحدهما جزئيًا.':
    'This comparison uses the transactions in each month; either month may be partial.',
  'شوف خطتك هالشهر': 'View your plan this month',
  'اذهب للأدوات الإضافية': 'Go to additional tools',
  'ثابت': 'Unchanged',
  'أكثر': 'more',
  'أقل': 'less',
  'وعدنا لك': 'Our promise',
  'نوضح لك الصورة. ما نقرر عنك.': 'We make things clearer. You decide.',
  'كلاريو أداة للفهم والوضوح، مو نصيحة استثمارية ولا بديل عن مختص.':
    'Clario helps you understand your finances. It is not investment advice or a substitute for a professional.',
  'نؤمن إن القرار الأفضل يبدأ لما تكون الصورة قدامك.':
    'We believe better decisions start with a clear picture.',
  'بداية أوضح لعلاقة أهدى مع فلوسك.':
    'A clearer start to a calmer relationship with money.',
  'كلاريو — خصوصيتك أولاً.': 'Clario — your privacy comes first.',
  'قائمة التنقل': 'Navigation',
  'كلاريو، العودة إلى الموقع': 'Clario, return to website',
  'العودة إلى الموقع': 'Return to website',
  'مساحتك المالية': 'Your financial space',
  'التنقل': 'Navigation',
  'قرارك يظل لك': 'The decision stays yours',
  'العودة للموقع': 'Back to website',
  'مساحتك، على راحتك': 'Your space, at your pace',
  'نظرة عامة': 'Overview',
  'الرئيسية': 'Home',
  'تحليل كشفك': 'Statement analysis',
  'تحليل': 'Analysis',
  'التوظيف': 'Hiring',
  'الهدف': 'Goal',
  'خلّنا نرتّب أرقامك': 'Let’s organize your finances',
  'افهم كشفك المالي بصورة أوضح.': 'Understand your statement more clearly.',
  'ابدأ التحليل': 'Start analysis',
  'أقدر أوظف شخص؟': 'Can I hire someone?',
  'فكّر في أثر التوظيف على ميزانيتك.':
    'See how hiring could affect your budget.',
  'جرّب المحاكاة': 'Try the simulation',
  'رتّب هدفًا ماليًا يناسبك.': 'Set a financial goal that works for you.',
  'ابدأ هدفك': 'Set your goal',
  'مساحة أوضح لقراراتك': 'A clearer space for your decisions',
  'هلا بك في كلاريو.': 'Welcome to Clario.',
  'وش ودك ترتّب اليوم؟': 'What would you like to work on today?',
  'ابدأ بترتيب أرقامك': 'Start organizing your finances',
  'اختر خطوتك': 'Choose your next step',
  'وش تحتاج اليوم؟': 'What do you need today?',
  'ثلاث أدوات، على قد حاجتك': 'Three tools, just what you need',
  'معلومة عن كلاريو': 'About Clario',
  'على راحتك.': 'At your own pace.',
  'كلاريو يوضح لك الصورة، والقرار يظل قرارك.':
    'Clario makes the picture clearer; the decision stays yours.',
  'الفواتير والاتصالات': 'Bills and utilities',
  'الرواتب': 'Payroll',
  'السكن': 'Housing',
  'الطعام': 'Food',
  'النقل': 'Transport',
  'التسوق': 'Shopping',
  'العمل': 'Business',
  'أخرى': 'Other',
  'سيارة': 'Car',
  'سفر': 'Travel',
  'توسّع': 'Business expansion',
  'الحفظ الآمن يحتاج تفعيل تسجيل الدخول المجهول من إعدادات Supabase.':
    'Secure saving requires Anonymous Sign-Ins to be enabled in Supabase settings.',
  'ما لقينا مشروع Supabase عند رابط الاتصال (404). تأكد أن رابط VITE_SUPABASE_URL من مشروع Clario نفسه.':
    'Could not find the Supabase project at this URL (404). Make sure VITE_SUPABASE_URL belongs to this Clario project.',
  'رابط المشروع وصل، لكن مفتاح VITE_SUPABASE_ANON_KEY لا يطابقه أو يحتاج مراجعة إعدادات المفتاح.':
    'The project URL responded, but VITE_SUPABASE_ANON_KEY does not match it or needs to be checked.',
  'وصلنا إلى Supabase لكن قراءة الهدف مرفوضة. راجع سياسات الوصول للجدول وإعدادات المفتاح.':
    'Supabase responded, but reading the goal was denied. Check the table access policies and key settings.',
  'جدول الأهداف ما تجهّز في Supabase للحين. نحتاج إعداد قاعدة البيانات قبل الحفظ.':
    'The goals table is not set up in Supabase yet. Configure the database before saving.',
  'ما لقينا جدول financial_goals في مشروع Supabase المتصل. تأكد أنك أنشأته في مشروع Clario نفسه.':
    'Could not find the financial_goals table in the connected Supabase project. Make sure it was created in this Clario project.',
  'ما قدرنا نوصل للحفظ الآن. جرّب مرة ثانية بعد قليل.':
    'Could not save right now. Please try again shortly.',
  'رابط Supabase غير صالح. انسخ Project URL كاملة من إعدادات مشروع Clario، وتأكد أنها تبدأ بـ https://.':
    'The Supabase URL is invalid. Copy the full Project URL from this Clario project and make sure it starts with https://.',
  'رابط مشروع Supabase غير موجود في أسرار Replit.':
    'The Supabase project URL is missing from Replit Secrets.',
  'مفتاح anon غير موجود في أسرار Replit.':
    'The anon key is missing from Replit Secrets.',
  'الحفظ الآمن مو جاهز للحين. حدّث الصفحة أو جرّب بعد قليل.':
    'Secure saving is not ready yet. Refresh the page or try again shortly.',
  'ننتظر تحديث أسعار الصرف لتحويل مبلغ هدفك.':
    'Waiting for updated exchange rates to convert your goal amount.',
  'اكتب مبلغاً أكبر من صفر.': 'Enter an amount greater than zero.',
  'انحفظ هدفك. تقدر تعدله متى ما بغيت.':
    'Your goal is saved. You can update it whenever you like.',
  'خطوة صغيرة وواضحة': 'One clear step',
  'وش هدفك المالي الجاي؟': 'What is your next financial goal?',
  'اختر هدفاً واحداً وحط المبلغ اللي تبيه. نحفظه لك عشان تكون البداية مرتبة.':
    'Choose one goal and enter the amount you need. We’ll save it so you have a clear place to start.',
  'الحفظ مرتبط بهذا المتصفح حالياً. إذا مسحت بيانات التصفح، ممكن تفقد الوصول لهدفك.':
    'Your goal is currently saved to this browser. Clearing browser data may remove access to it.',
  'هدفك الحالي:': 'Current goal:',
  'على المثال التوضيحي': 'Based on the sample',
  'على حسب كشفك': 'Based on your statement',
  'بهالمعدل توصل هدفك بعد': 'At this rate, you could reach your goal in',
  'شهر واحد': '1 month',
  'شهرين': '2 months',
  'شهور': 'months',
  'تقريباً.': 'approximately.',
  'إذا ادّخرت': 'If you save',
  'كل شهر.': 'each month.',
  'ادخار شهر واحد': 'One month of savings',
  'نسبة ادخار شهر واحد من الهدف': 'Share of the goal saved in one month',
  'من الهدف': 'of your goal',
  'ننتظر سعر الصرف عشان نحسب المدة بعملة هدفك.':
    'Waiting for exchange rates to estimate the time in your goal currency.',
  'هذا الكشف ما يبيّن فائضًا شهريًا موجبًا، فما نقدر نقدّر مدة الوصول لهدفك للحين.':
    'This statement does not show a positive monthly surplus, so we cannot estimate your goal timeline yet.',
  'تقدير المثال للتجربة فقط؛ ما يعكس وضعك الحقيقي.':
    'This sample estimate is for demonstration only and does not reflect your actual finances.',
  'تقدير على وتيرة هذا الكشف، مو على مبلغ محفوظ فعليًا.':
    'This estimate uses the statement’s pace, not money already saved.',
  'هدف واحد كبداية': 'One goal to start',
  'نوع الهدف': 'Goal type',
  'المبلغ المستهدف': 'Target amount',
  'مثال: ٥٬٠٠٠': 'Example: 5,000',
  'العملة': 'Currency',
  'لحظة، نجهّز الحفظ': 'Preparing to save…',
  'جاري الحفظ': 'Saving…',
  'حدّث هدفك': 'Update your goal',
  'احفظ هدفك': 'Save your goal',
  'القرار اللي يفرق': 'The decision that matters',
  'يعتمد قرار التوظيف على كشف حسابك، وفي حال استخدام المثال التجريبي فالحسبة مبنية عليه.':
    'The hiring estimate uses your bank statement. If you are using the sample, the estimate is based on that instead.',
  'تقدير مبسّط من هذا الكشف، ولا يشمل تكاليف التوظيف الإضافية أو التزامات ما ظهرت فيه.':
    'A simplified estimate based on this statement. It excludes additional hiring costs and obligations not shown here.',
  'الراتب الشهري المتوقع': 'Expected monthly salary',
  'مثال: ٦٠٠': 'Example: 600',
  'الفائض الشهري حسب الكشف': 'Monthly surplus from statement',
  'أدخل راتبًا لمعرفة أثره على الفائض.':
    'Enter a salary to see how it affects your surplus.',
  'على أرقام الكشف، يبقى تقريبًا': 'Based on the statement, about',
  'بعد الراتب كل شهر.': 'would remain after salary each month.',
  'الراتب يتجاوز الفائض الحالي بـ': 'The salary exceeds your current surplus by',
  'شهريًا.': 'per month.',
  'جرّبها الآن على المثال، أو ارفع كشفك لتحليل أرقامك.':
    'Try it with the sample or upload your statement for a personalized estimate.',
  'ما تكفي بيانات الدخل': 'Not enough income data',
  'مؤشر مطمئن في هذا الكشف': 'A reassuring score for this statement',
  'فيه مجال للتحسين': 'There is room to improve',
  'يحتاج انتباه': 'Needs attention',
  'ما قدرنا نحدد دخلًا واضحًا من هذا الكشف. راجع تصنيف الإيداعات ثم جرّب مرة ثانية.':
    'We could not identify clear income in this statement. Review deposit categories and try again.',
  'صورة أوضح من كشف واحد': 'A clearer picture from one statement',
  'خلّنا نرتّب أرقامك.': 'Let’s organize your finances.',
  'ارفع كشفًا واحدًا، وشوف ملخصًا مفهومًا ودرجة مبدئية مع أسبابها. تقدر تشوف المثال أولًا قبل ما تختار ملفك.':
    'Upload one statement to get a clear summary and an initial score with reasons. You can try a sample first.',
  'كشفك ما يغادر جهازك.': 'Your statement never leaves your device.',
  'نقرأه داخل المتصفح فقط؛ ما نرفعه لخادم ولا نحفظ الملف. النتيجة ما تبقى بعد إغلاق الصفحة.':
    'It is read only in your browser. We do not upload or save the file, and the results are cleared when you close the page.',
  'نقرأه داخل المتصفح فقط ولا نحفظ الملف.':
    'We read it only in your browser and do not save the file.',
  'رفع كشف حساب': 'Upload a bank statement',
  'اختر كشف حساب للتحليل': 'Choose a statement to analyze',
  'نقرأ الكشف على جهازك…': 'Reading your statement on this device…',
  'ارفع كشف حسابك': 'Upload your bank statement',
  'PDF نصّي، Excel (.xlsx)، أو CSV': 'Text PDF, Excel (.xlsx), or CSV',
  'لحظة واحدة': 'One moment',
  'اختر ملفًا': 'Choose a file',
  'أو اسحب الملف إلى هنا': 'or drag the file here',
  'ما تبي ترفع ملفك؟': 'Rather not upload a file?',
  'بدّل إلى كشف تجريبي مختلف': 'Switch to a different sample statement',
  'اضغط لعرض كشف تجريبي آخر': 'Show another sample statement',
  'جرّب بكشف تجريبي': 'Try a sample statement',
  'ثلاث خطوات عملية من واقع كشفك.':
    'Three practical steps based on your statement.',
  'حتى ١٠ ميغابايت': 'Up to 10 MB',
  'عملة المثال': 'Sample currency',
  'عملة الكشف': 'Statement currency',
  'عملة عرض المثال التجريبي': 'Sample display currency',
  'عملة المبالغ في الكشف': 'Currency used in statement',
  'تقدر ترجع للمثال متى ما بغيت.': 'You can return to a sample anytime.',
  'جرّب كشفًا تجريبيًا آخر': 'Try another sample statement',
  'نتيجة كشفك': 'Your statement results',
  'ملخصك المالي': 'Your financial summary',
  'تحليل محلي': 'Analyzed on this device',
  'لا تتوفر درجة كافية': 'Not enough data for a score',
  'درجة الصحة المالية': 'Financial health score',
  'درجة مبدئية': 'Initial score',
  'مبنية على نسبة المتبقي من الدخل في هذا الكشف فقط.':
    'Based only on the share of income left after expenses in this statement.',
  'ملخص الأرقام': 'Financial summary',
  'المتبقي': 'Remaining',
  'ليش طلعت هالدرجة؟': 'Why this score?',
  'أبرز المصاريف': 'Top expenses',
  'راجع الحركات المقروءة': 'Review detected transactions',
  'حركات من أصل': 'transactions total',
  'امسح النتيجة وارجع للمثال': 'Clear results and return to sample',
  'توزيع المصاريف والتوقع المالي': 'Spending breakdown and financial outlook',
  'آخر ٤ أسابيع من الكشف': 'Last 4 weeks in your statement',
  'متى تصرف أكثر؟': 'When do you spend the most?',
  '٪ من مصاريف الفترة كانت في': '% of this period’s expenses were in',
  'من مصاريف الفترة كانت في': 'of this period’s expenses were in',
  'تعذر تحويل المصاريف إلى العملة المختارة حاليًا.':
    'Expenses cannot be converted to the selected currency right now.',
  'ما ظهرت مصاريف مؤرخة في آخر أربعة أسابيع من الكشف.':
    'No dated expenses were found in the last four weeks of the statement.',
  'ما لقينا تواريخ كافية في الكشف لعرض الصرف حسب الأسابيع.':
    'There are not enough dates in the statement to show weekly spending.',
  'توقع تقديري': 'Estimated outlook',
  'التقدير': 'Projection',
  'لو استمريت بنفس الوتيرة': 'If you keep the same pace',
  'التوقع غير متاح بهذه العملة': 'Forecast unavailable in this currency',
  'عجز تراكمي محتمل خلال سنة': 'Possible cumulative deficit in one year',
  'فائض محتمل خلال سنة': 'Possible surplus in one year',
  'على متوسط': 'Based on an average',
  'عجز': 'deficit',
  'فائض': 'surplus',
  'شهري.': 'per month.',
  'ما توفرت أسعار تحويل كافية لعرض التوقع بهذه العملة.':
    'Not enough exchange-rate data to show this forecast in the selected currency.',
  'يفترض ثبات متوسط الفائض، ولا يتوقع تغير الدخل أو المصروفات.':
    'Assumes the average surplus stays the same and income and expenses do not change.',
  'تواريخ الكشف غير واضحة؛ التقدير يفترض أن الكشف يمثل شهرًا واحدًا.':
    'Statement dates are unclear, so the estimate assumes the statement represents one month.',
  'جاري تحديث أسعار الصرف': 'Updating exchange rates',
  'تعذر تحميل أسعار الصرف؛ جرّب تحديث الصفحة':
    'Could not load exchange rates. Try refreshing the page.',
  'عملة عرض التطبيق': 'Display currency',
  'عملة العرض': 'Display currency',
  'تتغير الأرقام داخل كلاريو': 'Amounts update throughout Clario',
  'اختيار عملة العرض': 'Choose display currency',
  'دينار كويتي': 'Kuwaiti dinar',
  'د.ك — دينار كويتي': 'KWD — Kuwaiti dinar',
  'ر.س — ريال سعودي': 'SAR — Saudi riyal',
  'د.إ — درهم إماراتي': 'AED — UAE dirham',
  'ر.ق — ريال قطري': 'QAR — Qatari riyal',
  'د.ب — دينار بحريني': 'BHD — Bahraini dinar',
  'ر.ع — ريال عُماني': 'OMR — Omani rial',
  'ريال سعودي': 'Saudi riyal',
  'درهم إماراتي': 'UAE dirham',
  'ريال قطري': 'Qatari riyal',
  'دينار بحريني': 'Bahraini dinar',
  'ريال عُماني': 'Omani rial',
  'حجم الملف أكبر من 10 ميغابايت. جرّب كشفًا أصغر.':
    'The file is larger than 10 MB. Try a smaller statement.',
  'نوع الملف غير مدعوم. استخدم PDF نصيًا أو Excel بصيغة .xlsx أو CSV.':
    'This file type is not supported. Use a text-based PDF, Excel (.xlsx), or CSV.',
  'ما قدرنا نتعرف على حركات كافية. جرّب كشفًا نصيًا أو صدّره إلى Excel أو CSV.':
    'We could not identify enough transactions. Try a text-based statement or export it to Excel or CSV.',
  'ما لقينا أعمدة التاريخ والوصف والمبلغ. رتّب الكشف بعناوين واضحة ثم جرّب مرة ثانية.':
    'Could not find date, description, and amount columns. Add clear column headers and try again.',
  'عملية مالية': 'Financial transaction',
  'بعض المبالغ ما كان لها تصنيف واضح؛ اعتبرناها مصروفات. راجعها قبل الاعتماد على النتيجة.':
    'Some amounts had no clear transaction type, so they were counted as expenses. Review them before relying on the result.',
  'ما قدرنا نقرأ التواريخ، لذلك اعتبرنا الفترة شهرًا واحدًا.':
    'Dates could not be read, so the statement period is treated as one month.',
  'الكشف أطول من 50 صفحة. جرّب نسخة أقصر أو صدّره إلى Excel.':
    'The statement is longer than 50 pages. Try a shorter copy or export it to Excel.',
  'قراءة PDF تعتمد على النص الظاهر في الملف؛ راجع المبالغ، خصوصًا إذا كان الكشف مصوّرًا.':
    'PDF reading depends on visible text. Review the amounts, especially if the statement is scanned.',
  'راتب شهري': 'Monthly salary',
  'إيجار السكن': 'Rent',
  'سوبرماركت': 'Supermarket',
  'بنزين': 'Fuel',
  'اتصالات وإنترنت': 'Phone and internet',
  'مشتريات منزلية': 'Household shopping',
  'مطعم': 'Restaurant',
  'مصروفات متنوعة': 'Miscellaneous expenses',
  'مستقل بدخل متغير': 'Freelancer with variable income',
  'دفعة مشروع أول': 'Project payment 1',
  'دفعة مشروع ثاني': 'Project payment 2',
  'اشتراك أدوات العمل': 'Work tools subscription',
  'مشتريات البقالة': 'Groceries',
  'تنقلات': 'Transportation',
  'مشروع بمبيعات ومصاريف': 'Small business with sales and expenses',
  'مبيعات المتجر': 'Store sales',
  'مبيعات إلكترونية': 'Online sales',
  'رواتب الفريق': 'Team salaries',
  'إيجار المحل': 'Shop rent',
  'شراء بضاعة': 'Inventory purchase',
  'خدمات توصيل': 'Delivery services',
  'خدمات واتصالات': 'Utilities and phone',
  'تسويق': 'Marketing',
  'شهر مصاريفه عالية': 'A high-expense month',
  'ما لقينا دخلًا واضحًا في الكشف؛ راجع تصنيف الإيداعات والمدفوعات.':
    'We could not identify clear income. Review how deposits and payments are categorized.',
  'المصاريف تجاوزت الدخل في فترة الكشف.':
    'Expenses exceeded income during this statement period.',
  'من الأرقام إلى خطوة عملية': 'From numbers to an actionable step',
  'خطتك هالشهر': 'Your plan this month',
  'خطوات مقترحة من دخل ومصاريف فترة الكشف.':
    'Suggested steps based on income and expenses during this statement period.',
  'مبنية على كشفك': 'Based on your statement',
  'راجع الاشتراك المتكرر': 'Review the recurring subscription',
  'توفير محتمل بالشهر': 'Potential monthly savings',
  'ما تكفي بيانات الكشف لاقتراح خطوات شهرية واضحة.':
    'There is not enough statement data to suggest clear monthly steps.',
  'هذي تقديرات مبنية على فترة الكشف، مو ضمان للتوفير. راجع كل بند قبل أي قرار.':
    'These estimates use the statement period and are not a savings guarantee. Review each item before making a decision.',
};

export function translateText(text: string, language: ClarioLanguage): string {
  if (language === 'ar') return text;
  return englishTranslations[text] ?? text;
}

export function formatLocaleNumber(
  value: number,
  language: ClarioLanguage,
  maximumFractionDigits = 0,
) {
  return new Intl.NumberFormat(language === 'ar' ? 'ar-KW' : 'en-KW', {
    maximumFractionDigits,
  }).format(value);
}

export function formatLocaleMoney(
  value: number,
  currency: string,
  language: ClarioLanguage,
) {
  const fractionDigits = new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
  }).resolvedOptions().maximumFractionDigits;
  return new Intl.NumberFormat(language === 'ar' ? 'ar-KW' : 'en-KW', {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

function westernizeDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/٪/g, '%');
}

export function translateAnalysisText(
  text: string,
  language: ClarioLanguage,
): string {
  if (language === 'ar') return text;

  const remainingMatch = text.match(
    /^بقي لك (.+?)٪ من الدخل بعد المصاريف في فترة الكشف\.$/,
  );
  if (remainingMatch) {
    return `${westernizeDigits(remainingMatch[1])}% of income remained after expenses during this statement period.`;
  }

  const categoryMatch = text.match(/^أعلى فئة مصروفات هي (.+)\.$/);
  if (categoryMatch) {
    return `Your top expense category is ${translateText(categoryMatch[1], language)}.`;
  }

  const transactionsMatch = text.match(/^اعتمدنا على (.+) حركة مالية من الكشف\.$/);
  if (transactionsMatch) {
    return `Based on ${westernizeDigits(transactionsMatch[1])} transactions in this statement.`;
  }

  return translateText(text, language);
}

export function localizeSampleName(text: string, language: ClarioLanguage) {
  return translateText(text, language);
}
