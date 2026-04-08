import { useState, useCallback } from "react";

const CLEAN_RULES = [
  { label: '볼드 (** **)', regex: /\*\*(.+?)\*\*/g, replace: "$1", default: true },
  { label: '이탤릭 (* *)', regex: /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, replace: "$1", default: true },
  { label: '취소선 (~~ ~~)', regex: /~~(.+?)~~/g, replace: "$1", default: true },
  { label: "헤딩 (#, ##, ###...)", regex: /^#{1,6}\s+/gm, replace: "", default: true },
  { label: "불릿 포인트 (- , * , •)", regex: /^[\s]*[-*•]\s+/gm, replace: "", default: true },
  { label: "번호 리스트 (1. 2. 3.)", regex: /^[\s]*\d+\.\s+/gm, replace: "", default: true },
  { label: '인용 블록 (>)', regex: /^>\s?/gm, replace: "", default: true },
  { label: '인라인 코드 (` `)', regex: /`([^`]+)`/g, replace: "$1", default: true },
  { label: '코드블록 (``` ```)', regex: /```[\w]*\n?([\s\S]*?)```/g, replace: "$1", default: true },
  { label: '링크 [text](url)', regex: /\[([^\]]+)\]\([^)]+\)/g, replace: "$1", default: true },
  { label: '이미지 ![alt](url)', regex: /!\[([^\]]*)\]\([^)]+\)/g, replace: "$1", default: true },
  { label: "구분선 (--- / ***)", regex: /^[-*_]{3,}\s*$/gm, replace: "", default: true },
  { label: '큰따옴표 (" " " ")', regex: /["""\u201C\u201D]/g, replace: "", default: true },
  { label: "작은따옴표 (' ' ' ')", regex: /['''\u2018\u2019]/g, replace: "", default: true },
  { label: "이모지 제거", regex: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, replace: "", default: false },
  { label: "연속 빈 줄 정리", regex: /\n{3,}/g, replace: "\n\n", default: true },
];

export default function AiTextCleaner() {
  const [input, setInput] = useState("");
  const [rules, setRules] = useState(CLEAN_RULES.map((r) => r.default));
  const [copied, setCopied] = useState(false);

  const clean = useCallback(
    (text) => {
      let result = text;
      CLEAN_RULES.forEach((rule, i) => {
        if (rules[i]) {
          result = result.replace(rule.regex, typeof rule.replace === "function" ? rule.replace : rule.replace);
        }
      });
      return result.trim();
    },
    [rules]
  );

  const output = clean(input);
  const removed = input.length - output.length;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => { setInput(""); setCopied(false); };
  const toggleRule = (i) => setRules((prev) => prev.map((v, j) => (j === i ? !v : v)));
  const allOn = () => setRules(CLEAN_RULES.map(() => true));
  const allOff = () => setRules(CLEAN_RULES.map(() => false));

  const demoText = `## AI가 생성한 예시 텍스트

**인공지능**은 현대 사회에서 '혁신적인' 역할을 하고 있습니다.

> "AI는 인류의 미래를 바꿀 것이다" — 전문가 의견

### 주요 특징
1. **자연어 처리** — 텍스트를 이해하고 생성합니다
2. *머신러닝* — 데이터에서 패턴을 학습합니다
3. ~~기존 방식~~ → 새로운 접근법

- 첫 번째 항목
- 두 번째 항목
  - 하위 항목

\`console.log("Hello")\` 같은 코드도 포함됩니다.

자세한 내용은 [이 링크](https://example.com)를 참고하세요.

---

더 궁금한 점이 있으시면 말씀해 주세요! 😊`;

  return (
    <div style={{ minHeight: "100vh", background: "#0e0e10", color: "#e4e4e7", fontFamily: "'Pretendard Variable', 'Noto Sans KR', sans-serif" }}>
      <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css" rel="stylesheet" />

      <header style={{ padding: "32px 24px 0", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: "linear-gradient(135deg, #6ee7b7, #3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 19, fontWeight: 800, color: "#0e0e10"
          }}>✦</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>AI 텍스트 클리너</h1>
        </div>
        <p style={{ fontSize: 14, color: "#71717a", margin: "8px 0 0", lineHeight: 1.6 }}>
          ChatGPT · Gemini · Claude 등에서 생성된 텍스트의 마크다운 서식·따옴표·이모지를 깔끔하게 제거합니다.
        </p>
      </header>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 24px 48px" }}>

        {/* Rule toggles */}
        <section style={{
          background: "#18181b", borderRadius: 14, padding: "18px 20px", marginBottom: 20,
          border: "1px solid #27272a"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.06em" }}>제거 규칙</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={allOn} style={pillBtn}>전체 선택</button>
              <button onClick={allOff} style={pillBtn}>전체 해제</button>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CLEAN_RULES.map((rule, i) => (
              <button
                key={i}
                onClick={() => toggleRule(i)}
                style={{
                  padding: "7px 14px", borderRadius: 8, border: "1.5px solid",
                  borderColor: rules[i] ? "#3b82f6" : "#27272a",
                  background: rules[i] ? "rgba(59,130,246,0.12)" : "transparent",
                  color: rules[i] ? "#93c5fd" : "#52525b",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.15s"
                }}
              >
                {rules[i] ? "✓ " : ""}{rule.label}
              </button>
            ))}
          </div>
        </section>

        {/* Editor area */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Input */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={labelStyle}>붙여넣기 (원본)</label>
              <div style={{ display: "flex", gap: 6 }}>
                {!input && (
                  <button onClick={() => setInput(demoText)} style={{ ...pillBtn, color: "#6ee7b7", borderColor: "#27272a" }}>
                    예시 보기
                  </button>
                )}
                {input && (
                  <button onClick={handleClear} style={{ ...pillBtn, color: "#f87171", borderColor: "#27272a" }}>
                    지우기
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"AI가 생성한 텍스트를 여기에 붙여넣으세요...\n\n• **볼드**, *이탤릭*, ~~취소선~~\n• '작은따옴표', \"큰따옴표\"\n• # 헤딩, > 인용, - 불릿\n• [링크](url), `코드`, 이모지 😊"}
              style={textareaStyle}
            />
          </div>

          {/* Output */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={labelStyle}>결과 (클린)</label>
              {output && (
                <button onClick={handleCopy} style={{
                  ...pillBtn,
                  background: copied ? "rgba(110,231,183,0.15)" : pillBtn.background,
                  color: copied ? "#6ee7b7" : pillBtn.color,
                  borderColor: copied ? "#6ee7b7" : pillBtn.borderColor
                }}>
                  {copied ? "✓ 복사됨" : "📋 복사"}
                </button>
              )}
            </div>
            <div style={{
              ...textareaStyle,
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: output ? "#e4e4e7" : "#52525b",
              cursor: "default"
            }}>
              {output || "클린 텍스트가 여기에 표시됩니다..."}
            </div>
          </div>
        </div>

        {/* Stats */}
        {input && (
          <div style={{
            marginTop: 16, padding: "12px 18px", borderRadius: 10,
            background: "#18181b", border: "1px solid #27272a",
            fontSize: 13, color: "#71717a", display: "flex", gap: 24, alignItems: "center"
          }}>
            <span>원본 <b style={{ color: "#a1a1aa" }}>{input.length.toLocaleString()}</b>자</span>
            <span>결과 <b style={{ color: "#6ee7b7" }}>{output.length.toLocaleString()}</b>자</span>
            <span>제거 <b style={{ color: removed > 0 ? "#f87171" : "#71717a" }}>{removed > 0 ? `-${removed.toLocaleString()}` : "0"}</b>자</span>
            {removed > 0 && (
              <span style={{ marginLeft: "auto", color: "#6ee7b7", fontWeight: 600 }}>
                {((removed / input.length) * 100).toFixed(1)}% 감소
              </span>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const pillBtn = {
  padding: "5px 12px", borderRadius: 7, border: "1px solid #27272a",
  background: "#27272a", color: "#a1a1aa", fontSize: 12, fontWeight: 600,
  cursor: "pointer"
};

const labelStyle = {
  fontSize: 12, fontWeight: 700, color: "#a1a1aa",
  textTransform: "uppercase", letterSpacing: "0.06em"
};

const textareaStyle = {
  flex: 1, minHeight: 380, padding: 16, borderRadius: 12,
  border: "1.5px solid #27272a", background: "#18181b",
  color: "#e4e4e7", fontSize: 14, lineHeight: 1.75,
  fontFamily: "'Pretendard Variable', 'Noto Sans KR', sans-serif",
  resize: "none", outline: "none"
};
