import prisma from "../db.js";

export async function walletDeposit(){
    await prisma.$transaction(async (prisma) => {
        await prisma
    })
}