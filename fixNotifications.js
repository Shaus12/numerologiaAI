import fs from 'fs';
import path from 'path';

// Parse translations file
const transPath = path.join(process.cwd(), 'src/utils/translations.ts');
let content = fs.readFileSync(transPath, 'utf8');

const additions = {
    English: {
        dailyReminderTitle: "Echoes: Numerology Map",
        monthlyForecastPushTitle: "Echoes: Monthly Forecast",
        monthlyForecastPushBody: "A new month has begun! Your Personal Month {{personalMonth}} energy is shifting. The Oracle has a specific insight for your {{branch}}. See it now.",
        subJourneyNotificationTitle: "Echoes: Numerology Map",
    },
    Spanish: {
        dailyReminderTitle: "Echoes: Mapa Numerológico",
        monthlyForecastPushTitle: "Echoes: Pronóstico Mensual",
        monthlyForecastPushBody: "¡Ha comenzado un nuevo mes! La energía de tu Mes Personal {{personalMonth}} está cambiando. El Oráculo tiene una visión específica para tu {{branch}}. Míralo ahora.",
        subJourneyNotificationTitle: "Echoes: Mapa Numerológico",
    },
    Portuguese: {
        dailyReminderTitle: "Echoes: Mapa Numerológico",
        monthlyForecastPushTitle: "Echoes: Previsão Mensal",
        monthlyForecastPushBody: "Um novo mês começou! A energia do seu Mês Pessoal {{personalMonth}} está mudando. O Oráculo tem uma visão específica para sua {{branch}}. Veja agora.",
        subJourneyNotificationTitle: "Echoes: Mapa Numerológico",
    },
    French: {
        dailyReminderTitle: "Echoes: Carte Numérologique",
        monthlyForecastPushTitle: "Echoes: Prévisions Mensuelles",
        monthlyForecastPushBody: "Un nouveau mois a commencé ! L'énergie de votre Mois Personnel {{personalMonth}} change. L'Oracle a un aperçu spécifique pour votre {{branch}}. Voyez-le maintenant.",
        subJourneyNotificationTitle: "Echoes: Carte Numérologique",
    },
    German: {
        dailyReminderTitle: "Echoes: Numerologie-Karte",
        monthlyForecastPushTitle: "Echoes: Monatliche Prognose",
        monthlyForecastPushBody: "Ein neuer Monat hat begonnen! Die Energie deines persönlichen Monats {{personalMonth}} verschiebt sich. Das Orakel hat einen spezifischen Einblick für deine {{branch}}. Sieh ihn dir jetzt an.",
        subJourneyNotificationTitle: "Echoes: Numerologie-Karte",
    },
    Russian: {
        dailyReminderTitle: "Echoes: Нумерологическая Карта",
        monthlyForecastPushTitle: "Echoes: Ежемесячный Прогноз",
        monthlyForecastPushBody: "Начался новый месяц! Энергия вашего Персонального Месяца {{personalMonth}} меняется. У Оракула есть особое послание для вашей {{branch}}. Посмотрите сейчас.",
        subJourneyNotificationTitle: "Echoes: Нумерологическая Карта",
    },
    Arabic: {
        dailyReminderTitle: "إيكوز: الخريطة العددية",
        monthlyForecastPushTitle: "إيكوز: التوقعات الشهرية",
        monthlyForecastPushBody: "لقد بدأ شهر جديد! طاقة شهرك الشخصي {{personalMonth}} تتغير. لدى الأوراكل رؤية خاصة لـ {{branch}} الخاص بك. شاهدها الآن.",
        subJourneyNotificationTitle: "إيكوز: الخريطة العددية",
    },
    Hebrew: {
        dailyReminderTitle: "הדים: מפה נומרולוגית",
        monthlyForecastPushTitle: "הדים: תחזית חודשית",
        monthlyForecastPushBody: "חודש חדש החל! האנרגיה של החודש האישי שלך {{personalMonth}} משתנה. לאורקל יש תובנה ספציפית לגבי ה-{{branch}} שלך. כנס/י לראות עכשיו.",
        subJourneyNotificationTitle: "הדים: מפה נומרולוגית",
    },
    Bulgarian: {
        dailyReminderTitle: "Echoes: Нумерологична Карта",
        monthlyForecastPushTitle: "Echoes: Месечна Прогноза",
        monthlyForecastPushBody: "Започна нов месец! Енергията на вашия Личен Месец {{personalMonth}} се променя. Оракулът има специфично прозрение за вашата {{branch}}. Вижте го сега.",
        subJourneyNotificationTitle: "Echoes: Нумерологична Карта",
    }
};

for (const lang of Object.keys(additions)) {
    const keys = additions[lang];
    
    // Check if keys already inserted
    if (!content.includes(`monthlyForecastPushTitle`)) {
        const regex = new RegExp(`(${lang}:\\s*{)([^}]*?)(\\s*enableNotificationsSettings)`);
        
        // Remove existing subJourneyNotificationTitle to replace it
        content = content.replace(new RegExp(`\\s*subJourneyNotificationTitle:\\s*"[^"]*",?\\n`, 'g'), '\n');

        let injected = '';
        for (const [k, v] of Object.entries(keys)) {
            injected += `        ${k}: "${v}",\n`;
        }
        
        content = content.replace(regex, `$1$2\n${injected}$3`);
    } else {
        // If they exist, replace them inline for this language
        for (const [k, v] of Object.entries(keys)) {
             const keyRegex = new RegExp(`(${lang}:\\s*{[\\s\\S]*?)${k}:\\s*"[^"]*",?([\\s\\S]*?})`);
             if (keyRegex.test(content)) {
                content = content.replace(keyRegex, `$1${k}: "${v}",$2`);
             } else {
                // Should at least inject it at the bottom if not found but others are present
                const insertRegex = new RegExp(`(${lang}:\\s*{[\\s\\S]*?)(\\s*enableNotificationsSettings)`);
                content = content.replace(insertRegex, `$1\n        ${k}: "${v}",$2`);
             }
        }
    }
}

fs.writeFileSync(transPath, content, 'utf8');
console.log("Done inserting notification keys.");
