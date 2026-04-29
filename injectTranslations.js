import * as fs from 'fs';
import * as path from 'path';

// Parse translations file
const transPath = path.join(__dirname, 'src/utils/translations.ts');
let content = fs.readFileSync(transPath, 'utf8');

const additions = {
    English: {
        tabForecast: 'Forecast',
        forecastTitle: 'Cosmic Forecast',
        forecastYearTitle: 'Personal Year',
        forecastMonthTitle: 'Personal Month',
        forecastYearPlaceholder: 'Your personal year insight will appear here. This defines the overarching theme of your year.',
        forecastMonthPlaceholder: 'Your personal month insight will appear here. This defines the energy you\'re working with right now.',
        forecastPaywallTitle: 'Unlock Your Forecast',
        forecastPaywallSubtitle: 'Start your free trial to discover your Personal Year and Month cosmic themes.'
    },
    Spanish: {
        tabForecast: 'Pronóstico',
        forecastTitle: 'Pronóstico Cósmico',
        forecastYearTitle: 'Año Personal',
        forecastMonthTitle: 'Mes Personal',
        forecastYearPlaceholder: 'Tu visión del año personal aparecerá aquí. Esto define el tema principal de tu año.',
        forecastMonthPlaceholder: 'Tu visión del mes personal aparecerá aquí. Esto define la energía con la que trabajas ahora.',
        forecastPaywallTitle: 'Desbloquea tu Pronóstico',
        forecastPaywallSubtitle: 'Inicia tu prueba gratis para descubrir los temas cósmicos de tu Año y Mes Personal.'
    },
    Portuguese: {
        tabForecast: 'Previsão',
        forecastTitle: 'Previsão Cósmica',
        forecastYearTitle: 'Ano Pessoal',
        forecastMonthTitle: 'Mês Pessoal',
        forecastYearPlaceholder: 'Sua visão do ano pessoal aparecerá aqui. Ela define o tema central do seu ano.',
        forecastMonthPlaceholder: 'Sua visão do mês pessoal aparecerá aqui. Ela define a energia atual em sua vida.',
        forecastPaywallTitle: 'Desbloqueie sua Previsão',
        forecastPaywallSubtitle: 'Comece seu teste grátis para descobrir os temas cósmicos do seu Ano e Mês Pessoal.'
    },
    French: {
        tabForecast: 'Prévisions',
        forecastTitle: 'Prévisions Cosmiques',
        forecastYearTitle: 'Année Personnelle',
        forecastMonthTitle: 'Mois Personnel',
        forecastYearPlaceholder: 'Les prévisions pour votre année personnelle apparaîtront ici. Elles définissent le thème central de l\'année.',
        forecastMonthPlaceholder: 'Les prévisions pour votre mois personnel apparaîtront ici. Elles définissent votre l\'énergie actuelle.',
        forecastPaywallTitle: 'Débloquez vos Prévisions',
        forecastPaywallSubtitle: 'Commencez l\'essai gratuit pour découvrir les thèmes cosmiques de votre Année et Mois Personnel.'
    },
    German: {
        tabForecast: 'Prognose',
        forecastTitle: 'Kosmische Prognose',
        forecastYearTitle: 'Persönliches Jahr',
        forecastMonthTitle: 'Persönlicher Monat',
        forecastYearPlaceholder: 'Der Einblick in dein persönliches Jahr erscheint hier. Es bestimmt dein Hauptthema des Jahres.',
        forecastMonthPlaceholder: 'Der Einblick in deinen persönlichen Monat erscheint hier. Es bestimmt deine aktuelle Energie.',
        forecastPaywallTitle: 'Prognose Freischalten',
        forecastPaywallSubtitle: 'Starte die kostenlose Testversion, um die kosmischen Themen deines persönlichen Jahres und Monats zu entdecken.'
    },
    Russian: {
        tabForecast: 'Прогноз',
        forecastTitle: 'Космический Прогноз',
        forecastYearTitle: 'Персональный Год',
        forecastMonthTitle: 'Персональный Месяц',
        forecastYearPlaceholder: 'Прогноз для вашего персонального года появится здесь. Это определит главную тему года.',
        forecastMonthPlaceholder: 'Прогноз для вашего персонального месяца появится здесь. Это определяет вашу текущую энергию.',
        forecastPaywallTitle: 'Разблокировать Прогноз',
        forecastPaywallSubtitle: 'Начните бесплатную пробную версию, чтобы узнать космические темы Персонального года и месяца.'
    },
    Arabic: {
        tabForecast: 'التوقعات',
        forecastTitle: 'التوقعات الكونية',
        forecastYearTitle: 'سنتك الشخصية',
        forecastMonthTitle: 'شهرك الشخصي',
        forecastYearPlaceholder: 'ستظهر رؤية سنتك الشخصية هنا. هذا يحدد الموضوع الرئيسي لسنتك.',
        forecastMonthPlaceholder: 'ستظهر رؤية شهرك الشخصي هنا. هذا يحدد الطاقة التي تعمل معها الآن.',
        forecastPaywallTitle: 'افتح التوقعات',
        forecastPaywallSubtitle: 'ابدأ فترتك التجريبية المجانية لاكتشاف المواضيع الكونية لسنتك وشهرك الشخصي.'
    },
    Hebrew: {
        tabForecast: 'תחזית',
        forecastTitle: 'תחזית קוסמית',
        forecastYearTitle: 'שנה אישית',
        forecastMonthTitle: 'חודש אישי',
        forecastYearPlaceholder: 'התחזית לשנה האישית שלך תופיע כאן. זה מגדיר את נושא העל של השנה שלך.',
        forecastMonthPlaceholder: 'התחזית לחודש האישי שלך תופיע כאן. זה מגדיר את האנרגיה הנוכחית שלך.',
        forecastPaywallTitle: 'גלה את התחזיות',
        forecastPaywallSubtitle: 'התחל את תקופת הניסיון בחינם כדי לגלות את הנושאים הקוסמיים של השנה והחודש האישיים שלך.'
    },
    Bulgarian: {
        tabForecast: 'Прогноза',
        forecastTitle: 'Космическа Прогноза',
        forecastYearTitle: 'Лична Година',
        forecastMonthTitle: 'Личен Месец',
        forecastYearPlaceholder: 'Прогнозата за вашата лична година ще се появи тук. Това определя главната тема на годината ви.',
        forecastMonthPlaceholder: 'Прогнозата за вашия личен месец ще се появи тук. Това определя текущата ви енергия.',
        forecastPaywallTitle: 'Отключи Прогнозата',
        forecastPaywallSubtitle: 'Започнете безплатен пробен период, за да откриете космическите теми на личната си година и месец.'
    }
};

for (const lang of Object.keys(additions)) {
    const keys = additions[lang];
    const regex = new RegExp(`(${lang}:\\s*{)([^}]*?)(\\s*//\\s*Onboarding - Language|$)`);
    
    let injected = '';
    for (const [k, v] of Object.entries(keys)) {
        injected += `        ${k}: "${v}",\n`;
    }
    
    content = content.replace(regex, `$1\n        // Forecast Tab\n${injected}\n$2$3`);
}

fs.writeFileSync(transPath, content, 'utf8');
console.log('Done injecting keys');
