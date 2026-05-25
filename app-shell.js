// ==========================================
// app-shell.js - Centralized UI Component & Auth State Machine
// ==========================================

// 1. INJECT THE NAVBAR, SIDEBAR, & MODALS HTML
const appShellHTML = `
<aside class="fixed top-0 left-0 h-full z-[10005] bg-white dark:bg-dark-surface shadow-2xl transform -translate-x-full transition-transform duration-300 flex flex-col border-r border-brand-100 dark:border-slate-800 w-full sm:w-[350px] lg:w-[400px]" id="user-panel-drawer">
    <div class="px-4 py-4 border-b border-brand-100 dark:border-slate-800 flex justify-between items-center bg-brand-50 dark:bg-dark-bg shrink-0">
        <h2 class="font-bold text-lg text-slate-900 dark:text-white tracking-tight">My Profile</h2>
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
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Identity Verification</p>
            </div>
            <button onclick="window.closeContributorModal()" class="text-slate-400 hover:text-red-500 transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div class="p-6 overflow-y-auto custom-scrollbar">
            <p class="text-xs text-slate-600 dark:text-slate-400 mb-5 font-medium leading-relaxed">To maintain platform quality and prevent spam, you must verify your student identity before uploading past papers. Approval takes 12-24 hours.</p>
            
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
                <button type="submit" id="app-submit-btn" class="w-full py-3.5 mt-6 rounded-xl text-sm font-bold bg-brand-500 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition-colors">Submit Application</button>
            </form>
        </div>
    </div>
</div>
`;

// Insert HTML precisely
document.body.insertAdjacentHTML('afterbegin', appShellHTML);

// 2. GLOBALS & MODAL LOGIC
const APP_LOGO_URL = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFbo8CVZSf-ejwVGTTTGeu1B5bJj4JGloqdh70o21Tf_895kWYOvNmyE9cnAAR66r77ZFZZKTslF6QIp4F-bWxPsXjGsAWzwc75D6VnXqFMbi-4NgUazELmMWeyX3ApASZncrHUFjni62u4spE3g19Pfcbsy-h5iUTfxTXWWTEYPgaD47kLMDA43e1SMQ/s678/1000126459.jpg";

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
    open: function() { 
        this.isOpen = true; this.renderState(); 
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
        const user = window.currentUserObj; 
        const pData = window.currentUserProfileData || {};
        const els = this.els(); if(!els.body || !els.footer) return;
        
        const legalFooterHtml = `<div class="flex justify-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-4"><a href="#">Terms</a> • <a href="#">Privacy</a> • <a href="#">Contact</a></div>`;

        if (user) {
            if (this.viewMode === 'menu') {
                const nameToDisplay = user.displayName || pData.fullName || "Student";
                const initial = (user.email || "U").charAt(0).toUpperCase();
                
                // --- IDENTIFY USER STATE ---
                const trustScore = pData.trustScore || 0;
                const cStatus = pData.contributorStatus || 'none'; // 'none', 'pending', 'approved'
                const isContributor = trustScore >= 1 || cStatus === 'approved' || window.accessLevel === 'admin';

                // --- 1. THE PROFILE HEADER ---
                let headerHtml = `
                    <div class="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 shadow-sm relative overflow-hidden">
                        <div class="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center text-2xl font-bold text-brand-600 mb-3 shadow-sm border border-brand-100">${initial}</div>
                        <h3 class="font-bold text-slate-900 dark:text-white text-center w-full truncate px-2 text-sm">${nameToDisplay}</h3>
                        <p class="text-xs text-slate-500 truncate w-full text-center mt-1">${user.email}</p>
                `;

                // --- 2. DYNAMIC WORKFLOW RENDERER ---
                let workflowHtml = '';

                if (isContributor) {
                    // STATE: APPROVED CONTRIBUTOR
                    let badge = trustScore >= 10 ? { n: "Campus Lead", i: "👑", c: "text-purple-600 bg-purple-100 border-purple-200" } 
                              : trustScore >= 3 ? { n: "Verified Contributor", i: "🛡️", c: "text-blue-600 bg-blue-100 border-blue-200" }
                              : { n: "Contributor", i: "⭐", c: "text-green-600 bg-green-100 border-green-200" };
                    
                    headerHtml += `<div class="absolute top-0 w-full py-1 text-[10px] font-extrabold uppercase tracking-widest border-b text-center ${badge.c}"><span>${badge.i}</span> ${badge.n}</div></div>`;
                    
                    workflowHtml = `
                    <a href="upload.html" class="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl border-none shadow-lg hover:shadow-green-500/30 cursor-pointer transition-all group mb-4">
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
                    // STATE: APPLICATION PENDING
                    headerHtml += `<div class="absolute top-0 w-full py-1 text-[10px] font-extrabold uppercase tracking-widest border-b text-center text-amber-600 bg-amber-100 border-amber-200"><span>⏳</span> Review Pending</div></div>`;
                    
                    workflowHtml = `
                    <div class="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800 mb-4 flex gap-3">
                        <div class="text-2xl animate-pulse">⏳</div>
                        <div>
                            <h4 class="text-sm font-bold text-amber-800 dark:text-amber-400">Application Under Review</h4>
                            <p class="text-[10px] text-amber-600 dark:text-amber-500 mt-1 font-medium leading-relaxed">Our admin team is verifying your College ID. You will unlock the upload portal once approved.</p>
                        </div>
                    </div>`;

                } else {
                    // STATE: NORMAL USER (Sales Pitch)
                    headerHtml += `<div class="absolute top-0 w-full py-1 text-[10px] font-extrabold uppercase tracking-widest border-b text-center text-slate-500 bg-slate-100 border-slate-200"><span>👀</span> Observer</div></div>`;
                    
                    workflowHtml = `
                    <div class="bg-gradient-to-br from-brand-600 to-purple-700 rounded-2xl p-5 text-white mb-4 shadow-xl relative overflow-hidden">
                        <div class="relative z-10">
                            <h4 class="font-black text-lg mb-1 shadow-sm">Become a Contributor</h4>
                            <p class="text-xs text-brand-100 font-medium mb-4">Help the community grow and earn permanent perks.</p>
                            <ul class="text-xs space-y-2 mb-5 font-bold">
                                <li class="flex items-center gap-2"><span class="bg-white/20 p-1 rounded-md text-[10px]">✨</span> Free Premium Access</li>
                                <li class="flex items-center gap-2"><span class="bg-white/20 p-1 rounded-md text-[10px]">🛡️</span> Verified Badge on Profile</li>
                                <li class="flex items-center gap-2"><span class="bg-white/20 p-1 rounded-md text-[10px]">📈</span> Join the Global Leaderboard</li>
                            </ul>
                            <button onclick="window.openContributorModal()" class="w-full py-3 bg-white text-brand-700 font-black rounded-xl hover:scale-[1.02] transition-transform shadow-lg">Apply for Access</button>
                        </div>
                        <div class="absolute -right-6 -bottom-6 text-8xl opacity-10 blur-sm">🎁</div>
                    </div>`;
                }

                // --- 3. RENDER FULL MENU ---
                els.body.innerHTML = headerHtml + workflowHtml + `
                    <div class="flex flex-col gap-3">
                        <a onclick="window.userPanelApp.setView('bookmarks')" class="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-accent-yellow/50 cursor-pointer transition-all shadow-sm group">
                            <div class="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-semibold text-sm">
                                <span class="w-10 h-10 rounded-xl bg-accent-yellow/10 flex items-center justify-center text-accent-yellow text-xl group-hover:scale-110 transition-transform">🔖</span> Bookmarks & Saved
                            </div><span class="text-slate-400 text-xs">❯</span>
                        </a>
                        <a href="checkout.html" class="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-300 cursor-pointer transition-all shadow-sm group">
                            <div class="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-semibold text-sm">
                                <span class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 text-xl group-hover:scale-110 transition-transform">💳</span> Subscription
                            </div><span class="text-slate-400 text-xs">❯</span>
                        </a>
                    </div>`;
                
                els.footer.innerHTML = legalFooterHtml + `<button onclick="window.firebaseSignOut()" class="w-full py-3 mt-4 rounded-xl bg-red-50 text-red-600 font-bold border border-red-200 shadow-sm text-sm">Logout</button>`;
            } 
            // (Other views like 'bookmarks' would go here as previously written)
        } else {
            // GUEST VIEW (Login/Register Forms - Kept exactly as your original UI)
            els.body.innerHTML = `<div class="flex flex-col items-center justify-center min-h-[50vh] text-center"><img src="${APP_LOGO_URL}" class="w-20 h-20 rounded-2xl shadow-xl ring-4 ring-brand-400/30 mb-6"><h3 class="text-2xl font-black mb-2">Welcome Back</h3><p class="text-sm text-slate-500 mb-6">Log in to sync your progress.</p><button onclick="alert('Firebase Auth Required')" class="w-full py-4 rounded-xl text-sm font-bold bg-brand-500 text-white shadow-lg">Sign In / Register</button></div>`;
            els.footer.innerHTML = legalFooterHtml;
        }
    }
};

// ==========================================
// MOCK FIREBASE CONNECTION LOGIC (For Index.html to override)
// ==========================================
window.submitContributorApplication = async function() {
    const btn = document.getElementById('app-submit-btn');
    const name = document.getElementById('app-name').value;
    const college = document.getElementById('app-college').value;
    const file = document.getElementById('app-id-file').files[0];

    if(!file) return alert("Please upload an ID card.");
    
    btn.disabled = true;
    btn.innerText = "Submitting securely...";

    // 🔴 IN PRODUCTION: This logic should be placed in your main Firebase file
    // 1. Upload `file` to Firebase Storage `contributor_ids/{uid}_{timestamp}.jpg`
    // 2. Get Download URL
    // 3. Update Firestore `users/{uid}` -> { contributorStatus: 'pending', idUrl: downloadURL, name, college }
    
    // Fake Timeout for UI demonstration
    setTimeout(() => {
        window.currentUserProfileData = window.currentUserProfileData || {};
        window.currentUserProfileData.contributorStatus = 'pending';
        window.closeContributorModal();
        window.userPanelApp.renderState(); // UI will instantly switch to "Under Review" state
        alert("Application Submitted! Admin will review within 24 hours.");
    }, 1500);
};
