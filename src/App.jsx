import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Brain, List, Search, ChevronRight, ChevronLeft, Volume2, History, Info, Settings, GraduationCap, ArrowRight, XCircle, Type, MessageSquare, RotateCw, Scale } from 'lucide-react';

// -----------------------------------------------------------------------------
// CSS Styles for 3D Flip Card (Injected directly to ensure compatibility)
// -----------------------------------------------------------------------------
const customStyles = `
  .flip-card-container {
    perspective: 1000px;
  }
  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  .flip-card-inner.flipped {
    transform: rotateY(180deg);
  }
  .flip-card-front, .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-radius: 0.75rem; /* rounded-xl */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  }
  .flip-card-back {
    transform: rotateY(180deg);
  }
`;

// -----------------------------------------------------------------------------
// 資料來源
// -----------------------------------------------------------------------------
const verbData = [
  { 
    verb: "abhängig sein", 
    verbTrans: "依賴...的 / 取決於...",
    prep: "von", 
    case: "D", 
    usage: "",
    forms: "war abhängig / ist abhängig gewesen",
    example: "Ob wir morgen einen Ausflug machen können, ist stark vom Wetter abhängig.",
    exampleTrans: "我們明天能否去郊遊，很大程度上取決於天氣。"
  },
  { 
    verb: "achten", 
    verbTrans: "注意 / 留心",
    prep: "auf", 
    case: "A", 
    usage: "",
    forms: "achtete / hat geachtet",
    example: "Achten Sie bitte darauf, dass alle Fenster geschlossen sind, bevor Sie das Haus verlassen.",
    exampleTrans: "請您注意，在離開房子之前確保所有窗戶都已關閉。"
  },
  { 
    verb: "anfangen", 
    verbTrans: "開始",
    prep: "mit", 
    case: "D", 
    usage: "",
    forms: "fing an / hat angefangen",
    example: "Da wir nicht viel Zeit haben, sollten wir sofort mit der Besprechung anfangen.",
    exampleTrans: "既然我們時間不多，我們應該立刻開始會議。"
  },
  { 
    verb: "antworten", 
    verbTrans: "回答",
    prep: "auf", 
    case: "A", 
    usage: "antworten auf + A (回答某問題/信件)",
    forms: "antwortete / hat geantwortet",
    example: "Herr Sauerbier will nicht auf die Fragen des Reporters antworten.",
    exampleTrans: "Sauerbier 先生不想回答記者的問題。"
  },
  { 
    verb: "sich ärgern", 
    verbTrans: "生氣 / 惱火",
    prep: "über", 
    case: "A", 
    usage: "",
    forms: "ärgerte sich / hat sich geärgert",
    example: "Mein Vater ärgert sich immer noch über den dreisten Taxifahrer.",
    exampleTrans: "我父親還在為那個粗魯的計程車司機生氣。"
  },
  { 
    verb: "aufhören", 
    verbTrans: "停止 / 結束",
    prep: "mit", 
    case: "D", 
    usage: "",
    forms: "hörte auf / hat aufgehört",
    example: "Kannst du bitte mit dem Krach aufhören?",
    exampleTrans: "你可以停止製造噪音嗎？"
  },
  { 
    verb: "aufpassen", 
    verbTrans: "注意 / 照顧",
    prep: "auf", 
    case: "A", 
    usage: "",
    forms: "passte auf / hat aufgepasst",
    example: "Könntest du bitte kurz auf meine Tasche aufpassen, während ich zur Toilette gehe?",
    exampleTrans: "在我去洗手間的時候，能請你稍微幫我看一下包包嗎？"
  },
  { 
    verb: "sich aufregen", 
    verbTrans: "激動 / 生氣",
    prep: "über", 
    case: "A", 
    usage: "",
    forms: "regte sich auf / hat sich aufgeregt",
    example: "Es lohnt sich nicht, sich über Dinge aufzuregen, die man nicht ändern kann.",
    exampleTrans: "為了無法改變的事情而激動是不值得的。"
  },
  { 
    verb: "sich bedanken", 
    verbTrans: "感謝",
    prep: "bei / für", 
    case: "D / A", 
    usage: "bei + D (向某人) / für + A (為了某事)",
    forms: "bedankte sich / hat sich bedankt",
    example: "Warum bedankst du dich nicht bei ihm für seine Hilfe?",
    exampleTrans: "你為什麼不為了他的幫忙向他道謝呢？"
  },
  { 
    verb: "beginnen", 
    verbTrans: "開始",
    prep: "mit", 
    case: "D", 
    usage: "",
    forms: "begann / hat begonnen",
    example: "Bevor wir mit dem neuen Thema beginnen, wiederholen wir kurz den Stoff der letzten Woche.",
    exampleTrans: "在開始新主題之前，我們先簡短複習上週的內容。"
  },
  { 
    verb: "sich bemühen", 
    verbTrans: "努力爭取 / 費心",
    prep: "um", 
    case: "A", 
    usage: "",
    forms: "bemühte sich / hat sich bemüht",
    example: "Cathy aus England bemüht sich sehr um eine gute Aussprache.",
    exampleTrans: "來自英國的 Cathy 非常努力練習好的發音。"
  },
  { 
    verb: "berichten", 
    verbTrans: "報導 / 報告",
    prep: "über", 
    case: "A", 
    usage: "",
    forms: "berichtete / hat berichtet",
    example: "Der Journalist berichtete ausführlich darüber, wie der Unfall passiert ist.",
    exampleTrans: "記者詳細報導了這起事故是如何發生的。"
  },
  { 
    verb: "sich beschäftigen", 
    verbTrans: "忙於... / 從事...",
    prep: "mit", 
    case: "D", 
    usage: "",
    forms: "beschäftigte sich / hat sich beschäftigt",
    example: "In seiner Freizeit beschäftigt er sich am liebsten mit dem Reparieren alter Autos.",
    exampleTrans: "在空閒時間，他最喜歡忙於修理老爺車。"
  },
  { 
    verb: "sich beschweren", 
    verbTrans: "抱怨 / 投訴",
    prep: "bei / über", 
    case: "D / A", 
    usage: "bei + D (向某人) / über + A (關於某事)",
    forms: "beschwerte sich / hat sich beschwert",
    example: "Die Schüler beschweren sich beim Lehrer über den schwierigen Mathetest.",
    exampleTrans: "學生們向老師抱怨數學考試太難。"
  },
  { 
    verb: "sich bewerben", 
    verbTrans: "申請 / 應徵",
    prep: "um", 
    case: "A", 
    usage: "",
    forms: "bewarb sich / hat sich beworben",
    example: "Nachdem sie ihr Studium abgeschlossen hatte, bewarb sie sich um eine Stelle bei BMW.",
    exampleTrans: "在她完成學業後，她申請了 BMW 的職位。"
  },
  { 
    verb: "jdn. bitten", 
    verbTrans: "請求 / 要求",
    prep: "um", 
    case: "A", 
    usage: "",
    forms: "bat / hat gebeten",
    example: "Dürfte ich dich um einen kleinen Gefallen bitten?",
    exampleTrans: "我可以請你幫個小忙嗎？"
  },
  { 
    verb: "jdm. danken", 
    verbTrans: "感謝",
    prep: "für", 
    case: "A", 
    usage: "",
    forms: "dankte / hat gedankt",
    example: "Ich danke Ihnen für Ihre schnelle Hilfe.",
    exampleTrans: "我感謝您快速的協助。"
  },
  { 
    verb: "denken", 
    verbTrans: "想 / 思念",
    prep: "an", 
    case: "A", 
    usage: "",
    forms: "dachte / hat gedacht",
    example: "Im Urlaub musste ich täglich an dich denken.",
    exampleTrans: "度假時我每天都不得不想到你。"
  },
  { 
    verb: "diskutieren", 
    verbTrans: "討論",
    prep: "mit / über", 
    case: "D / A", 
    usage: "mit + D (跟某人) / über + A (關於某事)",
    forms: "diskutierte / hat diskutiert",
    example: "Es ist sinnlos, mit ihm über Politik zu diskutieren, da er seine Meinung nie ändert.",
    exampleTrans: "跟他討論政治是沒用的，因為他從不改變想法。"
  },
  { 
    verb: "sich ekeln", 
    verbTrans: "感到噁心 / 厭惡",
    prep: "vor", 
    case: "D", 
    usage: "",
    forms: "ekelte sich / hat sich geekelt",
    example: "Ekelt sich deine Frau auch so sehr vor Spinnen?",
    exampleTrans: "你的太太也這麼討厭蜘蛛嗎？"
  },
  { 
    verb: "jdn. einladen", 
    verbTrans: "邀請",
    prep: "zu", 
    case: "D", 
    usage: "",
    forms: "lud ein / hat eingeladen",
    example: "Lädst du Evelyne auch zu deiner Geburtstagsparty ein?",
    exampleTrans: "你也會邀請 Evelyne 來你的生日派對嗎？"
  },
  { 
    verb: "sich entscheiden", 
    verbTrans: "決定",
    prep: "für", 
    case: "A", 
    usage: "für + A (選擇某選項) / gegen + A (不選某選項)",
    forms: "entschied sich / hat sich entschieden",
    example: "Er hat sich dafür entschieden, Medizin zu studieren, obwohl seine Eltern dagegen waren.",
    exampleTrans: "儘管父母反對，他還是決定攻讀醫學。"
  },
  { 
    verb: "sich entschuldigen", 
    verbTrans: "道歉",
    prep: "bei / für", 
    case: "D / A", 
    usage: "bei + D (向某人) / für + A (為了某事)",
    forms: "entschuldigte sich / hat sich entschuldigt",
    example: "Wofür soll ich mich eigentlich bei dir entschuldigen?",
    exampleTrans: "我到底該為了什麼向你道歉？"
  },
  { 
    verb: "sich erholen", 
    verbTrans: "休養 / 復原",
    prep: "von", 
    case: "D", 
    usage: "",
    forms: "erholte sich / hat sich erholt",
    example: "Du musst dich auch wirklich vom Stress der letzten Wochen erholen.",
    exampleTrans: "你真的必須從過去幾週的壓力中恢復過來。"
  },
  { 
    verb: "sich erinnern", 
    verbTrans: "記得 / 回憶起",
    prep: "an", 
    case: "A", 
    usage: "",
    forms: "erinnerte sich / hat sich erinnert",
    example: "Ich kenne ihn, aber ich erinnere mich nicht an seinen Namen.",
    exampleTrans: "我認識他，但我記不起他的名字。"
  },
  { 
    verb: "sich erkundigen", 
    verbTrans: "詢問 / 打聽",
    prep: "bei / nach", 
    case: "D", 
    usage: "bei + D (向某人) / nach + D (詢問某事)",
    forms: "erkundigte sich / hat sich erkundigt",
    example: "Ein Kunde ruft an und erkundigt sich nach den Öffnungszeiten.",
    exampleTrans: "一位顧客打電話來詢問營業時間。"
  },
  { 
    verb: "erzählen", 
    verbTrans: "敘述 / 講述",
    prep: "von", 
    case: "D", 
    usage: "",
    forms: "erzählte / hat erzählt",
    example: "Peter erzählt von seinem neuen Job, aber keiner hört ihm zu.",
    exampleTrans: "Peter 講述著他上次的會議，但沒人在聽。"
  },
  { 
    verb: "fragen", 
    verbTrans: "問",
    prep: "nach", 
    case: "D", 
    usage: "fragen nach + D (詢問關於...)",
    forms: "fragte / hat gefragt",
    example: "Ein Herr mit Hut fragt nach unserem Chef.",
    exampleTrans: "一位戴帽子的先生指名要找我們老闆。"
  },
  { 
    verb: "sich freuen (未來)", 
    verbTrans: "期待 (未來)",
    prep: "auf", 
    case: "A", 
    usage: "auf + A (期待尚未發生的事)",
    forms: "freute sich / hat sich gefreut",
    example: "Nächste Woche fahre ich nach Prag. Ich freue mich schon sehr darauf.",
    exampleTrans: "下週我要去布拉格。我非常期待。"
  },
  { 
    verb: "sich freuen (現在/過去)", 
    verbTrans: "感到高興 (現在/過去)",
    prep: "über", 
    case: "A", 
    usage: "über + A (對已發生/現存的事感到高興)",
    forms: "freute sich / hat sich gefreut",
    example: "Vielen Dank für das Geschenk! Ich habe mich sehr darüber gefreut!",
    exampleTrans: "感謝您的禮物！我對此感到非常高興！"
  },
  { 
    verb: "sich fürchten", 
    verbTrans: "害怕 / 恐懼",
    prep: "vor", 
    case: "D", 
    usage: "",
    forms: "fürchtete sich / hat sich gefürchtet",
    example: "Magdalena fürchtet sich vor kleinen Tieren.",
    exampleTrans: "Magdalena 害怕小動物。"
  },
  { 
    verb: "gehören", 
    verbTrans: "屬於",
    prep: "zu", 
    case: "D", 
    usage: "",
    forms: "gehörte / hat gehört",
    example: "Gehört der große Schäferhund zu dir?",
    exampleTrans: "這隻大狼犬是你的嗎？(屬於你嗎)"
  },
  { 
    verb: "sich gewöhnen", 
    verbTrans: "習慣於...",
    prep: "an", 
    case: "A", 
    usage: "",
    forms: "gewöhnte sich / hat sich gewöhnt",
    example: "Ich kann mich hier in Deutschland einfach nicht an das wechselhafte Wetter gewöhnen.",
    exampleTrans: "在德國這裡，我就是無法習慣這多變的天氣。"
  },
  { 
    verb: "glauben", 
    verbTrans: "相信",
    prep: "an", 
    case: "A", 
    usage: "",
    forms: "glaubte / hat geglaubt",
    example: "Viele Menschen glauben an die Gerechtigkeit.",
    exampleTrans: "許多人相信正義。"
  },
  { 
    verb: "gratulieren", 
    verbTrans: "祝賀 / 恭喜",
    prep: "zu", 
    case: "D", 
    usage: "",
    forms: "gratulierte / hat gratuliert",
    example: "Ich möchte dir ganz herzlich dazu gratulieren, dass du die Prüfung bestanden hast.",
    exampleTrans: "我衷心祝賀你通過了考試。"
  },
  { 
    verb: "hoffen", 
    verbTrans: "希望",
    prep: "auf", 
    case: "A", 
    usage: "",
    forms: "hoffte / hat gehofft",
    example: "Bald machen wir Urlaub in Dänemark. Wir hoffen so auf gutes Wetter!",
    exampleTrans: "我們很快要去丹麥度假。我們非常希望能有好天氣！"
  },
  { 
    verb: "sich interessieren", 
    verbTrans: "感興趣",
    prep: "für", 
    case: "A", 
    usage: "",
    forms: "interessierte sich / hat sich interessiert",
    example: "Mein Sohn interessiert sich nur noch für Autos.",
    exampleTrans: "我的兒子現在只對汽車感興趣。"
  },
  { 
    verb: "kämpfen", 
    verbTrans: "戰鬥 / 爭取",
    prep: "für", 
    case: "A", 
    usage: "für + A (為...而戰) / gegen + A (對抗...)",
    forms: "kämpfte / hat gekämpft",
    example: "Man muss für mehr Gerechtigkeit kämpfen.",
    exampleTrans: "人們必須為了更多的正義而奮鬥。"
  },
  { 
    verb: "sich konzentrieren", 
    verbTrans: "專注於...",
    prep: "auf", 
    case: "A", 
    usage: "",
    forms: "konzentrierte sich / hat sich konzentriert",
    example: "Ich kann mich auf keinen Vortrag konzentrieren.",
    exampleTrans: "我無法專注在任何演講上。"
  },
  { 
    verb: "sich kümmern", 
    verbTrans: "照顧 / 處理",
    prep: "um", 
    case: "A", 
    usage: "",
    forms: "kümmerte sich / hat sich gekümmert",
    example: "Philipp kümmert sich um seinen kranken Vater.",
    exampleTrans: "Philipp 正在照顧他生病的父親。"
  },
  { 
    verb: "lachen", 
    verbTrans: "笑 / 嘲笑",
    prep: "über", 
    case: "A", 
    usage: "",
    forms: "lachte / hat gelacht",
    example: "Alle haben darüber gelacht, wie der Clown über seine eigenen Füße gestolpert ist.",
    exampleTrans: "大家都嘲笑那個小丑是如何被自己的腳絆倒的。"
  },
  { 
    verb: "leiden", 
    verbTrans: "受苦 / 患病",
    prep: "an / unter", 
    case: "D", 
    usage: "an + D (患...病) / unter + D (因...處境而受苦)",
    forms: "litt / hat gelitten",
    example: "Viele Menschen leiden darunter, dass sie in der Großstadt zu viel Stress haben.",
    exampleTrans: "許多人深受大城市壓力過大之苦 (leiden unter)。"
  },
  { 
    verb: "nachdenken", 
    verbTrans: "思考 / 考慮",
    prep: "über", 
    case: "A", 
    usage: "",
    forms: "dachte nach / hat nachgedacht",
    example: "Du bist so schweigsam - worüber denkst du denn die ganze Zeit nach?",
    exampleTrans: "你這麼安靜——你整段時間都在想什麼呢？"
  },
  { 
    verb: "protestieren", 
    verbTrans: "抗議",
    prep: "gegen", 
    case: "A", 
    usage: "",
    forms: "protestierte / hat protestiert",
    example: "Die Bürger protestieren dagegen, dass der Park in einen Parkplatz verwandelt wird.",
    exampleTrans: "市民抗議將公園變成停車場。"
  },
  { 
    verb: "rechnen", 
    verbTrans: "預期 / 指望",
    prep: "mit", 
    case: "D", 
    usage: "",
    forms: "rechnete / hat gerechnet",
    example: "Am Wochenende muss man mit Regen rechnen.",
    exampleTrans: "週末必須預期會下雨。"
  },
  { 
    verb: "schmecken", 
    verbTrans: "嚐起來有...味道",
    prep: "nach", 
    case: "D", 
    usage: "",
    forms: "schmeckte / hat geschmeckt",
    example: "Das Essen schmeckt nach Spülmittel.",
    exampleTrans: "這食物嚐起來有洗碗精的味道。"
  },
  { 
    verb: "schreiben", 
    verbTrans: "寫信給...",
    prep: "an", 
    case: "A", 
    usage: "an + A (寫給某人)",
    forms: "schrieb / hat geschrieben",
    example: "Ich werde an die Organisatoren schreiben.",
    exampleTrans: "我將會寫信給主辦單位。"
  },
  { 
    verb: "sorgen", 
    verbTrans: "導致 / 照顧",
    prep: "für", 
    case: "A", 
    usage: "",
    forms: "sorgte / hat gesorgt",
    example: "Sie sollen dafür sorgen, mir ein wirklich gutes Hotelzimmer zu geben.",
    exampleTrans: "他們應該確保給我一間真的很棒的飯店房間。"
  },
  { 
    verb: "sprechen", 
    verbTrans: "說話 / 交談",
    prep: "mit / über", 
    case: "D / A", 
    usage: "mit + D (跟某人) / über + A (關於某事)",
    forms: "sprach / hat gesprochen",
    example: "Susan spricht stundenlang mit ihrem Freund am Telefon.",
    exampleTrans: "Susan 跟她男朋友講電話講了好幾個小時。"
  },
  { 
    verb: "streiten", 
    verbTrans: "爭吵",
    prep: "mit", 
    case: "D", 
    usage: "mit + D (跟某人爭吵)",
    forms: "stritt / hat gestritten",
    example: "Hans streitet laut mit seinem Kollegen.",
    exampleTrans: "Hans 大聲地跟他的同事吵架。"
  },
  { 
    verb: "teilnehmen", 
    verbTrans: "參加",
    prep: "an", 
    case: "D", 
    usage: "",
    forms: "nahm teil / hat teilgenommen",
    example: "Nimmst du auch an der Exkursion am Samstag teil?",
    exampleTrans: "你也會參加週六的戶外教學嗎？"
  },
  { 
    verb: "träumen", 
    verbTrans: "夢想 / 夢見",
    prep: "von", 
    case: "D", 
    usage: "",
    forms: "träumte / hat geträumt",
    example: "Familie Manns träumt von einem eigenen Haus.",
    exampleTrans: "Manns 一家人夢想擁有一棟自己的房子。"
  },
  { 
    verb: "sich unterhalten", 
    verbTrans: "聊天 / 談話",
    prep: "mit / über", 
    case: "D / A", 
    usage: "mit + D (跟某人) / über + A (關於某事)",
    forms: "unterhielt sich / hat sich unterhalten",
    example: "Habe ich mich auch schon mit Susana unterhalten.",
    exampleTrans: "我也已經跟 Susana 聊過了。"
  },
  { 
    verb: "sich verabreden", 
    verbTrans: "約定 / 約會",
    prep: "mit", 
    case: "D", 
    usage: "",
    forms: "verabredete sich / hat sich verabredet",
    example: "Gestern hat sie sich mit diesem Carlos verabredet.",
    exampleTrans: "昨天她跟那個叫 Carlos 的人約會了。"
  },
  { 
    verb: "sich verlassen", 
    verbTrans: "信賴 / 依靠",
    prep: "auf", 
    case: "A", 
    usage: "",
    forms: "verließ sich / hat sich verlassen",
    example: "Du kannst dich bestimmt auf sie verlassen.",
    exampleTrans: "你一定可以信賴她。"
  },
  { 
    verb: "sich verlieben", 
    verbTrans: "愛上...",
    prep: "in", 
    case: "A", 
    usage: "",
    forms: "verliebte sich / hat sich verliebt",
    example: "Gerd ist in ein sehr hübsches Mädchen verliebt.",
    exampleTrans: "Gerd 愛上了一位非常漂亮的女孩。"
  },
  { 
    verb: "etwas verstehen", 
    verbTrans: "懂 / 了解 (領域)",
    prep: "von", 
    case: "D", 
    usage: "",
    forms: "verstand / hat verstanden",
    example: "Schließlich verstehst du etwas von Frauen!",
    exampleTrans: "畢竟你還是懂女人的！"
  },
  { 
    verb: "sich vorbereiten", 
    verbTrans: "準備",
    prep: "auf", 
    case: "A", 
    usage: "",
    forms: "bereitere sich vor / hat sich vorbereitet",
    example: "Ich muss mich auf eine Prüfung vorbereiten.",
    exampleTrans: "我必須準備考試。"
  },
  { 
    verb: "warten", 
    verbTrans: "等待",
    prep: "auf", 
    case: "A", 
    usage: "",
    forms: "wartete / hat gewartet",
    example: "Warum wartest du nicht auf deinen Bruder?",
    exampleTrans: "你為什麼不等你的兄弟？"
  },
  { 
    verb: "sich wenden", 
    verbTrans: "求助 / 轉向",
    prep: "an", 
    case: "A", 
    usage: "sich wenden an + A (向某人求助/諮詢)",
    forms: "wandte sich / hat sich gewandt",
    example: "Wenn Sie Fragen haben, können Sie sich jederzeit an unseren Kundenservice wenden.",
    exampleTrans: "如果您有問題，隨時可以聯繫我們的客戶服務。"
  },
  { 
    verb: "sich wundern", 
    verbTrans: "感到驚訝",
    prep: "über", 
    case: "A", 
    usage: "",
    forms: "wunderte sich / hat sich gewundert",
    example: "Manchmal wundere ich mich schon ein bisschen über die Österreicher.",
    exampleTrans: "有時候我對奧地利人感到有點驚訝。"
  },
  { 
    verb: "zweifeln", 
    verbTrans: "懷疑",
    prep: "an", 
    case: "D", 
    usage: "",
    forms: "zweifelte / hat gezweifelt",
    example: "Niemand zweifelt daran, dass sie die beste Kandidatin für den Job ist.",
    exampleTrans: "沒人懷疑她是這份工作的最佳人選。"
  }
];

const PREPOSITIONS = [
  "an", "auf", "aus", "bei", "durch", "für", "gegen", "in", 
  "mit", "nach", "ohne", "um", "unter", "über", "von", "zu"
];

// Helper: Text to Speech
const speak = (text, voice = null, rate = 0.9) => {
  if (!window.speechSynthesis) return;
  
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  
  if (voice) {
    utterance.voice = voice;
  }
  
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
};

// Helper: LocalStorage for Scores
const STORAGE_KEY = 'german_verb_quiz_scores';

// -----------------------------------------------------------------------------
// Component: Flashcards
// -----------------------------------------------------------------------------
const Flashcards = ({ data, selectedVoice, speechRate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledData, setShuffledData] = useState([]);

  useEffect(() => {
    setShuffledData([...data].sort(() => Math.random() - 0.5));
  }, [data]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % shuffledData.length);
    }, 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + shuffledData.length) % shuffledData.length);
    }, 200);
  };

  const playAudio = (e, text) => {
    e.stopPropagation();
    speak(text, selectedVoice, speechRate);
  };

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  if (shuffledData.length === 0) return <div>Loading...</div>;

  const currentCard = shuffledData[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto min-h-[480px]">
      <div 
        className="w-full h-96 cursor-pointer group relative flip-card-container"
        onClick={handleFlip} // Make the entire container clickable for flipping
      >
        <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div className="flip-card-front bg-white border-2 border-amber-400 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-sm text-gray-500 uppercase tracking-wider mb-2">Verb (動詞)</span>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{currentCard.verb}</h3>
            
            <p className="text-lg text-amber-600 font-medium mb-8">{currentCard.verbTrans}</p>

            <button 
              onClick={(e) => playAudio(e, currentCard.verb)}
              className="p-3 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-110 transition-all mt-2 shadow-sm border border-amber-100 mb-8 z-10"
              title="播放發音"
            >
              <Volume2 size={28} />
            </button>

            {/* 提示點擊 */}
            <div className="mt-auto text-amber-400 text-sm opacity-60">
               (點擊卡片翻轉)
            </div>
          </div>
          
          {/* Back */}
          <div 
            className="flip-card-back bg-amber-50 border-2 border-amber-500 flex flex-col items-center justify-center p-5 text-center cursor-pointer"
          >
            {/* Verb + Prep */}
            <h3 className="text-2xl font-bold text-amber-800 mb-1 flex items-center justify-center gap-2 mt-4">
              <span>{currentCard.verb} <span className="text-amber-600 underline decoration-2">{currentCard.prep}</span></span>
              <button 
                onClick={(e) => playAudio(e, `${currentCard.verb} ${currentCard.prep}`)}
                className="p-1 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors z-10"
                title="播放片語發音"
              >
                <Volume2 size={16} />
              </button>
            </h3>
            
            <div className="inline-block bg-amber-200 text-amber-900 px-3 py-1 rounded-full font-bold text-sm mb-2">
              + {currentCard.case === 'A' ? 'Akkusativ' : currentCard.case === 'D' ? 'Dativ' : currentCard.case}
            </div>
            
            {/* Usage Explanation (if exists) */}
            {currentCard.usage && (
               <div className="text-xs text-amber-800 bg-amber-100/50 px-2 py-1 rounded mb-2 w-full">
                 <span className="font-bold">用法：</span>{currentCard.usage}
               </div>
            )}

            {/* Example (Complex) */}
            <div className="bg-white/60 p-2 rounded-lg w-full mb-2 overflow-y-auto max-h-[100px] flex-1">
              <div className="flex items-start justify-center gap-2 mb-1">
                <p className="text-sm font-medium text-gray-800 italic leading-snug text-left px-2">"{currentCard.example}"</p>
                <button 
                  onClick={(e) => playAudio(e, currentCard.example)}
                  className="shrink-0 text-amber-600 hover:text-amber-800 z-10"
                  title="播放例句"
                >
                  <Volume2 size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500 px-2 text-left">{currentCard.exampleTrans}</p>
            </div>

            {/* Tense Info (Full Display) */}
            <div className="mt-auto border-t border-amber-200/50 pt-2 w-full">
              <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Präteritum / Perfekt</span>
              <div className="flex items-center justify-center gap-2 bg-white/50 py-1 px-2 rounded text-xs font-mono text-gray-700">
                <span>{currentCard.forms}</span>
                <button 
                  onClick={(e) => playAudio(e, currentCard.forms)}
                  className="text-amber-600 hover:text-amber-800 z-10"
                  title="播放時態變化"
                >
                  <Volume2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <button 
          onClick={handlePrev}
          className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <span className="text-gray-500 font-medium">
          {currentIndex + 1} / {shuffledData.length}
        </span>
        <button 
          onClick={handleNext}
          className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Component: Quiz
// -----------------------------------------------------------------------------
const Quiz = ({ data, selectedVoice, speechRate }) => {
  const [quizMode, setQuizMode] = useState('word'); // 'word' | 'sentence' | 'case'
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // Save score logic
  const saveScore = (newScore) => {
    const today = new Date().toLocaleDateString();
    let modeLabel = '單字';
    if (quizMode === 'sentence') modeLabel = '例句';
    if (quizMode === 'case') modeLabel = '格位';
    
    const newEntry = { date: today, score: newScore, time: new Date().toLocaleTimeString(), mode: modeLabel };
    const newHistory = [newEntry, ...history].slice(0, 5); // Keep last 5
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const generateQuestion = () => {
    const randomVerb = data[Math.floor(Math.random() * data.length)];
    
    // Case Mode Logic
    if (quizMode === 'case') {
      // Find verbs where case is clear A or D (avoid mixed A/D for simple quiz)
      // Parse the case: if it contains A and D (like "D / A"), split it based on prep if possible, 
      // but for simplicity, let's look for simple ones or pick one interpretation
      
      // Let's create a simpler question: What case follows this Verb + Prep?
      // If data.case is "D", correct is Dativ. If "A", Akkusativ.
      // If "D / A", we might need to skip or present specific context. Let's try to parse.
      
      const rawCase = randomVerb.case;
      const rawPrep = randomVerb.prep;
      
      let correctAns = "";
      let questionTitle = `${randomVerb.verb} + ${rawPrep}`;
      
      // Handle simple cases
      if (rawCase === 'A') correctAns = 'Akkusativ';
      else if (rawCase === 'D') correctAns = 'Dativ';
      else {
        // Complex case "bei / für" -> "D / A"
        // Let's pick one randomly for the question
        const preps = rawPrep.split('/').map(p => p.trim());
        const cases = rawCase.split('/').map(c => c.trim());
        
        if (preps.length === cases.length) {
           const idx = Math.floor(Math.random() * preps.length);
           questionTitle = `${randomVerb.verb} + ${preps[idx]}`;
           const c = cases[idx];
           if (c.includes('A')) correctAns = 'Akkusativ';
           else if (c.includes('D')) correctAns = 'Dativ';
        } else {
           // Fallback or skip if data format is weird, just regenerate
           // But effectively, let's just default to asking the first one if we can't parse
           if (rawCase.includes('A')) correctAns = 'Akkusativ'; // Fallback
           else correctAns = 'Dativ';
        }
      }
      
      // Ensure we have a valid correct answer, otherwise regenerate (recursive but simple here)
      if (!correctAns) {
         return generateQuestion();
      }

      setCurrentQuestion({ ...randomVerb, displayQuestion: questionTitle, correctAnswer: correctAns });
      setOptions(['Akkusativ', 'Dativ']);
      setSelectedOption(null);
      setShowResult(false);
      return;
    }

    // Word & Sentence Mode Logic
    const correctPreps = randomVerb.prep.split('/').map(s => s.trim());
    const distractors = [];
    while (distractors.length < 3) {
      const randP = PREPOSITIONS[Math.floor(Math.random() * PREPOSITIONS.length)];
      if (!correctPreps.includes(randP) && !distractors.includes(randP)) {
        distractors.push(randP);
      }
    }
    const correctOption = correctPreps[0];
    const allOptions = [correctOption, ...distractors].sort(() => Math.random() - 0.5);

    setCurrentQuestion(randomVerb);
    setOptions(allOptions);
    setSelectedOption(null);
    setShowResult(false);
  };

  useEffect(() => {
    generateQuestion();
  }, [quizMode]);

  const handleOptionClick = (option) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);

    let isCorrect = false;
    
    if (quizMode === 'case') {
      isCorrect = option === currentQuestion.correctAnswer;
    } else {
      const correctPreps = currentQuestion.prep.split('/').map(s => s.trim());
      isCorrect = correctPreps.includes(option);
    }
    
    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      setStreak(streak + 1);
      if (newScore % 5 === 0) saveScore(newScore);
    } else {
      setStreak(0);
      if (score > 0) saveScore(score);
      setScore(0); 
    }
  };

  if (!currentQuestion) return <div>Loading Quiz...</div>;

  // Masking logic for Word/Sentence modes
  const prep = currentQuestion.prep ? currentQuestion.prep.split('/')[0].trim() : "";
  const daPrep = "da" + (["a", "e", "i", "o", "u"].includes(prep[0]) ? "r" : "") + prep;
  
  let maskedExample = currentQuestion.example || "";
  if (quizMode !== 'case') {
    const regex = new RegExp(`\\b(${prep}|${daPrep})\\b`, 'gi');
    maskedExample = maskedExample.replace(regex, "___");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mode Switcher */}
      <div className="flex justify-center mb-6 bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <button
          onClick={() => { setQuizMode('word'); setScore(0); setStreak(0); }}
          className={`flex-1 py-2 px-2 text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1 ${quizMode === 'word' ? 'bg-amber-100 text-amber-800' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Type size={14} /> 單字
        </button>
        <button
          onClick={() => { setQuizMode('sentence'); setScore(0); setStreak(0); }}
          className={`flex-1 py-2 px-2 text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1 ${quizMode === 'sentence' ? 'bg-amber-100 text-amber-800' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <MessageSquare size={14} /> 例句
        </button>
        <button
          onClick={() => { setQuizMode('case'); setScore(0); setStreak(0); }}
          className={`flex-1 py-2 px-2 text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1 ${quizMode === 'case' ? 'bg-amber-100 text-amber-800' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Scale size={14} /> 格位
        </button>
      </div>

      {/* Score Board */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase font-bold">Current Score</span>
            <span className="text-2xl font-bold text-amber-600">{score}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400 uppercase font-bold">Streak</span>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-orange-500">{streak}</span>
              <span className="text-orange-400">🔥</span>
            </div>
          </div>
        </div>
        
        {/* History (Mini) */}
        {history.length > 0 && (
          <div className="border-t border-gray-100 pt-3 mt-2">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <History size={12} />
              <span>最近紀錄</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {history.map((h, i) => (
                <span key={i} className="inline-flex flex-col bg-gray-50 px-2 py-1 rounded border border-gray-100 text-xs text-center min-w-[70px]">
                  <span className="font-bold text-gray-700">{h.score}分</span>
                  <span className="text-[9px] text-gray-400">{h.mode}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
        <div className="text-center mb-8 relative z-10">
          <p className="text-gray-500 mb-2">
            {quizMode === 'word' ? 'Welche Präposition passt?' : 
             quizMode === 'sentence' ? 'Ergänzen Sie den Satz:' : 'Welcher Kasus? (哪一個格位?)'}
          </p>
          
          {quizMode === 'word' && (
            <div className="flex flex-col items-center justify-center gap-1 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold text-gray-800">{currentQuestion.verb}</h2>
                <button onClick={() => speak(currentQuestion.verb, selectedVoice, speechRate)} className="text-amber-500 hover:text-amber-600">
                  <Volume2 size={24} />
                </button>
              </div>
              <p className="text-sm text-gray-500 font-medium">({currentQuestion.verbTrans})</p>
            </div>
          )}

          {quizMode === 'sentence' && (
             <div className="mb-6">
               <div className="bg-amber-50 p-4 rounded-xl text-lg text-gray-800 font-medium leading-relaxed border-l-4 border-amber-400 text-left">
                 "{maskedExample}"
               </div>
               <p className="text-xs text-gray-400 mt-2 text-right">請選擇正確的介系詞填入空格</p>
             </div>
          )}

          {quizMode === 'case' && (
            <div className="flex flex-col items-center justify-center gap-1 mb-4">
              <h2 className="text-2xl font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded-lg">
                {currentQuestion.displayQuestion}
              </h2>
              <p className="text-sm text-gray-400 mt-2">接 Akkusativ (A) 還是 Dativ (D) ?</p>
            </div>
          )}

          {/* Hint Context for Word Mode */}
          {quizMode === 'word' && (
             <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-400 italic leading-relaxed opacity-50">
               (提示: 看例句) "{maskedExample}"
             </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
          {options.map((opt, idx) => {
            // Determine correctness logic based on mode
            let isCorrect = false;
            let isSelected = selectedOption === opt;

            if (quizMode === 'case') {
               isCorrect = opt === currentQuestion.correctAnswer;
            } else {
               const correctPreps = currentQuestion.prep.split('/').map(s => s.trim());
               isCorrect = correctPreps.includes(opt);
            }
            
            let btnClass = "p-4 rounded-lg font-bold text-lg transition-all border-2 ";
            
            if (showResult) {
              if (isCorrect) {
                btnClass += "bg-green-100 border-green-500 text-green-700";
              } else if (isSelected && !isCorrect) {
                btnClass += "bg-red-100 border-red-500 text-red-700";
              } else {
                btnClass += "bg-gray-50 border-gray-100 text-gray-400 opacity-50";
              }
            } else {
              btnClass += "bg-white border-gray-200 hover:border-amber-400 hover:bg-amber-50 text-gray-700 cursor-pointer";
            }

            return (
              <button 
                key={idx}
                onClick={() => handleOptionClick(opt)}
                className={btnClass}
                disabled={showResult}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 relative z-10">
            <div className={`p-4 rounded-lg mb-4 text-center ${
              (quizMode === 'case' && selectedOption === currentQuestion.correctAnswer) ||
              (quizMode !== 'case' && currentQuestion.prep.includes(selectedOption))
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              <p className="font-bold mb-1">
                {(quizMode === 'case' && selectedOption === currentQuestion.correctAnswer) ||
                 (quizMode !== 'case' && currentQuestion.prep.includes(selectedOption))
                 ? 'Richtig! (正確)' : 'Leider falsch (答錯了)'}
              </p>
              
              <div className="flex flex-col items-center mt-2">
                 <p className="text-lg mb-1">
                  {currentQuestion.verb} <span className="font-bold underline">{currentQuestion.prep}</span>
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (+ {currentQuestion.case})
                  </span>
                 </p>
                 <button onClick={() => speak(currentQuestion.example, selectedVoice, speechRate)} className="text-sm flex items-center gap-1 opacity-80 hover:opacity-100 bg-white/50 px-2 py-1 rounded-full">
                    <Volume2 size={14} /> 聽例句
                 </button>
              </div>
            </div>
            <button 
              onClick={generateQuestion}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
            >
              Nächste Frage (下一題) <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Component: Reference List (With Tense Expansion)
// -----------------------------------------------------------------------------
const ReferenceList = ({ data, selectedVoice, speechRate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.verb.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.verbTrans.includes(searchTerm) || 
      item.prep.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const toggleExpand = (idx) => {
    setExpandedId(expandedId === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="搜尋... (可輸入德文或中文，如 'warten' 或 '等待')" 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-shadow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Verb & Prep</th>
                <th className="p-4 font-semibold">Bedeutung (意思)</th>
                <th className="p-4 font-semibold">Kasus</th>
                <th className="p-4 font-semibold w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item, index) => (
                <React.Fragment key={index}>
                  <tr 
                    onClick={() => toggleExpand(index)}
                    className="hover:bg-amber-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-800 flex items-center gap-2">
                        {item.verb} <span className="text-amber-600 font-bold">{item.prep}</span>
                        <Volume2 
                          size={16} 
                          className="text-gray-300 hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => { e.stopPropagation(); speak(item.verb, selectedVoice, speechRate); }} 
                        />
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {item.verbTrans}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                        item.case.includes('A') && item.case.includes('D') ? 'bg-purple-100 text-purple-700' :
                        item.case.includes('A') ? 'bg-blue-100 text-blue-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.case}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {expandedId === index ? <ChevronLeft className="-rotate-90" size={20}/> : <ChevronRight size={20}/>}
                    </td>
                  </tr>
                  
                  {/* Expanded Detail View */}
                  {expandedId === index && (
                    <tr className="bg-amber-50/30">
                      <td colSpan="4" className="p-4 pl-6 border-b border-gray-100">
                        <div className="grid grid-cols-1 gap-4 text-sm">
                          {/* Usage Highlight */}
                          {item.usage && (
                            <div className="bg-orange-100 text-orange-800 p-2 rounded border border-orange-200 flex items-center gap-2">
                              <Info size={16} />
                              <span className="font-bold">用法解析：</span> {item.usage}
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Stammformen (時態)</span>
                              <div className="text-gray-700 font-mono bg-white p-2 rounded border border-gray-200">
                                {item.forms}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Beispiel (例句)</span>
                              <div className="bg-white p-2 rounded border border-gray-200">
                                <div className="flex justify-between items-start">
                                  <p className="text-gray-800 italic mb-1 text-left">{item.example}</p>
                                  <button onClick={() => speak(item.example, selectedVoice, speechRate)} className="text-amber-500 hover:text-amber-700 shrink-0 ml-2">
                                    <Volume2 size={16} />
                                  </button>
                                </div>
                                <p className="text-gray-500 text-xs text-left">{item.exampleTrans}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Component: Grammatik (New Feature)
// -----------------------------------------------------------------------------
const Grammatik = ({ selectedVoice, speechRate }) => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <GraduationCap className="text-amber-500" />
          Grammatik: Wo- & Da-
        </h2>
        <p className="text-gray-500 mt-2">如何正確使用 Worauf, Darauf 等代詞副詞</p>
      </div>

      {/* Section 1: Wo(r) + Präposition */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        <div className="bg-amber-100 p-4 border-b border-amber-200">
          <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
            1. 疑問詞：Wo(r) + Präposition
          </h3>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-4">當我們想針對「介系詞受詞」提問時，要區分是 <strong className="text-red-500">人 (Person)</strong> 還是 <strong className="text-blue-500">物/事 (Sache)</strong>。</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Case: Person */}
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                <span className="bg-red-200 rounded-full w-6 h-6 flex items-center justify-center text-xs">A</span>
                針對「人」 (Person)
              </h4>
              <p className="text-sm text-gray-600 mb-2">使用 <strong>Präposition + 疑問代詞 (wen/wem)</strong></p>
              <div className="bg-white p-3 rounded border border-red-100 text-sm">
                <p className="mb-1 font-mono text-gray-800">Auf <span className="text-red-600 font-bold">wen</span> wartest du?</p>
                <p className="text-gray-500 text-xs">你在等誰？ (Akkusativ)</p>
                <div className="my-2 border-t border-gray-100"></div>
                <p className="mb-1 font-mono text-gray-800">Mit <span className="text-red-600 font-bold">wem</span> sprichst du?</p>
                <p className="text-gray-500 text-xs">你在跟誰說話？ (Dativ)</p>
              </div>
            </div>

            {/* Case: Sache */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                 <span className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs">B</span>
                針對「事/物」 (Sache)
              </h4>
              <p className="text-sm text-gray-600 mb-2">使用 <strong>Wo(r) + Präposition</strong></p>
              <div className="bg-white p-3 rounded border border-blue-100 text-sm">
                <p className="mb-1 font-mono text-gray-800"><span className="text-blue-600 font-bold">Worauf</span> wartest du?</p>
                <p className="text-gray-500 text-xs">你在等什麼？ (wo + r + auf)</p>
                <div className="my-2 border-t border-gray-100"></div>
                <p className="mb-1 font-mono text-gray-800"><span className="text-blue-600 font-bold">Womit</span> fährst du?</p>
                <p className="text-gray-500 text-xs">你搭什麼交通工具？ (wo + mit)</p>
              </div>
              <p className="text-xs text-blue-400 mt-2 italic">* 如果介系詞以母音開頭 (如 auf, über)，中間要加 "r"。</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Da(r) + Präposition */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-green-100 p-4 border-b border-green-200">
          <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
            2. 代名詞：Da(r) + Präposition
          </h3>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-4">當我們要指代前面提過的「事情」或「整句話」時使用。不能用來指人！</p>
          
          <div className="space-y-4">
            {/* Example 1 */}
            <div className="flex flex-col md:flex-row gap-4 items-start bg-gray-50 p-4 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">指代名詞 (Nomen):</p>
                <p className="font-medium text-gray-800">
                  Er hat ein neues Auto. Er freut sich <span className="text-green-600 font-bold">darüber</span>.
                </p>
                <p className="text-xs text-gray-500 mt-1">他有輛新車。他對<span className="underline">這件事(車)</span>感到高興。</p>
              </div>
              <ArrowRight className="hidden md:block text-gray-300 mt-4" />
              <div className="md:w-1/3 text-xs text-gray-500 bg-white p-2 rounded border border-gray-200">
                Darüber = Über das Auto
              </div>
            </div>

            {/* Example 2 */}
            <div className="flex flex-col md:flex-row gap-4 items-start bg-gray-50 p-4 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">指代子句 (Nebensatz):</p>
                <p className="font-medium text-gray-800">
                  Ich warte <span className="text-green-600 font-bold">darauf</span>, dass der Bus kommt.
                </p>
                <p className="text-xs text-gray-500 mt-1">我在等待<span className="underline">公車來這件事</span>。</p>
              </div>
              <ArrowRight className="hidden md:block text-gray-300 mt-4" />
              <div className="md:w-1/3 text-xs text-gray-500 bg-white p-2 rounded border border-gray-200">
                Darauf = dass der Bus kommt
              </div>
            </div>
          </div>
          
           <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded text-sm text-yellow-800 flex gap-2">
             <Info className="shrink-0" size={16} />
             <p>注意：Da(r)- 結構只能指代「事物」。如果是人，必須使用介系詞 + 代名詞 (如: auf ihn, mit ihr)。</p>
           </div>

        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Component: Voice Settings
// -----------------------------------------------------------------------------
const VoiceSettings = ({ voices, selectedVoice, setSelectedVoice, speechRate, setSpeechRate, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="text-amber-500" /> 語音設定
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Voice Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">選擇發音人聲</label>
            {voices.length > 0 ? (
              <select 
                value={selectedVoice ? selectedVoice.name : ""} 
                onChange={(e) => {
                  const voice = voices.find(v => v.name === e.target.value);
                  setSelectedVoice(voice);
                }}
                className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {voices.map(v => (
                  <option key={v.name} value={v.name}>
                    {v.name.replace('Google', '').replace('Microsoft', '').replace('Desktop', '')} ({v.lang})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded">
                找不到德語語音。請檢查您的裝置設定是否已安裝德語語言包。
              </p>
            )}
          </div>

          {/* Speed Selector */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">語速 ({speechRate}x)</label>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="1.5" 
              step="0.1" 
              value={speechRate} 
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0.5x (慢)</span>
              <span>1.0x (正常)</span>
              <span>1.5x (快)</span>
            </div>
          </div>

          {/* Test Button */}
          <button 
            onClick={() => speak("Hallo! Wie geht es dir?", selectedVoice, speechRate)}
            className="w-full py-3 bg-amber-100 text-amber-800 rounded-lg font-bold hover:bg-amber-200 transition-colors flex items-center justify-center gap-2"
          >
            <Volume2 size={18} /> 測試發音
          </button>

          <button 
            onClick={onClose}
            className="w-full py-3 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Main App Component
// -----------------------------------------------------------------------------
const App = () => {
  const [activeTab, setActiveTab] = useState('cards');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(0.9);
  const [showSettings, setShowSettings] = useState(false);

  // Load Voices
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Filter for German voices
      const deVoices = allVoices.filter(v => v.lang.includes('de'));
      setVoices(deVoices);

      // Default selection logic: Prefer Google, then Microsoft, then first available
      if (deVoices.length > 0 && !selectedVoice) {
        const preferred = deVoices.find(v => v.name.includes('Google')) || 
                          deVoices.find(v => v.name.includes('Microsoft')) || 
                          deVoices[0];
        setSelectedVoice(preferred);
      }
    };

    // Chrome requires waiting for onvoiceschanged
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []); // Remove selectedVoice dependency to prevent reset loop

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">
      {/* Inject custom CSS for 3D flip */}
      <style>{customStyles}</style>

      {/* Settings Modal */}
      <VoiceSettings 
        voices={voices}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        speechRate={speechRate}
        setSpeechRate={setSpeechRate}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Header */}
      <header className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-white shadow-md pb-14 pt-8 relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">🇩🇪 Verben mit Präpositionen</h1>
          <p className="text-amber-100 opacity-90 text-sm md:text-base flex items-center justify-center gap-2 mb-4">
             動詞介系詞學習助手
          </p>
          
          {/* Voice Settings Button */}
          <button 
            onClick={() => setShowSettings(true)}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm transition-colors border border-white/20"
          >
            <Settings size={14} />
            <span>
              {selectedVoice ? selectedVoice.name.substring(0, 15) + "..." : "設定語音"}
            </span>
          </button>
        </div>
      </header>

      {/* Navigation Container */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-1 flex justify-center max-w-lg mx-auto mb-8 overflow-hidden">
          <button 
            onClick={() => setActiveTab('cards')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 md:px-4 text-sm md:text-base font-medium transition-all ${
              activeTab === 'cards' 
                ? 'bg-amber-100 text-amber-800 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BookOpen size={18} />
            <span className="hidden sm:inline">單字卡</span>
            <span className="sm:hidden">卡片</span>
          </button>
          <button 
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 md:px-4 text-sm md:text-base font-medium transition-all ${
              activeTab === 'quiz' 
                ? 'bg-amber-100 text-amber-800 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Brain size={18} />
            <span className="hidden sm:inline">測驗</span>
          </button>
          <button 
            onClick={() => setActiveTab('grammatik')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 md:px-4 text-sm md:text-base font-medium transition-all ${
              activeTab === 'grammatik' 
                ? 'bg-amber-100 text-amber-800 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <GraduationCap size={18} />
            <span className="hidden sm:inline">文法</span>
            <span className="sm:hidden">文法</span>
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 md:px-4 text-sm md:text-base font-medium transition-all ${
              activeTab === 'list' 
                ? 'bg-amber-100 text-amber-800 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <List size={18} />
            <span className="hidden sm:inline">列表</span>
          </button>
        </div>

        {/* Content Area */}
        <main className="animate-in fade-in duration-500">
          {activeTab === 'cards' && <Flashcards data={verbData} selectedVoice={selectedVoice} speechRate={speechRate} />}
          {activeTab === 'quiz' && <Quiz data={verbData} selectedVoice={selectedVoice} speechRate={speechRate} />}
          {activeTab === 'grammatik' && <Grammatik selectedVoice={selectedVoice} speechRate={speechRate} />}
          {activeTab === 'list' && <ReferenceList data={verbData} selectedVoice={selectedVoice} speechRate={speechRate} />}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-400 text-sm">
        <p>資料來源：A1-B1 Übungsgrammatik</p>
        <div className="w-16 h-1 bg-gradient-to-r from-black via-red-600 to-yellow-400 mx-auto mt-4 rounded-full opacity-30"></div>
      </footer>
    </div>
  );
};

export default App;
