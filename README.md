# 🧘‍♂️ CalmLink — Your Gateway to Stress-Free Living

CalmLink is a real-time stress detection and rehabilitation platform that combines wearable sensor data with AI-driven analysis to classify stress levels and recommend personalized recovery techniques.

When stress is detected, users are instantly guided to calming interventions like breathing animations, sound therapy, and affirmation cards.

---

## 🔍 Features

- 📊 **Live Stress Level Monitoring** via wearable sensors (HR, SpO₂)
- 🧠 **AI Model Integration** trained on WESAD dataset (Normal vs. Stressed)
- 🚨 **Stress Alerts & Navigation** to rehabilitation page
- 🧘‍♀️ **Mindfulness Snapshot**: breathing exercises, calming sounds & affirmations
- 📈 **Smart Recovery Summary** with health trend insights
- 🎯 **Modular Dashboard Interface** for easy expansion and customization

---

## 📦 Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js (optional for model API)
- **ML Model:** Binary classifier based on WESAD dataset
- **Deployment:** [Vercel](https://vercel.com/)

---

## ⚙️ How It Works

1. 📥 Wearable device streams HR and SpO₂ data to the system.
2. 🧠 AI model classifies the current state: `normal` or `stressed`.
3. 🟥 If stressed:
   - A **notification** is triggered.
   - User is redirected to the **rehabilitation page**.
   - Personalized calming content is displayed.

---
## 📸 Example UI Snapshots

### 🔐 Login Page

![Login Screenshot](https://github.com/user-attachments/assets/88879472-8c27-481d-9eed-2ac074467aa6)

### 📊 Dashboard Page

![Dashboard Screenshot](https://github.com/user-attachments/assets/203ff873-4b4d-4495-a19e-2bfc22368f97)


---

## 🚀 Future Enhancements

- 🌐 Real-time backend integration with the live ML model
- 🔄 User-specific routine adjustments based on stress trends
- 🔔 Push notifications across platforms
- 📊 Enhanced visual analytics of long-term stress patterns

---

## 🤖 AI Model (WESAD Dataset)

The model uses HR and SpO₂ values to classify stress into:
- ✅ `Normal`
- 🚨 `Stressed`

> When "Stressed" is detected, `stressLevelStatus` variable changes and triggers the UI behavior + notification.

---

## 💡 Example Use Case

Ideal for:
- Remote stress monitoring for post-COVID recovery
- Wearable-integrated mental health tools
- University or research projects in biomedical engineering

---


## 👥 Contributors

- [Hesham Tamer](https://github.com/heshamtamer)
- [Reem Adel](https://github.com/Reeem2001)
- [Yassmin Sayed](https://github.com/yassmin2000)
- [Farah Ossama](https://github.com/fou65)
- [Rana Ibrahim](https://github.com/RanaEssawy)



