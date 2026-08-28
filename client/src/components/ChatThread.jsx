// client/src/components/ChatThread.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Avatar } from './ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getSocket, joinConversation, leaveConversation, emitTyping } from '../lib/socket.js';
import { clockTime } from '../lib/format.js';
import I from './icons.jsx';

export function Conversation({ id }) {
  const nav = useNavigate();
  const { user } = useAuth();
  const [conv, setConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const bodyRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([api.get('/conversations/' + id), api.get('/conversations/' + id + '/messages')])
      .then(([c, m]) => { if (alive) { setConv(c.data); setMessages(m.data); } })
      .finally(() => alive && setLoading(false));

    const socket = getSocket();
    joinConversation(id);
    socket.on('message', onMsg);
    socket.on('typing', onTyping);
    return () => { socket.off('message', onMsg); socket.off('typing', onTyping); leaveConversation(id); alive = false; };
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const onMsg = (msg) => {
    if (msg.conversation === id) setMessages((m) => [...m, msg]);
  };
  const onTyping = ({ conversationId, userId, isTyping }) => {
    if (conversationId === id && userId !== user?._id) {
      setTyping(isTyping);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setTyping(false), 1500);
    }
  };

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    setText('');
    const optimistic = { _id: 'opt' + Date.now(), conversation: id, sender: user, body, createdAt: new Date().toISOString() };
    setMessages((m) => [...m, optimistic]);
    try { await api.post('/conversations/' + id + '/messages', { body }); }
    catch (e) { /* surface error */ }
  };

  const onType = (v) => {
    setText(v);
    emitTyping(id, true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => emitTyping(id, false), 1200);
  };

  if (loading) return <div className="thread"><div className="skeleton" style={{ flex: 1 }} /></div>;
  const other = conv?.other || conv?.participants?.find((p) => p._id !== user?._id);

  return (
    <div className="thread">
      <div className="thread-head">
        <button className="iconbtn" style={{ display: 'none' }} onClick={() => nav('/messages')}><I.arrowLeft /></button>
        <Avatar name={other?.name} src={other?.avatar} size={38} color={other?.color} />
        <div className="grow">
          <b>{other?.name}</b>
          {conv?.listing && <div className="t-xs t-muted truncate">Re: {conv.listing.title} · ₹{conv.listing.price}</div>}
        </div>
        {conv?.listing && <button className="btn btn-ghost btn-sm" onClick={() => nav('/listing/' + conv.listing._id)}>View</button>}
      </div>
      <div className="thread-body" ref={bodyRef}>
        {messages.map((m, i) => {
          const mine = (m.sender?._id || m.sender) === user?._id;
          if (m.system) return <div key={i} className="msg-system">{m.body}</div>;
          return (
            <div key={m._id || i} className={`msg ${mine ? 'msg-out' : 'msg-in'}`}>
              {m.body}
              <div className="t">{clockTime(m.createdAt)}</div>
            </div>
          );
        })}
        {typing && <div className="typing">{other?.name?.split(' ')[0]} is typing…</div>}
      </div>
      <div className="composer">
        <textarea rows={1} value={text} onChange={(e) => onType(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Write a message…" />
        <button className="btn btn-primary" onClick={send}><I.send size={16} /></button>
      </div>
    </div>
  );
}
