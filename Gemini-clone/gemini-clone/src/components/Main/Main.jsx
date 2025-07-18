import React, { useState, useEffect, useRef } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { URL } from "../../config/gemini.js";

// Helper function to format AI answers for better UI
function formatAIAnswer(text) {
  // Replace **BOLD** with ALL CAPS
  text = text.replace(/\*\*(.*?)\*\*/g, (_, p1) => p1.toUpperCase());
  // Replace * bullets at line start with •
  text = text.replace(/^\s*\*\s+/gm, '• ');
  // Replace numbered lists like 1. with 1.
  text = text.replace(/^\s*\d+\.\s+/gm, match => '\n' + match.trim());
  // Add line breaks before section headers (all caps + colon)
  text = text.replace(/([A-Z0-9 ()\/-]+:)/g, '\n\n$1');
  // Add line breaks after bullets
  text = text.replace(/(• .+?)(?=\n|$)/g, '$1\n');
  // Remove extra stars
  text = text.replace(/\*+/g, '');
  // Remove extra blank lines
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}

const Main = ({ chat, setChat,username,Gname }) => {
  const [ques, setQues] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat, loading]);

  const handleChange = async () => {
    if (!ques.trim()) return;
    setLoading(true);
    setError("");
    let userQuestion = ques;
    setQues("");
    let response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: userQuestion },
            ],
          },
        ],
      }),
    });
    let data;
    try {
      data = await response.json();
      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text
      ) {
        setChat((prev) => [
          ...prev,
          {
            question: userQuestion,
            answer: formatAIAnswer(data.candidates[0].content.parts[0].text),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
        ]);
      } else {
        setError("No response or error from API.");
      }
    } catch (e) {
      setError("Failed to parse API response.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#f5f7fa',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      overflow: 'hidden',
    }}>
      {/* Sidebar is rendered outside this component */}
      {/* <div style={{ flex: '0 0 80px' }} /> Spacer for sidebar, adjust width as needed */}
      <div
        className="main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          width: '100%',
          height: '100vh',
          minHeight: '100vh',
          padding: 0,
          margin: 0,
        }}
      >
        <div
          className="chat-card"
          style={{
            width: '100%',
            height: '100vh',
            minHeight: '100vh',
            background: '#fff',
            borderRadius: 0,
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            margin: 0,
            padding: 0,
          }}
        >
          <div className="nav" style={{ padding: '24px 32px 0 32px' }}>
            <p style={{ fontWeight: 700, fontSize: 22, color: '#3F2B96', margin: 0 }}>Leo</p>
            <img src={assets.user_icon} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          </div>
          <div
            className="quesBox"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0 32px',
              marginTop: 15,
              marginBottom: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            {chat.length === 0 && (
              <>
                <div className="greet" style={{ textAlign: 'center', margin: '60px 0 40px 0' }}>
                  <p style={{ fontSize:56, fontWeight: 700, color: '#3F2B96', margin: 0 }}>
                    Hello, {Gname ? Gname : username || "Dev"}
                  </p>
                  <p style={{ fontSize: 36, fontWeight: 500, color: '#3F2B96', margin: 0 }}>
                    How can I help you today?
                  </p>
                </div>
              </>
            )}
            {chat.map((item, idx) => {
              if (item.type === "system") {
                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "24px 0",
                    }}
                  >
                    <div
                      style={{
                        background: "#f5f5f7",
                        color: "#555",
                        borderRadius: "12px",
                        padding: "16px 24px",
                        fontStyle: "italic",
                        fontSize: "1.05em",
                        boxShadow: "0 1px 4px #e0e7ff",
                        maxWidth: "70%",
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <span role="img" aria-label="info">ℹ️</span>
                      {item.text}
                    </div>
                  </div>
                );
              }
              // User message
              return (
                <React.Fragment key={idx}>
                  {/* User message */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 8 }}>
                    <div style={{ marginRight: 8 }}>
                      <span style={{ fontSize: 10, color: '#888' }}>{item.time}</span>
                    </div>
                    <div style={{
                      background: '#e0e7ff',
                      color: '#3F2B96',
                      borderRadius: '16px 16px 4px 16px',
                      padding: '10px 16px',
                      maxWidth: '60%',
                      fontWeight: 'bold',
                      boxShadow: '0 1px 4px #e0e7ff',
                      wordBreak: 'break-word',
                    }}>
                      {item.question}
                    </div>
                    <img src={assets.user_icon} alt="user" style={{ width: 32, height: 32, borderRadius: '50%', marginLeft: 8 }} />
                  </div>
                  {/* Gemini answer */}
                  <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', marginBottom: 24 }}>
                    <img src={assets.gemini_icon} alt="gemini" style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }} />
                    <div style={{
                      background: '#f0f4f9',
                      color: '#222',
                      borderRadius: '16px 16px 16px 4px',
                      padding: '10px 16px',
                      maxWidth: '60%',
                      boxShadow: '0 1px 4px #e0e7ff',
                      wordBreak: 'break-word',
                    }}>
                      {item.answer.split('\n').map((line, i) => {
                        if (/^[A-Z0-9 ()\/-]+:$/.test(line.trim())) {
                          // Section header
                          return (
                            <div key={i} style={{ fontWeight: 'bold', marginTop: 16, marginBottom: 4, fontSize: '1.08em' }}>
                              {line.trim()}
                            </div>
                          );
                        }
                        if (/^(•|[0-9]+\.) /.test(line.trim())) {
                          // Bullet or numbered list
                          return (
                            <div key={i} style={{ marginLeft: 18, marginBottom: 4 }}>
                              {line.trim()}
                            </div>
                          );
                        }
                        // Normal text
                        return (
                          <div key={i} style={{ marginBottom: 4 }}>
                            {line.trim()}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ marginLeft: 8 }}>
                      <span style={{ fontSize: 10, color: '#888' }}>{item.time}</span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            {loading && <div style={{ color: '#888', textAlign: 'center' }}>Loading...</div>}
            {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            <div ref={chatEndRef} />
          </div>
          {/* Input area sticky at bottom of chat card */}
          <div
            className="main-bottom"
            style={{
              position: 'sticky',
              left: 0,
              right: 0,
              bottom: 0,
              // background: 'rgba(255,255,255,0.98)',
              padding: '16px 32px 24px 32px',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              // boxShadow: '0 -2px 8px #e0e7ff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
            <div className="search-box"
              // width: '100%',
              // maxWidth: 600,
              // background: '#f0f4f9',
              // borderRadius: 32,
              // padding: '8px 16px',
              // display: 'flex',
              // alignItems: 'center',
              // boxShadow: '0 1px 4px #e0e7ff',
            >
              <input
                type="text"
                placeholder="Enter prompt here"
                onChange={(e) => setQues(e.target.value)}
                value={ques}
                onKeyDown={e => { if (e.key === 'Enter') handleChange(); }}
                // style={{
                //   flex: 1,
                //   border: 'none',
                //   outline: 'none',
                //   background: 'transparent',
                //   fontSize: 18,
                //   padding: '8px 0',
                // }}
              />
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <img src={assets.gallery_icon} alt="" style={{ width: 24, cursor: 'pointer' }} />
                <img src={assets.mic_icon} alt="" style={{ width: 24, cursor: 'pointer' }} />
                <img src={assets.send_icon} alt="" style={{ width: 28, cursor: 'pointer' }} onClick={handleChange} />
              </div>
            </div>
            <p className="bottom-info" style={{ fontSize: 13, marginTop: 8, color: '#888', textAlign: 'center' }}>
              Leo may display inaccurate info, including about people, so double-check its responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
