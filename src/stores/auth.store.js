import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import { router } from '@/router';
import { useAlertStore } from '@/stores';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        //json.parse chuyển đoạn json về đối tượng js
        //localStorage.getItem trả về giá trị được lưu trữ trong bộ nhớ CỤC BỘ của trình duyệt với khóa là user
        user: JSON.parse(localStorage.getItem('user')), 
        returnUrl: null
    }),
    actions: {
        async login(username, password) {
            try {
                const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });    

                // update pinia state
                this.user = user;

                // store user details and jwt in local storage to keep user logged in between page refreshes
                //localStorage.setItem lưu trữ đối tượng user dưới dạng chuỗi JSON vào bộ nhớ CỤC BỘ của trình duyệt
                //json.stringify chuyển đối tượng user thành chuỗi json
                localStorage.setItem('user', JSON.stringify(user));

                // redirect to previous url or default to home page'
                //router.push chuyển hướng đến url mới, returnUrl đang =null(ko xác định) nên url gốc "/" được sd
                router.push(this.returnUrl || '/');
            } catch (error) {
                //tb lỗi 
                const alertStore = useAlertStore();
                alertStore.error(error);                
            }
        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
            router.push('/account/login');
        }
    }
});
