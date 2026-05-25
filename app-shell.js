// ==========================================
// app-shell.js - Centralized UI Component & Auth State Machine
// ==========================================

const ADMIN_EMAILS = ["educateindiainstitute@gmail.com", "mbbsprofsprep@gmail.com"];

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
                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Identity Verification</p>
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
                                <p class="text-sm font-bold text-slate-800 dark:text-white leading-none">Contributor</p>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Earn <span class="text-green-600 dark:text-green-400 font-bold">30 Days</span> of Premium Access per approved paper.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p class="text-xs text-slate-600 dark:text-slate-400 mb-5 font-medium leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">To unlock the upload portal, securely verify your student identity below.</p>
                
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

document.body.insertAdjacentHTML('afterbegin', appShellHTML);

// 2. GLOBALS & UI STATE
const APP_LOGO_URL = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFbo8CVZSf-ejwVGTTTGeu1B5bJj4JGloqdh70o21Tf_895kWYOvNmyE9cnAAR66r77ZFZZKTslF6QIp4F-bWxPsXjGsAWzwc75D6VnXqFMbi-4NgUazELmMWeyX3ApASZncrHUFjni62u4spE3g19Pfcbsy-h5iUTfxTXWWTEYPgaD47kLMDA43e1SMQ/s678/1000126459.jpg";

window.toggleAuthMode = function(mode) { window.userPanelApp.authMode = mode; window.userPanelApp.renderState(); };
window.showAuthError = function(msg) { const errDiv = document.getElementById('auth-error-msg'); if(errDiv) { errDiv.innerText = msg; errDiv.classList.remove('hidden'); setTimeout(() => errDiv.classList.add('hidden'), 5000); } else { alert(msg); } };
window.toggleTheme = function() { const d = document.documentElement.classList.toggle('dark'); localStorage.setItem('theme', d?'dark':'light'); const icon = document.getElementById('theme-icon'); if(icon) icon.innerText = d?'☀️':'🌙'; };
window.openContributorModal = function() { document.getElementById('contributor-modal-backdrop').classList.remove('opacity-0', 'pointer-events-none'); document.getElementById('contributor-modal-card').classList.remove('scale-95'); };
window.closeContributorModal = function() { document.getElementById('contributor-modal-backdrop').classList.add('opacity-0', 'pointer-events-none'); document.getElementById('contributor-modal-card').classList.add('scale-95'); };

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
        const legalFooterHtml = `<div class="flex justify-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-4"><a href="#">Terms</a> • <a href="#">Privacy</a> • <a href="#">Contact</a></div>`;

        if (user) {
            // ADMIN CHECK
            const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());

            if (this.viewMode === 'menu') {
                const nameToDisplay = user.displayName || pData.fullName || "User";
                const initial = user.email.charAt(0).toUpperCase();

                const trustScore = pData.trustScore || 0;
                const cStatus = pData.contributorStatus || 'none'; 
                const isContributor = trustScore >= 1 || cStatus === 'approved';

                let workflowHtml = '';

                // --- ADMIN VIEW ---
                if (isAdmin) {
                    workflowHtml = `
                    <a onclick="window.userPanelApp.setView('admin_apps')" class="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800 cursor-pointer shadow-sm group mt-4 hover:bg-red-100 transition-colors">
                        <div class="flex items-center gap-4 text-red-700 dark:text-red-400 font-semibold text-sm">
                            <span class="w-10 h-10 rounded-xl bg-red-200 dark:bg-red-800 flex items-center justify-center text-xl">📋</span> 
                            <div class="flex flex-col">
                                <span class="font-bold leading-tight">Review Applications</span>
                                <span class="text-[10px] font-bold opacity-80 mt-0.5">Admin Dashboard</span>
                            </div>
                        </div>
                        <span class="text-red-500 font-bold">❯</span>
                    </a>
                    <a href="upload.html" class="flex items-center justify-between p-4 bg-brand-50 dark:bg-brand-900/10 rounded-2xl border border-brand-200 dark:border-brand-800 cursor-pointer shadow-sm group mt-2 hover:bg-brand-100 transition-colors">
                        <div class="flex items-center gap-4 text-brand-700 dark:text-brand-400 font-semibold text-sm"><span class="w-10 h-10 rounded-xl bg-brand-200 dark:bg-brand-800 flex items-center justify-center text-xl">📤</span> Upload Panel (Admin)</div><span class="text-brand-500 font-bold">❯</span>
                    </a>`;
                
                // --- APPROVED CONTRIBUTOR VIEW ---
                } else if (isContributor) {
                    workflowHtml = `
                    <a href="upload.html" class="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl border-none shadow-lg hover:shadow-green-500/30 cursor-pointer transition-all group mt-4">
                        <div class="flex items-center gap-4 text-white font-semibold text-sm">
                            <span class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white text-xl shadow-inner">📤</span> 
                            <div class="flex flex-col"><span class="font-bold leading-tight">Upload Qs Paper</span><span class="text-[10px] font-bold opacity-80 mt-0.5">+ Earn Trust Score</span></div>
                        </div><span class="text-white/70 text-xs font-bold bg-black/10 px-2 py-1 rounded-md">Go</span>
                    </a>`;
                
                // --- PENDING VIEW ---
                } else if (cStatus === 'pending') {
                    workflowHtml = `
                    <div class="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800 mt-4 flex gap-3">
                        <div class="text-2xl animate-pulse">⏳</div>
                        <div>
                            <h4 class="text-sm font-bold text-amber-800 dark:text-amber-400">Application Under Review</h4>
                            <p class="text-[10px] text-amber-600 dark:text-amber-500 mt-1 font-medium leading-relaxed">Our admin team is verifying your College ID. You will unlock the upload portal once approved.</p>
                        </div>
                    </div>`;
                
                // --- REJECTED VIEW (Allows Re-application) ---
                } else if (cStatus === 'rejected') {
                    workflowHtml = `
                    <div class="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800 mt-4 flex flex-col gap-2">
                        <div class="flex gap-3">
                            <div class="text-2xl">❌</div>
                            <div>
                                <h4 class="text-sm font-bold text-red-800 dark:text-red-400">Application Rejected</h4>
                                <p class="text-[10px] text-red-600 dark:text-red-500 mt-1 font-medium leading-relaxed">Reason: ${pData.rejectionReason || 'Identity verification failed.'}</p>
                            </div>
                        </div>
                        <button onclick="window.openContributorModal()" class="mt-2 w-full py-2 bg-red-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-red-700 transition-colors">Submit New Application</button>
                    </div>`;

                // --- NORMAL USER VIEW ---
                } else {
                    workflowHtml = `
                    <div class="bg-gradient-to-br from-brand-600 to-purple-700 rounded-2xl p-5 text-white mt-4 shadow-xl relative overflow-hidden">
                        <div class="relative z-10">
                            <h4 class="font-black text-lg mb-1 shadow-sm">Become a Contributor</h4>
                            <p class="text-xs text-brand-100 font-medium mb-4 leading-relaxed">Help the community grow and earn permanent platform perks.</p>
                            <button onclick="window.openContributorModal()" class="w-full py-3 bg-white text-brand-700 font-black rounded-xl hover:scale-[1.02] transition-transform shadow-lg">View Perks & Apply</button>
                        </div>
                    </div>`;
                }

                els.body.innerHTML = `
                    <div class="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="w-20 h-20 rounded-full bg-brand-50 dark:bg-slate-800 flex items-center justify-center text-3xl font-bold text-brand-600 dark:text-brand-400 mb-3">${initial}</div>
                        <h3 class="font-bold text-slate-900 dark:text-white text-center w-full truncate px-2 text-sm">${nameToDisplay}</h3>
                        <p class="text-xs text-slate-500 truncate w-full text-center mt-1">${user.email}</p>
                        ${isAdmin ? '<span class="px-3 py-1 mt-3 bg-red-100 text-red-600 text-[10px] font-extrabold rounded-full uppercase tracking-wider border border-red-200">System Admin</span>' : ''}
                    </div>
                    ${workflowHtml}
                    <div class="flex flex-col gap-3 mt-4">
                        <a onclick="window.userPanelApp.setView('edit_profile')" class="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm group"><div class="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-semibold text-sm"><span class="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500 text-xl">👤</span> My Profile</div><span class="text-slate-400 text-xs">❯</span></a>
                    </div>`;
                
                els.footer.innerHTML = `${legalFooterHtml}<button onclick="window.firebaseSignOut()" class="w-full py-3.5 rounded-xl bg-red-50 text-red-600 font-bold mt-2 shadow-sm text-sm border border-red-200">Logout</button>`;

            // ==========================================
            // ADMIN DASHBOARD VIEW
            // ==========================================
            } else if (this.viewMode === 'admin_apps') {
                els.body.innerHTML = `
                    <div class="mb-4 flex flex-col h-full">
                        <div class="flex items-center justify-between mb-4 sticky top-0 bg-slate-50 dark:bg-dark-bg z-10 py-2 border-b border-slate-200 dark:border-slate-800">
                            <button onclick="window.userPanelApp.setView('menu')" class="p-2 -ml-2 rounded-lg text-slate-600 font-bold text-sm flex items-center gap-1">❮ Back</button>
                        </div>
                        <h3 class="text-xl font-black text-slate-900 dark:text-white mb-1">Review Applications</h3>
                        <p class="text-xs text-slate-500 mb-4 font-medium">Approve or reject pending contributor requests.</p>
                        <div id="admin-apps-container" class="space-y-3 pb-10">
                            <div class="text-center p-6 text-sm font-bold text-slate-400 animate-pulse">Fetching from Firebase...</div>
                        </div>
                    </div>`;
                els.footer.innerHTML = ``;
                
                // Fetch the live data
                setTimeout(() => window.loadAdminApplications(), 100);
            }

        } else {
            // GUEST LOGIN
            els.body.innerHTML = `
                <div class="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] pb-4 text-center">
                    <img src="${APP_LOGO_URL}" class="w-16 h-16 rounded-2xl shadow-xl ring-2 ring-brand-400/50 mb-4 object-cover mt-2">
                    <h3 class="text-xl font-black mb-1">Global Profile</h3>
                    <p class="text-sm text-slate-500 mb-6">Log in to sync progress or apply as a contributor.</p>
                    <button onclick="alert('Firebase Auth Required')" class="w-full py-4 rounded-xl text-sm font-bold bg-brand-500 text-white shadow-lg">Sign In / Register</button>
                </div>`;
            els.footer.innerHTML = legalFooterHtml;
        }
    }
};

// ==========================================
// LIVE FIREBASE LOGIC FOR WORKFLOWS
// ==========================================

// Ensure we have access to Firebase dynamically (Uses your Web SDK v11 global instances)
async function getFirebaseInstances() {
    const { getFirestore, doc, updateDoc, collection, query, where, getDocs, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js");
    const { getStorage, ref, uploadBytesResumable, getDownloadURL } = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js");
    const db = getFirestore();
    const storage = getStorage();
    return { db, storage, doc, updateDoc, collection, query, where, getDocs, serverTimestamp, ref, uploadBytesResumable, getDownloadURL };
}

// 1. User Submits Application
window.submitContributorApplication = async function() {
    const btn = document.getElementById('app-submit-btn');
    const name = document.getElementById('app-name').value;
    const college = document.getElementById('app-college').value;
    const file = document.getElementById('app-id-file').files[0];
    const user = window.currentUserObj;

    if(!file) return alert("Please upload an ID card.");
    if(!user) return alert("Not logged in.");
    
    btn.disabled = true; btn.innerText = "Uploading ID securely...";
    
    try {
        const fb = await getFirebaseInstances();
        
        // Upload ID Card to Storage
        const fileExt = file.name.split('.').pop();
        const storageRef = fb.ref(fb.storage, `contributor_ids/${user.uid}_${Date.now()}.${fileExt}`);
        const uploadTask = await fb.uploadBytesResumable(storageRef, file);
        const downloadURL = await fb.getDownloadURL(uploadTask.ref);

        btn.innerText = "Updating Profile...";

        // Update Firestore User Document
        await fb.updateDoc(fb.doc(fb.db, "users", user.uid), {
            contributorStatus: 'pending',
            fullName: name,
            college: college,
            idCardUrl: downloadURL,
            applicationDate: fb.serverTimestamp(),
            rejectionReason: "" // Clear any previous rejections
        });

        // Update Local State & UI
        window.currentUserProfileData.contributorStatus = 'pending';
        window.closeContributorModal();
        window.userPanelApp.renderState();

    } catch (error) {
        console.error("Submission Error:", error);
        alert("Failed to submit: " + error.message);
        btn.disabled = false; btn.innerText = "Submit Application";
    }
};

// 2. Admin Loads the Applications
window.loadAdminApplications = async function() {
    const container = document.getElementById('admin-apps-container');
    if (!container) return;

    try {
        const fb = await getFirebaseInstances();
        const q = fb.query(fb.collection(fb.db, "users"), fb.where("contributorStatus", "==", "pending"));
        const querySnapshot = await fb.getDocs(q);
        
        if (querySnapshot.empty) {
            container.innerHTML = `<div class="text-center p-6 text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl">No pending applications.</div>`;
            return;
        }

        let html = '';
        querySnapshot.forEach((document) => {
            const data = document.data();
            html += `
            <div class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm mb-3">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-brand-600">${data.college || 'No College'}</span>
                </div>
                <h4 class="font-bold text-slate-900 dark:text-white text-sm">${data.fullName || 'No Name'}</h4>
                <p class="text-xs text-slate-500 mb-4">${data.email}</p>
                
                <div class="flex gap-2">
                    <a href="${data.idCardUrl}" target="_blank" class="flex-1 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 text-center">View ID</a>
                    <button onclick="window.adminApprove('${document.id}')" class="flex-1 py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600">Approve</button>
                    <button onclick="window.adminReject('${document.id}')" class="flex-1 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600">Reject</button>
                </div>
            </div>`;
        });
        container.innerHTML = html;

    } catch (error) {
        console.error("Failed to load apps:", error);
        container.innerHTML = `<div class="text-center p-4 text-xs font-bold text-red-500">Failed to load from database.</div>`;
    }
};

// 3. Admin Approves Application
window.adminApprove = async function(uid) {
    if(!confirm("Approve this user? They will gain upload access immediately.")) return;
    
    try {
        const fb = await getFirebaseInstances();
        await fb.updateDoc(fb.doc(fb.db, "users", uid), {
            contributorStatus: "approved",
            rejectionReason: ""
        });
        window.loadAdminApplications(); // Refresh list
    } catch (e) {
        alert("Error approving: " + e.message);
    }
};

// 4. Admin Rejects Application
window.adminReject = async function(uid) {
    const reason = prompt("Enter reason for rejection (This will be shown to the user):", "Blurry ID card / Name mismatch");
    if (!reason) return; // Cancelled
    
    try {
        const fb = await getFirebaseInstances();
        await fb.updateDoc(fb.doc(fb.db, "users", uid), {
            contributorStatus: "rejected",
            rejectionReason: reason
        });
        window.loadAdminApplications(); // Refresh list
    } catch (e) {
        alert("Error rejecting: " + e.message);
    }
};
