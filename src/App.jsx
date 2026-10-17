import { useState } from "react";
import { COLORS } from "./theme.js";
import { Pill } from "./components/ui/Pill.jsx";
import { JoinScreen } from "./components/JoinScreen.jsx";
import { StudentFlow } from "./components/StudentFlow.jsx";
import { TeacherConsole } from "./components/TeacherConsole.jsx";

export default function App() {
  const [screen, setScreen] = useState("join"); // join | student | teacher
  const [joined, setJoined] = useState(null);   // { student, session }

  return (
    <div style={{ background: COLORS.paper, minHeight: "100vh", fontFamily: "'Avenir Next', 'Segoe UI', system-ui, sans-serif", color: COLORS.ink }}>
      <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1.5px solid ${COLORS.line}` }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 17, color: COLORS.mossDeep, letterSpacing: "-.01em" }}>FUTURE SKILLS FOR KIDS</div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", opacity: .5 }}>LEARN · THINK · CREATE · SOLVE · GROW</div>
        </div>
        {screen !== "join" && <Pill color={COLORS.moss}>{screen === "teacher" ? "Tampilan guru" : "Tampilan siswa"}</Pill>}
      </div>

      {screen === "join" && <JoinScreen onJoin={j => { setJoined(j); setScreen("student"); }} onTeacher={() => setScreen("teacher")} />}
      {screen === "student" && <StudentFlow studentId={joined.student.id} session={joined.session} onExit={() => setScreen("join")} />}
      {screen === "teacher" && <TeacherConsole onExit={() => setScreen("join")} />}
    </div>
  );
}
