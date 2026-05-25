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
                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Milestones & Identity Verification</p>
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
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Earn <span class="text-green-600 dark:text-green-400 font-bold">30 Days</span> of Premium Access per approved paper.</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-lg shrink-0 border border-blue-200 dark:border-blue-800">🛡️</div>
                            <div>
                                <p class="text-sm font-bold text-slate-800 dark:text-white leading-none">Verified <span class="text-[10px] text-slate-500 font-bold ml-1 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">3 Papers</span></p>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Unlock <span class="text-blue-600 dark:text-blue-400 font-bold">6 Months</span> of Premium & a Verified Profile Badge.</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-lg shrink-0 border border-purple-200 dark:border-purple-800">👑</div>
                            <div>
                                <p class="text-sm font-bold text-slate-800 dark:text-white leading-none">Campus Lead <span class="text-[10px] text-slate-500 font-bold ml-1 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">10 Papers</span></p>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Unlock <span class="text-purple-600 dark:text-purple-400 font-bold">Permanent VIP Access</span> & Leadership Status.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p class="text-xs text-slate-600 dark:text-slate-400 mb-5 font-medium leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">To unlock the upload portal and start earning perks, securely verify your student identity below. Approval takes 12-24 hours.</p>
                
                <form id="contributor-form" onsubmit="event.preventDefault(); window.submitContributorApplication();">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Legal Name</label>
                            <input type="text" id="app-name" required class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium dark:text-white outline-none focus:ring-2 focus:ring-brand-500">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medical College</label>
                            <input type="text" id="app-college" required placeholder="e.g., AIIMS Deoghar" class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium dark:text-white outline-none focus:ring-2 focus:ring-brand-500">
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

// Insert the HTML directly into the page exactly at the start of the <body>
document.body.insertAdjacentHTML('afterbegin', appShellHTML);


// 2. GLOBALS & UI STATE
const APP_LOGO_URL = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFbo8CVZSf-ejwVGTTTGeu1B5bJj4JGloqdh70o21Tf_895kWYOvNmyE9cnAAR66r77ZFZZKTslF6QIp4F-bWxPsXjGsAWzwc75D6VnXqFMbi-4NgUazELmMWeyX3ApASZncrHUFjni62u4spE3g19Pfcbsy-h5iUTfxTXWWTEYPgaD47kLMDA43e1SMQ/s678/1000126459.jpg";

window.toggleAuthMode = function(mode) { window.userPanelApp.authMode = mode; window.userPanelApp.renderState(); };

window.togglePassword = function() {
    const input = document.getElementById('login-pass') || document.getElementById('reg-pass');
    const icon = document.getElementById('eye-icon');
    if (!input) return;
    if (input.type === "password") {
        input.type = "text";
        if(icon) icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.059 10.059 0 011.591-2.714M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1.5 1.5l22.5 22.5" />`;
    } else {
        input.type = "password";
        if(icon) icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
    }
};

window.showAuthError = function(msg) {
    const errDiv = document.getElementById('auth-error-msg');
    if(errDiv) { errDiv.innerText = msg; errDiv.classList.remove('hidden'); setTimeout(() => errDiv.classList.add('hidden'), 5000); } 
    else { alert(msg); }
};

window.toggleTheme = function() {
    const d = document.documentElement.classList.toggle('dark'); 
    localStorage.setItem('theme', d?'dark':'light');
    const icon = document.getElementById('theme-icon'); 
    if(icon) icon.innerText = d?'☀️':'🌙'; 
    if(window.update3D) window.update3D();
};

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
    
    els: function() { 
        return { drawer: document.getElementById('user-panel-drawer'), backdrop: document.getElementById('user-panel-backdrop'), body: document.getElementById('user-panel-body'), footer: document.getElementById('user-panel-footer') }
    },
    
    toggle: function() { this.isOpen ? this.close() : this.open(); },
    
    open: function() { 
        this.isOpen = true; this.viewMode = 'menu'; this.renderState(); 
        const e = this.els();
        if(e.drawer) e.drawer.classList.remove('-translate-x-full'); 
        if(e.backdrop) e.backdrop.classList.remove('opacity-0', 'pointer-events-none'); 
    },
    
    close: function() { 
        this.isOpen = false; 
        const e = this.els();
        if(e.drawer) e.drawer.classList.add('-translate-x-full'); 
        if(e.backdrop) e.backdrop.classList.add('opacity-0', 'pointer-events-none'); 
    },
    
    setView: function(view) { this.viewMode = view; this.renderState(); },
    
    renderState: function() {
        const user = window.currentUserObj; const pData = window.currentUserProfileData || {};
        const els = this.els(); if(!els.body || !els.footer) return;
        
        const legalFooterHtml = `
    <div class="flex flex-wrap justify-center gap-x-3 gap-y-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide w-full px-2 mb-2 mt-4">
        <a href="legal.html?page=about" class="hover:text-brand-500 transition-colors">About Us</a> • 
        <a href="legal.html?page=contact" class="hover:text-brand-500 transition-colors">Contact</a> • 
        <a href="legal.html?page=terms" class="hover:text-brand-500 transition-colors">Terms</a> • 
        <a href="legal.html?page=privacy" class="hover:text-brand-500 transition-colors">Privacy</a> • 
        <a href="legal.html?page=refunds" class="hover:text-brand-500 transition-colors">Refunds</a>
    </div>`;

        if (user) {
            if (this.viewMode === 'menu') {
                let badgeHtml = ''; let daysHtml = '';
                if (window.globalUserStatus.isVIP) {
                    badgeHtml = `<span class="px-3 py-1 mt-3 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-[10px] font-extrabold rounded-full uppercase tracking-wider border border-brand-200 dark:border-brand-800">PRO / VIP ACCESS</span>`;
                    const fd = window.globalUserStatus.validUntil === 'Lifetime Access' ? 'Lifetime Access' : new Date(window.globalUserStatus.validUntil).toLocaleDateString('en-US');
                    daysHtml = `<div class="w-full mt-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex flex-col items-center"><span class="text-2xl font-black text-green-600 dark:text-green-400">${window.globalUserStatus.daysLeft === 999 ? '∞' : window.globalUserStatus.daysLeft}</span><span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Days Left</span><span class="text-[10px] font-medium text-slate-400 mt-1">Valid until ${fd}</span></div>`;
                } else if (window.globalUserStatus.expired) {
                    const daysAgo = Math.abs(window.globalUserStatus.daysLeft);
                    badgeHtml = `<span class="px-3 py-1 mt-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-extrabold rounded-full uppercase tracking-wider border border-red-200 dark:border-red-800">EXPIRED</span>`;
                    daysHtml = `<div class="w-full mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex flex-col items-center text-center"><span class="text-xs font-bold text-red-600 dark:text-red-400">Oops! Your subscription ended ${daysAgo} days ago.</span><a href="checkout.html" class="mt-2 text-xs font-bold bg-red-600 text-white px-3 py-1.5 rounded-lg shadow-sm">Renew Now</a></div>`;
                } else {
                    badgeHtml = `<span class="px-3 py-1 mt-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-extrabold rounded-full uppercase tracking-wider border border-slate-300 dark:border-slate-700">FREE PLAN</span>`;
                    daysHtml = `<div class="w-full mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex flex-col items-center text-center"><span class="text-xs font-bold text-blue-600 dark:text-blue-400">Membership Required</span><a href="checkout.html" class="mt-2 text-xs font-bold bg-brand-500 text-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-brand-600">Unlock QBank</a></div>`;
                }

                const nameToDisplay = user.displayName || pData.fullName || "User";
                const initial = user.email.charAt(0).toUpperCase();

                // --------------------------------------------------------
                // CONTRIBUTOR LOGIC INJECTED HERE
                // --------------------------------------------------------
                const trustScore = pData.trustScore || 0;
                const cStatus = pData.contributorStatus || 'none'; // 'none', 'pending', 'approved'
                const isContributor = trustScore >= 1 || cStatus === 'approved' || window.accessLevel === 'admin';

                let workflowHtml = '';

                if (isContributor) {
                    workflowHtml = `
                    <a href="upload.html" class="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl border-none shadow-lg hover:shadow-green-500/30 cursor-pointer transition-all group mt-4">
                        <div class="flex items-center gap-4 text-white font-semibold text-sm">
                            <span class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform shadow-inner">📤</span> 
                            <div class="flex flex-col">
                                <span class="font-bold leading-tight">Upload Qs Paper</span>
                                <span class="text-[10px] font-bold opacity-80 mt-0.5">+ Earn Trust Score</span>
                            </div>
                        </div>
                        <span class="text-white/70 text-xs font-bold bg-black/10 px-2 py-1 rounded-md">Go</span>
                    </a>`;
                } else if (cStatus === 'pending') {
                    workflowHtml = `
                    <div class="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800 mt-4 flex gap-3">
                        <div class="text-2xl animate-pulse">⏳</div>
                        <div>
                            <h4 class="text-sm font-bold text-amber-800 dark:text-amber-400">Application Under Review</h4>
                            <p class="text-[10px] text-amber-600 dark:text-amber-500 mt-1 font-medium leading-relaxed">Our admin team is verifying your College ID. You will unlock the upload portal once approved.</p>
                        </div>
                    </div>`;
                } else {
                    workflowHtml = `
                    <div class="bg-gradient-to-br from-brand-600 to-purple-700 rounded-2xl p-5 text-white mt-4 shadow-xl relative overflow-hidden">
                        <div class="relative z-10">
                            <h4 class="font-black text-lg mb-1 shadow-sm">Become a Contributor</h4>
                            <p class="text-xs text-brand-100 font-medium mb-4 leading-relaxed">Help the community grow and earn permanent platform perks.</p>
                            <ul class="text-xs space-y-2 mb-5 font-bold">
                                <li class="flex items-center gap-2"><span class="bg-white/20 p-1 rounded-md text-[10px]">✨</span> Free Premium Access</li>
                                <li class="flex items-center gap-2"><span class="bg-white/20 p-1 rounded-md text-[10px]">🛡️</span> Verified Profile Badge</li>
                            </ul>
                            <button onclick="window.openContributorModal()" class="w-full py-3 bg-white text-brand-700 font-black rounded-xl hover:scale-[1.02] transition-transform shadow-lg">View Perks & Apply</button>
                        </div>
                        <div class="absolute -right-6 -bottom-6 text-8xl opacity-10 blur-sm">🎁</div>
                    </div>`;
                }

                // Append the original profile UI with the new workflow logic
                els.body.innerHTML = `
                    <div class="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="w-20 h-20 rounded-full bg-brand-50 dark:bg-slate-800 flex items-center justify-center text-3xl font-bold text-brand-600 dark:text-brand-400 mb-3 shadow-md border border-brand-100 dark:border-slate-700">${initial}</div>
                        <h3 class="font-bold text-slate-900 dark:text-white text-center w-full truncate px-2 text-sm">${nameToDisplay}</h3>
                        <p class="text-xs text-slate-500 truncate w-full text-center mt-1">${user.email}</p>
                        ${badgeHtml}
                        ${daysHtml}
                    </div>
                    
                    ${workflowHtml}

                    <div class="flex flex-col gap-3 mt-4">
                        <a onclick="window.userPanelApp.setView('edit_profile')" class="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 cursor-pointer transition-all shadow-sm hover:shadow group"><div class="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-semibold text-sm"><span class="w-10 h-10 rounded-xl bg-brand-50 dark:bg-slate-800 flex items-center justify-center text-brand-500 text-xl group-hover:scale-110 transition-transform">👤</span> My Profile</div><span class="text-slate-400 text-xs">❯</span></a>
                        <a onclick="window.userPanelApp.setView('bookmarks')" class="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-accent-yellow/50 cursor-pointer transition-all shadow-sm hover:shadow group"><div class="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-semibold text-sm"><span class="w-10 h-10 rounded-xl bg-accent-yellow/10 dark:bg-slate-800 flex items-center justify-center text-accent-yellow text-xl group-hover:scale-110 transition-transform">🔖</span> Bookmarks & Saved</div><span class="text-slate-400 text-xs">❯</span></a>
                        <a href="checkout.html" class="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 cursor-pointer transition-all shadow-sm hover:shadow group"><div class="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-semibold text-sm"><span class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-slate-800 flex items-center justify-center text-purple-500 text-xl group-hover:scale-110 transition-transform">💳</span> Subscription & Billing</div><span class="text-slate-400 text-xs">❯</span></a>
                    </div>`;
                
                els.footer.innerHTML = `${legalFooterHtml}<button onclick="window.firebaseSignOut()" class="w-full py-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2 mt-2 border border-red-200 dark:border-red-800 shadow-sm"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg> Logout</button>`;

            } else if (this.viewMode === 'bookmarks') {
                const bookmarks = Object.values(window.userBookmarks || {}).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                let bookmarksHtml = '';
                
                if (bookmarks.length === 0) {
                    bookmarksHtml = `<div class="flex flex-col items-center justify-center py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mt-4"><span class="text-5xl mb-4 opacity-70">🔖</span><h4 class="font-bold text-lg text-slate-700 dark:text-slate-300">No Saved Questions Yet</h4><p class="text-sm text-slate-500 mt-2 px-4 leading-relaxed">Questions you bookmark inside the QBank will automatically sync here.</p><button onclick="window.userPanelApp.setView('menu')" class="mt-6 px-6 py-2.5 bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400 rounded-lg font-bold text-sm hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors border border-brand-200 dark:border-brand-800">Go Back</button></div>`;
                } else {
                    bookmarksHtml = `<div class="space-y-5 mt-4 pb-10">`;
                    bookmarks.forEach((bm) => {
                        let formattedText = (bm.text || 'Saved Question').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        let optionsHtml = '';
                        if (bm.type === 'MCQ' && bm.options) {
                            optionsHtml = `<div class="mt-4 space-y-2.5">`;
                            bm.options.forEach((opt, idx) => {
                                const letter = String.fromCharCode(65 + idx); const isCorrect = bm.ans_key === letter;
                                let btnClass = "w-full text-left p-3.5 rounded-xl border transition-colors flex items-start gap-3 shadow-sm";
                                if (isCorrect) btnClass += " bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800 text-green-800 dark:text-green-300 font-bold";
                                else btnClass += " bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400";
                                let formattedOpt = opt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                                const letterBadgeClass = isCorrect ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100 border-green-300 dark:border-green-700" : "bg-white dark:bg-slate-700 text-slate-500 border-slate-200 dark:border-slate-600";
                                const letterBadge = `<span class="flex-shrink-0 w-7 h-7 rounded-lg ${letterBadgeClass} text-xs font-bold flex items-center justify-center border">${letter}</span>`;
                                optionsHtml += `<div class="${btnClass}">${letterBadge}<span class="pt-0.5 text-sm font-medium leading-snug">${formattedOpt}</span></div>`;
                            });
                            optionsHtml += `</div>`;
                        }

                        bookmarksHtml += `
                            <div class="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 relative group transition-all shadow-sm hover:shadow-md">
                                <div class="flex justify-between items-start mb-4">
                                    <div class="text-[10px] text-brand-600 dark:text-brand-400 font-extrabold uppercase tracking-widest bg-brand-50 dark:bg-brand-900/30 px-2.5 py-1 rounded-md border border-brand-200 dark:border-brand-800">${bm.subject || 'QBank'}</div>
                                    <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">${new Date(bm.timestamp).toLocaleDateString()}</span>
                                </div>
                                <div class="text-base font-bold text-slate-900 dark:text-white mb-2 leading-relaxed">${formattedText}</div>
                                ${optionsHtml}
                                <div class="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-2">
                                    <button onclick="window.deleteBookmark('${bm.q}')" class="text-[10px] font-bold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1.5 uppercase tracking-wide">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Remove
                                    </button>
                                    <a href="${bm.url || '#'}" class="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 px-4 py-2.5 rounded-xl transition-colors border border-brand-200 dark:border-brand-800 flex items-center gap-1.5 shadow-sm">
                                        Review <span class="text-lg leading-none">➝</span>
                                    </a>
                                </div>
                            </div>`;
                    });
                    bookmarksHtml += `</div>`;
                }

                els.body.innerHTML = `
                    <div class="mb-2">
                        <div class="flex items-center justify-between mb-6 sticky top-0 bg-slate-50 dark:bg-dark-bg z-10 py-2 border-b border-slate-200 dark:border-slate-800">
                            <button onclick="window.userPanelApp.setView('menu')" class="p-2 -ml-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 font-bold text-sm"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg> Back</button>
                        </div>
                        <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Saved Items</h3>
                        <p class="text-xs text-slate-500 font-medium">Quickly access your difficult questions synced from the cloud.</p>
                        ${bookmarksHtml}
                    </div>`;
                els.footer.innerHTML = ``; 

            } else if (this.viewMode === 'edit_profile') {
                const currentYear = pData.joinYear || ''; const isS = (v, t) => (v === t) ? 'selected' : '';
                els.body.innerHTML = `
                    <div class="mb-4">
                        <div class="flex items-center justify-between mb-6 sticky top-0 bg-slate-50 dark:bg-dark-bg z-10 py-2 border-b border-slate-200 dark:border-slate-800">
                            <button onclick="window.userPanelApp.setView('menu')" class="p-2 -ml-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 font-bold text-sm"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg> Back</button>
                        </div>
                        <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-6">Edit Profile</h3>
                        <div class="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div><label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label><input type="text" id="edit-name" value="${pData.fullName || ''}" class="w-full mt-1 px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none dark:text-white text-sm font-medium focus:ring-2 focus:ring-brand-500 transition-shadow" /></div>
                            <div><label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">College Name</label><input type="text" id="edit-college" value="${pData.college || ''}" class="w-full mt-1 px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none dark:text-white text-sm font-medium focus:ring-2 focus:ring-brand-500 transition-shadow" /></div>
                            <div><label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Join Year / Batch</label><select id="edit-join-year" class="w-full mt-1 px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"><option value="">Select</option><option value="2025 Batch" ${isS(currentYear, '2025 Batch')}>2025 Batch</option><option value="2024 Batch" ${isS(currentYear, '2024 Batch')}>2024 Batch</option><option value="2023 Batch" ${isS(currentYear, '2023 Batch')}>2023 Batch</option><option value="2022 Batch" ${isS(currentYear, '2022 Batch')}>2022 Batch</option><option value="2021 Batch" ${isS(currentYear, '2021 Batch')}>2021 Batch (Intern)</option><option value="Post-Grad / JR" ${isS(currentYear, 'Post-Grad / JR')}>Post-Grad / JR</option></select></div>
                            <div class="grid grid-cols-2 gap-3">
                                <div><label class="text-[10px] font-bold text-slate-500 uppercase ml-1">City</label><input type="text" id="edit-city" value="${pData.city || ''}" class="w-full mt-1 px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none dark:text-white text-sm font-medium focus:ring-2 focus:ring-brand-500 transition-shadow" /></div>
                                <div><label class="text-[10px] font-bold text-slate-500 uppercase ml-1">Phone</label><input type="tel" id="edit-phone" value="${pData.phone || ''}" class="w-full mt-1 px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none dark:text-white text-sm font-medium focus:ring-2 focus:ring-brand-500 transition-shadow" /></div>
                            </div>
                            <button onclick="window.saveEditedProfile(this)" class="w-full py-4 mt-6 rounded-xl text-sm font-bold bg-brand-500 text-white shadow-lg shadow-brand-500/30 active:scale-95 transition-all">Save Changes</button>
                        </div>
                    </div>`;
                els.footer.innerHTML = ``;
            }
        } else {
            if (this.authMode === 'login') {
                els.body.innerHTML = `
                    <div class="flex flex-col items-center justify-center min-h-[calc(100vh-250px)]">
                        <img src="${APP_LOGO_URL}" class="w-20 h-20 rounded-2xl shadow-xl ring-4 ring-offset-4 ring-brand-400/30 mb-6 object-cover" alt="Logo">
                        <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Welcome Back</h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Log in to sync your progress.</p>
                        <div id="auth-error-msg" class="hidden w-full bg-red-50 text-red-600 border border-red-200 text-xs p-3 rounded-xl mb-4 text-center font-bold"></div>
                        <div class="w-full space-y-3 mb-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <input type="email" id="login-email" placeholder="Email Address" class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none dark:text-white text-sm font-medium focus:ring-2 focus:ring-brand-500 transition-shadow" />
                            <div class="relative w-full">
                                <input type="password" id="login-pass" placeholder="Password" class="w-full pl-4 pr-10 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none dark:text-white text-sm font-medium focus:ring-2 focus:ring-brand-500 transition-shadow" />
                                <button type="button" onclick="window.togglePassword()" class="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><svg id="eye-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                            </div>
                            <div class="text-right w-full pt-1"><button onclick="window.handleForgotPass()" class="text-[10px] font-bold text-brand-500 uppercase tracking-wider hover:text-brand-600 transition-colors">Forgot Password?</button></div>
                        </div>
                        <button onclick="window.handleEmailLogin(this)" class="w-full py-4 rounded-xl text-sm font-bold bg-brand-500 text-white shadow-lg shadow-brand-500/30 active:scale-95 transition-all hover:bg-brand-600">Sign In</button>
                        <div class="text-center mt-6"><span class="text-sm text-slate-500">Don't have an account?</span> <button onclick="window.toggleAuthMode('register')" class="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline ml-1">Create One</button></div>
                    </div>`;
            } else {
                els.body.innerHTML = `
                    <div class="flex flex-col items-center justify-start min-h-[calc(100vh-250px)] pb-4">
                        <img src="${APP_LOGO_URL}" class="w-16 h-16 rounded-2xl shadow-xl ring-2 ring-offset-2 ring-brand-400/50 mb-4 object-cover mt-2" alt="Logo">
                        <h3 class="text-xl font-black text-slate-900 dark:text-white mb-1">Create Global Profile</h3>
                        <p class="text-sm text-slate-500 mb-6">Join the community.</p>
                        <div id="auth-error-msg" class="hidden w-full bg-red-50 text-red-600 border border-red-200 text-xs p-3 rounded-xl mb-4 text-center font-bold"></div>
                        <div class="w-full space-y-3 mb-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <select id="reg-country" class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-shadow font-medium"><option value="">Select Country</option><option value="India" selected>India</option></select>
                            <input type="text" id="reg-city" placeholder="City" class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-sm dark:text-white font-medium focus:ring-2 focus:ring-brand-500 transition-shadow" />
                            <input type="text" id="reg-name" placeholder="Full Name" class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-sm dark:text-white font-medium focus:ring-2 focus:ring-brand-500 transition-shadow" />
                            <input type="email" id="reg-email" placeholder="Email Address" class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-sm dark:text-white font-medium focus:ring-2 focus:ring-brand-500 transition-shadow" />
                            <input type="password" id="reg-pass" placeholder="Create Password (Min 6)" class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-sm dark:text-white font-medium focus:ring-2 focus:ring-brand-500 transition-shadow" />
                            <div class="grid grid-cols-2 gap-3">
                                <select id="reg-join-year" class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm outline-none font-medium focus:ring-2 focus:ring-brand-500 transition-shadow"><option value="">Batch</option><option value="2025 Batch">2025 Batch</option><option value="2024 Batch">2024 Batch</option><option value="2023 Batch">2023 Batch</option><option value="2022 Batch">2022 Batch</option><option value="Intern">Intern</option><option value="JR/SR">JR / SR</option></select>
                                <input type="text" id="reg-college" placeholder="College Name" class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-sm dark:text-white font-medium focus:ring-2 focus:ring-brand-500 transition-shadow" />
                            </div>
                            <input type="tel" id="reg-phone" placeholder="Phone Number" class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-sm dark:text-white font-medium focus:ring-2 focus:ring-brand-500 transition-shadow" />
                        </div>
                        <button onclick="window.handleEmailSignUp(this)" class="w-full py-4 rounded-xl text-sm font-bold bg-green-600 text-white shadow-lg shadow-green-600/30 active:scale-95 transition-all hover:bg-green-700">Create Account</button>
                        <div class="text-center mt-6"><span class="text-sm text-slate-500">Already have an account?</span><button onclick="window.toggleAuthMode('login')" class="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline ml-1">Sign In</button></div>
                    </div>`;
            }
            els.footer.innerHTML = legalFooterHtml;
        }
    }
};

// ==========================================
// CONTRIBUTOR APPLICATION LOGIC
// ==========================================
window.submitContributorApplication = async function() {
    const btn = document.getElementById('app-submit-btn');
    const name = document.getElementById('app-name').value;
    const college = document.getElementById('app-college').value;
    const file = document.getElementById('app-id-file').files[0];

    if(!file) return alert("Please upload an ID card.");
    
    btn.disabled = true;
    btn.innerText = "Submitting securely...";
    
    // Simulate database update for UI testing
    setTimeout(() => {
        window.currentUserProfileData = window.currentUserProfileData || {};
        window.currentUserProfileData.contributorStatus = 'pending';
        window.closeContributorModal();
        window.userPanelApp.renderState(); // Refreshes UI to "Under Review" state
        alert("Application Submitted! Our admin team will review your ID card shortly.");
    }, 1500);
};

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}
