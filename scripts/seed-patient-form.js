const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const L = (en, ru, es, fr) => ({ en, ru, es, fr });

async function run() {
  // Блоки анкеты (минимум, но подробно и расширяемо)
  const sections = [
    {
      key: 'general',
      title: L('General Information','Общая информация','Información general','Informations générales'),
      questions: [
        { key:'gender',   label:L('Gender','Пол','Género','Sexe'), type:'SINGLE_CHOICE', required:true,
          options:['Female','Male','Non-binary','Prefer not to say'],
          optionsI18n:{
            'Female': L('Female','Женский','Femenino','Femme'),
            'Male': L('Male','Мужской','Masculino','Homme'),
            'Non-binary': L('Non-binary','Небинарный','No binario','Non binaire'),
            'Prefer not to say': L('Prefer not to say','Предпочитаю не указывать','Prefiero no decir','Préfère ne pas dire'),
          }
        },
        { key:'age',      label:L('Age','Возраст','Edad','Âge'), type:'NUMBER', required:true },
        { key:'height',   label:L('Height','Рост','Altura','Taille'), type:'NUMBER', required:true },
        { key:'weight',   label:L('Weight','Вес','Peso','Poids'), type:'NUMBER', required:true },
        { key:'marital',  label:L('Marital status','Семейное положение','Estado civil','État civil'), type:'SINGLE_CHOICE',
          options:['Single','Married','Partnered','Divorced','Widowed'],
          optionsI18n:{
            'Single': L('Single','Не в браке','Soltero/a','Célibataire'),
            'Married': L('Married','Женат/Замужем','Casado/a','Marié(e)'),
            'Partnered': L('Partnered','В партнёрстве','En pareja','En couple'),
            'Divorced': L('Divorced','Разведен(а)','Divorciado/a','Divorcé(e)'),
            'Widowed': L('Widowed','Вдовец/Вдова','Viudo/a','Veuf/Veuve'),
          }
        },
        { key:'timezone', label:L('Time zone','Часовой пояс','Zona horaria','Fuseau horaire'), type:'TEXT' },
      ],
    },
    {
      key: 'lifestyle',
      title: L('Lifestyle & Habits','Стиль жизни и привычки','Estilo de vida y hábitos','Mode de vie et habitudes'),
      questions: [
        { key:'sleep_hours', label:L('Hours of sleep (avg)','Часов сна (сред.)','Horas de sueño (prom)','Heures de sommeil (moy)'), type:'NUMBER' },
        { key:'stress_freq', label:L('Stress frequency','Частота стресса','Frecuencia de estrés','Fréquence du stress'),
          type:'SINGLE_CHOICE',
          options:['Rarely','Sometimes','Often','Constant'],
          optionsI18n:{
            'Rarely': L('Rarely','Редко','Raramente','Rarement'),
            'Sometimes': L('Sometimes','Иногда','A veces','Parfois'),
            'Often': L('Often','Часто','A menudo','Souvent'),
            'Constant': L('Constant','Постоянно','Constante','Constant'),
          }
        },
        { key:'activity', label:L('Regular physical activity? (type, frequency)','Регулярная физическая активность? (тип, частота)','¿Actividad física regular? (tipo, frecuencia)','Activité physique régulière ? (type, fréquence)'), type:'TEXTAREA' },
        { key:'nutrition', label:L('Eating pattern (e.g. vegetarian, IF)','Режим питания (напр. вегетарианство, ИГ)','Patrón alimentario (p.ej. vegetariano, AI)','Schéma alimentaire (p.ex. végétarien, Jeûne intermittent)'), type:'TEXT' },
        { key:'alcohol', label:L('Alcohol use (type, frequency)','Употребление алкоголя (тип, частота)','Alcohol (tipo, frecuencia)','Alcool (type, fréquence)'), type:'TEXT' },
        { key:'smoking', label:L('Smoking (years / per day)','Курение (лет / в день)','Tabaquismo (años / por día)','Tabagisme (années / par jour)'), type:'TEXT' },
        { key:'recreational', label:L('Recreational substances','Рекреационные вещества','Sustancias recreativas','Substances récréatives'), type:'TEXT' },
        { key:'screen_time', label:L('Screen time per day (hours)','Экранное время в день (ч)','Tiempo de pantalla por día (h)','Temps d\'écran par jour (h)'), type:'NUMBER' },
        { key:'hobbies', label:L('Hobbies that help you relax','Хобби для расслабления','Aficiones que ayudan a relajarse','Loisirs qui aident à se détendre'), type:'TEXT' },
      ],
    },
    {
      key:'meds',
      title:L('Medications & Supplements','Препараты и добавки','Medicamentos y suplementos','Médicaments et compléments'),
      questions:[
        { key:'rx', label:L('Prescription meds (name, dose, frequency)','Рецептурные препараты (название, дозировка, частота)','Medicamentos de receta (nombre, dosis, frecuencia)','Médicaments sur ordonnance (nom, dose, fréquence)'), type:'TEXTAREA' },
        { key:'supp', label:L('Supplements / vitamins (purpose)','БАДы/витамины (цель)','Suplementos / vitaminas (propósito)','Compléments / vitamines (objectif)'), type:'TEXTAREA' },
        { key:'allergy', label:L('Drug allergies','Аллергии на лекарства','Alergias a medicamentos','Allergies aux médicaments'), type:'TEXT' },
        { key:'adverse', label:L('Adverse reactions experienced','Побочные эффекты','Reacciones adversas','Effets indésirables'), type:'TEXTAREA' },
      ],
    },
  ];

  // Собираем i18n структуры для форм/секций/вопросов/вариантов
  const formI18n = {
    title: L('Patient Questionnaire','Анкета пациента','Cuestionario del paciente','Questionnaire du patient'),
  };

  // Upsert формы и всех вложенных сущностей
  const form = await prisma.form.upsert({
    where: { slug: 'patient-questionnaire' },
    update: { title: formI18n.title.en, category: 'General', i18n: formI18n },
    create: {
      slug: 'patient-questionnaire',
      title: formI18n.title.en,
      category: 'General',
      visibility: 'PUBLIC',
      anonymousAllowed: false,
      i18n: formI18n,
    }
  });

  // Секции: упорядочим по order
  for (let si = 0; si < sections.length; si++) {
    const s = sections[si];
    const sec = await prisma.formSection.upsert({
      where: { formId_order: { formId: form.id, order: si + 1 } },
      update: { title: s.title.en, i18n: { title: s.title } },
      create: { formId: form.id, title: s.title.en, order: si + 1, i18n: { title: s.title } },
    });
    // Вопросы
    for (let qi = 0; qi < s.questions.length; qi++) {
      const q = s.questions[qi];
      const base = {
        sectionId: sec.id,
        order: qi + 1,
        label: q.label.en,
        type: q.type,
        required: !!q.required,
        sensitivity: 'LOW',
        i18n: { label: q.label, options: q.optionsI18n || null },
      };
      if (q.options) base.options = q.options;
      await prisma.question.upsert({
        where: { sectionId_order: { sectionId: sec.id, order: qi + 1 } },
        update: base,
        create: base,
      });
    }
  }

  console.log('✅ Seeded: Patient Questionnaire with i18n (EN/RU/ES/FR)');
}

run().finally(() => prisma.$disconnect());
