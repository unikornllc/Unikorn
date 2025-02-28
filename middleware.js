import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

const routeRules = {
	authRoutes: ["/", "/signin", "/signup/company", "/signup/user", "/verifyAccount", "/checkEmail"],
	protectedUserRoutes: ["/user/home", "/user/profile", "/myInvestments"],
	protectedCompanyRoutes: ["/company/home", "/company/profile", "/company/fundraising"],
	sharedRoutes: [
		"/investments",
		"/reset-password",
		"/password-reset-request",
		"/userChat",
		"/text",
		"/external-redirect"
	],
	dynamicRoutes: [
		"/user/profile/",
		"/company/profile/",
		"/companyProfile/",
		"/userProfile/",
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
			return withRoleResponse(
				NextResponse.redirect(
					new URL(role === "User" ? "/user/home" : "/company/home", req.url),
				),
				role,
			);
		}

		if (
			routeRules.sharedRoutes.includes(pathname) ||
			isDynamicRoute(pathname, routeRules.dynamicRoutes)
		) {
			return withRoleResponse(NextResponse.next(), role);
		}

		if (role === "User" && routeRules.protectedUserRoutes.includes(pathname)) {
			return withRoleResponse(NextResponse.next(), role);
		}
		if (
			role === "Company" &&
			routeRules.protectedCompanyRoutes.includes(pathname)
		) {
			return withRoleResponse(NextResponse.next(), role);
		}

		// return NextResponse.rewrite(new URL("/not-found", req.url));
		return withRoleResponse(NextResponse.next(), role)
	} catch (error) {
		return NextResponse.redirect(new URL("/signin", req.url));
	}
}

export const config = {
	matcher: ["/((?!_next|static|api).*)"],
};
