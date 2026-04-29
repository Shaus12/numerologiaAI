import os
import re

trans_path = os.path.join(os.path.dirname(__file__), 'src/utils/translations.ts')

with open(trans_path, 'r', encoding='utf-8') as f:
    content = f.read()

additions = {
    'English': {
        'tabForecast': 'Forecast',
        'forecastTitle': 'Cosmic Forecast',
        'forecastYearTitle': 'Personal Year',
        'forecastMonthTitle': 'Personal Month',
        'forecastYearPlaceholder': 'Your personal year insight will appear here.',
        'forecastMonthPlaceholder': 'Your personal month insight will appear here.',
        'forecastPaywallTitle': 'Unlock Your Forecast',
        'forecastPaywallSubtitle': 'Start your free trial to discover your Personal Year and Month cosmic themes.'
    },
    'Spanish': {
        'tabForecast': 'Pronóstico',
        'forecastTitle': 'Pronóstico Cósmico',
        'forecastYearTitle': 'Año Personal',
        'forecastMonthTitle': 'Mes Personal',
        'forecastYearPlaceholder': 'Tu visión del año personal aparecerá aquí.',
        'forecastMonthPlaceholder': 'Tu visión del mes personal aparecerá aquí.',
        'forecastPaywallTitle': 'Desbloquea tu Pronóstico',
        'forecastPaywallSubtitle': 'Inicia tu prueba gratis para descubrir los temas cósmicos de tu Año y Mes Personal.'
    },
    'Portuguese': {
        'tabForecast': 'Previsão',
        'forecastTitle': 'Previsão Cósmica',
        'forecastYearTitle': 'Ano Pessoal',
        'forecastMonthTitle': 'Mês Pessoal',
        'forecastYearPlaceholder': 'Sua visão do ano pessoal aparecerá aqui.',
        'forecastMonthPlaceholder': 'Sua visão do mês pessoal aparecerá aqui.',
        'forecastPaywallTitle': 'Desbloqueie sua Previsão',
        'forecastPaywallSubtitle': 'Comece seu teste grátis para descobrir os temas cósmicos do seu Ano e Mês Pessoal.'
    },
    'French': {
        'tabForecast': 'Prévision',
        'forecastTitle': 'Prévisions Cosmiques',
        'forecastYearTitle': 'Année Personnelle',
        'forecastMonthTitle': 'Mois Personnel',
        'forecastYearPlaceholder': 'Les prévisions de votre année apparaîtront ici.',
        'forecastMonthPlaceholder': 'Les prévisions de votre mois apparaîtront ici.',
        'forecastPaywallTitle': 'Débloquez vos Prévisions',
        'forecastPaywallSubtitle': 'Commencez l\'essai gratuit pour découvrir les thèmes de votre Année et Mois Personnel.'
    },
    'German': {
        'tabForecast': 'Prognose',
        'forecastTitle': 'Kosmische Prognose',
        'forecastYearTitle': 'Persönliches Jahr',
        'forecastMonthTitle': 'Persönlicher Monat',
        'forecastYearPlaceholder': 'Ihre Einblicke für das persönliche Jahr werden hier angezeigt.',
        'forecastMonthPlaceholder': 'Ihre Einblicke für den persönlichen Monat werden hier angezeigt.',
        'forecastPaywallTitle': 'Prognose Freischalten',
        'forecastPaywallSubtitle': 'Starten Sie Ihre Testversion, um kosmische Themen zu entdecken.'
    },
    'Russian': {
        'tabForecast': 'Прогноз',
        'forecastTitle': 'Космический Прогноз',
        'forecastYearTitle': 'Персональный Год',
        'forecastMonthTitle': 'Персональный Месяц',
        'forecastYearPlaceholder': 'Ваш прогноз на год появится здесь.',
        'forecastMonthPlaceholder': 'Ваш прогноз на месяц появится здесь.',
        'forecastPaywallTitle': 'Разблокировать прогноз',
        'forecastPaywallSubtitle': 'Начните бесплатную пробную версию, чтобы узнать темы Персонального Года.'
    },
    'Arabic': {
        'tabForecast': 'التوقعات',
        'forecastTitle': 'التوقعات الكونية',
        'forecastYearTitle': 'სنة شخصية',
        'forecastMonthTitle': 'شهر شخصي',
        'forecastYearPlaceholder': 'ستظهر رؤية سنتك الشخصية هنا.',
        'forecastMonthPlaceholder': 'ستظهر رؤية شهرك الشخصي هنا.',
        'forecastPaywallTitle': 'افتح التوقعات',
        'forecastPaywallSubtitle:': 'ابدأ تجربتك المجانية لاكتشاف أسرار سنة وشهر ميلادك.'
    },
    'Hebrew': {
        'tabForecast': 'תחזית',
        'forecastTitle': 'תחזית קוסמית',
        'forecastYearTitle': 'שנה אישית',
        'forecastMonthTitle': 'חודש אישי',
        'forecastYearPlaceholder': 'התחזית לשנה האישית שלך תופיע כאן.',
        'forecastMonthPlaceholder': 'התחזית לחודש האישי שלך תופיע כאן.',
        'forecastPaywallTitle': 'פתח את התחזית',
        'forecastPaywallSubtitle': 'התחל את ניסיון החינם שלך כדי לגלות את האנרגיות הקוסמיות.'
    },
    'Bulgarian': {
        'tabForecast': 'Прогноза',
        'forecastTitle': 'Космическа Прогноза',
        'forecastYearTitle': 'Лична Година',
        'forecastMonthTitle': 'Личен Месец',
        'forecastYearPlaceholder': 'Прогнозата за вашата лична година ще се появи тук.',
        'forecastMonthPlaceholder': 'Прогнозата за вашия личен месец ще се появи тук.',
        'forecastPaywallTitle': 'Отключи Прогнозата',
        'forecastPaywallSubtitle': 'Започнете безплатен пробен период, за да откриете космическите теми.'
    }
}

for lang, keys_dict in additions.items():
    # Find the language block
    pattern = r'(' + lang + r':\s*\{)(.*?)(?=\s*//\s*Onboarding - Language|(?:\s*\}|$))'
    
    injected = "\n        // Forecast Tab\n"
    for k, v in keys_dict.items():
        valStr = v.replace("'", "\\'")
        injected += f"        {k}: '{valStr}',\n"
        
    def replacer(match):
        return match.group(1) + injected + match.group(2)
        
    content = re.sub(pattern, replacer, content, flags=re.DOTALL)

with open(trans_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done injecting keys")
