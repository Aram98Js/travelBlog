# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
# 🌍 Travel Platform

## 🇬🇧 English

### About the Project

Travel Platform is a modern full-stack web application designed for travelers who want to discover interesting places, explore experiences, and share travel content.

The platform allows users to view travel, food, and relaxation posts, interact with content through likes and comments, and explore detailed information about different destinations.

The project includes a user interface for travelers and an admin dashboard for managing content.

### Features

- 🌎 Travel, Food, and Relax categories
- 🔐 User authentication with JWT
- 👤 User profile system
- 🛠 Admin dashboard for content management
- 📝 Create, edit, and delete posts
- 🖼 Image upload functionality
- ❤️ Like system
- 👁 Views counter
- 💬 Comment system
- 🔍 Search and filtering
- 🌐 Multi-language support
- 📱 Responsive design

### Technologies

#### Frontend

- React
- TypeScript
- React Router
- SCSS
- Vite

#### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Cloudinary

### Project Structure

```
client/
 ├── src/
 ├── components/
 ├── pages/

server/
 ├── controllers/
 ├── models/
 ├── routes/
 └── middleware/
```

### Installation

Clone the repository:

```bash
git clone your-repository-link
```

Install dependencies:

Frontend:

```bash
cd client
npm install
```

Backend:

```bash
cd server
npm install
```

Create `.env` files and add required environment variables.

Run frontend:

```bash
npm run dev
```

Run backend:

```bash
npm start
```

---

# 🇷🇺 Русский

## О проекте

Travel Platform — это современное full-stack веб-приложение для путешественников, которое помогает открывать новые места, изучать интересные направления и делиться туристическим контентом.

Пользователи могут просматривать публикации о путешествиях, еде и отдыхе, ставить лайки, оставлять комментарии и получать подробную информацию о различных направлениях.

Проект включает пользовательскую часть и административную панель для управления контентом.

### Возможности

- 🌍 Категории Travel, Food и Relax
- 🔐 Авторизация пользователей через JWT
- 👤 Личный кабинет пользователя
- 🛠 Админ-панель управления
- 📝 Создание, изменение и удаление публикаций
- 🖼 Загрузка изображений
- ❤️ Система лайков
- 👁 Подсчет просмотров
- 💬 Система комментариев
- 🔍 Поиск и фильтрация
- 🌐 Поддержка нескольких языков
- 📱 Адаптивный дизайн

### Используемые технологии

Frontend:

- React
- TypeScript
- React Router
- SCSS
- Vite

Backend:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- Cloudinary

---

# 🇦🇲 Հայերեն

## Նախագծի մասին

Travel Platform-ը ժամանակակից full-stack վեբ հավելված է, որը նախատեսված է ճանապարհորդների համար։

Հարթակը հնարավորություն է տալիս օգտատերերին բացահայտել նոր վայրեր, ուսումնասիրել ճանապարհորդական ուղղություններ և կիսվել հետաքրքիր բովանդակությամբ։

Օգտատերերը կարող են դիտել ճանապարհորդության, սննդի և հանգստի բաժինների հրապարակումները, գնահատել դրանք, թողնել մեկնաբանություններ և ստանալ մանրամասն տեղեկատվություն տարբեր վայրերի մասին։

Նախագիծը ներառում է ինչպես օգտատերերի հատված, այնպես էլ ադմինիստրատիվ վահանակ՝ բովանդակությունը կառավարելու համար։

### Հնարավորություններ

- 🌍 Travel, Food և Relax բաժիններ
- 🔐 JWT-ով օգտատերերի գրանցում և մուտք
- 👤 Օգտատիրոջ անձնական էջ
- 🛠 Ադմին վահանակ
- 📝 Գրառումների ավելացում, փոփոխում և ջնջում
- 🖼 Նկարների վերբեռնում
- ❤️ Like համակարգ
- 👁 Դիտումների հաշվիչ
- 💬 Մեկնաբանությունների համակարգ
- 🔍 Որոնում և ֆիլտրացիա
- 🌐 Բազմալեզու աջակցություն
- 📱 Responsive դիզայն

### Օգտագործված տեխնոլոգիաներ

Frontend:

- React
- TypeScript
- React Router
- SCSS
- Vite

Backend:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- Cloudinary