<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
=======
<<<<<<< HEAD
<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react'
import { useSidebar } from '../../hooks/useSidebar'
import Sidebar from '../../components/layout/Sidebar'
import TopNav from '../../components/layout/TopNav'
import {
  Pen,
  ChevronDown,
  ChevronRight,
  User,
  Palette,
  Globe,
  Calendar,
  Building2,
  UserCircle
} from 'lucide-react'
import EnvTable from '../../components/project/EnvTable'
import { getCurrentUser, updateCurrentUser } from '../../api/api'
import heroBg from '../../assets/new-top.png'

// Import avatars
import pf1 from '../../assets/pf1.jpeg'
import pf2 from '../../assets/pf2.jpeg'
import pf3 from '../../assets/pf3.jpeg'
import pf4 from '../../assets/pf4.jpeg'
import pf5 from '../../assets/pf5.jpeg'
// Fallback array (handling pf6 missing gracefully)
const AVATARS = [pf1, pf2, pf3, pf4, pf5]

export default function Settings () {
  const { isCollapsed, toggleSidebar } = useSidebar()
  const [activeTab, setActiveTab] = useState('Profile')
  const [profileName, setProfileName] = useState('Sheryian')
  const [profileEmail, setProfileEmail] = useState('sheryian@example.com')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  const [selectedAvatar, setSelectedAvatar] = useState(pf1)
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false)
  const pickerRef = useRef(null)

  // Close avatar picker when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsAvatarPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const { data } = await getCurrentUser()
        const user = data?.user
        if (user?.username) setProfileName(user.username)
        if (user?.email) setProfileEmail(user.email)
        if (user?.avatar) setSelectedAvatar(user.avatar)
      } catch (error) {
        // Keep local defaults if auth/me is unavailable.
      }
    }

    loadCurrentUser()
  }, [])

  const handleSaveChanges = async () => {
    setSaveMessage('')
    setSaveError('')
    setIsSaving(true)
    try {
      const payload = {
        username: profileName,
        email: profileEmail,
        avatarUrl: selectedAvatar
      }
      const { data } = await updateCurrentUser(payload)
      const updated = data?.user
      if (updated?.username) setProfileName(updated.username)
      if (updated?.email) setProfileEmail(updated.email)
      if (updated?.avatar) setSelectedAvatar(updated.avatar)
      setSaveMessage('Changes saved successfully.')
    } catch (error) {
      setSaveError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to save changes.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className='flex h-screen overflow-hidden bg-[#050505] text-white uppercase tracking-wide'
      style={{ fontFamily: "'Space Mono', monospace" }}
    >
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${
          isCollapsed ? 'ml-0 md:ml-[72px]' : 'ml-0 md:ml-[260px]'
        }`}
      >
        {/* HERO */}
        <div
          className='relative shrink-0 min-h-[140px] bg-cover bg-center flex flex-col justify-between border-b border-[#222]'
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className='absolute inset-0 bg-[#050505]/80 backdrop-blur-sm' />
          <TopNav />
          <div className='relative z-10 px-6 pb-4'>
            <h1
              className='text-xl md:text-2xl text-[#FFCC00] leading-relaxed tracking-widest'
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              SETTINGS
            </h1>
            <p className='text-[9px] text-[#888] mt-2 leading-loose uppercase'>
              Manage account profile, workspace and secret configuration
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
import React, { useState, useRef, useEffect } from 'react';
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../../components/layout/Sidebar";
import Dock from "../../components/layout/Dock";
import PageWrapper from "../../components/layout/PageWrapper";
import TopNav from "../../components/layout/TopNav";
import {
    Settings as SettingsIcon,
    Key,
    Globe,
    Shield,
    AlertTriangle,
    Cpu,
    Loader2,
    LayoutGrid,
    User,
    ChevronRight,
    Folder
} from "lucide-react";
import GlassButton from "../../components/ui/GlassButton";
import InputField from "../../components/ui/InputField";
import EnvTable from "../../components/project/EnvTable";
import { motion } from "framer-motion";
import { getProject, updateProject, deleteProject, getProjects } from "../../api/api";
import { AlertBanner, Card, PageHeader } from "../../components/layout/PageLayout";

export default function Settings() {
    const { isCollapsed, toggleSidebar, navMode, toggleNavMode } = useSidebar();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const projectId = searchParams.get("projectId") || "";

    const [activeTab, setActiveTab] = useState("GENERAL");
    const [project, setProject] = useState(null);
    const [allProjects, setAllProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Form states
    const [projectName, setProjectName] = useState("");
    const [installCommand, setInstallCommand] = useState("");
    const [startCommand, setStartCommand] = useState("");

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                if (projectId) {
                    const { data } = await getProject(projectId);
                    setProject(data.data);
                    setProjectName(data.data.name);
                    setInstallCommand(data.data.installCommand || "npm install");
                    setStartCommand(data.data.startCommand || "npm start");
                } else {
                    // Load all projects for selection if in "Global" mode
                    const { data } = await getProjects();
                    setAllProjects(data.data || []);
                }
            } catch (err) {
                setError("Failed to load details.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [projectId]);

    const handleUpdate = async (fields) => {
        setSaving(true);
        setError("");
        setSuccessMsg("");
        try {
            const { data } = await updateProject(projectId, fields);
            setProject(data.data);
            setSuccessMsg("Settings updated successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update project.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
        
        setSaving(true);
        try {
            await deleteProject(projectId);
            navigate("/dashboard");
        } catch (err) {
            setError("Failed to delete project.");
            setSaving(false);
        }
    };

<<<<<<< HEAD
    const projectTabs = [
        { id: "GENERAL", label: "General", icon: SettingsIcon },
        { id: "VARIABLES", label: "Environment Variables", icon: Key },
        { id: "ADVANCED", label: "Advanced", icon: Cpu },
        { id: "DANGER", label: "Danger Zone", icon: AlertTriangle },
    ];

    const globalTabs = [
        { id: "WORKSPACE", label: "Workspace", icon: LayoutGrid },
        { id: "PROFILE", label: "Profile", icon: User },
        { id: "SECURITY", label: "Security", icon: Shield },
    ];
=======
        {/* HERO */}
        <div className="relative shrink-0 min-h-[120px] bg-cover bg-center flex flex-col justify-between border-b border-white/10" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
          <TopNav />
          <div className="relative z-10 px-4 pb-3">
            <h1 className="text-xl md:text-2xl leading-relaxed" style={{ fontFamily: "'Press Start 2P', cursive" }}>Settings</h1>
            <p className="text-[7px] md:text-[9px] text-slate-300 mt-2 leading-loose uppercase" style={{ fontFamily: "'Press Start 2P', cursive" }}>
              Manage your account, preferences and workspace settings.
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
            </p>
          </div>
        </div>

        {/* CONTENT */}
<<<<<<< HEAD
<<<<<<< HEAD
        <div
          className='flex-1 flex flex-col p-3 md:p-6 overflow-y-auto bg-[#050505]'
          style={{ scrollbarWidth: 'none' }}
        >
          <div className='max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 lg:h-full lg:min-h-0'>
            {/* ── LEFT COLUMN ── */}
            <div className='lg:col-span-2 flex flex-col gap-4 min-h-0'>
              {/* Profile Block */}
              <div className='bg-[#0a0a0a] border-2 border-[#222] flex flex-col flex-1 min-h-0 overflow-hidden shadow-[4px_4px_0px_0px_rgba(255,204,0,0.08)]'>
                {/* Tabs */}
                <div className='flex items-center gap-6 px-6 pt-3 border-b-2 border-[#111] shrink-0'>
                  {['Profile', 'Account', 'Secrets'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 text-[11px] font-bold tracking-widest transition-colors border-b-2 ${
                        activeTab === tab
                          ? 'border-[#FFCC00] text-[#FFCC00]'
                          : 'border-transparent text-[#666] hover:text-[#ccc]'
                      }`}
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
        <div className="flex-1 flex flex-col p-2 md:p-3 overflow-y-auto bg-[#0b0f14]" style={{ scrollbarWidth: 'none' }}>
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 lg:h-full lg:min-h-0">
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7

    const currentTabs = projectId ? projectTabs : globalTabs;

<<<<<<< HEAD
    if (loading) {
        return (
            <div className="flex h-screen bg-[#050505] text-white font-sans items-center justify-center">
                <Loader2 size={32} className="animate-spin text-[#22c55e]" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} navMode={navMode} toggleNavMode={toggleNavMode} />
            <Dock navMode={navMode} toggleNavMode={toggleNavMode} />

            <PageWrapper navMode={navMode} isCollapsed={isCollapsed}>
                <TopNav />

                {/* Page header */}
                <div className="px-8 py-6 border-b border-white/[0.06] shrink-0">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="flex items-center gap-2 mb-1">
                             <h1 className="text-2xl font-bold tracking-tight text-white">
                                {projectId ? "Project Settings" : "Workspace Settings"}
                            </h1>
                            {projectId && (
                                <>
                                    <span className="text-[#3f3f46]">/</span>
                                    <span className="text-[14px] font-bold text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded-md border border-[#22c55e]/20">
                                        {project?.name}
                                    </span>
                                </>
                            )}
                        </div>
                        <p className="text-[13px] text-[#71717a]">
                            {projectId 
                                ? "Manage your project configuration and infrastructure" 
                                : "Manage your personal workspace and account preferences"}
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-hidden max-w-[1200px] mx-auto w-full flex">

                    {/* Tab sidebar */}
                    <div className="w-64 shrink-0 py-6 pr-6 border-r border-white/[0.06] flex flex-col gap-0.5 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                        <p className="text-[10px] font-bold text-[#3f3f46] uppercase tracking-widest mb-2 px-3">Sections</p>
                        {currentTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-lg transition-colors text-left ${activeTab === tab.id
                                        ? "bg-white/[0.08] text-white"
                                        : "text-[#71717a] hover:text-white hover:bg-white/[0.04]"
                                    } ${tab.id === "DANGER" ? "text-[#ef4444] hover:text-[#ef4444] hover:bg-[#ef4444]/[0.06] mt-auto" : ""}`}
                            >
                                <tab.icon size={15} className={tab.id === "DANGER" && activeTab !== "DANGER" ? "text-[#ef4444]" : ""} />
                                {tab.label}
=======
              {/* Profile Block */}
              <div className="bg-[#11151c] border border-white/10 rounded-xl flex flex-col flex-1 min-h-0">
                {/* Tabs */}
                <div className="flex items-center gap-6 px-6 pt-3 border-b border-white/10 shrink-0">
                  {["Profile", "Account", "Secrets"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 text-sm font-medium transition-colors border-b-2 ${activeTab === tab ? "border-[#e8e3d0] text-slate-200" : "border-transparent text-slate-500 hover:text-slate-300"}`}
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                    >
                      {tab}
                    </button>
                  ))}
                </div>

<<<<<<< HEAD
<<<<<<< HEAD
                {activeTab === 'Profile' && (
                  <div className='p-4 lg:p-5 flex flex-col flex-1 min-h-0'>
                    <h3 className='text-sm font-bold text-white mb-1 shrink-0 tracking-widest'>
                      PROFILE
                    </h3>
                    <p className='text-[10px] text-[#666] mb-4 shrink-0'>
                      Public identity preview.
                    </p>

                    <div className='flex flex-col md:flex-row gap-6 items-start'>
                      {/* Avatar Picker Section */}
                      <div
                        className='flex flex-col items-center gap-2 shrink-0 relative'
                        ref={pickerRef}
                      >
                        <span className='text-[10px] text-[#888] w-full text-left'>
                          Avatar
                        </span>
                        <div className='relative'>
                          <img
                            src={selectedAvatar}
                            alt='avatar'
                            className='w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-[#333] bg-[#111] object-cover cursor-pointer'
                            onClick={() =>
                              setIsAvatarPickerOpen(!isAvatarPickerOpen)
                            }
                          />
                          <button
                            className='absolute bottom-0 right-0 w-6 h-6 bg-[#111] border border-[#333] rounded-full flex items-center justify-center hover:bg-[#1a1a1a] transition-colors cursor-pointer'
                            onClick={() =>
                              setIsAvatarPickerOpen(!isAvatarPickerOpen)
                            }
                          >
                            <Pen size={10} className='text-[#FFCC00]' />
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                {activeTab === "Profile" && (
                  <div className="p-4 lg:p-5 flex flex-col flex-1 min-h-0">
                    <h3 className="text-lg font-medium text-slate-200 mb-1 shrink-0">Profile Information</h3>
                    <p className="text-[10px] text-slate-400 mb-4 shrink-0">Update your personal information and how others see you on Velora.</p>

                    <div className="flex flex-col md:flex-row gap-6 items-start flex-1 min-h-0">

                      {/* Avatar Picker Section */}
                      <div className="flex flex-col items-center gap-2 shrink-0 relative" ref={pickerRef}>
                        <span className="text-[10px] text-slate-400 w-full text-left">Avatar</span>
                        <div className="relative">
                          <img
                            src={selectedAvatar}
                            alt="avatar"
                            className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/10 bg-white/5 object-cover cursor-pointer"
                            onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
                          />
                          <button
                            className="absolute bottom-0 right-0 w-6 h-6 bg-[#1a1f26] border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                            onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
                          >
                            <Pen size={10} className="text-slate-300" />
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                          </button>
                        </div>

                        {/* Avatar Dropdown */}
                        {isAvatarPickerOpen && (
<<<<<<< HEAD
<<<<<<< HEAD
                          <div className='absolute top-full mt-2 left-0 w-[140px] bg-[#0a0a0a] border-2 border-[#222] shadow-xl p-2 z-50 flex flex-wrap gap-2'>
=======
                          <div className="absolute top-full mt-2 left-0 w-[140px] bg-[#11151c] border border-white/10 rounded-lg shadow-xl p-2 z-50 flex flex-wrap gap-2">
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
                          <div className="absolute top-full mt-2 left-0 w-[140px] bg-[#11151c] border border-white/10 rounded-lg shadow-xl p-2 z-50 flex flex-wrap gap-2">
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                            {AVATARS.map((avatar, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
<<<<<<< HEAD
<<<<<<< HEAD
                                  setSelectedAvatar(avatar)
                                  setIsAvatarPickerOpen(false)
                                }}
                                className={`w-12 h-12 rounded-full cursor-pointer border-2 transition-all ${
                                  selectedAvatar === avatar
                                    ? 'border-[#00FFCC] scale-105'
                                    : 'border-transparent hover:border-[#555]'
                                }`}
                              >
                                <img
                                  src={avatar}
                                  alt={`Avatar ${idx + 1}`}
                                  className='w-full h-full object-cover rounded-full'
                                />
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                                  setSelectedAvatar(avatar);
                                  setIsAvatarPickerOpen(false);
                                }}
                                className={`w-12 h-12 rounded-full cursor-pointer border-2 transition-all ${selectedAvatar === avatar ? 'border-green-500 scale-105' : 'border-transparent hover:border-slate-500'}`}
                              >
                                <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover rounded-full" />
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

<<<<<<< HEAD
<<<<<<< HEAD
                      <div className='flex-1 w-full border border-[#222] bg-[#050505] p-4 min-w-0'>
                        <p className='text-[9px] text-[#666] uppercase tracking-[0.2em] mb-2'>
                          Name
                        </p>
                        <h4 className='text-lg text-[#FFCC00] tracking-wide font-semibold normal-case'>
                          {profileName}
                        </h4>
                        <p className='text-[9px] text-[#666] uppercase tracking-[0.2em] mt-4 mb-1'>
                          Email
                        </p>
                        <p className='text-[12px] text-[#ddd] normal-case break-all'>
                          {profileEmail}
                        </p>
                        <p className='text-[10px] text-[#777] mt-2 normal-case'>
                          Edit profile name and preferences from the Account tab.
                        </p>
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                      {/* Form */}
                      <div className="flex-1 flex flex-col gap-3 w-full min-h-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 shrink-0">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-300">Full Name</label>
                            <input
                              type="text"
                              defaultValue="Sheryian"
                              className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 outline-none focus:border-white/30 transition-colors"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-slate-300">Username</label>
                            <input
                              type="text"
                              defaultValue="@sheryian"
                              className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 outline-none focus:border-white/30 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 shrink-0">
                          <label className="text-[10px] text-slate-300">Bio</label>
                          <div className="relative">
                            <textarea
                              rows={2}
                              defaultValue="Full-stack developer who loves building and deploying products that make an impact."
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 outline-none focus:border-white/30 transition-colors resize-none"
                            />
                            <span className="absolute bottom-2 right-2 text-[9px] text-slate-500">67/160</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 shrink-0">
                          <label className="text-[10px] text-slate-300">Email Address</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="email"
                              defaultValue="sheryian@example.com"
                              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 outline-none focus:border-white/30 transition-colors"
                            />
                            <button className="px-3 py-1.5 border border-white/10 rounded-lg text-[11px] text-slate-300 hover:bg-white/5 transition-colors shrink-0">
                              Change
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
                            </button>
                        ))}
                        
                        {projectId && (
                            <button
                                onClick={() => navigate("/settings")}
                                className="flex items-center gap-3 px-3 py-2.5 text-[12px] font-bold text-[#71717a] hover:text-white mt-4 border-t border-white/[0.04] pt-6"
                            >
                                <ChevronRight size={14} className="rotate-180" />
                                Back to Workspace
                            </button>
                        )}
                    </div>

                    {/* Tab content */}
                    <div className="flex-1 overflow-y-auto py-6 pl-8" style={{ scrollbarWidth: "none" }}>
                        <div className="max-w-[680px]">
                            {error && <AlertBanner type="error">{error}</AlertBanner>}
                            {successMsg && <AlertBanner type="success">{successMsg}</AlertBanner>}

                            {/* ── PROJECT SETTINGS ── */}
                            {projectId ? (
                                <>
                                    {activeTab === "GENERAL" && (
                                        <motion.div key="general" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
                                            <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden shadow-elevation-1">
                                                <div className="px-6 py-5 border-b border-white/[0.06]">
                                                    <h2 className="text-[14px] font-semibold text-white mb-0.5">Project Name</h2>
                                                    <p className="text-[13px] text-[#71717a]">Used to identify your project on the dashboard.</p>
                                                </div>
                                                <div className="px-6 py-5">
                                                    <InputField 
                                                        value={projectName} 
                                                        onChange={(e) => setProjectName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="px-6 py-3.5 bg-[#0d0d0f] border-t border-white/[0.06] flex justify-end">
                                                    <GlassButton 
                                                        variant="primary" 
                                                        className="h-8 px-4 text-xs"
                                                        onClick={() => handleUpdate({ name: projectName })}
                                                        disabled={saving}
                                                    >
                                                        {saving ? "Saving..." : "Save"}
                                                    </GlassButton>
                                                </div>
                                            </div>

                                            <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden shadow-elevation-1">
                                                <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
                                                    <div>
                                                        <h2 className="text-[14px] font-semibold text-white mb-0.5 flex items-center gap-2">
                                                            <Globe size={14} className="text-[#71717a]" /> Domains
                                                        </h2>
                                                        <p className="text-[13px] text-[#71717a]">Manage custom domains for your project.</p>
                                                    </div>
                                                </div>
                                                <div className="px-6 py-5">
                                                    <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d0f] border border-white/[0.06] rounded-lg">
                                                        <div>
                                                            <span className="text-[13px] font-medium text-white block">
                                                                {project?.name?.toLowerCase().replace(/\s+/g, '-')}.velora.app
                                                            </span>
                                                            <span className="text-[12px] text-[#22c55e] flex items-center gap-1.5 mt-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" /> Valid Configuration
                                                            </span>
                                                        </div>
                                                        <GlassButton variant="outline" className="h-8 px-3 text-xs" disabled>Edit</GlassButton>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === "VARIABLES" && (
                                        <motion.div key="vars" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                                            <EnvTable projectId={projectId} />
                                        </motion.div>
                                    )}

                                    {activeTab === "ADVANCED" && (
                                        <motion.div key="advanced" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
                                            <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden shadow-elevation-1">
                                                <div className="px-6 py-5 border-b border-white/[0.06]">
                                                    <h2 className="text-[14px] font-semibold text-white mb-0.5">Build & Development Settings</h2>
                                                    <p className="text-[13px] text-[#71717a]">Configure how your project is built and developed.</p>
                                                </div>
                                                <div className="px-6 py-5 flex flex-col gap-5">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InputField label="Framework Preset" value="Auto-detect" disabled />
                                                        <InputField 
                                                            label="Build Command" 
                                                            value={installCommand} 
                                                            onChange={(e) => setInstallCommand(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InputField label="Output Directory" defaultValue="dist" disabled />
                                                        <InputField 
                                                            label="Start Command" 
                                                            value={startCommand} 
                                                            onChange={(e) => setStartCommand(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="px-6 py-3.5 bg-[#0d0d0f] border-t border-white/[0.06] flex justify-end">
                                                    <GlassButton 
                                                        variant="primary" 
                                                        className="h-8 px-4 text-xs"
                                                        onClick={() => handleUpdate({ installCommand, startCommand })}
                                                        disabled={saving}
                                                    >
                                                        {saving ? "Saving..." : "Save Settings"}
                                                    </GlassButton>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === "DANGER" && (
                                        <motion.div key="danger" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                                            <div className="bg-[#111113] border border-[#ef4444]/20 rounded-xl overflow-hidden shadow-elevation-1">
                                                <div className="px-6 py-5 border-b border-[#ef4444]/10 bg-[#ef4444]/[0.02] flex items-start gap-3">
                                                    <AlertTriangle size={16} className="text-[#ef4444] mt-0.5 shrink-0" />
                                                    <div>
                                                        <h2 className="text-[14px] font-semibold text-[#ef4444] mb-0.5">Delete Project</h2>
                                                        <p className="text-[13px] text-[#71717a]">
                                                            Permanently remove your project and all its deployments. This action cannot be undone.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="px-6 py-5 flex items-center justify-between">
                                                    <span className="text-[13px] text-white">
                                                        Delete <span className="font-semibold font-mono">{project?.name}</span>
                                                    </span>
                                                    <GlassButton 
                                                        variant="danger" 
                                                        className="h-9 px-4 text-[13px]"
                                                        onClick={handleDelete}
                                                        disabled={saving}
                                                    >
                                                        {saving ? "Deleting..." : "Delete Project"}
                                                    </GlassButton>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </>
                            ) : (
                                /* ── GLOBAL / WORKSPACE SETTINGS ── */
                                <motion.div key="global" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
                                    
                                    {activeTab === "WORKSPACE" && (
                                        <>
                                            <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden shadow-elevation-1">
                                                <div className="px-6 py-5 border-b border-white/[0.06]">
                                                    <h2 className="text-[14px] font-semibold text-white mb-0.5">Workspace Management</h2>
                                                    <p className="text-[13px] text-[#71717a]">Overview of all projects in your architectural workspace.</p>
                                                </div>
                                                <div className="px-2 py-2">
                                                    {allProjects.length === 0 ? (
                                                        <div className="py-10 text-center text-[#71717a] text-[13px]">No projects found.</div>
                                                    ) : (
                                                        allProjects.map((p) => (
                                                            <div 
                                                                key={p._id}
                                                                onClick={() => navigate(`/settings?projectId=${p._id}`)}
                                                                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer group"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                                                                        <Folder size={14} className="text-[#a1a1aa]" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[13px] font-bold text-white group-hover:text-[#22c55e] transition-colors">{p.name}</p>
                                                                        <p className="text-[11px] text-[#52525b] font-mono">{p.repoName}</p>
                                                                    </div>
                                                                </div>
                                                                <ChevronRight size={14} className="text-[#3f3f46] group-hover:translate-x-1 transition-transform" />
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-[#111113] border border-white/[0.06] rounded-xl overflow-hidden shadow-elevation-1">
                                                <div className="px-6 py-5 border-b border-white/[0.06]">
                                                    <h2 className="text-[14px] font-semibold text-white mb-0.5">Platform Usage</h2>
                                                    <p className="text-[13px] text-[#71717a]">Monitor your workspace resource allocation.</p>
                                                </div>
                                                <div className="px-6 py-5">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[12px] text-[#a1a1aa]">Build Minutes</span>
                                                        <span className="text-[12px] font-bold text-white">124 / 500 min</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#22c55e] w-[25%]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {(activeTab === "PROFILE" || activeTab === "SECURITY") && (
                                        <div className="py-10 text-center">
                                            <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                                                <User size={20} className="text-[#3f3f46]" />
                                            </div>
                                            <p className="text-[14px] font-bold text-white mb-1">Redirecting to Account</p>
                                            <p className="text-[13px] text-[#71717a] mb-6">Profile and security settings are managed in your account page.</p>
                                            <GlassButton variant="primary" onClick={() => navigate("/account")}>
                                                Go to Account
                                            </GlassButton>
                                        </div>
                                    )}

                                </motion.div>
                            )}

                        </div>
<<<<<<< HEAD
=======

                        <button className="mt-1 w-fit px-4 py-1.5 bg-[#e8e3d0] hover:bg-[#f0ece0] text-black text-[11px] font-medium rounded-lg transition-colors shrink-0">
                          Save Changes
                        </button>
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                      </div>
                    </div>
                  </div>
                )}
<<<<<<< HEAD
<<<<<<< HEAD
                {activeTab === 'Account' && (
                  <div className='p-4 lg:p-5 overflow-y-auto'>
                    <h3 className='text-sm font-bold text-white mb-1 tracking-widest'>
                      ACCOUNT SETTINGS
                    </h3>
                    <p className='text-[10px] text-[#666] mb-5'>
                      Edit profile name and preferences.
                    </p>
                    {saveMessage && (
                      <p className='mb-3 text-[10px] text-[#00FFCC] normal-case'>
                        {saveMessage}
                      </p>
                    )}
                    {saveError && (
                      <p className='mb-3 text-[10px] text-red-400 normal-case'>
                        {saveError}
                      </p>
                    )}

                    <div className='flex flex-col gap-4'>
                      <div className='border border-[#222] bg-[#050505] p-4'>
                        <label className='text-[10px] text-[#999] block mb-2'>
                          Profile Name
                        </label>
                        <input
                          type='text'
                          value={profileName}
                          onChange={e => setProfileName(e.target.value)}
                          className='w-full bg-[#0a0a0a] border border-[#333] px-3 py-2 text-[12px] text-white outline-none focus:border-[#00FFCC] transition-colors normal-case'
                        />
                        <label className='text-[10px] text-[#999] block mb-2 mt-4'>
                          Email
                        </label>
                        <input
                          type='email'
                          value={profileEmail}
                          onChange={e => setProfileEmail(e.target.value)}
                          className='w-full bg-[#0a0a0a] border border-[#333] px-3 py-2 text-[12px] text-white outline-none focus:border-[#00FFCC] transition-colors normal-case'
                        />
                      </div>

                      <div className='border border-[#222] bg-[#050505] p-4'>
                        <p className='text-[10px] text-[#999] mb-3 uppercase tracking-widest'>
                          Preferences
                        </p>

                        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-2'>
                          <div className='flex items-start gap-2'>
                            <div className='mt-0.5'>
                              <Palette size={14} className='text-[#888]' />
                            </div>
                            <div>
                              <p className='text-xs text-white font-medium'>
                                Theme
                              </p>
                              <p className='text-[9px] text-[#666]'>
                                Choose your preferred theme.
                              </p>
                            </div>
                          </div>
                          <button className='flex items-center justify-between w-24 px-2 py-1 border border-[#333] bg-[#0a0a0a] text-[11px] text-[#ddd] hover:border-[#555] transition-colors'>
                            Dark{' '}
                            <ChevronDown size={12} className='text-[#666]' />
                          </button>
                        </div>

                        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-2 border-t border-[#151515]'>
                          <div className='flex items-start gap-2'>
                            <div className='mt-0.5'>
                              <Globe size={14} className='text-[#888]' />
                            </div>
                            <div>
                              <p className='text-xs text-white font-medium'>
                                Language
                              </p>
                              <p className='text-[9px] text-[#666]'>
                                Select your preferred language.
                              </p>
                            </div>
                          </div>
                          <button className='flex items-center justify-between w-24 px-2 py-1 border border-[#333] bg-[#0a0a0a] text-[11px] text-[#ddd] hover:border-[#555] transition-colors'>
                            English{' '}
                            <ChevronDown size={12} className='text-[#666]' />
                          </button>
                        </div>

                        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-2 border-t border-[#151515]'>
                          <div className='flex items-start gap-2'>
                            <div className='mt-0.5'>
                              <Calendar size={14} className='text-[#888]' />
                            </div>
                            <div>
                              <p className='text-xs text-white font-medium'>
                                Date & Time Format
                              </p>
                              <p className='text-[9px] text-[#666]'>
                                Choose how dates and times are displayed.
                              </p>
                            </div>
                          </div>
                          <button className='flex items-center justify-between w-32 px-2 py-1 border border-[#333] bg-[#0a0a0a] text-[11px] text-[#ddd] hover:border-[#555] transition-colors'>
                            Apr 26, 2026 • 24h{' '}
                            <ChevronDown size={12} className='text-[#666]' />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        className='w-fit px-4 py-2 bg-[#FFCC00] hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-black text-[10px] font-bold tracking-widest transition-colors border border-[#CC9900]'
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                )}
                {activeTab === 'Secrets' && (
                  <div className='flex flex-col flex-1 min-h-[400px]'>
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                {activeTab === "Account" && (
                  <div className="p-4 lg:p-5">
                    <h3 className="text-lg font-medium text-slate-200 mb-1">Account Settings</h3>
                    <p className="text-[10px] text-slate-400 mb-6">Manage your account security and connections.</p>
                    <p className="text-xs text-slate-500 italic">Settings coming soon.</p>
                  </div>
                )}
                {activeTab === "Secrets" && (
                  <div className="flex flex-col flex-1 min-h-[400px]">
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                    <EnvTable />
                  </div>
                )}
              </div>

<<<<<<< HEAD
<<<<<<< HEAD
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className='col-span-1 flex flex-col gap-4 min-h-0'>
              {/* Account Overview */}
              <div className='bg-[#0a0a0a] border-2 border-[#222] p-4 shrink-0'>
                <h3 className='text-sm font-bold text-white mb-4 tracking-widest'>
                  ACCOUNT OVERVIEW
                </h3>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-2'>
                    <img
                      src={selectedAvatar}
                      alt='avatar'
                      className='w-8 h-8 rounded-full border border-[#333] bg-[#111] object-cover'
                    />
                    <div>
                      <p className='text-xs text-white font-medium'>{profileName}</p>
                      <p className='text-[9px] text-[#777]'>Developer</p>
                    </div>
                  </div>
                  <span className='flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-green-500/20 bg-green-500/10 text-green-400 text-[9px] font-medium'>
                    <div className='w-1.5 h-1.5 rounded-full bg-green-400' />{' '}
                    Active
                  </span>
                </div>

                <div className='flex flex-col gap-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1.5 text-[#888]'>
                      <User size={12} />{' '}
                      <span className='text-[10px]'>Member since</span>
                    </div>
                    <span className='text-[10px] text-[#ddd]'>
                      Apr 20, 2026
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1.5 text-[#888]'>
                      <UserCircle size={12} />{' '}
                      <span className='text-[10px]'>User ID</span>
                    </div>
                    <span className='text-[10px] text-[#ddd] font-mono'>
                      usr_8f3a7c2d
                    </span>
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
              {/* Preferences Block */}
              {activeTab === "Profile" && (
                <div className="bg-[#11151c] border border-white/10 rounded-xl p-4 lg:p-5 shrink-0">
                  <h3 className="text-lg font-medium text-slate-200 mb-1">Preferences</h3>
                  <p className="text-[10px] text-slate-400 mb-3">Customize your experience on Velora.</p>

                  <div className="flex flex-col gap-1">
                    {/* Theme */}
                    <div className="flex items-center justify-between py-1.5">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5"><Palette size={14} className="text-slate-400" /></div>
                        <div>
                          <p className="text-xs text-slate-200 font-medium">Theme</p>
                          <p className="text-[9px] text-slate-500">Choose your preferred theme.</p>
                        </div>
                      </div>
                      <button className="flex items-center justify-between w-24 px-2 py-1 border border-white/10 bg-white/5 rounded-lg text-[11px] text-slate-300 hover:border-white/20 transition-colors">
                        Dark <ChevronDown size={12} className="text-slate-500" />
                      </button>
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
                    </div>

                </div>
<<<<<<< HEAD
            </PageWrapper>
        </div>
    );
}
=======
              )}
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="col-span-1 flex flex-col gap-4 min-h-0">

              {/* Account Overview */}
              <div className="bg-[#11151c] border border-white/10 rounded-xl p-4 shrink-0">
                <h3 className="text-sm font-medium text-slate-200 mb-4">Account Overview</h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedAvatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border border-white/10 bg-white/5 object-cover"
                    />
                    <div>
                      <p className="text-xs text-slate-200 font-medium">Sheryian</p>
                      <p className="text-[9px] text-slate-400">Developer</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-green-500/20 bg-green-500/10 text-green-400 text-[9px] font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" /> Active
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <User size={12} /> <span className="text-[10px]">Member since</span>
                    </div>
                    <span className="text-[10px] text-slate-300">Apr 20, 2026</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <UserCircle size={12} /> <span className="text-[10px]">User ID</span>
                    </div>
                    <span className="text-[10px] text-slate-300 font-mono">usr_8f3a7c2d</span>
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                  </div>
                  {/* Removed Role option here as requested */}
                </div>
              </div>

              {/* Workspace */}
<<<<<<< HEAD
<<<<<<< HEAD
              <div className='bg-[#0a0a0a] border-2 border-[#222] p-4 shrink-0'>
                <h3 className='text-sm font-bold text-white mb-4 tracking-widest'>
                  WORKSPACE
                </h3>
                <div className='flex items-start gap-2 mb-4'>
                  <div className='w-8 h-8 border border-[#333] bg-[#050505] flex items-center justify-center shrink-0'>
                    <Building2 size={14} className='text-[#888]' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-0.5'>
                      <p className='text-xs text-white font-medium truncate'>
                        Default Workspace
                      </p>
                      <span className='px-1 py-0.5 rounded border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-[8px] shrink-0'>
                        Owner
                      </span>
                    </div>
                    <p className='text-[9px] text-[#777]'>
                      This is your primary workspace.
                    </p>
                  </div>
                </div>
                <button className='w-full flex items-center justify-between px-2.5 py-1.5 border border-[#333] text-xs text-[#ddd] hover:bg-[#111] transition-colors'>
                  Manage <ChevronRight size={12} className='text-[#666]' />
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
              <div className="bg-[#11151c] border border-white/10 rounded-xl p-4 shrink-0">
                <h3 className="text-sm font-medium text-slate-200 mb-4">Workspace</h3>
                <div className="flex items-start gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                    <Building2 size={14} className="text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs text-slate-200 font-medium truncate">Default Workspace</p>
                      <span className="px-1 py-0.5 rounded border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-[8px] shrink-0">Owner</span>
                    </div>
                    <p className="text-[9px] text-slate-400">This is your primary workspace.</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-between px-2.5 py-1.5 border border-white/10 rounded-lg text-xs text-slate-300 hover:bg-white/5 transition-colors">
                  Manage <ChevronRight size={12} className="text-slate-500" />
                </button>
              </div>

              {/* Danger Zone */}
              <div className="bg-[#11151c] border border-white/10 rounded-xl p-4 flex-1 flex flex-col min-h-0">
                <h3 className="text-sm font-medium text-red-400 mb-1 shrink-0">Danger Zone</h3>
                <p className="text-[9px] text-slate-500 mb-auto shrink-0">Irreversible and permanent actions.</p>
                <button className="w-full flex items-center justify-between px-2.5 py-1.5 border border-red-500/30 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors shrink-0 mt-4">
                  <span className="flex items-center gap-1.5"><Trash2 size={12} /> Delete Account</span>
                  <ChevronRight size={12} className="text-red-500/50" />
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
                </button>
              </div>

            </div>
<<<<<<< HEAD
<<<<<<< HEAD
          </div>
        </div>
      </div>
    </div>
  )
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4

          </div>
       </div>
     </div>
   </div>
  );
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
}
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
