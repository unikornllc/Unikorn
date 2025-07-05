--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Debian 16.9-1.pgdg120+1)
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: unikorn_ir21_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO unikorn_ir21_user;

--
-- Name: AccountType; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."AccountType" AS ENUM (
    'User',
    'Company'
);


ALTER TYPE public."AccountType" OWNER TO unikorn_ir21_user;

--
-- Name: AttachmentType; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."AttachmentType" AS ENUM (
    'IMAGE',
    'FILE',
    'EMOJI'
);


ALTER TYPE public."AttachmentType" OWNER TO unikorn_ir21_user;

--
-- Name: CompanyPersonnel; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."CompanyPersonnel" AS ENUM (
    'Founder',
    'Advisor',
    'BoardMember',
    'KeyEmployee',
    'Employee',
    'Investor',
    'LeadInvestor'
);


ALTER TYPE public."CompanyPersonnel" OWNER TO unikorn_ir21_user;

--
-- Name: CompanyTier; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."CompanyTier" AS ENUM (
    'Hunter',
    'Holder'
);


ALTER TYPE public."CompanyTier" OWNER TO unikorn_ir21_user;

--
-- Name: CompanyType; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."CompanyType" AS ENUM (
    'Profit',
    'NonProfit',
    'Private',
    'Public'
);


ALTER TYPE public."CompanyType" OWNER TO unikorn_ir21_user;

--
-- Name: ContractStatus; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."ContractStatus" AS ENUM (
    'Pending',
    'Active',
    'Completed',
    'Failed'
);


ALTER TYPE public."ContractStatus" OWNER TO unikorn_ir21_user;

--
-- Name: Degree; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."Degree" AS ENUM (
    'NONE',
    'BA',
    'BSc',
    'MA',
    'MSc',
    'MBA',
    'PhD'
);


ALTER TYPE public."Degree" OWNER TO unikorn_ir21_user;

--
-- Name: EntryType; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."EntryType" AS ENUM (
    'DEBIT',
    'CREDIT'
);


ALTER TYPE public."EntryType" OWNER TO unikorn_ir21_user;

--
-- Name: FlowType; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."FlowType" AS ENUM (
    'Wallet_Deposit',
    'Wallet_Withdraw',
    'Investment_Flow'
);


ALTER TYPE public."FlowType" OWNER TO unikorn_ir21_user;

--
-- Name: InvestorType; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."InvestorType" AS ENUM (
    'User',
    'Company'
);


ALTER TYPE public."InvestorType" OWNER TO unikorn_ir21_user;

--
-- Name: LanguageProficiency; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."LanguageProficiency" AS ENUM (
    'Beginner',
    'Intermediate',
    'Proficient'
);


ALTER TYPE public."LanguageProficiency" OWNER TO unikorn_ir21_user;

--
-- Name: OfferStatus; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."OfferStatus" AS ENUM (
    'Pending',
    'Accepted',
    'Rejected'
);


ALTER TYPE public."OfferStatus" OWNER TO unikorn_ir21_user;

--
-- Name: PostType; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."PostType" AS ENUM (
    'LOOKING_FOR_FUNDING',
    'LOOKING_FOR_PARTNER',
    'LOOKING_FOR_GUIDANCE',
    'EVENT',
    'POLL',
    'DOCUMENT'
);


ALTER TYPE public."PostType" OWNER TO unikorn_ir21_user;

--
-- Name: ReportReason; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."ReportReason" AS ENUM (
    'SPAM',
    'INAPPROPRIATE',
    'OTHER'
);


ALTER TYPE public."ReportReason" OWNER TO unikorn_ir21_user;

--
-- Name: RequestStatus; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."RequestStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED'
);


ALTER TYPE public."RequestStatus" OWNER TO unikorn_ir21_user;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."Role" AS ENUM (
    'User',
    'Company'
);


ALTER TYPE public."Role" OWNER TO unikorn_ir21_user;

--
-- Name: SocialMediaPlatforms; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."SocialMediaPlatforms" AS ENUM (
    'LinkedIn',
    'X',
    'Meetup'
);


ALTER TYPE public."SocialMediaPlatforms" OWNER TO unikorn_ir21_user;

--
-- Name: Tier; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."Tier" AS ENUM (
    'Pro',
    'Standard'
);


ALTER TYPE public."Tier" OWNER TO unikorn_ir21_user;

--
-- Name: Title; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."Title" AS ENUM (
    'Mr',
    'Mrs',
    'Ms'
);


ALTER TYPE public."Title" OWNER TO unikorn_ir21_user;

--
-- Name: TransactionType; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."TransactionType" AS ENUM (
    'Wallet_Deposit',
    'Wallet_Withdraw',
    'Surrender_Equity',
    'Purchase_Equity',
    'Withdraw_Equity'
);


ALTER TYPE public."TransactionType" OWNER TO unikorn_ir21_user;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."UserRole" AS ENUM (
    'INVESTOR',
    'ENTREPRENEUR',
    'USER'
);


ALTER TYPE public."UserRole" OWNER TO unikorn_ir21_user;

--
-- Name: VisibilityOption; Type: TYPE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TYPE public."VisibilityOption" AS ENUM (
    'PUBLIC',
    'PRO_USERS',
    'INVESTORS',
    'ENTREPRENEURS',
    'CUSTOM'
);


ALTER TYPE public."VisibilityOption" OWNER TO unikorn_ir21_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "mobileNumber" text,
    "emailVerified" boolean DEFAULT false NOT NULL,
    role public."AccountType" NOT NULL,
    "googleId" text
);


ALTER TABLE public."Account" OWNER TO unikorn_ir21_user;

--
-- Name: Activity; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Activity" (
    id text NOT NULL,
    title text NOT NULL,
    description character varying(500) NOT NULL,
    "companyId" text NOT NULL
);


ALTER TABLE public."Activity" OWNER TO unikorn_ir21_user;

--
-- Name: Attachment; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Attachment" (
    id text NOT NULL,
    "messageId" text NOT NULL,
    type public."AttachmentType" NOT NULL,
    url text NOT NULL,
    "fileName" text,
    "fileSize" integer,
    "mimeType" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Attachment" OWNER TO unikorn_ir21_user;

--
-- Name: BlacklistedPasswordToken; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."BlacklistedPasswordToken" (
    id integer NOT NULL,
    jti text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."BlacklistedPasswordToken" OWNER TO unikorn_ir21_user;

--
-- Name: BlacklistedPasswordToken_id_seq; Type: SEQUENCE; Schema: public; Owner: unikorn_ir21_user
--

CREATE SEQUENCE public."BlacklistedPasswordToken_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."BlacklistedPasswordToken_id_seq" OWNER TO unikorn_ir21_user;

--
-- Name: BlacklistedPasswordToken_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: unikorn_ir21_user
--

ALTER SEQUENCE public."BlacklistedPasswordToken_id_seq" OWNED BY public."BlacklistedPasswordToken".id;


--
-- Name: BlockedUser; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."BlockedUser" (
    id text NOT NULL,
    "blockerId" text NOT NULL,
    "blockedId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."BlockedUser" OWNER TO unikorn_ir21_user;

--
-- Name: CalendlyIntegration; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."CalendlyIntegration" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "calendlyVisibility" public."VisibilityOption" DEFAULT 'PUBLIC'::public."VisibilityOption" NOT NULL,
    "allowedIndustries" text[],
    "minYearsOfOperation" integer,
    "allowedRoles" public."UserRole"[],
    "accessToken" text NOT NULL,
    "refreshToken" text NOT NULL,
    "tokenType" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    scope text NOT NULL,
    "calendlyUserURI" text NOT NULL,
    "calendlyOrgURI" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CalendlyIntegration" OWNER TO unikorn_ir21_user;

--
-- Name: CertificationsCourses; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."CertificationsCourses" (
    id text NOT NULL,
    title text NOT NULL,
    institution text NOT NULL,
    "completionDate" timestamp(3) without time zone NOT NULL,
    "focusArea" text NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."CertificationsCourses" OWNER TO unikorn_ir21_user;

--
-- Name: Chat; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Chat" (
    id text NOT NULL,
    "isGroupChat" boolean DEFAULT false NOT NULL,
    name text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Chat" OWNER TO unikorn_ir21_user;

--
-- Name: ChatParticipant; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."ChatParticipant" (
    id text NOT NULL,
    username text NOT NULL,
    "chatId" text NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL,
    "isFavorited" boolean DEFAULT false NOT NULL,
    "isMuted" boolean DEFAULT false NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "lastReadMessageId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."ChatParticipant" OWNER TO unikorn_ir21_user;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Comment" (
    id text NOT NULL,
    "authorId" text NOT NULL,
    "postId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Comment" OWNER TO unikorn_ir21_user;

--
-- Name: Company; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Company" (
    id text NOT NULL,
    name text NOT NULL,
    description character varying(600) NOT NULL,
    website text NOT NULL,
    founded timestamp(3) without time zone NOT NULL,
    type public."CompanyType" DEFAULT 'Public'::public."CompanyType" NOT NULL,
    "hqLocation" text NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    tier public."CompanyTier" DEFAULT 'Holder'::public."CompanyTier" NOT NULL,
    "companySize" text DEFAULT '1-50'::text NOT NULL,
    "socialMedia" jsonb,
    industry text[],
    "isInvestor" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Company" OWNER TO unikorn_ir21_user;

--
-- Name: CorporateExperience; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."CorporateExperience" (
    id text NOT NULL,
    "jobTitle" text NOT NULL,
    "companyName" text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    responsibilities text NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."CorporateExperience" OWNER TO unikorn_ir21_user;

--
-- Name: Document; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Document" (
    id text NOT NULL,
    title text NOT NULL,
    "fileUrl" text NOT NULL,
    "fileType" text NOT NULL,
    "postId" text NOT NULL
);


ALTER TABLE public."Document" OWNER TO unikorn_ir21_user;

--
-- Name: Education; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Education" (
    id text NOT NULL,
    degree public."Degree" DEFAULT 'NONE'::public."Degree" NOT NULL,
    institution text NOT NULL,
    "userId" text NOT NULL,
    "endDate" timestamp(3) without time zone,
    "fieldofStudy" text,
    "startDate" timestamp(3) without time zone
);


ALTER TABLE public."Education" OWNER TO unikorn_ir21_user;

--
-- Name: Entry; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Entry" (
    id text NOT NULL,
    "transactionId" text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text,
    amount numeric(65,30) NOT NULL,
    "entryType" public."EntryType" NOT NULL,
    "journalId" text NOT NULL,
    "ledgerId" text NOT NULL
);


ALTER TABLE public."Entry" OWNER TO unikorn_ir21_user;

--
-- Name: Event; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Event" (
    id text NOT NULL,
    title text NOT NULL,
    description character varying(3000) NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone,
    location text,
    "virtualLink" text,
    "isVirtual" boolean DEFAULT false NOT NULL,
    "postId" text NOT NULL
);


ALTER TABLE public."Event" OWNER TO unikorn_ir21_user;

--
-- Name: Expertise; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Expertise" (
    id text NOT NULL,
    field text NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."Expertise" OWNER TO unikorn_ir21_user;

--
-- Name: File; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."File" (
    id text NOT NULL,
    "fileName" text NOT NULL,
    "filePath" text NOT NULL,
    "fileType" text NOT NULL,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "accountId" text NOT NULL
);


ALTER TABLE public."File" OWNER TO unikorn_ir21_user;

--
-- Name: Financial; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Financial" (
    id text NOT NULL,
    valuation double precision NOT NULL,
    investors text[],
    "totalFundingAmount" double precision NOT NULL,
    "companyId" text NOT NULL
);


ALTER TABLE public."Financial" OWNER TO unikorn_ir21_user;

--
-- Name: Follow; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Follow" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "followerId" text,
    "followingId" text
);


ALTER TABLE public."Follow" OWNER TO unikorn_ir21_user;

--
-- Name: FriendRequest; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."FriendRequest" (
    id text NOT NULL,
    "senderId" text NOT NULL,
    "receiverId" text NOT NULL,
    status public."RequestStatus" DEFAULT 'PENDING'::public."RequestStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FriendRequest" OWNER TO unikorn_ir21_user;

--
-- Name: FundingRound; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."FundingRound" (
    id text NOT NULL,
    type text NOT NULL,
    "fundingAmount" double precision NOT NULL,
    "roundDate" timestamp(3) without time zone NOT NULL,
    "leadInvestors" text[],
    "financialId" text NOT NULL,
    "raisingFundsId" text
);


ALTER TABLE public."FundingRound" OWNER TO unikorn_ir21_user;

--
-- Name: Fundraiser; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Fundraiser" (
    id text NOT NULL,
    "investorType" public."InvestorType" NOT NULL,
    "investorUserId" text,
    "investorCompanyId" text,
    "raisingFundsId" text NOT NULL,
    "equityPercentage" double precision NOT NULL,
    "fundingAmount" double precision NOT NULL,
    portions integer NOT NULL,
    "pricePerPortion" double precision NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    status public."ContractStatus" DEFAULT 'Pending'::public."ContractStatus" NOT NULL,
    "envelopeId" text NOT NULL
);


ALTER TABLE public."Fundraiser" OWNER TO unikorn_ir21_user;

--
-- Name: Interest; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Interest" (
    id text NOT NULL,
    name text NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."Interest" OWNER TO unikorn_ir21_user;

--
-- Name: InvestmentOffer; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."InvestmentOffer" (
    id text NOT NULL,
    "investorType" public."InvestorType" NOT NULL,
    "investorUserId" text,
    "investorCompanyId" text,
    "raisingFundsId" text NOT NULL,
    portions integer NOT NULL,
    "offeredPricePerPortion" double precision NOT NULL,
    "totalOfferedPrice" double precision NOT NULL,
    status public."OfferStatus" DEFAULT 'Pending'::public."OfferStatus" NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."InvestmentOffer" OWNER TO unikorn_ir21_user;

--
-- Name: Journal; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Journal" (
    id text NOT NULL,
    name text NOT NULL,
    "flowType" public."FlowType" NOT NULL,
    "raisingFundsId" text
);


ALTER TABLE public."Journal" OWNER TO unikorn_ir21_user;

--
-- Name: Language; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Language" (
    id text NOT NULL,
    language text NOT NULL,
    proficiency public."LanguageProficiency" DEFAULT 'Beginner'::public."LanguageProficiency" NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."Language" OWNER TO unikorn_ir21_user;

--
-- Name: LedgerAccount; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."LedgerAccount" (
    id text NOT NULL,
    name text NOT NULL,
    "totalBalance" numeric(65,30) DEFAULT 0 NOT NULL,
    "accountId" text NOT NULL
);


ALTER TABLE public."LedgerAccount" OWNER TO unikorn_ir21_user;

--
-- Name: Like; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Like" (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "postId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Like" OWNER TO unikorn_ir21_user;

--
-- Name: LoginDevices; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."LoginDevices" (
    id text NOT NULL,
    ip text NOT NULL,
    browser text NOT NULL,
    os text NOT NULL,
    "accountId" text NOT NULL
);


ALTER TABLE public."LoginDevices" OWNER TO unikorn_ir21_user;

--
-- Name: Media; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Media" (
    id text NOT NULL,
    "postId" text NOT NULL,
    url text NOT NULL,
    "mimeType" text NOT NULL
);


ALTER TABLE public."Media" OWNER TO unikorn_ir21_user;

--
-- Name: Message; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "chatId" text NOT NULL,
    "senderId" text NOT NULL,
    content text,
    "isRequestMessage" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Message" OWNER TO unikorn_ir21_user;

--
-- Name: Personnel; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Personnel" (
    id text NOT NULL,
    name text NOT NULL,
    role public."CompanyPersonnel" NOT NULL,
    "crunchBaseLink" text NOT NULL,
    "companyId" text NOT NULL,
    "userId" text
);


ALTER TABLE public."Personnel" OWNER TO unikorn_ir21_user;

--
-- Name: Poll; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Poll" (
    id text NOT NULL,
    question text NOT NULL,
    "postId" text NOT NULL
);


ALTER TABLE public."Poll" OWNER TO unikorn_ir21_user;

--
-- Name: PollOption; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."PollOption" (
    id text NOT NULL,
    "pollId" text NOT NULL,
    text text NOT NULL
);


ALTER TABLE public."PollOption" OWNER TO unikorn_ir21_user;

--
-- Name: PollVote; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."PollVote" (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "optionId" text NOT NULL,
    "votedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "pollId" text NOT NULL
);


ALTER TABLE public."PollVote" OWNER TO unikorn_ir21_user;

--
-- Name: Post; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Post" (
    id text NOT NULL,
    "authorId" text NOT NULL,
    type public."PostType" NOT NULL,
    content character varying(3000),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "roundId" text
);


ALTER TABLE public."Post" OWNER TO unikorn_ir21_user;

--
-- Name: ProductInformation; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."ProductInformation" (
    id text NOT NULL,
    product text NOT NULL,
    market text NOT NULL,
    partnerships text[],
    "companyId" text NOT NULL
);


ALTER TABLE public."ProductInformation" OWNER TO unikorn_ir21_user;

--
-- Name: RaisingFunds; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."RaisingFunds" (
    id text NOT NULL,
    "equityPercentage" double precision NOT NULL,
    "fundingAmount" double precision NOT NULL,
    "pricePerPortion" double precision NOT NULL,
    "remainingPortions" integer DEFAULT 10 NOT NULL,
    "totalPortions" integer DEFAULT 10 NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    status public."ContractStatus" DEFAULT 'Pending'::public."ContractStatus" NOT NULL,
    "envelopeId" text NOT NULL,
    "companyId" text NOT NULL
);


ALTER TABLE public."RaisingFunds" OWNER TO unikorn_ir21_user;

--
-- Name: ReadReceipt; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."ReadReceipt" (
    id text NOT NULL,
    "messageId" text NOT NULL,
    username text NOT NULL,
    "readAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ReadReceipt" OWNER TO unikorn_ir21_user;

--
-- Name: RefreshTokenValid; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."RefreshTokenValid" (
    sid text NOT NULL,
    "profileId" text NOT NULL,
    ip text NOT NULL,
    browser text NOT NULL,
    os text NOT NULL,
    expire timestamp(3) without time zone NOT NULL,
    role public."Role" NOT NULL
);


ALTER TABLE public."RefreshTokenValid" OWNER TO unikorn_ir21_user;

--
-- Name: Report; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Report" (
    id text NOT NULL,
    "reporterId" text NOT NULL,
    "postId" text NOT NULL,
    reason public."ReportReason" NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Report" OWNER TO unikorn_ir21_user;

--
-- Name: ReportedUser; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."ReportedUser" (
    id text NOT NULL,
    "reporterId" text NOT NULL,
    "reportedId" text NOT NULL,
    reason text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ReportedUser" OWNER TO unikorn_ir21_user;

--
-- Name: Repost; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Repost" (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "postId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Repost" OWNER TO unikorn_ir21_user;

--
-- Name: SocialMedia; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."SocialMedia" (
    id text NOT NULL,
    platform public."SocialMediaPlatforms" DEFAULT 'X'::public."SocialMediaPlatforms" NOT NULL,
    url text NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."SocialMedia" OWNER TO unikorn_ir21_user;

--
-- Name: StartupExperience; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."StartupExperience" (
    id text NOT NULL,
    "startupName" text NOT NULL,
    role text NOT NULL,
    description character varying(500) NOT NULL,
    "userId" text NOT NULL,
    "endDate" timestamp(3) without time zone,
    "startDate" timestamp(3) without time zone
);


ALTER TABLE public."StartupExperience" OWNER TO unikorn_ir21_user;

--
-- Name: TokenBlacklist; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."TokenBlacklist" (
    token text NOT NULL,
    expire timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TokenBlacklist" OWNER TO unikorn_ir21_user;

--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Transaction" (
    id text NOT NULL,
    "transactionType" public."TransactionType" NOT NULL,
    amount numeric(65,30) NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text NOT NULL,
    "accountId" text NOT NULL
);


ALTER TABLE public."Transaction" OWNER TO unikorn_ir21_user;

--
-- Name: User; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    description character varying(601) NOT NULL,
    title public."Title" DEFAULT 'Mr'::public."Title" NOT NULL,
    tier public."Tier" DEFAULT 'Standard'::public."Tier" NOT NULL,
    "isInvestor" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."User" OWNER TO unikorn_ir21_user;

--
-- Name: Wallet; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public."Wallet" (
    id text NOT NULL,
    amount numeric(65,30) DEFAULT 0.0 NOT NULL,
    "onHold" numeric(65,30) DEFAULT 0.0 NOT NULL,
    "accountId" text NOT NULL
);


ALTER TABLE public."Wallet" OWNER TO unikorn_ir21_user;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: unikorn_ir21_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO unikorn_ir21_user;

--
-- Name: BlacklistedPasswordToken id; Type: DEFAULT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."BlacklistedPasswordToken" ALTER COLUMN id SET DEFAULT nextval('public."BlacklistedPasswordToken_id_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Account" (id, username, email, password, "mobileNumber", "emailVerified", role, "googleId") FROM stdin;
fdc3e205-6f5f-4a23-a7e6-0cfc5576106d	seiff	seifrefaat23@gmail.com	$2b$10$9sUB7dLe1yokGKEMuNywFuBy8gnpaQ0f9H7rcvxmfMvsXDIg2Nb.u	11234864645	t	User	\N
4f4a03de-b77d-4ef6-8870-91e031c9794b	unikorn	hazem.sherif248@gmail.com	$2b$10$9uZeExoJPTQ.EsJCKTBaKeF0b/.1ICyNWza72LypPqieChrS7LSDK	11231231231	t	Company	\N
d00aab62-c7fa-4ddb-b089-cf3314103079	hazem	hazem@gmail.com	$2b$10$Dn00/1VPY33PAZSEV/ds6ebDd13a9BiEC7dGjxxKN20O9kwefWf.K	11212121221	t	User	\N
104882528212962824733	omar.eid1	omareid.co@gmail.com		\N	f	User	\N
37e4a3cf-a4ed-4de7-a70e-56162f5d2f96	omareid12	omareid1995@gmail.com	$2b$10$HvYNSgEGcJ/3OEfG7wzxvOCkTxJw1luIOg8BIcc/34HQCpYuCs.wC	11100214324	t	User	\N
5d146ae1-4011-4e30-9903-83f7b77f9e65	unikorn2	unikorn2@gmail.com	$2b$10$jSkgpPqjcqLtmcoKetXFzOO/M8Bl5TDdUOTGtVd8mqN6mITunWSCW	11212121212	t	Company	\N
82e393ec-6cce-421a-9ca7-7e8886b20072	ribby	ribbystore.official@gmail.com	$2b$10$Z2CQtrI8Bku.WkUw5/z75eSqKZm8gZFBzGoUW2Lj3mQZuXUuYEsyu	11002024505	t	Company	\N
1e764457-d773-4678-b8b4-b2bec770cff8	yahia	geye616@gmail.com	$2b$10$93uFDfOkBlGXa0K/VlPktulwfMb96MOrBuawrKHiQxbCWwsFuwNnC	201156505936	t	User	116429785099233586750
dbbadcf2-15ab-401b-963f-2de15c435223	testbug	testbug6@gmail.com	$2b$10$GubsjoE5ehId3m.Iz67iCe9W6Jzc3khDN8Fv5gnF.aCAXGLCQ77bu	\N	t	User	\N
29a03804-7b61-4cd0-bc80-227c883938b3	testbug121	testbug121@gmail.com	$2b$10$tDg4m.mm.Ev12OBkdTfpxOUp/Y7ObT.ilwTHx5sVyfIHrbWSegGHG	\N	f	Company	\N
8915c4c2-aaea-48b7-8d06-a4cfae44e405	landingPageTest1	landingPageTest1@gmail.com	$2b$10$oYyFmkZKahSuN/lim4jo5uizVUxq6KfnBRwNX2pyZNcGijOWx1yaO	\N	f	User	\N
c0de3210-92ba-4e15-98da-138a7b63593f	ttest	testbug1211@gmail.com	$2b$10$hmeC5AhoyW7AxL2hPfzzHeOH6x30ghJF0Nti2yGYCSmovwZ4aOKJS	\N	f	Company	\N
2ba0a40f-4bf0-4f34-abf8-14867575122c	testbug1211	testbug12111@gmail.com	$2b$10$wX6Q5mjF46DobX.l98c/3ugVdWNwXnmLJz5yiL/aUxH6yfQf57TCe	\N	f	Company	\N
749ad485-f0f7-4f8b-800a-cc789bd99145	Test1	Test@gmail.com	$2b$10$QT5wb.q7SKGM/jAxVnQNL.KCZKxBD3PzKOIs1ZBemXmjhhmrKKtX6	\N	f	User	\N
84526fc6-4d42-4db8-be8c-e8557626cf0e	landingpagetest	landingPageTest11@gmail.com	$2b$10$xvSQXxcG0mIAyPuJhwAZP.DdhFmateyFwfO1e.jicOFKF2RqfW4ey	\N	f	User	\N
4231c0c0-f885-4c12-b86d-ab94e8873264	ttest1	test11bug121@gmail.com	$2b$10$ogEF/YLaQ.zFNWEzo2zNNePCUSZ9vcr2sPmbFfXl/mBBUQ6eE0GZS	\N	f	Company	\N
93b7ce6b-0cf5-4ce5-adf2-e2bdd0805add	landingPage	landingPageTest111@gmail.com	$2b$10$E6LYzOUcn25FdrOBVf/jyO6j6y43NCKOG7g5lPtjHzv9EqFxmPQL2	\N	f	User	\N
891b3b44-bc82-4318-9ce1-d1a2e71c74ff	hazem1	haze1m@gmail.com	$2b$10$vUqap2pbUGOPZ8ferGe27uyfURhZBTagMnTBTbM9On0Zaab39vm2G	\N	f	User	\N
00dc7237-4101-4b02-ab98-666f14f470d3	hazem2	hazem.sh2002@hotmail.com	$2b$10$EBXZWDuQVoYUJvJN2Ikec.G4T7Mt.Uw7HxYSmEA0qdWiQGyyQLQdm	\N	f	User	\N
fa21cbc0-9e0d-48fc-9397-489f8ac6cd89	launch1	launch1@gmail.com	$2b$10$aVnrVLBnzucAUL7lmU0WLOkwrVwQLXcR1iFRdvQ1kTv5Ae3S2CBW6	\N	f	User	\N
540da992-d325-45af-8389-a39a274f0a62	Lollipop	lol@gmail.com	$2b$10$9u8UqN9qvEYBh9Jr/z0.sOG1SHEwIV9rsqLc/btOGqwVdbDQogwEC	\N	f	User	\N
e2545be9-ba82-493f-995c-35fd623c0023	unikorn145	unikotn@gmail.com	$2b$10$9yrIuiW2UoKI7xOz5XcB8OUe/BoP3QhdgMi3qHiRfY0j1n.Lh5X1K	\N	f	User	\N
f428572f-845b-4ccc-8c97-8005d78bfa06	testbug1521	testbug1521@gmail.com	$2b$10$MqE3iZ24mnRf7S/9y67OtO7HUohu1SyGqGw8JDq/tvg1qP3B5j3Qq	\N	f	Company	\N
737e7c84-1552-499f-a441-6ad567fb9702	unikorn1451	unikotn1@gmail.com	$2b$10$yLFJKFj/oZcVK4GCHlbA/.K/Uu5RKtiancYl8.7kUPvFggEDy1o0O	\N	f	User	\N
b50b3ea0-4334-48d1-af1a-4f15f676053a	testbug15211	testbug15121@gmail.com	$2b$10$XGKTynIQUio97FQU9aeTiuYgv/FpUCm13y61yus2owoTSK4wnnUY.	\N	f	Company	\N
fbd660c7-70b4-49ea-aaf5-2ed5a1fd1509	omar.eid	omareid19956@gmail.com	$2b$10$OsvcPpgnJ0uAFlx0S09AU.bjKcH6R4Jm1K3XoZjJStvmBdBGPJBg2	\N	f	User	\N
\.


--
-- Data for Name: Activity; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Activity" (id, title, description, "companyId") FROM stdin;
\.


--
-- Data for Name: Attachment; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Attachment" (id, "messageId", type, url, "fileName", "fileSize", "mimeType", "createdAt") FROM stdin;
\.


--
-- Data for Name: BlacklistedPasswordToken; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."BlacklistedPasswordToken" (id, jti, "expiresAt", "createdAt") FROM stdin;
1	503422b66785abd66d98d5c861abf43b0733302813a9a0d93964a3bb17e67cfe	2025-04-22 19:35:30	2025-04-22 18:35:55.747
2	23dd50d529d1ecad6725defb77ef6f2ce76d5404a579b7df2948e47d7b6b1560	2025-05-25 16:38:47	2025-05-25 15:39:27.149
3	d06f7c6aad2bbbafdbf0552e83a3c547389bc3473cdf21f5f4300d655a6131e5	2025-05-26 13:15:23	2025-05-26 12:18:05.408
4	0c76f6f53675d840e67cb23fd2e2f8d03d77b186d3f816f2bc80d4d76e28b99c	2025-05-28 23:13:23	2025-05-28 22:14:00.611
5	56ea11d4e74cbe84365e57056a3dfe9a8e560003614d80b1986dc7be35d78362	2025-06-23 20:08:32	2025-06-23 19:13:24.037
\.


--
-- Data for Name: BlockedUser; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."BlockedUser" (id, "blockerId", "blockedId", "createdAt") FROM stdin;
\.


--
-- Data for Name: CalendlyIntegration; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."CalendlyIntegration" (id, "userId", "calendlyVisibility", "allowedIndustries", "minYearsOfOperation", "allowedRoles", "accessToken", "refreshToken", "tokenType", "expiresAt", scope, "calendlyUserURI", "calendlyOrgURI", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CertificationsCourses; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."CertificationsCourses" (id, title, institution, "completionDate", "focusArea", "userId") FROM stdin;
1500e793-7b85-4530-8c77-45fdfefd7df4	API	Meta	2022-01-01 00:00:00	API	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
\.


--
-- Data for Name: Chat; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Chat" (id, "isGroupChat", name, "createdAt", "updatedAt") FROM stdin;
059e863a-eabc-41b4-8326-d1209154808c	f	chat	2025-04-22 18:38:21.064	2025-04-22 18:38:21.064
82c22c53-b8a9-4244-b169-6bf135dc005a	f	chat	2025-04-29 03:37:53.385	2025-04-29 03:37:53.385
\.


--
-- Data for Name: ChatParticipant; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."ChatParticipant" (id, username, "chatId", "isAdmin", "isFavorited", "isMuted", "isArchived", "lastReadMessageId", "createdAt", "updatedAt", "deletedAt") FROM stdin;
0d9ca6e5-768d-4f3b-8ad9-9abab4461529	yahia	059e863a-eabc-41b4-8326-d1209154808c	f	f	f	f	2e5e1910-8817-4bd0-8fa0-10e714231f58	2025-04-22 18:38:21.064	2025-05-11 18:16:35.661	\N
c407d80d-235f-43dd-bdef-cfb6101a6a2a	hazem	82c22c53-b8a9-4244-b169-6bf135dc005a	f	f	f	f	ed721af0-83a4-441a-b4f7-b9961747f864	2025-04-29 03:37:53.385	2025-05-11 18:16:54.869	\N
98ea4dc4-5ec7-41a7-913a-4e82f2deff66	seiff	82c22c53-b8a9-4244-b169-6bf135dc005a	t	f	f	f	24cee01b-f684-41e5-8851-44a00d9e127d	2025-04-29 03:37:53.385	2025-05-11 18:20:52.924	2025-05-11 18:17:21.537
de3d1c17-821a-46a7-857e-fc5209fd234d	seiff	059e863a-eabc-41b4-8326-d1209154808c	t	f	f	f	2e5e1910-8817-4bd0-8fa0-10e714231f58	2025-04-22 18:38:21.064	2025-05-11 19:30:11.587	\N
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Comment" (id, "authorId", "postId", content, "createdAt") FROM stdin;
9aae63dd-cf9a-4a92-815c-5d2e8f4a4ee8	1e764457-d773-4678-b8b4-b2bec770cff8	8f9eba07-2a23-4b0b-8d96-73042df226f5	dd	2025-05-21 16:56:36.557
d3f1eb81-f483-4840-8af4-1f10209d3960	1e764457-d773-4678-b8b4-b2bec770cff8	0ae0cb8e-a3a5-4278-970e-e603cd37ad9b	hate that guy\n	2025-05-21 17:00:01.053
302a1712-b9a0-4767-9ec2-b05c29189a0c	4f4a03de-b77d-4ef6-8870-91e031c9794b	8f9eba07-2a23-4b0b-8d96-73042df226f5	unikorn comment\n	2025-05-25 17:16:04.09
\.


--
-- Data for Name: Company; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Company" (id, name, description, website, founded, type, "hqLocation", verified, tier, "companySize", "socialMedia", industry, "isInvestor") FROM stdin;
5d146ae1-4011-4e30-9903-83f7b77f9e65	unikorn2		https://www.unikorn.com	2005-06-15 00:00:00	Public	Cairo	f	Holder	1-50	\N	{Solutions}	f
82e393ec-6cce-421a-9ca7-7e8886b20072	Ribby	This is a company that sells XYZ	https://www.ribby-flask.com	2025-05-01 00:00:00	Profit	Cairo, Egypt	f	Holder	1-50	\N	{"Sector Agnostic"}	f
4f4a03de-b77d-4ef6-8870-91e031c9794b	unikorn	Website owner description here Website owner description here Website owner description hereaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa       bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb	http://localhost:3000/website	2025-02-01 00:00:00	Public	Home	f	Hunter	1000+	{"facebook": "www.facebook.com"}	{"Smart Phones",Shoes,Cars,PS5}	f
29a03804-7b61-4cd0-bc80-227c883938b3	testBug121	testBug12	https://www.unikorn.com/	2025-05-15 00:00:00	Public	London	f	Holder	1-50	\N	{Software}	f
4231c0c0-f885-4c12-b86d-ab94e8873264	testBug121	testBug121	https://www.unikorn.com/	2025-06-05 00:00:00	Profit	London	f	Holder	1-50	\N	{Software}	t
f428572f-845b-4ccc-8c97-8005d78bfa06	testBug152111			2025-07-03 00:00:00	Profit	London	f	Holder	1-50	{"LinkedIn": "https://www.linkedin.com/company/siemens/"}	{Software}	f
b50b3ea0-4334-48d1-af1a-4f15f676053a	testBug1521111			2025-07-03 00:00:00	Profit	London	f	Holder	1-50	null	{Software}	f
\.


--
-- Data for Name: CorporateExperience; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."CorporateExperience" (id, "jobTitle", "companyName", "startDate", "endDate", responsibilities, "userId") FROM stdin;
034c61bf-085b-4a09-8656-590d5a40c91c	Product Manager	Siemens EDA	2024-08-01 00:00:00	2025-04-10 00:00:00	Mixed Signal Simulator Product Manager	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
ee87a8df-ff33-4d43-b707-32007d939388	Product Engineer	Siemens EDA	2022-02-01 00:00:00	2024-08-01 00:00:00		37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
bbc4d361-77d3-41cd-af9b-ba0b586cf5ec	intern	Google	2025-05-01 00:00:00	2025-05-31 00:00:00		d00aab62-c7fa-4ddb-b089-cf3314103079
\.


--
-- Data for Name: Document; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Document" (id, title, "fileUrl", "fileType", "postId") FROM stdin;
\.


--
-- Data for Name: Education; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Education" (id, degree, institution, "userId", "endDate", "fieldofStudy", "startDate") FROM stdin;
8608e9b4-284d-448a-973e-f883d587145a	BSc	German University in Cairo	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96	\N	\N	\N
c65fdf18-9d5d-4de4-b50f-2d31f8524a45	MSc	German University in Cairo	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96	\N	\N	\N
622589db-f305-45fc-8e4a-c344c886bb39	BSc	GUC	d00aab62-c7fa-4ddb-b089-cf3314103079	2025-05-31 00:00:00	Engineering	2025-05-01 00:00:00
\.


--
-- Data for Name: Entry; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Entry" (id, "transactionId", date, description, amount, "entryType", "journalId", "ledgerId") FROM stdin;
\.


--
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Event" (id, title, description, "startTime", "endTime", location, "virtualLink", "isVirtual", "postId") FROM stdin;
59eba8f7-3afc-4ede-ae75-6f6972da749c	Meeting	Meeting With Myself	2025-05-28 22:26:00	2025-05-29 22:26:00	\N	https://google.meet	t	6eab5129-dc6e-40a6-af57-a2ab959690fb
e12ab2d4-c46b-4770-90be-055c978b534b	lfkgnlkf	skfnsdfvbvbv	2025-05-29 17:20:00	2025-05-31 17:20:00	n kgjdgfdg	\N	f	cd62465b-7902-4277-a8a9-919c8f753cf9
\.


--
-- Data for Name: Expertise; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Expertise" (id, field, "userId") FROM stdin;
08a8d002-8da6-461d-a726-4c154a854571	Java	d00aab62-c7fa-4ddb-b089-cf3314103079
da9955a0-e44f-4f2d-ba77-cb4a203a2e11	Product Management	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
2a427080-6905-4afc-8577-2d79c524ac6c	Problem Solving	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
4a80e7c9-fa10-4888-87f5-7c162c330799	Software Development	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
\.


--
-- Data for Name: File; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."File" (id, "fileName", "filePath", "fileType", "uploadedAt", "accountId") FROM stdin;
5c5fa5fb-0aa2-46f5-83e0-5ef3d6822d5b	chat_1746315231161.pdf	user\\fdc3e205-6f5f-4a23-a7e6-0cfc5576106d\\chat_1746315231161.pdf.pdf	application/pdf	2025-05-03 23:33:51.2	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
24593a62-fb14-418e-b0b5-3d8d1bce4407	chat_1746315359012.pdf	user\\fdc3e205-6f5f-4a23-a7e6-0cfc5576106d\\chat_1746315359012.pdf.pdf	application/pdf	2025-05-03 23:35:59.055	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
cbf3ed42-5871-40d6-bd2e-25c02bdf2ea1	chat_1746315867916.pdf	user\\fdc3e205-6f5f-4a23-a7e6-0cfc5576106d\\chat_1746315867916.pdf.pdf	application/pdf	2025-05-03 23:44:27.958	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
c1e31be1-51c8-42d3-8b80-3f3ef86d6a7f	chat_1746315930210.jpg	user\\fdc3e205-6f5f-4a23-a7e6-0cfc5576106d\\chat_1746315930210.jpg.jpeg	image/jpeg	2025-05-03 23:45:30.224	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
5efc5719-b95e-440d-9297-5cf48d34606d	chat_1746315952063.docx	user\\fdc3e205-6f5f-4a23-a7e6-0cfc5576106d\\chat_1746315952063.docx.vnd.openxmlformats-officedocument.wordprocessingml.document	application/vnd.openxmlformats-officedocument.wordprocessingml.document	2025-05-03 23:45:52.073	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
6953ef0a-edbc-4142-b110-cf2e6ef895bd	chat_1746315974463.docx	user\\fdc3e205-6f5f-4a23-a7e6-0cfc5576106d\\chat_1746315974463.docx.vnd.openxmlformats-officedocument.wordprocessingml.document	application/vnd.openxmlformats-officedocument.wordprocessingml.document	2025-05-03 23:46:14.472	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
57a75163-96eb-409f-bbf8-a92d86b3010b	chat_1746376833013.pdf	user\\1e764457-d773-4678-b8b4-b2bec770cff8\\chat_1746376833013.pdf.pdf	application/pdf	2025-05-04 16:40:33.042	1e764457-d773-4678-b8b4-b2bec770cff8
274a5ee7-6ab1-4b8c-ab19-06912bfd9533	chat_1746378512994.png	user\\1e764457-d773-4678-b8b4-b2bec770cff8\\chat_1746378512994.png.png	image/png	2025-05-04 17:08:33.048	1e764457-d773-4678-b8b4-b2bec770cff8
2e315599-6852-4247-9607-3ba7be7d6ed2	chat_1746379377186.pdf	user\\fdc3e205-6f5f-4a23-a7e6-0cfc5576106d\\chat_1746379377186.pdf.pdf	application/pdf	2025-05-04 17:22:57.234	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
3fe5a74b-71b4-4dd7-be55-4010893bb784	chat_1746379412344.docx	user\\fdc3e205-6f5f-4a23-a7e6-0cfc5576106d\\chat_1746379412344.docx.vnd.openxmlformats-officedocument.wordprocessingml.document	application/vnd.openxmlformats-officedocument.wordprocessingml.document	2025-05-04 17:23:32.376	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
c5312b6e-41c1-49d1-9580-20f77d738d0b	chat_1746379605919.pdf	user\\fdc3e205-6f5f-4a23-a7e6-0cfc5576106d\\chat_1746379605919.pdf.pdf	application/pdf	2025-05-04 17:26:45.956	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
cf04c5b0-66d0-4871-baea-4765482ec176	chat_1746379641029.jpg	user\\fdc3e205-6f5f-4a23-a7e6-0cfc5576106d\\chat_1746379641029.jpg.jpeg	image/jpeg	2025-05-04 17:27:21.04	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
2811447d-56f2-448b-ab4d-c7c4b676bb7b	chat_1746379709561.png	user\\fdc3e205-6f5f-4a23-a7e6-0cfc5576106d\\chat_1746379709561.png.png	image/png	2025-05-04 17:28:29.57	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
5899b310-72d3-4da1-a601-50b2b2d8d210	chat_1746379731115.pdf	user\\fdc3e205-6f5f-4a23-a7e6-0cfc5576106d\\chat_1746379731115.pdf.pdf	application/pdf	2025-05-04 17:28:51.142	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
803f0393-9c57-4c5b-9cf0-daf4f1a51754	chat_1746379751943.zip	user\\fdc3e205-6f5f-4a23-a7e6-0cfc5576106d\\chat_1746379751943.zip.x-zip-compressed	application/x-zip-compressed	2025-05-04 17:29:11.955	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
fafeb2a7-f5f1-4cca-bedd-bdbb7022c939	chat_1746379766399.mpp	user\\fdc3e205-6f5f-4a23-a7e6-0cfc5576106d\\chat_1746379766399.mpp.vnd.ms-project	application/vnd.ms-project	2025-05-04 17:29:26.409	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
57c47fc1-84f6-4031-954e-6730523afa47	profile_picture	user\\d00aab62-c7fa-4ddb-b089-cf3314103079\\profile\\profile_picture.png	image/png	2025-05-10 21:45:33.077	d00aab62-c7fa-4ddb-b089-cf3314103079
dbdd7f06-e48e-4367-9270-fe21908833d3	cover_picture	company\\4f4a03de-b77d-4ef6-8870-91e031c9794b\\profile\\cover_picture.jpeg	image/jpeg	2025-05-25 17:06:49.801	4f4a03de-b77d-4ef6-8870-91e031c9794b
f4346988-ad72-4bac-b40e-86ba826c65c9	profile_picture	user\\37e4a3cf-a4ed-4de7-a70e-56162f5d2f96\\profile\\profile_picture.png	image/png	2025-05-26 11:15:43.778	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
9bea0607-8f20-4346-9d8b-274894f81863	profile_picture	company\\82e393ec-6cce-421a-9ca7-7e8886b20072\\profile\\profile_picture.png	image/png	2025-05-26 12:27:46.919	82e393ec-6cce-421a-9ca7-7e8886b20072
157cb201-9b10-4093-ba3c-55073092fc5a	cover_picture	user\\37e4a3cf-a4ed-4de7-a70e-56162f5d2f96\\profile\\cover_picture.jpeg	image/jpeg	2025-05-26 12:29:09.05	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
5c34ff4b-3338-430f-9848-ad245ec31773	cover_picture	company\\82e393ec-6cce-421a-9ca7-7e8886b20072\\profile\\cover_picture.png	image/png	2025-05-26 12:29:58.273	82e393ec-6cce-421a-9ca7-7e8886b20072
\.


--
-- Data for Name: Financial; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Financial" (id, valuation, investors, "totalFundingAmount", "companyId") FROM stdin;
0b556125-e143-4db1-bb52-c5fa43920821	0	{}	155471	4f4a03de-b77d-4ef6-8870-91e031c9794b
cd056496-8aa9-467d-8a67-6d6b5ec70ce7	0	{}	2000	82e393ec-6cce-421a-9ca7-7e8886b20072
\.


--
-- Data for Name: Follow; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Follow" (id, "createdAt", "followerId", "followingId") FROM stdin;
62528a96-c9bb-436a-894d-52fdd8416384	2025-04-22 18:37:14.819	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d	1e764457-d773-4678-b8b4-b2bec770cff8
04a757ba-00a4-4472-8840-19377bb84976	2025-04-29 03:37:42.837	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d	d00aab62-c7fa-4ddb-b089-cf3314103079
\.


--
-- Data for Name: FriendRequest; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."FriendRequest" (id, "senderId", "receiverId", status, "createdAt", "updatedAt") FROM stdin;
8ee9ebdc-1418-4148-a142-d36724c490ba	seiff	yahia	PENDING	2025-04-28 22:34:32.821	2025-04-28 22:34:32.821
ac7f2320-5fe8-46bb-8b8a-78c6f0293e7f	hazem	seiff	PENDING	2025-04-29 03:38:51.889	2025-04-29 03:38:51.889
\.


--
-- Data for Name: FundingRound; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."FundingRound" (id, type, "fundingAmount", "roundDate", "leadInvestors", "financialId", "raisingFundsId") FROM stdin;
8fac6ad8-14e4-4751-8d74-bc648f26940f	Series B	55260	2025-04-30 00:00:00	{hazem,mohamed}	0b556125-e143-4db1-bb52-c5fa43920821	\N
c9775d4e-c8bb-4f3d-99af-8801386670c1	Series D	75111	2025-05-11 00:00:00	{yahia,kotz}	0b556125-e143-4db1-bb52-c5fa43920821	\N
466a410e-b714-4ab7-9aa8-227507b0378c	Seed	7000	2025-05-01 00:00:00	{}	0b556125-e143-4db1-bb52-c5fa43920821	\N
f2d5ee97-228d-4ee7-9d74-3d1cb3faa0fe	IPO	8000	2025-05-02 00:00:00	{Abdo,Hazem}	0b556125-e143-4db1-bb52-c5fa43920821	\N
bd162e86-a55f-48cc-b492-d8aa25528b43	Series C	100	2025-05-11 00:00:00	{Abdo}	0b556125-e143-4db1-bb52-c5fa43920821	\N
a219a3f1-d206-42b7-a55f-3f79beb309a3	Seed	10000	1970-01-01 00:00:00	{hazem}	0b556125-e143-4db1-bb52-c5fa43920821	dc1a593b-803b-4074-8d99-53441a0a13e4
12d058be-3104-49af-a0ef-bc0ad89bfa0f	Seed	2000	2025-02-01 00:00:00	{"Omar Eid"}	cd056496-8aa9-467d-8a67-6d6b5ec70ce7	\N
\.


--
-- Data for Name: Fundraiser; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Fundraiser" (id, "investorType", "investorUserId", "investorCompanyId", "raisingFundsId", "equityPercentage", "fundingAmount", portions, "pricePerPortion", date, status, "envelopeId") FROM stdin;
c23cf23c-9bc0-4baa-8ab6-945e2025d820	User	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96	\N	3ed70089-6f91-4878-a3b7-7c521a17d936	50	4000	10	400	2025-05-26 13:26:14.107	Completed	
2a42cd68-191a-406e-bff6-12e22eb2dd29	User	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96	\N	dc1a593b-803b-4074-8d99-53441a0a13e4	1	1000	1	1000	2025-05-26 12:11:13.142	Completed	
497f9cbc-47b3-4882-bd1b-ca855d49d087	Company	\N	82e393ec-6cce-421a-9ca7-7e8886b20072	dc1a593b-803b-4074-8d99-53441a0a13e4	9	9000	9	1000	2025-05-26 13:19:56.439	Completed	
ffcc7676-d7ca-46e7-a282-4d0ae8b7cf32	User	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d	\N	dc1a593b-803b-4074-8d99-53441a0a13e4	5	5000	5	1000	2025-06-30 22:11:00.19	Pending	
\.


--
-- Data for Name: Interest; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Interest" (id, name, "userId") FROM stdin;
c7e8de96-dccf-4504-bddd-2d9fa208baa8	Coding	d00aab62-c7fa-4ddb-b089-cf3314103079
d8fd66a9-da5a-4797-bfc6-5cecdc4fe0c1	AI	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
de6eea89-303a-4d70-a911-1aa057c7624c	Entrepreneurship	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
d6e01dc8-2889-4083-89b0-3c875efac30e	Product Management	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
\.


--
-- Data for Name: InvestmentOffer; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."InvestmentOffer" (id, "investorType", "investorUserId", "investorCompanyId", "raisingFundsId", portions, "offeredPricePerPortion", "totalOfferedPrice", status, date) FROM stdin;
\.


--
-- Data for Name: Journal; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Journal" (id, name, "flowType", "raisingFundsId") FROM stdin;
\.


--
-- Data for Name: Language; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Language" (id, language, proficiency, "userId") FROM stdin;
02bd1a27-d2bf-44ba-bdd2-cabd669f8ee7	English	Intermediate	d00aab62-c7fa-4ddb-b089-cf3314103079
80b7d724-0917-4b42-836a-a623ec908a66	English	Proficient	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
9ceb3947-03c6-4cbf-97c2-0935206a457d	Arabic	Proficient	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
\.


--
-- Data for Name: LedgerAccount; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."LedgerAccount" (id, name, "totalBalance", "accountId") FROM stdin;
15e74831-b555-4057-8264-6beeee7e441e	seif	0.000000000000000000000000000000	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
d375a4d4-38f0-4579-b33e-730b3565eee8	yahia	0.000000000000000000000000000000	1e764457-d773-4678-b8b4-b2bec770cff8
0e4adcf5-bc31-4714-965e-63be6f084ccb	unikorn	0.000000000000000000000000000000	4f4a03de-b77d-4ef6-8870-91e031c9794b
7487b6e3-56c6-42c9-b908-bd1d83a3083a	hazem	0.000000000000000000000000000000	d00aab62-c7fa-4ddb-b089-cf3314103079
c31d72d9-132f-4027-9cc2-55792fbc7a97	Omar Eid	0.000000000000000000000000000000	104882528212962824733
2a818856-c6e6-4cd8-bb5a-847295c0b30c	Omar Eid	0.000000000000000000000000000000	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
7be2d43b-a8a5-4c54-9c59-db0b8cac3e48	unikorn2	0.000000000000000000000000000000	5d146ae1-4011-4e30-9903-83f7b77f9e65
5a77b05c-7159-494f-8d7e-33afbfea913f	Ribby	0.000000000000000000000000000000	82e393ec-6cce-421a-9ca7-7e8886b20072
d140648e-faa6-4e43-b6ec-e1887e75de8c	testbug6	0.000000000000000000000000000000	dbbadcf2-15ab-401b-963f-2de15c435223
3d7571e7-03d0-4410-84c3-355e7dcae640	testBug121	0.000000000000000000000000000000	29a03804-7b61-4cd0-bc80-227c883938b3
482d9d2f-d25e-48f7-810c-abce8c35a8fe	landingPageTest1	0.000000000000000000000000000000	8915c4c2-aaea-48b7-8d06-a4cfae44e405
e016d76f-3cda-4aff-956a-891caa11c85d	testBug121	0.000000000000000000000000000000	c0de3210-92ba-4e15-98da-138a7b63593f
08a086aa-c7bc-45fa-8f6b-c0e8f76f663f	testBug1211	0.000000000000000000000000000000	2ba0a40f-4bf0-4f34-abf8-14867575122c
e5ff4852-38b0-4744-b36a-eaa96a74e12b	Test	0.000000000000000000000000000000	749ad485-f0f7-4f8b-800a-cc789bd99145
a06b7759-6280-4f26-8cc5-2e30cac878d1	landingPageTest1	0.000000000000000000000000000000	84526fc6-4d42-4db8-be8c-e8557626cf0e
2f7473c6-5ab4-411a-890c-28e4d7db8e72	testBug121	0.000000000000000000000000000000	4231c0c0-f885-4c12-b86d-ab94e8873264
5f1b5a8c-19b8-4808-a590-5b3f9130a5b4	landingPageTest1	0.000000000000000000000000000000	93b7ce6b-0cf5-4ce5-adf2-e2bdd0805add
f083ada1-e32c-48f2-8a40-a66c136d2a8b	hazem	0.000000000000000000000000000000	891b3b44-bc82-4318-9ce1-d1a2e71c74ff
116d4401-7851-471a-8bbc-7525b64d78d6	hazem2	0.000000000000000000000000000000	00dc7237-4101-4b02-ab98-666f14f470d3
1bac0617-3995-487c-b2be-0b345f2ac218	Launch1	0.000000000000000000000000000000	fa21cbc0-9e0d-48fc-9397-489f8ac6cd89
94375da1-ef35-497a-a5d8-7bf2d47d0eb7	Lol	0.000000000000000000000000000000	540da992-d325-45af-8389-a39a274f0a62
922a4581-fe65-4425-8ca2-233cb27377e6	Unikorn	0.000000000000000000000000000000	e2545be9-ba82-493f-995c-35fd623c0023
ae7e02df-df5d-40b6-82fb-7c27f43301d2	testBug152111	0.000000000000000000000000000000	f428572f-845b-4ccc-8c97-8005d78bfa06
44e13d55-7f7b-4b92-85db-2fae70435f78	Unikorn1	0.000000000000000000000000000000	737e7c84-1552-499f-a441-6ad567fb9702
7f4ef7da-bf6a-4b42-927d-ad95d2ddd1a8	testBug1521111	0.000000000000000000000000000000	b50b3ea0-4334-48d1-af1a-4f15f676053a
de65b9cc-1270-420a-8f4c-da6ad015ae9f	Omar Eid	0.000000000000000000000000000000	fbd660c7-70b4-49ea-aaf5-2ed5a1fd1509
\.


--
-- Data for Name: Like; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Like" (id, "accountId", "postId", "createdAt") FROM stdin;
\.


--
-- Data for Name: LoginDevices; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."LoginDevices" (id, ip, browser, os, "accountId") FROM stdin;
b0157aed-5c0a-4c55-a503-e45fa4913cf5	::1	Edge	Windows	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
15596fcd-0251-4349-b863-d75b761b642a	::1	Edge	Windows	1e764457-d773-4678-b8b4-b2bec770cff8
c39702ad-14f6-43b0-8176-178cbca509b2	::1	Chrome	Windows	4f4a03de-b77d-4ef6-8870-91e031c9794b
67d4647f-d0a5-42d2-bada-0559594cad17	::1	Edge	Windows	d00aab62-c7fa-4ddb-b089-cf3314103079
7c90e50f-33e2-4433-ae6e-1a2ed4524673	::1	Chrome	Windows	d00aab62-c7fa-4ddb-b089-cf3314103079
a0d78ba7-462a-4801-8a96-7c479d46a147	::1	Chrome	Windows	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
b0b963dd-ba40-4bf6-b324-af046422acd3	::1	Edge	Windows	5d146ae1-4011-4e30-9903-83f7b77f9e65
8f620c7d-048c-4ce0-88d9-aabd1f713f44	::1	Chrome	Windows	82e393ec-6cce-421a-9ca7-7e8886b20072
27af5b10-ffec-4047-9819-ee53fc692543	::1	Edge	Windows	4f4a03de-b77d-4ef6-8870-91e031c9794b
cdfb08a9-2886-49a4-ada7-868fcdfc9ce9	172.18.0.1	Edge	iOS	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
f0682834-4d90-44e0-a5d7-fbd6a8c9aa2e	154.177.7.22	Chrome	Windows	d00aab62-c7fa-4ddb-b089-cf3314103079
e0547f24-cfd4-49af-9b25-f85b16db7409	41.35.49.22	Edge	Windows	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
\.


--
-- Data for Name: Media; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Media" (id, "postId", url, "mimeType") FROM stdin;
72bf48ee-0be9-4250-a813-8328b92dc065	0777f30b-34d8-4893-a204-c6175a91d235	https://example.com/media/0	image/png
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Message" (id, "chatId", "senderId", content, "isRequestMessage", "createdAt", "updatedAt", "isDeleted") FROM stdin;
686fabb6-5d2b-4661-adf0-26273b23091f	059e863a-eabc-41b4-8326-d1209154808c	seiff	hi	t	2025-04-22 18:47:39.42	2025-04-22 18:47:39.42	f
fdc45523-7b59-40aa-a055-bb081d684d2b	059e863a-eabc-41b4-8326-d1209154808c	seiff	hello	t	2025-04-28 22:21:28.574	2025-04-28 22:21:28.574	f
e14def6e-1163-4c2f-8b31-ff2f178ca56c	059e863a-eabc-41b4-8326-d1209154808c	seiff	hi	t	2025-04-28 22:22:08.082	2025-04-28 22:22:08.082	f
f86c5e8f-700f-4e53-9774-89d06518f595	059e863a-eabc-41b4-8326-d1209154808c	yahia	hello	t	2025-04-28 22:24:32.963	2025-04-28 22:24:32.963	f
c50ca8af-e13c-43ed-9cb4-905de7d82000	059e863a-eabc-41b4-8326-d1209154808c	seiff	hi	t	2025-04-28 22:26:02.385	2025-04-28 22:26:02.385	f
011a2533-c40c-42e4-91dd-060ab4ccf7f8	059e863a-eabc-41b4-8326-d1209154808c	yahia	hi	t	2025-04-28 22:26:16.907	2025-04-28 22:26:16.907	f
83b52120-abe4-4412-bc5c-6c2179a3c5db	059e863a-eabc-41b4-8326-d1209154808c	seiff	yo	t	2025-04-28 22:29:13.09	2025-04-28 22:29:13.09	f
a30b6502-7287-4eac-bce9-fd83c2078526	059e863a-eabc-41b4-8326-d1209154808c	seiff	hello	t	2025-04-28 22:34:32.061	2025-04-28 22:34:32.061	f
0309fee5-6ff6-4790-8d78-efe7c0ab9cd4	059e863a-eabc-41b4-8326-d1209154808c	yahia	yo	t	2025-04-28 22:34:37.231	2025-04-28 22:34:37.231	f
7ea58e4d-9b05-4bfd-927f-bf54d8e2e883	059e863a-eabc-41b4-8326-d1209154808c	yahia	yo	t	2025-04-28 22:34:40.913	2025-04-28 22:34:40.913	f
0d546d72-2de8-487d-9ff3-61083ec1d703	059e863a-eabc-41b4-8326-d1209154808c	yahia	a	t	2025-04-28 22:34:42.568	2025-04-28 22:34:42.568	f
23896b4d-19d0-4aa0-b5dc-849388fecb33	059e863a-eabc-41b4-8326-d1209154808c	yahia	a	t	2025-04-28 22:34:44.142	2025-04-28 22:34:44.142	f
7821683f-c47d-4db1-94da-15f5b1785d3d	059e863a-eabc-41b4-8326-d1209154808c	yahia	a	t	2025-04-28 22:34:45.817	2025-04-28 22:34:45.817	f
86cef7f8-a531-4a04-8b3d-23be2240aedd	059e863a-eabc-41b4-8326-d1209154808c	seiff	d	t	2025-04-28 23:10:59.178	2025-04-28 23:10:59.178	f
cb01daf7-f75e-41b2-a44e-9911f0992431	059e863a-eabc-41b4-8326-d1209154808c	seiff	hi	t	2025-04-28 23:20:20.518	2025-04-28 23:20:20.518	f
645f1fa4-3628-4588-b2b7-7a8dd39f061f	059e863a-eabc-41b4-8326-d1209154808c	yahia	hi back	t	2025-04-28 23:20:29.555	2025-04-28 23:20:29.555	f
5d58d70b-729e-4663-b98b-bf3aec555087	059e863a-eabc-41b4-8326-d1209154808c	seiff	hyd	t	2025-04-28 23:21:05.913	2025-04-28 23:21:05.913	f
c93188ee-faba-490c-89b5-efc9b8c562f3	059e863a-eabc-41b4-8326-d1209154808c	yahia	hello my name is yahia	t	2025-04-29 03:06:55.533	2025-04-29 03:06:55.533	f
a3b0e90d-47d4-4bef-a7ac-2151cf3d897f	059e863a-eabc-41b4-8326-d1209154808c	seiff	hello my name is seif	t	2025-04-29 03:07:03.591	2025-04-29 03:07:03.591	f
ba0a8b79-4348-4e3e-bfc7-8e4471a07b0f	059e863a-eabc-41b4-8326-d1209154808c	seiff	hello my name ist	t	2025-04-29 03:09:00.208	2025-04-29 03:09:00.208	f
057a26cc-361b-476b-acd7-247bfd3d2bb9	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	hello	t	2025-04-29 03:38:51.108	2025-04-29 03:38:51.108	f
1d137468-72ed-40e5-9690-16504246a9a4	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	yo	t	2025-04-29 03:39:02.488	2025-04-29 03:39:02.488	f
33680c62-7ccc-43ae-ad54-2b537f687532	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	yo	t	2025-04-29 03:39:14.946	2025-04-29 03:39:14.946	f
1eddac30-2af5-4cbf-80cf-9eb2152b00bb	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	hello	t	2025-04-29 03:42:28.56	2025-04-29 03:42:28.56	f
97abe039-0f04-417b-91dc-46c5a5a4ae75	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	hello	t	2025-04-29 03:42:32.806	2025-04-29 03:42:32.806	f
186d8368-39a0-4a4e-9c67-a60d12616820	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	hello	t	2025-04-29 03:47:59.803	2025-04-29 03:47:59.803	f
6b961211-82c7-4c3c-b7d7-e9cd76b61d3a	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	hello	t	2025-04-29 03:48:04.967	2025-04-29 03:48:04.967	f
d351ec9c-81ec-451f-a010-d1a03f3a898a	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	h	t	2025-04-29 03:49:43.301	2025-04-29 03:49:43.301	f
9fe3986c-2421-473f-b256-846ba22372e8	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	s	t	2025-04-29 03:49:58.149	2025-04-29 03:49:58.149	f
34ac45ba-fbfb-457e-9efe-91184e9bc783	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	d	t	2025-04-29 03:50:01.203	2025-04-29 03:50:01.203	f
d7d25caf-7114-40aa-9d56-e7d9186bd3f0	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	s	t	2025-04-29 03:52:03.013	2025-04-29 03:52:03.013	f
eb081a79-7a15-42a8-b718-d6e8516c4a78	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	a	t	2025-04-29 03:52:37.042	2025-04-29 03:52:37.042	f
71667e39-c0b1-4394-b0dc-004969e8fc41	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	s	t	2025-04-29 03:54:20.232	2025-04-29 03:54:20.232	f
9b76c76a-3b9b-4008-ab84-4ca3b9e3790a	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	a	t	2025-04-29 03:56:56.501	2025-04-29 03:56:56.501	f
2931eebd-70d4-42d1-bc26-667dc4ccbf09	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	a	t	2025-04-29 03:57:22.356	2025-04-29 03:57:22.356	f
9f351bcb-277d-4311-afe0-b15f11e26c7b	059e863a-eabc-41b4-8326-d1209154808c	seiff	hello	t	2025-04-29 04:42:50.889	2025-04-29 04:42:50.889	f
3d2fc53c-4ff9-4ade-9111-a95fc795537a	82c22c53-b8a9-4244-b169-6bf135dc005a	seiff	hello	t	2025-04-29 04:43:02.549	2025-04-29 04:43:02.549	f
107c8362-b401-4c0f-9d4f-040167cf0d5b	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	hello to you	t	2025-04-29 04:43:12.095	2025-04-29 04:43:12.095	f
08499e19-c7b9-4197-a739-72c7a1e53d5c	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	hello	t	2025-04-29 04:43:17.095	2025-04-29 04:43:17.095	f
2be134a6-b0f6-4f1a-9a12-36960c04d3fb	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	d	t	2025-04-29 04:43:29.19	2025-04-29 04:43:29.19	f
6de3b190-a085-432d-bf57-44cbe715be91	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	d	t	2025-04-29 04:43:31.128	2025-04-29 04:43:31.128	f
18e9bf2d-1756-4217-b4de-6d598a76f4dc	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	d	t	2025-04-29 04:43:33.621	2025-04-29 04:43:33.621	f
ff24c151-6c34-4625-b339-881fed276d0b	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	a	t	2025-04-29 04:43:46.117	2025-04-29 04:43:46.117	f
d0423b69-9226-4ae7-b897-0891490928a8	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	a	t	2025-04-29 04:44:19.602	2025-04-29 04:44:19.602	f
6adfac11-2070-4e1e-a47d-8462200059d3	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	d	t	2025-04-29 04:44:22.395	2025-04-29 04:44:22.395	f
2c3e9867-c39d-455e-b20c-63079ca582e4	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	a	t	2025-04-29 04:48:53.749	2025-04-29 04:48:53.749	f
3b100d77-a5b2-4477-b2f5-8ebcb26bf4a6	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	a	t	2025-04-29 04:49:22.682	2025-04-29 04:49:22.682	f
7c9ae03a-bd2b-4c9c-8c24-1744c853740f	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	s	t	2025-04-29 04:50:30.193	2025-04-29 04:50:30.193	f
cef0cec0-d33f-4971-bc8a-891928f46530	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	a	t	2025-04-29 04:50:47.911	2025-04-29 04:50:47.911	f
86f445c0-aee8-4791-b7ab-715926d7c564	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	j	t	2025-04-29 04:51:01.661	2025-04-29 04:51:01.661	f
b88d4994-4058-430d-8c82-f100824f6782	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	j	t	2025-04-29 04:51:13.521	2025-04-29 04:51:13.521	f
1113d34f-cbff-4b17-9a5d-9f6d53d12c93	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	a	t	2025-04-29 04:51:21.329	2025-04-29 04:51:21.329	f
0ccc4d27-3761-4904-b995-cfdefb997496	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	a	t	2025-04-29 04:51:42.256	2025-04-29 04:51:42.256	f
7c0fb9c2-6bec-4e26-824e-9a2670eab667	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	a	t	2025-04-29 04:51:51.988	2025-04-29 04:51:51.988	f
4fbb26c4-01ef-4731-96ce-b29379b29ecb	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	d	t	2025-04-29 04:52:00.801	2025-04-29 04:52:00.801	f
f9ed6012-ac6b-4f22-b6b2-7de1233de1a0	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	hello	t	2025-04-29 04:59:50.303	2025-04-29 04:59:50.303	f
574b4f27-5f73-42d1-a8b0-e664efc7cb06	82c22c53-b8a9-4244-b169-6bf135dc005a	seiff	g	t	2025-04-29 05:03:27.462	2025-04-29 05:03:27.462	f
eec807fb-0a34-4973-8fc2-8752d9e89aac	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	a	t	2025-04-29 05:04:33.997	2025-04-29 05:04:33.997	f
9de0752c-4c60-43e3-a277-abcb0be34080	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	a	t	2025-04-29 05:04:43.114	2025-04-29 05:04:43.114	f
13ae9fb1-11d2-4dec-9ea5-204115c157d3	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	hello	t	2025-04-29 05:07:19.798	2025-04-29 05:07:19.798	f
c3a3a486-7b91-4d16-870d-b4787a4d21b6	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	asd	t	2025-04-29 05:07:22.727	2025-04-29 05:07:22.727	f
4df5dc23-eb3e-497f-975f-4990ceec3733	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	hello	t	2025-04-29 16:03:48.027	2025-04-29 16:03:48.027	f
995be88b-d758-4690-9421-4a946be05195	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	hello	t	2025-04-29 16:04:53.889	2025-04-29 16:04:53.889	f
34efdef4-1f48-4d3e-b125-8c2c4c900c5f	82c22c53-b8a9-4244-b169-6bf135dc005a	seiff	hello	t	2025-04-29 16:05:12.136	2025-04-29 16:05:12.136	f
5eb2c077-0d70-4439-aae0-bd0fff103b03	82c22c53-b8a9-4244-b169-6bf135dc005a	seiff	hello	t	2025-04-29 16:05:31.547	2025-04-29 16:05:31.547	f
08f57f4a-a9b1-472d-861c-d0ffdc49c2d4	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	hello	t	2025-04-29 16:21:14.105	2025-04-29 16:21:14.105	f
1caae3e2-216f-4526-be43-5914544f0c90	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	name	t	2025-04-29 16:30:36.794	2025-04-29 16:30:36.794	f
b0195ad2-2f3d-4786-bc6c-a1d88e75bb10	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	566	t	2025-04-29 16:31:29.793	2025-04-29 16:31:29.793	f
2b96ee1a-559a-4c3f-9177-f66c07682860	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	yo mama	t	2025-04-29 16:42:16.138	2025-04-29 16:42:16.138	f
12c33eeb-08ff-4726-a10c-61746a33878b	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	w	t	2025-04-29 16:54:28.937	2025-04-29 16:54:28.937	f
f37d0dde-e6f8-4870-9d7b-0a1a8abc8dfb	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	yo	t	2025-04-29 17:05:48.774	2025-04-29 17:05:48.774	f
f8333049-8b85-4ed2-a80c-75665726d178	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	yox2	t	2025-04-29 17:06:55.448	2025-04-29 17:06:55.448	f
fcb46ca8-3111-4987-a398-fb835ca83770	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	a	t	2025-04-29 17:07:04.331	2025-04-29 17:07:04.331	f
aba1b07c-c3d0-4fda-94cd-e39051f1a1ce	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	x	t	2025-04-29 17:07:10.089	2025-04-29 17:07:10.089	f
5c32156c-3aa7-41d8-8162-62c79173c50a	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	hello	t	2025-04-29 17:07:30.874	2025-04-29 17:07:30.874	f
1976f4b0-630f-471a-a0c4-8c8121436afc	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	asa	t	2025-04-29 17:07:40.87	2025-04-29 17:07:40.87	f
f4ea1a4e-f005-4556-8e8c-b6fdb49afafa	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	a	t	2025-04-29 17:07:47.907	2025-04-29 17:07:47.907	f
c928f1b0-6a21-48a0-8876-bba6246f593a	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	j	t	2025-04-29 17:08:28.934	2025-04-29 17:08:28.934	f
ee4e3b29-bf5b-4b6d-9697-33137bcf412d	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	a	t	2025-04-29 17:08:46.447	2025-04-29 17:08:46.447	f
350336bf-3d7c-41a6-ba93-bfe8809e3adc	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	here	t	2025-04-29 17:13:47.533	2025-04-29 17:13:47.533	f
bfbf4f9d-4c62-4ec3-8218-ac962e44e03a	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	here	t	2025-04-29 17:13:59.475	2025-04-29 17:13:59.475	f
19bb17eb-135b-4595-9f81-eb40340283cb	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	gere	t	2025-04-29 17:14:04.361	2025-04-29 17:14:04.361	f
3ee9b221-2d48-4897-a1ff-42d0b7793f5d	059e863a-eabc-41b4-8326-d1209154808c	yahia	j	t	2025-04-30 14:33:39.95	2025-04-30 14:33:39.95	f
043c87bf-a6fe-41a8-96b2-0db85ce5c5c8	82c22c53-b8a9-4244-b169-6bf135dc005a	seiff	hekkk hekke hek	t	2025-04-30 14:34:16.196	2025-04-30 14:34:16.196	f
5ccc1e1d-ba61-4b45-b48c-3beb20a5233a	059e863a-eabc-41b4-8326-d1209154808c	yahia	k	t	2025-04-30 14:35:28.54	2025-04-30 14:35:28.54	f
a6a462e9-e13e-4f0e-8708-d6e03c6836b3	059e863a-eabc-41b4-8326-d1209154808c	yahia	ff	t	2025-04-30 14:38:44.181	2025-04-30 14:38:44.181	f
d882d014-f038-45f1-9551-91f16bf022a3	059e863a-eabc-41b4-8326-d1209154808c	seiff	hek	t	2025-04-30 14:39:04.864	2025-04-30 14:39:04.864	f
c28fee7c-3b71-44e0-8225-1cb108e3c539	059e863a-eabc-41b4-8326-d1209154808c	seiff	hek	t	2025-04-30 14:39:06.095	2025-04-30 14:39:06.095	f
a694de03-e68a-4f8f-8f67-f6175780bd55	059e863a-eabc-41b4-8326-d1209154808c	seiff	hek	t	2025-04-30 14:39:07.02	2025-04-30 14:39:07.02	f
2d9946e7-2f69-4cb9-9ded-1d59e74e1d40	059e863a-eabc-41b4-8326-d1209154808c	seiff	nizz	t	2025-04-30 14:39:10.907	2025-04-30 14:39:10.907	f
f4afd434-262a-4652-8253-eb4b9ac4c923	059e863a-eabc-41b4-8326-d1209154808c	seiff	keh	t	2025-04-30 14:43:45.816	2025-04-30 14:43:45.816	f
223249cd-040b-4838-be07-e91830f51848	059e863a-eabc-41b4-8326-d1209154808c	seiff	heh	t	2025-04-30 14:43:46.671	2025-04-30 14:43:46.671	f
ed28adc3-11b3-488e-bd2e-8aa9ccaea8bb	059e863a-eabc-41b4-8326-d1209154808c	seiff	heh	t	2025-04-30 14:43:48.278	2025-04-30 14:43:48.278	f
ec9a5305-2059-4ee7-9e8e-b692e80e063d	059e863a-eabc-41b4-8326-d1209154808c	seiff	he	t	2025-04-30 14:43:48.277	2025-04-30 14:43:48.277	f
a1f0f7d6-85c6-4757-b77e-9a9b6d36fb11	059e863a-eabc-41b4-8326-d1209154808c	seiff	heh	t	2025-04-30 14:43:49.092	2025-04-30 14:43:49.092	f
b7a7d557-e166-480b-b5e6-d8da8a8259ac	059e863a-eabc-41b4-8326-d1209154808c	seiff	heh	t	2025-04-30 14:43:49.745	2025-04-30 14:43:49.745	f
064cf3d7-ef8d-4d68-8b66-82b4491b2e04	059e863a-eabc-41b4-8326-d1209154808c	seiff	he	t	2025-04-30 14:43:50.461	2025-04-30 14:43:50.461	f
1c51b975-3b9b-4081-b1c7-a7be56d1c062	059e863a-eabc-41b4-8326-d1209154808c	seiff	nahhhhhh bro	t	2025-04-30 14:46:16.684	2025-04-30 14:46:16.684	f
3457e4db-583b-46d8-b003-6aed4dd864fe	059e863a-eabc-41b4-8326-d1209154808c	seiff	sup	t	2025-04-30 14:46:42.696	2025-04-30 14:46:42.696	f
71b1f40c-6004-4973-9817-179f91a55fcf	059e863a-eabc-41b4-8326-d1209154808c	yahia	moo	t	2025-04-30 14:47:03.071	2025-04-30 14:47:03.071	f
9ef8e4c3-ac77-4d4d-91db-d94a20fc56b3	059e863a-eabc-41b4-8326-d1209154808c	seiff	yo	t	2025-04-30 14:48:07.118	2025-04-30 14:48:07.118	f
3083b2b7-7b2d-4b90-9613-e132132adfce	059e863a-eabc-41b4-8326-d1209154808c	yahia	j	t	2025-04-30 14:48:17.005	2025-04-30 14:48:17.005	f
e5471b14-55af-4126-aa41-76c7596a8b77	059e863a-eabc-41b4-8326-d1209154808c	yahia	yo	t	2025-04-30 15:06:59.366	2025-04-30 15:06:59.366	f
2d8dec38-bb44-4c22-af18-f62c6830df8e	059e863a-eabc-41b4-8326-d1209154808c	yahia	cuz	t	2025-04-30 15:07:09.142	2025-04-30 15:07:09.142	f
0d270089-e725-42a3-aad0-55bc71ca4e4f	059e863a-eabc-41b4-8326-d1209154808c	yahia	wassup	t	2025-04-30 15:07:52.253	2025-04-30 15:07:52.253	f
cec57e40-7902-4c8d-91dd-7039a638f805	059e863a-eabc-41b4-8326-d1209154808c	yahia	cuhh	t	2025-04-30 15:08:06.184	2025-04-30 15:08:06.184	f
f3aae4cf-129d-4ad9-88ba-0ac08e22c66c	059e863a-eabc-41b4-8326-d1209154808c	seiff	dooggg	t	2025-04-30 15:08:42.04	2025-04-30 15:08:42.04	f
4ada05ff-7f18-4a61-9051-802140ec47a4	059e863a-eabc-41b4-8326-d1209154808c	seiff	unc	t	2025-04-30 15:08:55.146	2025-04-30 15:08:55.146	f
0110a64c-5d52-4731-86ff-461801ec95c0	059e863a-eabc-41b4-8326-d1209154808c	seiff	yo cuh	t	2025-04-30 15:10:45.957	2025-04-30 15:10:45.957	f
682e25c9-cd47-4579-9931-e58035e24855	059e863a-eabc-41b4-8326-d1209154808c	seiff	sup cuh	t	2025-04-30 15:16:46.888	2025-04-30 15:16:46.888	f
66e33309-5e88-40a2-8047-c65404c17976	059e863a-eabc-41b4-8326-d1209154808c	seiff	its yo unc	t	2025-04-30 15:16:51.906	2025-04-30 15:16:51.906	f
f71bef28-a79c-46b3-b967-4c95554dfc40	059e863a-eabc-41b4-8326-d1209154808c	seiff	why cuh	t	2025-04-30 15:20:58.382	2025-04-30 15:20:58.382	f
4f1736fd-a921-4849-b511-254e94eb0968	059e863a-eabc-41b4-8326-d1209154808c	seiff	ldf	t	2025-04-30 17:06:18.46	2025-04-30 17:06:18.46	f
84f9f265-8f20-4815-a202-026df7005a95	059e863a-eabc-41b4-8326-d1209154808c	seiff	dfk	t	2025-04-30 17:06:29.283	2025-04-30 17:06:29.283	f
b3dd0d7e-29e6-4ecc-ae1f-fbe1b4f7f9ae	059e863a-eabc-41b4-8326-d1209154808c	yahia	dkg	t	2025-04-30 17:06:53.636	2025-04-30 17:06:53.636	f
d45b63fb-68ed-40bb-a294-7bbaca7c236b	059e863a-eabc-41b4-8326-d1209154808c	yahia	fdf	t	2025-04-30 17:07:00.734	2025-04-30 17:07:00.734	f
7dfbb680-5cc6-4190-b5d6-370a86353681	059e863a-eabc-41b4-8326-d1209154808c	yahia	ddf	t	2025-04-30 17:07:12.169	2025-04-30 17:07:12.169	f
6b5571be-0997-4d9c-8496-ef20dfa822b4	059e863a-eabc-41b4-8326-d1209154808c	seiff	fd	t	2025-04-30 17:08:14.893	2025-04-30 17:08:14.893	f
58dfaed1-37c8-4ca0-8419-621894e973e4	059e863a-eabc-41b4-8326-d1209154808c	yahia	df	t	2025-04-30 17:12:53.872	2025-04-30 17:12:53.872	f
bfd24d18-5940-4782-8bd7-c415dc64f80d	059e863a-eabc-41b4-8326-d1209154808c	seiff	fdf	t	2025-04-30 17:13:11.276	2025-04-30 17:13:11.276	f
10d2defd-42e9-46d5-914a-6379bf3077d6	059e863a-eabc-41b4-8326-d1209154808c	seiff	g	t	2025-04-30 17:13:23.574	2025-04-30 17:13:23.574	f
445d28b2-5571-4485-82e4-e6fc059bfb4a	059e863a-eabc-41b4-8326-d1209154808c	seiff	m	t	2025-04-30 17:13:36.699	2025-04-30 17:13:36.699	f
b3bb8b8e-b952-4a48-b9af-7626b88f414e	059e863a-eabc-41b4-8326-d1209154808c	seiff	ff	t	2025-04-30 17:15:55.387	2025-04-30 17:15:55.387	f
c47bc939-623b-41e9-9cda-81a13db8291b	059e863a-eabc-41b4-8326-d1209154808c	yahia	hi	t	2025-05-02 20:39:15.516	2025-05-02 20:39:15.516	f
652c9794-f490-42ab-a4a6-27d35effd593	059e863a-eabc-41b4-8326-d1209154808c	yahia	hi	t	2025-05-02 20:39:21.283	2025-05-02 20:39:21.283	f
bf7aa8e0-7412-4c9c-ac7a-921145c3f907	059e863a-eabc-41b4-8326-d1209154808c	yahia	gg	t	2025-05-02 20:39:46.639	2025-05-02 20:39:46.639	f
d2db159d-f9b7-4c54-8dd6-d8aba682c377	059e863a-eabc-41b4-8326-d1209154808c	yahia	gg	t	2025-05-02 20:39:54.634	2025-05-02 20:39:54.634	f
ae15bc23-a0b5-4009-aab2-477ac1803257	059e863a-eabc-41b4-8326-d1209154808c	yahia	gt	t	2025-05-02 20:40:04.883	2025-05-02 20:40:04.883	f
576be3bf-11fd-42b9-9a0d-bb433e886f39	059e863a-eabc-41b4-8326-d1209154808c	yahia	as	t	2025-05-02 20:49:55.339	2025-05-02 20:49:55.339	f
33b719ce-66ee-423a-9402-c1e991250f98	059e863a-eabc-41b4-8326-d1209154808c	yahia	as	t	2025-05-02 20:50:00.87	2025-05-02 20:50:00.87	f
91ff54c8-c498-4e36-b733-41b0519aab17	059e863a-eabc-41b4-8326-d1209154808c	yahia	as	t	2025-05-02 20:50:07.579	2025-05-02 20:50:07.579	f
5a10eabd-ced6-47fb-833e-623dde445b86	059e863a-eabc-41b4-8326-d1209154808c	yahia	as	t	2025-05-02 20:52:35.249	2025-05-02 20:52:35.249	f
8f98d708-2e21-4ce9-a9e3-5ec3d8d415f2	059e863a-eabc-41b4-8326-d1209154808c	yahia	as	t	2025-05-02 20:55:36.824	2025-05-02 20:55:36.824	f
597aac0e-0015-49c9-8c73-56ccc5451c9c	059e863a-eabc-41b4-8326-d1209154808c	yahia	yo	t	2025-05-02 20:59:11.867	2025-05-02 20:59:11.867	f
51ccbcb6-af2d-4b56-935a-dc60ceb56201	059e863a-eabc-41b4-8326-d1209154808c	yahia	qw	t	2025-05-02 21:01:50.657	2025-05-02 21:01:50.657	f
bf3bceea-0603-47b3-b654-77a5ce6c0f64	059e863a-eabc-41b4-8326-d1209154808c	yahia	qw	t	2025-05-02 21:04:50.699	2025-05-02 21:04:50.699	f
8265b305-5ede-4b2f-8dfc-6260466ea7e5	059e863a-eabc-41b4-8326-d1209154808c	yahia	hi	t	2025-05-02 21:09:18.754	2025-05-02 21:09:18.754	f
00b5dc0c-f0c3-499d-ba00-ff4bee7eff99	059e863a-eabc-41b4-8326-d1209154808c	yahia	as	t	2025-05-02 21:12:55.256	2025-05-02 21:12:55.256	f
28ec89f9-f713-421f-a24e-8aefb0b04482	059e863a-eabc-41b4-8326-d1209154808c	yahia	as	t	2025-05-02 21:13:37.896	2025-05-02 21:13:37.896	f
eaa21f85-2054-4a97-88a4-7274063cfe8c	059e863a-eabc-41b4-8326-d1209154808c	yahia	er	t	2025-05-02 21:16:44.623	2025-05-02 21:16:44.623	f
864a32ee-25fe-489e-819a-0617d83eb60b	059e863a-eabc-41b4-8326-d1209154808c	yahia	as	t	2025-05-02 21:22:01.722	2025-05-02 21:22:01.722	f
5ead26e9-4333-449d-9f0f-0addb602283f	059e863a-eabc-41b4-8326-d1209154808c	yahia	qw	t	2025-05-02 21:22:52.712	2025-05-02 21:22:52.712	f
3d3c4c83-1010-414e-a846-fd4117e492b0	059e863a-eabc-41b4-8326-d1209154808c	yahia	12	t	2025-05-02 21:23:07.221	2025-05-02 21:23:07.221	f
ad70ad25-dfc3-4b0b-abc3-1f39cd42369e	059e863a-eabc-41b4-8326-d1209154808c	yahia	as	t	2025-05-02 21:23:34.735	2025-05-02 21:23:34.735	f
e0a82db6-ffdf-4d7b-8db4-426ec5aac613	059e863a-eabc-41b4-8326-d1209154808c	yahia	as	t	2025-05-02 21:24:35.216	2025-05-02 21:24:35.216	f
48731acf-7552-48f3-9ca5-2f9bd2a00c65	059e863a-eabc-41b4-8326-d1209154808c	yahia	yoyoyoyoo	t	2025-05-02 21:24:51.882	2025-05-02 21:24:51.882	f
9a709aaa-4211-4c14-a2da-19d9eb0b2a79	059e863a-eabc-41b4-8326-d1209154808c	yahia	as	t	2025-05-02 21:26:43.655	2025-05-02 21:26:43.655	f
42e0b8b1-6eec-4ff2-97a3-464444b3c805	059e863a-eabc-41b4-8326-d1209154808c	yahia	qw	t	2025-05-02 21:26:47.918	2025-05-02 21:26:47.918	f
bc8a8fd3-158f-4222-962c-d07e11dd3ba6	059e863a-eabc-41b4-8326-d1209154808c	yahia	hello	t	2025-05-02 21:29:43.429	2025-05-02 21:29:43.429	f
fcfd1ca1-63f5-4c40-8ece-eb7994c918a3	059e863a-eabc-41b4-8326-d1209154808c	seiff	hello	t	2025-05-03 21:39:56.291	2025-05-03 21:39:56.291	f
f286d666-a8db-4eb8-803d-db356c4855f3	059e863a-eabc-41b4-8326-d1209154808c	yahia	yahia	t	2025-05-03 21:41:26.299	2025-05-03 21:41:26.299	f
08b7ea9c-d0a9-465d-a1b7-47425bea2fff	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	hazem1	t	2025-05-03 21:41:34.187	2025-05-03 21:41:34.187	f
9748824a-c259-4d96-86b1-afb29b54191b	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	hazem2	t	2025-05-03 21:41:38.028	2025-05-03 21:41:38.028	f
046dabfe-e8d9-405f-855d-c15e2a3d25fb	059e863a-eabc-41b4-8326-d1209154808c	yahia	yahia2	t	2025-05-03 21:41:44.037	2025-05-03 21:41:44.037	f
8405f8da-7aaf-49a2-99b1-14f622979a97	059e863a-eabc-41b4-8326-d1209154808c	seiff	yo	t	2025-05-03 22:37:32.857	2025-05-03 22:37:32.857	f
25d99309-c681-4c1f-a9bd-654c23c42804	059e863a-eabc-41b4-8326-d1209154808c	yahia	hello	t	2025-05-03 23:49:36.322	2025-05-03 23:49:36.322	f
e4de0e14-b5b2-45a3-81d9-c2574d98e198	059e863a-eabc-41b4-8326-d1209154808c	yahia	hellox2	t	2025-05-03 23:49:41.043	2025-05-03 23:49:41.043	f
32b6cbf6-fc47-405f-8861-71e923a3b1a7	059e863a-eabc-41b4-8326-d1209154808c	yahia	yes	t	2025-05-04 17:26:24.092	2025-05-04 17:26:24.092	f
f3dc21d2-42a3-4350-a741-2779b463dbb4	059e863a-eabc-41b4-8326-d1209154808c	yahia	yesx2	t	2025-05-04 17:26:29.296	2025-05-04 17:26:29.296	f
68f23cb4-e251-48f8-bb51-fb6e429ecf2d	059e863a-eabc-41b4-8326-d1209154808c	yahia	hello	t	2025-05-04 17:27:40.719	2025-05-04 17:27:40.719	f
1768296f-e26a-43ce-82ad-f4e2ec8ce403	059e863a-eabc-41b4-8326-d1209154808c	seiff	offline	t	2025-05-04 17:31:06.709	2025-05-04 17:31:06.709	f
f6df15aa-9215-4058-af1b-1a399fdf41ba	059e863a-eabc-41b4-8326-d1209154808c	yahia	helllo	t	2025-05-04 17:33:49.393	2025-05-04 17:33:49.393	f
2f13231d-3fa2-4418-884e-653ad0a55820	059e863a-eabc-41b4-8326-d1209154808c	seiff	:D	t	2025-05-04 17:41:27.546	2025-05-04 17:41:27.546	f
90b0a579-1153-48fe-8158-6870edaec8af	059e863a-eabc-41b4-8326-d1209154808c	seiff	😂	t	2025-05-04 17:41:54.903	2025-05-04 17:41:54.903	f
6cd9909e-80c4-4b79-9a33-def6440f2604	059e863a-eabc-41b4-8326-d1209154808c	seiff	hello	t	2025-05-07 09:44:33.905	2025-05-07 09:44:33.905	f
dd8710aa-8025-463c-a230-213a23deaaa6	059e863a-eabc-41b4-8326-d1209154808c	seiff	hello	t	2025-05-07 09:44:43.698	2025-05-07 09:44:43.698	f
e5cac459-857b-418f-b4f1-aef41e7f5a37	059e863a-eabc-41b4-8326-d1209154808c	seiff	yeo	t	2025-05-07 09:44:50.222	2025-05-07 09:44:50.222	f
5bfbd949-8b63-4cc7-86cc-2ef6d9dfbf6b	059e863a-eabc-41b4-8326-d1209154808c	seiff	fr	t	2025-05-07 09:44:58.502	2025-05-07 09:44:58.502	f
36deaab1-6d23-4fc2-abee-6ac4b5eef3aa	059e863a-eabc-41b4-8326-d1209154808c	yahia	that is true	t	2025-05-07 09:45:09.934	2025-05-07 09:45:09.934	f
c00bbef1-ec3c-470b-8b3f-958f88de4b85	059e863a-eabc-41b4-8326-d1209154808c	yahia	is that true?	t	2025-05-07 09:45:22.13	2025-05-07 09:45:22.13	f
88791481-17f7-46f4-a5e5-9bc71d3ca8b1	059e863a-eabc-41b4-8326-d1209154808c	yahia	no way	t	2025-05-07 09:45:49.294	2025-05-07 09:45:49.294	f
c55a93e2-7f72-4a09-b05e-70c8edb1be32	059e863a-eabc-41b4-8326-d1209154808c	seiff	....	t	2025-05-07 09:46:08.002	2025-05-07 09:46:08.002	f
718fec3a-c064-42b1-ae08-de31e4c2f6be	059e863a-eabc-41b4-8326-d1209154808c	seiff	yes it is	t	2025-05-07 09:45:45.864	2025-05-07 09:45:45.864	f
35baed2e-e584-480d-b71f-f170fe9085ee	059e863a-eabc-41b4-8326-d1209154808c	yahia	yes wqay	t	2025-05-07 09:45:58.665	2025-05-07 09:45:58.665	f
8654fe59-ffa6-4bfb-94d5-9f205411262c	059e863a-eabc-41b4-8326-d1209154808c	seiff	.	t	2025-05-07 09:46:11.862	2025-05-07 09:46:11.862	f
91860377-1f0f-4233-bf17-26f753ee52df	059e863a-eabc-41b4-8326-d1209154808c	seiff	yo	t	2025-05-07 09:46:45	2025-05-07 09:46:45	f
d36e9ec4-1a5f-4aaf-8759-3aecf8c68581	059e863a-eabc-41b4-8326-d1209154808c	yahia	yox2	t	2025-05-07 09:46:52.954	2025-05-07 09:46:52.954	f
cff141e0-af48-4c8c-8638-77eef14e83c3	059e863a-eabc-41b4-8326-d1209154808c	yahia	do you see my messages?	t	2025-05-07 09:47:03.193	2025-05-07 09:47:03.193	f
ccbbb8d7-46c0-4536-a9c3-74e69c03adf5	059e863a-eabc-41b4-8326-d1209154808c	seiff	yes i do	t	2025-05-07 09:47:08.365	2025-05-07 09:47:08.365	f
f8ce1430-c252-465a-8ef8-acb799b2fcbc	059e863a-eabc-41b4-8326-d1209154808c	seiff	did you go offline	t	2025-05-07 09:47:15.55	2025-05-07 09:47:15.55	f
3f8ac88a-e291-4fdc-891a-e21cfb155455	059e863a-eabc-41b4-8326-d1209154808c	seiff	where you at	t	2025-05-07 09:47:21.387	2025-05-07 09:47:21.387	f
88c6482c-6ac8-4030-8a4f-7e9930d2f73b	059e863a-eabc-41b4-8326-d1209154808c	yahia	im here	t	2025-05-07 09:47:26.805	2025-05-07 09:47:26.805	f
538fabad-b834-4902-b816-04e324109d6b	059e863a-eabc-41b4-8326-d1209154808c	yahia	.	t	2025-05-07 09:48:00.603	2025-05-07 09:48:00.603	f
c6ae91ac-447e-4c2f-a438-bd9a1093a296	059e863a-eabc-41b4-8326-d1209154808c	yahia	.	t	2025-05-07 09:48:03.508	2025-05-07 09:48:03.508	f
5138f580-e710-45bd-b939-303dea6e0702	059e863a-eabc-41b4-8326-d1209154808c	seiff	yo	t	2025-05-07 09:56:14.06	2025-05-07 09:56:14.06	f
67021c9d-d560-4928-823e-ef1639d205b2	059e863a-eabc-41b4-8326-d1209154808c	seiff	yo	t	2025-05-07 09:56:27.579	2025-05-07 09:56:27.579	f
38228099-6cfe-4586-af7c-1173bb35c444	059e863a-eabc-41b4-8326-d1209154808c	seiff	yo	t	2025-05-07 09:57:33.35	2025-05-07 09:57:33.35	f
4969c056-6e4a-41f7-9f02-1868fd5da585	059e863a-eabc-41b4-8326-d1209154808c	yahia	hello	t	2025-05-07 09:58:00.75	2025-05-07 09:58:00.75	f
1fe39da8-77f5-4979-bba2-bab3a232cf57	059e863a-eabc-41b4-8326-d1209154808c	seiff	hello	t	2025-05-07 09:58:17.927	2025-05-07 09:58:17.927	f
66114a66-3910-48ea-aad4-49c09d7faea1	059e863a-eabc-41b4-8326-d1209154808c	seiff	hellox2	t	2025-05-07 10:01:14.904	2025-05-07 10:01:14.904	f
8b8f5340-ce46-4b27-908f-da885bc55c8b	059e863a-eabc-41b4-8326-d1209154808c	seiff	hellox3	t	2025-05-07 10:01:21.374	2025-05-07 10:01:21.374	f
d92b9b2d-0932-40c9-9d3d-571b36d45381	059e863a-eabc-41b4-8326-d1209154808c	seiff	hello	t	2025-05-07 10:07:24.071	2025-05-07 10:07:24.071	f
b2c0c22d-f156-491e-a4e6-7a08acd0f72e	059e863a-eabc-41b4-8326-d1209154808c	yahia	hello yo you too	t	2025-05-07 10:07:31.009	2025-05-07 10:07:31.009	f
494e9b76-a3f3-47dd-befd-45e1b3e91be4	059e863a-eabc-41b4-8326-d1209154808c	seiff	how are you	t	2025-05-07 10:07:41.995	2025-05-07 10:07:41.995	f
78f7e8ca-0bdb-465e-a2bb-f7c05c2bf6eb	059e863a-eabc-41b4-8326-d1209154808c	yahia	yo	t	2025-05-07 10:09:45.889	2025-05-07 10:09:45.889	f
d7d8284c-a621-47c2-b404-2db161cda6e8	059e863a-eabc-41b4-8326-d1209154808c	seiff	yo	t	2025-05-07 10:09:58.221	2025-05-07 10:09:58.221	f
a3c3cc65-8b21-4e34-b157-c0f191e6e873	059e863a-eabc-41b4-8326-d1209154808c	yahia	hello	t	2025-05-07 11:45:05.132	2025-05-07 11:45:05.132	f
6f230e16-6800-4774-ad92-348a4381239f	059e863a-eabc-41b4-8326-d1209154808c	yahia	yo	t	2025-05-07 11:45:12.674	2025-05-07 11:45:12.674	f
de31b2ac-8779-4aa6-a087-5097edf69483	059e863a-eabc-41b4-8326-d1209154808c	yahia	uhh	t	2025-05-07 11:45:21.72	2025-05-07 11:45:21.72	f
b234f639-d60c-44ce-9c07-bde72b06f9d7	059e863a-eabc-41b4-8326-d1209154808c	yahia	j	t	2025-05-07 11:45:54.005	2025-05-07 11:45:54.005	f
731b9aa4-118a-40d5-a3f7-c407667c3853	059e863a-eabc-41b4-8326-d1209154808c	yahia	hello	t	2025-05-07 17:18:31.702	2025-05-07 17:18:31.702	f
3e2ce959-7ae6-4a70-890d-b3fc700ed4a7	059e863a-eabc-41b4-8326-d1209154808c	yahia	hello	t	2025-05-07 17:18:37.323	2025-05-07 17:18:37.323	f
2e5e1910-8817-4bd0-8fa0-10e714231f58	059e863a-eabc-41b4-8326-d1209154808c	yahia	hello	t	2025-05-07 17:19:03.203	2025-05-07 17:19:03.203	f
2b72b567-e343-4ebc-baa2-b4770515e966	82c22c53-b8a9-4244-b169-6bf135dc005a	seiff	hello	t	2025-05-11 17:06:54.852	2025-05-11 17:06:54.852	f
956f5886-53d8-4f2c-b7ea-bff583cefce1	82c22c53-b8a9-4244-b169-6bf135dc005a	seiff	yo	t	2025-05-11 17:25:06.451	2025-05-11 17:25:06.451	f
749242cf-e470-4f3e-a6a0-00f330aa7dbe	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	yo	t	2025-05-11 17:25:20.163	2025-05-11 17:25:20.163	f
ed721af0-83a4-441a-b4f7-b9961747f864	82c22c53-b8a9-4244-b169-6bf135dc005a	seiff	hello	t	2025-05-11 18:16:31.343	2025-05-11 18:16:31.343	f
285d87b5-137f-4a69-8aaf-ea082599cdbb	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	jghasjd	t	2025-05-11 18:17:17.016	2025-05-11 18:17:17.016	f
24cee01b-f684-41e5-8851-44a00d9e127d	82c22c53-b8a9-4244-b169-6bf135dc005a	hazem	hi	t	2025-05-11 18:20:37.919	2025-05-11 18:20:37.919	f
\.


--
-- Data for Name: Personnel; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Personnel" (id, name, role, "crunchBaseLink", "companyId", "userId") FROM stdin;
76037226-87e7-4c30-9036-27b7bb66e484	Seif	KeyEmployee	https://www.youtube.com/watch?v=dQw4w9WgXcQ	4f4a03de-b77d-4ef6-8870-91e031c9794b	\N
03feb40c-cb20-44a6-be99-7b9f7a4f78b6	Abdo	Founder	https://www.youtube.com/watch?v=dQw4w9WgXcQ	4f4a03de-b77d-4ef6-8870-91e031c9794b	\N
d332633e-399b-40e0-85ea-933dde69ce83	Ahmedd	BoardMember	https://www.youtube.com/watch?v=dQw4w9WgXcQ	4f4a03de-b77d-4ef6-8870-91e031c9794b	\N
4906a85b-644c-415a-ab33-7f07dad7daa8	seif	KeyEmployee	https://www.youtube.com/watch?v=dQw4w9WgXcQ	4f4a03de-b77d-4ef6-8870-91e031c9794b	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
7b4cf6bd-4124-485a-a922-06eb25d4d1a3	yahia	Founder	https://www.youtube.com/watch?v=dQw4w9WgXcQ	4f4a03de-b77d-4ef6-8870-91e031c9794b	1e764457-d773-4678-b8b4-b2bec770cff8
33d3df63-3b7e-429a-b2b4-c85cc4831db9	hamada	Employee		4f4a03de-b77d-4ef6-8870-91e031c9794b	\N
65ba85f9-4d35-40d4-930c-8b8e5ad0c141	mohamed	LeadInvestor		4f4a03de-b77d-4ef6-8870-91e031c9794b	\N
7802ea0a-46a6-4987-ac24-d91db2a55aef	hazem	LeadInvestor	hazem/url	4f4a03de-b77d-4ef6-8870-91e031c9794b	d00aab62-c7fa-4ddb-b089-cf3314103079
3f5d0680-15d8-43e5-9ed2-538aa41829b4	Saleem	Investor		4f4a03de-b77d-4ef6-8870-91e031c9794b	\N
21feb0cc-4cf1-492b-96e2-6980952c9fbc	Omar Eid	BoardMember		82e393ec-6cce-421a-9ca7-7e8886b20072	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
0e3cdefb-4b85-4b7b-af64-fbd64ac148a4	Ahmed Mohammed	Employee		82e393ec-6cce-421a-9ca7-7e8886b20072	\N
696d0b03-d464-48f5-845a-1fe00ef0c293	Omar Eid	Investor		82e393ec-6cce-421a-9ca7-7e8886b20072	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
\.


--
-- Data for Name: Poll; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Poll" (id, question, "postId") FROM stdin;
92d611e6-d00c-4d39-b2a9-6cdbcb18f09d	Is boody useless?	0ae0cb8e-a3a5-4278-970e-e603cd37ad9b
c8994b1a-ab46-4048-ae02-97d025e559a0	nbibjhbjh	8f9eba07-2a23-4b0b-8d96-73042df226f5
\.


--
-- Data for Name: PollOption; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."PollOption" (id, "pollId", text) FROM stdin;
15751ed3-136a-494b-8ab2-fda365de0dd4	92d611e6-d00c-4d39-b2a9-6cdbcb18f09d	YES
8a2b9f21-4205-4d88-889c-373176b167c4	92d611e6-d00c-4d39-b2a9-6cdbcb18f09d	Yes
d4e7e30a-c516-4eb9-b59c-d7d179fa72ff	92d611e6-d00c-4d39-b2a9-6cdbcb18f09d	YEeSSsss
faf3e60a-f0c8-448a-9dd0-4e04c3de5692	c8994b1a-ab46-4048-ae02-97d025e559a0	Yes
8b8384df-1fa8-4822-8b22-6c748f6d6263	c8994b1a-ab46-4048-ae02-97d025e559a0	No
\.


--
-- Data for Name: PollVote; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."PollVote" (id, "accountId", "optionId", "votedAt", "pollId") FROM stdin;
0cab3d89-1f80-411b-bd5b-c790f0a7689c	1e764457-d773-4678-b8b4-b2bec770cff8	15751ed3-136a-494b-8ab2-fda365de0dd4	2025-05-17 22:42:50.578	92d611e6-d00c-4d39-b2a9-6cdbcb18f09d
bc24a26c-f1a6-4333-b83e-468120b489c8	d00aab62-c7fa-4ddb-b089-cf3314103079	d4e7e30a-c516-4eb9-b59c-d7d179fa72ff	2025-05-17 23:09:26.758	92d611e6-d00c-4d39-b2a9-6cdbcb18f09d
e86c4a1b-8dce-4eec-8288-1815ae79fb64	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d	d4e7e30a-c516-4eb9-b59c-d7d179fa72ff	2025-05-17 23:19:07.504	92d611e6-d00c-4d39-b2a9-6cdbcb18f09d
dfd6ef24-984c-4a41-9983-efff232d870b	1e764457-d773-4678-b8b4-b2bec770cff8	8b8384df-1fa8-4822-8b22-6c748f6d6263	2025-05-18 17:21:24.956	c8994b1a-ab46-4048-ae02-97d025e559a0
3f3598ed-c2bc-4184-9807-cd8c123422f5	d00aab62-c7fa-4ddb-b089-cf3314103079	8b8384df-1fa8-4822-8b22-6c748f6d6263	2025-05-18 17:21:52.881	c8994b1a-ab46-4048-ae02-97d025e559a0
f85ea11a-cdb7-49dc-a282-c88362e4ef7d	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d	faf3e60a-f0c8-448a-9dd0-4e04c3de5692	2025-05-18 17:50:05.79	c8994b1a-ab46-4048-ae02-97d025e559a0
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Post" (id, "authorId", type, content, "createdAt", "roundId") FROM stdin;
d98d40e7-b136-492d-ab2e-fdca83454ff6	1e764457-d773-4678-b8b4-b2bec770cff8	LOOKING_FOR_PARTNER	CEO\n\nSkills: Marketing\n\nApplicants for this role should be able to do two backflips.	2025-05-17 20:42:25.064	\N
08d9f9f0-7956-43f9-a094-10ac0e0d4d80	1e764457-d773-4678-b8b4-b2bec770cff8	LOOKING_FOR_GUIDANCE	Areas of guidance needed: Boody\n\nHow to deal with a boody	2025-05-17 22:25:59.453	\N
6eab5129-dc6e-40a6-af57-a2ab959690fb	1e764457-d773-4678-b8b4-b2bec770cff8	EVENT	Meeting With Myself	2025-05-17 22:27:31.255	\N
0ae0cb8e-a3a5-4278-970e-e603cd37ad9b	1e764457-d773-4678-b8b4-b2bec770cff8	POLL	Is boody useless?	2025-05-17 22:32:55.491	\N
d5b75f03-d7e4-464f-b0c5-0ff9513755e1	1e764457-d773-4678-b8b4-b2bec770cff8	LOOKING_FOR_PARTNER	dnsds\n\nSkills: software\n\nncvboajdnod	2025-05-18 17:15:52.507	\N
f6440e02-5131-46eb-ab31-df4e125b96e6	1e764457-d773-4678-b8b4-b2bec770cff8	LOOKING_FOR_PARTNER	dfsdf\n\nSkills: React, Node\n\nfvafffgdfg	2025-05-18 17:17:25.617	\N
cb5d6bf3-57e3-4331-b314-0bc2e4d90d22	1e764457-d773-4678-b8b4-b2bec770cff8	LOOKING_FOR_GUIDANCE	Areas of guidance needed: kjdfgnwjkn\n\nlksnglfdngjdfslg	2025-05-18 17:19:48.381	\N
cd62465b-7902-4277-a8a9-919c8f753cf9	1e764457-d773-4678-b8b4-b2bec770cff8	EVENT	skfnsdfvbvbv	2025-05-18 17:20:46.567	\N
8f9eba07-2a23-4b0b-8d96-73042df226f5	1e764457-d773-4678-b8b4-b2bec770cff8	POLL	nbibjhbjh	2025-05-18 17:21:16.597	\N
52368b6f-2085-49c3-83ef-c705138f8ae8	4f4a03de-b77d-4ef6-8870-91e031c9794b	LOOKING_FOR_FUNDING	AJGDkjasjdklh	2025-05-24 19:27:51.064	dc1a593b-803b-4074-8d99-53441a0a13e4
0777f30b-34d8-4893-a204-c6175a91d235	4f4a03de-b77d-4ef6-8870-91e031c9794b	LOOKING_FOR_FUNDING	Looking for funding	2025-05-25 17:22:22.937	dc1a593b-803b-4074-8d99-53441a0a13e4
\.


--
-- Data for Name: ProductInformation; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."ProductInformation" (id, product, market, partnerships, "companyId") FROM stdin;
005123ed-c030-416d-88b1-4ef4d30aee38	RX8	shoes	{Nike,Adidas,"New Balance",Reebook}	4f4a03de-b77d-4ef6-8870-91e031c9794b
f6483aa9-07e1-4bc0-b192-48a16319c8ae	Stainless Steel Water Bottles	Kitchenware	{Ribby,"Ribby USA"}	82e393ec-6cce-421a-9ca7-7e8886b20072
85ad80db-71f1-46d4-93ee-2ca422cae262	Stainless Steel Water Bottles	Kitchenware	{Ribby,"Ribby USA",Unikorn,Unikorn23}	82e393ec-6cce-421a-9ca7-7e8886b20072
\.


--
-- Data for Name: RaisingFunds; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."RaisingFunds" (id, "equityPercentage", "fundingAmount", "pricePerPortion", "remainingPortions", "totalPortions", date, status, "envelopeId", "companyId") FROM stdin;
3ed70089-6f91-4878-a3b7-7c521a17d936	50	4000	400	0	10	2025-05-26 00:00:00	Completed	813f2a1a-8c41-40a0-b3dd-be93cbc78ce1	82e393ec-6cce-421a-9ca7-7e8886b20072
dc1a593b-803b-4074-8d99-53441a0a13e4	10	10000	1000	2	10	2025-05-11 00:00:00	Active	505de56c-dd3a-4b7b-acd5-c892e2b2623e	4f4a03de-b77d-4ef6-8870-91e031c9794b
\.


--
-- Data for Name: ReadReceipt; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."ReadReceipt" (id, "messageId", username, "readAt") FROM stdin;
08e6faea-f747-46d5-a181-adfb8b8a30c9	33680c62-7ccc-43ae-ad54-2b537f687532	seiff	2025-04-29 03:42:22.301
1c113a38-e2b0-4c08-9d41-8d60a2f46696	ba0a8b79-4348-4e3e-bfc7-8e4471a07b0f	seiff	2025-04-29 03:54:25.511
e02fec01-58f2-4c41-b1aa-c9e52d88fa09	71667e39-c0b1-4394-b0dc-004969e8fc41	seiff	2025-04-29 03:54:26.555
2f2bfb75-e12d-45fc-be0b-f6ee144e25e4	2931eebd-70d4-42d1-bc26-667dc4ccbf09	seiff	2025-04-29 04:42:56.991
3e808c63-ad97-4b43-989a-00876eb24a51	86f445c0-aee8-4791-b7ab-715926d7c564	seiff	2025-04-29 04:51:08.466
0ab8502d-6de2-40b4-bbb9-a910ff618ba1	66e33309-5e88-40a2-8047-c65404c17976	yahia	2025-04-30 15:17:08.592
b2e030b0-b118-4b8b-96dd-3f9994d64550	f71bef28-a79c-46b3-b967-4c95554dfc40	yahia	2025-04-30 15:21:06.882
6001868b-1e42-455d-83aa-555a9de98fcc	84f9f265-8f20-4815-a202-026df7005a95	yahia	2025-04-30 17:06:40.215
eeef0190-e65b-44f2-9cd7-857e554d8ee2	f9ed6012-ac6b-4f22-b6b2-7de1233de1a0	seiff	2025-04-29 04:59:54.16
f607e6bc-6ae2-4efc-a2e9-c8215912c0d1	58dfaed1-37c8-4ca0-8419-621894e973e4	seiff	2025-04-30 17:13:03.049
e060382d-fdef-4fc6-b088-9b8f57e0c902	eec807fb-0a34-4973-8fc2-8752d9e89aac	hazem	2025-04-29 05:04:36.937
aed2053a-f17a-4787-ac27-2b60c8cfee75	08f57f4a-a9b1-472d-861c-d0ffdc49c2d4	seiff	2025-04-29 16:29:32.432
c0931cc1-6650-4e63-8e3b-0947ac396acf	1caae3e2-216f-4526-be43-5914544f0c90	seiff	2025-04-29 16:30:40.428
a8381e7a-5a56-458e-a6e2-e1599d46de24	9f351bcb-277d-4311-afe0-b15f11e26c7b	seiff	2025-04-29 16:31:22.177
a2db72b4-7206-48b8-a5fe-45180a436a6b	b0195ad2-2f3d-4786-bc6c-a1d88e75bb10	seiff	2025-04-29 16:42:06.318
63610895-d5c3-45c8-84a9-9472ea77c04b	b0195ad2-2f3d-4786-bc6c-a1d88e75bb10	hazem	2025-04-29 16:42:11.328
67ed551f-3832-4c69-8e7d-78f1aa745d88	2b96ee1a-559a-4c3f-9177-f66c07682860	seiff	2025-04-29 16:42:21.309
558feb89-81e9-4e2b-9efe-389b5dc4f6f3	2b96ee1a-559a-4c3f-9177-f66c07682860	hazem	2025-04-29 16:54:18.82
c36733d8-edac-479b-8304-e2369d98b40e	12c33eeb-08ff-4726-a10c-61746a33878b	seiff	2025-04-29 16:54:36.442
69f0dfbf-755e-46a5-8649-a80fa431dbb0	12c33eeb-08ff-4726-a10c-61746a33878b	hazem	2025-04-29 17:05:45.717
c3663a51-0b80-4806-a9c1-f20606c8964e	f37d0dde-e6f8-4870-9d7b-0a1a8abc8dfb	hazem	2025-04-29 17:06:51.407
823d5db5-668c-4782-9cc6-44b2f6e6e97f	5c32156c-3aa7-41d8-8162-62c79173c50a	seiff	2025-04-29 17:07:34.578
8813385d-2c42-43fe-9721-dcb3160ee1c9	ee4e3b29-bf5b-4b6d-9697-33137bcf412d	seiff	2025-04-29 17:09:01.04
406036e8-3377-4554-97de-38d08e8159e0	ee4e3b29-bf5b-4b6d-9697-33137bcf412d	hazem	2025-04-29 17:13:44.567
6bdb1473-c88f-4456-95ca-819470024517	9f351bcb-277d-4311-afe0-b15f11e26c7b	yahia	2025-04-30 14:33:31.964
a3109c7a-b161-40f4-98cf-6941a2774ea8	19bb17eb-135b-4595-9f81-eb40340283cb	seiff	2025-04-30 14:33:55.513
1fbfbdd9-968b-4c64-9d05-f39e148f8a96	3ee9b221-2d48-4897-a1ff-42d0b7793f5d	seiff	2025-04-30 14:35:22.558
c4567f25-0a13-4e01-b027-739887a5b0f6	5ccc1e1d-ba61-4b45-b48c-3beb20a5233a	yahia	2025-04-30 14:38:37.113
45e30f95-dc51-4490-bb7b-ea155bbcf198	a6a462e9-e13e-4f0e-8708-d6e03c6836b3	seiff	2025-04-30 14:38:53.499
3c88b935-17e0-45b0-be84-0121a6887fd9	2d9946e7-2f69-4cb9-9ded-1d59e74e1d40	yahia	2025-04-30 14:39:17.461
fb77698a-e324-49e3-bc61-a1f23d253d37	3457e4db-583b-46d8-b003-6aed4dd864fe	yahia	2025-04-30 14:46:47.098
09ff6515-e279-4cbb-ad22-db28322561af	71b1f40c-6004-4973-9817-179f91a55fcf	yahia	2025-04-30 14:47:11.264
532b754c-545a-4a7e-93f8-937cfd6ea7d1	b3bb8b8e-b952-4a48-b9af-7626b88f414e	yahia	2025-05-02 20:39:10.795
8505be9c-f619-465d-91d4-b7f13e4f2640	d2db159d-f9b7-4c54-8dd6-d8aba682c377	seiff	2025-05-02 20:39:57.545
8ea960eb-2c34-43c4-bbac-4a50218d6bec	ae15bc23-a0b5-4009-aab2-477ac1803257	seiff	2025-05-02 20:40:19.422
9c7a5c42-0b33-41a7-af96-27519bae27f1	71b1f40c-6004-4973-9817-179f91a55fcf	seiff	2025-04-30 14:48:02.767
e71a9cfd-6316-4c05-b7d5-982b1f43b720	9ef8e4c3-ac77-4d4d-91db-d94a20fc56b3	yahia	2025-04-30 14:48:10.759
f0df43b0-2f34-457f-ae78-2221846bbe39	91ff54c8-c498-4e36-b733-41b0519aab17	yahia	2025-05-02 20:52:32.893
7455ddf0-e7a3-44db-b71e-b720efe8d1d8	5a10eabd-ced6-47fb-833e-623dde445b86	yahia	2025-05-02 20:55:33.65
903dc7cb-1d3a-4d27-a915-4c9bfb1f7821	8f98d708-2e21-4ce9-a9e3-5ec3d8d415f2	yahia	2025-05-02 20:59:08.018
9691ee05-d495-4713-a0f5-6c1eeebe16c6	597aac0e-0015-49c9-8c73-56ccc5451c9c	yahia	2025-05-02 21:01:48.444
54da8d0e-32c1-4f2f-92d6-a592244ba7ec	3083b2b7-7b2d-4b90-9613-e132132adfce	seiff	2025-04-30 15:06:40.666
f220f2b2-f4ee-48d3-8164-9ca2dc70065f	3083b2b7-7b2d-4b90-9613-e132132adfce	yahia	2025-04-30 15:06:55.248
fea2d19d-fcf1-452e-be59-fecaa866b873	2d8dec38-bb44-4c22-af18-f62c6830df8e	yahia	2025-04-30 15:07:45.086
9179c8cc-c180-4946-a468-bc550460759c	51ccbcb6-af2d-4b56-935a-dc60ceb56201	yahia	2025-05-02 21:04:48.151
da326697-45f0-4a1e-889e-9337744ff894	cec57e40-7902-4c8d-91dd-7039a638f805	seiff	2025-04-30 15:08:25.835
c1081927-5226-41a5-b9f7-2ac25f61e65d	4ada05ff-7f18-4a61-9051-802140ec47a4	yahia	2025-04-30 15:09:05.33
133adb41-fcf2-4869-b069-adf77f9598e7	4ada05ff-7f18-4a61-9051-802140ec47a4	seiff	2025-04-30 15:10:38.858
4940f1b9-48bc-4bbb-8f1a-eeb2fbfe16c4	043c87bf-a6fe-41a8-96b2-0db85ce5c5c8	seiff	2025-05-03 21:39:22.712
fa1b52ea-8464-44ea-8638-d75aa66d8c56	0110a64c-5d52-4731-86ff-461801ec95c0	seiff	2025-04-30 15:16:40.128
bca21fe5-d217-4c07-9839-df5b26fe3c07	bf3bceea-0603-47b3-b654-77a5ce6c0f64	yahia	2025-05-02 21:08:15.179
2fdfe1b1-1d40-4ba6-80e1-0bd073567e9c	8265b305-5ede-4b2f-8dfc-6260466ea7e5	yahia	2025-05-02 21:12:50.34
94e37980-9e50-4949-b361-a99b07e1e5f8	00b5dc0c-f0c3-499d-ba00-ff4bee7eff99	yahia	2025-05-02 21:13:34.757
996237b5-91bb-4381-b7e8-f8f97a06c393	28ec89f9-f713-421f-a24e-8aefb0b04482	yahia	2025-05-02 21:16:40.56
b7bdb583-8e54-41bc-b28a-6a05c8e723ab	eaa21f85-2054-4a97-88a4-7274063cfe8c	yahia	2025-05-02 21:21:59.996
f674eeea-369a-428e-ae20-8fe977f0f619	864a32ee-25fe-489e-819a-0617d83eb60b	yahia	2025-05-02 21:22:50.553
f7a3e723-23a0-4673-9c63-53c87375a0dc	3d3c4c83-1010-414e-a846-fd4117e492b0	seiff	2025-05-02 21:23:21.833
72fa2b3b-2a75-4b46-afa2-d38101526d41	ad70ad25-dfc3-4b0b-abc3-1f39cd42369e	seiff	2025-05-02 21:23:36.41
d170581a-4c10-4d23-b6f1-df9d5ed44aa4	ad70ad25-dfc3-4b0b-abc3-1f39cd42369e	yahia	2025-05-02 21:24:33.082
6e419b62-00d3-48d6-bf56-ede237185d2d	e0a82db6-ffdf-4d7b-8db4-426ec5aac613	seiff	2025-05-02 21:24:38.367
356c7e2f-6916-43b6-b082-f72f65482313	e0a82db6-ffdf-4d7b-8db4-426ec5aac613	yahia	2025-05-02 21:24:46.539
cee85727-8a9a-42b5-9c0a-6b1d7985c908	48731acf-7552-48f3-9ca5-2f9bd2a00c65	seiff	2025-05-02 21:25:02.656
5029b5ce-4e76-4f50-9b0f-4b19f27f2854	48731acf-7552-48f3-9ca5-2f9bd2a00c65	yahia	2025-05-02 21:26:41.71
2eca32d6-7873-4afc-bccd-86db4784dc02	42e0b8b1-6eec-4ff2-97a3-464444b3c805	seiff	2025-05-02 21:26:57.165
103e2644-eb47-4fc5-acde-76f1bc023235	42e0b8b1-6eec-4ff2-97a3-464444b3c805	yahia	2025-05-02 21:29:39.599
5ea951fa-cffc-458a-bb91-624ddda00685	bc8a8fd3-158f-4222-962c-d07e11dd3ba6	seiff	2025-05-03 21:39:25.192
5a11ae8e-3a3c-447b-bfaa-8a03cde0ecc6	fcfd1ca1-63f5-4c40-8ece-eb7994c918a3	yahia	2025-05-03 21:41:19.415
1a6ffb64-ec33-442e-9644-1767fcbfbc73	043c87bf-a6fe-41a8-96b2-0db85ce5c5c8	hazem	2025-05-03 21:41:29.693
104dfb7b-a6a2-4f81-809e-92416ae1be10	f286d666-a8db-4eb8-803d-db356c4855f3	yahia	2025-05-03 21:41:39.692
6e3aad0e-8135-48b7-83b7-f18e852c5622	046dabfe-e8d9-405f-855d-c15e2a3d25fb	seiff	2025-05-03 21:41:49.89
15a4dc04-7a9c-4fd9-80ad-ce9ac26ad759	8654fe59-ffa6-4bfb-94d5-9f205411262c	seiff	2025-05-07 09:46:41.896
957e5d2a-e3eb-463d-96ba-e4026a6bd7cc	4969c056-6e4a-41f7-9f02-1868fd5da585	seiff	2025-05-07 09:58:13.007
6effc960-9305-4167-8a93-8f6806e15fb0	8405f8da-7aaf-49a2-99b1-14f622979a97	seiff	2025-05-03 23:49:19.025
83de9ee8-ca53-4c3e-9e62-a7bb6f29d569	f8ce1430-c252-465a-8ef8-acb799b2fcbc	yahia	2025-05-07 09:56:18.966
9c01cf81-ac74-469f-9d4d-49ddea031a4e	1768296f-e26a-43ce-82ad-f4e2ec8ce403	yahia	2025-05-07 09:56:18.997
04fb2e51-61a1-4dcc-9768-59026e0bc9b4	8654fe59-ffa6-4bfb-94d5-9f205411262c	yahia	2025-05-07 09:56:18.992
565decb2-3e6e-467f-94ad-bb36781b8c6d	ccbbb8d7-46c0-4536-a9c3-74e69c03adf5	yahia	2025-05-07 09:56:18.994
e1b8598e-e631-4bd5-8ea3-75f7659d3b40	718fec3a-c064-42b1-ae08-de31e4c2f6be	yahia	2025-05-07 09:56:19.002
acd94906-ddb1-4659-afcc-dba512fe9e82	3f8ac88a-e291-4fdc-891a-e21cfb155455	yahia	2025-05-07 09:56:19.002
98b4be37-6e45-487f-a186-1b62b1f8a260	5138f580-e710-45bd-b939-303dea6e0702	yahia	2025-05-07 09:56:19.005
2e58bdef-4364-45d4-af61-c19e895b60df	dd8710aa-8025-463c-a230-213a23deaaa6	yahia	2025-05-07 09:56:19.003
d0623779-f3e0-4e13-bd95-f4466a9c0a6f	e5cac459-857b-418f-b4f1-aef41e7f5a37	yahia	2025-05-07 09:56:19.004
f7cfaef9-09c7-4c3e-a3b9-3acbe1eb4218	5bfbd949-8b63-4cc7-86cc-2ef6d9dfbf6b	yahia	2025-05-07 09:56:19.009
6f4c9857-7d6b-478f-aee3-8e95e2d2e4b2	e4de0e14-b5b2-45a3-81d9-c2574d98e198	yahia	2025-05-04 17:26:20.048
d265ea6b-4983-41d8-92b8-17f861ee7ce6	90b0a579-1153-48fe-8158-6870edaec8af	yahia	2025-05-07 09:56:19.012
2d0720a3-28b3-41ab-86f5-90c2906282be	91860377-1f0f-4233-bf17-26f753ee52df	yahia	2025-05-07 09:56:19.011
d9bbd61b-7599-413e-b29f-799cd2a12e50	68f23cb4-e251-48f8-bb51-fb6e429ecf2d	seiff	2025-05-07 09:56:11.326
38f30525-5483-46d6-9548-48eeb666311e	90b0a579-1153-48fe-8158-6870edaec8af	seiff	2025-05-07 09:44:25.387
618842c4-7327-4264-a2bb-4cf9573e02a2	c00bbef1-ec3c-470b-8b3f-958f88de4b85	yahia	2025-05-07 09:45:36.873
c7f5d3b2-1692-4d89-920d-175ca14135b2	1fe39da8-77f5-4979-bba2-bab3a232cf57	yahia	2025-05-07 09:58:20.157
3b9a13b3-3b10-4a0a-b0ed-79aa64decca0	c6ae91ac-447e-4c2f-a438-bd9a1093a296	yahia	2025-05-07 09:56:03.569
eb2c0bc3-348b-490d-9d26-b91ac7d02f15	1fe39da8-77f5-4979-bba2-bab3a232cf57	seiff	2025-05-07 10:01:11.37
790bd15a-3a11-4fe1-a9fb-495d94a6df3f	66114a66-3910-48ea-aad4-49c09d7faea1	yahia	2025-05-07 10:01:15.373
fd1df408-0401-482a-a0f5-2259bb73593d	de31b2ac-8779-4aa6-a087-5097edf69483	seiff	2025-05-07 11:45:28.67
8a9e2c7f-4432-4a55-9332-a05e54951b75	8b8f5340-ce46-4b27-908f-da885bc55c8b	yahia	2025-05-07 10:01:34.871
bccbdc67-d0b8-42b6-a911-a8fb84f50807	8b8f5340-ce46-4b27-908f-da885bc55c8b	seiff	2025-05-07 10:07:20.292
98b6a51d-4b4f-4d89-9b8a-28fe0ca4eaa3	d92b9b2d-0932-40c9-9d3d-571b36d45381	yahia	2025-05-07 10:07:25.932
1c48a9a2-945d-4f4e-a5cf-ea2f32369a8f	b2c0c22d-f156-491e-a4e6-7a08acd0f72e	seiff	2025-05-07 10:07:31.822
0e03e153-805f-4586-bc0b-7923c2908ce7	494e9b76-a3f3-47dd-befd-45e1b3e91be4	seiff	2025-05-07 10:07:47.823
a9a12ec6-8bd9-4dcb-9d49-c294b206e88c	c00bbef1-ec3c-470b-8b3f-958f88de4b85	seiff	2025-05-07 09:56:11.327
7b8e0ba5-c512-42e9-9f5c-614a2ee44735	25d99309-c681-4c1f-a9bd-654c23c42804	seiff	2025-05-07 09:56:11.329
a93087ad-11d5-4824-a1f6-59168cfcc07b	f6df15aa-9215-4058-af1b-1a399fdf41ba	seiff	2025-05-07 09:56:11.329
73508249-804b-4c6b-86f5-79b2aeb2d8ae	d36e9ec4-1a5f-4aaf-8759-3aecf8c68581	seiff	2025-05-07 09:56:11.331
cef5eb03-7d0c-40d6-85c3-b1a122fc68ba	88791481-17f7-46f4-a5e5-9bc71d3ca8b1	seiff	2025-05-07 09:56:11.331
0dc35782-478d-462e-ae1e-949a21656583	32b6cbf6-fc47-405f-8861-71e923a3b1a7	seiff	2025-05-07 09:56:11.333
715eb1e4-f642-4a84-9d00-d1985dfaf730	36deaab1-6d23-4fc2-abee-6ac4b5eef3aa	seiff	2025-05-07 09:56:11.335
bfbbb948-fc3b-47e2-bba0-8a6b9446bb02	e4de0e14-b5b2-45a3-81d9-c2574d98e198	seiff	2025-05-07 09:56:11.336
306d34bd-3e52-4a35-812e-9e953c34fa02	88c6482c-6ac8-4030-8a4f-7e9930d2f73b	seiff	2025-05-07 09:56:11.368
b885d6cc-4a66-44ce-b360-4d2e8681abbe	c6ae91ac-447e-4c2f-a438-bd9a1093a296	seiff	2025-05-07 09:56:11.397
c0ad8f98-f5f5-4ee1-8271-cde2fa03e1ef	538fabad-b834-4902-b816-04e324109d6b	seiff	2025-05-07 09:56:11.394
eb757338-d3d3-4176-899a-dc89e209b517	f3dc21d2-42a3-4350-a741-2779b463dbb4	seiff	2025-05-07 09:56:11.39
cd098c6e-bc05-4f24-9379-e82cab44ba4e	cff141e0-af48-4c8c-8638-77eef14e83c3	seiff	2025-05-07 09:56:11.399
4bcf5984-9afd-4074-af6c-1a2b186ab437	35baed2e-e584-480d-b71f-f170fe9085ee	seiff	2025-05-07 09:56:11.4
10b7d6ef-8be6-4cda-a0a8-fca7d82b1623	2f13231d-3fa2-4418-884e-653ad0a55820	yahia	2025-05-07 09:56:18.927
3c1a836c-5c7d-49dd-a24b-20f999543a9e	c55a93e2-7f72-4a09-b05e-70c8edb1be32	yahia	2025-05-07 09:56:18.934
0530f40a-20a8-4330-ac04-c16a644e1350	8405f8da-7aaf-49a2-99b1-14f622979a97	yahia	2025-05-07 09:56:18.929
cffc3583-f9c7-4309-878b-f678e2aa4a2b	6cd9909e-80c4-4b79-9a33-def6440f2604	yahia	2025-05-07 09:56:18.935
4507bd0c-ef60-4bc8-bcbc-4ec96fca9552	67021c9d-d560-4928-823e-ef1639d205b2	yahia	2025-05-07 09:57:25.888
7575b9aa-4016-4b47-9f76-1179f8292a36	67021c9d-d560-4928-823e-ef1639d205b2	seiff	2025-05-07 09:57:30.947
91f95821-82bc-4f5b-9ef1-6c7c6539b85f	38228099-6cfe-4586-af7c-1173bb35c444	yahia	2025-05-07 09:57:39.263
e07e8cf5-ee57-4a26-bb49-2bb6ab6b34f4	38228099-6cfe-4586-af7c-1173bb35c444	seiff	2025-05-07 09:57:43.178
9ad2c616-6753-4f78-ae5a-ce2d148ef3bd	4969c056-6e4a-41f7-9f02-1868fd5da585	yahia	2025-05-07 09:58:05.569
a4c773d4-0ac6-4290-97de-63c2b5e20a52	494e9b76-a3f3-47dd-befd-45e1b3e91be4	yahia	2025-05-07 10:09:42.594
6ddac1f1-a1c3-41dc-824f-ff90ee4bd9dd	78f7e8ca-0bdb-465e-a2bb-f7c05c2bf6eb	seiff	2025-05-07 10:09:48.671
56dfe0b3-2a89-4c4f-8c29-c68712f8ffe7	9748824a-c259-4d96-86b1-afb29b54191b	hazem	2025-05-11 17:06:33.736
7aae71e9-f034-42c7-aafd-a86581fc0fa6	d7d8284c-a621-47c2-b404-2db161cda6e8	seiff	2025-05-07 11:43:17.114
913764ef-a564-460e-92cf-0f6cc4c44e4d	d7d8284c-a621-47c2-b404-2db161cda6e8	yahia	2025-05-07 11:44:53.543
d8a66b15-3ede-4820-ac8a-1bc37167c1dc	a3c3cc65-8b21-4e34-b157-c0f191e6e873	seiff	2025-05-07 11:45:06.546
293ebfdd-9557-4503-9311-799313ffa09e	6f230e16-6800-4774-ad92-348a4381239f	seiff	2025-05-07 11:45:13.847
b1f789c7-6310-4df0-abb9-24678aa70bfd	b234f639-d60c-44ce-9c07-bde72b06f9d7	yahia	2025-05-07 17:18:22.831
027bdec4-af1a-4a0d-8228-39e38d0b0bda	b234f639-d60c-44ce-9c07-bde72b06f9d7	seiff	2025-05-07 17:18:23.522
372ab294-5205-491f-a23b-18097515a260	731b9aa4-118a-40d5-a3f7-c407667c3853	seiff	2025-05-07 17:18:32.574
9c8ccdc8-cb64-4d29-91be-8ae4ecdc183e	3e2ce959-7ae6-4a70-890d-b3fc700ed4a7	seiff	2025-05-07 17:18:40.571
27878449-0a08-4e3b-873b-b85f6f617939	2e5e1910-8817-4bd0-8fa0-10e714231f58	seiff	2025-05-11 19:30:11.791
aaf5386e-af7b-4b01-a978-514f314f6397	9748824a-c259-4d96-86b1-afb29b54191b	seiff	2025-05-11 17:05:47.803
7e6bc1e9-4421-4c80-80c6-495bc5cc86ec	2b72b567-e343-4ebc-baa2-b4770515e966	hazem	2025-05-11 17:06:55.544
e635ac2a-2284-4a46-a7ca-2fe9e4af7a43	2b72b567-e343-4ebc-baa2-b4770515e966	seiff	2025-05-11 17:07:05.749
d7bd5e8f-3db8-4523-bb7d-1a3bf9370ab4	956f5886-53d8-4f2c-b7ea-bff583cefce1	hazem	2025-05-11 17:25:07.205
c6783d2b-84f3-40b7-ac10-d20b63909eb0	956f5886-53d8-4f2c-b7ea-bff583cefce1	seiff	2025-05-11 17:25:14.001
7079283b-461e-4215-8a8e-1e2053f705c6	749242cf-e470-4f3e-a6a0-00f330aa7dbe	seiff	2025-05-11 17:25:20.953
b924d70e-ea56-414c-bbe2-d0e09f01b3b4	2e5e1910-8817-4bd0-8fa0-10e714231f58	yahia	2025-05-11 18:16:35.813
0c67126c-b7a7-445a-8146-9227985d9497	ed721af0-83a4-441a-b4f7-b9961747f864	hazem	2025-05-11 18:16:54.998
3f545052-76f6-4b13-aa66-7905e3094a80	285d87b5-137f-4a69-8aaf-ea082599cdbb	seiff	2025-05-11 18:17:20.164
67ffcf6a-3e32-4395-82af-0d3e78687522	24cee01b-f684-41e5-8851-44a00d9e127d	seiff	2025-05-11 18:20:53.051
\.


--
-- Data for Name: RefreshTokenValid; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."RefreshTokenValid" (sid, "profileId", ip, browser, os, expire, role) FROM stdin;
66156bd3729cca043a5388878a3680fc5640e18e0e603a9db0c7bd75e3e9875fff853234c3c59c913d10741544d50e5975bd1569fdedc7a8e54b1c8fd4a66521177ee99d94b90c685fe23cf2c711c2888265203c3fdc8706b63eda760c60e95704d54947ebc09b417eaba9a094150f56260d313110897a1ec47021e04cf5877e	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96	::1	Chrome	Windows	2025-06-02 11:15:01.671	User
237b6df6988a0b48b5b2799ac48a2fa77061cf9ec12661a7928eb49aa1683c50c79a3f67d50e5c5e4febfb50a2edb2139a2860e6d210515fa5c9a3e90acc4a1a6fcea34cd88b3044286d0e10ceeeed99344fdf09a345b7c03c5b6fb59fcea7b056d7171e875e3157df6b01f8783981255d32fc5e7c7eeee3d1843a6035b41a4d	d00aab62-c7fa-4ddb-b089-cf3314103079	::1	Edge	Windows	2025-05-06 03:38:40.446	User
3ae93ae505c04fae50f7ca5d6b84f46e1f72d5c8385fd36b34aeab6738e69350be8ae3c5acffe8f6ece710c026794b1c81a92a9b90213e0c46b3b60f1a3ca03e6e374841584b40b2e0b3b4aa0db5f97253e368b284bc345d9e4e9fe51860cd9da927488b40ad2a80a636930c635a263907b12b7a91f2c23c9853450e8fd07ea9	d00aab62-c7fa-4ddb-b089-cf3314103079	::1	Edge	Windows	2025-05-06 16:01:31.702	User
1788f755b9417b279e3ecc6926f7d9d3fcd4956afde8e5f1f6221daca47082f49a3874cfac6c95604ca0e170a58ec3614fa28def2dbafadce3dae7c108aa0749b93a4a545af9174ae7fc5029072fd512b42c66a94f544e5c6189d4b25bec71f89acb4584827a488b851c532810f0588697d92ea809b413340534ff3fcba65fa8	4f4a03de-b77d-4ef6-8870-91e031c9794b	::1	Edge	Windows	2025-06-30 21:18:25.116	Company
df7db792bd8eb3d02de011326f4fd813d4a6e907c478c26fd4e36caa7f85eb22db85ad6d74f549d492fefa5f381c62d9d5ae44dd6feaff3dd92f7414a372862f76bf5456d36f8144ba53fc5dfc656bb6c85c467ab1674f26ab4002e8e13c12825562a97531c376084cf064c8a76f6c7851bf55bca79dab4eafa4c64954f37f73	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d	::1	Mobile Safari	iOS	2025-07-01 20:13:48.09	User
e27989b492d2616172597d843cf411ddbc0b794792e56c32e5f7798b580366fe76c65f12b94e4e1bc5989c16a53d12d10918867dd9a1e9efd1e1c271d38d0c7b28ff17573281c49d1d41af356aad4786847b5b7a957f3a93531e94ebe69ebc3a70947f51f0f5ace772dbfffada0f69fe79938f1006f5916fa2ed3bc3d11bf11a	d00aab62-c7fa-4ddb-b089-cf3314103079	::1	Edge	Windows	2025-05-10 21:40:22.214	User
f5bb474111996a0725946f423a0e7be3004632f61c52ec3b357d7ff6b139797feb8dd43dd1c4ceb4fbb3629daf727c3a11828ddf2d6dc375583d156fb1be1e4d2ca76f509b0277658e4a27b763711118b87e52bd88f7489167640d2db251a112427de058a2cd4720def67aab1dea5b91d65d6bf728fe493657e3c551e451091b	1e764457-d773-4678-b8b4-b2bec770cff8	::1	Chrome	Windows	2025-05-10 21:41:10.261	User
678de41d252292dac3cdc2a20cd17487269eba536b0fbe8c23b456bd7d7aa310f74ebf6b8c8c0cd92660520d4458cdc85f8123c8cf2f75a1ffc1d53219e96ba7722e2f59a887800e5545fa2281624d44bff5d2f3fdf47db803961295ee9a04bfa36939885f99416ea6ba39e7869016b78d6199beaf147fcd55b0567d0ae93677	82e393ec-6cce-421a-9ca7-7e8886b20072	::1	Chrome	Windows	2025-06-02 12:18:09.048	Company
87e94cc04a1fdb10266ed12f29942abf6ca1c10bb71e938546bd3ab366e816e86ff6571036ef53ef179c5acb2d1ac4464f24915f758a2157a23c694c261098c625874d02925daef51a90130dca23ab31d7e1585501777c0f75018e577b33af637cd3f88734b84430b8751f11c53f495bda7d11963b63382be0a78d7047591e36	d00aab62-c7fa-4ddb-b089-cf3314103079	::1	Edge	Windows	2025-05-18 17:06:08.479	User
a8d586de8b8a625811618d30b4209e712123fa410e938120e7c44e78416a8a5fdce2f474d58625146c6bed2fb781abc04059ee589bd73ca38aa7835c41251a3ed5da6a03217d94e2ac0827ef12d1ac84848c2f23f32726e9dc339d5d1a006f72a03690da9fb3963769726901bb6aeb8ad259c1c555f7f6cd57b6bbd159dd5446	d00aab62-c7fa-4ddb-b089-cf3314103079	::1	Edge	Windows	2025-05-18 18:16:48.809	User
175f5e4e8770feb0f9d1cb23b305ed44f3e80bda24b909618838cd004e4a80d0488832fb32a73c4c0c00a0f9fb120eb550460c2e5f4598c1bc23ed15ac284d0f29d2066df735becf778a65b4bbe16e6012bab991ee1281290acbb8ec7fcd1b82530bab9097bd1807cb4c1f65a413b7496d6df18950c3fee4648a5b62039cbc32	d00aab62-c7fa-4ddb-b089-cf3314103079	::1	Mobile Safari	iOS	2025-05-18 19:19:44.25	User
c58a164f4effbacd7f094f7b56cf9a67dc624c985a73e90c5c88598a63f7f4c2f9b52b298175823b9161c70cd69050053cc23475366ff03462d1e6dc771666b82bf3891c1883835eef30998e94ef16fdf665ae60193235f02723884958e960575190c873acf1a257b906a0678b8d5cf866095ed648c9d454aacc9796e7c004f3	d00aab62-c7fa-4ddb-b089-cf3314103079	::1	Chrome	Windows	2025-06-07 18:52:12.836	User
0ca3562af3f5a0dfe66037a73d1f55bb381d26269f5a37755511f31db725f0b154188e239cbc5d7f4df98e40b383bc4aeee4e2bc51acc40bd114caa1205a35196e00bb74c2ce47d7995180fe0b833ebcd3e32329dfbcae7280616336d5216fd0a859f7091c01e842ad4afe9a3f302f3692487c8516036533cb270be9571e9603	4f4a03de-b77d-4ef6-8870-91e031c9794b	::1	Edge	Windows	2025-06-30 19:57:36.891	Company
c3db4324a5e4c5e08d4de4f490c49116ea53d44e0eaaa8766b476ce05a9ac3727a53fb63fac7ebfaf6d90b06b0d9800b46beab842adfedf876a12f65d8d3e3e2fac6c7b9ba61b1af2fe9d43f26383a8701833337ee7578563afff1a69242b00a54b71e5bf6617a29081bead37d56bdfa17d595c0e856d2ecf71ca250a996b03c	d00aab62-c7fa-4ddb-b089-cf3314103079	::1	Edge	Windows	2025-05-24 23:06:09.352	User
86b204716742634c92cda1e1ecaedfff8627942734d562d960b9ee935502f6a19ff66f04cc37550abc831d4ce52462f458f27999bdd3096e95436d643a7dfb1269a7410a2ad4fd6b5bb9df8e90943571b46c9027549ecce55f18a8dacc6b5d0df6f98e94a22d67b37732fc622d7b3f86fffd057177f18341e032cae09659e9b7	d00aab62-c7fa-4ddb-b089-cf3314103079	::1	Edge	Windows	2025-05-25 17:21:42.092	User
aead491d0bec8217d2edf64c738406963dfe587600dbf9dc0d2cd0ce34c83a2be261776b2bbfb100bcdb0d3dcb31e07dd9feae4c9cdad94605930901958ed6743f1175f0c618889085cda17f3333627512749b2a3e96c4475bd2422ca316c22c83b3b2bb81265e2b3866d22e740d8c126e3145cc48b27e849d30d18dada10423	1e764457-d773-4678-b8b4-b2bec770cff8	::ffff:172.18.0.1	Edge	Windows	2025-07-02 22:20:26.14	User
d0ac86122544da43d1393ec00bdb4ef5bfbac48720202dfe43fc13b255beb51a24226de9522ee6bcae7eaeb9b6b19f1d2c2d80ffb5618a83acea511df73763461a80cd26968bba707b5b7fe024e599923c65f089ed28bf3d44234088d987f293043d9a60931fa0cbe285b62a176fd4d1fa974a65a200ee94936b2c13ce199d4c	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d	172.18.0.1	Edge	iOS	2025-07-04 20:07:23.268	User
21447deb04113db24481ad5fa2a5498ba6164130811b2bd61267b72e12b3c5f6e45838a5d62ca5e109052f50d8d10dfb2c316119fc48c71ad7357f1c3f3c7ee2eac6bc346a44517feb89ae959bd471245063400dfc94430e268eb6fb056427c0a252e6f97b3c5b5624831fa29005ca091f6f87fa0ec2c48f128a4d048dbaca9f	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d	172.18.0.1	Edge	iOS	2025-07-04 20:14:17.668	User
bb0bb4c1bd392a0e824261ca5d1ff602188e308fe1fb9a9d333a21c6b7dd64f20f7fe33ab873f1d5f4c5843dd5925431af27c393ee8c0deb3ea9f5ee09105773d1b0ef37a06c8a3eb106bcba7aed320474c7f515061cf2f0ea649b842663108add81a07c2765bbb029969494993345653aeaad4a4c10dee06b0612caae59b675	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d	172.18.0.1	Edge	Windows	2025-07-05 14:06:53.56	User
e7b0019638aa37fea4a2e8bc6bc3172b22f33ac2512763ec1573f58c60f3478170cb3c27ed012cfd44f961ee7503d4863ce9dbb2e93e82972cd1ef9395117ba96d2451e3f3eecf7be2fae24973e7af458f587175546e9846fb98dae9840aaeaa8ca8a9ff4acc91a95b0726cb11c610860dbc7a168b834ed4d3f621bad7e5ee63	d00aab62-c7fa-4ddb-b089-cf3314103079	154.177.7.22	Chrome	Windows	2025-07-05 21:54:40.567	User
f55d6235f422fddf78315ed98374577eb910a5e127ce75cbc751118b5e1d4b7af9296e7311e7e868cbe30ff6dc84ab458e29bdd900ba08f749f65e989332cfc89e48ac2a98a4d1d293cceeb8c7250ac9719494684b8827f2d64527082444369b5a4e22e495887d0c1d03622031e75ad0ff31117d6a0dd6ad282904130caba40a	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d	197.42.182.195	Edge	Windows	2025-07-07 12:57:00.081	User
74a6bf35944bc4eee6ea81022446925132e980b34c0987deb6731553cd1a528f80e4590d1a1b854e2adc8351120bfa8d601d352613bc4617cf7fda22d393e3046b19e382c0f075226f0f0e6427891eaacfaf72930f06ba591898f2985b50c17e108a60a1c635c4712ceede508c8af6b46cd4faf69712de359bf496b6cfcfcfde	d00aab62-c7fa-4ddb-b089-cf3314103079	154.177.7.22	Chrome	Windows	2025-07-08 23:20:51.656	User
\.


--
-- Data for Name: Report; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Report" (id, "reporterId", "postId", reason, description, "createdAt") FROM stdin;
\.


--
-- Data for Name: ReportedUser; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."ReportedUser" (id, "reporterId", "reportedId", reason, "createdAt") FROM stdin;
\.


--
-- Data for Name: Repost; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Repost" (id, "accountId", "postId", "createdAt") FROM stdin;
\.


--
-- Data for Name: SocialMedia; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."SocialMedia" (id, platform, url, "userId") FROM stdin;
f137d608-b904-4afe-8e21-85d19bff8d8d	LinkedIn	eewr	d00aab62-c7fa-4ddb-b089-cf3314103079
ca19b216-a7a4-4624-8229-dac9f3f99d9d	LinkedIn	https://www.linkedin.com/in/omar-eid-0b34b894/	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
177c15c0-22dd-46ca-af19-143ec7965597	LinkedIn	https://www.linkedin.com/in/yahia-eid-54099b243/	e2545be9-ba82-493f-995c-35fd623c0023
2335d35f-4614-44db-aa01-f299ec3cff07	LinkedIn	https://www.linkedin.com/in/omar-eid-0b34b894/	fbd660c7-70b4-49ea-aaf5-2ed5a1fd1509
\.


--
-- Data for Name: StartupExperience; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."StartupExperience" (id, "startupName", role, description, "userId", "endDate", "startDate") FROM stdin;
f2736787-7552-4dfb-b5c6-3355620195c3	Unikorn	Founder	Building the next Linkedin for startups tailored for founders and investors	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96	\N	\N
9100faa7-02c2-40c7-bcd8-f70615fbba75	Amazon	intern		d00aab62-c7fa-4ddb-b089-cf3314103079	2025-05-31 00:00:00	2025-05-01 00:00:00
\.


--
-- Data for Name: TokenBlacklist; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."TokenBlacklist" (token, expire) FROM stdin;
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Transaction" (id, "transactionType", amount, date, description, "accountId") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."User" (id, name, description, title, tier, "isInvestor") FROM stdin;
1e764457-d773-4678-b8b4-b2bec770cff8	yahia		Mr	Standard	f
d00aab62-c7fa-4ddb-b089-cf3314103079	hazem	hazem beeh	Mr	Standard	f
104882528212962824733	Omar Eid		Mr	Standard	f
37e4a3cf-a4ed-4de7-a70e-56162f5d2f96	Omar Eid	Across dynamic roles in leading tech environments, I've took part in driving innovative product development and ensuring top-notch quality. This journey has included spearheading projects with global impact, harnessing customer insights, and implementing agile methodologies for optimal tool performance. Within my master’s in engineering, I've worked on optimizing hardware for advanced neural networks used in computer vision. Throughout, my strengths lie in strategic problem-solving, adaptability, and a visionary approach to technology-driven challenges.	Mr	Standard	f
dbbadcf2-15ab-401b-963f-2de15c435223	testbug6		Mr	Standard	f
8915c4c2-aaea-48b7-8d06-a4cfae44e405	landingPageTest1		Mr	Standard	f
749ad485-f0f7-4f8b-800a-cc789bd99145	Test	 asdasdasdas asd asd	Mr	Standard	f
84526fc6-4d42-4db8-be8c-e8557626cf0e	landingPageTest1		Mr	Standard	t
93b7ce6b-0cf5-4ce5-adf2-e2bdd0805add	landingPageTest1		Mr	Standard	t
891b3b44-bc82-4318-9ce1-d1a2e71c74ff	hazem		Mr	Standard	t
00dc7237-4101-4b02-ab98-666f14f470d3	hazem2	hello	Mr	Standard	t
fa21cbc0-9e0d-48fc-9397-489f8ac6cd89	Launch1		Mr	Standard	f
540da992-d325-45af-8389-a39a274f0a62	Lol		Mr	Standard	t
fdc3e205-6f5f-4a23-a7e6-0cfc5576106d	seif	df	Mr	Standard	f
e2545be9-ba82-493f-995c-35fd623c0023	Unikorn		Mr	Standard	t
737e7c84-1552-499f-a441-6ad567fb9702	Unikorn1		Mr	Standard	t
fbd660c7-70b4-49ea-aaf5-2ed5a1fd1509	Omar Eid	Angel Investor	Mr	Standard	t
\.


--
-- Data for Name: Wallet; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public."Wallet" (id, amount, "onHold", "accountId") FROM stdin;
28965a4b-82d6-402c-918c-ff33bece496b	0.000000000000000000000000000000	0.000000000000000000000000000000	1e764457-d773-4678-b8b4-b2bec770cff8
8e501031-a098-4c04-a5c3-23c8ca16aff5	0.000000000000000000000000000000	0.000000000000000000000000000000	4f4a03de-b77d-4ef6-8870-91e031c9794b
f94ff8a2-e453-4b0f-b733-80ce1f80df8e	0.000000000000000000000000000000	0.000000000000000000000000000000	d00aab62-c7fa-4ddb-b089-cf3314103079
952361c2-f3ca-4c80-880a-a02b506cbbbf	0.000000000000000000000000000000	0.000000000000000000000000000000	104882528212962824733
b4199a77-3d38-4334-99e3-ef2f42f6aa23	0.000000000000000000000000000000	0.000000000000000000000000000000	5d146ae1-4011-4e30-9903-83f7b77f9e65
0f361f16-955f-4ec4-a39e-750e6916c0da	91000.000000000000000000000000000000	9000.000000000000000000000000000000	82e393ec-6cce-421a-9ca7-7e8886b20072
ac2a9678-28a0-43b4-bf7b-357ba5caa6e5	5000.000000000000000000000000000000	5000.000000000000000000000000000000	37e4a3cf-a4ed-4de7-a70e-56162f5d2f96
6f3c3725-22d1-462f-81a3-5dab2b7e3ec4	0.000000000000000000000000000000	0.000000000000000000000000000000	dbbadcf2-15ab-401b-963f-2de15c435223
d49da197-0d1f-4141-b692-8d6205a3c540	0.000000000000000000000000000000	0.000000000000000000000000000000	29a03804-7b61-4cd0-bc80-227c883938b3
ba5c7626-3d55-4b5c-89b3-3338d32f5c57	0.000000000000000000000000000000	0.000000000000000000000000000000	8915c4c2-aaea-48b7-8d06-a4cfae44e405
9e477bee-455b-48dd-89c9-a5c3deb7c5e8	0.000000000000000000000000000000	0.000000000000000000000000000000	c0de3210-92ba-4e15-98da-138a7b63593f
40eff3c9-fa22-457d-b28d-659a6386d68d	0.000000000000000000000000000000	0.000000000000000000000000000000	2ba0a40f-4bf0-4f34-abf8-14867575122c
d0b2d13c-569e-4033-8f50-24d449220bea	0.000000000000000000000000000000	0.000000000000000000000000000000	749ad485-f0f7-4f8b-800a-cc789bd99145
a01220d5-3756-461f-b2ac-5bbbc73bdbf2	0.000000000000000000000000000000	0.000000000000000000000000000000	84526fc6-4d42-4db8-be8c-e8557626cf0e
566bf174-a09b-43df-a27a-e5d9252a64af	0.000000000000000000000000000000	0.000000000000000000000000000000	4231c0c0-f885-4c12-b86d-ab94e8873264
1ca45856-fe74-4f5a-a34a-24340678814f	0.000000000000000000000000000000	0.000000000000000000000000000000	93b7ce6b-0cf5-4ce5-adf2-e2bdd0805add
d6e2f261-4fc3-49bb-ba69-f6156ee74874	0.000000000000000000000000000000	0.000000000000000000000000000000	891b3b44-bc82-4318-9ce1-d1a2e71c74ff
3b149eee-f6c0-4aa6-8296-0644b6fa39aa	0.000000000000000000000000000000	0.000000000000000000000000000000	00dc7237-4101-4b02-ab98-666f14f470d3
c91dad4f-aed9-4cfc-ac5f-3951717dc14a	0.000000000000000000000000000000	0.000000000000000000000000000000	fa21cbc0-9e0d-48fc-9397-489f8ac6cd89
ec1aebc7-f2a0-4983-9cda-d89908de2904	0.000000000000000000000000000000	0.000000000000000000000000000000	540da992-d325-45af-8389-a39a274f0a62
db5171ba-04ad-4f85-8b30-e674029c329e	9995000.000000000000000000000000000000	5000.000000000000000000000000000000	fdc3e205-6f5f-4a23-a7e6-0cfc5576106d
0c8801df-cab3-4940-bca9-8dddc0c1be02	0.000000000000000000000000000000	0.000000000000000000000000000000	e2545be9-ba82-493f-995c-35fd623c0023
0cfe6533-3a14-4689-b8a9-c7089aa79677	0.000000000000000000000000000000	0.000000000000000000000000000000	f428572f-845b-4ccc-8c97-8005d78bfa06
cbb18f7d-a573-4f24-90e2-217881e87753	0.000000000000000000000000000000	0.000000000000000000000000000000	737e7c84-1552-499f-a441-6ad567fb9702
6b4fa636-5f89-46de-b31e-82a86c06cee8	0.000000000000000000000000000000	0.000000000000000000000000000000	b50b3ea0-4334-48d1-af1a-4f15f676053a
7e657ed1-0748-476e-98e9-4e998ac187c8	0.000000000000000000000000000000	0.000000000000000000000000000000	fbd660c7-70b4-49ea-aaf5-2ed5a1fd1509
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: unikorn_ir21_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
ce2f7b5c-b47e-4ba4-8955-6562fa443b82	6ca07f02be0bd311439f6b7a18aa9835cd22c251f0908aaa5a53e23af6f6c242	2025-04-22 18:28:55.946148+00	20250422182853_schema_generation	\N	\N	2025-04-22 18:28:54.507167+00	1
b93aa231-de43-4507-8cc2-46275ba756ac	5986f4f2a2c0a78625142c58e5f775dcc2b9e93c1064b842bd299b9e93c8dfbc	2025-05-28 19:12:33.474186+00	20250528191232_added_start_end_date_to_start_up_exp_and_education_field_of_study	\N	\N	2025-05-28 19:12:33.11964+00	1
f760a652-21cf-43b5-af7b-f964086b2833	3fe5dc0e2c92d6f84649b3d8b2f9e09a8e23dbd8d7f730903087b4cd221b1e09	2025-04-22 18:47:18.573663+00	20250422184717_	\N	\N	2025-04-22 18:47:18.14152+00	1
dba82a61-0dab-4f86-a4c6-d588d79a720d	10369b32dd4401a34b7f6e31d9fbf66d58c8fbf6ba6f3aaa9dab9f2727c0740e	2025-04-28 22:34:04.363342+00	20250428223403_changedtablesinchatusingaccountidtousername	\N	\N	2025-04-28 22:34:04.018427+00	1
cfd9e323-d47d-4c28-b85c-b95dfc7702bc	620f2329dfb9807859fcc01634a8f984120687d85bcf14f9fe9a88389c824b90	2025-05-02 18:32:49.567485+00	20250502183248_file_tables_combined	\N	\N	2025-05-02 18:32:49.223116+00	1
3a8ba42e-66d4-44ff-89f3-7bfb54f96206	d92189affd29732be514d1fea3cfa0c49ea7324ba5cb25d2dcd5ce2a54e6d13d	2025-05-05 14:37:27.202469+00	20250505143726_company_size_attribute	\N	\N	2025-05-05 14:37:27.099597+00	1
455529c6-b6f8-4a72-8830-99adaa004e79	a8d4fb4b6c906b60861ab7402b0f152e009aff3d5d89674b66eb326a97687504	2025-05-05 14:52:59.740218+00	20250505145259_minor_range_update_in_company_size	\N	\N	2025-05-05 14:52:59.62483+00	1
6c008435-777a-4bdc-8637-0e16178a66c9	305864a01dbe81cfc148970b731aa424640720ba3cc2319097b5b283ccb49c85	2025-06-23 18:49:55.836127+00	20250623184955_added_types_to_user_and_company	\N	\N	2025-06-23 18:49:55.518494+00	1
76d44396-8d42-46ee-b51b-38ab177091a4	4806fdb350b66bd7aef73e41e3b36ab2ddb356f69a9252393e884c6a4a452871	2025-05-10 22:36:54.40873+00	20250510223653_funding_round_and_chat_edit	\N	\N	2025-05-10 22:36:54.077529+00	1
68cf5b1d-e530-403a-ae06-6ce25f71c724	0b20610b1b4be969da6a98e8fcd2cd944f517d9d783cea26013ff0fd7068227b	2025-05-13 16:41:21.009718+00	20250513164120_investor_enum	\N	\N	2025-05-13 16:41:20.905709+00	1
2cd69c12-d5cb-40bf-9b98-7cc6c39b3063	05b6c5557f5109eeeae1917a48078b572918bcdaceae0bd7a95d75a600c4efc5	2025-05-16 15:47:47.3639+00	20250516154746_posts	\N	\N	2025-05-16 15:47:47.041848+00	1
1086f8e9-865e-4af6-8752-78b5c099784d	472e98f53cc2baff215bb18f703b45b367e59049c81f255537da380fb642018b	\N	20250517200349_posts_db_modified	\N	2025-05-17 20:17:15.27733+00	2025-05-17 20:03:49.512966+00	0
092c78e5-2fb3-4ac9-9695-a13a23fe71a7	e5bb3ed9d406d3bc243dbb9242a70e7e6b28eb1cc2864a98cefabaa5f29b63d5	2025-06-24 11:43:39.588498+00	20250624114338_add_is_investor_to_user	\N	\N	2025-06-24 11:43:39.256573+00	1
76d29082-ca8c-465b-a60c-741139617699	472e98f53cc2baff215bb18f703b45b367e59049c81f255537da380fb642018b	2025-05-17 20:17:48.044042+00	20250517200349_posts_db_modified	\N	\N	2025-05-17 20:17:47.122779+00	1
d4f56044-9d85-4726-8dc0-6a257f407e13	1ff7ce5ede9c6dd5996a95888f7335e6430e98203a11088d00e463a787b860f5	2025-05-24 19:26:32.439201+00	20250524192631_changed_relationship_of_funding_post_to_raising_funds	\N	\N	2025-05-24 19:26:31.978775+00	1
f21c8455-c6e9-465e-b24f-8c87137478a2	3abe3467d8d0c7af961c17e82de9b68b8ea8355d8e98ea89234643be0d52fb1c	2025-05-28 17:22:35.191411+00	20250528172234_added_google_id_column	\N	\N	2025-05-28 17:22:34.860204+00	1
b8b1b1a8-d282-44d5-8298-09f720e87f47	d5d258cd366a91c0613bb280919c853f435eb0cc0be2d3bec5bdd8d4221a62ca	2025-06-24 11:45:52.559732+00	20250624114551_remove_user_type_enum	\N	\N	2025-06-24 11:45:52.241157+00	1
f0f884d4-2622-455c-9614-93c8e779d699	c238f074a3e50e5c51b05e579170cd94ad5422c31c2cd57caed9ac32f343bf65	2025-06-24 11:55:02.566197+00	20250624115501_add_is_investor_to_company	\N	\N	2025-06-24 11:55:01.789548+00	1
\.


--
-- Name: BlacklistedPasswordToken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: unikorn_ir21_user
--

SELECT pg_catalog.setval('public."BlacklistedPasswordToken_id_seq"', 5, true);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Activity Activity_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_pkey" PRIMARY KEY (id);


--
-- Name: Attachment Attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_pkey" PRIMARY KEY (id);


--
-- Name: BlacklistedPasswordToken BlacklistedPasswordToken_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."BlacklistedPasswordToken"
    ADD CONSTRAINT "BlacklistedPasswordToken_pkey" PRIMARY KEY (id);


--
-- Name: BlockedUser BlockedUser_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."BlockedUser"
    ADD CONSTRAINT "BlockedUser_pkey" PRIMARY KEY (id);


--
-- Name: CalendlyIntegration CalendlyIntegration_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."CalendlyIntegration"
    ADD CONSTRAINT "CalendlyIntegration_pkey" PRIMARY KEY (id);


--
-- Name: CertificationsCourses CertificationsCourses_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."CertificationsCourses"
    ADD CONSTRAINT "CertificationsCourses_pkey" PRIMARY KEY (id);


--
-- Name: ChatParticipant ChatParticipant_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."ChatParticipant"
    ADD CONSTRAINT "ChatParticipant_pkey" PRIMARY KEY (id);


--
-- Name: Chat Chat_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Company Company_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_pkey" PRIMARY KEY (id);


--
-- Name: CorporateExperience CorporateExperience_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."CorporateExperience"
    ADD CONSTRAINT "CorporateExperience_pkey" PRIMARY KEY (id);


--
-- Name: Document Document_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_pkey" PRIMARY KEY (id);


--
-- Name: Education Education_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Education"
    ADD CONSTRAINT "Education_pkey" PRIMARY KEY (id);


--
-- Name: Entry Entry_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Entry"
    ADD CONSTRAINT "Entry_pkey" PRIMARY KEY (id);


--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: Expertise Expertise_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Expertise"
    ADD CONSTRAINT "Expertise_pkey" PRIMARY KEY (id);


--
-- Name: File File_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_pkey" PRIMARY KEY (id);


--
-- Name: Financial Financial_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Financial"
    ADD CONSTRAINT "Financial_pkey" PRIMARY KEY (id);


--
-- Name: Follow Follow_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_pkey" PRIMARY KEY (id);


--
-- Name: FriendRequest FriendRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_pkey" PRIMARY KEY (id);


--
-- Name: FundingRound FundingRound_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."FundingRound"
    ADD CONSTRAINT "FundingRound_pkey" PRIMARY KEY (id);


--
-- Name: Fundraiser Fundraiser_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Fundraiser"
    ADD CONSTRAINT "Fundraiser_pkey" PRIMARY KEY (id);


--
-- Name: Interest Interest_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Interest"
    ADD CONSTRAINT "Interest_pkey" PRIMARY KEY (id);


--
-- Name: InvestmentOffer InvestmentOffer_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."InvestmentOffer"
    ADD CONSTRAINT "InvestmentOffer_pkey" PRIMARY KEY (id);


--
-- Name: Journal Journal_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Journal"
    ADD CONSTRAINT "Journal_pkey" PRIMARY KEY (id);


--
-- Name: Language Language_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Language"
    ADD CONSTRAINT "Language_pkey" PRIMARY KEY (id);


--
-- Name: LedgerAccount LedgerAccount_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."LedgerAccount"
    ADD CONSTRAINT "LedgerAccount_pkey" PRIMARY KEY (id);


--
-- Name: Like Like_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_pkey" PRIMARY KEY (id);


--
-- Name: LoginDevices LoginDevices_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."LoginDevices"
    ADD CONSTRAINT "LoginDevices_pkey" PRIMARY KEY (id);


--
-- Name: Media Media_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Media"
    ADD CONSTRAINT "Media_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Personnel Personnel_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Personnel"
    ADD CONSTRAINT "Personnel_pkey" PRIMARY KEY (id);


--
-- Name: PollOption PollOption_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."PollOption"
    ADD CONSTRAINT "PollOption_pkey" PRIMARY KEY (id);


--
-- Name: PollVote PollVote_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."PollVote"
    ADD CONSTRAINT "PollVote_pkey" PRIMARY KEY (id);


--
-- Name: Poll Poll_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Poll"
    ADD CONSTRAINT "Poll_pkey" PRIMARY KEY (id);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: ProductInformation ProductInformation_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."ProductInformation"
    ADD CONSTRAINT "ProductInformation_pkey" PRIMARY KEY (id);


--
-- Name: RaisingFunds RaisingFunds_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."RaisingFunds"
    ADD CONSTRAINT "RaisingFunds_pkey" PRIMARY KEY (id);


--
-- Name: ReadReceipt ReadReceipt_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."ReadReceipt"
    ADD CONSTRAINT "ReadReceipt_pkey" PRIMARY KEY (id);


--
-- Name: RefreshTokenValid RefreshTokenValid_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."RefreshTokenValid"
    ADD CONSTRAINT "RefreshTokenValid_pkey" PRIMARY KEY (sid);


--
-- Name: Report Report_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_pkey" PRIMARY KEY (id);


--
-- Name: ReportedUser ReportedUser_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."ReportedUser"
    ADD CONSTRAINT "ReportedUser_pkey" PRIMARY KEY (id);


--
-- Name: Repost Repost_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Repost"
    ADD CONSTRAINT "Repost_pkey" PRIMARY KEY (id);


--
-- Name: SocialMedia SocialMedia_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."SocialMedia"
    ADD CONSTRAINT "SocialMedia_pkey" PRIMARY KEY (id);


--
-- Name: StartupExperience StartupExperience_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."StartupExperience"
    ADD CONSTRAINT "StartupExperience_pkey" PRIMARY KEY (id);


--
-- Name: TokenBlacklist TokenBlacklist_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."TokenBlacklist"
    ADD CONSTRAINT "TokenBlacklist_pkey" PRIMARY KEY (token);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Wallet Wallet_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Wallet"
    ADD CONSTRAINT "Wallet_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_email_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "Account_email_key" ON public."Account" USING btree (email);


--
-- Name: Account_googleId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "Account_googleId_key" ON public."Account" USING btree ("googleId");


--
-- Name: Account_id_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "Account_id_idx" ON public."Account" USING btree (id);


--
-- Name: Account_id_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "Account_id_key" ON public."Account" USING btree (id);


--
-- Name: Account_mobileNumber_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "Account_mobileNumber_key" ON public."Account" USING btree ("mobileNumber");


--
-- Name: Account_username_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "Account_username_idx" ON public."Account" USING btree (username);


--
-- Name: Account_username_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "Account_username_key" ON public."Account" USING btree (username);


--
-- Name: Attachment_messageId_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "Attachment_messageId_idx" ON public."Attachment" USING btree ("messageId");


--
-- Name: BlacklistedPasswordToken_jti_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "BlacklistedPasswordToken_jti_key" ON public."BlacklistedPasswordToken" USING btree (jti);


--
-- Name: BlockedUser_blockedId_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "BlockedUser_blockedId_idx" ON public."BlockedUser" USING btree ("blockedId");


--
-- Name: BlockedUser_blockerId_blockedId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "BlockedUser_blockerId_blockedId_key" ON public."BlockedUser" USING btree ("blockerId", "blockedId");


--
-- Name: BlockedUser_blockerId_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "BlockedUser_blockerId_idx" ON public."BlockedUser" USING btree ("blockerId");


--
-- Name: CalendlyIntegration_userId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "CalendlyIntegration_userId_key" ON public."CalendlyIntegration" USING btree ("userId");


--
-- Name: ChatParticipant_chatId_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "ChatParticipant_chatId_idx" ON public."ChatParticipant" USING btree ("chatId");


--
-- Name: ChatParticipant_username_chatId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "ChatParticipant_username_chatId_key" ON public."ChatParticipant" USING btree (username, "chatId");


--
-- Name: ChatParticipant_username_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "ChatParticipant_username_idx" ON public."ChatParticipant" USING btree (username);


--
-- Name: Company_id_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "Company_id_key" ON public."Company" USING btree (id);


--
-- Name: Document_postId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "Document_postId_key" ON public."Document" USING btree ("postId");


--
-- Name: Event_postId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "Event_postId_key" ON public."Event" USING btree ("postId");


--
-- Name: File_fileName_accountId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "File_fileName_accountId_key" ON public."File" USING btree ("fileName", "accountId");


--
-- Name: Financial_companyId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "Financial_companyId_key" ON public."Financial" USING btree ("companyId");


--
-- Name: FriendRequest_receiverId_status_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "FriendRequest_receiverId_status_idx" ON public."FriendRequest" USING btree ("receiverId", status);


--
-- Name: FriendRequest_senderId_receiverId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "FriendRequest_senderId_receiverId_key" ON public."FriendRequest" USING btree ("senderId", "receiverId");


--
-- Name: FriendRequest_senderId_status_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "FriendRequest_senderId_status_idx" ON public."FriendRequest" USING btree ("senderId", status);


--
-- Name: Fundraiser_raisingFundsId_investorUserId_investorCompanyId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "Fundraiser_raisingFundsId_investorUserId_investorCompanyId_key" ON public."Fundraiser" USING btree ("raisingFundsId", "investorUserId", "investorCompanyId");


--
-- Name: Journal_name_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "Journal_name_key" ON public."Journal" USING btree (name);


--
-- Name: Journal_raisingFundsId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "Journal_raisingFundsId_key" ON public."Journal" USING btree ("raisingFundsId");


--
-- Name: LedgerAccount_accountId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "LedgerAccount_accountId_key" ON public."LedgerAccount" USING btree ("accountId");


--
-- Name: Like_accountId_postId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "Like_accountId_postId_key" ON public."Like" USING btree ("accountId", "postId");


--
-- Name: LoginDevices_ip_browser_os_accountId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "LoginDevices_ip_browser_os_accountId_key" ON public."LoginDevices" USING btree (ip, browser, os, "accountId");


--
-- Name: Message_chatId_createdAt_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "Message_chatId_createdAt_idx" ON public."Message" USING btree ("chatId", "createdAt" DESC);


--
-- Name: Message_senderId_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "Message_senderId_idx" ON public."Message" USING btree ("senderId");


--
-- Name: PollOption_id_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "PollOption_id_idx" ON public."PollOption" USING btree (id);


--
-- Name: PollVote_accountId_optionId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "PollVote_accountId_optionId_key" ON public."PollVote" USING btree ("accountId", "optionId");


--
-- Name: PollVote_accountId_pollId_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "PollVote_accountId_pollId_idx" ON public."PollVote" USING btree ("accountId", "pollId");


--
-- Name: Poll_id_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "Poll_id_idx" ON public."Poll" USING btree (id);


--
-- Name: Poll_postId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "Poll_postId_key" ON public."Poll" USING btree ("postId");


--
-- Name: Post_createdAt_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "Post_createdAt_idx" ON public."Post" USING btree ("createdAt");


--
-- Name: Post_id_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "Post_id_idx" ON public."Post" USING btree (id);


--
-- Name: Post_type_createdAt_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "Post_type_createdAt_idx" ON public."Post" USING btree (type, "createdAt");


--
-- Name: RaisingFunds_envelopeId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "RaisingFunds_envelopeId_key" ON public."RaisingFunds" USING btree ("envelopeId");


--
-- Name: ReadReceipt_messageId_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "ReadReceipt_messageId_idx" ON public."ReadReceipt" USING btree ("messageId");


--
-- Name: ReadReceipt_messageId_username_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "ReadReceipt_messageId_username_key" ON public."ReadReceipt" USING btree ("messageId", username);


--
-- Name: ReadReceipt_username_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "ReadReceipt_username_idx" ON public."ReadReceipt" USING btree (username);


--
-- Name: ReportedUser_reportedId_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "ReportedUser_reportedId_idx" ON public."ReportedUser" USING btree ("reportedId");


--
-- Name: ReportedUser_reporterId_idx; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE INDEX "ReportedUser_reporterId_idx" ON public."ReportedUser" USING btree ("reporterId");


--
-- Name: Repost_accountId_postId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "Repost_accountId_postId_key" ON public."Repost" USING btree ("accountId", "postId");


--
-- Name: User_id_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "User_id_key" ON public."User" USING btree (id);


--
-- Name: Wallet_accountId_key; Type: INDEX; Schema: public; Owner: unikorn_ir21_user
--

CREATE UNIQUE INDEX "Wallet_accountId_key" ON public."Wallet" USING btree ("accountId");


--
-- Name: Activity Activity_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Attachment Attachment_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public."Message"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BlockedUser BlockedUser_blockedId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."BlockedUser"
    ADD CONSTRAINT "BlockedUser_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES public."Account"(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BlockedUser BlockedUser_blockerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."BlockedUser"
    ADD CONSTRAINT "BlockedUser_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES public."Account"(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CalendlyIntegration CalendlyIntegration_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."CalendlyIntegration"
    ADD CONSTRAINT "CalendlyIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CertificationsCourses CertificationsCourses_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."CertificationsCourses"
    ADD CONSTRAINT "CertificationsCourses_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatParticipant ChatParticipant_chatId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."ChatParticipant"
    ADD CONSTRAINT "ChatParticipant_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES public."Chat"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatParticipant ChatParticipant_lastReadMessageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."ChatParticipant"
    ADD CONSTRAINT "ChatParticipant_lastReadMessageId_fkey" FOREIGN KEY ("lastReadMessageId") REFERENCES public."Message"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ChatParticipant ChatParticipant_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."ChatParticipant"
    ADD CONSTRAINT "ChatParticipant_username_fkey" FOREIGN KEY (username) REFERENCES public."Account"(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Company Company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_id_fkey" FOREIGN KEY (id) REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CorporateExperience CorporateExperience_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."CorporateExperience"
    ADD CONSTRAINT "CorporateExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Document Document_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Education Education_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Education"
    ADD CONSTRAINT "Education_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Entry Entry_journalId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Entry"
    ADD CONSTRAINT "Entry_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES public."Journal"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Entry Entry_ledgerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Entry"
    ADD CONSTRAINT "Entry_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES public."LedgerAccount"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Entry Entry_transactionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Entry"
    ADD CONSTRAINT "Entry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES public."Transaction"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Event Event_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Expertise Expertise_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Expertise"
    ADD CONSTRAINT "Expertise_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: File File_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Financial Financial_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Financial"
    ADD CONSTRAINT "Financial_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Follow Follow_followerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Follow Follow_followingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Follow"
    ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FriendRequest FriendRequest_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."Account"(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FriendRequest FriendRequest_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."Account"(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FundingRound FundingRound_financialId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."FundingRound"
    ADD CONSTRAINT "FundingRound_financialId_fkey" FOREIGN KEY ("financialId") REFERENCES public."Financial"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FundingRound FundingRound_raisingFundsId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."FundingRound"
    ADD CONSTRAINT "FundingRound_raisingFundsId_fkey" FOREIGN KEY ("raisingFundsId") REFERENCES public."RaisingFunds"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Fundraiser Fundraiser_investorCompanyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Fundraiser"
    ADD CONSTRAINT "Fundraiser_investorCompanyId_fkey" FOREIGN KEY ("investorCompanyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Fundraiser Fundraiser_investorUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Fundraiser"
    ADD CONSTRAINT "Fundraiser_investorUserId_fkey" FOREIGN KEY ("investorUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Fundraiser Fundraiser_raisingFundsId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Fundraiser"
    ADD CONSTRAINT "Fundraiser_raisingFundsId_fkey" FOREIGN KEY ("raisingFundsId") REFERENCES public."RaisingFunds"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Interest Interest_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Interest"
    ADD CONSTRAINT "Interest_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InvestmentOffer InvestmentOffer_investorCompanyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."InvestmentOffer"
    ADD CONSTRAINT "InvestmentOffer_investorCompanyId_fkey" FOREIGN KEY ("investorCompanyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: InvestmentOffer InvestmentOffer_investorUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."InvestmentOffer"
    ADD CONSTRAINT "InvestmentOffer_investorUserId_fkey" FOREIGN KEY ("investorUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InvestmentOffer InvestmentOffer_raisingFundsId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."InvestmentOffer"
    ADD CONSTRAINT "InvestmentOffer_raisingFundsId_fkey" FOREIGN KEY ("raisingFundsId") REFERENCES public."RaisingFunds"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Journal Journal_raisingFundsId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Journal"
    ADD CONSTRAINT "Journal_raisingFundsId_fkey" FOREIGN KEY ("raisingFundsId") REFERENCES public."RaisingFunds"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Language Language_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Language"
    ADD CONSTRAINT "Language_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LedgerAccount LedgerAccount_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."LedgerAccount"
    ADD CONSTRAINT "LedgerAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Like Like_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Like Like_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LoginDevices LoginDevices_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."LoginDevices"
    ADD CONSTRAINT "LoginDevices_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Media Media_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Media"
    ADD CONSTRAINT "Media_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_chatId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES public."Chat"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."Account"(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Personnel Personnel_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Personnel"
    ADD CONSTRAINT "Personnel_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Personnel Personnel_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Personnel"
    ADD CONSTRAINT "Personnel_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PollOption PollOption_pollId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."PollOption"
    ADD CONSTRAINT "PollOption_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES public."Poll"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PollVote PollVote_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."PollVote"
    ADD CONSTRAINT "PollVote_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PollVote PollVote_optionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."PollVote"
    ADD CONSTRAINT "PollVote_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES public."PollOption"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PollVote PollVote_pollId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."PollVote"
    ADD CONSTRAINT "PollVote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES public."Poll"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Poll Poll_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Poll"
    ADD CONSTRAINT "Poll_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Post Post_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Post Post_roundId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES public."RaisingFunds"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ProductInformation ProductInformation_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."ProductInformation"
    ADD CONSTRAINT "ProductInformation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RaisingFunds RaisingFunds_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."RaisingFunds"
    ADD CONSTRAINT "RaisingFunds_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReadReceipt ReadReceipt_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."ReadReceipt"
    ADD CONSTRAINT "ReadReceipt_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public."Message"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ReadReceipt ReadReceipt_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."ReadReceipt"
    ADD CONSTRAINT "ReadReceipt_username_fkey" FOREIGN KEY (username) REFERENCES public."Account"(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Report Report_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Report Report_reporterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReportedUser ReportedUser_reportedId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."ReportedUser"
    ADD CONSTRAINT "ReportedUser_reportedId_fkey" FOREIGN KEY ("reportedId") REFERENCES public."Account"(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ReportedUser ReportedUser_reporterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."ReportedUser"
    ADD CONSTRAINT "ReportedUser_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES public."Account"(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Repost Repost_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Repost"
    ADD CONSTRAINT "Repost_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Repost Repost_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Repost"
    ADD CONSTRAINT "Repost_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SocialMedia SocialMedia_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."SocialMedia"
    ADD CONSTRAINT "SocialMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StartupExperience StartupExperience_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."StartupExperience"
    ADD CONSTRAINT "StartupExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Transaction Transaction_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_id_fkey" FOREIGN KEY (id) REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Wallet Wallet_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: unikorn_ir21_user
--

ALTER TABLE ONLY public."Wallet"
    ADD CONSTRAINT "Wallet_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO unikorn_ir21_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO unikorn_ir21_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO unikorn_ir21_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO unikorn_ir21_user;


--
-- PostgreSQL database dump complete
--

