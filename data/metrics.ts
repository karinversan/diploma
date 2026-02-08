export type Metric = {
  id: string;
  value: string;
  label: string;
  description: string;
};

export const metrics: Metric[] = [
  {
    id: "students",
    value: "500+",
    label: "учеников",
    description: "активно учатся на платформе каждый месяц"
  },
  {
    id: "tutors",
    value: "120+",
    label: "преподавателей",
    description: "с подтвержденной квалификацией и опытом"
  },
  {
    id: "satisfaction",
    value: "95%",
    label: "довольны",
    description: "оценивают уроки на 4.8+ и продолжают обучение"
  },
  {
    id: "subjects",
    value: "25+",
    label: "направлений",
    description: "от школьной программы до подготовки к карьере"
  }
];
