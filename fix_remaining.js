import fs from 'fs';

let content = fs.readFileSync('src/utils/translations.ts', 'utf8');

if (!content.includes('monthlyForecastPushTitle: "Echoes: Monthly Forecast"')) {
    content = content.replace(
        /enableNotificationsSettings:\s*"Please enable notifications in your phone settings to receive daily insights.",/,
        `dailyReminderTitle: "Echoes: Numerology Map",
        monthlyForecastPushTitle: "Echoes: Monthly Forecast",
        monthlyForecastPushBody: "A new month has begun! Your Personal Month {{personalMonth}} energy is shifting. The Oracle has a specific insight for your {{branch}}. See it now.",
        subJourneyNotificationTitle: "Echoes: Numerology Map",
        enableNotificationsSettings: "Please enable notifications in your phone settings to receive daily insights.",`
    );
}

if (!content.includes('monthlyForecastPushTitle: "Echoes: Pronóstico Mensual"')) {
    content = content.replace(
        /enableNotificationsSettings:\s*"Activa las notificaciones en tu teléfono para recibir insights diarios.",/,
        `dailyReminderTitle: "Echoes: Mapa Numerológico",
        monthlyForecastPushTitle: "Echoes: Pronóstico Mensual",
        monthlyForecastPushBody: "¡Ha comenzado un nuevo mes! La energía de tu Mes Personal {{personalMonth}} está cambiando. El Oráculo tiene una visión específica para tu {{branch}}. Míralo ahora.",
        subJourneyNotificationTitle: "Echoes: Mapa Numerológico",
        enableNotificationsSettings: "Activa las notificaciones en tu teléfono para recibir insights diarios.",`
    );
}

fs.writeFileSync('src/utils/translations.ts', content);
console.log('Fixed missing English and Spanish translations.');
