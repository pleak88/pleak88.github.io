---
target: ibarber-site-v2 index
total_score: 28
p0_count: 1
p1_count: 2
timestamp: 2026-07-13T11-39-38Z
slug: ibarber-site-v2-index-html
---
# Критика ibarber-site-v2 (index.html) — 2026-07-13

## Design Health Score: 28/40 (Good)

| # | Эвристика | Балл | Ключевая проблема |
|---|-----------|------|-------------------|
| 1 | Visibility of Status | 3 | Автокарусель без индикатора позиции |
| 2 | Match Real World | 2 | Donate/Choose непонятен; клик по платёжке молча копирует |
| 3 | User Control | 2 | Автоплей во время чтения; clamp:3 не даёт дочитать отзыв |
| 4 | Consistency | 4 | Единая glass-система |
| 5 | Error Prevention | 3 | Донат-меню на мобиле под доком (P0) |
| 6 | Recognition | 3 | Платёжки без видимых подписей |
| 7 | Flexibility | 3 | 3 языка+localStorage; нет ?lang= |
| 8 | Aesthetic/Minimalist | 4 | Сильнейшая сторона; пустой хвост хиро на 1440×900 |
| 9 | Error Recovery | 3 | Copy-fail toast со значением |
| 10 | Help & Docs | 1 | Нет часов, услуг, цен |

## Anti-Patterns: не AI-slop (7.5/10 авторности). Детектор: 0 находок. Технически чисто: контрасты 7.79:1, фокус-ринги, tap-таргеты ≥44px, 0 console errors, 0 overflow, заголовки без пропусков.

## Приоритетные проблемы
1. **[P0] Донат-меню на мобиле перекрыто fixed-доком** — открывать вверх (bottom: calc(100%+8px)) на ≤820px.
2. **[P1] Нет часов работы и цен** — строка в хиро/футере + openingHoursSpecification в JSON-LD.
3. **[P1] Десктоп-финал без CTA записи** — Book Now в футер или topbar.
4. **[P2] Отзывы: clamp:3 без «дочитать» + автоплей во время чтения** — клик=раскрыть, стоп автоплея после взаимодействия, доты.
5. **[P2] Donate ведёт себя неожиданно** — подписи «Copy», Revolut настоящей ссылкой.

## Персоны
- Jordan: нет цен/часов; Booksy открывается на польском; USDT ломает доверие; «донат до стрижки?»
- Casey: док идеален; донат-меню под доком; полупрозрачный about-текст при быстром скролле; автокарусель теряет отзыв.

## Мелкое
- Класс-опечатка card-boby; support-item = <a href="#"> вместо <button>; имена в h3 (лучше cite); 0.66rem подпись в круге на 390; beforeunload мешает bfcache; три бренда (iBarber.pro / Barber Katia / Select Hair Studio).

## Вопросы
1. Почему Donate на первом экране, а часов работы нет нигде?
2. Кому продаёт страница — Barber Katia, iBarber.pro или Select Hair Studio?
3. Готовы ли платить параллаксом за читаемость при скролл-стопах?
