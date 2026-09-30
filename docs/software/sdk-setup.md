# پیکربندی محیط توسعه و SDK

راهنمای نصب و آماده‌سازی سیستم جهت کامپایل فریم‌ورهای امیا با ابزار رسمی ESP-IDF.

## ۱. پیش‌نیازهای نرم‌افزاری

قبل از شروع، مطمئن شوید نرم‌افزارهای زیر روی سیستم شما نصب هستند:
- **Git**: جهت دریافت سورس‌کد پروژه‌ها
- **Python 3.10 یا بالاتر**: همراه با ابزار `pip`
- **Visual Studio Code**: ویرایشگر پیشنهادی

---

## ۲. نصب افزونه ESP-IDF در VS Code

1. برنامه **VS Code** را باز کرده و به بخش Extensions (`Ctrl+Shift+X` یا `Cmd+Shift+X`) بروید.
2. عبارت **ESP-IDF Extension** (محصول رسمی Espressif) را جستجو و نصب کنید.
3. کلید `F1` را فشار دهید و دستور زیر را اجرا کنید:
   ```text
   ESP-IDF: Configure ESP-IDF Extension
   ```
4. گزینه **Express Setup** را انتخاب کرده و نسخه پیشنهادی **ESP-IDF v5.2 یا جدیدتر** را نصب نمایید.

---

## ۳. ایجاد یا کلون پروژه امیا

یک پروژه تستی نمونه بسازید یا مخزن رسمی امیا را دریافت کنید:

```bash
git clone https://github.com/emya/emya-firmware-template.git
cd emya-firmware-template
```

تنظیم تارگت چیپست روی ESP32-S3:

```bash
idf.py set-target esp32s3
```

کامپایل اولیه پروژه:

```bash
idf.py build
```
