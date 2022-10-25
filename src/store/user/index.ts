import { defineStore } from "pinia";

export const useUserStore = defineStore({
    id: "user-info",
    state: () => {
        return {
            userName: 'zzx12312312qawedqwd',
            userAccountName: '',
            userAlbums: [],
            userAvatarSrc: '',
        }
    },
    actions: {

    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: "user-info",
                storage: localStorage
            }
        ]
    }
})