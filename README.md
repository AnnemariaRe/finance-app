# finance-app

## Разработка

Для разрешения зависимостей понадобится Yarn. Установить его можно с помощью команды:

```bash
npm install --global yarn
```

Установить зависимости:

```bash
yarn install
```

Запустить приложение:

```bash
yarn start
```

Форматировать код:

```bash
yarn format
```

Запустить тесты:

```bash
yarn test
```

Перед коммитом рекомендуется запустить тесты и проверить форматирование:

```bash
yarn check-before-push
```

---------------------------------------
Чтобы исправить форматирование в IntelliJ Idea, нужно установить следующие конфиги:

- Languages & Frameworks > JavaScript > Prettier - Automatic Prettier configuration
- Languages & Frameworks > JavaScript > Code Quality Tools > ESLint - Automatic ESLint configuration
- Languages & Frameworks > Node.js > Package Management - yarn

---------------------------------------
