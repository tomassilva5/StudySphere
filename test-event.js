const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const user = await prisma.utilizador.findFirst();
    console.log('User found:', user ? user.email : 'No user');
    
    if (user) {
      const event = await prisma.evento.create({
        data: {
          titulo: 'Teste CLI',
          descricao: 'Teste via linha de comandos',
          data_inicio: new Date(),
          data_fim: new Date(Date.now() + 3600000),
          e_virtual: false,
          prioridade: 'MEDIA',
          categoria: 'Estudo_Individual',
          estado: 'agendado',
          utilizador_id: user.id
        }
      });
      console.log('Event created successfully:', JSON.stringify(event, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
})();
