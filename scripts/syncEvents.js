import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente manualmente
const envDev = dotenv.config({ path: '.env' }).parsed;
const envProd = dotenv.config({ path: '.env.production' }).parsed;

// Conexões separadas
const devDb = new PrismaClient({
  datasources: {
    db: { url: envDev.DATABASE_URL },
  },
});

const prodDb = new PrismaClient({
  datasources: {
    db: { url: envProd.DATABASE_URL },
  },
});

async function syncUniqueEvents(fromDb, toDb, label) {
  const eventos = await fromDb.events.findMany();
  let inseridos = 0;
  let ignorados = 0;

  for (const evento of eventos) {
    const existente = await toDb.events.findFirst({
      where: { titulo: evento.titulo },
    });

    if (existente) {
      console.log(`⚠️ Evento ignorado: título "${evento.titulo}" já existe no destino.`);
      ignorados++;
      continue;
    }

    await toDb.events.create({
      data: {
        titulo: evento.titulo,
        descricao: evento.descricao,
        dataIni: evento.dataIni,
        dataFim: evento.dataFim,
        local: evento.local,
        imagem: evento.imagem,
      },
    });
    console.log(`✅ Inserido: ${evento.titulo}`);
    inseridos++;
  }

  console.log(`\n🎯 Resultado de ${label}:
  ➕ Inseridos: ${inseridos}
  ⛔ Ignorados (título duplicado): ${ignorados}\n`);

  await fromDb.$disconnect();
  await toDb.$disconnect();
}

const mode = process.argv[2];

if (mode === 'dev-to-prod') {
  syncUniqueEvents(devDb, prodDb, 'development → production');
} else if (mode === 'prod-to-dev') {
  syncUniqueEvents(prodDb, devDb, 'production → development');
} else {
  console.error('❌ Use: node scripts/syncEvents.js dev-to-prod ou prod-to-dev');
}
