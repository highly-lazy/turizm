// topshiriq → [qiyinlik, savol, [to‘g‘ri javob, ...chalg‘ituvchilar], izoh]
const RAW = {
  '3-1': [
    [4, 'Viloyat turizm bozorining umumiy hajmi (TAM) qancha?', ['800 mlrd so‘m', '640 mlrd so‘m', '240 mlrd so‘m', '80 mlrd so‘m'], '400 000 × 2 000 000 = 800 mlrd. 640 mlrd — o‘tgan yil soni bilan; 240 mlrd — SAM.'],
    [4.5, 'Agentlik uchun SAM hajmi qancha?', ['240 mlrd so‘m', '800 mlrd so‘m', '120 mlrd so‘m', '12 mlrd so‘m'], '400 000 × 30% = 120 000 turist; × 2 000 000 = 240 mlrd so‘m. 12 mlrd — SOM.'],
    [4.5, 'SOM bo‘yicha agentlik nechta turistga xizmat qiladi?', ['6 000 turist', '20 000 turist', '120 000 turist', '12 000 turist'], '120 000 × 5% = 6 000. 20 000 — 5% ni butun bozordan (TAM) olgan xato.'],
    [4.5, 'Turistlar soni bir yilda necha foiz o‘sdi?', ['25%', '20%', '80%', '12,5%'], '(400 000 − 320 000) : 320 000 = 25%. 20% — yangi yilga bo‘lish xatosi.'],
    [5, 'Agentlikning SAM dagi hozirgi ulushi qancha?', ['3%', '5%', '0,9%', '7,2%'], '7,2 : 240 = 3%. 0,9% — TAM ga bo‘lish; 5% — reja (SOM) ulushi.'],
  ],
  '3-2': [
    [4, '«Analitikadagi qurilma turi hisoboti» qaysi mezon bo‘yicha segmentlashga yordam beradi?', ['Texnologik', 'Geografik', 'Psixografik', 'Demografik'], 'Qurilma turi (smartfon, kompyuter) — texnologik mezon.'],
    [4.5, '«CRM dagi xaridlar tarixi» asosida qaysi mezon qo‘llanadi?', ['Xulq-atvor', 'Demografik', 'Geografik', 'Psixografik'], 'Xaridlar tarixi chastota, summa va vaqtni ko‘rsatadi — xulq-atvor (RFM).'],
    [4.5, 'Psixografik segmentni aniqlash uchun eng mos manba qaysi?', ['Qadriyat va qiziqish so‘rovi', 'Tashriflar mamlakati hisoboti', 'Qurilma turi hisoboti', 'Bron anketasidagi yosh'], 'Qadriyat va hayot tarzini so‘rovnoma orqali bilish mumkin.'],
    [5, '«25–34 yoshli, bolali oilalar, tog‘ sayohatini sevadi» tavsifida qaysi mezonlar birlashgan?', ['Demografik va psixografik', 'Geografik va texnologik', 'Xulq-atvor va geografik', 'Faqat demografik'], 'Yosh va oila — demografik; sayohat turini sevish (qiziqish) — psixografik.'],
  ],
  '3-3': [
    [4.5, 'A segmentning dastlabki tortilgan bali qancha?', ['3,55', '3,40', '3,95', '3,85'], '0,75 + 0,80 + 1,25 + 0,45 + 0,30 = 3,55. 3,85 — yangi og‘irliklar bilan.'],
    [4, 'Dastlabki og‘irliklar bo‘yicha g‘olib segment qaysi?', ['C — 3,95', 'A — 3,55', 'B — 3,40', 'A — 3,85'], 'C = 1,00 + 1,00 + 0,75 + 0,60 + 0,60 = 3,95.'],
    [5, 'Yangi og‘irliklar bo‘yicha g‘olib qaysi?', ['A — 3,85', 'C — 3,65', 'C — 3,95', 'B — 3,00'], 'A = 0,45 + 0,40 + 2,25 + 0,45 + 0,30 = 3,85; C = 3,65. 3,95 — C ning eski bali.'],
    [4.5, 'B segmentning eng katta hissasi qaysi mezondan (dastlab)?', ['Hajm — 1,25', 'Yetib borish — 0,75', 'O‘sish — 0,60', 'To‘lov — 0,50'], 'Hajm: 0,25 × 5 = 1,25.'],
    [5, 'G‘olibning C dan A ga o‘tishiga asosiy sabab nima?', ['To‘lov qobiliyati og‘irligi oshgani', 'A ning ballari ko‘paytirilgani', 'C ning raqobat bali tushgani', 'Hajm mezonining og‘irligi oshgani'], 'Ballar o‘zgarmadi; to‘lov qobiliyati 0,25 → 0,45, A unda 5, C esa 3 ball.'],
  ],
  '3-4': [
    [4, '«200 o‘rinli zal va transfer — bitta shartnoma» xabari kimga mo‘ljallangan?', ['MICE mijozlari', 'Bolali oilalar', 'Ziyorat turistlari', 'Talaba-yoshlar'], 'Zal, texnika va aniq jadval — MICE segmentining ehtiyoji.'],
    [4.5, 'Talaba-yoshlar segmentining asosiy ehtiyoji qaysi?', ['Arzon narx va taassurot', 'Davolanish va sokinlik', 'Zal, texnika va jadval', 'Bolalar uchun qulaylik'], 'Yoshlar byudjeti cheklangan, yorqin taassurot izlaydi.'],
    [4.5, 'Xabarni «Davolanish va sokin ritm» ehtiyojiga moslang.', ['«Sanatoriy: 10 kun nazoratda»', '«Hostel va fototur: chegirma»', '«Oilaviy xona, bolalarga bepul»', '«Registon siri: san’atshunos gid»'], 'Sanatoriy va shifokor nazorati sog‘lomlashtirish segmentiga mos.'],
    [5, 'Hamma guruhga bitta umumiy xabar yuborilsa, asosiy kamchilik nima?', ['Hech bir ehtiyojga aniq mos kelmaydi', 'Reklama kanali soni ko‘payib ketadi', 'Har guruhga alohida matn yoziladi', 'Segmentlar soni avtomatik kamayadi'], 'Umumiy xabar hech kimga shaxsan tegishli bo‘lmaydi, javob darajasi pasayadi.'],
  ],
  '3-5': [
    [4, 'Instagram reklamasining CTR si qancha?', ['2%', '5%', '4%', '0,04%'], '4 000 : 200 000 = 2%. 5% — Google.'],
    [4.5, 'Google’da bitta bron narxi (CPA) qancha?', ['150 000 so‘m', '100 000 so‘m', '6 000 so‘m', '300 000 so‘m'], '15 000 000 : 100 = 150 000. 6 000 — CPC.'],
    [4.5, 'Qaysi kanalda CPC qimmatroq va qancha?', ['Google — 6 000 so‘m', 'Instagram — 2 000 so‘m', 'Google — 150 000 so‘m', 'Instagram — 6 000 so‘m'], '15 000 000 : 2 500 = 6 000; Instagram 2 000. 150 000 — CPA.'],
    [5, 'Instagram ROAS i qancha?', ['12', '8', '10', '96'], '80 × 1 200 000 = 96 mln; 96 : 8 = 12. 8 — Google ROAS i.'],
    [5, 'Marja 10% bo‘lsa, Google reklamasi foyda keltiradimi?', ['Yo‘q: foyda 12 mln, xarajat 15 mln', 'Ha: tushum xarajatdan 8 baravar ko‘p', 'Ha: foyda 12 mln, xarajat 8 mln', 'Yo‘q: tushum 15 mln dan kam'], '120 mln × 10% = 12 mln < 15 mln. Zararsizlik ROAS = 10, Google’da esa 8.'],
  ],
  '3-6': [
    [4, 'Xatlarning yetkazish darajasi qancha?', ['80%', '20%', '25%', '40%'], '4 000 : 5 000 = 80%. 20% — yetmagan qismi.'],
    [4.5, 'Ochilish darajasi (yetkazilganlarga nisbatan) qancha?', ['25%', '20%', '80%', '5%'], '1 000 : 4 000 = 25%. 20% — yuborilganga nisbatan xato hisob.'],
    [4.5, 'CTOR qancha?', ['20%', '5%', '4%', '10%'], '200 : 1 000 = 20%. 5% — yetkazilganga nisbatan CTR; 10% — bronga aylanish.'],
    [5, 'Kampaniyaning ROI si (marja 20%) qancha?', ['260%', '360%', '1 700%', '18%'], 'Foyda 3 600 000; (3,6 − 1) : 1 = 260%. 1 700% — marjani unutish xatosi.'],
    [5, 'B variantda nechta bron bo‘ladi?', ['24 ta', '26 ta', '20 ta', '30 ta'], '4 000 × 30% = 1 200 → × 20% = 240 → × 10% = 24.'],
  ],
  '3-7': [
    [4, 'Bitta yangi mijozni jalb qilish narxi (CAC) qancha?', ['400 000 so‘m', '300 000 so‘m', '250 000 so‘m', '600 000 so‘m'], '60 000 000 : 150 = 400 000. 300 000 — bitta bron foydasi.'],
    [4.5, 'Mijozning LTV si (4 bron) qancha?', ['1 200 000 so‘m', '6 000 000 so‘m', '1 500 000 so‘m', '300 000 so‘m'], '1 500 000 × 20% × 4 = 1 200 000. 6 000 000 — marja hisobga olinmagan.'],
    [4.5, 'Hozirgi LTV : CAC nisbati qancha?', ['3', '3,75', '15', '0,33'], '1 200 000 : 400 000 = 3. 15 — marjasiz LTV bilan.'],
    [5, 'Marketing xarajatini qoplash uchun nechta bron kerak?', ['200 ta', '40 ta', '150 ta', '400 ta'], '60 000 000 : 300 000 = 200. 40 — marjasiz tushumga bo‘lish xatosi.'],
    [5, 'Sodiqlik dasturi LTV ni qanchaga oshiradi?', ['300 000 so‘mga', '1 500 000 so‘mga', '100 000 so‘mga', '400 000 so‘mga'], '1 500 000 − 1 200 000 = 300 000 so‘m (yana bitta bron foydasi).'],
  ],
  '3-8': [
    [4, 'Shaxsiy promokod orqali bronlar soni qaysi vosita samarasini o‘lchaydi?', ['Influencer', 'Chatbot', 'SEO', 'Kontekst reklama'], 'Blogerga shaxsiy promokod berilsa, undan kelgan bronlar aniq ko‘rinadi.'],
    [4.5, 'Mavjud mijozlar bazasini qayta xaridga undash uchun eng mos vosita?', ['Email-marketing', 'SEO', 'Banner reklama', 'Kontekst reklama'], 'Bazaga bevosita va arzon murojaat — email.'],
    [4.5, 'Tunda kelgan savollarga darhol javob berish muammosini qaysi vosita hal qiladi?', ['Chatbot', 'Influencer', 'Blog maqolasi', 'Email xat'], 'Chatbot 24/7 avtomatik javob beradi.'],
    [5, 'Agentlik SEO samarasini «layklar soni» bilan o‘lchadi. Xato nimada?', ['Ko‘rsatkich vosita maqsadiga mos emas', 'Layklar soni aniq hisoblanmaydi', 'SEO ni umuman o‘lchab bo‘lmaydi', 'Layk faqat pullik reklamada bo‘ladi'], 'SEO ko‘rsatkichi — organik tashriflar; layk SMM faolligiga tegishli.'],
  ],
  '3-9': [
    [4, 'Facebook kanalining CPA si qancha?', ['400 000 so‘m', '200 000 so‘m', '300 000 so‘m', '250 000 so‘m'], '12 000 000 : 30 = 400 000.'],
    [4.5, 'Barcha kanallar bo‘yicha o‘rtacha CPA qancha?', ['300 000 so‘m', '333 333 so‘m', '400 000 so‘m', '240 000 so‘m'], '24 000 000 : 80 = 300 000. 333 333 — uch CPA ning oddiy o‘rtachasi (xato).'],
    [5, 'Yangi rejada jami nechta bron kutiladi?', ['95 ta', '110 ta', '80 ta', '125 ta'], '15 + 70 + 10 = 95. 110 — Facebook bronlari kamaymagan deb olingan xato.'],
    [4.5, 'Saytga birinchi navbatda qaysi tillar qo‘shilishi kerak?', ['Nemis va fransuz', 'Xitoy va yapon', 'Arab va turk', 'Hind va urdu'], 'Mijozlarning yarmidan ko‘pi — nemis va fransuz sayyohlari.'],
    [5, '«Byudjet ikki baravar oshsa, bron ham ikki baravar oshadi» farazining zaif joyi?', ['Auditoriya to‘yinib, CPA o‘sishi mumkin', 'Byudjet oshsa, CPA har doim tushadi', 'Google’da byudjetni oshirib bo‘lmaydi', 'Bronlar soni byudjetga bog‘liq emas'], 'Eng tayyor auditoriya birinchi olinadi; keyingi bronlar qimmatlashishi mumkin.'],
  ],
};

export const practiceQuestions = Object.entries(RAW).flatMap(([taskId, questions]) =>
  questions.map(([level, question, options, note]) => ({ taskId, level, question, options, note })),
);
