// ============================================================================
// config.example.js — пример конфигурации dakar-it-dashboard
// ============================================================================
// Этот файл — ШАБЛОН. Он коммитится в репозиторий и содержит только
// плейсхолдеры. Реальный файл `config.js` (с настоящими вебхуками) НИКОГДА
// не коммитится — он добавлен в .gitignore.
//
// ИСПОЛЬЗОВАНИЕ:
//   1. Скопируйте этот файл в `config.js`: `cp config.example.js config.js`
//   2. Откройте `config.js` в редакторе и подставьте реальные значения
//   3. Откройте `index.html` в браузере — дашборд подхватит config.js автоматически
//
// ДЛЯ ПУБЛИЧНОГО ДЕПЛОЯ (GitHub Pages):
//   - Файл `config.js` НЕ попадает в публичный репозиторий (он в .gitignore)
//   - Чтобы дашборд работал у конечных пользователей, у каждого должен быть
//     свой локальный `config.js` (для внутренней команды — через отдельный
//     приватный канал рассылки)
//   - Альтернатива: разворачивать дашборд на Vercel/Netlify с переменными
//     окружения и инжектить их через серверную функцию
// ============================================================================

window.DASHBOARD_CONFIG = {
    // ---- Вебхук Bitrix24 — Дакар (CRM) ----
    // Формат: https://<портал>.bitrix24.ru/rest/<user_id>/<webhook_secret>/
    BITRIX_DAKAR_WEBHOOK_URL: 'https://dakar.bitrix24.ru/rest/REPLACE_USER_ID/REPLACE_WEBHOOK_SECRET/',
    BITRIX_DAKAR_ENTITY_TYPE_ID: 129,
    BITRIX_DAKAR_TASK_URL_PREFIX: 'https://dakar.bitrix24.ru/crm/type/129/details/',

    // ---- Вебхук Bitrix24 — 1c-cms (Tasks + IM + Disk) ----
    // Используется для вкладок АтиЛаб и Внедрение (один и тот же вебхук)
    BITRIX_ATILAB_WEBHOOK_URL: 'https://1c-cms.bitrix24.ru/rest/REPLACE_USER_ID/REPLACE_WEBHOOK_SECRET/',
    BITRIX_ATILAB_TASK_URL: 'https://1c-cms.bitrix24.ru/company/personal/user/REPLACE_USER_ID/tasks/task/view/',

    // ---- Чат ВНЕДРЕНИЯ ----
    BITRIX_VNEDRENIE_CHAT_DIALOG_ID: 'chat7568'
};
