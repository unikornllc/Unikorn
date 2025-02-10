import { NextResponse } from "next/server";


export function middleware(req) {
    const authRoutes = ["/", "/signin", "/signup"];
    const protectedUserRoutes = ["/userHome", "/userProfile", "myInvestments"];
    const protectedCompanyRoutes = ["/companyDashboard", "/companyProfile", "/myInvestments"];

    const token = req.cookies.get("SID")?.value;
    console.log(token)
    if (token && authRoutes.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/userHome", req.url));
    }

    if (!token && (protectedUserRoutes.includes(req.nextUrl.pathname) || protectedCompanyRoutes.includes(req.nextUrl.pathname))) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/:path*",
};
