const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    // Buscar primeiro usuário
    const user = await prisma.utilizador.findFirst();
    console.log('User found:', user ? user.nome_utilizador : 'No user');
    
    if (!user) {
      console.log('Nenhum usuário encontrado na base de dados');
      return;
    }

    // Criar grupo com o usuário como membro
    const grupo = await prisma.grupo.create({
      data: {
        nome: 'Projeto III - CLI',
        descricao: 'Grupo criado via linha de comandos',
        membros: {
          create: [
            {
              utilizador: {
                connect: { id: user.id }
              }
            }
          ]
        }
      },
      include: {
        membros: {
          select: {
            utilizador: {
              select: {
                id: true,
                nome_utilizador: true,
                email: true
              }
            }
          }
        }
      }
    });

    console.log('Grupo criado com sucesso:');
    console.log(JSON.stringify(grupo, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
})();
