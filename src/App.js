import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BookOpen, Brain, List, Search, RefreshCw, CheckCircle, XCircle, ChevronRight, ChevronLeft, Volume2, History, Trophy, Info, Settings, Sliders } from 'lucide-react';

// -----------------------------------------------------------------------------
// 資料來源：擴充版數據 (含 B1/B2 複雜例句)
// -----------------------------------------------------------------------------
// 例句升級重點：
// 1. 使用 Nebensätze (dass, weil, ob, wenn...)
// 2. 使用 Infinitivsätze (um...zu, ohne...zu)
// 3. 使用 Relativsätze (關係子句)
const verbData = [
  { 
    verb: "abhängig sein", 
    prep: "von", 
    case: "D", 
    forms: "war abhängig / ist abhängig gewesen",
    example: "Ob wir morgen einen Ausflug machen können, ist stark vom Wetter abhängig.",
    exampleTrans: "我們明天能否去郊遊，很大程度上取決於天氣。"
  },
  { 
    verb: "achten", 
    prep: "auf", 
    case: "A", 
    forms: "achtete / hat geachtet",
    example: "Achten Sie bitte darauf, dass alle Fenster geschlossen sind, bevor Sie das Haus verlassen.",
    exampleTrans: "請您注意，在離開房子之前確保所有窗戶都已關閉。"
  },
  { 
    verb: "anfangen", 
    prep: "mit", 
    case: "D", 
    forms: "fing an / hat angefangen",
    example: "Da wir nicht viel Zeit haben, sollten wir sofort mit der Besprechung anfangen.",
    exampleTrans: "既然我們時間不多，我們應該立刻開始會議。"
  },
  { 
    verb: "sich ärgern", 
    prep: "über", 
    case: "A", 
    forms: "ärgerte sich / hat sich geärgert",
    example: "Er ärgert sich ständig darüber, dass sein Nachbar so laut Musik hört.",
    exampleTrans: "他經常為了鄰居聽音樂太大聲而感到生氣。"
  },
  { 
    verb: "aufhören", 
    prep: "mit", 
    case: "D", 
    forms: "hörte auf / hat aufgehört",
    example: "Du musst endlich mit dem Rauchen aufhören, wenn du gesund bleiben willst.",
    exampleTrans: "如果你想保持健康，你就必須終於戒菸了。"
  },
  { 
    verb: "aufpassen", 
    prep: "auf", 
    case: "A", 
    forms: "passte auf / hat aufgepasst",
    example: "Könntest du bitte kurz auf meine Tasche aufpassen, während ich zur Toilette gehe?",
    exampleTrans: "在我去洗手間的時候，能請你稍微幫我看一下包包嗎？"
  },
  { 
    verb: "sich aufregen", 
    prep: "über", 
    case: "A", 
    forms: "regte sich auf / hat sich aufgeregt",
    example: "Es lohnt sich nicht, sich über Dinge aufzuregen, die man nicht ändern kann.",
    exampleTrans: "為了無法改變的事情而激動是不值得的。"
  },
  { 
    verb: "sich bedanken", 
    prep: "bei / für", 
    case: "D / A", 
    forms: "bedankte sich / hat sich bedankt",
    example: "Ich möchte mich bei Ihnen herzlich dafür bedanken, dass Sie mir so schnell geholfen haben.",
    exampleTrans: "我想衷心感謝您這麼快就幫助了我。"
  },
  { 
    verb: "beginnen", 
    prep: "mit", 
    case: "D", 
    forms: "begann / hat begonnen",
    example: "Bevor wir mit dem neuen Thema beginnen, wiederholen wir kurz den Stoff der letzten Woche.",
    exampleTrans: "在開始新主題之前，我們先簡短複習上週的內容。"
  },
  { 
    verb: "sich bemühen", 
    prep: "um", 
    case: "A", 
    forms: "bemühte sich / hat sich bemüht",
    example: "Trotz seiner schlechten Noten bemüht er sich sehr um einen Ausbildungsplatz.",
    exampleTrans: "儘管成績不好，他還是非常努力爭取培訓名額。"
  },
  { 
    verb: "berichten", 
    prep: "über", 
    case: "A", 
    forms: "berichtete / hat berichtet",
    example: "Der Journalist berichtete ausführlich darüber, wie der Unfall passiert ist.",
    exampleTrans: "記者詳細報導了這起事故是如何發生的。"
  },
  { 
    verb: "sich beschäftigen", 
    prep: "mit", 
    case: "D", 
    forms: "beschäftigte sich / hat sich beschäftigt",
    example: "In seiner Freizeit beschäftigt er sich am liebsten mit dem Reparieren alter Autos.",
    exampleTrans: "在空閒時間，他最喜歡忙於修理老爺車。"
  },
  { 
    verb: "sich beschweren", 
    prep: "bei / über", 
    case: "D / A", 
    forms: "beschwerte sich / hat sich beschwert",
    example: "Die Gäste haben sich beim Hotelmanager darüber beschwert, dass die Klimaanlage defekt war.",
    exampleTrans: "客人向飯店經理抱怨空調壞了。"
  },
  { 
    verb: "sich bewerben", 
    prep: "um", 
    case: "A", 
    forms: "bewarb sich / hat sich beworben",
    example: "Nachdem sie ihr Studium abgeschlossen hatte, bewarb sie sich um eine Stelle bei BMW.",
    exampleTrans: "在她完成學業後，她申請了 BMW 的職位。"
  },
  { 
    verb: "jdn. bitten", 
    prep: "um", 
    case: "A", 
    forms: "bat / hat gebeten",
    example: "Da ich mein Portemonnaie vergessen habe, muss ich dich um etwas Geld bitten.",
    exampleTrans: "因為我忘了帶錢包，我必須請你借我一點錢。"
  },
  { 
    verb: "jdm. danken", 
    prep: "für", 
    case: "A", 
    forms: "dankte / hat gedankt",
    example: "Wir danken Ihnen im Voraus für Ihr Verständnis und Ihre Kooperation.",
    exampleTrans: "我們先感謝您的理解與合作。"
  },
  { 
    verb: "denken", 
    prep: "an", 
    case: "A", 
    forms: "dachte / hat gedacht",
    example: "Wenn ich an meinen letzten Urlaub denke, bekomme ich sofort wieder Fernweh.",
    exampleTrans: "當我想起上次的假期，我立刻又想去旅行了。"
  },
  { 
    verb: "diskutieren", 
    prep: "mit / über", 
    case: "D / A", 
    forms: "diskutierte / hat diskutiert",
    example: "Es ist sinnlos, mit ihm über Politik zu diskutieren, da er seine Meinung nie ändert.",
    exampleTrans: "跟他討論政治是沒用的，因為他從不改變想法。"
  },
  { 
    verb: "jdn. einladen", 
    prep: "zu", 
    case: "D", 
    forms: "lud ein / hat eingeladen",
    example: "Ich würde dich gerne zu meiner Party einladen, falls du an dem Tag Zeit hast.",
    exampleTrans: "如果你那天有空的話，我很想邀請你來我的派對。"
  },
  { 
    verb: "sich entscheiden", 
    prep: "für", 
    case: "A", 
    forms: "entschied sich / hat sich entschieden",
    example: "Er hat sich dafür entschieden, Medizin zu studieren, obwohl seine Eltern dagegen waren.",
    exampleTrans: "儘管父母反對，他還是決定攻讀醫學。"
  },
  { 
    verb: "sich entschuldigen", 
    prep: "bei / für", 
    case: "D / A", 
    forms: "entschuldigte sich / hat sich entschuldigt",
    example: "Er hat sich sofort bei ihr dafür entschuldigt, dass er ihren Geburtstag vergessen hat.",
    exampleTrans: "他立刻為了忘記她的生日而向她道歉。"
  },
  { 
    verb: "sich erholen", 
    prep: "von", 
    case: "D", 
    forms: "erholte sich / hat sich erholt",
    example: "Sie braucht dringend Urlaub, um sich von dem Stress der letzten Wochen zu erholen.",
    exampleTrans: "她急需休假，以便從過去幾週的壓力中恢復過來。"
  },
  { 
    verb: "sich erinnern", 
    prep: "an", 
    case: "A", 
    forms: "erinnerte sich / hat sich erinnert",
    example: "Erinnerst du dich noch daran, wie wir uns zum ersten Mal getroffen haben?",
    exampleTrans: "你還記得我們第一次見面是怎樣的情景嗎？"
  },
  { 
    verb: "sich erkundigen", 
    prep: "bei / nach", 
    case: "D", 
    forms: "erkundigte sich / hat sich erkundigt",
    example: "Bevor wir buchen, sollten wir uns beim Reisebüro nach den aktuellen Preisen erkundigen.",
    exampleTrans: "在預訂之前，我們應該向旅行社詢問目前的價格。"
  },
  { 
    verb: "erzählen", 
    prep: "von", 
    case: "D", 
    forms: "erzählte / hat erzählt",
    example: "Er hat mir begeistert von seinem neuen Projekt erzählt, an dem er gerade arbeitet.",
    exampleTrans: "他興奮地跟我講述了他正在進行的新專案。"
  },
  { 
    verb: "fragen", 
    prep: "nach", 
    case: "D", 
    forms: "fragte / hat gefragt",
    example: "Wenn du den Weg nicht kennst, solltest du jemanden nach der Richtung fragen.",
    exampleTrans: "如果你不認得路，你應該問人方向。"
  },
  { 
    verb: "sich freuen (未來)", 
    prep: "auf", 
    case: "A", 
    forms: "freute sich / hat sich gefreut",
    example: "Ich freue mich schon riesig darauf, dich nächste Woche in Berlin zu besuchen.",
    exampleTrans: "我非常期待下週去柏林拜訪你。"
  },
  { 
    verb: "sich freuen (現在/過去)", 
    prep: "über", 
    case: "A", 
    forms: "freute sich / hat sich gefreut",
    example: "Sie hat sich sehr darüber gefreut, dass so viele Freunde zu ihrer Party gekommen sind.",
    exampleTrans: "她非常高興有這麼多朋友來參加她的派對。"
  },
  { 
    verb: "sich gewöhnen", 
    prep: "an", 
    case: "A", 
    forms: "gewöhnte sich / hat sich gewöhnt",
    example: "Es dauert eine Weile, bis man sich an das frühe Aufstehen gewöhnt hat.",
    exampleTrans: "要習慣早起需要一段時間。"
  },
  { 
    verb: "gratulieren", 
    prep: "zu", 
    case: "D", 
    forms: "gratulierte / hat gratuliert",
    example: "Ich möchte dir ganz herzlich dazu gratulieren, dass du die Prüfung bestanden hast.",
    exampleTrans: "我衷心祝賀你通過了考試。"
  },
  { 
    verb: "hoffen", 
    prep: "auf", 
    case: "A", 
    forms: "hoffte / hat gehofft",
    example: "Die Bauern hoffen auf Regen, da die Ernte sonst vertrocknen würde.",
    exampleTrans: "農民們期盼下雨，否則農作物會乾枯。"
  },
  { 
    verb: "sich interessieren", 
    prep: "für", 
    case: "A", 
    forms: "interessierte sich / hat sich interessiert",
    example: "Ich interessiere mich sehr für Geschichte, besonders für das Römische Reich.",
    exampleTrans: "我對歷史非常感興趣，特別是羅馬帝國。"
  },
  { 
    verb: "sich konzentrieren", 
    prep: "auf", 
    case: "A", 
    forms: "konzentrierte sich / hat sich konzentriert",
    example: "Es fällt mir schwer, mich auf die Arbeit zu konzentrieren, wenn es so laut ist.",
    exampleTrans: "如果是這麼吵的話，我很難專心工作。"
  },
  { 
    verb: "sich kümmern", 
    prep: "um", 
    case: "A", 
    forms: "kümmerte sich / hat sich gekümmert",
    example: "Mach dir keine Sorgen, ich werde mich darum kümmern, dass alles erledigt wird.",
    exampleTrans: "別擔心，我會負責把所有事情處理好。"
  },
  { 
    verb: "lachen", 
    prep: "über", 
    case: "A", 
    forms: "lachte / hat gelacht",
    example: "Alle haben darüber gelacht, wie der Clown über seine eigenen Füße gestolpert ist.",
    exampleTrans: "大家都嘲笑那個小丑是如何被自己的腳絆倒的。"
  },
  { 
    verb: "leiden", 
    prep: "an / unter", 
    case: "D", 
    forms: "litt / hat gelitten",
    example: "Viele Menschen leiden darunter, dass sie in der Großstadt zu viel Stress haben.",
    exampleTrans: "許多人深受大城市壓力過大之苦 (leiden unter)。"
  },
  { 
    verb: "nachdenken", 
    prep: "über", 
    case: "A", 
    forms: "dachte nach / hat nachgedacht",
    example: "Hast du schon einmal darüber nachgedacht, ins Ausland zu ziehen?",
    exampleTrans: "你曾經考慮過搬到國外嗎？"
  },
  { 
    verb: "protestieren", 
    prep: "gegen", 
    case: "A", 
    forms: "protestierte / hat protestiert",
    example: "Die Bürger protestieren dagegen, dass der Park in einen Parkplatz verwandelt wird.",
    exampleTrans: "市民抗議將公園變成停車場。"
  },
  { 
    verb: "schmecken", 
    prep: "nach", 
    case: "D", 
    forms: "schmeckte / hat geschmeckt",
    example: "Dieser Kuchen schmeckt ein bisschen nach Zitrone, findest du nicht auch?",
    exampleTrans: "這蛋糕嚐起來有點檸檬味，你不覺得嗎？"
  },
  { 
    verb: "schreiben", 
    prep: "an", 
    case: "A", 
    forms: "schrieb / hat geschrieben",
    example: "Seit er umgezogen ist, schreibt er regelmäßig Briefe an seine alten Freunde.",
    exampleTrans: "自從搬家後，他定期寫信給他的老朋友們。"
  },
  { 
    verb: "sorgen", 
    prep: "für", 
    case: "A", 
    forms: "sorgte / hat gesorgt",
    example: "Die laute Musik sorgte dafür, dass die Nachbarn die Polizei riefen.",
    exampleTrans: "巨大的音樂聲導致鄰居叫來了警察。"
  },
  { 
    verb: "sprechen", 
    prep: "mit / über", 
    case: "D / A", 
    forms: "sprach / hat gesprochen",
    example: "Ich muss unbedingt mit dir darüber sprechen, was gestern passiert ist.",
    exampleTrans: "我一定要跟你談談昨天發生的事。"
  },
  { 
    verb: "streiten", 
    prep: "mit", 
    case: "D", 
    forms: "stritt / hat gestritten",
    example: "Es bringt nichts, mit ihm zu streiten, weil er immer recht haben will.",
    exampleTrans: "跟他吵架沒用，因為他總是想要贏。"
  },
  { 
    verb: "teilnehmen", 
    prep: "an", 
    case: "D", 
    forms: "nahm teil / hat teilgenommen",
    example: "Leider konnte er wegen einer Krankheit nicht an der Konferenz teilnehmen.",
    exampleTrans: "遺憾的是，由於生病，他無法參加會議。"
  },
  { 
    verb: "träumen", 
    prep: "von", 
    case: "D", 
    forms: "träumte / hat geträumt",
    example: "Sie träumt davon, eines Tages eine Weltreise zu machen.",
    exampleTrans: "她夢想著有一天能環遊世界。"
  },
  { 
    verb: "sich unterhalten", 
    prep: "mit / über", 
    case: "D / A", 
    forms: "unterhielt sich / hat sich unterhalten",
    example: "Wir haben uns den ganzen Abend gut mit den Gästen über Reisen unterhalten.",
    exampleTrans: "我們整晚都跟客人聊旅行聊得很開心。"
  },
  { 
    verb: "sich verabreden", 
    prep: "mit", 
    case: "D", 
    forms: "verabredete sich / hat sich verabredet",
    example: "Sie hat sich für heute Abend mit ihrer besten Freundin zum Essen verabredet.",
    exampleTrans: "她跟她最好的朋友約好今晚一起吃飯。"
  },
  { 
    verb: "sich verlassen", 
    prep: "auf", 
    case: "A", 
    forms: "verließ sich / hat sich verlassen",
    example: "Du kannst dich darauf verlassen, dass ich dich pünktlich abhole.",
    exampleTrans: "你可以信賴我會準時去接你。"
  },
  { 
    verb: "sich verlieben", 
    prep: "in", 
    case: "A", 
    forms: "verliebte sich / hat sich verliebt",
    example: "Es dauerte nicht lange, bis er sich in die charmante Italienerin verliebte.",
    exampleTrans: "沒過多久，他就愛上了那位迷人的義大利女子。"
  },
  { 
    verb: "etwas verstehen", 
    prep: "von", 
    case: "D", 
    forms: "verstand / hat verstanden",
    example: "Da er nichts von Elektrik versteht, hat er einen Fachmann gerufen.",
    exampleTrans: "因為他對電學一竅不通，所以他請了專家。"
  },
  { 
    verb: "sich vorbereiten", 
    prep: "auf", 
    case: "A", 
    forms: "bereitere sich vor / hat sich vorbereitet",
    example: "Statt fernzusehen, sollte er sich lieber auf seine Abschlussprüfung vorbereiten.",
    exampleTrans: "他不該看電視，而應該準備他的期末考。"
  },
  { 
    verb: "warten", 
    prep: "auf", 
    case: "A", 
    forms: "wartete / hat gewartet",
    example: "Wir warten schon seit über einer Stunde darauf, dass der Bus endlich kommt.",
    exampleTrans: "我們已經等公車終於來等了一個多小時了。"
  },
  { 
    verb: "sich wenden", 
    prep: "an", 
    case: "A", 
    forms: "wandte sich / hat sich gewandt",
    example: "Wenn Sie Fragen haben, können Sie sich jederzeit an unseren Kundenservice wenden.",
    exampleTrans: "如果您有問題，隨時可以聯繫我們的客戶服務。"
  },
  { 
    verb: "sich wundern", 
    prep: "über", 
    case: "A", 
    forms: "wunderte sich / hat sich gewundert",
    example: "Ich wundere mich darüber, dass er trotz der Kälte keine Jacke trägt.",
    exampleTrans: "我很驚訝儘管這麼冷，他卻沒穿外套。"
  },
  { 
    verb: "zweifeln", 
    prep: "an", 
    case: "D", 
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
// Updated to accept a specific voice and rate
const speak = (text, voice = null, rate = 0.9) => {
  if (!window.speechSynthesis) return;
  
  // Cancel previous speech to prevent overlapping
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

  if (shuffledData.length === 0) return <div>Loading...</div>;

  const currentCard = shuffledData[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto min-h-[480px]">
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-96 cursor-pointer perspective-1000 group relative"
      >
        <div className={`relative w-full h-full duration-500 preserve-3d transition-all transform ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white border-2 border-amber-400 rounded-xl shadow-lg flex flex-col items-center justify-center p-6 text-center">
            <span className="text-sm text-gray-500 uppercase tracking-wider mb-2">Verb (動詞)</span>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{currentCard.verb}</h3>
            
            <button 
              onClick={(e) => playAudio(e, currentCard.verb)}
              className="p-3 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-110 transition-all mt-2 shadow-sm border border-amber-100"
              title="播放發音"
            >
              <Volume2 size={28} />
            </button>

            <p className="text-xs text-gray-400 mt-auto">點擊翻轉查看介系詞與例句</p>
          </div>
          
          {/* Back */}
          <div className="absolute w-full h-full backface-hidden bg-amber-50 border-2 border-amber-500 rounded-xl shadow-lg flex flex-col items-center justify-center p-5 text-center rotate-y-180">
            <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Lösung (答案)</span>
            
            {/* Verb + Prep */}
            <h3 className="text-2xl font-bold text-amber-800 mb-1 flex items-center justify-center gap-2">
              <span>{currentCard.verb} <span className="text-amber-600 underline decoration-2">{currentCard.prep}</span></span>
              <button 
                onClick={(e) => playAudio(e, `${currentCard.verb} ${currentCard.prep}`)}
                className="p-1 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                title="播放片語發音"
              >
                <Volume2 size={16} />
              </button>
            </h3>
            
            <div className="inline-block bg-amber-200 text-amber-900 px-3 py-1 rounded-full font-bold text-sm mb-3">
              + {currentCard.case === 'A' ? 'Akkusativ' : currentCard.case === 'D' ? 'Dativ' : currentCard.case}
            </div>
            
            {/* Example (Complex) */}
            <div className="bg-white/60 p-2 rounded-lg w-full mb-2 overflow-y-auto max-h-[100px]">
              <div className="flex items-start justify-center gap-2 mb-1">
                <p className="text-sm font-medium text-gray-800 italic leading-snug text-left px-2">"{currentCard.example}"</p>
                <button 
                  onClick={(e) => playAudio(e, currentCard.example)}
                  className="shrink-0 text-amber-600 hover:text-amber-800"
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
                  className="text-amber-600 hover:text-amber-800"
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
    const newEntry = { date: today, score: newScore, time: new Date().toLocaleTimeString() };
    const newHistory = [newEntry, ...history].slice(0, 5); // Keep last 5
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const generateQuestion = () => {
    const randomVerb = data[Math.floor(Math.random() * data.length)];
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
  }, []);

  const handleOptionClick = (option) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);

    const correctPreps = currentQuestion.prep.split('/').map(s => s.trim());
    const isCorrect = correctPreps.includes(option);
    
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

  // Extract prep to hide it in example
  // We need to be careful with prepositions like "auf" vs "darauf" in complex sentences
  // Strategy: Just mask the preposition itself if found, or the "da"+prep compound
  const prep = currentQuestion.prep.split('/')[0].trim();
  const daPrep = "da" + (["a", "e", "i", "o", "u"].includes(prep[0]) ? "r" : "") + prep;
  
  let maskedExample = currentQuestion.example;
  // Simple masking attempt - case insensitive
  const regex = new RegExp(`\\b(${prep}|${daPrep})\\b`, 'gi');
  maskedExample = maskedExample.replace(regex, "___");

  return (
    <div className="w-full max-w-md mx-auto">
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
                <span key={i} className="inline-flex flex-col bg-gray-50 px-2 py-1 rounded border border-gray-100 text-xs text-center min-w-[60px]">
                  <span className="font-bold text-gray-700">{h.score}分</span>
                  <span className="text-[10px] text-gray-400">{h.date}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
        <div className="text-center mb-8 relative z-10">
          <p className="text-gray-500 mb-2">Welche Präposition passt?</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="text-3xl font-bold text-gray-800">{currentQuestion.verb}</h2>
            <button onClick={() => speak(currentQuestion.verb, selectedVoice, speechRate)} className="text-amber-500 hover:text-amber-600">
               <Volume2 size={24} />
            </button>
          </div>
          {/* Hint Context for better guessing if available */}
           <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic leading-relaxed">
             "{maskedExample}"
           </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
          {options.map((opt, idx) => {
            const correctPreps = currentQuestion.prep.split('/').map(s => s.trim());
            const isCorrect = correctPreps.includes(opt);
            const isSelected = selectedOption === opt;
            
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
            <div className={`p-4 rounded-lg mb-4 text-center ${currentQuestion.prep.includes(selectedOption) ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="font-bold mb-1">
                {currentQuestion.prep.includes(selectedOption) ? 'Richtig! (正確)' : 'Leider falsch (答錯了)'}
              </p>
              <div className="flex flex-col items-center mt-2">
                 <p className="text-lg mb-1">
                  {currentQuestion.verb} <span className="font-bold underline">{currentQuestion.prep}</span>
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
          placeholder="搜尋... (試試 'warten' 或 'auf')" 
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
                      <td colSpan="3" className="p-4 pl-6 border-b border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
            A1-B1 德語特訓
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
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-1 flex justify-center max-w-lg mx-auto mb-8">
          <button 
            onClick={() => setActiveTab('cards')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'cards' 
                ? 'bg-amber-100 text-amber-800 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BookOpen size={18} />
            <span className="hidden sm:inline">單字卡</span>
          </button>
          <button 
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'quiz' 
                ? 'bg-amber-100 text-amber-800 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Brain size={18} />
            <span className="hidden sm:inline">測驗</span>
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
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
          {activeTab === 'list' && <ReferenceList data={verbData} selectedVoice={selectedVoice} speechRate={speechRate} />}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-400 text-sm">
        <p>資料來源：A1-B1 Übungsgrammatik + 擴充例句庫</p>
        <div className="w-16 h-1 bg-gradient-to-r from-black via-red-600 to-yellow-400 mx-auto mt-4 rounded-full opacity-30"></div>
      </footer>
    </div>
  );
};

export default App;