import { OBSERVATION_ACTIVITIES } from "./activities/observation.js";
import { COMPARISON_ACTIVITIES } from "./activities/comparison.js";
import { CLASSIFICATION_ACTIVITIES } from "./activities/classification.js";
import { PATTERN_ACTIVITIES } from "./activities/pattern.js";
import { DRAWING_CONCLUSIONS_ACTIVITIES } from "./activities/drawingConclusions.js";
import { FACT_OPINION_CLAIM_ACTIVITIES } from "./activities/factOpinionClaim.js";
import { CAUSE_EFFECT_ACTIVITIES } from "./activities/causeEffect.js";
import { ASSUMPTIONS_BIAS_ACTIVITIES } from "./activities/assumptionsBias.js";
import { NUMBER_SENSE_ACTIVITIES } from "./activities/numberSense.js";
import { COUNTING_ACTIVITIES } from "./activities/counting.js";
import { ADDITION_ACTIVITIES } from "./activities/addition.js";
import { SUBTRACTION_ACTIVITIES } from "./activities/subtraction.js";
import { MULTIPLICATION_ACTIVITIES } from "./activities/multiplication.js";
import { DIVISION_ACTIVITIES } from "./activities/division.js";
import { FRACTIONS_ACTIVITIES } from "./activities/fractions.js";
import { MONEY_ACTIVITIES } from "./activities/money.js";
import { TIME_ACTIVITIES } from "./activities/time.js";
import { MEASUREMENT_ACTIVITIES } from "./activities/measurement.js";
import { SHAPES_GEOMETRY_ACTIVITIES } from "./activities/shapesGeometry.js";
import { DATA_GRAPHS_ACTIVITIES } from "./activities/dataGraphs.js";
import { DECIMALS_ACTIVITIES } from "./activities/decimals.js";
import { PERCENTAGE_ACTIVITIES } from "./activities/percentage.js";
import { RATIO_PROPORTION_ACTIVITIES } from "./activities/ratioProportion.js";
import { AREA_PERIMETER_ACTIVITIES } from "./activities/areaPerimeter.js";
import { ANGLES_ACTIVITIES } from "./activities/angles.js";
import { PRE_ALGEBRA_ACTIVITIES } from "./activities/preAlgebra.js";
import { LINEAR_EQUATIONS_ACTIVITIES } from "./activities/linearEquations.js";
import { COORDINATE_GEOMETRY_ACTIVITIES } from "./activities/coordinateGeometry.js";
import { SPEED_DISTANCE_TIME_ACTIVITIES } from "./activities/speedDistanceTime.js";
import { STATISTICS_PROBABILITY_ACTIVITIES } from "./activities/statisticsProbability.js";
import { PYTHAGORAS_TRIANGLES_ACTIVITIES } from "./activities/pythagorasTriangles.js";
import { FUNCTIONS_ACTIVITIES } from "./activities/functions.js";
import { QUADRATIC_EQUATIONS_ACTIVITIES } from "./activities/quadraticEquations.js";
import { TRIGONOMETRY_ACTIVITIES } from "./activities/trigonometry.js";
import { STATISTICS_ADVANCED_ACTIVITIES } from "./activities/statisticsAdvanced.js";
import { SEQUENCES_SERIES_ACTIVITIES } from "./activities/sequencesSeries.js";
import { CALCULUS_INTRO_ACTIVITIES } from "./activities/calculusIntro.js";
import { RECOGNIZING_PROBLEMS_ACTIVITIES } from "./activities/recognizingProblems.js";
import { WHAT_IS_AI_ACTIVITIES } from "./activities/whatIsAI.js";
import { KNOWING_MONEY_ACTIVITIES } from "./activities/knowingMoney.js";
import { DECOMPOSING_PROBLEMS_ACTIVITIES } from "./activities/decomposingProblems.js";
import { SOLUTION_STRATEGIES_ACTIVITIES } from "./activities/solutionStrategies.js";
import { PATTERNS_ANALOGIES_ACTIVITIES } from "./activities/patternsAnalogies.js";
import { GENERATING_SOLUTIONS_ACTIVITIES } from "./activities/generatingSolutions.js";
import { EVALUATING_SOLUTIONS_ACTIVITIES } from "./activities/evaluatingSolutions.js";
import { CREATIVE_THINKING_ACTIVITIES } from "./activities/creativeThinking.js";
import { DECISION_MAKING_ACTIVITIES } from "./activities/decisionMaking.js";
import { HOW_MACHINES_LEARN_ACTIVITIES } from "./activities/howMachinesLearn.js";
import { DATA_BIAS_FAIRNESS_ACTIVITIES } from "./activities/dataBiasFairness.js";
import { AI_IN_DAILY_LIFE_ACTIVITIES } from "./activities/aiInDailyLife.js";
import { USING_AI_WISELY_ACTIVITIES } from "./activities/usingAiWisely.js";
import { AI_ETHICS_PRIVACY_ACTIVITIES } from "./activities/aiEthicsPrivacy.js";
import { CREATING_WITH_AI_ACTIVITIES } from "./activities/creatingWithAi.js";
import { AI_LIMITS_AND_FUTURE_ACTIVITIES } from "./activities/aiLimitsAndFuture.js";
import { NEEDS_VS_WANTS_ACTIVITIES } from "./activities/needsVsWants.js";
import { SAVING_AND_GOALS_ACTIVITIES } from "./activities/savingAndGoals.js";
import { MAKING_BUDGET_ACTIVITIES } from "./activities/makingBudget.js";
import { INCOME_WORK_TAX_ACTIVITIES } from "./activities/incomeWorkTax.js";
import { ENTREPRENEURSHIP_ACTIVITIES } from "./activities/entrepreneurship.js";
import { DEBT_INTEREST_RISK_ACTIVITIES } from "./activities/debtInterestRisk.js";
import { SMART_CONSUMER_ACTIVITIES } from "./activities/smartConsumer.js";
import { SAVING_VS_INVESTING_ACTIVITIES } from "./activities/savingVsInvesting.js";
import { ACTIVE_LISTENING_ACTIVITIES } from "./activities/activeListening.js";
import { SPEAKING_CLEARLY_ACTIVITIES } from "./activities/speakingClearly.js";
import { BODY_LANGUAGE_TONE_ACTIVITIES } from "./activities/bodyLanguageTone.js";
import { ASKING_QUESTIONS_ACTIVITIES } from "./activities/askingQuestions.js";
import { ASSERTIVE_EXPRESSION_ACTIVITIES } from "./activities/assertiveExpression.js";
import { GIVING_FEEDBACK_ACTIVITIES } from "./activities/givingFeedback.js";
import { PRESENTING_STORYTELLING_ACTIVITIES } from "./activities/presentingStorytelling.js";
import { WRITTEN_DIGITAL_COMM_ACTIVITIES } from "./activities/writtenDigitalComm.js";
import { WHAT_IS_TEAMWORK_ACTIVITIES } from "./activities/whatIsTeamwork.js";
import { TEAM_ROLES_ACTIVITIES } from "./activities/teamRoles.js";
import { TEAM_AGREEMENTS_ACTIVITIES } from "./activities/teamAgreements.js";
import { SHARING_TASKS_ACTIVITIES } from "./activities/sharingTasks.js";
import { RESPECTING_DIFFERENCES_ACTIVITIES } from "./activities/respectingDifferences.js";
import { RESOLVING_CONFLICT_ACTIVITIES } from "./activities/resolvingConflict.js";
import { GROUP_DECISIONS_ACTIVITIES } from "./activities/groupDecisions.js";
import { TEAM_REFLECTION_ACTIVITIES } from "./activities/teamReflection.js";
import { CURIOSITY_WHATIF_ACTIVITIES } from "./activities/curiosityWhatIf.js";
import { BRAINSTORMING_ACTIVITIES } from "./activities/brainstorming.js";
import { COMBINING_IDEAS_ACTIVITIES } from "./activities/combiningIdeas.js";
import { PERSPECTIVE_SHIFTING_ACTIVITIES } from "./activities/perspectiveShifting.js";
import { IDEA_TO_PROTOTYPE_ACTIVITIES } from "./activities/ideaToPrototype.js";
import { ITERATE_IMPROVE_ACTIVITIES } from "./activities/iterateImprove.js";
import { DESIGN_THINKING_ACTIVITIES } from "./activities/designThinking.js";
import { RESPONSIBLE_INNOVATION_ACTIVITIES } from "./activities/responsibleInnovation.js";
import { DEVICES_INTERNET_ACTIVITIES } from "./activities/devicesInternet.js";
import { PASSWORDS_ACCOUNTS_ACTIVITIES } from "./activities/passwordsAccounts.js";
import { DIGITAL_FOOTPRINT_ACTIVITIES } from "./activities/digitalFootprint.js";
import { SPOTTING_HOAXES_ACTIVITIES } from "./activities/spottingHoaxes.js";
import { ONLINE_SCAMS_ACTIVITIES } from "./activities/onlineScams.js";
import { DIGITAL_ETIQUETTE_ACTIVITIES } from "./activities/digitalEtiquette.js";
import { CYBERBULLYING_ACTIVITIES } from "./activities/cyberbullying.js";
import { SCREEN_BALANCE_ACTIVITIES } from "./activities/screenBalance.js";
import { RECOGNIZING_EMOTIONS_ACTIVITIES } from "./activities/recognizingEmotions.js";
import { MANAGING_EMOTIONS_ACTIVITIES } from "./activities/managingEmotions.js";
import { EMPATHY_ACTIVITIES } from "./activities/empathy.js";
import { HEALTHY_HABITS_ACTIVITIES } from "./activities/healthyHabits.js";
import { COPING_WITH_STRESS_ACTIVITIES } from "./activities/copingWithStress.js";
import { GROWTH_MINDSET_ACTIVITIES } from "./activities/growthMindset.js";
import { HEALTHY_RELATIONSHIPS_ACTIVITIES } from "./activities/healthyRelationships.js";
import { ASKING_FOR_HELP_ACTIVITIES } from "./activities/askingForHelp.js";
import { RULES_RIGHTS_ACTIVITIES } from "./activities/rulesRights.js";
import { LIVING_WITH_DIVERSITY_ACTIVITIES } from "./activities/livingWithDiversity.js";
import { DELIBERATION_ACTIVITIES } from "./activities/deliberation.js";
import { COMMON_GOODS_ACTIVITIES } from "./activities/commonGoods.js";
import { WASTE_RECYCLING_ACTIVITIES } from "./activities/wasteRecycling.js";
import { WATER_ENERGY_ACTIVITIES } from "./activities/waterEnergy.js";
import { CLIMATE_ACTION_ACTIVITIES } from "./activities/climateAction.js";
import { ACTIVE_CITIZEN_ACTIVITIES } from "./activities/activeCitizen.js";
import { LHL_SKILLS, LHL_DOMAIN_NAME } from "./activities/lhl/index.js";
import { MIL_SKILLS, MIL_DOMAIN_NAME } from "./activities/mil/index.js";
import { RES_SKILLS, RES_DOMAIN_NAME } from "./activities/res/index.js";
import { LDR_SKILLS, LDR_DOMAIN_NAME } from "./activities/ldr/index.js";
import { DEC_SKILLS, DEC_DOMAIN_NAME } from "./activities/dec/index.js";
import { SYS_SKILLS, SYS_DOMAIN_NAME } from "./activities/sys/index.js";

export const SKILL_CONTENT = {
  ...Object.fromEntries(LHL_SKILLS.map(s => [s.id, s.activities])),
  ...Object.fromEntries(MIL_SKILLS.map(s => [s.id, s.activities])),
  ...Object.fromEntries(RES_SKILLS.map(s => [s.id, s.activities])),
  ...Object.fromEntries(LDR_SKILLS.map(s => [s.id, s.activities])),
  ...Object.fromEntries(DEC_SKILLS.map(s => [s.id, s.activities])),
  ...Object.fromEntries(SYS_SKILLS.map(s => [s.id, s.activities])),
  "CT-01": OBSERVATION_ACTIVITIES, "CT-02": COMPARISON_ACTIVITIES, "CT-03": CLASSIFICATION_ACTIVITIES,
  "CT-04": PATTERN_ACTIVITIES,
  "CT-05": DRAWING_CONCLUSIONS_ACTIVITIES, "CT-06": FACT_OPINION_CLAIM_ACTIVITIES,
  "CT-07": CAUSE_EFFECT_ACTIVITIES, "CT-08": ASSUMPTIONS_BIAS_ACTIVITIES,
  "M-01": NUMBER_SENSE_ACTIVITIES, "M-02": COUNTING_ACTIVITIES,
  "M-03": ADDITION_ACTIVITIES, "M-04": SUBTRACTION_ACTIVITIES, "M-05": MULTIPLICATION_ACTIVITIES,
  "M-06": DIVISION_ACTIVITIES, "M-07": FRACTIONS_ACTIVITIES, "M-08": MONEY_ACTIVITIES,
  "M-09": TIME_ACTIVITIES, "M-10": MEASUREMENT_ACTIVITIES, "M-11": SHAPES_GEOMETRY_ACTIVITIES,
  "M-12": DATA_GRAPHS_ACTIVITIES, "M-13": DECIMALS_ACTIVITIES, "M-14": PERCENTAGE_ACTIVITIES,
  "M-15": RATIO_PROPORTION_ACTIVITIES, "M-16": AREA_PERIMETER_ACTIVITIES, "M-17": ANGLES_ACTIVITIES,
  "M-18": PRE_ALGEBRA_ACTIVITIES, "M-19": LINEAR_EQUATIONS_ACTIVITIES,
  "M-20": COORDINATE_GEOMETRY_ACTIVITIES, "M-21": SPEED_DISTANCE_TIME_ACTIVITIES,
  "M-22": STATISTICS_PROBABILITY_ACTIVITIES, "M-23": PYTHAGORAS_TRIANGLES_ACTIVITIES,
  "M-24": FUNCTIONS_ACTIVITIES, "M-25": QUADRATIC_EQUATIONS_ACTIVITIES,
  "M-26": TRIGONOMETRY_ACTIVITIES, "M-27": STATISTICS_ADVANCED_ACTIVITIES,
  "M-28": SEQUENCES_SERIES_ACTIVITIES, "M-29": CALCULUS_INTRO_ACTIVITIES,
  "PS-01": RECOGNIZING_PROBLEMS_ACTIVITIES, "AI-01": WHAT_IS_AI_ACTIVITIES,
  "FIN-01": KNOWING_MONEY_ACTIVITIES,
  "PS-02": DECOMPOSING_PROBLEMS_ACTIVITIES, "PS-03": SOLUTION_STRATEGIES_ACTIVITIES,
  "PS-04": PATTERNS_ANALOGIES_ACTIVITIES, "PS-05": GENERATING_SOLUTIONS_ACTIVITIES,
  "PS-06": EVALUATING_SOLUTIONS_ACTIVITIES, "PS-07": CREATIVE_THINKING_ACTIVITIES,
  "PS-08": DECISION_MAKING_ACTIVITIES,
  "AI-02": HOW_MACHINES_LEARN_ACTIVITIES, "AI-03": DATA_BIAS_FAIRNESS_ACTIVITIES,
  "AI-04": AI_IN_DAILY_LIFE_ACTIVITIES, "AI-05": USING_AI_WISELY_ACTIVITIES,
  "AI-06": AI_ETHICS_PRIVACY_ACTIVITIES, "AI-07": CREATING_WITH_AI_ACTIVITIES,
  "AI-08": AI_LIMITS_AND_FUTURE_ACTIVITIES,
  "FIN-02": NEEDS_VS_WANTS_ACTIVITIES, "FIN-03": SAVING_AND_GOALS_ACTIVITIES,
  "FIN-04": MAKING_BUDGET_ACTIVITIES,
  "FIN-05": INCOME_WORK_TAX_ACTIVITIES, "FIN-06": ENTREPRENEURSHIP_ACTIVITIES,
  "FIN-07": DEBT_INTEREST_RISK_ACTIVITIES, "FIN-08": SMART_CONSUMER_ACTIVITIES,
  "FIN-09": SAVING_VS_INVESTING_ACTIVITIES,
  "COM-01": ACTIVE_LISTENING_ACTIVITIES, "COM-02": SPEAKING_CLEARLY_ACTIVITIES,
  "COM-03": BODY_LANGUAGE_TONE_ACTIVITIES, "COM-04": ASKING_QUESTIONS_ACTIVITIES,
  "COM-05": ASSERTIVE_EXPRESSION_ACTIVITIES, "COM-06": GIVING_FEEDBACK_ACTIVITIES,
  "COM-07": PRESENTING_STORYTELLING_ACTIVITIES, "COM-08": WRITTEN_DIGITAL_COMM_ACTIVITIES,
  "COL-01": WHAT_IS_TEAMWORK_ACTIVITIES, "COL-02": TEAM_ROLES_ACTIVITIES,
  "COL-03": TEAM_AGREEMENTS_ACTIVITIES, "COL-04": SHARING_TASKS_ACTIVITIES,
  "COL-05": RESPECTING_DIFFERENCES_ACTIVITIES, "COL-06": RESOLVING_CONFLICT_ACTIVITIES,
  "COL-07": GROUP_DECISIONS_ACTIVITIES, "COL-08": TEAM_REFLECTION_ACTIVITIES,
  "CRE-01": CURIOSITY_WHATIF_ACTIVITIES, "CRE-02": BRAINSTORMING_ACTIVITIES,
  "CRE-03": COMBINING_IDEAS_ACTIVITIES, "CRE-04": PERSPECTIVE_SHIFTING_ACTIVITIES,
  "CRE-05": IDEA_TO_PROTOTYPE_ACTIVITIES, "CRE-06": ITERATE_IMPROVE_ACTIVITIES,
  "CRE-07": DESIGN_THINKING_ACTIVITIES, "CRE-08": RESPONSIBLE_INNOVATION_ACTIVITIES,
  "DIG-01": DEVICES_INTERNET_ACTIVITIES, "DIG-02": PASSWORDS_ACCOUNTS_ACTIVITIES,
  "DIG-03": DIGITAL_FOOTPRINT_ACTIVITIES, "DIG-04": SPOTTING_HOAXES_ACTIVITIES,
  "DIG-05": ONLINE_SCAMS_ACTIVITIES, "DIG-06": DIGITAL_ETIQUETTE_ACTIVITIES,
  "DIG-07": CYBERBULLYING_ACTIVITIES, "DIG-08": SCREEN_BALANCE_ACTIVITIES,
  "WEL-01": RECOGNIZING_EMOTIONS_ACTIVITIES, "WEL-02": MANAGING_EMOTIONS_ACTIVITIES,
  "WEL-03": EMPATHY_ACTIVITIES, "WEL-04": HEALTHY_HABITS_ACTIVITIES, "WEL-05": COPING_WITH_STRESS_ACTIVITIES, "WEL-06": GROWTH_MINDSET_ACTIVITIES, "WEL-07": HEALTHY_RELATIONSHIPS_ACTIVITIES, "WEL-08": ASKING_FOR_HELP_ACTIVITIES,
  "CIV-01": RULES_RIGHTS_ACTIVITIES, "CIV-02": LIVING_WITH_DIVERSITY_ACTIVITIES, "CIV-03": DELIBERATION_ACTIVITIES, "CIV-04": COMMON_GOODS_ACTIVITIES, "CIV-05": WASTE_RECYCLING_ACTIVITIES, "CIV-06": WATER_ENERGY_ACTIVITIES, "CIV-07": CLIMATE_ACTION_ACTIVITIES, "CIV-08": ACTIVE_CITIZEN_ACTIVITIES,
};

export const LIVE_SKILLS = [
  { id: "CT-01", domain: "Berpikir Kritis", name: "Observasi" },
  { id: "CT-02", domain: "Berpikir Kritis", name: "Perbandingan" },
  { id: "CT-03", domain: "Berpikir Kritis", name: "Klasifikasi" },
  { id: "CT-04", domain: "Berpikir Kritis", name: "Pengenalan Pola" },
  { id: "CT-05", domain: "Berpikir Kritis", name: "Menarik Kesimpulan (Inferensi)" },
  { id: "CT-06", domain: "Berpikir Kritis", name: "Fakta, Opini & Klaim" },
  { id: "CT-07", domain: "Berpikir Kritis", name: "Sebab & Akibat" },
  { id: "CT-08", domain: "Berpikir Kritis", name: "Asumsi, Sudut Pandang & Bias" },
  { id: "M-01", domain: "Matematika", name: "Pemahaman Bilangan" },
  { id: "M-02", domain: "Matematika", name: "Berhitung" },
  { id: "M-03", domain: "Matematika", name: "Penjumlahan" },
  { id: "M-04", domain: "Matematika", name: "Pengurangan" },
  { id: "M-05", domain: "Matematika", name: "Perkalian" },
  { id: "M-06", domain: "Matematika", name: "Pembagian" },
  { id: "M-07", domain: "Matematika", name: "Pecahan" },
  { id: "M-08", domain: "Matematika", name: "Uang" },
  { id: "M-09", domain: "Matematika", name: "Waktu" },
  { id: "M-10", domain: "Matematika", name: "Pengukuran" },
  { id: "M-11", domain: "Matematika", name: "Bentuk & Geometri" },
  { id: "M-12", domain: "Matematika", name: "Data & Grafik" },
  { id: "M-13", domain: "Matematika", name: "Desimal" },
  { id: "M-14", domain: "Matematika", name: "Persentase" },
  { id: "M-15", domain: "Matematika", name: "Rasio & Proporsi" },
  { id: "M-16", domain: "Matematika", name: "Luas & Keliling" },
  { id: "M-17", domain: "Matematika", name: "Sudut" },
  { id: "M-18", domain: "Matematika", name: "Pra-Aljabar" },
  { id: "M-19", domain: "Matematika", name: "Persamaan Linear" },
  { id: "M-20", domain: "Matematika", name: "Geometri Koordinat" },
  { id: "M-21", domain: "Matematika", name: "Kecepatan-Jarak-Waktu" },
  { id: "M-22", domain: "Matematika", name: "Statistika & Peluang" },
  { id: "M-23", domain: "Matematika", name: "Teorema Pythagoras & Segitiga" },
  { id: "M-24", domain: "Matematika", name: "Fungsi" },
  { id: "M-25", domain: "Matematika", name: "Persamaan Kuadrat" },
  { id: "M-26", domain: "Matematika", name: "Trigonometri" },
  { id: "M-27", domain: "Matematika", name: "Statistika & Peluang Lanjut" },
  { id: "M-28", domain: "Matematika", name: "Barisan & Deret" },
  { id: "M-29", domain: "Matematika", name: "Pengantar Kalkulus" },
  { id: "PS-01", domain: "Pemecahan Masalah", name: "Mengenali & Mendefinisikan Masalah" },
  { id: "PS-02", domain: "Pemecahan Masalah", name: "Memecah Masalah Besar" },
  { id: "PS-03", domain: "Pemecahan Masalah", name: "Strategi & Rencana Penyelesaian" },
  { id: "PS-04", domain: "Pemecahan Masalah", name: "Mencari Pola & Analogi" },
  { id: "PS-05", domain: "Pemecahan Masalah", name: "Menghasilkan & Memilih Solusi" },
  { id: "PS-06", domain: "Pemecahan Masalah", name: "Mengevaluasi Solusi & Refleksi" },
  { id: "PS-07", domain: "Pemecahan Masalah", name: "Berpikir Kreatif & Alternatif" },
  { id: "PS-08", domain: "Pemecahan Masalah", name: "Pengambilan Keputusan" },
  { id: "AI-01", domain: "Literasi AI", name: "Apa Itu AI" },
  { id: "AI-02", domain: "Literasi AI", name: "Bagaimana Mesin Belajar" },
  { id: "AI-03", domain: "Literasi AI", name: "Data, Bias & Keadilan" },
  { id: "AI-04", domain: "Literasi AI", name: "AI dalam Kehidupan Sehari-hari" },
  { id: "AI-05", domain: "Literasi AI", name: "Menggunakan AI dengan Bijak" },
  { id: "AI-06", domain: "Literasi AI", name: "Etika, Privasi & Tanggung Jawab AI" },
  { id: "AI-07", domain: "Literasi AI", name: "Membuat dengan AI" },
  { id: "AI-08", domain: "Literasi AI", name: "Batas & Masa Depan AI" },
  { id: "FIN-01", domain: "Literasi Keuangan & Kewirausahaan", name: "Mengenal Uang" },
  { id: "FIN-02", domain: "Literasi Keuangan & Kewirausahaan", name: "Kebutuhan vs Keinginan" },
  { id: "FIN-03", domain: "Literasi Keuangan & Kewirausahaan", name: "Menabung & Tujuan Keuangan" },
  { id: "FIN-04", domain: "Literasi Keuangan & Kewirausahaan", name: "Membuat Anggaran" },
  { id: "FIN-05", domain: "Literasi Keuangan & Kewirausahaan", name: "Penghasilan, Kerja & Pajak" },
  { id: "FIN-06", domain: "Literasi Keuangan & Kewirausahaan", name: "Kewirausahaan: Ide, Biaya & Untung" },
  { id: "FIN-07", domain: "Literasi Keuangan & Kewirausahaan", name: "Pinjaman, Bunga & Risiko" },
  { id: "FIN-08", domain: "Literasi Keuangan & Kewirausahaan", name: "Konsumen Cerdas" },
  { id: "FIN-09", domain: "Literasi Keuangan & Kewirausahaan", name: "Menabung vs Investasi" },
  { id: "COM-01", domain: "Komunikasi Efektif", name: "Mendengarkan Aktif" },
  { id: "COM-02", domain: "Komunikasi Efektif", name: "Berbicara dengan Jelas" },
  { id: "COM-03", domain: "Komunikasi Efektif", name: "Bahasa Tubuh & Nada Suara" },
  { id: "COM-04", domain: "Komunikasi Efektif", name: "Bertanya yang Baik" },
  { id: "COM-05", domain: "Komunikasi Efektif", name: "Menyampaikan Pendapat & Perasaan" },
  { id: "COM-06", domain: "Komunikasi Efektif", name: "Memberi & Menerima Umpan Balik" },
  { id: "COM-07", domain: "Komunikasi Efektif", name: "Presentasi & Bercerita" },
  { id: "COM-08", domain: "Komunikasi Efektif", name: "Komunikasi Tertulis & Digital" },
  { id: "COL-01", domain: "Kolaborasi & Kerja Tim", name: "Apa Itu Kerja Sama" },
  { id: "COL-02", domain: "Kolaborasi & Kerja Tim", name: "Peran & Tanggung Jawab dalam Tim" },
  { id: "COL-03", domain: "Kolaborasi & Kerja Tim", name: "Kesepakatan & Aturan Bersama" },
  { id: "COL-04", domain: "Kolaborasi & Kerja Tim", name: "Berbagi Tugas & Sumber Daya" },
  { id: "COL-05", domain: "Kolaborasi & Kerja Tim", name: "Menghargai Perbedaan Pendapat" },
  { id: "COL-06", domain: "Kolaborasi & Kerja Tim", name: "Menyelesaikan Konflik" },
  { id: "COL-07", domain: "Kolaborasi & Kerja Tim", name: "Mengambil Keputusan Bersama" },
  { id: "COL-08", domain: "Kolaborasi & Kerja Tim", name: "Refleksi & Evaluasi Tim" },
  { id: "CRE-01", domain: "Kreativitas & Inovasi", name: "Rasa Ingin Tahu & 'Bagaimana Jika'" },
  { id: "CRE-02", domain: "Kreativitas & Inovasi", name: "Menghasilkan Banyak Ide" },
  { id: "CRE-03", domain: "Kreativitas & Inovasi", name: "Menggabungkan & Mengembangkan Ide" },
  { id: "CRE-04", domain: "Kreativitas & Inovasi", name: "Melihat dari Sudut Pandang Lain" },
  { id: "CRE-05", domain: "Kreativitas & Inovasi", name: "Dari Ide ke Prototipe" },
  { id: "CRE-06", domain: "Kreativitas & Inovasi", name: "Uji Coba, Gagal, Perbaiki" },
  { id: "CRE-07", domain: "Kreativitas & Inovasi", name: "Berpikir Desain" },
  { id: "CRE-08", domain: "Kreativitas & Inovasi", name: "Inovasi yang Bermanfaat & Bertanggung Jawab" },
  { id: "DIG-01", domain: "Literasi Digital & Keamanan Siber", name: "Perangkat & Internet Dasar" },
  { id: "DIG-02", domain: "Literasi Digital & Keamanan Siber", name: "Kata Sandi & Akun Aman" },
  { id: "DIG-03", domain: "Literasi Digital & Keamanan Siber", name: "Jejak Digital & Privasi" },
  { id: "DIG-04", domain: "Literasi Digital & Keamanan Siber", name: "Mengenali Hoaks & Memeriksa Fakta" },
  { id: "DIG-05", domain: "Literasi Digital & Keamanan Siber", name: "Penipuan Online & Phishing" },
  { id: "DIG-06", domain: "Literasi Digital & Keamanan Siber", name: "Etika & Sopan Santun Digital" },
  { id: "DIG-07", domain: "Literasi Digital & Keamanan Siber", name: "Perundungan Siber" },
  { id: "DIG-08", domain: "Literasi Digital & Keamanan Siber", name: "Keseimbangan Layar & Kesehatan Digital" },
  { id: "WEL-01", domain: "Kesehatan & Kecerdasan Emosi", name: "Mengenali Emosi" },
  { id: "WEL-02", domain: "Kesehatan & Kecerdasan Emosi", name: "Mengelola Emosi & Menenangkan Diri" },
  { id: "WEL-03", domain: "Kesehatan & Kecerdasan Emosi", name: "Empati & Memahami Orang Lain" },
  { id: "WEL-04", domain: "Kesehatan & Kecerdasan Emosi", name: "Kebiasaan Sehat: Tidur, Gerak, Makan" },
  { id: "WEL-05", domain: "Kesehatan & Kecerdasan Emosi", name: "Menghadapi Stres & Tekanan" },
  { id: "WEL-06", domain: "Kesehatan & Kecerdasan Emosi", name: "Pola Pikir Bertumbuh & Ketangguhan" },
  { id: "WEL-07", domain: "Kesehatan & Kecerdasan Emosi", name: "Hubungan Sehat & Batasan Diri" },
  { id: "WEL-08", domain: "Kesehatan & Kecerdasan Emosi", name: "Meminta Bantuan & Menjaga Teman" },
  { id: "CIV-01", domain: "Kewargaan & Lingkungan", name: "Aturan, Hak & Kewajiban" },
  { id: "CIV-02", domain: "Kewargaan & Lingkungan", name: "Hidup Bersama dalam Keberagaman" },
  { id: "CIV-03", domain: "Kewargaan & Lingkungan", name: "Musyawarah & Suara Bersama" },
  { id: "CIV-04", domain: "Kewargaan & Lingkungan", name: "Tanggung Jawab pada Milik Bersama" },
  { id: "CIV-05", domain: "Kewargaan & Lingkungan", name: "Sampah, Daur Ulang & 3R" },
  { id: "CIV-06", domain: "Kewargaan & Lingkungan", name: "Air, Energi & Hemat Sumber Daya" },
  { id: "CIV-07", domain: "Kewargaan & Lingkungan", name: "Perubahan Iklim & Aksi Nyata" },
  { id: "CIV-08", domain: "Kewargaan & Lingkungan", name: "Menjadi Warga yang Peduli & Berkontribusi" },
  ...LHL_SKILLS.map(s => ({ id: s.id, domain: LHL_DOMAIN_NAME, name: s.name })),
  ...MIL_SKILLS.map(s => ({ id: s.id, domain: MIL_DOMAIN_NAME, name: s.name })),
  ...RES_SKILLS.map(s => ({ id: s.id, domain: RES_DOMAIN_NAME, name: s.name })),
  ...LDR_SKILLS.map(s => ({ id: s.id, domain: LDR_DOMAIN_NAME, name: s.name })),
  ...DEC_SKILLS.map(s => ({ id: s.id, domain: DEC_DOMAIN_NAME, name: s.name })),
  ...SYS_SKILLS.map(s => ({ id: s.id, domain: SYS_DOMAIN_NAME, name: s.name })),
];
