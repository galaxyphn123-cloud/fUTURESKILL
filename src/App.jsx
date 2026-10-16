import { useState } from "react";
import { COLORS } from "./theme.js";
import { LIVE_SKILLS } from "./data/skillContent.js";
import { Pill } from "./components/ui/Pill.jsx";
import { JoinScreen } from "./components/JoinScreen.jsx";
import { DomainMap } from "./components/DomainMap.jsx";
import { StudentFlow } from "./components/StudentFlow.jsx";
import { TeacherDashboard } from "./components/TeacherDashboard.jsx";

export default function App() {
  const [screen, setScreen] = useState("join"); // join | student | teacher
  const [studentName, setStudentName] = useState(null);
  const [skillId, setSkillId] = useState(LIVE_SKILLS[0].id);

  return (
    <div style={{ background: COLORS.paper, minHeight: "100vh", fontFamily: "'Avenir Next', 'Segoe UI', system-ui, sans-serif", color: COLORS.ink }}>
      <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1.5px solid ${COLORS.line}` }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 17, color: COLORS.mossDeep, letterSpacing: "-.01em" }}>FUTURE SKILLS FOR KIDS</div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", opacity: .5 }}>LEARN · THINK · CREATE · SOLVE · GROW</div>
        </div>
        {screen !== "join" && <Pill color={COLORS.moss}>{screen === "teacher" ? "Tampilan guru" : "Tampilan siswa"}</Pill>}
      </div>

      {screen === "join" && (
        <>
          <JoinScreen
            skillId={skillId}
            onJoin={n => { setStudentName(n); setScreen("student"); }}
            onTeacher={() => setScreen("teacher")}
          />
          <DomainMap selectedSkillId={skillId} onSelectLive={id => setSkillId(id)} />
        </>
      )}
      {screen === "student" && <StudentFlow name={studentName} skillId={skillId} onExit={() => setScreen("join")} />}
      {screen === "teacher" && <TeacherDashboard onExit={() => setScreen("join")} />}
    </div>
  );
}
