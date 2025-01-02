import prisma from "../db.js";
import NodeMailer from "nodemailer";
import jwt from "jsonwebtoken";
import { comparePasswords } from "./auth.js";
import { hashPassword } from "./auth.js";
import { createJWT } from "./auth.js";

export const createCompany = async (req, res) => {
  try {
    const companyData = req.body.formData;
    console.log(companyData);
    const hashedPassword = await hashPassword(companyData.password);
    const newCompany = await prisma.company_Profile.create({
      data: {
        name: companyData.name,
        username: companyData.username,
        email: companyData.email,
        password: hashedPassword,
        description: companyData.description,
        website: companyData.website,
        founded: new Date(companyData.founded),
        type: companyData.type || "Public",
        hqlocation: companyData.hqlocation,
        industry: companyData.industry,
        hunter: companyData.hunter || false,
        board_members: companyData.board_members || [],
        advisors: companyData.advisors || [],
      },
    });
    res.status(200).json({
      message: "Company created successfully",
      company: newCompany,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error creating company" });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await prisma.company_Profile.findMany();
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error fetching companies" });
  }
};

export const getCompany = async (req, res) => {
  try {
    const { companyId } = req.body;

    const company = await prisma.company_Profile.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error fetching company" });
  }
};

export const deleteAllCompanies = async (req, res) => {
  try {
    await prisma.company_Profile.deleteMany();
    res.status(200).json({ message: "All companies deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error deleting companies" });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    await prisma.founder.deleteMany({
      where: { companyId: req.body.companyId },
    });
    await prisma.key_Employees.deleteMany({
      where: { companyId: req.body.companyId },
    });
    const deletedCompany = await prisma.company_Profile.delete({
      where: { id: req.body.companyId },
    });
    res.status(200).json({
      message: "Company deleted successfully",
      company: deletedCompany,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error deleting company" });
  }
};

export const isCurrentCompany = async (req, res) => {
  let isCurrentCompany = false;
  try {
    const company = await prisma.company_Profile.findUnique({
      where: {
        username: req.query.username,
      },
    });
    if (
      req.cookies.companyId &&
      company.id &&
      req.cookies.companyId == company.id
    ) {
      isCurrentCompany = true;
    }
    res.status(200).json({ company, isCurrentCompany });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error fetching company" });
  }
};

export const getOneCompanyProfile = async (req, res) => {
  try {
    const company = await prisma.company_Profile.findUnique({
      where: {
        username: req.query.username,
      },
    });
    const { id, password, email, ...safeCompany } = company;
    res.status(200).json({ safeCompany });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Error fetching company" });
  }
};
