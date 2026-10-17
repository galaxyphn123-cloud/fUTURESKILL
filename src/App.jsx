import { useState } from "react";
import { COLORS } from "./theme.js";
import { Pill } from "./components/ui/Pill.jsx";
import { JoinScreen } from "./components/JoinScreen.jsx";
import { StudentFlow } from "./components/StudentFlow.jsx";
import { ProfileView } from "./components/ProfileView.jsx";
import { TeacherConsole } from "./components/TeacherConsole.jsx";

export default function App() {
  const [screen, setScreen] = useState("join"); // join | student | profile | parent | teacher
  const [joined, setJoined] = useState(null);   // { student, session }

  return (
    <div style={{ background: COLORS.paper, minHeight: "100vh", fontFamily: "'Avenir Next', 'Segoe UI', system-ui, sans-serif", color: COLORS.ink }}>
      <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1.5px solid ${COLORS.line}` }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 17, color: COLORS.mossDeep, letterSpacing: "-.01em" }}>FUTURE SKILLS FOR KIDS</div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", opacity: .5 }}>LEARN · THINK · CREATE · SOLVE · GROW</div>
        </div>
        {screen !== "join" && <Pill color={COLORS.moss}>{{ teacher: "Tampilan guru", parent: "Tampilan orang tua" }[screen] || "Tampilan siswa"}</Pill>}
      </div>

      {screen === "join" && <JoinScreen onJoin={j => { setJoined(j); setScreen("student"); }} onTeacher={() => setScreen("teacher")} onParent={st => { setJoined({ student: st }); setScreen("parent"); }} />}
      {screen === "student" && <StudentFlow studentId={joined.student.id} session={joined.session} onExit={() => setScreen("join")} onProfile={() => setScreen("profile")} />}
      {screen === "profile" && <ProfileView studentId={joined.student.id} onBack={() => setScreen("student")} />}
      {screen === "parent" && <ProfileView studentId={joined.student.id} audience="parent" onBack={() => setScreen("join")} />}
      {screen === "teacher" && <TeacherConsole onExit={() => setScreen("join")} />}
    </div>
  );
}
