// ==UserScript==
// @name         Toyota Beyond Web TAM Two-Way Live Sync Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Otomatis menyinkronkan data WAC (Open & Closed) dari aplikasi lokal ke Web TAM Beyond
// @author       Antigravity
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @connect      localhost
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const LOCAL_APP_URL = 'http://127.0.0.1:5050';

    console.log('[Toyota TAM Sync] Active & monitoring WAC requests...');

    // Intercept window.fetch
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const url = (typeof args[0] === 'string') ? args[0] : (args[0]?.url || '');
        
        // Check if request is for WAC detail or checklist
        if (url.includes('/api/sr/v2/web/wac/detail') || url.includes('/api/sr/v2/web/wac/checklist')) {
            const urlObj = new URL(url, window.location.origin);
            const wacId = urlObj.searchParams.get('WACID');

            const response = await originalFetch.apply(this, args);
            if (!wacId || !response.ok) return response;

            try {
                const clone = response.clone();
                const json = await clone.json();

                // Fetch latest edits from local app
                const localData = await new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: ${LOCAL_APP_URL}/api/wac/detail/,
                        timeout: 1500,
                        onload: function(res) {
                            try {
                                const data = JSON.parse(res.responseText);
                                resolve(data.success ? data.data : null);
                            } catch (e) {
                                resolve(null);
                            }
                        },
                        onerror: function() { resolve(null); },
                        ontimeout: function() { resolve(null); }
                    });
                });

                if (localData) {
                    if (url.includes('/detail') && json.data) {
                        if (localData.detail?.mileageFromWAC !== undefined) {
                            json.data.mileageFromWAC = localData.detail.mileageFromWAC;
                        }
                    } else if (url.includes('/checklist') && json.data) {
                        if (localData.checklist) {
                            Object.assign(json.data, localData.checklist);
                        }
                    }

                    return new Response(JSON.stringify(json), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                }
            } catch (err) {
                console.warn('[Toyota TAM Sync] Failed to merge local edits:', err);
            }

            return response;
        }

        return originalFetch.apply(this, args);
    };
})();
