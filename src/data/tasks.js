/**
 * A3-amaliy topshiriqlari. `context` va `key` — loyihaning o‘zida yozilgan ishonchli HTML.
 * Doska kataklari (board) boardTasks.js da.
 */
export const tasks = [
  {
    id: '3-1',
    title: 'Bozor hajmi: TAM, SAM, SOM',
    context: `<p>Viloyatga yiliga <b>400 000</b> turist keladi (o‘tgan yili <b>320 000</b> edi). Bir turistning o‘rtacha sarfi <b>2 000 000 so‘m</b>.</p>
<p>Madaniy turlarga turistlarning <b>30%</b> i qiziqadi. «Meros Tur» agentligi reja bo‘yicha mos bozorning <b>5%</b> ini egallay oladi. Hozirgi yillik tushumi — <b>7,2 mlrd so‘m</b>.</p>
<p class="formula">Bozor hajmi = turistlar soni × o‘rtacha sarf · Ulush = tushum : SAM × 100%</p>`,
    key: `<p>TAM = 400 000 × 2 000 000 = <b>800 mlrd so‘m</b>. SAM = 400 000 × 30% = <b>120 000 turist</b>, ya’ni <b>240 mlrd so‘m</b>. SOM = 120 000 × 5% = <b>6 000 turist</b>, ya’ni <b>12 mlrd so‘m</b>.</p>
<p>Bozor o‘sishi = (400 000 − 320 000) : 320 000 = <b>25%</b>. Hozirgi ulush = 7,2 : 240 = <b>3%</b>. SOM ga yetish uchun yana 12 − 7,2 = <b>4,8 mlrd so‘m</b> tushum kerak.</p>`,
  },
  {
    id: '3-2',
    title: 'Segmentatsiya mezonlari',
    context: `<p>Agentlik mijozlar bazasini tahlil qilib, oltita tavsif yozdi. Har mezonga mos <b>segment misolini</b> va uni aniqlash uchun eng mos <b>ma’lumot manbasini</b> toping.</p>
<p class="formula">Mezonlar: geografik · demografik · psixografik · xulq-atvor · safar maqsadi · texnologik</p>`,
    key: `<table><tr><th>Mezon</th><th>Segment misoli</th><th>Ma’lumot manbasi</th></tr>
<tr><td>Geografik</td><td>Germaniyadan kelgan sayyohlar</td><td>Sayt tashriflarining mamlakatlari hisoboti</td></tr>
<tr><td>Demografik</td><td>25–34 yoshli, bolali oilalar</td><td>Bron anketasidagi yosh va oila tarkibi</td></tr>
<tr><td>Psixografik</td><td>Ekologiyani qadrlovchi, faol hayot tarafdorlari</td><td>Qadriyat va qiziqishlar so‘rovnomasi</td></tr>
<tr><td>Xulq-atvor</td><td>Yiliga 3 marta bron qiladigan doimiy mijozlar</td><td>CRM dagi xaridlar tarixi (RFM)</td></tr>
<tr><td>Safar maqsadi</td><td>Konferensiya uchun kelganlar</td><td>«Safaringiz sababi» savoliga javoblar</td></tr>
<tr><td>Texnologik</td><td>Faqat smartfondan bron qiladiganlar</td><td>Analitikadagi qurilma turi hisoboti</td></tr></table>
<p>Raqamli xabarni eng shaxsiy moslash imkonini xulq-atvor ma’lumotlari beradi: mijoz nima olgani aniq ma’lum.</p>`,
  },
  {
    id: '3-3',
    title: 'Segment jozibadorligi: ball usuli',
    context: `<table><tr><th>Mezon</th><th>Og‘irlik</th><th>Yangi og‘irlik</th><th>A</th><th>B</th><th>C</th></tr>
<tr><td>Hajm</td><td>0,25</td><td>0,15</td><td>3</td><td>5</td><td>4</td></tr>
<tr><td>O‘sish sur’ati</td><td>0,20</td><td>0,10</td><td>4</td><td>3</td><td>5</td></tr>
<tr><td>To‘lov qobiliyati</td><td>0,25</td><td>0,45</td><td>5</td><td>2</td><td>3</td></tr>
<tr><td>Yetib borish imkoni</td><td>0,15</td><td>0,15</td><td>3</td><td>5</td><td>4</td></tr>
<tr><td>Raqobat pastligi</td><td>0,15</td><td>0,15</td><td>2</td><td>2</td><td>4</td></tr></table>
<p><b>A</b> — yevropalik madaniy sayyohlar, <b>B</b> — ichki oilaviy sayyohlar, <b>C</b> — ziyorat turistlari.</p>
<p class="formula">Tortilgan ball = Σ og‘irlik × ball</p>`,
    key: `<p>A = 0,75 + 0,80 + 1,25 + 0,45 + 0,30 = <b>3,55</b>; B = 1,25 + 0,60 + 0,50 + 0,75 + 0,30 = <b>3,40</b>; C = 1,00 + 1,00 + 0,75 + 0,60 + 0,60 = <b>3,95</b>. G‘olib — <b>C</b>.</p>
<p>Yangi og‘irliklar: A = 0,45 + 0,40 + 2,25 + 0,45 + 0,30 = <b>3,85</b>; B = 0,75 + 0,30 + 0,90 + 0,75 + 0,30 = <b>3,00</b>; C = 0,60 + 0,50 + 1,35 + 0,60 + 0,60 = <b>3,65</b>. G‘olib — <b>A</b>: to‘lov qobiliyatining og‘irligi oshdi, A shu mezonda 5 ball.</p>`,
  },
  {
    id: '3-4',
    title: 'Maqsadli turistlar guruhi va taklif',
    context: `<p>Olti turist guruhi uchun <b>asosiy ehtiyojni</b> va eng mos <b>taklif xabarini</b> tanlang. Har ehtiyoj va xabar faqat bitta guruhga to‘g‘ri keladi.</p>
<p class="formula">STP: segmentatsiya → targeting → pozitsiyalash</p>`,
    key: `<table><tr><th>Guruh</th><th>Asosiy ehtiyoj</th><th>Taklif xabari</th></tr>
<tr><td>Yevropalik madaniyat ixlosmandlari</td><td>Tarix va chuqur ma’lumot</td><td>«San’atshunos gid bilan Registon siri»</td></tr>
<tr><td>Bolali oilalar</td><td>Xavfsizlik va bolalar uchun qulaylik</td><td>«Bolalarga bepul, oilaviy xona tayyor»</td></tr>
<tr><td>Talaba-yoshlar</td><td>Arzon narx va yorqin taassurot</td><td>«Hostel + fototur: guruhga 20% chegirma»</td></tr>
<tr><td>Ziyorat turistlari</td><td>Diniy amallar uchun sharoit</td><td>«Ziyoratgohlar, halol taom, namozxona»</td></tr>
<tr><td>MICE mijozlari</td><td>Zal, texnika va aniq jadval</td><td>«200 o‘rinli zal va transfer — bitta shartnoma»</td></tr>
<tr><td>Keksa sog‘lomlashtirish sayyohlari</td><td>Davolanish va sokin ritm</td><td>«Sanatoriy: 10 kun shifokor nazoratida»</td></tr></table>`,
  },
  {
    id: '3-5',
    title: 'Reklama kanallarini taqqoslash',
    context: `<table><tr><th>Ko‘rsatkich</th><th>Instagram</th><th>Google qidiruv</th></tr>
<tr><td>Ko‘rsatishlar</td><td>200 000</td><td>50 000</td></tr>
<tr><td>Kliklar</td><td>4 000</td><td>2 500</td></tr>
<tr><td>Bronlar</td><td>80</td><td>100</td></tr>
<tr><td>Xarajat, so‘m</td><td>8 000 000</td><td>15 000 000</td></tr></table>
<p>O‘rtacha bron qiymati — <b>1 200 000 so‘m</b>.</p>
<p class="formula">CTR = klik : ko‘rsatish · CPC = xarajat : klik · CR = bron : klik · CPA = xarajat : bron · ROAS = tushum : xarajat</p>`,
    key: `<table><tr><th></th><th>CTR</th><th>CPC</th><th>CR</th><th>CPA</th><th>ROAS</th></tr>
<tr><td>Instagram</td><td>2%</td><td>2 000</td><td>2%</td><td>100 000</td><td>96 : 8 = 12</td></tr>
<tr><td>Google</td><td>5%</td><td>6 000</td><td>4%</td><td>150 000</td><td>120 : 15 = 8</td></tr></table>
<p>Bitta bron Instagramda arzonroq, ammo Google’da klikning bronga aylanishi ikki baravar yuqori: u yerda tayyor talab (niyat) bor.</p>`,
  },
  {
    id: '3-6',
    title: 'Email-marketing va A/B test',
    context: `<p>Agentlik <b>5 000</b> manzilga xat yubordi: <b>4 000</b> tasi yetib bordi, <b>1 000</b> kishi ochdi, <b>200</b> kishi havolani bosdi, <b>20</b> ta bron bo‘ldi.</p>
<p>Xarajat <b>1 000 000 so‘m</b>, o‘rtacha bron <b>900 000 so‘m</b>, marja <b>20%</b>.</p>
<p><b>B variant</b> (yangi mavzu satri): ochilish <b>30%</b>; CTOR va bronga aylanish o‘zgarmaydi.</p>
<p class="formula">Yetkazish = yetgan : yuborilgan · Ochilish = ochgan : yetgan · CTOR = klik : ochgan · ROI = (foyda − xarajat) : xarajat</p>`,
    key: `<p>Yetkazish = <b>80%</b>; ochilish = <b>25%</b>; CTOR = <b>20%</b>; bronga aylanish (klikdan) = <b>10%</b>.</p>
<p>Tushum = 20 × 900 000 = <b>18 000 000</b>; foyda = 18 000 000 × 20% = <b>3 600 000</b>; ROI = (3,6 − 1) : 1 = <b>260%</b>.</p>
<p>B variant: 4 000 × 30% = 1 200 ochish → 240 klik → <b>24 bron</b>, ya’ni <b>+4</b>. Yetkazish 80% — past: eskirgan manzillarni tozalash kerak.</p>`,
  },
  {
    id: '3-7',
    title: 'CAC, LTV va zararsizlik',
    context: `<p>Agentlik yil davomida marketingga <b>60 000 000 so‘m</b> sarfladi va <b>150</b> ta yangi mijoz jalb qildi. O‘rtacha buyurtma <b>1 500 000 so‘m</b>, marja <b>20%</b>. Bir mijoz o‘rtacha <b>4 marta</b> bron qiladi.</p>
<p><b>Yangi holat:</b> sodiqlik dasturi bilan mijoz <b>5 marta</b> bron qiladi.</p>
<p class="formula">CAC = xarajat : yangi mijoz · LTV = buyurtma × marja × bronlar soni · Zararsizlik = xarajat : bitta bron foydasi</p>`,
    key: `<p>CAC = 60 000 000 : 150 = <b>400 000</b>. Bitta bron foydasi = 1 500 000 × 20% = <b>300 000</b>. LTV = 300 000 × 4 = <b>1 200 000</b>. LTV : CAC = <b>3</b>.</p>
<p>Birinchi bron CAC ni qoplamaydi (300 000 &lt; 400 000), ikkinchisidan keyin foyda boshlanadi. Zararsizlik = 60 000 000 : 300 000 = <b>200 bron</b>.</p>
<p>Yangi holat: LTV = 300 000 × 5 = <b>1 500 000</b>, LTV : CAC = <b>3,75</b>.</p>`,
  },
  {
    id: '3-8',
    title: 'Elektron marketing vositalarini baholash',
    context: `<p>Olti vosita uchun <b>asosiy kuchli tomonni</b> va <b>asosiy ko‘rsatkichni</b> tanlang. Har javob faqat bitta vositaga to‘g‘ri keladi.</p>
<p class="formula">Vosita → maqsad → ko‘rsatkich: avval maqsad, keyin vosita tanlanadi</p>`,
    key: `<table><tr><th>Vosita</th><th>Kuchli tomoni</th><th>Asosiy ko‘rsatkich</th></tr>
<tr><td>SEO</td><td>Har klikka to‘lovsiz barqaror oqim</td><td>Organik tashriflar soni</td></tr>
<tr><td>Kontekst reklama</td><td>Tayyor talabga tez chiqish</td><td>Pullik klikning narxi (CPC) va CPA</td></tr>
<tr><td>SMM (organik)</td><td>Obunachilar bilan muloqot va jamoa</td><td>Faollik darajasi (like, izoh, saqlash)</td></tr>
<tr><td>Email-marketing</td><td>Mavjud bazani qayta xaridga undash</td><td>Ochilish darajasi va CTOR</td></tr>
<tr><td>Influencer</td><td>Bloger ishonchidan foydalanish</td><td>Shaxsiy promokod orqali bronlar</td></tr>
<tr><td>Chatbot</td><td>24/7 tezkor javob</td><td>Avtomatik yopilgan so‘rovlar ulushi</td></tr></table>`,
  },
  {
    id: '3-9',
    title: 'Keys-stadi: «Sharq Yo‘li» agentligi',
    context: `<p>Buxorodagi «Sharq Yo‘li» agentligi oyiga <b>24 mln so‘m</b> reklama sarflaydi. Maqsadli segment yozilmagan, sayt faqat rus tilida, natijalar faqat «layk» soni bilan o‘lchanadi. Mijozlarning yarmidan ko‘pi — nemis va fransuz madaniyat ixlosmandlari.</p>
<table><tr><th>Kanal</th><th>Xarajat, mln so‘m</th><th>Bronlar</th></tr>
<tr><td>Facebook</td><td>12</td><td>30</td></tr><tr><td>Google</td><td>8</td><td>40</td></tr><tr><td>Influencer</td><td>4</td><td>10</td></tr></table>
<p><b>Taklif:</b> Facebook byudjetidan <b>6 mln</b> Google’ga o‘tkaziladi; har kanalning CPA si o‘zgarmaydi deb olinadi.</p>
<p class="formula">CPA = xarajat : bron</p>`,
    key: `<p>CPA: Facebook <b>400 000</b>, Google <b>200 000</b>, Influencer <b>400 000</b>; o‘rtacha 24 000 000 : 80 = <b>300 000 so‘m</b>.</p>
<p>Yangi reja: Facebook 6 mln → 15; Google 14 mln → 70; Influencer 10. Jami <b>95 bron</b>, ya’ni <b>+15</b>. Eslatma: amalda byudjet oshsa, CPA ham o‘sishi mumkin — sinab ko‘rish kerak.</p>
<p>Uch sabab: segment aniqlanmagan, sayt tili mijozga mos emas, noto‘g‘ri ko‘rsatkich («layk») kuzatiladi. Takliflar: nemis va fransuz tilidagi landing; persona; CPA/ROAS hisoboti; Google’da sinov; sharhlar bilan ishlash.</p>`,
  },
];

export const TASK_IDS = tasks.map((task) => task.id);
export const findTask = (id) => tasks.find((task) => task.id === id);
