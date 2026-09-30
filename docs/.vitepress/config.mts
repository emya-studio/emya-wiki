import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'fa-IR',
  dir: 'rtl',
  title: 'ویکی امیا',
  description: 'مرجع مستندات فنی سخت‌افزار، قطعات الکترونیکی و مشخصات مدارات امیا',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css' }],
    ['meta', { name: 'theme-color', content: '#0284c7' }]
  ],
  locales: {
    root: {
      label: 'فارسی',
      lang: 'fa-IR',
      dir: 'rtl'
    }
  },
  themeConfig: {
    logo: {
      light: '/emya-wiki-logo-light.svg',
      dark: '/emya-wiki-logo-dark.svg'
    },
    siteTitle: false,
    nav: [
      { text: 'ویکی', link: '/', activeMatch: '^/' },
      { text: 'استودیو', link: 'https://emya.ir', target: '_blank', rel: 'noreferrer' },
      { text: 'فروشگاه', link: 'https://shop.emya.ir', target: '_blank', rel: 'noreferrer' }
    ],
    sidebar: [
      {
        text: '۱. محصولات امیا',
        collapsed: false,
        items: [
          { text: 'معرفی محصولات امیا', link: '/products/' },
          { text: 'دستگاه پایش هوشمند Emya Pro', link: '/products/emya-pro' },
          { text: 'نود سنسور بی‌سیم IoT', link: '/products/sensor-node' }
        ]
      },
      {
        text: '۲. بردهای توسعه',
        collapsed: false,
        items: [
          { text: 'بررسی بردهای توسعه', link: '/dev-boards/' },
          { text: 'برد توسعه Emya ESP32-S3 DevKit', link: '/dev-boards/esp32s3-devkit' },
          { text: 'برد پایه تست و آزمایشگاهی', link: '/dev-boards/baseboard' }
        ]
      },
      {
        text: '۳. ماژول‌های مبدل',
        collapsed: false,
        items: [
          { text: 'انواع ماژول‌های مبدل', link: '/converters/' },
          { text: 'مبدل USB به UART چندکاناله', link: '/converters/usb-to-uart' },
          { text: 'مبدل باک سنکرون DC-DC', link: '/converters/dcdc-buck' },
          { text: 'مبدل سطح ولتاژ منطقی (Level Shifter)', link: '/converters/level-shifter' }
        ]
      },
      {
        text: '۴. ماژول‌های MCU',
        collapsed: false,
        items: [
          { text: 'نمای کلی ماژول‌های MCU', link: '/mcu-modules/' },
          { text: 'ماژول پردازشی ESP32-S3', link: '/mcu-modules/esp32-s3' },
          { text: 'ماژول میکروکنترلر کم‌مصرف Cortex-M', link: '/mcu-modules/cortex-m' }
        ]
      },
      {
        text: '۵. راهنمای توسعه نرم‌افزاری',
        collapsed: false,
        items: [
          { text: 'شروع کار و ابزارهای لازم', link: '/software/' },
          { text: 'پیکربندی محیط توسعه و SDK', link: '/software/sdk-setup' },
          { text: 'راهنمای فلش فریم‌ور و دیباگ', link: '/software/flashing-guide' },
          { text: 'کتابخانه‌ها و درایورهای سخت‌افزاری', link: '/software/drivers' }
        ]
      }
    ],
    docFooter: {
      prev: 'صفحه قبلی',
      next: 'صفحه بعدی'
    },
    outline: {
      label: 'سرفصل‌های این صفحه'
    },
    lastUpdated: {
      text: 'آخرین به‌روزرسانی'
    },
    returnToTopLabel: 'بازگشت به بالا',
    sidebarMenuLabel: 'منوی بخش‌ها',
    darkModeSwitchLabel: 'تم ظاهری',
    lightModeSwitchTitle: 'تغییر به تم روشن',
    darkModeSwitchTitle: 'تغییر به تم تاریک',
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'جستجو در مستندات...',
                buttonAriaLabel: 'جستجو'
              },
              modal: {
                displayDetails: 'نمایش جزئیات',
                resetButtonTitle: 'پاک کردن جستجو',
                backButtonTitle: 'بستن جستجو',
                noResultsText: 'نتیجه‌ای یافت نشد برای',
                footer: {
                  selectText: 'انتخاب',
                  navigateText: 'پیمایش',
                  closeText: 'بستن'
                }
              }
            }
          }
        }
      }
    },
    editLink: {
      pattern: 'https://github.com/emya/emya-wiki/edit/main/docs/:path',
      text: 'ویرایش این صفحه در گیت‌هاب'
    },
    footer: {
      message: 'مستندات سخت‌افزاری و الکترونیکی امیا',
      copyright: 'تمامی حقوق محفوظ است © ۲۰۲۶ امیا'
    }
  }
})
