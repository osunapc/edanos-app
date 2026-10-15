-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "eventoId" INTEGER;

-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipoEvento" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "municipios" TEXT[],
    "estadoEvento" TEXT NOT NULL DEFAULT 'activo',
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaCierre" TIMESTAMP(3),
    "fechaArchivado" TIMESTAMP(3),
    "creadoPor" INTEGER NOT NULL,
    "cerradoPor" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Evento_estadoEvento_idx" ON "Evento"("estadoEvento");

-- CreateIndex
CREATE INDEX "Evento_estado_idx" ON "Evento"("estado");

-- CreateIndex
CREATE INDEX "Evento_fechaInicio_idx" ON "Evento"("fechaInicio");

-- CreateIndex
CREATE INDEX "Evaluation_eventoId_idx" ON "Evaluation"("eventoId");

-- CreateIndex
CREATE INDEX "Evaluation_estado_municipio_idx" ON "Evaluation"("estado", "municipio");

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_creadoPor_fkey" FOREIGN KEY ("creadoPor") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_cerradoPor_fkey" FOREIGN KEY ("cerradoPor") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
