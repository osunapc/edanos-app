-- CreateTable
CREATE TABLE "RegistrationRequest" (
    "id" TEXT NOT NULL,
    "nombreInstitucion" TEXT NOT NULL,
    "tipoInstitucion" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombreResponsable" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "cartaFormalUrl" TEXT NOT NULL,
    "estadoSolicitud" TEXT NOT NULL DEFAULT 'pending',
    "motivoRechazo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" INTEGER,
    "usuarioCreadoId" INTEGER,

    CONSTRAINT "RegistrationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationRequest_cedula_key" ON "RegistrationRequest"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationRequest_email_key" ON "RegistrationRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationRequest_usuarioCreadoId_key" ON "RegistrationRequest"("usuarioCreadoId");

-- AddForeignKey
ALTER TABLE "RegistrationRequest" ADD CONSTRAINT "RegistrationRequest_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationRequest" ADD CONSTRAINT "RegistrationRequest_usuarioCreadoId_fkey" FOREIGN KEY ("usuarioCreadoId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
