# iakimlabs.com — руководство по сайту (техническая документация)

🇬🇧 [English version](SITE-GUIDE.en.md)

Сайт студии на **GitHub Pages + Jekyll + Bootstrap 5**. Сборка не нужна: GitHub сам собирает сайт при каждом push.

## Структура

```
_config.yml            настройки сайта (название, email, домен)
_data/
  studio.yml           тексты «о студии», услуги, принципы, имя основателя
  navigation.yml       пункты меню
  languages.yml        языки в меню перевода (Google Translate)
  statuses.yml         статусы приложений (On Google Play, Closed testing…)
_apps/                 ← одно приложение = один .md файл
  mousecrumbs.md
apps/
  index.html           каталог (фильтры + поиск)
  mousecrumbs/privacy.md   страница политики конфиденциальности
assets/
  apps/<slug>/         иконка и скриншоты приложения
  css/main.css         стили (цвета — переменные в начале файла)
  js/main.js           тема, перевод, фильтры, форма
index.html, testing.html, about.html, contact.html, privacy.md, 404.html
CNAME                  iakimlabs.com
```

## Как добавить приложение (3 шага)

1. **Скопируйте** `_apps/mousecrumbs.md` → `_apps/<slug>.md` (slug — латиницей, например `screenscan`).
   Заполните поля в шапке: `title`, `tagline`, `type: game|app`, `status`, `package`, `features`, `privacy` и т.д.
   Под шапкой — описание в Markdown.
2. **Положите картинки** в `assets/apps/<slug>/`: `icon.png` (512×512) и скриншоты, затем пропишите пути в `icon:` и `screenshots:`.
3. **Создайте страницу политики** `apps/<slug>/privacy.md`:
   ```yaml
   ---
   layout: privacy
   app: <slug>
   permalink: /apps/<slug>/privacy/
   ---
   ```
   - **Вариант A — свой текст:** напишите политику на Markdown под шапкой (так сделано у Mouse Crumbs).
   - **Вариант Б — по шаблону:** оставьте тело страницы пустым и заполните блок `privacy:` в файле приложения (`collects_personal_data`, `data`, `services`) — стандартный текст сгенерируется сам.
   - Необязательные поля в файле приложения: `support_email` (отдельный адрес для приложения) и `privacy.updated` (дата вступления политики в силу).

Приложение автоматически появится в каталоге, на главной (если `featured: true`), в футере и в sitemap.
Его страница: `https://iakimlabs.com/apps/<slug>/`, политика: `https://iakimlabs.com/apps/<slug>/privacy/` — эту ссылку указываете в Play Console.

**Статусы:** `live` (кнопка «Get it on Google Play»), `closed-testing` (кнопки «Become a tester» / «Tester link»), `in-development`, `coming-soon`.
Ссылки на Google Play строятся из `package` автоматически.

### Добавление iOS (или другой платформы)

Приложение без поля `platforms` считается только для Android. Чтобы добавить iOS, правьте только файл приложения:

```yaml
platforms: [Android, iOS]
android_status: live            # статус по платформе (если нет — берётся `status`)
ios_status: testflight          # live | testflight | in-development | coming-soon
ios_url: https://apps.apple.com/app/id0000000000        # когда ios_status: live
ios_testflight_url: https://testflight.apple.com/join/XXXX   # когда ios_status: testflight
min_ios: "16.0"
```

- Кнопки, бейджи статусов, значки платформ на карточке и фильтры **Android / iOS / In testing** в каталоге появляются сами (фильтры платформ видны, только когда есть iOS-приложение).
- Статус `testflight` = «TestFlight beta».
- **Официальные бейджи магазинов:** сейчас кнопки — простые текстовые заглушки. Скачайте фирменные бейджи Google и Apple, положите в `assets/img/badges/` и укажите пути в `badges.google_play` / `badges.app_store` в `_config.yml`. Соблюдайте правила использования бейджей.
- Когда iOS-приложение выйдет, добавьте в футер строку о товарном знаке Apple («App Store is a service mark of Apple Inc.»).

## Публикация на GitHub Pages

1. Создайте репозиторий **`iakimlabs.github.io`** в аккаунте `iakimlabs` и загрузите туда эти файлы.
2. *Settings → Pages*: Source = **Deploy from a branch**, ветка `main`, папка `/ (root)`.
3. *Settings → Pages → Custom domain*: `iakimlabs.com` (файл `CNAME` уже есть). После проверки DNS включите **Enforce HTTPS**.

### DNS у регистратора домена

| Тип | Имя | Значение |
|-----|-----|----------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | iakimlabs.github.io |

Рекомендуется также подтвердить домен в *GitHub → Settings → Pages → Verified domains* (TXT-запись), чтобы его нельзя было привязать к чужому репозиторию.

## Локальный просмотр (необязательно)

```bash
bundle install
bundle exec jekyll serve
# http://localhost:4000
```

## Перевод

Меню с иконкой 🌐 — перевод через Google Translate. Скрипт Google загружается **только** когда выбран язык, отличный от английского
(выбор хранится в cookie `googtrans`). Названия бренда и приложений помечены `notranslate`, чтобы не переводились.
Список языков — в `_data/languages.yml`.

## Перед запуском проверьте

- [ ] В файле приложения реальные `package`, `min_android`, `version`, `updated` (как в сборке)
- [ ] Политика соответствует тому, что реально делает приложение (реклама, аналитика, разрешения, сбор данных)
- [ ] Иконка (512×512) и скриншоты лежат в `assets/apps/<slug>/`
- [ ] В Play Console указан адрес политики: `https://iakimlabs.com/apps/<slug>/privacy/`
- [ ] После релиза: `status: live`
- [ ] Тексты в `_data/studio.yml` (о студии, услуги) актуальны
