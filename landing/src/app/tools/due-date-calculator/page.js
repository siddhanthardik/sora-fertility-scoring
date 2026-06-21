"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Baby, Download, Mail, Heart, Calendar, CalendarClock, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { trackEvent } from '../../../lib/analytics';

const insightsData = {
  default: { emoji: "🌱", size: "Growing quickly!", clinicalSize: "", tagline: "A time of rapid development.", what: ["Your baby is developing rapidly.", "Important structures are forming."], didYouKnow: "Every pregnancy is unique, and babies grow at their own pace.", tip: "Stay hydrated and listen to your body's changing needs." },
  1: { emoji: "🩸", size: "N/A", clinicalSize: "Length: N/A • Weight: N/A", tagline: "Pre-Conception / Period", what: ["Your body is preparing for a new cycle.", "The uterine lining is shedding."], didYouKnow: "Pregnancy is calculated from the first day of your last period.", tip: "Start a prenatal vitamin with folic acid." },
  2: { emoji: "🥚", size: "N/A", clinicalSize: "Length: N/A • Weight: N/A", tagline: "Pre-Conception / Ovulation", what: ["An egg is maturing in the ovary.", "Ovulation is about to occur."], didYouKnow: "Sperm can live in the female reproductive tract for up to 5 days.", tip: "Track your ovulation signs like basal body temperature." },
  3: { emoji: "✨", size: "a pinhead", clinicalSize: "Length: Microscopic • Weight: Microscopic", tagline: "Fertilization & Implantation", what: ["The sperm and egg have met.", "The zygote is rapidly dividing and traveling to the uterus."], didYouKnow: "The sex and genetic traits of the baby are already determined.", tip: "Avoid alcohol and smoking as early development begins." },
  4: { emoji: "🍒", size: "a poppy seed", clinicalSize: "Length: ~0.1 cm • Weight: <1 g", tagline: "Tiny but mighty!", what: ["Implantation is completing.", "The amniotic sac is forming.", "The neural tube is beginning to develop."], didYouKnow: "Many women don't yet realize they're pregnant during this week.", tip: "Begin taking folic acid if you haven't already." },
  5: { emoji: "🍎", size: "an apple seed", clinicalSize: "Length: ~0.3 cm • Weight: <1 g", tagline: "The heart begins to beat!", what: ["The heart is beginning to form and beat.", "Major organs like kidneys and liver start developing.", "The umbilical cord is developing."], didYouKnow: "Your baby's heart is beating at around 110 beats per minute.", tip: "Schedule your first prenatal appointment with your healthcare provider." },
  6: { emoji: "🫛", size: "a sweet pea", clinicalSize: "Length: ~0.6 cm • Weight: <1 g", tagline: "Facial features begin to form.", what: ["The heart can often be seen on early ultrasound.", "Jaw, cheeks, and chin are starting to form.", "Limb buds appear."], didYouKnow: "Your baby is making little spontaneous movements, though you can't feel them.", tip: "If you're experiencing morning sickness, try eating small, frequent meals." },
  7: { emoji: "🫐", size: "a blueberry", clinicalSize: "Length: ~1.0 cm • Weight: <1 g", tagline: "Brain is developing rapidly.", what: ["New brain cells are generating at a rate of 100 per minute.", "Arm and leg joints begin to form.", "Kidneys are preparing to produce urine."], didYouKnow: "Your baby has distinct, webbed fingers and toes forming.", tip: "Drink plenty of water to help your body increase blood volume." },
  8: { emoji: "🍓", size: "a raspberry", clinicalSize: "Length: ~1.6 cm • Weight: ~1 g", tagline: "Moving constantly!", what: ["Facial structures continue developing.", "Heartbeat can usually be heard on doppler.", "Limb buds become more defined."], didYouKnow: "Your baby's taste buds are beginning to form on their tiny tongue.", tip: "Wear a supportive bra as your breasts may be feeling tender." },
  9: { emoji: "🍇", size: "a grape", clinicalSize: "Length: ~2.3 cm • Weight: ~2 g", tagline: "Starting to look human!", what: ["Eyes are fully formed but fused shut.", "Ears are taking shape.", "Fetal movement increases."], didYouKnow: "The embryonic tail has completely disappeared.", tip: "Listen to your body and rest when you feel tired." },
  10: { emoji: "🫒", size: "a green olive", clinicalSize: "Length: ~3.1 cm • Weight: ~4 g", tagline: "Now a fetus!", what: ["Bones and cartilage are forming.", "Tooth buds are developing.", "The stomach is producing digestive juices."], didYouKnow: "Your baby's vital organs are fully formed and starting to function.", tip: "Consider prenatal genetic testing if it aligns with your preferences." },
  11: { emoji: "🍋", size: "a small lime", clinicalSize: "Length: ~4.1 cm • Weight: ~7 g", tagline: "Practicing breathing!", what: ["Fingers and toes are no longer webbed.", "Hair follicles are forming.", "Nail beds are developing."], didYouKnow: "Your baby can yawn and swallow amniotic fluid.", tip: "Moisturize your belly to help with stretching skin." },
  12: { emoji: "🍋", size: "a lime", clinicalSize: "Length: ~5.4 cm • Weight: ~14 g", tagline: "Almost fully formed!", what: ["Reflexes are developing.", "The digestive system is practicing contractions.", "Bone marrow begins making white blood cells."], didYouKnow: "Your baby's vocal cords are forming, preparing for that first cry.", tip: "Discuss first trimester screening options with your doctor." },
  13: { emoji: "🍑", size: "a peach", clinicalSize: "Length: ~7.4 cm • Weight: ~23 g", tagline: "Entering the second trimester!", what: ["Fingerprints are already formed.", "Intestines move from the umbilical cord to the abdomen.", "Vocal cords are developing."], didYouKnow: "The placenta is now fully providing oxygen and nutrients.", tip: "Celebrate making it to the second trimester!" },
  14: { emoji: "🍐", size: "a lemon", clinicalSize: "Length: ~8.7 cm • Weight: ~43 g", tagline: "Standing up straight!", what: ["The neck is elongating.", "Spleen is producing red blood cells.", "Facial expressions like squinting and frowning happen."], didYouKnow: "Your baby may start sucking their thumb.", tip: "Your energy levels might start increasing soon." },
  15: { emoji: "🍎", size: "an apple", clinicalSize: "Length: ~10.1 cm • Weight: ~70 g", tagline: "Hearing develops!", what: ["Ears are moving to their final position.", "Bones are getting harder.", "The baby is covered in fine hair called lanugo."], didYouKnow: "Your baby can sense light from outside the womb.", tip: "Start looking into childbirth classes in your area." },
  16: { emoji: "🥑", size: "an avocado", clinicalSize: "Length: ~11.6 cm • Weight: ~100 g", tagline: "Hearing your voice.", what: ["The heart is pumping 25 quarts of blood a day.", "Scalp patterning has begun.", "You might start feeling 'flutters' (quickening)."], didYouKnow: "Your baby can hear your heartbeat and the rumble of your stomach.", tip: "Consider starting to sleep on your side to improve blood flow." },
  17: { emoji: "🧅", size: "a turnip", clinicalSize: "Length: ~13.0 cm • Weight: ~140 g", tagline: "Gaining fat!", what: ["Fat stores are beginning to accumulate.", "The umbilical cord is getting thicker and stronger.", "Skeleton is hardening from cartilage to bone."], didYouKnow: "Your baby is practicing sucking and swallowing reflexes.", tip: "Try talking or singing to your baby!" },
  18: { emoji: "🫑", size: "a bell pepper", clinicalSize: "Length: ~14.2 cm • Weight: ~190 g", tagline: "Yawning and hiccuping!", what: ["Nerves are developing a protective myelin covering.", "Fallopian tubes or prostate gland are forming.", "You may feel distinct kicks soon."], didYouKnow: "Your baby's ears stand out from their head now.", tip: "It's almost time for your mid-pregnancy anatomy scan." },
  19: { emoji: "🍅", size: "a large tomato", clinicalSize: "Length: ~15.3 cm • Weight: ~240 g", tagline: "Developing senses!", what: ["Brain is designating specialized areas for smell, taste, hearing, vision, and touch.", "Vernix caseosa is forming on the skin.", "Kidneys continue to make urine."], didYouKnow: "If you're having a girl, her ovaries already contain millions of eggs.", tip: "If you have round ligament pain, try changing positions slowly." },
  20: { emoji: "🥭", size: "a mango", clinicalSize: "Length: ~25.6 cm • Weight: ~300 g", tagline: "Halfway there!", what: ["The baby can swallow.", "Meconium is forming in the bowels.", "You can likely find out the sex on ultrasound."], didYouKnow: "Your baby is covered in a white protective coating called vernix.", tip: "It's time for the anatomy scan! Enjoy seeing your baby in detail." },
  21: { emoji: "🥕", size: "a carrot", clinicalSize: "Length: ~26.7 cm • Weight: ~360 g", tagline: "Tasting what you eat!", what: ["Taste buds are working.", "The digestive system is maturing.", "Bone marrow is taking over red blood cell production."], didYouKnow: "Amniotic fluid flavors change based on your diet.", tip: "Eat a varied diet to introduce different flavors to your baby." },
  22: { emoji: "🥥", size: "a coconut", clinicalSize: "Length: ~27.8 cm • Weight: ~430 g", tagline: "Looking like a newborn!", what: ["Lips and eyebrows are more distinct.", "Pancreas is developing steadily.", "The brain is growing rapidly."], didYouKnow: "Your baby has developed their own unique grip.", tip: "Stay hydrated to maintain amniotic fluid levels." },
  23: { emoji: "🍇", size: "a large grapefruit", clinicalSize: "Length: ~28.9 cm • Weight: ~500 g", tagline: "Hearing loud noises!", what: ["Lungs are beginning to produce surfactant.", "Bones in the middle ear are hardening.", "Blood vessels in the lungs are developing."], didYouKnow: "Loud noises might make your baby jump in the womb.", tip: "Keep moving safely, like walking or prenatal yoga." },
  24: { emoji: "🌽", size: "an ear of corn", clinicalSize: "Length: ~30.0 cm • Weight: ~600 g", tagline: "Practicing breathing.", what: ["Lungs are developing branches.", "Inner ear is fully developed, helping with balance.", "The baby is gaining baby fat."], didYouKnow: "Your baby's brain is rapidly growing, and they can hear outside noises clearly.", tip: "Be aware of the gestational diabetes screening test coming up." },
  25: { emoji: "🥦", size: "a cauliflower", clinicalSize: "Length: ~34.6 cm • Weight: ~660 g", tagline: "Growing hair!", what: ["Capillaries are forming under the skin.", "Hair color and texture are becoming visible.", "Nostrils begin to open."], didYouKnow: "Your baby is responding to touch and sound more consistently.", tip: "Discuss your birth plan options with your partner or doula." },
  26: { emoji: "🥬", size: "a lettuce", clinicalSize: "Length: ~35.6 cm • Weight: ~760 g", tagline: "Opening eyes!", what: ["The eyes are beginning to open.", "Spine is getting stronger to support the growing body.", "Lungs are continuing to mature."], didYouKnow: "Your baby has been practicing breathing using amniotic fluid.", tip: "Check if your hospital offers maternity ward tours." },
  27: { emoji: "🥦", size: "a head of cauliflower", clinicalSize: "Length: ~36.6 cm • Weight: ~875 g", tagline: "Welcome to the third trimester!", what: ["Brain activity shows sleep and wake cycles.", "Hiccups are common and easily felt.", "More fat is accumulating."], didYouKnow: "Your baby recognizes your voice and your partner's voice.", tip: "Consider taking a breastfeeding or newborn care class." },
  28: { emoji: "🍆", size: "an eggplant", clinicalSize: "Length: ~37.6 cm • Weight: ~1.0 kg", tagline: "Eyes wide open.", what: ["Eyes can open and close.", "Brain is developing billions of neurons.", "The baby is dreaming."], didYouKnow: "Your baby's heartbeat can sometimes be heard just by putting an ear to your belly.", tip: "Start keeping track of your baby's kick counts." },
  29: { emoji: "🎃", size: "a butternut squash", clinicalSize: "Length: ~38.6 cm • Weight: ~1.1 kg", tagline: "Gaining weight!", what: ["Muscles and lungs are continuing to mature.", "The head is growing to accommodate the developing brain.", "Bones are fully developed but still soft."], didYouKnow: "About half a liter of amniotic fluid surrounds your baby.", tip: "Eat smaller, more frequent meals if you have heartburn." },
  30: { emoji: "🥬", size: "a large cabbage", clinicalSize: "Length: ~39.9 cm • Weight: ~1.3 kg", tagline: "Brain getting wrinkly!", what: ["Brain is taking on its characteristic wrinkled appearance.", "Lanugo starts to disappear.", "Bone marrow is completely in charge of red blood cells."], didYouKnow: "Your baby's eyes can track light sources from outside.", tip: "Research pediatricians in your area." },
  31: { emoji: "🥥", size: "a coconut", clinicalSize: "Length: ~41.1 cm • Weight: ~1.5 kg", tagline: "Pedaling and kicking!", what: ["The baby is very active.", "Connections in the brain are forming fast.", "The reproductive system continues to develop."], didYouKnow: "Your baby is urinating several cups a day into the amniotic fluid.", tip: "Pack your hospital bag if you haven't already." },
  32: { emoji: "🍈", size: "a squash", clinicalSize: "Length: ~42.4 cm • Weight: ~1.7 kg", tagline: "Gaining weight rapidly.", what: ["Fingernails have grown to the fingertips.", "The baby is practicing breathing movements.", "Most major organ development is complete."], didYouKnow: "Your baby is gaining about half a pound a week right now.", tip: "Pack your hospital bag so you are prepared for the big day." },
  33: { emoji: "🍍", size: "a pineapple", clinicalSize: "Length: ~43.7 cm • Weight: ~1.9 kg", tagline: "Getting crowded!", what: ["Immune system is receiving antibodies from you.", "Bones are hardening, except for the skull.", "Amniotic fluid is at its highest level."], didYouKnow: "Your baby's skull bones aren't fused so they can overlap during birth.", tip: "Install your infant car seat and get it inspected." },
  34: { emoji: "🍈", size: "a cantaloupe", clinicalSize: "Length: ~45.0 cm • Weight: ~2.1 kg", tagline: "Listening closely!", what: ["The central nervous system is maturing.", "Lungs are almost fully developed.", "Fat layers are smoothing the skin."], didYouKnow: "Your baby sleeps for long stretches and even dreams.", tip: "Familiarize yourself with the signs of early labor." },
  35: { emoji: "🍉", size: "a honeydew melon", clinicalSize: "Length: ~46.2 cm • Weight: ~2.4 kg", tagline: "Almost full term!", what: ["Kidneys are fully developed.", "Liver can process some waste products.", "Physical space is very tight now."], didYouKnow: "Most babies are settling into a head-down position now.", tip: "Finalize any last-minute nursery preparations." },
  36: { emoji: "🥥", size: "a papaya", clinicalSize: "Length: ~47.4 cm • Weight: ~2.6 kg", tagline: "Getting into position.", what: ["Lanugo is mostly gone.", "The baby is dropping into the pelvis.", "Lungs are fully mature for most babies."], didYouKnow: "Your baby takes up most of the amniotic sac, so movements may feel more like rolls.", tip: "Take your Group B Strep (GBS) test this week or next." },
  37: { emoji: "🥬", size: "a romaine heart", clinicalSize: "Length: ~48.6 cm • Weight: ~2.8 kg", tagline: "Early term!", what: ["Practicing breathing, sucking, and swallowing.", "Grasping reflex is strong.", "Your baby is considered 'early term' now."], didYouKnow: "Your baby is shedding the vernix caseosa into the amniotic fluid.", tip: "Rest, hydrate, and try to relax as the due date approaches." },
  38: { emoji: "🎃", size: "a winter squash", clinicalSize: "Length: ~49.8 cm • Weight: ~3.1 kg", tagline: "Ready anytime!", what: ["Brain and lungs are still fine-tuning.", "Vocal cords are ready for crying.", "Eye color is established (though it may change after birth)."], didYouKnow: "Your baby has accumulated enough fat to stay warm after birth.", tip: "Keep your phone charged and hospital bag by the door." },
  39: { emoji: "🍉", size: "a mini watermelon", clinicalSize: "Length: ~50.7 cm • Weight: ~3.3 kg", tagline: "Waiting game!", what: ["Skin is becoming thicker and paler.", "New skin cells are replacing old ones.", "The baby is continuing to build fat."], didYouKnow: "Your baby's immune system is still receiving your antibodies.", tip: "Try gentle stretches or walking to help with discomfort." },
  40: { emoji: "🍉", size: "a watermelon", clinicalSize: "Length: ~51.2 cm • Weight: ~3.4 kg", tagline: "Ready to meet the world!", what: ["Your baby is fully cooked!", "Reflexes are coordinated.", "Fingernails may need a trim after birth."], didYouKnow: "Only 4% of babies are born on their exact due date.", tip: "Rest as much as possible and trust your body." },
  41: { emoji: "🍉", size: "a watermelon", clinicalSize: "Length: ~51.5 cm • Weight: ~3.5 kg", tagline: "Past due date!", what: ["Your baby is fully cooked!", "Your doctor will monitor amniotic fluid levels.", "Labor should begin soon naturally or be induced."], didYouKnow: "Being 'overdue' is very common, especially for first-time mothers.", tip: "Stay in close contact with your healthcare provider." },
  42: { emoji: "🍉", size: "a watermelon", clinicalSize: "Length: ~51.7 cm • Weight: ~3.6 kg", tagline: "Time to meet!", what: ["Labor will be induced if it hasn't started.", "Your baby is completely ready for the outside world."], didYouKnow: "Babies born post-term often have slightly longer fingernails and less vernix.", tip: "You're going to meet your baby so soon!" }
};

export default function DueDateCalculator() {
  const [conceptionMethod, setConceptionMethod] = useState('natural');
  const [naturalMethod, setNaturalMethod] = useState('lmp');
  const [dateInput, setDateInput] = useState('');
  const [usWeeks, setUsWeeks] = useState('');
  const [usDays, setUsDays] = useState('');
  const [iuiDate, setIuiDate] = useState('');
  const [ivfType, setIvfType] = useState('day5');
  const [transferDate, setTransferDate] = useState('');
  const [results, setResults] = useState(null);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  React.useEffect(() => {
    trackEvent({ event: "tool_viewed", tool: "due_date_calculator" });
  }, []);

  const trackStart = () => {
    if (!hasTrackedStart) {
      trackEvent({ event: "tool_started", tool: "due_date_calculator" });
      setHasTrackedStart(true);
    }
  };

  const calculateDueDate = (e) => {
    e.preventDefault();
    let edd = null;
    let methodString = "";

    if (conceptionMethod === 'natural') {
      if (naturalMethod === 'lmp') {
        if (!dateInput) return;
        edd = new Date(dateInput);
        edd.setDate(edd.getDate() + 280);
        methodString = "Natural Pregnancy";
      } else if (naturalMethod === 'conception') {
        if (!dateInput) return;
        edd = new Date(dateInput);
        edd.setDate(edd.getDate() + 266);
        methodString = "Natural Pregnancy";
      } else if (naturalMethod === 'ultrasound') {
        if (!dateInput || !usWeeks) return;
        const scanDate = new Date(dateInput);
        const w = parseInt(usWeeks) || 0;
        const d = parseInt(usDays) || 0;
        const totalGestationalDaysAtScan = (w * 7) + d;
        const remainingDays = 280 - totalGestationalDaysAtScan;
        edd = new Date(scanDate);
        edd.setDate(edd.getDate() + remainingDays);
        methodString = "Natural Pregnancy";
      }
    } else if (conceptionMethod === 'iui') {
      if (!iuiDate) return;
      edd = new Date(iuiDate);
      edd.setDate(edd.getDate() + 266);
      methodString = "IUI";
    } else if (conceptionMethod === 'ivf') {
      if (!transferDate) return;
      edd = new Date(transferDate);
      if (ivfType === 'day3') {
        edd.setDate(edd.getDate() + 263);
        methodString = "IVF • Day 3 Embryo Transfer";
      } else if (ivfType === 'day5') {
        edd.setDate(edd.getDate() + 261);
        methodString = "IVF • Day 5 Blastocyst Transfer";
      } else if (ivfType === 'day6') {
        edd.setDate(edd.getDate() + 260);
        methodString = "IVF • Day 6 Blastocyst Transfer";
      }
    }

    if (!edd) return;

    const today = new Date();
    today.setHours(0,0,0,0);
    const eddMidnight = new Date(edd);
    eddMidnight.setHours(0,0,0,0);

    const daysUntilDue = Math.round((eddMidnight - today) / (1000 * 60 * 60 * 24));
    let totalGestationalDays = 280 - daysUntilDue;
    if (totalGestationalDays < 0) totalGestationalDays = 0;
    if (totalGestationalDays > 294) totalGestationalDays = 294;

    const currentWeeks = Math.floor(totalGestationalDays / 7);
    const currentDays = totalGestationalDays % 7;
    
    const formatDate = (date) => date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const formatShortDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const trimester1 = new Date(edd); trimester1.setDate(trimester1.getDate() - 280 + (13 * 7));
    const trimester2 = new Date(edd); trimester2.setDate(trimester2.getDate() - 280 + (27 * 7));

    let trimester = "First Trimester";
    if (currentWeeks >= 14 && currentWeeks < 28) trimester = "Second Trimester";
    if (currentWeeks >= 28) trimester = "Third Trimester";

    const arrivalStart = new Date(edd); arrivalStart.setDate(arrivalStart.getDate() - 21); // 37 weeks
    const arrivalEnd = new Date(edd); arrivalEnd.setDate(arrivalEnd.getDate() + 14); // 42 weeks

    const ntScanStart = new Date(edd); ntScanStart.setDate(ntScanStart.getDate() - 280 + (11 * 7));
    const ntScanEnd = new Date(edd); ntScanEnd.setDate(ntScanEnd.getDate() - 280 + (14 * 7));
    
    const anomalyStart = new Date(edd); anomalyStart.setDate(anomalyStart.getDate() - 280 + (18 * 7));
    const anomalyEnd = new Date(edd); anomalyEnd.setDate(anomalyEnd.getDate() - 280 + (22 * 7));

    const gdmStart = new Date(edd); gdmStart.setDate(gdmStart.getDate() - 280 + (24 * 7));
    const gdmEnd = new Date(edd); gdmEnd.setDate(gdmEnd.getDate() - 280 + (28 * 7));

    const growthDate = new Date(edd); growthDate.setDate(growthDate.getDate() - 280 + (32 * 7));

    let nextMilestone = { name: "NT Scan", desc: "Usually performed between 11–14 weeks.", time: formatShortDate(ntScanStart) + " – " + formatShortDate(ntScanEnd), weeks: 11 };
    if (currentWeeks >= 14) nextMilestone = { name: "Anomaly Scan", desc: "Usually performed between 18–22 weeks to check anatomy.", time: formatShortDate(anomalyStart) + " – " + formatShortDate(anomalyEnd), weeks: 18 };
    if (currentWeeks >= 22) nextMilestone = { name: "Gestational Diabetes Screening", desc: "Usually performed between 24–28 weeks.", time: formatShortDate(gdmStart) + " – " + formatShortDate(gdmEnd), weeks: 24 };
    if (currentWeeks >= 28) nextMilestone = { name: "Growth Scan", desc: "Usually performed around 32 weeks.", time: formatShortDate(growthDate), weeks: 32 };
    if (currentWeeks >= 33) nextMilestone = { name: "Expected Delivery", desc: "The big day is approaching!", time: formatShortDate(edd), weeks: 40 };

    setResults({
      dueDate: formatDate(edd),
      dueDateShort: edd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(),
      gestationalAge: `${currentWeeks} weeks + ${currentDays} days`,
      currentWeeks,
      daysUntilDue,
      weeksLeft: Math.floor(daysUntilDue / 7),
      monthsLeft: Math.round(daysUntilDue / 30.44),
      trimester,
      method: methodString,
      arrivalWindow: `${formatShortDate(arrivalStart)} – ${formatShortDate(arrivalEnd)}`,
      trimester1: formatDate(trimester1),
      trimester2: formatDate(trimester2),
      nextMilestone,
      timeline: {
        w4: formatShortDate(new Date(edd.getTime() - (280-28)*86400000)),
        w12: formatShortDate(new Date(edd.getTime() - (280-84)*86400000)),
        w20: formatShortDate(new Date(edd.getTime() - (280-140)*86400000)),
        w28: formatShortDate(new Date(edd.getTime() - (280-196)*86400000)),
        w40: formatShortDate(edd)
      }
    });
    trackEvent({ event: "tool_completed", tool: "due_date_calculator" });
    setSendSuccess(false);
  };

  const handleSendPdf = async () => {
    if (!email) {
      alert("Please enter an email address to receive the PDF.");
      return;
    }
    setIsSending(true);
    try {
      const res = await fetch('/api/tools/due-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results, email, insights: getInsights() })
      });
      if (res.ok) setSendSuccess(true);
    } catch (err) {
      console.error(err);
    }
    setIsSending(false);
  };

  const handleDownloadPdf = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/tools/due-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results, insights: getInsights() })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SORA_Pregnancy_Timeline.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        trackEvent({ event: "report_downloaded", tool: "due_date_calculator" });
      }
    } catch (err) {
      console.error(err);
    }
    setIsSending(false);
  };

  const getInsights = () => {
    let insights = insightsData.default;
    if (results) {
      if (insightsData[results.currentWeeks]) {
        insights = insightsData[results.currentWeeks];
      } else if (results.currentWeeks > 42) {
        insights = insightsData[42];
      } else if (results.currentWeeks < 1) {
        insights = insightsData[1];
      }
    }
    return insights;
  };
  
  const insights = getInsights();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <style>{`
        .toolLayout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 40px;
        }
        @media (max-width: 900px) {
          .toolLayout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={{ flex: 1, padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }} className="toolLayout">
        <div className="toolContent">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 'bold' }}>
          <Link href="/tools" style={{ color: '#64748b', textDecoration: 'none' }}>Tools Hub</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#ff2a5f' }}>Due Date Calculator</span>
        </div>

        {!results && (
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', color: '#0f172a', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }}>SORA Pregnancy<br/>Due Date Calculator™</h1>
            <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>Calculate your estimated due date for natural conception, IUI, IVF, and embryo transfer pregnancies.</p>
          </div>
        )}

        {!results && (
          <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', marginBottom: '32px', border: '1px solid #f1f5f9' }} onFocusCapture={trackStart} onClickCapture={trackStart}>
            <form onSubmit={calculateDueDate}>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '16px', fontWeight: 'bold', color: '#0f172a', fontSize: '18px' }}>How did conception occur?</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  {['natural', 'iui', 'ivf'].map(method => (
                    <button 
                      key={method}
                      type="button" 
                      onClick={() => setConceptionMethod(method)}
                      style={{ padding: '16px', borderRadius: '16px', border: `2px solid ${conceptionMethod === method ? '#ff2a5f' : '#e2e8f0'}`, background: conceptionMethod === method ? '#fff1f2' : '#fff', color: conceptionMethod === method ? '#e11d48' : '#475569', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      {method === 'natural' ? 'Natural Pregnancy' : method === 'iui' ? 'IUI' : 'IVF / Embryo Transfer'}
                    </button>
                  ))}
                </div>
              </div>

              {conceptionMethod === 'natural' && (
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '20px', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1e293b' }}>Calculation Method</label>
                    <select 
                      value={naturalMethod} 
                      onChange={(e) => setNaturalMethod(e.target.value)}
                      style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none', background: '#fff' }}
                    >
                      <option value="lmp">First day of last menstrual period (LMP)</option>
                      <option value="conception">Estimated conception date</option>
                      <option value="ultrasound">Ultrasound dating</option>
                    </select>
                  </div>
                  
                  {(naturalMethod === 'lmp' || naturalMethod === 'conception') && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1e293b' }}>{naturalMethod === 'lmp' ? 'LMP Date' : 'Conception Date'}</label>
                      <input 
                        type="date" required value={dateInput} onChange={(e) => setDateInput(e.target.value)}
                        style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none', background: '#fff' }}
                      />
                    </div>
                  )}

                  {naturalMethod === 'ultrasound' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1e293b' }}>Scan Date</label>
                        <input 
                          type="date" required value={dateInput} onChange={(e) => setDateInput(e.target.value)}
                          style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none', background: '#fff' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1e293b' }}>Weeks Gestation</label>
                        <input 
                          type="number" min="0" required value={usWeeks} onChange={(e) => setUsWeeks(e.target.value)}
                          style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none', background: '#fff' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1e293b' }}>Days Gestation</label>
                        <input 
                          type="number" min="0" max="6" required value={usDays} onChange={(e) => setUsDays(e.target.value)}
                          style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none', background: '#fff' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {conceptionMethod === 'iui' && (
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '20px', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1e293b' }}>IUI Procedure Date</label>
                  <input 
                    type="date" required value={iuiDate} onChange={(e) => setIuiDate(e.target.value)}
                    style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none', background: '#fff' }}
                  />
                </div>
              )}

              {conceptionMethod === 'ivf' && (
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '20px', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1e293b' }}>What type of embryo transfer did you have?</label>
                    <select 
                      value={ivfType} 
                      onChange={(e) => setIvfType(e.target.value)}
                      style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none', background: '#fff' }}
                    >
                      <option value="day3">Day 3 Embryo Transfer</option>
                      <option value="day5">Day 5 Blastocyst Transfer</option>
                      <option value="day6">Day 6 Blastocyst Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1e293b' }}>Embryo Transfer Date</label>
                    <input 
                      type="date" required value={transferDate} onChange={(e) => setTransferDate(e.target.value)}
                      style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none', background: '#fff' }}
                    />
                  </div>
                </div>
              )}

              <button type="submit" style={{ width: '100%', padding: '12px 24px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Calculate My Due Date
                <ChevronRight size={20} />
              </button>
            </form>
          </div>
        )}

        {results && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>Your Results</h2>
              <button onClick={() => setResults(null)} style={{ background: 'none', border: 'none', color: '#ff2a5f', fontWeight: 'bold', cursor: 'pointer' }}>Recalculate</button>
            </div>

            {/* Row 1: Snapshot and Countdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              
              {/* Hero Snapshot */}
              <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.03, transform: 'rotate(15deg)' }}>
                  <Heart size={200} fill="#000" />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff2a5f', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', marginBottom: '24px' }}>
                  <Heart size={14} fill="#ff2a5f" /> Your Pregnancy Snapshot
                </div>

                <div style={{ color: '#64748b', fontSize: '16px', marginBottom: '4px' }}>Estimated Due Date</div>
                <div style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', marginBottom: '24px', letterSpacing: '-1px', lineHeight: 1.1 }}>
                  {results.dueDateShort}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>{results.gestationalAge} pregnant</div>
                  <div style={{ fontSize: '16px', color: '#475569' }}>{results.trimester}</div>
                  <div style={{ fontSize: '16px', color: '#475569', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9' }}>{results.method}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Baby Size</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>{insights.emoji} {insights.size}</div>
                    {insights.clinicalSize && <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{insights.clinicalSize}</div>}
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Arrival Window</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>{results.arrivalWindow}</div>
                  </div>
                </div>
              </div>

              {/* Countdown Card */}
              <div style={{ background: '#0f172a', borderRadius: '24px', padding: '40px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', marginBottom: '24px' }}>
                  <Clock size={14} /> Countdown
                </div>

                <div style={{ fontSize: '64px', fontWeight: '900', color: '#fff', lineHeight: 1, marginBottom: '8px' }}>
                  {results.daysUntilDue > 0 ? results.daysUntilDue : 0}
                </div>
                <div style={{ fontSize: '20px', color: '#94a3b8', fontWeight: '600', marginBottom: '32px' }}>days remaining</div>

                <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>{results.weeksLeft > 0 ? results.weeksLeft : 0}</div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>weeks left</div>
                  </div>
                  <div style={{ width: '1px', background: '#334155' }}></div>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>{results.monthsLeft > 0 ? results.monthsLeft : 0}</div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>months left</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', fontSize: '15px', color: '#cbd5e1', fontWeight: '600' }}>
                  Only {results.monthsLeft > 0 ? results.monthsLeft : 0} months until you meet your baby ❤️
                </div>
              </div>

            </div>

            {/* Row 2: Journey Timeline and Coming Up Next */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
              
              <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', marginBottom: '32px' }}>
                  <Calendar size={14} /> Pregnancy Journey
                </div>

                {/* Horizontal Timeline */}
                <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '20px' }}>
                  <div style={{ minWidth: '600px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '0 20px' }}>
                    
                    {/* Connecting Line */}
                    <div style={{ position: 'absolute', top: '24px', left: '40px', right: '40px', height: '4px', background: '#f1f5f9', zIndex: 0 }}></div>
                    <div style={{ position: 'absolute', top: '24px', left: '40px', width: `${Math.min((results.currentWeeks / 40) * 100, 100)}%`, maxWidth: 'calc(100% - 80px)', height: '4px', background: '#ff2a5f', zIndex: 0 }}></div>

                    {/* Nodes */}
                    {[
                      { w: 4, label: '4w', date: results.timeline.w4 },
                      { w: 12, label: '12w', date: results.timeline.w12 },
                      { w: 20, label: '20w', date: results.timeline.w20 },
                      { w: 28, label: '28w', date: results.timeline.w28 },
                      { w: 40, label: '40w', date: results.timeline.w40 }
                    ].map((node, i) => {
                      const isPast = results.currentWeeks >= node.w;
                      const isCurrent = Math.abs(results.currentWeeks - node.w) <= 4 && isPast;
                      return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative' }}>
                          <div style={{ color: isPast ? '#0f172a' : '#94a3b8', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>{node.date}</div>
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: isPast ? '#ff2a5f' : '#cbd5e1', border: '4px solid #fff', boxShadow: '0 0 0 2px ' + (isPast ? '#ff2a5f' : '#e2e8f0'), marginBottom: '12px' }}></div>
                          <div style={{ fontWeight: '900', fontSize: '18px', color: isPast ? '#0f172a' : '#94a3b8' }}>{node.label}</div>
                          {isCurrent && <div style={{ position: 'absolute', top: '-30px', background: '#0f172a', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '100px', textTransform: 'uppercase' }}>You are here</div>}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Coming Up Next */}
                <div style={{ marginTop: '32px', background: '#f8fafc', padding: '24px', borderRadius: '16px', borderLeft: '4px solid #ff2a5f' }}>
                  <div style={{ color: '#ff2a5f', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Coming Up Next</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}>{results.nextMilestone.name}</div>
                  <div style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>{results.nextMilestone.time}</div>
                  <div style={{ fontSize: '15px', color: '#475569' }}>{results.nextMilestone.desc}</div>
                </div>
              </div>
            </div>

            {/* Row 3: Insights and This Week's Tip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
              
              <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', marginBottom: '24px' }}>
                  Baby Development • Week {results.currentWeeks}
                </div>
                
                <h3 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', marginBottom: '4px', lineHeight: 1.2 }}>
                  {insights.emoji} Your baby is the size of {insights.size}
                </h3>
                {insights.clinicalSize && <p style={{ fontSize: '15px', color: '#64748b', fontWeight: 'bold', marginBottom: '12px' }}>{insights.clinicalSize}</p>}
                <p style={{ fontSize: '18px', color: '#ff2a5f', fontWeight: '600', marginBottom: '32px' }}>{insights.tagline}</p>
                
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}>This week:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {insights.what.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '16px', color: '#475569', lineHeight: 1.5 }}>
                        <span style={{ fontSize: '18px' }}>✨</span> <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#fff1f2', padding: '24px', borderRadius: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#e11d48', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    💡 Did you know?
                  </div>
                  <div style={{ color: '#be123c', fontSize: '15px', lineHeight: 1.5 }}>
                    {insights.didYouKnow}
                  </div>
                </div>
              </div>

              {/* Tip and PDF */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ background: '#e0e7ff', borderRadius: '24px', padding: '32px', border: '1px solid #c7d2fe' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>This Week's Tip</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#312e81', lineHeight: 1.4 }}>
                    {insights.tip}
                  </div>
                </div>

                <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ width: '48px', height: '48px', background: '#fff1f2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <Download size={24} color="#ff2a5f" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Download Pregnancy Timeline PDF</h3>
                  <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px', lineHeight: 1.5 }}>Save a beautiful copy of your timeline to share with your family or healthcare provider.</p>
                  
                  <button onClick={handleDownloadPdf} disabled={isSending} style={{ width: '100%', padding: '12px 24px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s', marginBottom: '24px' }}>
                    <Download size={18} />
                    Download PDF
                  </button>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                    <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>or email it</span>
                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="email" 
                      placeholder="Email (optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '15px' }}
                    />
                    <button onClick={handleSendPdf} disabled={isSending} style={{ padding: '0 24px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                      {isSending ? '...' : <Mail size={20} />}
                    </button>
                  </div>
                  {sendSuccess && <div style={{ color: '#10b981', fontSize: '14px', textAlign: 'center', fontWeight: 'bold', marginTop: '12px' }}>Sent successfully!</div>}
                </div>
              </div>

            </div>

            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>Medical Disclaimer</div>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
                Only around 4–5% of babies arrive on their exact due date. Healthcare providers may adjust your due date based on ultrasound findings.<br/>
                <br/>
                <strong>Important:</strong> Please consult your medical practitioners or doctors for any clinical decisions. This data is purely for informational purposes, depends entirely on user input, and cannot be challenged in court.
              </p>
            </div>

          </div>
        )}

        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* AdSense Placement */}
          <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '16px', padding: '24px', textAlign: 'center', color: '#64748b', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Advertisement</div>
              <div style={{ fontSize: '12px' }}>[ Paste Google AdSense Code Here (300x600) ]</div>
            </div>
          </div>
        </aside>

      </div>

      {/* SEO & Educational Content Section */}
      <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '80px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', color: '#334155', lineHeight: 1.8, fontSize: '18px' }}>
          
          <h2 style={{ fontSize: '32px', color: '#0f172a', fontWeight: 'bold', marginBottom: '24px', letterSpacing: '-0.5px' }}>
            How is Your Estimated Due Date (EDD) Calculated?
          </h2>
          <p style={{ marginBottom: '32px' }}>
            Predicting when your baby will arrive is a mix of biology and clinical averages. While a full-term pregnancy is often described as lasting 9 months, clinical calculations track pregnancy by <strong>40 weeks (or 280 days)</strong> starting from the first day of your last menstrual period (LMP).
          </p>

          <h3 style={{ fontSize: '24px', color: '#0f172a', fontWeight: 'bold', marginBottom: '16px', marginTop: '48px' }}>
            Natural Pregnancy vs. IUI vs. IVF
          </h3>
          <p style={{ marginBottom: '24px' }}>
            Depending on how conception occurred, the math changes significantly to provide the most accurate medical estimation:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '32px' }}>
            <li style={{ marginBottom: '12px' }}><strong>Natural Pregnancy:</strong> Most often calculated by adding 280 days to the first day of your LMP. If you know your exact ovulation or conception date, we add 266 days to that date.</li>
            <li style={{ marginBottom: '12px' }}><strong>IUI (Intrauterine Insemination):</strong> The date of the IUI procedure acts as the ovulation date. We add 266 days to the IUI date to find your due date.</li>
            <li style={{ marginBottom: '12px' }}><strong>IVF (In Vitro Fertilization):</strong> Because the embryos are already developing outside the womb before transfer, IVF due dates are incredibly precise. We subtract the embryo's age (e.g., 3 days or 5 days) from the 266-day gestation timeline.</li>
          </ul>

          <h3 style={{ fontSize: '24px', color: '#0f172a', fontWeight: 'bold', marginBottom: '16px', marginTop: '48px' }}>
            Why Do Due Dates Change?
          </h3>
          <p style={{ marginBottom: '24px' }}>
            It is very common for your healthcare provider to adjust your due date after an early ultrasound (usually between 7–12 weeks). The ultrasound measures the baby's <strong>Crown-Rump Length (CRL)</strong>, which is the most highly accurate predictor of gestational age. If the ultrasound measurement differs from your LMP calculation by more than a few days, your doctor will assign you a new, official ultrasound due date.
          </p>

          <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '16px', borderLeft: '4px solid #ff2a5f', marginTop: '48px', marginBottom: '48px' }}>
            <h4 style={{ fontSize: '20px', color: '#0f172a', fontWeight: 'bold', marginBottom: '12px' }}>
              Frequently Asked Questions
            </h4>
            
            <div style={{ marginBottom: '24px' }}>
              <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>Will my baby arrive exactly on my due date?</strong>
              <span>Statistically, only about 4–5% of babies are born on their exact due date. It's best to think of your due date as the center of a "due month"—any time between 37 weeks and 42 weeks is considered a normal arrival window.</span>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>What is gestational age?</strong>
              <span>Gestational age is how far along the pregnancy is. Surprisingly, it starts counting from the first day of your last period, meaning you are considered "two weeks pregnant" on the day you actually conceive.</span>
            </div>

            <div>
              <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>How do I track my milestones?</strong>
              <span>Our Due Date Calculator provides a custom timeline of important milestones and recommended clinical scans. You can even download a beautiful PDF report to save and share!</span>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
