import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Star, Shuffle, RotateCcw, ChevronLeft, ChevronRight, Undo2, ArrowRight, Heart } from 'lucide-react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(Observer);

const INITIAL_CARDS = [
  {
    "id": 1,
    "question": "Aké sú základné ciele podniku?",
    "options": [
      "maximalizácia zisku, rast trhového podielu, prežitie",
      "minimalizácia nákladov, zvyšovanie počtu zamestnancov",
      "dosahovanie sociálnej rovnosti",
      "vytváranie monopolného postavenia"
    ],
    "answer": "maximalizácia zisku, rast trhového podielu, prežitie",
    "isFavorite": false
  },
  {
    "id": 2,
    "question": "Čo vyjadruje rentabilita tržieb?",
    "options": [
      "pomer zisku k celkovým tržbám",
      "pomer tržieb k nákladom",
      "pomer vlastného imania k zisku",
      "pomer obežných aktív k záväzkom"
    ],
    "answer": "pomer zisku k celkovým tržbám",
    "isFavorite": false
  },
  {
    "id": 3,
    "question": "Čo patrí medzi základné výrobné faktory?",
    "options": [
      "práca, pôda, kapitál",
      "stroje, budovy, peniaze",
      "suroviny, polotovary, výrobky",
      "manažment, marketing, logistika"
    ],
    "answer": "práca, pôda, kapitál",
    "isFavorite": false
  },
  {
    "id": 4,
    "question": "Ako sa vypočíta bod zvratu?",
    "options": [
      "fixné náklady / (cena - variabilné náklady na jednotku)",
      "celkové náklady / celkové výnosy",
      "tržby - celkové náklady",
      "variabilné náklady / fixné náklady"
    ],
    "answer": "fixné náklady / (cena - variabilné náklady na jednotku)",
    "isFavorite": false
  },
  {
    "id": 5,
    "question": "Čo je to odpisy?",
    "options": [
      "peňažné vyjadrenie opotrebenia dlhodobého majetku",
      "zníženie hodnoty zásob",
      "splátka bankového úveru",
      "platba za prenájom priestorov"
    ],
    "answer": "peňažné vyjadrenie opotrebenia dlhodobého majetku",
    "isFavorite": false
  },
  {
    "id": 6,
    "question": "Čo je to likvidita podniku?",
    "options": [
      "schopnosť podniku uhrádzať svoje splatné záväzky",
      "rýchlosť predaja výrobkov",
      "pomer zisku k nákladom",
      "množstvo peňazí v pokladni"
    ],
    "answer": "schopnosť podniku uhrádzať svoje splatné záväzky",
    "isFavorite": false
  },
  {
    "id": 7,
    "question": "Aký je rozdiel medzi hrubým a čistým ziskom?",
    "options": [
      "čistý zisk je hrubý zisk po odpočítaní dane z príjmov",
      "hrubý zisk nezahŕňa variabilné náklady",
      "čistý zisk je zisk pred odpočítaním úrokov",
      "rozdiel je v započítaní odpisov"
    ],
    "answer": "čistý zisk je hrubý zisk po odpočítaní dane z príjmov",
    "isFavorite": false
  },
  {
    "id": 8,
    "question": "Kto je zakladateľom vedeckého riadenia?",
    "options": [
      "Frederick Winslow Taylor",
      "Max Weber",
      "Henri Fayol",
      "Peter Drucker"
    ],
    "answer": "Frederick Winslow Taylor",
    "isFavorite": false
  },
  {
    "id": 9,
    "question": "Čo je to marketingový mix (4P)?",
    "options": [
      "Product, Price, Place, Promotion",
      "People, Process, Physical evidence, Price",
      "Product, Profit, Planning, Promotion",
      "Price, Placement, Publicity, People"
    ],
    "answer": "Product, Price, Place, Promotion",
    "isFavorite": false
  },
  {
    "id": 10,
    "question": "Čo vyjadruje súvaha?",
    "options": [
      "prehľad o majetku podniku a zdrojoch jeho krytia k určitému dátumu",
      "prehľad o príjmoch a výdavkoch za určité obdobie",
      "prehľad o nákladoch a výnosoch",
      "výpočet dane z pridanej hodnoty"
    ],
    "answer": "prehľad o majetku podniku a zdrojoch jeho krytia k určitému dátumu",
    "isFavorite": false
  },
  {
    "id": 11,
    "question": "Identifikujte symbol ADR (Radioactive substances):",
    "options": [
      "Horľavé kvapaliny",
      "Jedovaté látky",
      "Rádioaktívne látky",
      "Stlačené, skvapalnené a pod tlakom rozpustené plyny",
      "Výbušné látky a predmety",
      "Žieravé látky"
    ],
    "answer": "Rádioaktívne látky",
    "isFavorite": false
  },
  {
    "id": 12,
    "question": "Identify the ADR symbol (Flammable liquids):",
    "options": [
      "Horľavé kvapaliny",
      "Jedovaté látky",
      "Rádioaktívne látky",
      "Stlačené, skvapalnené a pod tlakom rozpustené plyny",
      "Výbušné látky a predmety",
      "Žieravé látky"
    ],
    "answer": "Horľavé kvapaliny",
    "isFavorite": false
  },
  {
    "id": 13,
    "question": "Identify the ADR symbol (Poisonous substances):",
    "options": [
      "Horľavé kvapaliny",
      "Jedovaté látky",
      "Rádioaktívne látky",
      "Stlačené, skvapalnené a pod tlakom rozpustené plyny",
      "Výbušné látky a predmety",
      "Žieravé látky"
    ],
    "answer": "Jedovaté látky",
    "isFavorite": false
  },
  {
    "id": 14,
    "question": "Identify the ADR symbol (Compressed, liquefied and under pressure dissolved gases):",
    "options": [
      "Horľavé kvapaliny",
      "Jedovaté látky",
      "Rádioaktívne látky",
      "Stlačené, skvapalnené a pod tlakom rozpustené plyny",
      "Výbušné látky a predmety",
      "Žieravé látky"
    ],
    "answer": "Stlačené, skvapalnené a pod tlakom rozpustené plyny",
    "isFavorite": false
  },
  {
    "id": 15,
    "question": "Identify the ADR symbol (Flammable solids):",
    "options": [
      "Horľavé tuhé látky",
      "Látky, ktoré v styku s vodou vyvíjajú horľavé plyny",
      "Látky schopné samovznietenia",
      "Látky podporujúce horenie (oxidujúce látky)",
      "Organické peroxidy"
    ],
    "answer": "Horľavé tuhé látky",
    "isFavorite": false
  },
  {
    "id": 16,
    "question": "Identify the ADR symbol (Substances which, in contact with water, emit flammable gases):",
    "options": [
      "Horľavé tuhé látky",
      "Látky, ktoré v styku s vodou vyvíjajú horľavé plyny",
      "Látky schopné samovznietenia",
      "Látky podporujúce horenie (oxidujúce látky)",
      "Organické peroxidy"
    ],
    "answer": "Látky, ktoré v styku s vodou vyvíjajú horľavé plyny",
    "isFavorite": false
  },
  {
    "id": 17,
    "question": "Identify the ADR symbol (Substances capable of spontaneous combustion):",
    "options": [
      "Horľavé tuhé látky",
      "Látky, ktoré v styku s vodou vyvíjajú horľavé plyny",
      "Látky schopné samovznietenia",
      "Látky podporujúce horenie (oxidujúce látky)",
      "Organické peroxidy"
    ],
    "answer": "Látky schopné samovznietenia",
    "isFavorite": false
  },
  {
    "id": 18,
    "question": "Identify the ADR symbol (Oxidising substances):",
    "options": [
      "Horľavé tuhé látky",
      "Látky, ktoré v styku s vodou vyvíjajú horľavé plyny",
      "Látky schopné samovznietenia",
      "Látky podporujúce horenie (oxidujúce látky)",
      "Organické peroxidy"
    ],
    "answer": "Látky podporujúce horenie (oxidujúce látky)",
    "isFavorite": false
  },
  {
    "id": 19,
    "question": "Identify the ADR symbol (Organic peroxides):",
    "options": [
      "Horľavé tuhé látky",
      "Látky, ktoré v styku s vodou vyvíjajú horľavé plyny",
      "Látky schopné samovznietenia",
      "Látky podporujúce horenie (oxidujúce látky)",
      "Organické peroxidy"
    ],
    "answer": "Organické peroxidy",
    "isFavorite": false
  },
  {
    "id": 20,
    "question": "Identify the ADR symbol (Miscellaneous dangerous substances and articles):",
    "options": [
      "Environmentally hazardous substances",
      "Infection substances",
      "Miscellaneous dangerous substances and articles"
    ],
    "answer": "Miscellaneous dangerous substances and articles",
    "isFavorite": false
  },
  {
    "id": 21,
    "question": "Činnosť zameraná na dosiahnutie zisku, vykonávaná samostatne, vlastným menom, na vlastnú zodpovednosť a za podmienok stanovených zákonom je v SR označovaná ako:",
    "options": [
      "hospodárska činnosť",
      "obchodovanie",
      "podnikanie",
      "podnikateľská prax",
      "výroba",
      "živnostenské podnikanie"
    ],
    "answer": "podnikanie",
    "isFavorite": false
  },
  {
    "id": 22,
    "question": "Podnikateľská činnosť vykonávaná v súlade so Živnostenským zákonom je:",
    "options": [
      "hospodárska činnosť",
      "komerčné podnikanie",
      "obchod",
      "podnikanie",
      "výroba",
      "živnosť"
    ],
    "answer": "živnosť",
    "isFavorite": false
  },
  {
    "id": 23,
    "question": "Podnikateľská činnosť vykonávaná v súlade so Živnostenským zákonom je v SR:",
    "options": [
      "charta",
      "koncesia",
      "licencia",
      "oprávnenie",
      "povolenie",
      "výsada"
    ],
    "answer": "koncesia",
    "isFavorite": false
  },
  {
    "id": 24,
    "question": "Živnosť rozdeľujeme na:",
    "options": [
      "ohlasovacie a koncesované",
      "ohlasovacie, remeselné a viazané",
      "remeselné, viazané, voľné a koncesované",
      "voľné, viazané a koncesované"
    ],
    "answer": "ohlasovacie a koncesované",
    "isFavorite": false
  },
  {
    "id": 25,
    "question": "Remeselné živnosti sú:",
    "options": [
      "vyžadujúce odbornú spôsobilosť získanú vyučením v odbore",
      "vyžadujúce odbornú spôsobilosť získanú inak",
      "nevyžadujúce odbornú spôsobilosť",
      "vyžadujúce štátny súhlas"
    ],
    "answer": "vyžadujúce odbornú spôsobilosť získanú vyučením v odbore",
    "isFavorite": false
  },
  {
    "id": 26,
    "question": "Viazané živnosti sú:",
    "options": [
      "vyžadujúce odbornú spôsobilosť získanú vyučením v odbore",
      "vyžadujúce odbornú spôsobilosť získanú inak",
      "nevyžadujúce odbornú spôsobilosť",
      "vyžadujúce štátny súhlas"
    ],
    "answer": "vyžadujúce odbornú spôsobilosť získanú inak",
    "isFavorite": false
  },
  {
    "id": 27,
    "question": "V ktorom roku bola prijatá dohoda TIR ?",
    "options": [
      "v roku 1995",
      "v roku 2000",
      "v roku 2005",
      "v roku 2010",
      "v roku 2015",
      "v roku 2020"
    ],
    "answer": "v roku 2010",
    "isFavorite": false
  },
  {
    "id": 28,
    "question": "Po vydaní koncesie na podnikanie v taxislužbe je možné:",
    "options": [
      "taxislužbu je možné prevádzkovať na území celej Slovenskej republiky",
      "taxislužbu je možné prevádzkovať na území celej Európskej únie",
      "taxislužbu je možné prevádzkovať na území mesta alebo obce",
      "taxislužbu je možné prevádzkovať na území, kde je her prevádzkovanie nevyhnutné and definované zákonom",
      "taxislužbu je možné prevádzkovať iba tam, kde to definuje vydaná koncesia",
      "taxislužbu je možné prevádzkovať všade tam, kde to prevádzkovateľ má v úmysle"
    ],
    "answer": "taxislužbu je možné prevádzkovať na území celej Slovenskej republiky",
    "isFavorite": false
  },
  {
    "id": 29,
    "question": "Aká je výška vstupnej záruky pre dopravcu, ktorý chce vstúpiť do systému TIR?",
    "options": [
      "3 000 USD",
      "5 000 USD",
      "12 000 USD"
    ],
    "answer": "5 000 USD",
    "isFavorite": false
  },
  {
    "id": 30,
    "question": "Čo nepatrí medzi subjektívne predpoklady podnikania?",
    "options": [
      "byť iniciatívny and nezávislý",
      "mať prirodzenú autoritu and prevahu",
      "mať pozitivnu predstavu o sebe",
      "potreba presadiť sa v kolektíve",
      "schopnosť podstupovať riziká",
      "využívanie ekonomických príležitostí"
    ],
    "answer": "využívanie ekonomických príležitostí",
    "isFavorite": false
  },
  {
    "id": 31,
    "question": "Všeobecné znaky Gutenberga kombinácia výrobných faktorov, princíp hospodárnosti, princip finančnej rovnováhy.",
    "options": [
      "True",
      "False"
    ],
    "answer": "True",
    "isFavorite": false
  },
  {
    "id": 32,
    "question": "Koncesia na prevádzkovanie taxislužby je vydávaná:",
    "options": [
      "individuálne pre vybranú oblasť",
      "krajom na územie daného kraja",
      "krajom na územie daného okresu",
      "okresom na územie daného kraja",
      "okresom na územie daného okresu",
      "štátom na územie daného okresu"
    ],
    "answer": "okresom na územie daného okresu",
    "isFavorite": false
  },
  {
    "id": 33,
    "question": "Čo nepatrí medzi formy podnikania v autobusovej doprave?",
    "options": [
      "Medzimestská doprava",
      "Mestská hromadná doprava",
      "Náhradná autobusová doprava",
      "Osobitná pravidelná autobusová doprava",
      "Príležitostná autobusová doprava",
      "Prímestská doprava"
    ],
    "answer": "Prímestská doprava, Medzimestská doprava",
    "isFavorite": false
  },
  {
    "id": 34,
    "question": "Aké základne znaky musí mať činnosť, aby sme ju mohli označiť za podnikanie?",
    "options": [
      "konanie vo vlastnom mene, na vlastnú zodpovednosť, za účelom dosiahnutia zisku",
      "je to každá činnosť, ktorá je robená za účelom dosiahnutia zisku",
      "opakovateľnosť, transparentnosť, samostatnosť, konanie vo vlastnom mene, na vlastnú zodpovednosť, za účelom dosiahnutia zisku",
      "spoľahlivosť, odbornosť, samostatnosť, konanie vo vlastnom mene",
      "sústavnosť, samostatnosť, konanie vo vlastnom mene, na vlastnú zodpovednosť, za účelom dosiahnutia zisku",
      "sústavnosť, samostatnosť, konanie vo vlastnom mene, na vlastnú zodpovednosť, za účelom dosiahnutia zisku alebo za určitých okolností je to činnosť, ktorá môže byť aj stratová s ohľadom na \"vyššie dobro\""
    ],
    "answer": "sústavnosť, samostatnosť, konanie vo vlastnom mene, na vlastnú zodpovednosť, za účelom dosiahnutia zisku",
    "isFavorite": false
  },
  {
    "id": 35,
    "question": "Čo je princíp finančnej rovnováhy ?",
    "options": [
      "princíp finančnej rovnováhy sa prejavuje v schopnosti podniku plniť svoje platobné povinnosti, často sa označuje pojmom finančná stabilita podniku",
      "princíp finančnej rovnováhy sa prejavuje v schopnosti podniku neplniť svoje platobné povinnosti, ale ich nezhoršovať, často sa označuje pojmom finančná stabilita podniku",
      "princíp finančnej rovnováhy sa prejavuje optimalizáciou vzťahu medzi vstupmi and výstupmi/vstup and výstup má byť vzájomne zladený tak, aby sa podľa vopred určených kritérií dal riešiť ekonomicky optimálne/",
      "princíp finančnej rovnováhy sa prejavuje snahou účelne spojiť and kombinovať výrobné faktory do efektívne fungujúcej jednotky",
      "princíp finančnej rovnováhy vyjadruje snahu podniku konať čo najhospodárnejšie"
    ],
    "answer": "princíp finančnej rovnováhy sa prejavuje v schopnosti podniku plniť svoje platobné povinnosti, často sa označuje pojmom finančná stabilita podniku",
    "isFavorite": false
  },
  {
    "id": 36,
    "question": "Dotýka sa dohoda \"CMR\" kabotážnej dopravy?",
    "options": [
      "áno",
      "áno, ale iba na území Európskej únie",
      "áno, iba ak to upravuje príslušná národná legislatíva",
      "áno, pokiaľ sa kabotážna dopravy vykonáva systematicky and pravidelne",
      "nie",
      "záleží to na dohode uvedenej v rámci jednotlivých bilaterálnych dohôd"
    ],
    "answer": "nie",
    "isFavorite": false
  },
  {
    "id": 37,
    "question": "Trasa osobitnej pravidelnej autobusová dopravy:",
    "options": [
      "môže byť vedená súbežne s trasou autobusovej linky pravidelnej dopravy",
      "môže byť vedená súbežne s trasou autobusovej linky nepravidelnej dopravy",
      "môže byť vedená rôznobežne s trasou autobusovej linky pravidelnej dopravy",
      "musí byť vedená po vlastnej trase, bez križovania s ostatnými dopravnými linkami",
      "nemôže byť vedená súbežne s trasou autobusovej linky pravidelnej dopravy",
      "nemôže byť vedená súbežne s trasou autobusovej linky pravidelnej and nepravidelnej dopravy"
    ],
    "answer": "môže byť vedená súbežne s trasou autobusovej linky pravidelnej dopravy",
    "isFavorite": false
  },
  {
    "id": 38,
    "question": "Ktorá charakteristika popisuje \"cestnú dopravu pre vlastnú potrebu\"?",
    "options": [
      "je to doprava, ktorá môže predstavovať hlavnú podnikateľskú činnosť, pre ktorú by bol subjekt založený",
      "je to doprava, ktorá nemôže predstavovať hlavnú podnikateľskú činnosť, pre ktorú by bol subjekt založený",
      "prevážaný tovar je vo vlastníctve podniku, alebo ho podnik predal, prenajal, kúpil, vyrobil, spracoval,",
      "prevážaný tovar je vo vlastníctve podniku, alebo ho podnik prenajal, kúpil, vyrobil, spracoval, opravil",
      "prevážaný tovar môže, ale nemusí byť vo vlastníctve podniku, alebo ho podnik predal, prenajal, kúpil, vyrobil, spracoval, opravil"
    ],
    "answer": "je to doprava, ktorá nemôže predstavovať hlavnú podnikateľskú činnosť, pre ktorú by bol subjekt založený",
    "isFavorite": false
  },
  {
    "id": 39,
    "question": "Identify the ADR symbol (Corrosive substances):",
    "options": [
      "Horľavé kvapaliny",
      "Jedovaté látky",
      "Rádioaktívne látky",
      "Stlačené, skvapalnené and pod tlakom rozpustené plyny",
      "Výbušné látky and predmety",
      "Žieravé látky"
    ],
    "answer": "Žieravé látky",
    "isFavorite": false
  },
  {
    "id": 40,
    "question": "Čo je úlohou dohody \"CMR\"?",
    "options": [
      "cieľom dohody je ochrana osób, majetku and ZP pred možným nebezpečím, kt. vzniká pri prepravách nebezpečných vecí",
      "cieľom dohody je uľahčiť dopravu tovaru prepravovaného pod colnou uzáverou",
      "cieľom dohody je uľahčit dopravu tovaru prepravovaného vo vnútroštátnej doprave",
      "je to dohoda venovaná problematike medzinárodnej prepravy chemických látok rýchlo podliehajúcich skaze and Specializovaným prostriedkom určených pre ich prepravu",
      "je to dohoda venovaná problematike medzinárodnej prepravy potravin rýchlo podliehajúcich skaze and špecializovaným prostriedkom určených pre ich prepravu",
      "upravuje zmluvné vzťahy pri cezhraničnej cestnej preprave zásielok za predpokladu, že jedna z krajin (vysielajúca alebo prijímajúcal je zmluvným členom CMR dohody"
    ],
    "answer": "upravuje zmluvné vzťahy pri cezhraničnej cestnej preprave zásielok za predpokladu, že jedna z krajin (vysielajúca alebo prijímajúcal je zmluvným členom CMR dohody",
    "isFavorite": false
  },
  {
    "id": 41,
    "question": "Ktorej oblasti podnikania v doprave sa netýka zákon č. 56/2012 Z. z.?",
    "options": [
      "medzinárodnej nákladnej cestnej dopravy",
      "nákladnej cestnej dopravy vodidlami do 3,5 t",
      "pravidelnej autobusovej dopravy",
      "príležitostnej medzinárodnej autobusovej dopravy",
      "taxislužby",
      "vnútroštátnej nákladnej cestnej dopravy"
    ],
    "answer": "medzinárodnej nákladnej cestnej dopravy, nákladnej cestnej dopravy vodidlami do 3,5 t",
    "isFavorite": false
  },
  {
    "id": 42,
    "question": "Ako je definovaný \"Chladiaci dopravný prostriedok\" podľa dohody ATP?",
    "options": [
      "je to dopravný prostriedok, kt. skriňa (cisterna) je zostavená z tepelne izolovaných stien, vrátane dverí, podlahy and strechy",
      "je to dopravný prostriedok, kt. skriňa (cisterna) je zostavená z tepelne izolovaných stien, vrátane dverí, podlahy and strechy and ktorý disponuje strojovým zariadením, ktoré umožňuje udržiavať teplotu vo vnútri pri vonkajšej teplote +/- 30 °C",
      "je to dopravný prostriedok, ktorý je vybavený vykurovacím zariadením na zvýšenie teploty vo vnútri skrine najmenej počas 12 hodín, minimálne na stálej úrovni +12 °C",
      "je to dopravný prostriedok, ktorý je vybavený vykurovacím zariadením na zvýšenie teploty vo vnútri skrine alebo",
      "je to dopravný prostriedok, ktorý používa iný zdroj chladu, ako je mechanická jednotka"
    ],
    "answer": "je to dopravný prostriedok, kt. skriňa (cisterna) je zostavená z tepelne izolovaných stien, vrátane dverí, podlahy and strechy and ktorý disponuje strojovým zariadením, ktoré umožňuje udržiavať teplotu vo vnútri pri vonkajšej teplote +/- 30 °C",
    "isFavorite": false
  },
  {
    "id": 43,
    "question": "Ako sú charakterizované nebezpečné veci podľa dohody ADR ?",
    "options": [
      "sú to látky and predmety, pre ktorých povahu, vlastnosti alebo stav môže byť v súvislosti s ich prepravou ohrozená bezpečnosť osôb. Avšak bezpečnosť zvierat, vecí and prípadne životného prostredia sa do úvahy neberie",
      "sú to látky and predmety, pre ktorých povahu, vlastnosti alebo stav môže byť v súvislosti s ich prepravou ohrozená bezpečnosť osôb, zvierat a vecí prípadne životné prostredie",
      "sú to látky and predmety, pre ktorých povahu, vlastnosti alebo stav môže byť v súvislosti s ich prepravou ohrozená bezpečnosť osôb, zvierat a vecí prípadne životné prostredie. Všetky tieto látky and predmety musí určovať príslušná legislatíva Európskej únie"
    ],
    "answer": "sú to látky and predmety, pre ktorých povahu, vlastnosti alebo stav môže byť v súvislosti s ich prepravou ohrozená bezpečnosť osôb, zvierat and vecí prípadne životné prostredie",
    "isFavorite": false
  },
  {
    "id": 44,
    "question": "Kto vydáva licenciu na vykonávanie verejnej vodnej dopravy v Slovenskej republike ?",
    "options": [
      "Dopravný úrad",
      "Krajský úrad and ministerstvo dopravy",
      "Ministerstvo dopravy",
      "Ministerstvo hospodárstva",
      "Ministerstvo vnútra",
      "Regulačný úrad európskeho spoločenstva"
    ],
    "answer": "Dopravný úrad",
    "isFavorite": false
  },
  {
    "id": 45,
    "question": "Autobusy podľa kapacity klasifikujeme na:",
    "options": [
      "maxibusy, minibusy, midibusy, metrobusy, klasické autobusy",
      "mikrobusy, minibusy, maxibusy, metrobusy, klasické autobusy",
      "mikrobusy, minibusy, midibusy, maxibusy, klasické autobusy",
      "mikrobusy, minibusy, midibusy, metrobusy, klasické autobusy",
      "mikrobusy, minibusy, midibusy, metrobusy, klasické autobusy, maxibusy",
      "mikrobusy, minibusy, midibusy, metrobusy, maxibusy"
    ],
    "answer": "mikrobusy, minibusy, midibusy, metrobusy, klasické autobusy",
    "isFavorite": false
  },
  {
    "id": 46,
    "question": "kto vydáva bezpečnostné osvedčenie, ktoré je potrebné pre podnikanie v železničnej do ?",
    "options": [
      "Dopravný úrad",
      "Krajský úrad",
      "Ministerstvo dopravy",
      "Okresný úrad",
      "Úrad pre reguláciu železničnej dopravy",
      "Železničná spoločnosť Slovensko, a. s."
    ],
    "answer": "Dopravný úrad",
    "isFavorite": false
  },
  {
    "id": 47,
    "question": "Koľko dní nasledujúcich po sebe bez prerušenia môže vodič venovať vedeniu motorového vozidla ?",
    "options": [
      "14",
      "3",
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": "6",
    "isFavorite": false
  },
  {
    "id": 48,
    "question": "Ako je definovaný \"Izotermický dopravný prostriedok\" podľa dohody ATP?",
    "options": [
      "je to dopravný prostriedok, kt. skriňa (cisterna) je zostavená z tepelne izolovaných stien, vrátane dverí, podlahy and strechy",
      "je to dopravný prostriedok, kt. skriňa (cisterna) je zostavená z tepelne izolovaných stien, vrátane dverí, podlahy and strechy and ktorý disponuje strojovým zariadením, ktoré umožňuje udržiavať teplotu vo vnútri pri vonkajšej teplote +/- 30 °C",
      "je to dopravný prostriedok, ktorý je vybavený vykurovacím zariadením na zvýšenie teploty vo vnútri skrine alebo chladiacim zariadením na zníženie teploty najmenej počas 12 hodín, minimálne na stálej úrovni +12 °C až - 12 °C"
    ],
    "answer": "je to dopravný prostriedok, kt. skriňa (cisterna) je zostavená z tepelne izolovaných stien, vrátane dverí, podlahy and strechy",
    "isFavorite": false
  },
  {
    "id": 49,
    "question": "Dvojkĺbové autobusy môžu dosahovať dĺžku až:",
    "options": [
      "19 metrov",
      "22 metrov",
      "24 metrov",
      "26 metrov",
      "28 metrov",
      "33 metrov"
    ],
    "answer": "24 metrov",
    "isFavorite": false
  },
  {
    "id": 50,
    "question": "Najčastejšia dĺžka kĺbových autobusov je:",
    "options": [
      "12 metrov",
      "14 metrov",
      "15 metrov",
      "18 metrov",
      "20 metrov",
      "24 metrov"
    ],
    "answer": "18 metrov",
    "isFavorite": false
  },
  {
    "id": 51,
    "question": "Cestovný poriadok zostavuje dopravca:",
    "options": [
      "samostatne alebo spoločne pre každú autobusovú linku",
      "samostatne pre každú autobusovú linku podľa vlastného uváženia",
      "samostatne pre každú vnútroštátnu autobusovú linku and spoločne pre všetky medzinárodné linky",
      "spoločne pre každú autobusovú linku podľa pokynov uvedených v dopravnej licencii",
      "zásadne spoločne pre všetky autobusové linky, ktoré prevádzkuje"
    ],
    "answer": "samostatne pre každú autobusovú linku podľa vlastného uváženia",
    "isFavorite": false
  },
  {
    "id": 52,
    "question": "Podnikateľ prevádzkujúci autobusovú dopravu musí mať minimálny vek",
    "options": [
      "18 rokov",
      "18 rokov and minimálne 3 ročnú prax v odbore podnikania",
      "21 rokov",
      "21 rokov and minimálne 3 ročnú prax v odbore podnikania",
      "24 rokov and minimálne 3 ročnú prax v odbore podnikania",
      "minimálny vek pre prevádzkovateľa autobusovej dopravy nie je stanovený"
    ],
    "answer": "21 rokov",
    "isFavorite": false
  },
  {
    "id": 53,
    "question": "V ktorom roku bola dohoda TIR zásadne revidovaná ?",
    "options": [
      "1959",
      "1960",
      "1965",
      "1966",
      "1975",
      "1976"
    ],
    "answer": "1975",
    "isFavorite": false
  },
  {
    "id": 54,
    "question": "Aký je cieľ medzinárodnej dohody ATP?",
    "options": [
      "cieľom dohody ATP je zjednotenie",
      "cieľom dohody ATP je zlepšenie podmienok bezcolnej prepravy potravín rýchlo podliejacich skaze, zachovaniu ich kvality and rozvoju obchodu s nimi",
      "cieľom dohody ATP je zlepšenie podmienok prepravy potravín and chemických látok rýchlo podliehajúcich skaze, zachovaniu ich kvality and rozvoju obchodu s nimi",
      "cieľom dohody ATP je zlepšenie podmienok prepravy potravín rýchlo podliehajúcich skaze, zachovaniu ich kvality and rozvoju obchodu s nimi",
      "cieľom dohody ATP je zlepšenie podmienok prepravy rôznych typov nákladov rýchlo podliehajúcich skaze, zachovaniu ich kvality and rozvoju obchodu snimi",
      "cieľom dohody ATP je zlepšenie podmienok v rámci vnútroštátnej prepravy potravín rýchlo podliehajúcich skaze, zachovaniu ich kvality and rozvoju obchodu s nimi na Slovensku and v EÚ"
    ],
    "answer": "cieľom dohody ATP je zlepšenie podmienok prepravy potravín rýchlo podliehajúcich skaze, zachovaniu ich kvality and rozvoju obchodu s nimi",
    "isFavorite": false
  },
  {
    "id": 55,
    "question": "Identify the ADR symbol (Explosive substances):",
    "options": [
      "Horľavé kvapaliny",
      "Jedovaté látky",
      "Rádioaktívne látky",
      "Stlačené, skvapalnené and pod tlakom rozpustené plyny",
      "Výbušné látky and predmety",
      "Žieravé látky"
    ],
    "answer": "Výbušné látky and predmety",
    "isFavorite": false
  },
  {
    "id": 56,
    "question": "Colná dohoda TIR je založená na štyroch základných princípoch tranzitného systému: tovar je prepravovaný v colne bezpečných vozidlách alebo kontajneroch, clá and dane viazané na tovar sú počas doby prepravnej operácie zaistené medzinárodne platnou zárukou, tovar sprevádza medzinárodne uznávaný doklad karnet, ktorý slúži ako colné prehlásenie and kontrolný doklad v krajine odoslania, tranzitu and určenia, priložené colné uzávery, záznamy and kontrolné opatrenia colných úradov v krajine odoslania sú uznávané v tranzitných krajinách and v krajinách určenia.",
    "options": [
      "True",
      "False"
    ],
    "answer": "True",
    "isFavorite": false
  },
  {
    "id": 57,
    "question": "Koncesia sa udeľuje na",
    "options": [
      "10 rokov",
      "15 rokov",
      "20 rokov",
      "5 rokov"
    ],
    "answer": "10 rokov",
    "isFavorite": false
  },
  {
    "id": 58,
    "question": "Ako sa nazýva \"prevádzkovateľ cestnej dopravy\"?",
    "options": [
      "dopravca",
      "doručovateľ",
      "kuriér",
      "prepravca",
      "špeditér",
      "zasielateľ"
    ],
    "answer": "dopravca",
    "isFavorite": false
  },
  {
    "id": 59,
    "question": "Vodnou dopravou je preprava tovaru and osôb plavidlami na vodných cestách na účely podnikania vtedy, ak",
    "options": [
      "je vykonávaná nepravidelne",
      "je vykonávaná pravidelne",
      "je vykonávaná pravidelne and nepravidelne",
      "je vykonávaná podľa pokynov dopravného úradu",
      "je vykonávaná podľa pokynov ministerstva dopravy",
      "je vykonávaná podľa pokynov príslušného okresného úradu v sídle kraja"
    ],
    "answer": "je vykonávaná pravidelne and nepravidelne",
    "isFavorite": false
  },
  {
    "id": 60,
    "question": "Dohoda ATP sa vzťahuje na:",
    "options": [
      "vzťahuje sa len na cestnú dopravu",
      "vzťahuje sa len na leteckú dopravu",
      "vzťahuje sa len na námornú dopravu",
      "vzťahuje sa len na železničnú dopravu",
      "vzťahuje sa na cestnú and železničnú dopravu",
      "vzťahuje sa na námornú and leteckú dopravu"
    ],
    "answer": "vzťahuje sa na cestnú and železničnú dopravu",
    "isFavorite": false
  },
  {
    "id": 61,
    "question": "Co označuje písmeno (v) zo základných parametrov dopravného prúdu?",
    "options": [
      "frekvenciu",
      "hustotu",
      "intenzitu",
      "nosnosť",
      "rýchlosť",
      "tok"
    ],
    "answer": "rýchlosť",
    "isFavorite": false
  }
];

export default function App() {
  // --- STATE ---
  const [allCards, setAllCards] = useState(INITIAL_CARDS);
  const [mode, setMode] = useState('all'); // 'all' | 'favorites'
  const [indices, setIndices] = useState({ all: 0, favorites: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  // --- REFS ---
  const cardContainerRef = useRef(null);
  const cardRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  // --- DERIVED DATA ---
  const filteredCards = useMemo(() => {
    return mode === 'all' ? allCards : allCards.filter(c => c.isFavorite);
  }, [allCards, mode]);

  const currentIndex = mode === 'all' ? indices.all : indices.favorites;
  const currentCard = filteredCards[currentIndex];

  // --- HELPERS ---
  const updateIndex = (newIndex) => {
    setIndices(prev => ({
      ...prev,
      [mode]: Math.max(0, Math.min(newIndex, filteredCards.length - 1))
    }));
    setIsFlipped(false);
  };

  const nextCard = useCallback(() => {
    if (currentIndex < filteredCards.length - 1) {
      animateSlide(1);
    }
  }, [currentIndex, filteredCards.length]);

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      animateSlide(-1);
    }
  }, [currentIndex]);

  const toggleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const toggleFavorite = (id) => {
    if (mode === 'favorites' && currentCard.id === id) {
      // Animate out before removing
      gsap.to(cardRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setAllCards(prev => prev.map(c => 
            c.id === id ? { ...c, isFavorite: false } : c
          ));
          // If it was the last card, we need to move index back
          if (currentIndex >= filteredCards.length - 1 && currentIndex > 0) {
            setIndices(prev => ({ ...prev, favorites: prev.favorites - 1 }));
          }
          gsap.fromTo(cardRef.current, { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 });
        }
      });
    } else {
      setAllCards(prev => prev.map(c => 
        c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
      ));
    }
  };

  // --- ANIMATIONS ---
  const animateSlide = (direction) => {
    const tl = gsap.timeline({
      onComplete: () => {
        updateIndex(currentIndex + direction);
        gsap.fromTo(cardRef.current, 
          { x: direction * 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
        );
      }
    });

    tl.to(cardRef.current, {
      x: -direction * 100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    });
  };

  const shuffleDeck = () => {
    setIsShuffling(true);
    const tl = gsap.timeline({
      onComplete: () => {
        setAllCards(prev => [...prev].sort(() => Math.random() - 0.5));
        setIndices({ all: 0, favorites: 0 });
        setIsShuffling(false);
        gsap.fromTo(cardRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });
      }
    });

    tl.to(".card-element", {
      x: (i) => (i % 2 === 0 ? 50 : -50),
      rotation: (i) => (i % 2 === 0 ? 10 : -10),
      stagger: 0.05,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });
    tl.to(cardRef.current, { scale: 0.9, opacity: 0, duration: 0.3 });
  };

  // Handle auto-next when unstarring in favorites
  useEffect(() => {
    if (mode === 'favorites' && filteredCards.length > 0) {
      if (currentIndex >= filteredCards.length) {
        updateIndex(Math.max(0, filteredCards.length - 1));
      }
    }
  }, [filteredCards, mode, currentIndex]);

  // Flip Animation
  useGSAP(() => {
    gsap.to(cardRef.current, {
      rotationY: isFlipped ? 180 : 0,
      duration: 0.6,
      ease: "power2.inOut",
      transformStyle: "preserve-3d"
    });
  }, [isFlipped]);

  // Keyboard & Swipes
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextCard();
      if (e.key === 'ArrowLeft') prevCard();
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleFlip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    const obs = Observer.create({
      target: window,
      type: "touch,pointer",
      onLeft: () => nextCard(),
      onRight: () => prevCard(),
      tolerance: 50,
      ignore: ".no-scrollbar"
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      obs.kill();
    };
  }, [nextCard, prevCard, toggleFlip]);

  // --- RENDER ---
  return (
    <div className="min-h-screen flex flex-col items-center pt-4 pb-12 px-6 max-w-[1200px] mx-auto overflow-x-hidden">
      
      {/* HEADER & MODE SWITCHER */}
      <header className="w-full flex justify-center items-center mb-8">
        <div className="bg-linen p-1 rounded-full flex gap-1 border border-silver-mist">
          <button 
            onClick={() => setMode('all')}
            className={`px-6 py-2 rounded-full text-body font-semibold transition-all ${mode === 'all' ? 'bg-graphite text-chalk shadow-md' : 'text-ink hover:bg-parchment'}`}
          >
            All Cards
          </button>
          <button 
            onClick={() => setMode('favorites')}
            className={`px-6 py-2 rounded-full text-body font-semibold transition-all ${mode === 'favorites' ? 'bg-graphite text-chalk shadow-md' : 'text-ink hover:bg-parchment'}`}
          >
            Favorites
          </button>
        </div>
      </header>

      {/* MAIN CARD AREA */}
      <main className="flex-1 w-full flex flex-col items-center justify-start md:justify-center gap-12 pb-32">
        {filteredCards.length > 0 ? (
          <div className="w-full max-w-[600px] relative">
            
            {/* WRAPPER FOR TRANSFORMED ELEMENTS */}
            <div className="perspective-1000 relative">
              <div 
                ref={cardRef}
                onClick={toggleFlip}
                className="card-element preserve-3d relative w-full min-h-[320px] cursor-pointer"
              >
                {/* FRONT */}
                <div 
                  ref={frontRef}
                  className="backface-hidden relative bg-chalk border border-silver-mist rounded-xl p-6 md:p-12 shadow-slite flex flex-col justify-between"
                >
                  <div>
                    <h2 className="font-serif text-[20px] md:text-[24px] text-ink leading-tight mb-8">
                      {currentCard.question}
                    </h2>
                    <div className="space-y-3">
                      {currentCard.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-4 text-slate group">
                          <span className="w-8 h-8 shrink-0 rounded-full border border-silver-mist flex items-center justify-center text-[12px] font-bold group-hover:border-ink group-hover:text-ink transition-colors">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="text-body font-sans">{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BACK */}
                <div 
                  ref={backRef}
                  className="backface-hidden rotate-y-180 absolute inset-0 bg-chalk border border-silver-mist rounded-xl p-6 md:p-12 shadow-slite flex flex-col items-center justify-center text-center overflow-y-auto"
                >
                  <div className="bg-blossom text-mauve px-3 py-1 rounded-full text-[11px] font-bold mb-6 uppercase tracking-wider">
                    Correct Answer
                  </div>
                  <div className="font-serif text-[24px] md:text-[28px] text-ink leading-tight">
                    {currentCard.answer}
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS (Outside perspective-1000) */}
            <div className="flex overflow-x-auto md:flex-wrap justify-start md:justify-between items-center mt-4 w-full px-4 gap-x-4 md:gap-x-8 no-scrollbar flex-nowrap snap-x snap-mandatory">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleFavorite(currentCard.id); }}
                className="group flex items-center gap-2 text-slate hover:text-ink transition-colors font-semibold text-[13px] md:text-[14px] whitespace-nowrap bg-linen/50 md:bg-transparent px-4 py-2 md:p-0 rounded-full md:rounded-none shrink-0 snap-start"
              >
                <Star 
                  size={18} 
                  className={`transition-colors ${currentCard.isFavorite ? 'fill-ochre stroke-ochre' : 'stroke-ash group-hover:stroke-ink'}`} 
                />
                Додати в обрані
              </button>

              <button 
                onClick={shuffleDeck}
                disabled={isShuffling || filteredCards.length <= 1}
                className="flex items-center gap-2 text-slate hover:text-ink transition-colors font-semibold text-[13px] md:text-[14px] disabled:opacity-30 whitespace-nowrap bg-linen/50 md:bg-transparent px-4 py-2 md:p-0 rounded-full md:rounded-none shrink-0 snap-start"
              >
                <Shuffle size={18} />
                Перемішати
              </button>

              <button 
                onClick={() => {
                  setIndices({ all: 0, favorites: 0 });
                  setIsFlipped(false);
                  gsap.fromTo(cardRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
                }}
                className="flex items-center gap-2 text-slate hover:text-ink transition-colors font-semibold text-[13px] md:text-[14px] whitespace-nowrap bg-linen/50 md:bg-transparent px-4 py-2 md:p-0 rounded-full md:rounded-none shrink-0 snap-start"
              >
                <RotateCcw size={18} />
                Почати спочатку
              </button>
              
              <div className="w-4 shrink-0 md:hidden" />
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-chalk border border-silver-mist border-dashed rounded-xl w-full max-w-[600px] shadow-slite px-8">
            <div className="w-16 h-16 bg-linen rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="text-mauve" size={32} />
            </div>
            <h2 className="font-serif text-[24px] text-ink mb-4">Your Favorites is empty</h2>
            <p className="text-slate font-sans mb-8">Star the cards you find difficult to practice them here.</p>
            <button 
              onClick={() => setMode('all')}
              className="bg-graphite text-chalk px-8 py-3 rounded-full font-semibold shadow-md hover:bg-black transition-all"
            >
              Browse All Cards
            </button>
          </div>
        )}
      </main>

      {/* STICKY NAVIGATION FOR MOBILE / STATIC FOR DESKTOP */}
      {filteredCards.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-parchment/95 backdrop-blur-md p-6 pb-10 md:pb-8 z-[100] border-t border-silver-mist/30 md:static md:bg-transparent md:backdrop-blur-none md:p-0 md:border-none md:mt-16 md:mb-12 w-full max-w-[600px] mx-auto">
          <div className="flex justify-between items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); prevCard(); }}
              disabled={currentIndex === 0}
              className="flex-1 max-w-[180px] h-[48px] md:h-[56px] rounded-full border border-ink flex items-center justify-center gap-2 font-semibold text-ink hover:bg-chalk transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-chalk/80 md:bg-transparent"
            >
              <ChevronLeft size={20} />
              Prev
            </button>

            <span className="text-ash font-sans font-bold text-[13px] md:text-[14px] tracking-widest uppercase min-w-[80px] text-center">
              {currentIndex + 1} / {filteredCards.length}
            </span>

            <button 
              onClick={(e) => { e.stopPropagation(); nextCard(); }}
              disabled={currentIndex === filteredCards.length - 1}
              className="flex-1 max-w-[180px] h-[48px] md:h-[56px] rounded-full bg-graphite text-chalk flex items-center justify-center gap-2 font-semibold shadow-md hover:bg-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* FONT IMPORTS (Fallbacks included in CSS) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
      `}</style>
    </div>
  );
}
