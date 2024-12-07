import prisma from "../db.js";

export const createCertificationsCourses = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    const certificationsCourses = await prisma.certifications_Courses.create({
      data: {
        title: req.body.title,
        institution: req.body.institution,
        completion_date: req.body.completion_date,
        focus_area: req.body.focus_area,
        user: {
          connect: { id: userId },
        },
      },
    });
    res.status(200).json({ data: certificationsCourses });
  } catch (error) {
    res.status(400);
  }
};

export const getAllCertificationsCourses = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.body.id,
      },
      include: {
        certifications_courses: true,
      },
    });
    res.status(200).json({ data: user.certifications_courses });
  } catch (error) {
    res.status(200);
  }
};

export const getOneCertificationsCourses = async (req, res) => {
  try {
    const id = req.body.id;
    const CertificationsCourses = await prisma.certifications_Courses.findFirst(
      {
        where: {
          id,
          userId: req.boy.userId,
        },
      },
    );
    res.status(200).json({ data: CertificationsCourses });
  } catch (error) {
    res.status(200);
  }
};

export const deleteCertificationsCourses = async (req, res) => {
  try {
    const deleted = await prisma.certifications_Courses.delete({
      where: {
        id_userId: {
          id: req.body.id,
          userId: req.user.id,
        },
      },
    });
    res.status(200).json({ data: deleted });
  } catch (error) {
    res.status(400);
  }
};
