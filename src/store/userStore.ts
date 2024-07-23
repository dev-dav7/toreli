import {makeAutoObservable} from 'mobx';
import AuthService from "../sevices/authService";
import UserService from "../sevices/userService";
import {mainStore} from "./mainStore";
import {AxiosResponse} from "axios";

export default class UserStore {

    isAuth = false
    name = ""
    birthdayYear: number = 1900

    constructor() {
        makeAutoObservable(this)
    }

    unsafeAuth(): boolean {
        if (this.isAuth)
            return true

        return !!localStorage.getItem('token');
    }

    setAuth(bool: boolean) {
        this.isAuth = bool
    }

    async loadUserData() {
        UserService.getUserData()
            .then(x => {
                this.name = x.data.name
                this.birthdayYear = x.data.birthdayYear
            })
            .catch(error => {
                //todo сделать с этим что-то
                console.log("GG", error)
            })
    }

    login(promise: Promise<AxiosResponse<string>>, setIsLoading: (b: boolean) => void, setError: (s: string) => void) {
        setIsLoading(true)
        setError("")
        promise
            .then(x => {
                localStorage.setItem('token', x.data)
                this.setAuth(true);
                window.location.pathname = "/"
            })
            .catch(error => setError(error))
            .finally(() => {
                setIsLoading(false)
            })
    }

    async logout() {
        try {
            await AuthService.logout()
        } catch (e) {
            console.log((e as Error).message)
        } finally {
            this.setAuth(false)
            this.resetUserData()
            localStorage.removeItem('token')
            window.location.pathname = "/auth"
        }
    }

    resetUserData() {
        this.name = ""
        this.birthdayYear = 1900
        mainStore.reset()
    }
}