"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

type Language = "ja" | "en";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations = {
  ja: {
    // ナビゲーション
    "app.title": "Bin Buddy Japan",
    "nav.region.settings": "地域の設定",
    "nav.user.registration": "ユーザー登録",
    "nav.support": "サポート",

    // メイン画面
    "main.address.setup": "住所を設定",
    "main.prefecture": "都道府県",
    "main.city": "市区町村",
    "main.district": "区市町村",
    "main.search": "設定する",
    "main.go": "検索",
    "main.postalCode": "郵便番号",
    "main.postalCodeExample": "0124567",
    "main.selectAnArea": "ゴミ収集エリアを選択してください",
    "main.areaSelect": "エリアを選択する",

    // カレンダー画面
    "calendar.select.date": "日付を選択",
    "calendar.calendar": "カレンダー",
    "calendar.take.photo": "画像撮影",
    "calendar.launch.camera": "カメラを起動",
    "calendar.result": "判定結果",
    "calendar.trash.type": "捨てるゴミ",

    //イレギュラーコメント
    "irregular.comment1": "古着回収",
    "irregular.comment2": "大型ゴミ　※事前申し込みが必要です（戸別有料）",
    "irregular.comment3": "電池回収",
    "irregular.comment4": "資源ゴミ",

    // スキャン画面
    "scan.take.photo": "ゴミを撮影してください",
    "scan.cancel": "やめる",
    "scan.processing": "処理中...",
    "scan.take.picture": "撮影する",
    "scan.retake": "撮り直す",
    "scan.analyze": "調べる",

    // 結果画面
    "result.title": "分別結果",
    "result.trash.type": "ゴミの種類",
    "result.collection.day": "収集日:",
    "result.back.to.calendar": "カレンダーに戻る",

    "result.Combustible": "燃えるゴミ",
    "result.Non-Combustible": "燃えないゴミ",
    "result.Bottles": "びん・缶・ペットボトル",
    "result.Plastic": "容器プラ",
    "result.Paper": "雑がみ",
    "result.Branches": "枝・葉・草",
    "result.Irregular": "臨時収集",
    "result.Not Collected": "収集なし",
    "result.news": "お知らせ",
    "result.NoticeTitle": "お知らせ一覧",

    //ゴミの品目モーダル内
    "modal.garbagetypical.item": "主な品目",
    "modal.Combustible.item":
      "生ごみ（野菜・果物のくず、残飯、卵の殻、貝殻、アルミホイルなど）\n食用油\n汚れた紙（使用済みのティッシュペーパー、紙おむつ、水ですすいでも汚れが落ちない食品容器など）\n製品プラスチック（洗面器、定規、CD、ボールペン、ビデオテープなど）\n衣類・布類\n皮革製品\nゴム製品、ビニール製品\n木製品、木くず、材木類\n炭、乾燥剤、保冷剤、使い捨てカイロ",
    "modal.Non-Combustible.item":
      "「容器包装プラスチック」「びん・缶・ペットボトル」の日に収集しない容器（油の容器、塗料薬品の缶など）\n小型家電製品（ポット、ドライヤー、ビデオカメラ、時計、電卓、体重計など）※市有施設などの回収拠点に無料で持ち込むことができます。詳しくは札幌市コールセンター（TEL.011-222-4894／日本語、英語、韓国語、中国語）まで。\n金属製品（なべ、やかん、金属製のおもちゃ、ホッチキスなど）\nガラス、せともの、蛍光管、電球、LED照明\nブロック、レンガ",
    "modal.Bottles.item":
      "ペットボトル\n空きびん（飲料用・調味料のびん、飲み薬などのびん、化粧品のガラスびん）\n空き缶（飲料用のアルミ缶・スチール缶、缶詰・菓子・海苔の缶など）\nペットボトル（♻マークが付いた飲料用・調味料の容器）",
    "modal.Plastic.item":
      "パック・カップ類（卵・豆腐・コンビニ弁当などのプラスチック製容器）\nトレー類（生鮮食品・珍味・菓子などのトレー）\nボトル類（食用油、洗剤、シャンプーなどのプラスチック製ボトル）\nチューブ類（マヨネーズ、ケチャップ、歯磨き粉などのチューブ）\nポリ袋、ラップ類（レジ袋、食料品・衣料品などの袋、ポテトチップス・レトルトカレーの袋など）\nプラスチック製のふた・ラベル\nネット類・緩衝材（果物・野菜のネット、梱包用の発泡スチロールなど）",
    "modal.Paper.item":
      "紙箱類（ティッシュの箱、菓子箱、洗剤の箱、ラップやアルミホイルの箱など）\n紙皿・紙パック・ふた類（アイスクリームのカップ・ふた、菓子の紙皿など）\n酒やジュースの紙製容器（内側にアルミ箔が貼られているものも対象）\n台紙類（紙箱の底の台紙や中仕切りなど）\nはがき、手紙、封筒、写真、カレンダー、レシート\n包装紙、紙袋、ラップやアルミホイル、トイレットペーパーの芯\nシュレッダーにより裁断した紙",
    "modal.Branches.item":
      "刈芝、草花、落ち葉\n庭木の剪定枝・幹・根\n※材木類・木製品・畳、ござ・野菜や果実（果物）・竹や笹は対象外です。大きさにより「燃やせるごみ」または「大型ごみ」に出してください。",
    "modal.Irregular.item":
      "古着\nスプレー缶・カセットボンベ\n整髪料\nライター・点火棒\n加熱式たばこ・電子たばこ",
    "modal.Not Collected.item":
      "耐久消費財その他固形廃棄物で、指定袋（40ℓ）に入らないもの。ただし、排出禁止物、単品で重量が100kgを超えるもの、または長さが2mを超えるものは収集しません。\n台所用品（ガスこんろなど）\n家具・寝具・建具（いす、たんす、ベッドなど）\n家電製品（ステレオセット、電子レンジなど）\nスポーツ・レジャー用品・楽器（ゴルフ用品・スキー用品・ギターなど）\n木の枝・幹（長さが50cmを超え2m以下のもの）",

    //ゴミの出し方モーダル内
    "modal.trashCollection.rule": "出し方",
    "modal.Combustible.rule":
      "有料。指定袋に入れ、収集当日の朝、8時30分までにごみステーションに出してください。\n・週2回収集します。収集日は収集日カレンダーで確認してください。\n・指定袋に入らない大きさのものは、大型ごみ収集センターに電話でお申込みください。\n・生ごみは水気を切ってから出してください。\n・紙おむつは汚物を取り除いて出してください。\n・食用油は、紙や布にしみ込ませるか、凝固剤で固めて出してください。",
    "modal.Non-Combustible.rule":
      "有料。指定袋に入れ、収集当日の朝、8時30分までにごみステーションに出してください。\n・4週に1回収集します。収集日は収集日カレンダーで確認してください。\n・ガラス・せともの・蛍光管などは、厚紙などで包み、指定袋に「キケン」と表示してください。\n・指定袋に入らない大きさのものは、大型ごみ収集センターに電話でお申込みください。\n・割れていない蛍光管は、リサイクルできますので、蛍光管リサイクル回収協力店に出すようご協力ください。\n・詳しくは循環型社会推進課（TEL.011-211-2928 日本語）まで。",
    "modal.Bottles.rule":
      "無料。透明または半透明の袋に入れて、収集日当日の朝、8時30分までにごみステーションに出してください。\n・週1回収集します。収集日は収集日カレンダーで確認してください。\n・中身が残っていたり、汚れが付着している場合は、水で軽くすすいでから出してください。\n・びんやペットボトルのふたは必ずはずしてください。プラスチック製のふたは容器包装プラスチック、アルミボトルのふたははずしてびん・缶・ペットボトル、これ以外のふたは燃やせないごみに出してください。\n・ペットボトルのラベル（マーク）は、はがして「容器包装プラスチック」へ出してください。",
    "modal.Plastic.rule":
      "無料。透明または半透明の袋に入れて、収集日当日の朝、8時30分までにごみステーションに出してください。\n・週1回収集します。収集日は収集日カレンダーで確認してください。\n・中身が残っていたり、汚れが付着している場合は、水で軽くすすいでから出してください。\n・チューブ類は中身を使い切ってから出してください。",
    "modal.Paper.rule":
      "無料。透明または半透明の袋に入れて、収集日当日の朝、8時30分までにごみステーションに出してください。\n・2週に1回収集します。収集日は収集日カレンダーで確認してください。\n・紙おむつやティッシュ、マスク、水ですすいでも汚れが落ちない食品容器などの汚れた紙は「燃やせるごみ」に出してください。",
    "modal.Branches.rule":
      "無料。落ち葉や草花は透明または半透明の袋に入れ、庭木の枝は、長さ50cm以下のものを長さ1mくらいのひもで縛り、収集日当日の朝、8時30分までにごみステーションに出してください。\n・収集期間（5月～12月、地区によって異なります）は、4週に1回収集します。収集日は収集日カレンダーで確認してください。\n・収集期間外は、指定袋に入るものは「燃やせるごみ」、指定袋に入らないものは「大型ごみ」へ出してください（いずれも有料）。",
    "modal.Irregular.rule": "カレンダー下のお知らせからご確認ください。",
    "modal.Not Collected.rule":
      "①大型ごみ収集センターに電話でお申込みください。受付番号・収集日・処理手数料をお知らせします。\n・電話 011-281-8153（日本語）\n・受付 午前9時～午後4時30分（年末年始を除き、土曜・日曜・祝日も受付）\n②ステッカーのあるスーパー、コンビニエンスストア、ドラッグストア、ホームセンターで、手数料シールを購入してください。\n③シールに受付番号を記入し、大型ごみの見やすいところに貼り、収集日当日の朝、8時30分までに、申込時に打合せした場所に出してください。",

    "result.monday": "月曜日",
    "result.tuesday": "火曜日",
    "result.wednesday": "水曜日",
    "result.thursday": "木曜日",
    "result.friday": "金曜日",
    "result.saturday": "土曜日",
    "result.sunday": "日曜日",

    // ユーザー登録画面
    "register.title": "ユーザー登録",
    "register.subtitle": "有料会員登録で全ての機能を利用できます",
    "register.name": "名前",
    "register.email": "メールアドレス",
    "register.password": "パスワード",
    "register.confirm": "パスワード（確認）",
    "register.submit": "登録する",
    "register.price": "月額料金: 200円",
    "register.features": "利用可能な機能:",
    "register.feature.1": "無制限のサポート",
    "register.feature.2": "収集日のリマインダー",
    "register.feature.3": "地域別のゴミ分別ルール",
    "register.feature.4": "アカウントの共有",

    // サポート画面
    "support.title": "サポート",
    "support.subtitle": "お困りですか？以下に質問を入力してください",
    "support.placeholder": "ここに質問を入力...",
    "support.send": "送信",
    "support.faq": "よくある質問",
    "support.faq.1.q": "アプリの使い方を教えてください",
    "support.faq.1.a":
      "住所を設定し、カレンダーでゴミ収集日を確認し、カメラでゴミを撮影すると分別方法を教えてくれます。",
    "support.faq.2.q": "有料会員の特典は何ですか？",
    "support.faq.2.a":
      "有料会員になると、無制限のゴミ分別、収集日のリマインダー、地域別のゴミ分別ルールなどの機能が利用できます。",

    // 共通
    "common.copyright": "©Bin Buddy",
    "common.main": "メイン",
    "common.calendar": "カレンダー",
    "common.scan": "ゴミを調べる",
  },
  en: {
    // Navigation
    "app.title": "Bin Buddy Japan",
    "nav.region.settings": "Area Settings",
    "nav.user.registration": "User Registration",
    "nav.support": "Support",

    // Main Screen
    "main.address.setup": "Set Address",
    "main.prefecture": "Prefecture",
    "main.city": "City",
    "main.district": "District",
    "main.search": "OK",
    "main.go": "search",
    "main.postalCode": "Zip cpde",
    "main.postalCodeExample": "0124567",
    "main.selectAnArea": "Please select your waste collection area",
    "main.areaSelect": "Select area",

    // Calendar Screen
    "calendar.select.date": "Select date",
    "calendar.calendar": "Calendar",
    "calendar.take.photo": "Take Photo",
    "calendar.launch.camera": "Launch Camera",
    "calendar.result": "Result",
    "calendar.trash.type": "Trash Type",

    //irregular Screen
    "irregular.comment1": "Old clothes collection",
    "irregular.comment2":
      "Large-sized garbage *Advance application required (charges apply per household)",
    "irregular.comment3": "Battery collection",
    "irregular.comment4": "Resource garbage",
    // Scan Screen
    "scan.take.photo": "Please take a photo of the trash",
    "scan.cancel": "Cancel",
    "scan.processing": "Processing...",
    "scan.take.picture": "Take Picture",
    "scan.retake": "Retake",
    "scan.analyze": "Analyze",

    // Result Screen
    "result.title": "Sorting Result",
    "result.trash.type": "Trash Type",
    "result.collection.day": "Collection Day:",
    "result.back.to.calendar": "Back to Calendar",

    "result.Combustible": "Combustible Waste",
    "result.Non-Combustible": "Non-Combustible Waste",
    "result.Bottles": "Bottles, Cans & PET",
    "result.Plastic": "Plastic Containers & Packaging",
    "result.Paper": "Miscellaneous Paper",
    "result.Branches": "Branches, Leaves & Grass",
    "result.Irregular": "Temporary Collection",
    "result.Not Collected": "Not Collected",
    "result.news": "Notice",
    "result.NoticeTitle": "Notice list",

    //ゴミの品目モーダル内
    "modal.garbagetypical.item": "Typical items",
    "modal.Combustible.item":
      "Kitchen garbage (fruit and vegetable scraps, leftovers, eggshells, seafood shells, aluminum foil, etc.)\nCooking/salad oil\nSoiled paper (used tissue paper, disposable diapers, food containers that cannot be rinsed clean, etc.)\nPlastic products (washing basins, rulers, CDs, ballpoint pens, video tapes, etc.)\nClothing, blankets, etc.\nLeather and hide goods\nRubber and vinyl goods\nWooden items, woodchips and timber\nCharcoal, drying agents, gel ice-packs, disposable pocket warmers",
    "modal.Non-Combustible.item":
      'Containers that are not collected on the days for collecting "plastic containers and packaging" and "bottles, cans and PET bottles"(oil containers, paint and chemical cans, etc.)\nSmall household electronic appliances (electric kettles, hairdryers, video cameras, clocks, calculators, bathroom scales, etc.)*These items may be collected for free at certain city facilities. For more information, please call the Sapporo City Call Center (TEL.011-222-4894/Japanese, English, Korean, Chinese).\nMetal products (pans, kettles, metallic toys, staples, etc.)\nGlass, china, fluorescent lamps, electric bulbs and LED lighting products\nBlocks, bricks',
    "modal.Bottles.item":
      "Empty bottles (beverage/seasoning bottles, medicine bottles, glass cosmetics containers)\nEmpty cans (aluminum and steel beverage cans, food tins, confectionery/seaweed cans, etc.)\nPET bottles (beverage and seasoning bottles with the ♻)",
    "modal.Plastic.item":
      "Packs and cups (egg, tofu, convenience-store bento boxes and other plastic containers, etc.)\nTrays (fresh food, snack, confectionery and other plastic trays)\nBottles (cooking/salad oil, detergent, shampoo and other plastic bottles)\nTubes (mayonnaise, ketchup, toothpaste and other plastic tubes)\nPlastic bags and wrapping (plastic shopping bags, food and clothing packages, potato chip bags, instant-curry sachets, etc.)\nPlastic lids and labels\nNets and shock absorbent packaging (fruit and vegetable nets, polystyrene packaging, etc.)",
    "modal.Paper.item":
      "Paper boxes (tissue, confectionery, detergent, kitchen wrap and foil boxes, etc.)\nPaper cartons, packs and lids (ice-cream tubs, lids, confectionery cartons, etc.)\nPaper alcohol and juice cartons (including those lined with aluminum foil)\nPaper mounting bases (paper boxes, bases, internal separators etc.)\nPostcards, letters, envelopes, photographs, calendars, receipts\nWrapping paper, paper bags, cores from kitchen wrap, aluminum foil and toilet rolls\nShredded paper",
    "modal.Branches.item":
      "Grass cuttings, vegetation, fallen leaves\nPruned branches, stems and roots of garden shrubs and trees\n※Timber, wooden products, materials used for protecting plants and gardens in winter, vegetables, fruit, bamboo and bamboo grass are not subject to free collection, and should be disposed of as non-burnable waste or bulky refuse depending on the size.",
    "modal.Irregular.item":
      "Hairspray / insecticide tins, tabletop gas cartridges, etc.\nLighters and ignition rods\nHeated tobacco products and electronic cigarettes",
    "modal.Not Collected.item":
      "Consumer durables and other solid waste that will not fit into the designated 40ℓ waste bags. However, prohibited items, items weighing over 100 kg and those longer than 2 m cannot be collected.\nKitchen equipment (gas stoves, etc.)\nFurniture, bedding, fittings & fixtures (chairs, chests, beds, etc.)\nHousehold electrical appliances (audio equipment, microwave ovens, etc.)\nSports & leisure goods, musical instruments (golf/ski equipment, guitars, etc.)\nTree branches/trunks (longer than 50 cm but less than 2 m)",

    //ゴミの出し方モーダル内
    "modal.trashCollection.rule": "Hoe to put out for colection",
    "modal.Combustible.rule":
      "A fee is charged for the collection of burnable waste, which should be put in a designated waste bag and placed at the waste collection station by 8:30 a.m. on the day of collection (Please do not put out garbage the day before).\nBurnable waste is collected twice a week; please confirm the day on a household garbage collection calendar.\nFor items too big to fit inside the designated waste bags, please call the Bulky Refuse Collection Center to arrange collection.\nDrain any surplus water from kitchen waste.\nContents of disposable diapers should be flushed down the toilet before putting the used diapers in the bags for collection.\nUse paper or cloth to soak up cooking/salad oil, or use solidifying agents before putting it out for collection.",
    "modal.Non-Combustible.rule":
      "A fee is charged for the collection of non-burnable waste, which should be put in a designated waste bag and placed at the waste collection station by 8:30 a.m. on the day of collection (Please do not put out garbage the day before).\nNon-burnable waste is collected once every four weeks; please confirm the day on a household garbage collection calendar.\nBroken glass, pottery, fluorescent lamps and the like should be wrapped in cardboard or heavy-gauge paper and placed in a designated waste bag marked with the word キケン (danger).\nFor large items that cannot fit inside the designated waste bags, please call the Bulky Refuse Collection Center to arrange collection.\nFluorescent lamps that are still intact can be recycled; please return them to a shop with a recycling collection policy.\nFor details, call the Recycling Society Promotion Section at 011-211-2928 (Japanese only).",
    "modal.Bottles.rule":
      "Bottles, cans and PET bottles are collected free of charge, and should be put in an ordinary transparent or semi-transparent bag and placed at waste collection stations by 8:30 a.m. on the day of collection (Please do not put out garbage the day before).\nCollections are made once a week; please confirm the day on a household garbage collection calendar.\nRinse off any excess dirt or contents with water before putting out for collection.\nEnsure all caps and tops have been removed from bottles. Plastic caps should be thrown away with plastic containers and packaging, aluminum tabs should be thrown away with bottles, can and PET bottles, and all other caps and tops should be thrown away with non-burnable waste.\nLabels on PET bottles should be removed and thrown away with plastic containers and packaging.",
    "modal.Plastic.rule":
      "Plastic containers and packaging are collected free of charge, and should be put in an ordinary transparent or semi-transparent bag and placed at the waste collection station by 8:30 a.m. on the day of collection (Please do not put out garbage the day before).\nCollections are made once a week; please confirm the day on a household garbage collection calendar.\nRinse off any excess dirt or contents with water before putting out for collection.\nMake sure tubes are completely empty before throwing them away.",
    "modal.Paper.rule":
      "Miscellaneous paper is collected free of charge, and should be put in an ordinary transparent or semi-transparent bag and placed at the waste collection stationby 8:30 a.m. on the day of collection (Please do not put out garbage the day before).\nCollections are made once every two weeks; please confirm the day on a household garbage collection calendar.\nDisposable diapers, tissues, face masks and soiled paper food containers and other such waste that cannot be rinsed clean with water should be disposed of as burnable waste.",
    "modal.Branches.rule":
      "Branches, leaves, grass and weed cuttings are collected free of charge. Leaves and vegetation should be gathered into an ordinary transparent or semi-transparent bag; branches less than 50cm long should be gathered in bundles small enough to be tied with a 1m-long piece of string, and placed at the waste collection stations by 8:30 a.m. on the day of collection (Please do not put out garbage the day before).\nThe collection days are once every 4 weeks between May and December (periods may vary by district). Please confirm the day on a household garbage collection calendar.\nDuring the periods outside the collection season, items small enough to fit in designated waste bags should be disposed of as burnable waste; other larger items should be disposed of as bulky refuse. (Both of which require a fee for collection.)",
    "modal.Irregular.rule": "Please check the notice below the calendar.",
    "modal.Not Collected.rule":
      "① Please arrange for collection by calling the Bulky Refuse Collection Center, which will inform you of the reference number, date and cost of collection.\nTel. 011-281-8153 (Japanese only)\nHours 9 a.m. to 4:30 p.m. (including Saturdays and national holidays except the year-end and New Year holidays)\nCollection days and application periods\n② Purchase a collection sticker at a supermarket, convenience store, drugstore or hardware store displaying this sticker.\n③ Write the reference number you received from the Bulky Refuse Collection Centre on the sticker, stick it on the item to be collected where it can be easily seen, then place the item in the location determined during the application, by 8:30 a.m. on the day of collection (Please do not put out garbage the day before).",

    "result.monday": "Monday",
    "result.tuesday": "Tuesday",
    "result.wednesday": "Wednesday",
    "result.thursday": "Thursday",
    "result.friday": "Friday",
    "result.saturday": "Saturday",
    "result.sunday": "Sunday",

    // Register Screen
    "register.title": "User Registration",
    "register.subtitle": "Subscribe to access all features",
    "register.name": "Name",
    "register.email": "Email",
    "register.password": "Password",
    "register.confirm": "Confirm Password",
    "register.submit": "Register",
    "register.price": "Monthly fee: 200 JPY",
    "register.features": "Available features:",
    "register.feature.1": "Unlimited support",
    "register.feature.2": "Collection day reminders",
    "register.feature.3": "Region-specific sorting rules",
    "register.feature.4": "Account sharing",

    // Support Screen
    "support.title": "Support",
    "support.subtitle": "Need help? Enter your question below",
    "support.placeholder": "Type your question here...",
    "support.send": "Send",
    "support.faq": "Frequently Asked Questions",
    "support.faq.1.q": "How do I use this app?",
    "support.faq.1.a":
      "Set your address, check the collection days on the calendar, and take a photo of your trash to get sorting instructions.",
    "support.faq.2.q": "What are the benefits of paid membership?",
    "support.faq.2.a":
      "Paid members get unlimited trash sorting, collection day reminders, and region-specific sorting rules.",

    // Common
    "common.copyright": "©Bin Buddy",
    "common.main": "Main",
    "common.calendar": "Calendar",
    "common.scan": "Scan Trash",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ja");

  // ブラウザのローカルストレージから言語設定を読み込む
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "ja" || savedLanguage === "en")) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // 言語を設定し、ローカルストレージに保存する
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  // 翻訳関数
  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// カスタムフック
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
