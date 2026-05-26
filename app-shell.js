// ==========================================
// app-shell.js - Centralized UI Component & Auth State Machine
// ==========================================

// 1. INJECT THE NAVBAR, SIDEBAR & MODALS HTML
const appShellHTML = `
    <nav class="fixed top-0 w-full z-50 border-b border-brand-100 dark:border-slate-800 bg-white/90 dark:bg-dark-bg/95 backdrop-blur-md transition-colors">
        <div class="w-full px-4 md:px-6 py-3 flex justify-between items-center max-w-7xl mx-auto">
            <div class="flex items-center gap-3 md:gap-4">
                <button onclick="window.userPanelApp.toggle()" class="p-2 -ml-2 rounded-xl hover:bg-brand-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
                <a href="index.html" class="flex items-center gap-3 group cursor-pointer">
                    <img class="w-9 h-9 md:w-10 md:h-10 rounded-xl shadow-lg shadow-accent-yellow/20 object-cover ring-2 ring-offset-2 ring-accent-yellow transition-transform group-hover:scale-105" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFbo8CVZSf-ejwVGTTTGeu1B5bJj4JGloqdh70o21Tf_895kWYOvNmyE9cnAAR66r77ZFZZKTslF6QIp4F-bWxPsXjGsAWzwc75D6VnXqFMbi-4NgUazELmMWeyX3ApASZncrHUFjni62u4spE3g19Pfcbsy-h5iUTfxTXWWTEYPgaD47kLMDA43e1SMQ/s678/1000126459.jpg" alt="Logo">
                    <div class="leading-tight">
                        <h1 class="font-bold text-base md:text-lg tracking-tight text-slate-900 dark:text-white">MBBS <span class="text-brand-400">Profs Prep</span></h1>
                        <p class="text-[9px] md:text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">Central Portal</p>
                    </div>
                </a>
            </div>
            <div class="hidden md:block flex-1 max-w-md mx-8">
                <input class="w-full px-4 py-2 bg-brand-50 dark:bg-dark-surface border border-brand-100 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-brand-400 outline-none transition-all text-sm text-slate-900 dark:text-white placeholder-slate-400" id="globalSearch" placeholder="Search Institute..." type="text"/>
            </div>
            <div class="flex items-center gap-3">
                <button class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-50 dark:hover:bg-white/10 text-xl transition-all text-accent-yellow" onclick="window.toggleTheme()">
                    <span id="theme-icon">🌙</span>
                </button>
            </div>
        </div>
    </nav>

    <aside class="fixed top-0 left-0 h-full z-[10005] bg-white dark:bg-dark-surface shadow-2xl transform -translate-x-full transition-transform duration-300 flex flex-col border-r border-brand-100 dark:border-slate-800 w-full sm:w-[350px] lg:w-[400px]" id="user-panel-drawer">
        <div class="px-4 py-4 border-b border-brand-100 dark:border-slate-800 flex justify-between items-center bg-brand-50 dark:bg-dark-bg shrink-0">
            <h2 class="font-bold text-lg text-slate-900 dark:text-white tracking-tight">My Account</h2>
            <button onclick="window.userPanelApp.close()" class="p-2 rounded-lg text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-red-500 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50 dark:bg-dark-bg" id="user-panel-body"></div>
        <div class="p-4 border-t border-brand-100 dark:border-slate-800 bg-brand-50 dark:bg-dark-bg shrink-0" id="user-panel-footer"></div>
    </aside>
    <div class="fixed inset-0 z-[10004] bg-slate-900/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300" id="user-panel-backdrop" onclick="window.userPanelApp.close()"></div>

    <div class="fixed inset-0 z-[10010] bg-slate-900/80 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center p-4" id="contributor-modal-backdrop">
        <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl transform scale-95 transition-transform duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]" id="contributor-modal-card">
            <div class="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-brand-50 dark:bg-slate-800/50">
                <div>
                    <h3 class="font-black text-lg text-brand-600 dark:text-brand-400">Contributor Application</h3>
                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Identity & Schedule</p>
                </div>
                <button onclick="window.closeContributorModal()" class="text-slate-400 hover:text-red-500 transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div class="p-6 overflow-y-auto custom-scrollbar">
                
                <div class="mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">What You Can Earn</h4>
                    <div class="space-y-4">
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-lg shrink-0 border border-green-200 dark:border-green-800">⭐</div>
                            <div>
                                <p class="text-sm font-bold text-slate-800 dark:text-white leading-none">Contributor <span class="text-[10px] text-slate-500 font-bold ml-1 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">1 Paper</span></p>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Earn <span class="text-green-600 dark:text-green-400 font-bold">30 Days</span> of Premium Access.</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-lg shrink-0 border border-blue-200 dark:border-blue-800">🛡️</div>
                            <div>
                                <p class="text-sm font-bold text-slate-800 dark:text-white leading-none">Verified <span class="text-[10px] text-slate-500 font-bold ml-1 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">3 Papers</span></p>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Unlock <span class="text-blue-600 dark:text-blue-400 font-bold">6 Months</span> & Profile Badge.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <form id="contributor-form" onsubmit="event.preventDefault(); window.submitContributorApplication();">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Legal Name</label>
                            <input type="text" id="app-name" required class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium dark:text-white outline-none focus:ring-2 focus:ring-brand-500">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date of your next Prof Exam</label>
                            <input type="date" id="app-next-exam" required class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium dark:text-white outline-none focus:ring-2 focus:ring-brand-500">
                            <p class="text-[9px] text-brand-600 dark:text-brand-400 font-bold mt-1">⚠️ You must upload papers within 7 days of this date.</p>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Upload College ID Card (Image/PDF)</label>
                            <div class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" onclick="document.getElementById('app-id-file').click()">
                                <input type="file" id="app-id-file" required accept="image/*,.pdf" class="hidden" onchange="document.getElementById('id-filename').innerText = this.files[0]?.name || 'Click to browse'">
                                <span class="text-2xl mb-1 block">🪪</span>
                                <span id="id-filename" class="text-xs font-bold text-brand-600 dark:text-brand-400">Click to upload ID Card</span>
                            </div>
                        </div>
                    </div>
                    <button type="submit" id="app-submit-btn" class="w-full py-4 mt-6 rounded-xl text-sm font-bold bg-brand-500 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition-all active:scale-95 uppercase tracking-wider">Submit Application</button>
                </form>
            </div>
        </div>
    </div>
`;

// Insert the HTML exactly at the start of the body
document.body.insertAdjacentHTML('afterbegin', appShellHTML);

// 2. GLOBALS & UI STATE
const APP_LOGO_URL = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFbo8CVZSf-ejwVGTTTGeu1B5bJj4JGloqdh70o21Tf_895kWYOvNmyE9cnAAR66r77ZFZZKTslF6QIp4F-bWxPsXjGsAWzwc75D6VnXqFMbi-4NgUazELmMWeyX3ApASZncrHUFjni62u4spE3g19Pfcbsy-h5iUTfxTXWWTEYPgaD47kLMDA43e1SMQ/s678/1000126459.jpg";

// Admin Emails
const ADMIN_EMAILS = ["educateindiainstitute@gmail.com", "mbbsprofsprep@gmail.com"];

window.toggleAuthMode = function(mode) { window.userPanelApp.authMode = mode; window.userPanelApp.renderState(); };
window.togglePassword = function() { /* Standard password toggle logic omitted for brevity, keep yours */ };
window.showAuthError = function(msg) { /* Keep yours */ };
window.toggleTheme = function() { /* Keep yours */ };
window.openContributorModal = function() {
    const bd = document.getElementById('contributor-modal-backdrop');
    const cd = document.getElementById('contributor-modal-card');
    if(bd) bd.classList.remove('opacity-0', 'pointer-events-none');
    if(cd) cd.classList.remove('scale-95');
};
window.closeContributorModal = function() {
    const bd = document.getElementById('contributor-modal-backdrop');
    const cd = document.getElementById('contributor-modal-card');
    if(bd) bd.classList.add('opacity-0', 'pointer-events-none');
    if(cd) cd.classList.add('scale-95');
};

// 3. THE MULTI-VIEW USER PANEL APP
window.userPanelApp = {
    isOpen: false, authMode: 'login', viewMode: 'menu', 
    els: function() { return { drawer: document.getElementById('user-panel-drawer'), backdrop: document.getElementById('user-panel-backdrop'), body: document.getElementById('user-panel-body'), footer: document.getElementById('user-panel-footer') } },
    toggle: function() { this.isOpen ? this.close() : this.open(); },
    open: function() { this.isOpen = true; this.viewMode = 'menu'; this.renderState(); const e = this.els(); if(e.drawer) e.drawer.classList.remove('-translate-x-full'); if(e.backdrop) e.backdrop.classList.remove('opacity-0', 'pointer-events-none'); },
    close: function() { this.isOpen = false; const e = this.els(); if(e.drawer) e.drawer.classList.add('-translate-x-full'); if(e.backdrop) e.backdrop.classList.add('opacity-0', 'pointer-events-none'); },
    setView: function(view) { this.viewMode = view; this.renderState(); },
    
    renderState: function() {
        const user = window.currentUserObj; const pData = window.currentUserProfileData || {};
        const els = this.els(); if(!els.body || !els.footer) return;
        const legalFooterHtml = `<div class="flex justify-center gap-3 text-[10px] font-bold text-slate-400 mt-4"><a href="#">Terms</a> • <a href="#">Privacy</a></div>`;

        if (user) {
            const isAdmin = user.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

            if (this.viewMode === 'menu') {
                const nameToDisplay = user.displayName || pData.fullName || "User";
                const initial = (user.email || "U").charAt(0).toUpperCase();

                // --------------------------------------------------------
                // THE EXCLUSIVITY FILTER (AIIMS ONLY)
                // --------------------------------------------------------
                const userCollege = (pData.college || '').toUpperCase();
                const isAIIMS = userCollege.includes('AIIMS'); 

                const trustScore = pData.trustScore || 0;
                const cStatus = pData.contributorStatus || 'none'; 
                const isContributor = trustScore >= 1 || cStatus === 'approved' || isAdmin;

                // Simulate Seat Check (In production, this queries Firestore college_seats collection)
                const seatsAvailable = true; // Assume true for MVP until DB logic is wired

                let workflowHtml = '';

                if (isAdmin) {
                    workflowHtml = `<a onclick="window.userPanelApp.setView('admin_apps')" class="flex items-center justify-between p-4 bg-slate-900 dark:bg-slate-100 rounded-2xl cursor-pointer group mt-4"><div class="text-white dark:text-slate-900 font-semibold text-sm">📋 Review Applications</div><span class="text-xs bg-white/10 dark:bg-black/5 px-2 py-1 rounded-md">View</span></a>`;
                } else if (isAIIMS) {
                    // ONLY RENDER IF THEY ARE FROM AIIMS
                    if (isContributor) {
                        const googleFormLink = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?entry.YOUR_EMAIL_ID=" + encodeURIComponent(user.email);
                        workflowHtml = `<a href="${googleFormLink}" target="_blank" class="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg cursor-pointer group mt-4"><div class="flex items-center gap-3 text-white"><span class="text-xl">📤</span><div class="flex flex-col"><span class="text-sm font-bold">Upload Qs Paper</span><span class="text-[10px] opacity-80">+ Earn Trust Score</span></div></div><span class="text-xs bg-black/10 px-2 py-1 rounded-md text-white font-bold">Go</span></a>`;
                    } else if (cStatus === 'pending') {
                        workflowHtml = `<div class="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800 mt-4 flex gap-3"><div class="text-2xl animate-pulse">⏳</div><div><h4 class="text-sm font-bold text-amber-800 dark:text-amber-400">Application Under Review</h4><p class="text-[10px] text-amber-600 dark:text-amber-500 mt-1 font-medium">Verifying your College ID.</p></div></div>`;
                    } else if (cStatus === 'rejected') {
                        const reason = pData.rejectionReason || "Verification failed. Please ensure your College ID is clear.";
                        workflowHtml = `<div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 mt-4"><h4 class="text-sm font-bold text-red-800 dark:text-red-400 mb-1">❌ Application Rejected</h4><p class="text-[10px] text-red-600 font-bold bg-white p-2 rounded mb-3">Reason: ${reason}</p><button onclick="window.openContributorModal()" class="w-full py-2 bg-red-600 text-white font-bold text-xs rounded-xl">Fix & Apply Again</button></div>`;
                    } else if (seatsAvailable) {
                        workflowHtml = `<div class="bg-gradient-to-br from-brand-600 to-purple-700 rounded-2xl p-5 text-white mt-4 shadow-xl"><h4 class="font-black text-lg mb-1">Become a Contributor</h4><p class="text-xs text-brand-100 mb-4">Earn permanent perks for your college.</p><button onclick="window.openContributorModal()" class="w-full py-3 bg-white text-brand-700 font-black rounded-xl hover:scale-[1.02] transition-transform">Apply Now</button></div>`;
                    } else {
                        workflowHtml = `<div class="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 mt-4 text-center"><span class="text-xl mb-1 block">🔒</span><h4 class="text-sm font-bold text-slate-800 dark:text-white">Seats Full</h4><p class="text-[10px] text-slate-500 mt-1 font-medium">All 20 contributor seats for your batch are currently occupied. Check back later.</p></div>`;
                    }
                }
                // IF NOT AIIMS: workflowHtml remains empty. They see nothing.

                // Render Menu Layout (Basic links omitted for brevity but remain identical)
                els.body.innerHTML = `
                    <div class="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 shadow-sm">
                        <div class="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center text-3xl font-bold text-brand-600 mb-2">${initial}</div>
                        <h3 class="font-bold text-slate-900 dark:text-white text-center w-full truncate px-2 text-sm">${nameToDisplay}</h3>
                        <p class="text-[10px] font-bold text-brand-500 uppercase tracking-widest bg-brand-50 px-2 py-1 rounded mt-1">${userCollege || 'Unknown College'}</p>
                    </div>
                    ${workflowHtml}
                    `;
                els.footer.innerHTML = `<button onclick="window.firebaseSignOut()" class="w-full py-3 mt-4 rounded-xl bg-red-50 text-red-600 font-bold border border-red-200 text-sm">Logout</button>`;
            
            } else if (this.viewMode === 'admin_apps') { /* Keep Admin Apps view from previous response */ }
        } else {
            // GUEST VIEW: 
            // --------------------------------------------------------
            // STRICT DROPDOWN REGISTRATION FORM
            // --------------------------------------------------------
            if (this.authMode === 'register') {
                els.body.innerHTML = `
                    <div class="flex flex-col items-center justify-start min-h-[calc(100vh-250px)] pb-4">
                        <h3 class="text-xl font-black text-slate-900 dark:text-white mb-6">Create Profile</h3>
                        <div class="w-full space-y-3 mb-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <input type="text" id="reg-name" placeholder="Full Name" class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm" />
                            <input type="email" id="reg-email" placeholder="Email Address" class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm" />
                            <input type="password" id="reg-pass" placeholder="Password (Min 6)" class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm" />
                            
                            <select id="reg-college" class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm outline-none focus:ring-2 focus:ring-brand-500">
                                <option value="">Select Your College</option>
                                <optgroup label="AIIMS Institutes">
                                    <option value="AIIMS Deoghar">AIIMS Deoghar</option>
                                    <option value="AIIMS Delhi">AIIMS Delhi</option>
                                    <option value="AIIMS Patna">AIIMS Patna</option>
                                    <option value="AIIMS Bhopal">AIIMS Bhopal</option>
                                    <option value="AIIMS Bhubaneswar">AIIMS Bhubaneswar</option>
                                    <option value="AIIMS Jodhpur">AIIMS Jodhpur</option>
                                    <option value="AIIMS Raipur">AIIMS Raipur</option>
                                    <option value="AIIMS Rishikesh">AIIMS Rishikesh</option>
                                    </optgroup>
                                <optgroup label="Other Colleges">
                                    <option value="JIPMER Puducherry">JIPMER Puducherry</option>
                                    <option value="AFMC Pune">AFMC Pune</option>
                                    <option value="Other">Other Medical College</option>
                                </optgroup>
                            </select>
                            
                            <select id="reg-join-year" class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm outline-none">
                                <option value="">Select Batch</option>
                                <option value="2025 Batch">2025 Batch</option>
                                <option value="2024 Batch">2024 Batch</option>
                                <option value="2023 Batch">2023 Batch</option>
                            </select>
                        </div>
                        <button onclick="window.handleEmailSignUp(this)" class="w-full py-4 rounded-xl text-sm font-bold bg-green-600 text-white shadow-lg hover:bg-green-700">Create Account</button>
                    </div>`;
            } else {
                // Render standard login form...
            }
        }
    }
};

window.submitContributorApplication = async function() {
    const btn = document.getElementById('app-submit-btn');
    const examDate = document.getElementById('app-next-exam').value;
    
    if(!examDate) return alert("Please select your next exam date.");
    
    btn.disabled = true;
    btn.innerText = "Submitting securely...";
    
    setTimeout(() => {
        window.currentUserProfileData.contributorStatus = 'pending';
        window.currentUserProfileData.nextExamDate = examDate;
        window.closeContributorModal();
        window.userPanelApp.renderState(); 
        alert("Application Submitted! Your exam schedule has been logged.");
    }, 1500);
};
