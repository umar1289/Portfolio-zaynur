#!/bin/bash
# Ikki marta bosing — katalog admin paneli brauzerda ochiladi.
# To'xtatish uchun shu oynada Ctrl+C bosing yoki oynani yoping.

cd "$(dirname "$0")" || exit 1

if [ ! -d node_modules ]; then
  echo "Birinchi ishga tushirish — kutubxonalar o'rnatilmoqda…"
  npm install || { echo "Xatolik: npm install bajarilmadi"; read -r -p "Enter bosing"; exit 1; }
fi

npm run admin
