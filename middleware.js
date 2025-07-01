import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

console.log("JWT_SECRET in middleware:", process.env.JWT_SECRET);

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

const routeRules = {
	authRoutes: [
		"/",
		"/signin",
		"/signup/company",
		"/signup/user",
		"/verifyAccount",
		"/checkEmail",
		"/stayTuned",
	],
	protectedUserRoutes: ["/user/home", "/user/profile", "/myInvestments"],
	protectedCompanyRoutes: [
		"/company/home",
		"/company/profile",
		"/company/fundraising",
	],
	sharedRoutes: [
		"/investments",
		"/companies",
		"/reset-password",
		"/password-reset-request",
		"/userChat",
		"/text",
		"/external-redirect",
	],
	dynamicRoutes: [
		"/user/profile/",
		"/company/profile/",
		"/companyProfile/",
		"/userProfile/",
		"/companies/",
	],
};

const isDynamicRoute = (pathname, routeList) =>
	routeList.some((route) => pathname.startsWith(route));

function withRoleResponse(response, role) {
	response.headers.set("role", role);
	return response;
}

export async function middleware(req) {
	const token = req.cookies.get("BSID")?.value;
	const pathname = req.nextUrl.pathname;

	if (
		pathname.startsWith("/_next/") ||
		pathname.startsWith("/static/") ||
		pathname.startsWith("/api/")
	) {
		return NextResponse.next();
	}

	if (!token) {
		if (routeRules.authRoutes.includes(pathname)) {
			return NextResponse.next();
		}
		return NextResponse.redirect(new URL("/signin", req.url));
	}

	try {
		const { payload } = await jwtVerify(token, secretKey);
		const role = payload.role;

		if (routeRules.authRoutes.includes(pathname) || pathname == "/home") {
			const homeUrl = role === "User" ? "/user/home" : "/company/home";
			return withRoleResponse(
				NextResponse.redirect(new URL(homeUrl, req.url)),
				role,
			);
		}

		// Allow access to shared routes and dynamic routes
		if (
			routeRules.sharedRoutes.includes(pathname) ||
			isDynamicRoute(pathname, routeRules.dynamicRoutes)
		) {
			return withRoleResponse(NextResponse.next(), role);
		}

		// Check role-specific route access
		if (role === "User" && routeRules.protectedUserRoutes.includes(pathname)) {
			return withRoleResponse(NextResponse.next(), role);
		}
		
		if (role === "Company" && routeRules.protectedCompanyRoutes.includes(pathname)) {
			return withRoleResponse(NextResponse.next(), role);
		}

		// For any other route, allow access (you can change this to redirect to 404 if needed)
		return withRoleResponse(NextResponse.next(), role);
		
	} catch (error) {
		console.error("Middleware token verification error:", error);
		// If token is invalid, clear it and redirect to signin
		const response = NextResponse.redirect(new URL("/signin", req.url));
		response.cookies.delete("BSID");
		response.cookies.delete("SID");
		return response;
	}
}

export const config = {
	matcher: ["/((?!_next|static|api|.*\\.png).*)"],
};
