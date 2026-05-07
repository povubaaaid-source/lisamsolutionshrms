"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { 
  Search, Send, Paperclip, MoreVertical, Circle, Phone, Video, 
  SearchIcon, Plus, X, Users, Image as ImageIcon, FileText, 
  Check, CheckCheck, Reply, Edit2, Trash, Smile, Pin, Menu, 
  ArrowLeft, Download, ThumbsUp, Heart, Laugh 
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// --- Types ---
type Reaction = { emoji: string; count: number; userReacted: boolean };

type MessageType = {
  id: string | number;
  text: string;
  sender: string;
  time: string;
  chatId: string | number;
  file?: { name: string; url: string; type: string; size?: string; progress?: number };
  status?: 'sending' | 'sent' | 'delivered' | 'seen';
  replyTo?: MessageType;
  reactions?: Reaction[];
  isPinned?: boolean;
  isDeleted?: boolean;
  isEdited?: boolean;
};

type ChatType = {
  id: string | number;
  type: "user" | "group";
  name: string;
  role?: string;
  status?: string;
  lastMsg: string;
  unreadCount?: number;
  members?: string[];
  avatar?: string;
};

// --- Mock Data ---
const initialContacts: ChatType[] = [
  { id: 1, type: "user", name: "Alice Smith", role: "Developer", status: "online", lastMsg: "The dashboard looks great!", unreadCount: 2 },
  { id: 2, type: "user", name: "Bob Johnson", role: "Project Manager", status: "offline", lastMsg: "Let's meet at 2 PM.", unreadCount: 0 },
  { id: 3, type: "user", name: "Carol White", role: "Designer", status: "online", lastMsg: "Sent the final assets.", unreadCount: 1 },
  { id: 4, type: "user", name: "David Lee", role: "Backend", status: "away", lastMsg: "API is ready for testing.", unreadCount: 0 },
  { id: "g1", type: "group", name: "Frontend Team", lastMsg: "Please check the new PR", members: ["Alice Smith", "Bob Johnson"], unreadCount: 0 },
];

const initialMessages: MessageType[] = [
  { id: 1, text: "Hey Alice, how's the progress on the dashboard?", sender: "me", time: "10:00 AM", chatId: 1, status: "seen" },
  { id: 2, text: "Hey! It's going well. I'm just finishing the charts.", sender: "Alice Smith", time: "10:02 AM", chatId: 1, status: "seen", reactions: [{ emoji: "👍", count: 1, userReacted: true }] },
  { id: 3, text: "The dashboard looks great!", sender: "Alice Smith", time: "10:02 AM", chatId: 1, status: "seen", isPinned: true },
  { id: 4, text: "Welcome to the Frontend Team group!", sender: "me", time: "09:00 AM", chatId: "g1", status: "seen" },
  { id: 5, text: "Thanks!", sender: "Alice Smith", time: "09:05 AM", chatId: "g1", status: "seen" },
];

export default function ChatPage() {
  const [contacts, setContacts] = useState<ChatType[]>(initialContacts);
  const [activeContact, setActiveContact] = useState<ChatType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  
  // UI States
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'groups'>('all');
  const [showSidebar, setShowSidebar] = useState(true);
  
  // Modal States
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Message Action States
  const [replyingTo, setReplyingTo] = useState<MessageType | null>(null);
  const [editingMsg, setEditingMsg] = useState<MessageType | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [hoveredMsgId, setHoveredMsgId] = useState<string | number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Derived State ---
  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === 'unread') return (c.unreadCount || 0) > 0;
    if (activeTab === 'groups') return c.type === 'group';
    return true;
  });

  const activeMessages = activeContact 
    ? messages.filter(m => m.chatId === activeContact.id && (!chatSearchQuery || m.text.toLowerCase().includes(chatSearchQuery.toLowerCase())))
    : [];

  const pinnedMessages = activeMessages.filter(m => m.isPinned);

  // --- Effects ---
  useEffect(() => {
    // Scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length]);

  useEffect(() => {
    // If mobile, auto-hide sidebar when contact selected
    const isMobile = window.innerWidth < 768;
    if (isMobile && activeContact) {
      setShowSidebar(false);
    }
  }, [activeContact]);

  // --- Handlers ---
  const handleSend = () => {
    if (!input.trim() && !editingMsg) return;

    if (editingMsg) {
      setMessages(msgs => msgs.map(m => m.id === editingMsg.id ? { ...m, text: input, isEdited: true } : m));
      setEditingMsg(null);
      setInput("");
      return;
    }

    if (!activeContact) return;

    const newMsg: MessageType = {
      id: Date.now(),
      text: input,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chatId: activeContact.id,
      status: "sending",
      replyTo: replyingTo || undefined
    };

    setMessages([...messages, newMsg]);
    setReplyingTo(null);
    setInput("");
    
    // Update last message
    setContacts(contacts.map(c => c.id === activeContact.id ? { ...c, lastMsg: input } : c));

    // Simulate sending flow
    setTimeout(() => {
      setMessages(msgs => msgs.map(m => m.id === newMsg.id ? { ...m, status: "sent" } : m));
      setTimeout(() => {
        setMessages(msgs => msgs.map(m => m.id === newMsg.id ? { ...m, status: "delivered" } : m));
      }, 1000);
    }, 800);

    // Simulate reply
    if (activeContact.type === 'user') {
      setTimeout(() => setIsTyping(true), 2000);
      setTimeout(() => {
        setIsTyping(false);
        const replyMsg: MessageType = {
          id: Date.now(),
          text: "That sounds good to me!",
          sender: activeContact.name,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chatId: activeContact.id,
          status: "seen"
        };
        setMessages(prev => [...prev, replyMsg]);
        setContacts(prev => prev.map(c => c.id === activeContact.id ? { ...c, lastMsg: replyMsg.text } : c));
        
        // Mark ours as seen
        setMessages(msgs => msgs.map(m => m.id === newMsg.id ? { ...m, status: "seen" } : m));
      }, 5000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeContact) return;

    const fileUrl = URL.createObjectURL(file);
    const fileType = file.type.startsWith('image/') ? 'image' : 'file';
    const size = (file.size / 1024 / 1024).toFixed(2) + ' MB';

    const newMsg: MessageType = {
      id: Date.now(),
      text: file.name,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chatId: activeContact.id,
      status: "sending",
      file: { name: file.name, url: fileUrl, type: fileType, size, progress: 0 }
    };

    setMessages([...messages, newMsg]);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setMessages(msgs => msgs.map(m => 
        m.id === newMsg.id ? { ...m, file: { ...m.file!, progress } } : m
      ));
      if (progress >= 100) {
        clearInterval(interval);
        setMessages(msgs => msgs.map(m => 
          m.id === newMsg.id ? { ...m, status: "sent", file: { ...m.file!, progress: undefined } } : m
        ));
      }
    }, 500);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (id: string | number) => {
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, isDeleted: true, text: "This message was deleted", file: undefined } : m));
  };

  const toggleReaction = (msgId: string | number, emoji: string) => {
    setMessages(msgs => msgs.map(m => {
      if (m.id !== msgId) return m;
      const reactions = m.reactions || [];
      const existing = reactions.find(r => r.emoji === emoji);
      
      let newReactions;
      if (existing) {
        if (existing.userReacted) {
          newReactions = reactions.map(r => r.emoji === emoji ? { ...r, count: r.count - 1, userReacted: false } : r).filter(r => r.count > 0);
        } else {
          newReactions = reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, userReacted: true } : r);
        }
      } else {
        newReactions = [...reactions, { emoji, count: 1, userReacted: true }];
      }
      return { ...m, reactions: newReactions };
    }));
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || selectedMembers.length === 0) return;
    const newGroup: ChatType = {
      id: `g${Date.now()}`,
      type: "group",
      name: newGroupName,
      members: selectedMembers,
      lastMsg: "Group created"
    };
    setContacts([newGroup, ...contacts]);
    setShowGroupModal(false);
    setNewGroupName("");
    setSelectedMembers([]);
    setActiveContact(newGroup);
  };

  const formatFileSize = (bytes?: number) => bytes ? (bytes / 1024 / 1024).toFixed(2) + ' MB' : '';

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-140px)] flex bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden -mx-6 -mt-6">
         
         {/* Contacts Sidebar */}
         <div className={`w-full md:w-80 border-r border-gray-200 flex-col bg-gray-50 ${showSidebar ? 'flex' : 'hidden md:flex'}`}>
            <div className="p-6 border-b border-gray-200 bg-white">
               <div className="flex items-center justify-between mb-6">
                 <h1 className="text-base font-black text-gray-800 uppercase tracking-widest">Chats</h1>
                 <button 
                   onClick={() => setShowGroupModal(true)}
                   className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all"
                   title="New Group"
                 >
                   <Plus className="h-4 w-4" />
                 </button>
               </div>

               {/* Search */}
               <div className="relative group mb-4">
                  <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search chats..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                  />
               </div>

               {/* Tabs */}
               <div className="flex space-x-2">
                 {(['all', 'unread', 'groups'] as const).map(t => (
                   <button
                     key={t}
                     onClick={() => setActiveTab(t)}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                       activeTab === t ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                     }`}
                   >
                     {t}
                   </button>
                 ))}
               </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
               {filteredContacts.length === 0 && (
                 <div className="p-4 text-center text-xs text-gray-400 font-bold">No chats found.</div>
               )}
               {filteredContacts.map((c) => (
                  <div 
                    key={c.id} 
                    onClick={() => { setActiveContact(c); if(c.unreadCount) setContacts(contacts.map(x => x.id === c.id ? {...x, unreadCount: 0} : x)); }}
                    className={`flex items-center space-x-4 p-3 rounded-2xl cursor-pointer transition-all relative ${
                       activeContact?.id === c.id ? "bg-white shadow-sm ring-1 ring-gray-100" : "hover:bg-white/50"
                    }`}
                  >
                     <div className="relative">
                        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm ${c.type === 'group' ? 'bg-indigo-100 text-indigo-600' : 'bg-primary/10 text-primary'}`}>
                           {c.type === 'group' ? <Users className="h-5 w-5" /> : c.name.charAt(0)}
                        </div>
                        {c.type === 'user' && (
                          <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
                             c.status === "online" ? "bg-green-500" : c.status === "away" ? "bg-orange-500" : "bg-gray-300"
                          }`} />
                        )}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                           <p className="text-sm font-black text-gray-800 truncate">{c.name}</p>
                        </div>
                        <p className={`text-xs truncate mt-0.5 ${c.unreadCount ? 'font-bold text-gray-800' : 'font-medium text-gray-400'}`}>
                          {c.lastMsg}
                        </p>
                     </div>
                     {!!c.unreadCount && c.unreadCount > 0 && (
                       <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center text-[9px] font-black text-white absolute right-4">
                         {c.unreadCount}
                       </div>
                     )}
                  </div>
               ))}
            </div>
         </div>

         {/* Chat Area */}
         <div className={`flex-1 flex flex-col bg-white relative ${!showSidebar ? 'flex' : 'hidden md:flex'}`}>
            {activeContact ? (
              <>
                {/* Chat Header */}
                <div className="px-6 md:px-8 py-4 border-b border-gray-200 flex items-center justify-between bg-white/50 backdrop-blur-sm z-10 shadow-sm">
                   <div className="flex items-center space-x-4">
                      {/* Mobile back button */}
                      <button 
                        onClick={() => setShowSidebar(true)}
                        className="md:hidden p-2 -ml-2 text-gray-400 hover:text-primary transition-colors"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>

                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs shadow-lg ${activeContact.type === 'group' ? 'bg-indigo-500 text-white shadow-indigo-500/20' : 'bg-primary text-white shadow-primary/20'}`}>
                         {activeContact.type === 'group' ? <Users className="h-5 w-5" /> : activeContact.name.charAt(0)}
                      </div>
                      <div>
                         <p className="text-sm font-black text-gray-800 tracking-tight">{activeContact.name}</p>
                         {activeContact.type === 'user' ? (
                           <p className="text-[9px] text-green-500 font-black uppercase tracking-widest flex items-center mt-0.5">
                              <Circle className="h-2 w-2 fill-current mr-1.5" /> Online
                           </p>
                         ) : (
                           <p className="text-[9px] text-gray-400 font-bold tracking-widest mt-0.5 truncate max-w-[200px]">
                              You, {activeContact.members?.join(", ")}
                           </p>
                         )}
                      </div>
                   </div>
                   <div className="flex items-center space-x-1 md:space-x-2">
                      <button onClick={() => setShowChatSearch(!showChatSearch)} className={`p-2.5 rounded-xl transition-all ${showChatSearch ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-primary hover:bg-gray-50'}`}><SearchIcon className="h-5 w-5" /></button>
                      <button className="hidden md:block p-2.5 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-xl transition-all"><Phone className="h-5 w-5" /></button>
                      <button className="hidden md:block p-2.5 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-xl transition-all"><Video className="h-5 w-5" /></button>
                      <button className="p-2.5 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-xl transition-all"><MoreVertical className="h-5 w-5" /></button>
                   </div>
                </div>

                {/* In-Chat Search Bar */}
                {showChatSearch && (
                  <div className="px-8 py-3 bg-gray-50 border-b border-gray-100 flex items-center">
                    <Search className="h-4 w-4 text-gray-400 mr-3" />
                    <input 
                      type="text" 
                      placeholder="Search in this chat..." 
                      value={chatSearchQuery}
                      onChange={(e) => setChatSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-none text-xs font-bold outline-none"
                    />
                    <button onClick={() => {setShowChatSearch(false); setChatSearchQuery("");}}><X className="h-4 w-4 text-gray-400 hover:text-red-500" /></button>
                  </div>
                )}

                {/* Pinned Messages */}
                {pinnedMessages.length > 0 && (
                  <div className="bg-primary/5 px-8 py-2 border-b border-primary/10 flex items-center cursor-pointer hover:bg-primary/10 transition-colors">
                    <Pin className="h-4 w-4 text-primary mr-3" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">Pinned Message</p>
                      <p className="text-xs text-gray-700 truncate font-medium">{pinnedMessages[0].text}</p>
                    </div>
                  </div>
                )}

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-gray-50">
                   {activeMessages.length === 0 && !chatSearchQuery && (
                     <div className="flex flex-col h-full items-center justify-center text-gray-400 space-y-4">
                       <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center"><SearchIcon className="h-8 w-8 text-gray-300" /></div>
                       <p className="text-xs font-bold">No messages yet. Say hello!</p>
                     </div>
                   )}
                   {activeMessages.length === 0 && chatSearchQuery && (
                     <div className="flex h-full items-center justify-center text-gray-400 text-xs font-bold">No results found for "{chatSearchQuery}"</div>
                   )}

                   {activeMessages.map((m) => {
                      const isMe = m.sender === "me";
                      return (
                        <div 
                          key={m.id} 
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                          onMouseEnter={() => setHoveredMsgId(m.id)}
                          onMouseLeave={() => setHoveredMsgId(null)}
                        >
                           <div className={`max-w-[85%] md:max-w-[70%] flex flex-col relative ${isMe ? "items-end" : "items-start"}`}>
                              {/* Sender Name in Group */}
                              {activeContact.type === 'group' && !isMe && (
                                <span className="text-[10px] font-bold text-gray-500 mb-1 ml-2">{m.sender}</span>
                              )}

                              {/* Message Actions (Hover) */}
                              {!m.isDeleted && hoveredMsgId === m.id && (
                                <div className={`absolute top-0 -mt-8 bg-white shadow-lg border border-gray-100 rounded-xl p-1 flex space-x-1 z-10 ${isMe ? 'right-0' : 'left-0'}`}>
                                  <button onClick={() => toggleReaction(m.id, "👍")} className="p-1.5 hover:bg-gray-50 rounded-lg text-sm">👍</button>
                                  <button onClick={() => toggleReaction(m.id, "❤️")} className="p-1.5 hover:bg-gray-50 rounded-lg text-sm">❤️</button>
                                  <div className="w-px h-4 bg-gray-100 my-auto mx-1" />
                                  <button onClick={() => setReplyingTo(m)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg"><Reply className="h-3.5 w-3.5" /></button>
                                  {isMe && <button onClick={() => { setEditingMsg(m); setInput(m.text); }} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-gray-50 rounded-lg"><Edit2 className="h-3.5 w-3.5" /></button>}
                                  {isMe && <button onClick={() => handleDelete(m.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg"><Trash className="h-3.5 w-3.5" /></button>}
                                </div>
                              )}

                              {/* Replied Message Preview */}
                              {m.replyTo && (
                                <div className={`mb-1 p-2 rounded-xl text-[10px] border-l-2 opacity-75 ${isMe ? 'bg-primary/20 border-white text-white' : 'bg-gray-100 border-primary text-gray-600'}`}>
                                  <span className="font-bold block mb-0.5">{m.replyTo.sender === "me" ? "You" : m.replyTo.sender}</span>
                                  <span className="truncate block">{m.replyTo.text}</span>
                                </div>
                              )}

                              {/* Bubble */}
                              <div className={`px-5 py-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-md transition-all ${
                                 m.isDeleted ? "bg-white border border-gray-200 text-gray-400 italic"
                                 : isMe 
                                 ? "bg-primary text-white rounded-tr-none border border-primary-dark" 
                                 : "bg-white text-gray-800 rounded-tl-none border border-gray-200"
                              }`}>
                                 {m.file ? (
                                   <div className="flex flex-col gap-3 min-w-[200px]">
                                     {m.file.type === 'image' ? (
                                       <img 
                                         src={m.file.url} 
                                         alt={m.file.name} 
                                         className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity" 
                                         onClick={() => setImagePreview(m.file!.url)}
                                       />
                                     ) : (
                                       <div className={`flex items-center gap-3 p-3 rounded-xl ${isMe ? 'bg-white/10' : 'bg-gray-50'}`}>
                                         <div className={`p-2 rounded-lg ${isMe ? 'bg-white/20' : 'bg-white shadow-sm'}`}><FileText className="h-6 w-6" /></div>
                                         <div className="flex-1 min-w-0">
                                           <p className="font-bold truncate text-xs">{m.file.name}</p>
                                           <p className="text-[10px] opacity-70">{m.file.size}</p>
                                         </div>
                                         <button className="p-1 hover:bg-white/20 rounded-lg"><Download className="h-4 w-4" /></button>
                                       </div>
                                     )}
                                     {m.file.progress !== undefined && (
                                       <div className="w-full bg-black/20 rounded-full h-1 mt-1">
                                         <div className="bg-white h-1 rounded-full transition-all duration-300" style={{width: `${m.file.progress}%`}}></div>
                                       </div>
                                     )}
                                     {m.text !== m.file.name && <span className="mt-1 block">{m.text}</span>}
                                   </div>
                                 ) : (
                                   m.text
                                 )}
                              </div>

                              {/* Reactions */}
                              {m.reactions && m.reactions.length > 0 && (
                                <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                  {m.reactions.map(r => (
                                    <div key={r.emoji} onClick={() => toggleReaction(m.id, r.emoji)} className={`px-1.5 py-0.5 rounded-full text-[10px] flex items-center cursor-pointer border ${r.userReacted ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white border-gray-100'}`}>
                                      {r.emoji} <span className="ml-1 font-bold">{r.count}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Meta Info (Time, Status, Edited) */}
                              <div className={`flex items-center space-x-1.5 mt-1.5 text-[9px] font-black uppercase tracking-widest ${isMe ? 'text-gray-300' : 'text-gray-400'}`}>
                                {m.isEdited && <span>Edited</span>}
                                {m.isEdited && <span>•</span>}
                                <span>{m.time}</span>
                                {isMe && !m.isDeleted && (
                                  <span className="ml-1">
                                    {m.status === 'sending' && <Circle className="h-3 w-3 animate-pulse" />}
                                    {m.status === 'sent' && <Check className="h-3 w-3" />}
                                    {m.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                                    {m.status === 'seen' && <CheckCheck className="h-3 w-3 text-blue-500" />}
                                  </span>
                                )}
                              </div>
                           </div>
                        </div>
                      )
                   })}
                   
                   {/* Typing Indicator */}
                   {isTyping && (
                     <div className="flex justify-start">
                       <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 flex space-x-1 items-center shadow-sm">
                         <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                         <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                         <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                       </div>
                     </div>
                   )}
                   <div ref={messagesEndRef} />
                </div>

                {/* Reply Indicator */}
                {replyingTo && (
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">Replying to {replyingTo.sender === "me" ? "yourself" : replyingTo.sender}</p>
                      <p className="text-xs text-gray-600 truncate max-w-md">{replyingTo.text}</p>
                    </div>
                    <button onClick={() => setReplyingTo(null)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-xl"><X className="h-4 w-4" /></button>
                  </div>
                )}
                
                {/* Editing Indicator */}
                {editingMsg && (
                  <div className="px-6 py-3 bg-blue-50 border-t border-blue-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-0.5">Editing Message</p>
                    </div>
                    <button onClick={() => {setEditingMsg(null); setInput("");}} className="p-1.5 text-gray-400 hover:text-red-500 rounded-xl"><X className="h-4 w-4" /></button>
                  </div>
                )}

                {/* Chat Input */}
                <div className="p-4 md:p-6 bg-white border-t border-gray-200 z-10">
                   <div className="flex items-center space-x-2 md:space-x-4 bg-white p-2 rounded-2xl border-2 border-gray-200 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-sm">
                      
                      {/* Attach File */}
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" id="file-upload" />
                      <label htmlFor="file-upload" className="p-2 md:p-2.5 text-gray-400 hover:text-primary hover:bg-white rounded-xl transition-all cursor-pointer">
                        <Paperclip className="h-5 w-5" />
                      </label>
                      
                      {/* Emoji Picker Fake */}
                      <button className="hidden md:block p-2 text-gray-400 hover:text-primary hover:bg-white rounded-xl transition-all">
                        <Smile className="h-5 w-5" />
                      </button>

                      {/* Input Field */}
                      <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={activeContact.type === 'group' ? "Message group..." : "Type a message..."} 
                        className="flex-1 bg-transparent border-none text-sm font-semibold text-gray-700 outline-none py-2 px-2 placeholder-gray-400"
                      />
                      
                      {/* Send Button */}
                      <button 
                        onClick={handleSend}
                        disabled={!input.trim() && !editingMsg}
                        className={`h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                          (!input.trim() && !editingMsg) ? 'bg-gray-200 text-gray-400 shadow-none' : 'bg-primary text-white shadow-primary/20 hover:scale-105 active:scale-95'
                        }`}
                      >
                         <Send className="h-4 w-4 md:h-5 md:w-5" />
                      </button>
                   </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
                <div className="h-24 w-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Search className="h-6 w-6" />
                  </div>
                </div>
                <h2 className="text-lg font-black text-gray-800 tracking-tight">Select a chat to start messaging</h2>
                <p className="text-xs text-gray-400 font-medium mt-2">Choose from your existing conversations or create a new group.</p>
              </div>
            )}
         </div>
      </div>

      {/* Image Preview Modal */}
      {imagePreview && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center" onClick={() => setImagePreview(null)}>
          <button className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 rounded-full transition-all">
            <X className="h-6 w-6" />
          </button>
          <img src={imagePreview} alt="Preview" className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl" />
        </div>
      )}

      {/* Create Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden transform transition-all">
            <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Create New Group</h2>
              <button onClick={() => setShowGroupModal(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full shadow-sm">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Avatar Upload Fake */}
              <div className="flex flex-col items-center justify-center">
                <div className="h-20 w-20 bg-gray-50 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                  <ImageIcon className="h-6 w-6 text-gray-400 group-hover:text-primary" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase mt-3">Upload Group Icon</p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Group Name</label>
                <input 
                  type="text" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Project Alpha Team" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Members</label>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                  {contacts.filter(c => c.type === 'user').map(c => {
                    const isSelected = selectedMembers.includes(c.name);
                    return (
                      <div 
                        key={c.id} 
                        onClick={() => {
                          if (isSelected) setSelectedMembers(selectedMembers.filter(m => m !== c.name));
                          else setSelectedMembers([...selectedMembers, c.name]);
                        }}
                        className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer border transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-50 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-primary font-black text-xs shadow-sm">
                          {c.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-bold text-gray-700 block">{c.name}</span>
                          <span className="text-[9px] font-black text-gray-400 uppercase">{c.role}</span>
                        </div>
                        {isSelected && (
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              <Button onClick={handleCreateGroup} className="w-full justify-center h-12 text-xs">
                Create Group
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
