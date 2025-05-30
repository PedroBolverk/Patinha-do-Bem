-- CreateTable
CREATE TABLE "Participacao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Participacao" ADD CONSTRAINT "Participacao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
