// client/src/pages/Messages.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Avatar, Skeleton } from '../components/ui.jsx';
import { Conversation } from '../components/ChatThread.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { timeAgo } from '../lib/format.js';
import I from '../components/icons.jsx';

export default function Messages() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [convos, setConvos] = useState(null);

  useEffect(() => {
    api.get('/conversations').then((r) => setConvos(r.data)).catch(() => setConvos([]));
  }, []);

  return (
    <div className="chat-layout">
      <div className="chat-list-col">
        <div className="conv-list">
          <div className="row-between" style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
            <h2 className="t-h3">Messages</h2>
            <button className="iconbtn" onClick={() => nav('/marketplace')} title="New"><I.plus /></button>
          </div>
          {!convos ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ padding: 14 }}><Skeleton h={40} /></div>)
          ) : convos.length === 0 ? (
            <div className="empty" style={{ padding: 40 }}><I.chat size={36} /><p style={{ marginTop: 10 }}>No conversations yet. Message a seller to start one.</p></div>
          ) : (
            convos.map((c) => (
              <div key={c._id} className={`conv ${id === c._id ? 'active' : ''}`} onClick={() => nav('/messages/' + c._id)}>
                <Avatar name={c.other?.name} src={c.other?.avatar} size={42} color={c.other?.color} />
                <div className="grow" style={{ minWidth: 0 }}>
                  <div className="row-between">
                    <b className="truncate" style={{ fontSize: 'var(--fs-sm)' }}>{c.other?.name}</b>
                    <span className="time">{timeAgo(c.lastMessageAt)}</span>
                  </div>
                  <div className="row" style={{ gap: 6 }}>
                    <span className="last grow truncate">{c.lastMessage || 'No messages'}</span>
                    {c.unread > 0 && <span className="unread-dot" />}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {id ? <Conversation id={id} /> : (
        <div className="thread" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--faint)' }}>
          <div className="center"><I.chat size={42} /><p style={{ marginTop: 10 }}>Select a conversation to start chatting.</p></div>
        </div>
      )}
    </div>
  );
}
