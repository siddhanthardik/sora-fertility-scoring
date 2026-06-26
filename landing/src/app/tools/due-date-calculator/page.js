"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Baby, Download, Mail, Heart, Calendar, CalendarClock, Clock, AlertCircle } from 'lucide-react';
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
  const [sendError, setSendError] = useState('');
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
    trackEvent({ event: "tool_completed", tool: "due_date_calculator", metadata: { method: methodString } });
    setSendSuccess(false);
  };

  const handleSendPdf = async () => {
    if (!email) {
      setSendError('Please enter an email address.');
      return;
    }
    setIsSending(true);
    setSendSuccess(false);
    setSendError('');
    try {
      const res = await fetch('/api/tools/due-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results, email, insights: getInsights() })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSendSuccess(true);
      } else {
        setSendError(data.error || 'Failed to send email. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setSendError('Network error. Please check your connection and try again.');
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
          <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Your Results</h2>
              <button onClick={() => setResults(null)} className="text-rose-600 font-semibold hover:text-rose-700 transition-colors px-4 py-2 bg-rose-50 rounded-xl hover:bg-rose-100">Recalculate</button>
            </div>

            {/* Row 1: Snapshot and Countdown */}
            <div className="flex flex-col gap-6">
              
              {/* Hero Snapshot */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 text-rose-500 font-bold uppercase tracking-widest text-xs mb-6">
                  <Heart size={14} className="fill-rose-500" /> Your Pregnancy Snapshot
                </div>

                <div className="flex flex-col gap-6">
                  {/* Top Section: Due Date & Progress */}
                  <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Estimated Due Date</div>
                      <div className="text-2xl font-bold text-slate-800 tracking-tight">{results.dueDateShort}</div>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="text-rose-600 font-semibold">{results.gestationalAge}</div>
                      <div className="text-sm text-slate-500">{results.trimester} • {results.method}</div>
                    </div>
                  </div>

                  {/* Bottom Section: Baby Info */}
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-2xl border border-slate-100">
                        {insights.emoji}
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Baby Size</div>
                        <div className="text-sm font-semibold text-slate-800">{insights.size}</div>
                        {insights.clinicalSize && <div className="text-xs text-slate-500 mt-0.5">{insights.clinicalSize}</div>}
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center">
                      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5 md:text-right">Arrival Window</div>
                      <div className="text-sm font-semibold text-slate-800 md:text-right">{results.arrivalWindow}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Countdown Banner */}
              <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-sm border border-rose-100 flex-shrink-0">
                    <div className="text-2xl font-bold text-rose-600 leading-none">{results.daysUntilDue > 0 ? results.daysUntilDue : 0}</div>
                  </div>
                  <div>
                    <div className="text-rose-900 font-bold text-lg leading-tight">Days to go</div>
                    <div className="text-rose-600 text-sm">Until you meet your baby</div>
                  </div>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                  <div className="flex-1 md:flex-none bg-white py-3 px-6 rounded-xl border border-rose-100 shadow-sm text-center">
                    <div className="text-xl font-bold text-rose-800 leading-none mb-1">{results.weeksLeft > 0 ? results.weeksLeft : 0}</div>
                    <div className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">Weeks</div>
                  </div>
                  <div className="flex-1 md:flex-none bg-white py-3 px-6 rounded-xl border border-rose-100 shadow-sm text-center">
                    <div className="text-xl font-bold text-rose-800 leading-none mb-1">{results.monthsLeft > 0 ? results.monthsLeft : 0}</div>
                    <div className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">Months</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Row 2: Journey Timeline */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">
                <Calendar size={14} /> Pregnancy Journey
              </div>
              
              {/* Horizontal Timeline */}
              <div className="w-full overflow-x-auto pt-6 pb-4">
                <div className="min-w-[500px] flex items-center justify-between relative px-6">
                  
                  {/* Connecting Line */}
                  <div className="absolute top-6 left-10 right-10 h-1 bg-slate-100 z-0 rounded-full"></div>
                  <div className="absolute top-6 left-10 h-1 bg-gradient-to-r from-rose-400 to-rose-500 z-0 rounded-full transition-all duration-1000" style={{ width: `${Math.min((results.currentWeeks / 40) * 100, 100)}%`, maxWidth: 'calc(100% - 80px)' }}></div>

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
                      <div key={i} className="flex flex-col items-center z-10 relative group">
                        <div className={`text-xs font-semibold mb-3 transition-colors ${isPast ? 'text-slate-800' : 'text-slate-400'}`}>{node.date}</div>
                        <div className={`w-4 h-4 rounded-full border-[3px] border-white shadow-md mb-4 transition-all duration-300 ${isPast ? 'bg-rose-500 ring-4 ring-rose-100' : 'bg-slate-200 ring-2 ring-transparent'}`}></div>
                        <div className={`text-lg font-bold transition-colors ${isPast ? 'text-slate-800' : 'text-slate-400'}`}>{node.label}</div>
                        {isCurrent && <div className="absolute -top-8 bg-slate-800 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg animate-bounce">You are here</div>}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Coming Up Next */}
              <div className="mt-8 bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
                  <CalendarClock className="text-rose-500" size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Coming Up Next</div>
                  <div className="text-base font-bold text-slate-800">{results.nextMilestone.name}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{results.nextMilestone.desc}</div>
                </div>
                <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm text-center w-full sm:w-auto mt-2 sm:mt-0">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Expected Window</div>
                  <div className="text-sm font-bold text-slate-700">{results.nextMilestone.time}</div>
                </div>
              </div>
            </div>

            {/* Row 3: Insights and This Week's Tip */}
            <div className="flex flex-col gap-10">
              
              {/* Insights */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col">
                <div className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">
                  Baby Development • Week {results.currentWeeks}
                </div>
                
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{insights.emoji}</div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Your baby is the size of {insights.size}</h3>
                      <p className="text-rose-500 font-medium text-sm mt-1">{insights.tagline}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div className="text-sm font-bold text-slate-700 mb-3">This week:</div>
                    <ul className="space-y-3">
                      {insights.what.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-600 items-start">
                          <span className="text-rose-400 mt-0.5">•</span> <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100">
                    <div className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <AlertCircle size={14} /> Did you know?
                    </div>
                    <div className="text-rose-800 text-sm font-medium leading-relaxed">
                      {insights.didYouKnow}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tip and PDF */}
              <div className="flex flex-col gap-6 lg:gap-8">
                <div className="bg-indigo-50/50 rounded-3xl p-6 md:p-8 border border-indigo-100 shadow-sm relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 text-indigo-100 rotate-12 opacity-50">
                    <Heart size={100} fill="currentColor" />
                  </div>
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 relative z-10">This Week&apos;s Tip</div>
                  <div className="text-lg sm:text-xl font-semibold text-indigo-900 leading-relaxed relative z-10">
                    {insights.tip}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 flex-1 flex flex-col justify-center">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-5 shadow-inner border border-rose-100">
                    <Download size={20} className="text-rose-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Download Pregnancy Timeline PDF</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">Save a beautiful copy of your timeline to share with your family or healthcare provider.</p>
                  
                  <button onClick={handleDownloadPdf} disabled={isSending} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-semibold text-sm sm:text-base transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2 mb-6 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0">
                    <Download size={18} />
                    Download PDF
                  </button>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-slate-100"></div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">or email it</span>
                    <div className="flex-1 h-px bg-slate-100"></div>
                  </div>

                  <div className="flex gap-3">
                    <input 
                      type="email" 
                      placeholder="Email (optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm transition-all shadow-sm"
                    />
                    <button onClick={handleSendPdf} disabled={isSending} className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-md disabled:opacity-70 flex items-center justify-center min-w-[60px]">
                      {isSending ? <span className="text-white text-sm">Sending...</span> : <Mail size={20} className="text-white" color="white" />}
                    </button>
                  </div>
                  
                  {sendSuccess && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 font-semibold bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-200">
                      <span>✅</span> PDF sent to <span className="font-bold">{email}</span>! Check your inbox.
                    </div>
                  )}
                  {sendError && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-rose-700 font-semibold bg-rose-50 px-4 py-3 rounded-xl border border-rose-200">
                      <span>⚠️</span> {sendError}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Disclaimer */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200"></div>
              <div className="font-bold text-slate-700 mb-3 flex items-center justify-center gap-2">
                <AlertCircle size={18} className="text-slate-400" /> Medical Disclaimer
              </div>
              <p className="m-0 text-sm text-slate-500 leading-relaxed max-w-3xl mx-auto">
                Only around 4–5% of babies arrive on their exact due date. Healthcare providers may adjust your due date based on ultrasound findings.<br/>
                <br/>
                <strong className="text-slate-700">Important:</strong> Please consult your medical practitioners or doctors for any clinical decisions. This data is purely for informational purposes, depends entirely on user input, and cannot be challenged in court.
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
