-- AlterTable
ALTER TABLE "RegistrationRequest" ADD COLUMN     "codigoEstadal" TEXT,
ADD COLUMN     "nivelCuenta" TEXT NOT NULL DEFAULT 'municipal',
ALTER COLUMN "municipio" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "codigoEstadal" TEXT,
ADD COLUMN     "cuentaEstadalId" INTEGER,
ADD COLUMN     "nivelCuenta" TEXT NOT NULL DEFAULT 'municipal';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cuentaEstadalId_fkey" FOREIGN KEY ("cuentaEstadalId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
