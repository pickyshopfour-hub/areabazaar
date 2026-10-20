/**
 * UIController Module
 * AreaBazaar Frontend Interactivity
 */

class UIController {
    /**
     * Show notification via IziToast
     */
    static notify(message, type = 'info') {
        const config = {
            title: type.toUpperCase(),
            message: message,
            position: 'topRight',
            timeout: 5000
        };

        if (type === 'success') iziToast.success(config);
        else if (type === 'error') iziToast.error(config);
        else iziToast.info(config);
    }

    /**
     * Toggle button loading state
     */
    static setLoading(btnId, state) {
        const btn = document.getElementById(btnId);
        if (!btn) return;

        if (state) {
            btn.dataset.originalHtml = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
            btn.disabled = true;
        } else {
            btn.innerHTML = btn.dataset.originalHtml || 'Submit';
            btn.disabled = false;
        }
    }

    /**
     * Initialize Izimodals
     */
    static initModal(selector, options = {}) {
        $(selector).iziModal(Object.assign({
            width: 600,
            radius: 10,
            padding: 20,
            headerColor: '#007bff'
        }, options));
    }
}
