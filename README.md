# 🌌 Exoplanet Transit Observation Analyzer

A lightweight, browser-based tool for visualizing and analyzing real exoplanet photometry data from citizen science observations (Exoplanet Watch / AAVSO-style datasets).

---

## 🔭 What this project does

This tool allows users to:

- Upload real exoplanet photometry files (`.txt` / `.csv`)
- Parse observational data (BJD_TDB, Dmag, Error, airmass)
- Generate **light curves** of exoplanet transit observations
- Smooth noisy signals using a moving average filter
- Compute basic statistical properties of observations
- Evaluate observation quality using a simple noise-based metric

---

## 📊 Features

- 📈 Interactive light curve visualization (Chart.js)
- 📉 Smoothed vs raw signal comparison
- 🧮 Observation statistics (mean, standard deviation, error estimation)
- ⭐ Basic quality grading system for datasets
- 🌌 Fully browser-based (no backend required)

---

## 🧪 Sample Data Format
BJD_TDB, Dmag, Error, airmass
2453425.504501, 0.003100, 0.003000, 1.303000
2453425.507631, -0.026900, 0.003000, 1.290000

---

## 🛠️ Tech Stack

- HTML
- CSS
- JavaScript
- Chart.js
- PapaParse

---

## 🚀 How to use

1. Open the website (GitHub Pages link)
2. Upload a `.txt` or `.csv` photometry file
3. View generated light curve and analysis instantly

---

## 🌠 Context

This project is inspired by **NASA Exoplanet Watch** citizen science datasets and is designed as an educational tool for understanding exoplanet transit photometry.

It is not a discovery tool, but a visualization and analysis interface for observational data.

---

## 📌 Future improvements

- Automatic transit dip detection
- Multi-observation comparison
- Exportable PDF reports
- Enhanced noise filtering methods

---

## 👤 Author

Built as an independent student project exploring real astronomical datasets and computational analysis techniques.
