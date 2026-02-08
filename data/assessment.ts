export type AssessmentSubject = "Английский" | "Математика" | "Русский язык";

export type AssessmentQuestion = {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
};

export const assessmentSubjects: AssessmentSubject[] = ["Английский", "Математика", "Русский язык"];

export const assessmentQuestions: Record<AssessmentSubject, AssessmentQuestion[]> = {
  Английский: [
    {
      id: "en-1",
      text: "Выберите правильный вариант: She ___ to school every day.",
      options: ["go", "goes", "is go", "going"],
      correctOptionIndex: 1,
      explanation: "После he/she/it в Present Simple используется окончание -s: goes."
    },
    {
      id: "en-2",
      text: "Какой вариант соответствует Past Simple для слова write?",
      options: ["writed", "written", "wrote", "writes"],
      correctOptionIndex: 2,
      explanation: "Неправильный глагол write в Past Simple: wrote."
    },
    {
      id: "en-3",
      text: "Выберите корректный перевод фразы «Я учу английский уже два года».",
      options: [
        "I learn English for two years.",
        "I have been learning English for two years.",
        "I am learning English two years.",
        "I learned English two years."
      ],
      correctOptionIndex: 1,
      explanation: "Для действия, которое началось в прошлом и продолжается, подходит Present Perfect Continuous."
    },
    {
      id: "en-4",
      text: "Выберите слово с наиболее близким значением к improve.",
      options: ["worsen", "develop", "forget", "delay"],
      correctOptionIndex: 1,
      explanation: "Improve означает «улучшать», близкое по смыслу слово develop в этом контексте."
    },
    {
      id: "en-5",
      text: "Какая фраза звучит наиболее естественно для делового письма?",
      options: [
        "Give me answer quickly.",
        "I am waiting your answer.",
        "Could you please share your feedback by Friday?",
        "You must send me response today."
      ],
      correctOptionIndex: 2,
      explanation: "В деловой коммуникации лучше использовать вежливую нейтральную формулировку."
    }
  ],
  Математика: [
    {
      id: "math-1",
      text: "Решите: 3x + 5 = 20.",
      options: ["x = 3", "x = 5", "x = 7", "x = 25"],
      correctOptionIndex: 1,
      explanation: "3x = 15, значит x = 5."
    },
    {
      id: "math-2",
      text: "Найдите значение выражения: (2^3) * (2^2).",
      options: ["2^5", "4^5", "2^6", "2^1"],
      correctOptionIndex: 0,
      explanation: "При умножении степеней с одинаковым основанием показатели складываются: 2^(3+2)."
    },
    {
      id: "math-3",
      text: "Какой из углов является прямым?",
      options: ["45°", "90°", "120°", "180°"],
      correctOptionIndex: 1,
      explanation: "Прямой угол равен 90°."
    },
    {
      id: "math-4",
      text: "Вероятность вытащить красный шар из мешка, где 3 красных и 7 синих:",
      options: ["3/10", "7/10", "1/3", "1/2"],
      correctOptionIndex: 0,
      explanation: "Благоприятных исходов 3 из 10 возможных."
    },
    {
      id: "math-5",
      text: "Если функция y = 2x + 1, то при x = 4 значение y равно:",
      options: ["7", "8", "9", "10"],
      correctOptionIndex: 2,
      explanation: "2*4 + 1 = 9."
    }
  ],
  "Русский язык": [
    {
      id: "ru-1",
      text: "Укажите слово с безударной проверяемой гласной в корне.",
      options: ["берёза", "гора", "заря", "вода"],
      correctOptionIndex: 3,
      explanation: "В слове «вода» безударную гласную можно проверить словом «воды»."
    },
    {
      id: "ru-2",
      text: "Выберите предложение с правильной пунктуацией.",
      options: [
        "Когда начался дождь мы зашли в дом.",
        "Когда начался дождь, мы зашли в дом.",
        "Когда начался дождь мы, зашли в дом.",
        "Когда, начался дождь мы зашли в дом."
      ],
      correctOptionIndex: 1,
      explanation: "Между придаточной и главной частью сложного предложения нужна запятая."
    },
    {
      id: "ru-3",
      text: "Укажите вариант, где все слова пишутся с НЕ слитно.",
      options: [
        "(не)высокий дом, (не)друг",
        "(не)готов, (не)должен",
        "(не)с кем поговорить, (не)правда",
        "(не)большой, но уютный"
      ],
      correctOptionIndex: 0,
      explanation: "«Невысокий» и «недруг» пишутся слитно."
    },
    {
      id: "ru-4",
      text: "Определите тип речи: «На столе стояла ваза с белыми лилиями».",
      options: ["Рассуждение", "Повествование", "Описание", "Диалог"],
      correctOptionIndex: 2,
      explanation: "Предложение передает признаки предмета, это описание."
    },
    {
      id: "ru-5",
      text: "Выберите слово с правильным ударением.",
      options: ["красИвее", "красивЕе", "красивеЕ", "красИвеЕ"],
      correctOptionIndex: 0,
      explanation: "Правильный вариант: красИвее."
    }
  ]
};
