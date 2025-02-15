import prisma from "../db.js";

export async function walletDeposit(depositAmount, account){
    await prisma.$transaction(async (prisma) => {
        await prisma
    })
}