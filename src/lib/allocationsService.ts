import { supabase } from './supabase';
import type { Allocation } from './scheduling'; // Ajuste o tipo conforme seu modelo exato

/**
 * Por que: Centralizamos as requisições em um serviço focado (Service Pattern)
 * para separar as responsabilidades, mantendo os componentes de interface do usuário 
 * enxutos e simplificando implementações futuras de testes unitários.
 */

export async function deleteAllocation(id: string): Promise<{ error: Error | null }> {
  try {
    // Por que: Utilização do try/catch para garantir que falhas de rede ou do banco
    // sejam devidamente interceptadas sem quebrar a execução geral da UI.
    const { error } = await supabase
      .from('allocations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (err) {
    // Por que: Ocultamos a mensagem crua do banco de dados para mitigar o vazamento 
    // de dados sensíveis sobre a infraestrutura (Tabelas, esquemas, etc).
    console.error('Falha interna ao tentar excluir alocação:', err);
    return { error: new Error('Não foi possível excluir a alocação. Verifique a conexão e tente novamente.') };
  }
}

export async function getAllocations(semester?: string): Promise<{ data: Allocation[] | null; error: Error | null }> {
  try {
    let query = supabase.from('allocations').select('*');

    // Por que: A filtragem opcional pelo banco de dados poupa processamento no lado cliente e 
    // economiza banda de internet, provendo dados enxutos focados na visão atual de semestre.
    if (semester) {
      query = query.eq('semester', semester);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { data: data as Allocation[], error: null };
  } catch (err) {
    console.error('Falha interna ao buscar alocações:', err);
    return { data: null, error: new Error('Erro ao carregar os dados de alocação. Tente recarregar a página.') };
  }
}