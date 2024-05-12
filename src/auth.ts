import { defineStore } from "pinia";
import axios from "axios";
import router from "./router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    companies: [],
    selectedCompanyId: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isCompanies: (state) => state.companies,
    isSelectedCompanyId: (state) => state.selectedCompanyId,
  },
  actions: {
    async login(credentials: any) {
      try {
        const response = await axios.post("/login", credentials);
        const { user, token, companies } = response.data;
        this.user = user;
        this.token = token;
        this.companies = companies;
        this.selectedCompanyId = (Object.keys(companies)[0]);
        router.push("/");
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
      }
    },
    async logout() {
      try {
        await axios.post("/logout");

        this.user = null;
        this.token = null;
        this.companies = [];
        this.selectedCompanyId = null;

        router.push("/login");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    },
    setSelectedCompanyId(value: string) {
      this.selectedCompanyId = value;
      window.location.reload();
    },
  },
  persist: true,
});
