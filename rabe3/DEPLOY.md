# نشر صفحة ربيع القلوب

صفحة العرض موجودة في: `docs/rabe3/index.html`

## GitHub Pages

### الطريقة 1: من إعدادات المستودع
1. ارفع الملفات إلى GitHub (`docs/rabe3/` بالكامل مع مجلد `assets/`).
2. اذهب إلى **Settings → Pages**.
3. اختر **Source: Deploy from a branch**.
4. اختر الفرع `main` والمجلد `/docs`.
5. احفظ — بعد دقائق ستكون الصفحة على:
   ```
   https://<username>.github.io/<repo>/rabe3/
   ```

### الطريقة 2: فرع gh-pages فقط للصفحة
```bash
git subtree push --prefix docs origin gh-pages
```
ثم في Pages اختر فرع `gh-pages` والجذر `/`.

---

## Google Sites

### الطريقة الموصى بها: Embed (تضمين)
1. انشر الصفحة أولاً على GitHub Pages (أعلاه).
2. افتح [Google Sites](https://sites.google.com).
3. أنشئ موقعاً جديداً باسم **ربيع القلوب**.
4. من **إدراج (Insert) → تضمين (Embed) → عنوان URL**.
5. الصق رابط GitHub Pages:
   ```
   https://<username>.github.io/<repo>/rabe3/
   ```
6. اضبط الارتفاع على **Full page** أو 3000px+ لعرض الصفحة كاملة.
7. انشر الموقع.

### الطريقة البديلة: رفع يدوي
Google Sites لا يدعم رفع HTML مباشرة بشكل كامل، لكن يمكنك:
1. استضافة الصور على Google Drive (عامة) أو الإبقاء على GitHub.
2. نسخ أقسام النص من الصفحة ولصقها في Google Sites block by block.
3. للحصول على نفس التصميم بالكامل — **استخدم التضمين (Embed)**.

---

## تحديث الصفحة

عند إضافة ميزات جديدة للتطبيق:
1. أضف الصور إلى `docs/rabe3/assets/`.
2. حدّث `docs/rabe3/index.html` و `docs/rabe3/i18n.js`.
3. ادفع التغييرات — GitHub Pages يتحدث تلقائياً.

---

## الملفات

| ملف | الوصف |
|-----|--------|
| `index.html` | الصفحة الرئيسية |
| `styles.css` | التصميم |
| `i18n.js` | الترجمات (28 لغة) |
| `assets/` | صور التطبيق |

## اللغات المدعومة

العربية، English، Deutsch، Français، Español، Türkçe، فارسی، Русский، 中文، Bahasa Indonesia، Bahasa Melayu، Português، Italiano، Nederlands، Polski، Svenska، Українська، Tiếng Việt، ไทย، وغيرها (28 لغة).
