-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'user',
    "cargo" TEXT NOT NULL,
    "cedula" INTEGER NOT NULL,
    "telefono" INTEGER NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "informacionPreliminar" TEXT,
    "estado" TEXT,
    "municipio" TEXT,
    "parroquia" TEXT,
    "cuadranteDePaz" TEXT,
    "urbanizacion" TEXT,
    "calle" TEXT,
    "casa" TEXT,
    "barrioSector" TEXT,
    "vereda" TEXT,
    "apto" TEXT,
    "avenida" TEXT,
    "usoEstructura" TEXT,
    "otrosUsoEstructura" TEXT,
    "latitud" TEXT,
    "longitud" TEXT,
    "cota" TEXT,
    "este" TEXT,
    "norte" TEXT,
    "huso" TEXT,
    "tipoEvento" TEXT,
    "horaEvento" TEXT,
    "apellidosJefe" TEXT,
    "nombresJefe" TEXT,
    "telefonoJefe" TEXT,
    "condicionVivienda" TEXT,
    "otrosCondicionVivienda" TEXT,
    "viasAcceso" TEXT[],
    "otrosViasAcceso" TEXT,
    "condicionAcceso" TEXT,
    "otrosCondicionAcceso" TEXT,
    "jefeFamilia" TEXT,
    "edadJefe" TEXT,
    "sexoJefe" TEXT,
    "cedulaJefe" TEXT,
    "tallaC" TEXT,
    "tallaP" TEXT,
    "tallaZ" TEXT,
    "telefonoJefeFamilia" TEXT,
    "patologiasJefe" TEXT,
    "viviendaSolidaria" BOOLEAN NOT NULL DEFAULT false,
    "albergue" BOOLEAN NOT NULL DEFAULT false,
    "telefonoContactoAlbergue" TEXT,
    "direccionAlbergue" TEXT,
    "nombreResponsableAlbergue" TEXT,
    "cedulaResponsableAlbergue" TEXT,
    "materialesConstruccion" TEXT[],
    "otrosMaterialesConstruccion" TEXT,
    "afectacionesNoEstructurales" TEXT[],
    "otrosNoEstructurales" TEXT,
    "afectacionesEstructuralesColapso" TEXT[],
    "otrosEstructuralesColapso" TEXT,
    "afectacionesParciales" TEXT[],
    "otrosAfectacionesParciales" TEXT,
    "perdidasEnseres" TEXT[],
    "otrosPerdidasEnseres" TEXT,
    "lineasVitalesAfectadas" TEXT[],
    "otrosLineasVitalesAfectadas" TEXT,
    "observaciones" TEXT,
    "nombreEvaluado" TEXT,
    "cedulaEvaluado" TEXT,
    "telefonoEvaluado" TEXT,
    "nombreEvaluador" TEXT,
    "cedulaEvaluador" TEXT,
    "telefonoEvaluador" TEXT,
    "firmaEvaluado" TEXT,
    "firmaEvaluador" TEXT,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrupoFamiliar" (
    "id" TEXT NOT NULL,
    "evaluacionId" INTEGER NOT NULL,
    "apellidosNombres" TEXT,
    "cedula" TEXT,
    "edad" TEXT,
    "sexo" TEXT,
    "parentesco" TEXT,
    "tallaC" TEXT,
    "tallaP" TEXT,
    "tallaZ" TEXT,
    "patologias" TEXT,

    CONSTRAINT "GrupoFamiliar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cedula_key" ON "User"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "User_telefono_key" ON "User"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_userId_key" ON "Evaluation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GrupoFamiliar_evaluacionId_key" ON "GrupoFamiliar"("evaluacionId");

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrupoFamiliar" ADD CONSTRAINT "GrupoFamiliar_evaluacionId_fkey" FOREIGN KEY ("evaluacionId") REFERENCES "Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
