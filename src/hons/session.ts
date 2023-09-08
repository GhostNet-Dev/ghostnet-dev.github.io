export type HonUser = {
    Email: string,
    Nickname: String,
    Password: string,
}

export class Session {
    m_user: HonUser;
    m_signinFlag: boolean;

    public constructor() {
        this.m_user = {Email: "", Nickname:"", Password:""};
        this.m_signinFlag = false;
    }
    public DrawHtmlSessionInfo() {
        const seInfo = document.getElementById("sessioninfo");
        if(seInfo == null) return;
        if (this.m_signinFlag) {
            seInfo.innerHTML = `
            <li class="nav-item "> <a class="nav-link" href="javascript:void(0)">${this.m_user.Nickname}</a> </li>
            <li class="nav-item "> 
            <a class="nav-link" href="javascript:void(0)" onclick="ClickLoadPage('logout', true)">
                Logout
            </a> 
            </li>
            `;

        } else {
            seInfo.innerHTML = `
            <li class="nav-item "> <a class="nav-link" href="javascript:void(0)" onclick="ClickLoadPage('signin', true)">Sign
                    In</a> </li>
            <li class="nav-item "> <a class="nav-link" href="javascript:void(0)" onclick="ClickLoadPage('signup', true)">Sign
                    Up</a> </li>

            `;
        }
    }

    public SignIn(user:HonUser) {
        this.m_user = user;
        this.m_signinFlag = true;
    }

    public CheckLogin(): boolean {
        return this.m_signinFlag;
    } 
}