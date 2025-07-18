import React, { useState } from "react";
import "./sidebar.css";
import { assets } from "../../assets/assets";

const Sidebar = ({ recents, onNewChat, onSelectRecent, onDeleteRecent }) => {
  const [extent, setextend] = useState(false);

  // Debug: Log recents prop
  console.log("Sidebar recents:", recents);

  return (
    <div className="sidebar">
      {/* TEST BUTTON FOR DEBUGGING */}
      
      <div className="top">
        <img
          onClick={() => setextend((prev) => !prev)}
          src={assets.menu_icon}
          alt=""
          className="menu"
        ></img>
        <div className="new-chat" onClick={onNewChat}>
          <img src={assets.plus_icon}></img>
          {extent ? <p>New Chat</p> : null}
        </div>
        {extent ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {recents.length === 0 && <div className="recent-entry"><p>No recents</p></div>}
            {recents.map((chatArr, idx) => (
              <div
                className="recent-entry"
                key={idx}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <img src={assets.message_icon} alt="" onClick={() => onSelectRecent(idx)} />
                <p
                  style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  onClick={() => onSelectRecent(idx)}
                >
                  {chatArr[0]?.question?.slice(0, 20) || 'Chat'}
                </p>
                {onDeleteRecent && (
                  <button
                    title="Delete recent chat"
                    onClick={() => onDeleteRecent(idx)}
                    className="close"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry" style={{ cursor: 'pointer' }}>
          <img alt="" src={assets.log_out} />
          {extent?<a
            href="http://localhost:3000/logout"
            style={{ marginLeft: '8px' }}
          >
            Logout
          </a>:null}
        </div> 
      </div>
    </div>
  );
};

export default Sidebar;
