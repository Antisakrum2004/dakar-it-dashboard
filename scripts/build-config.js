// ============================================================================
// scripts/build-config.js — build-time инжекция конфига в dakar-it-dashboard
// ============================================================================
// Назначение:
//   Генерирует статичный файл config.js в корне проекта из env-переменных
//   Vercel. Запускается как buildCommand в vercel.json при каждом деплое.
//
// Архитектура:
//   - Vercel env vars (BITRIX_*) → этот скрипт → статичный config.js
//   - index.html грузит <script src="config.js"></script> — никаких изменений
//     в разметке не требуется
//   - Файл config.js добавлен в .gitignore — он никогда не попадает в репо,
//     а генерируется заново при каждой сборке Vercel
//
// Почему не serverless function (/api/config):
//   - Статика дешевле и быстрее: нет cold start, нет ограничений на число
//     вызовов, файл кэшируется CDN
//   - Безопасность эквивалентна: в обоих случаях секреты живут в env vars
//     Vercel, а не в коде или в сборке
//   - Проще отлаживать: достаточно открыть /config.js в браузере
//
// Trade-off:
//   - При ротации вебхуков нужен redeploy (Vercel → Redeploy), чтобы
//     config.js сгенерировался заново с новыми значениями. Это нормально —
//     ротация вебхуков событие редкое, и redeploy занимает ~30 секунд.
// ============================================================================

const fs = require('fs');
const path = require('path');

// Шаблон конфига: ключи должны совпадать с config.example.js и с тем, что
// ожидает index.html в window.DASHBOARD_CONFIG
const config = {
    // ---- Вебхук Bitrix24 — Дакар (CRM) ----
    BITRIX_DAKAR_WEBHOOK_URL: process.env.BITRIX_DAKAR_WEBHOOK_URL || '',
    BITRIX_DAKAR_ENTITY_TYPE_ID: parseInt(process.env.BITRIX_DAKAR_ENTITY_TYPE_ID || '129', 10),
    BITRIX_DAKAR_TASK_URL_PREFIX: process.env.BITRIX_DAKAR_TASK_URL_PREFIX || 'https://dakar.bitrix24.ru/crm/type/129/details/',

    // ---- Вебхук Bitrix24 — 1c-cms (Tasks + IM + Disk) ----
    // Используется для вкладок АтиЛаб и Внедрение (один и тот же вебхук)
    BITRIX_ATILAB_WEBHOOK_URL: process.env.BITRIX_ATILAB_WEBHOOK_URL || '',
    BITRIX_ATILAB_TASK_URL: process.env.BITRIX_ATILAB_TASK_URL || '',

    // ---- Чат ВНЕДРЕНИЯ ----
    BITRIX_VNEDRENIE_CHAT_DIALOG_ID: process.env.BITRIX_VNEDRENIE_CHAT_DIALOG_ID || 'chat7568'
};

// Проверка обязательных переменных — без них дашборд бесполезен.
// Завершаем сборку с ошибкой, чтобы не задеплоить нерабочую версию.
const required = ['BITRIX_DAKAR_WEBHOOK_URL', 'BITRIX_ATILAB_WEBHOOK_URL'];
const missing = required.filter(k => !config[k]);
if (missing.length > 0) {
    console.error('[build-config] FATAL: Missing required env vars:', missing.join(', '));
    console.error('[build-config] Set them in Vercel project settings → Environment Variables');
    process.exit(1);
}

// Защита от случайной пустоты в дополнительных полях
if (!config.BITRIX_ATILAB_TASK_URL) {
    console.warn('[build-config] WARN: BITRIX_ATILAB_TASK_URL is empty — task links on АтиЛаб/Внедрение tabs will be broken');
}

// Генерируем JS-код
const js = `// ============================================================================
// config.js — АВТОГЕНЕРИРОВАННЫЙ файл, НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ
// ============================================================================
// Сгенерирован scripts/build-config.js из env-переменных Vercel.
// Чтобы изменить значения — обновите env vars в настройках проекта Vercel
// и сделайте Redeploy.
//
// Этот файл НЕ коммитится в git (.gitignore) — он существует только в сборке.
// ============================================================================

window.DASHBOARD_CONFIG = ${JSON.stringify(config, null, 4)};
`;

// Записываем в корень проекта (там же, где index.html)
const outPath = path.join(__dirname, '..', 'config.js');
fs.writeFileSync(outPath, js, 'utf8');

// Логирование без раскрытия секретов — печатаем только префикс портала
const safeUrl = (u) => {
    if (!u) return '<empty>';
    const m = u.match(/^(https:\/\/[^/]+\/rest\/)/);
    return m ? m[1] + '***' : '<malformed>';
};

console.log('[build-config] Generated config.js successfully');
console.log('[build-config] Keys:', Object.keys(config).join(', '));
console.log('[build-config] BITRIX_DAKAR_WEBHOOK_URL  =', safeUrl(config.BITRIX_DAKAR_WEBHOOK_URL));
console.log('[build-config] BITRIX_ATILAB_WEBHOOK_URL =', safeUrl(config.BITRIX_ATILAB_WEBHOOK_URL));
console.log('[build-config] BITRIX_DAKAR_ENTITY_TYPE_ID =', config.BITRIX_DAKAR_ENTITY_TYPE_ID);
console.log('[build-config] BITRIX_VNEDRENIE_CHAT_DIALOG_ID =', config.BITRIX_VNEDRENIE_CHAT_DIALOG_ID);
