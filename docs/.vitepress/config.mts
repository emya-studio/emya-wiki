import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'fa-IR',
  dir: 'rtl',
  title: 'ویکی امیا',
  description: 'مرجع مستندات فنی سخت‌افزار، قطعات الکترونیکی و مشخصات مدارات امیا',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  markdown: {
    math: true
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag === 'model-viewer'
      }
    }
  },
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
        text: '۱. ماژول‌های تغذیه',
        collapsed: false,
        items: [
          { text: 'معرفی ماژول‌های تغذیه', link: '/power-modules/' },
          { text: 'ماژول مبدل باک <span class="latin">TPS54202 (EML01)</span>', link: '/power-modules/tps54202' },
          { text: 'ماژول شارژر باتری <span class="latin">CN3702 (EML02)</span>', link: '/power-modules/cn3702' }
        ]
      },
      {
        text: '۲. راهنمای توسعه نرم‌افزاری',
        collapsed: false,
        items: [
          { text: 'به‌زودی', link: '/software/' }
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
    footer: {
      message: 'مستندات سخت‌افزاری و الکترونیکی امیا',
      copyright: 'تمامی حقوق محفوظ است © ۲۰۲۶ امیا'
    }
  }
})
