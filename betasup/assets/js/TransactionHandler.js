/**
 * TransactionHandler Module
 * AreaBazaar Frontend Interactivity
 */

class TransactionHandler {
    /**
     * Perform an API request
     * @param {string} endpoint - The API endpoint (e.g., 'auth/login')
     * @param {string} method - HTTP method (POST, GET)
     * @param {object} data - Data to send (will be JSON stringified)
     * @param {string} btnId - Optional button ID to toggle loading state
     */
    static async request(endpoint, method = 'POST', data = {}, btnId = null) {
        if (btnId) UIController.setLoading(btnId, true);

        try {
            const response = await fetch(`/areabazaar/public/api/${endpoint}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('ab_token') || ''}`
                },
                body: method === 'GET' ? null : JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === 'success') {
                if (result.message) UIController.notify(result.message, 'success');
                return result.data || true;
            } else {
                UIController.notify(result.error || result.message, 'error');
                return null;
            }
        } catch (error) {
            console.error('Transaction Error:', error);
            UIController.notify('Connection failed. Please try again.', 'error');
            return null;
        } finally {
            if (btnId) UIController.setLoading(btnId, false);
        }
    }

    /**
     * Handle Spot Order purchase (Immediate)
     */
    static async spotOrder(productId, quantity, price, pin, btnId) {
        const result = await this.request('order/spotorder', 'POST', {
            product_id: productId,
            quantity: quantity,
            price: price,
            pin: pin
        }, btnId);

        // If result.mismatch is true, landing.php will handle the prompt
        return result;
    }

    /**
     * Cart Manager (Client-Side localStorage)
     */
    static getLocalCart() {
        return JSON.parse(localStorage.getItem('ab_cart') || '[]');
    }

    static saveLocalCart(cart) {
        localStorage.setItem('ab_cart', JSON.stringify(cart));
    }

    static addToLocalCart(item) {
        let cart = this.getLocalCart();
        const existing = cart.find(i => i.product_id === item.product_id);
        if (existing) {
            existing.quantity += item.quantity;
        } else {
            cart.push(item);
        }
        this.saveLocalCart(cart);
        UIController.notify('Item added to cart!', 'success');
    }

    static clearLocalCart() {
        localStorage.removeItem('ab_cart');
    }

    /**
     * Validate cart items before checkout
     */
    static async validateCart() {
        const items = this.getLocalCart();
        if (!items.length) return null;

        return await this.request('order/validate', 'POST', { items: items });
    }

    /**
     * Get order history
     */
    static async getOrderHistory() {
        return await this.request('order/history', 'GET');
    }
}
