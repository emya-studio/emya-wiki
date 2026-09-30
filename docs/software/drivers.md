# کتابخانه‌ها و درایورهای سخت‌افزاری

درایورهای استاندارد C/C++ توسعه داده شده برای کنترل سنسورها و قطعات بردهای امیا.

## درایورهای اختصاصی امیا

| ماژول / آی‌سی | پکیج درایور | پروتکل ارتباطی | مخزن سورس |
| :--- | :--- | :--- | :--- |
| **BME688** | `emya-driver-bme688` | I2C (آدرس `0x76`) | [مشاهده در گیت‌هاب](https://github.com/emya/drivers) |
| **BMI270** | `emya-driver-bmi270` | I2C (آدرس `0x68`) / SPI | [مشاهده در گیت‌هاب](https://github.com/emya/drivers) |
| **ST7789 Display** | `emya-driver-st7789` | SPI با DMA مستقیم | [مشاهده در گیت‌هاب](https://github.com/emya/drivers) |

---

## نمونه کد راه‌اندازی سنسور BME688 در C

```c
#include "esp_log.h"
#include "emya_bme688.h"

static const char *TAG = "EMYA_MAIN";

void app_main(void)
{
    // ۱. مقداردهی اولیه گذرگاه I2C
    i2c_master_bus_handle_t i2c_bus = emya_i2c_init();

    // ۲. پیکربندی سنسور
    bme688_dev_t sensor;
    if (bme688_init(&sensor, i2c_bus, BME688_I2C_ADDR_LOW) == ESP_OK) {
        ESP_LOGI(TAG, "سنسور محیطی BME688 با موفقیت شناسایی شد.");
    }

    while (1) {
        bme688_data_t data;
        bme688_read_data(&sensor, &data);
        
        ESP_LOGI(TAG, "دما: %.2f C | رطوبت: %.2f %% | فشار: %.2f hPa",
                 data.temperature, data.humidity, data.pressure);

        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}
```
